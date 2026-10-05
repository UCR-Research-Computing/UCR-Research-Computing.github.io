---
title: "Distributed PyTorch training with Kubeflow Trainer"
topic: Cloud
owner: Research Computing
reviewed: 2026-10-04
redirect_from:
  - /Knowledge_Base/how-to-distributed-pytorch-training-with-kubeflow-trainer.html
review_notes:
  - "Updated the steps to Kubeflow Trainer v2 and the current Kubeflow Python SDK (pip install kubeflow, TrainerClient().train with CustomTrainer, get_job_logs, wait_for_job_status); the old create_job, stream_logs and get_job_status calls and the kubeflow/pytorch-dist-example image do not exist in the current SDK."
  - "Fixed the training function (NCCL backend on GPUs, dataset downloaded once per node before training) and installed the built-in runtimes, which the torch-distributed runtime needs."
  - "Added where to run this at UCR: a local kind cluster, the HPCC for Slurm-based distributed training, or GKE in a lab's own Ursa Major project as Tier 2 recharge. Removed marketing wording."
  - "CHECK: Kubeflow Trainer v2.1.0 is used as the example release (the install guide's example); the latest release on GitHub was v2.3.0 on 2026-10-04."
  - "CHECK: the code was compared with the Kubeflow SDK source and docs but not run end to end."
---

Kubeflow Trainer is the Kubeflow component for running distributed training jobs on Kubernetes. You write a PyTorch training function in Python, and Kubeflow Trainer runs copies of it across several pods (nodes), setting up the distributed environment for you. This guide covers a first job: installing the controller, writing a training function and running it from Python.

## Where to run this at UCR

Kubeflow Trainer needs a Kubernetes cluster where you can install the Trainer controller. Common choices:

- **Your own computer:** a local test cluster made with `kind` (Kubernetes in Docker), as shown below. Good for learning and for checking code before scaling up.
- **The HPCC:** if you only need multi-GPU or multi-node PyTorch training and not Kubernetes, the [HPCC](../../services/hpcc/) runs distributed jobs through Slurm. Contact support@hpcc.ucr.edu for guidance.
- **Google Kubernetes Engine (GKE) in your lab's Ursa Major project:** a lab's own GKE cluster, including any GPUs it uses, is a Tier 2 service recharged to a lab funding source under an MOU. See [Ursa Major service tiers](../kb005-ursa-major-service-tiers/) and [how Tier 2 setup works](../kb007-tier2-recharge-workflow/).
- **National platforms:** the [NRP Nautilus](../../services/nautilus/) Kubernetes cluster and [NSF ACCESS](../../services/nsf-access/) are options for some projects. Check each platform's rules before installing cluster-wide controllers.

If you are not sure which fits, contact research-computing@ucr.edu.

## Core concepts

- **Kubernetes:** runs and manages containers across a cluster of machines.
- **Kubeflow Trainer:** a Kubernetes controller that runs distributed training (PyTorch, JAX, DeepSpeed and others) and handles the networking and environment variables each worker needs.
- **TrainJob:** a Kubernetes custom resource that describes one training job: the code, the number of nodes and the resources per node. The Python SDK creates it for you.
- **Training runtime:** a template (for example `torch-distributed`) that defines how a framework is launched. TrainJobs refer to a runtime.

## Step 1: Set up a cluster and the controller

Kubeflow Trainer needs Kubernetes and `kubectl` version 1.31 or later.

### Create a local cluster with kind

