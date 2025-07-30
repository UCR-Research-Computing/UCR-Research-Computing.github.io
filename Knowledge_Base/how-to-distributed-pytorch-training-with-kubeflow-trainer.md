# How-To: Distributed PyTorch Training with Kubeflow Trainer

The official integration of Kubeflow Trainer into the PyTorch ecosystem provides a powerful, Kubernetes-native method for running distributed training jobs. This guide will walk you through the essential steps to get started, from setting up your environment to running and monitoring a distributed PyTorch job.

## 1. Core Concepts: What is Happening?

Instead of running a training script on a single machine, you will package your PyTorch code into a container and tell Kubeflow how to run it across multiple machines (nodes) in a Kubernetes cluster.

- **Kubernetes**: The underlying engine that manages and orchestrates application containers across a cluster of machines.
- **Kubeflow**: A machine learning toolkit for Kubernetes.
- **Kubeflow Trainer**: The specific component that simplifies running distributed training jobs (like for PyTorch, TensorFlow, etc.) on Kubernetes. It handles the complex networking and setup for you.
- **TrainJob**: A custom resource you define in Python. It describes your training job, including the code to run, the number of workers (processes), and the resources (CPU/GPU) they need.

## 2. Prerequisites: Setting Up Your Environment

Before you can run a training job, you need a Kubernetes cluster with the Kubeflow Trainer controller installed. For local development, `kind` (Kubernetes in Docker) is an excellent choice.

### A. Install a Local Kubernetes Cluster (with kind)

If you don't have a cluster, you can create one locally.