Install kind using the [kind quick start](https://kind.sigs.k8s.io/docs/user/quick-start/#installation), then create a cluster:

```bash
kind create cluster
```

### Install the Kubeflow Trainer controller and runtimes

Install a released version of the controller, then the built-in training runtimes. Use the same version for both. Replace the version with the current release listed in the [installation guide](https://www.kubeflow.org/docs/components/trainer/operator-guides/installation/).

```bash
export VERSION=v2.1.0
kubectl apply --server-side -k "https://github.com/kubeflow/trainer.git/manifests/overlays/manager?ref=${VERSION}"
kubectl apply --server-side -k "https://github.com/kubeflow/trainer.git/manifests/overlays/runtimes?ref=${VERSION}"
```

Check that the controller pods are running:

```bash
kubectl get pods -n kubeflow-system
```

The installation guide also describes a Helm-based install.

### Install the Python SDK

```bash
pip install -U kubeflow
```

## Step 2: Write the training function

Kubeflow Trainer runs this function on every node. It sets the distributed environment variables (`RANK`, `WORLD_SIZE`, `LOCAL_RANK` and the rendezvous address), so the function only needs to call `init_process_group`. Put all imports inside the function, because the function is sent to the cluster on its own.

```python
# train_function.py

def train_fashion_mnist():
    """A small distributed training example on the FashionMNIST dataset."""
    import os
    import torch
    import torch.distributed as dist
    from torch.nn.parallel import DistributedDataParallel
    from torch.utils.data import DataLoader, DistributedSampler
    from torchvision import datasets, transforms

    # 1. Initialize the distributed environment.
    # Use NCCL on GPUs and Gloo on CPUs.
    use_cuda = torch.cuda.is_available()
    dist.init_process_group(backend="nccl" if use_cuda else "gloo")
    rank = dist.get_rank()
    world_size = dist.get_world_size()
    local_rank = int(os.environ.get("LOCAL_RANK", 0))
    device = torch.device(f"cuda:{local_rank}" if use_cuda else "cpu")
    print(f"Rank {rank} of {world_size} using {device}")

    # 2. Prepare the dataset. Download once per node, then load everywhere.
    transform = transforms.Compose([
        transforms.ToTensor(),
        transforms.Normalize((0.5,), (0.5,)),
    ])
    if local_rank == 0:
        datasets.FashionMNIST("./data", train=True, download=True)
    dist.barrier()
    dataset = datasets.FashionMNIST("./data", train=True, download=False, transform=transform)
    sampler = DistributedSampler(dataset, num_replicas=world_size, rank=rank)
    train_loader = DataLoader(dataset, batch_size=64, sampler=sampler)

    # 3. Define the model and wrap it with DistributedDataParallel.
    model = torch.nn.Sequential(
        torch.nn.Flatten(),
        torch.nn.Linear(28 * 28, 128),
        torch.nn.ReLU(),
        torch.nn.Linear(128, 10),
    ).to(device)
    if use_cuda:
        model = DistributedDataParallel(model, device_ids=[local_rank])
    else:
        model = DistributedDataParallel(model)

    # 4. Loss function and optimizer.
    criterion = torch.nn.CrossEntropyLoss()
    optimizer = torch.optim.SGD(model.parameters(), lr=0.01)

    # 5. Training loop.
    num_epochs = 3
    model.train()
    for epoch in range(num_epochs):
        sampler.set_epoch(epoch)
        for data, target in train_loader:
            data, target = data.to(device), target.to(device)
            optimizer.zero_grad()
            loss = criterion(model(data), target)
            loss.backward()
            optimizer.step()
        if rank == 0:
            print(f"Epoch {epoch + 1}/{num_epochs} | Loss: {loss.item():.4f}")

    # 6. Clean up.
    dist.barrier()
    if rank == 0:
        print("Training complete")
    dist.destroy_process_group()
```

## Step 3: Create and run the TrainJob

From a separate script or a Jupyter notebook, use `TrainerClient` to send the function to the cluster. The client uses your current `kubectl` context.

```python
# main_launcher.py

from kubeflow.trainer import TrainerClient, CustomTrainer
from train_function import train_fashion_mnist

client = TrainerClient()

# List the runtimes installed on the cluster. You should see torch-distributed.
for r in client.list_runtimes():
    print(f"Runtime: {r.name}")

# Create the TrainJob: 2 nodes, each with 1 CPU core and 2 GiB of memory.
job_id = client.train(
    runtime="torch-distributed",
    trainer=CustomTrainer(
        func=train_fashion_mnist,
        num_nodes=2,
        resources_per_node={
            "cpu": 1,
            "memory": "2Gi",
            # "gpu": 1,  # uncomment if the nodes have GPUs
        },
    ),
)
print(f"Created TrainJob {job_id}")

# Stream the logs from the first node (node-0).
for line in client.get_job_logs(job_id, follow=True):
    print(line)

# Wait for the job to finish (raises an error if it fails or times out).
job = client.wait_for_job_status(job_id, timeout=1800)
print(f"Final status: {job.status}")

# Delete the job when you no longer need its logs.
# client.delete_job(job_id)
```

You can also check the job with `kubectl get trainjobs` and `kubectl get pods`.

## Next steps

- **GPUs:** the nodes need GPUs with drivers and the NVIDIA device plugin installed. Then add `"gpu": 1` to `resources_per_node`. On a cloud cluster, GPU nodes are billed while they run; scale node pools down when you are done.
- **Your own code and packages:** for small additions, `CustomTrainer` accepts `packages_to_install`. For real projects, build a container image with your dependencies, push it to a registry (for example Artifact Registry in your Google Cloud project), and pass it with the `image` argument.
- **Other strategies:** Kubeflow Trainer also supports DeepSpeed, JAX, FSDP-style training and more. See the [Kubeflow Trainer documentation](https://www.kubeflow.org/docs/components/trainer/) and the [Getting Started guide](https://www.kubeflow.org/docs/components/trainer/getting-started/).