1.  **Install kind**: Follow the [official kind installation guide](https://kind.sigs.k8s.io/docs/user/quick-start/#installation).
2.  **Create a cluster**:
    ```bash
    kind create cluster
    ```

### B. Install the Kubeflow Trainer Controller

Apply the controller manifests to your cluster. This installs the necessary components that watch for and manage `TrainJob` resources.

```bash
kubectl apply --server-side -k "https://github.com/kubeflow/trainer.git/manifests/overlays/manager?ref=v2.0.0"
```

### C. Install the Kubeflow Trainer SDK

You'll interact with your cluster using the Python SDK.

```bash
pip install kubeflow-trainer
```

## 3. Running a Distributed PyTorch Job: Step-by-Step

We will now define a simple PyTorch training function and then use the `TrainerClient` to run it as a distributed job on our cluster.

### Step 1: Define Your PyTorch Training Function

This is a standard PyTorch training script. The key is that it's written to be aware of the distributed environment, which Kubeflow Trainer sets up automatically. It uses `torch.distributed` to get the `RANK` and `WORLD_SIZE`.

This function will be executed on each worker pod in the cluster.

**`train_function.py`**
```python
# train_function.py

def train_fashion_mnist():
    """
    A simple distributed training function for the FashionMNIST dataset.
    """
    import os
    import torch
    import torch.distributed as dist
    from torch.nn.parallel import DistributedDataParallel
    from torch.utils.data import DataLoader, DistributedSampler
    from torchvision import datasets, transforms

    # 1. Initialize the distributed environment
    # Kubeflow Trainer automatically sets the necessary environment variables.
    dist.init_process_group(backend="gloo")
    rank = dist.get_rank()
    world_size = dist.get_world_size()
    device_id = int(os.environ.get("LOCAL_RANK", 0))
    device = f"cuda:{device_id}" if torch.cuda.is_available() else "cpu"

    print(f"Starting training on rank {rank} of {world_size} on device {device}.")

    # 2. Prepare the dataset
    transform = transforms.Compose([
        transforms.ToTensor(),
        transforms.Normalize((0.5,), (0.5,))
    ])
    dataset = datasets.FashionMNIST(
        root="./data",
        train=True,
        download=True,
        transform=transform
    )
    sampler = DistributedSampler(dataset, num_replicas=world_size, rank=rank)
    train_loader = DataLoader(dataset, batch_size=64, sampler=sampler)

    # 3. Define the model and wrap with DistributedDataParallel
    model = torch.nn.Sequential(
        torch.nn.Flatten(),
        torch.nn.Linear(28 * 28, 128),
        torch.nn.ReLU(),
        torch.nn.Linear(128, 10)
    ).to(device)

    if torch.cuda.is_available():
        model = DistributedDataParallel(model, device_ids=[device_id])
    else:
        model = DistributedDataParallel(model)


    # 4. Define loss function and optimizer
    criterion = torch.nn.CrossEntropyLoss()
    optimizer = torch.optim.SGD(model.parameters(), lr=0.01)

    # 5. Run the training loop
    model.train()
    for epoch in range(3): # 3 epochs for demonstration
        sampler.set_epoch(epoch)
        for batch_idx, (data, target) in enumerate(train_loader):
            data, target = data.to(device), target.to(device)
            optimizer.zero_grad()
            output = model(data)
            loss = criterion(output, target)
            loss.backward()
            optimizer.step()

        # Only print from the master process (rank 0)
        if rank == 0:
            print(f"Epoch {epoch+1}/{3} | Loss: {loss.item():.4f}")

    # 6. Clean up the distributed environment
    dist.destroy_process_group()

    if rank == 0:
        print("Training complete!")
```

### Step 2: Create and Run the TrainJob

Now, from a separate Python script or a Jupyter Notebook, you use the `TrainerClient` to package and send the `train_fashion_mnist` function to your cluster.

**`main_launcher.py`**
```python
# main_launcher.py

from kubeflow.trainer import TrainerClient
from train_function import train_fashion_mnist # Import the function

# 1. Initialize the TrainerClient
# This client connects to your currently configured Kubernetes cluster (from kubectl).
client = TrainerClient()

# 2. Define the TrainJob
# This specifies what to run and how to run it.
job_name = "pytorch-fashion-mnist-example"

# We use a public container image that has PyTorch and other common libraries.
# For your own projects, you would build and push your own image.
image = "docker.io/kubeflow/pytorch-dist-example:latest"

# Define the job
job = client.create_job(
    name=job_name,
    train_func=train_fashion_mnist,
    base_image=image,
    num_workers=2,  # We'll run the training across 2 pods (workers)
    resources_per_worker={
        "cpu": "1",         # Request 1 CPU core per worker
        "memory": "2Gi"     # Request 2Gi of memory per worker
        # For GPUs, you would add: "gpu": "1"
    }
)

print(f"TrainJob '{job.name}' created. Status: {job.status}")

# 3. Monitor the Job
print("\nStreaming logs:")
client.stream_logs(job_name)

# 4. Check the Final Status and Clean Up
job_status = client.get_job_status(job_name)
print(f"\nFinal job status: {job_status}")

if job_status == "Succeeded":
    print("Job completed successfully!")
else:
    print("Job failed or is in an unknown state.")

# 5. (Optional) Delete the job
# client.delete_job(job_name)
# print(f"Job '{job_name}' deleted.")
```

## 4. Practical Usage & Next Steps

-   **Using GPUs**: To use GPUs, your Kubernetes nodes must have GPUs available and the appropriate drivers installed. Then, simply add `"gpu": "1"` to the `resources_per_worker` dictionary.
-   **Custom Code and Docker Images**: The `base_image` is key. For real projects, you will need to:
    1.  Write your Python script(s).
    2.  Create a `Dockerfile` that installs your dependencies (`pip install -r requirements.txt`) and copies your code into the image.
    3.  Build the Docker image.
    4.  Push the image to a container registry (like Docker Hub, Google Container Registry, etc.).
    5.  Use that image path in your `create_job` call.
-   **Advanced Strategies**: The Kubeflow Trainer is deeply integrated with the PyTorch ecosystem, supporting advanced distributed strategies like Fully Sharded Data Parallel (FSDP) and integrations with libraries like DeepSpeed and HuggingFace.

This new integration significantly lowers the barrier to entry for serious, scalable machine learning development with PyTorch on modern cloud infrastructure.