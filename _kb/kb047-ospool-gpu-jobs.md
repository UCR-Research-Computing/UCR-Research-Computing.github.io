---
title: "GPU jobs on the OSPool"
kb_id: KB047
topic: National
description: "Request GPUs in HTCondor submit files, specify capability and VRAM requirements, run containerized PyTorch or TensorFlow, and scale across distributed GPUs."
audience: "UCR researchers and students who want to run CUDA-accelerated batch jobs on the OSPool"
reviewed: 2026-11-05
owner: Research Computing
series: ospool
series_order: 5
review_notes:
  - "Written 2026-11-05 from OSG documentation (portal.osg-htc.org/documentation/htc_workloads/specific_resource/gpu-jobs/) and ap40 test runs."
  - "Tested 2026-11-05 on ap40 by RC: 1-GPU PyTorch 2.3.1 container job (gpu_test.sub, gpu_test.py) on a Quadro RTX 6000 at Notre Dame; CUDA matmul 4096x4096 ran in 0.012 s vs CPU 0.841 s (~70x speedup); total run time ~1.5 min after ~1 min queue wait."
  - "CHECK: submit file requirement variations (gpus_minimum_capability, gpus_minimum_memory) and alternative CVMFS image paths are from OSG documentation and were not individually submitted by RC."
---

The Open Science Pool (OSPool) provides opportunistic access to Graphics Processing Units (GPUs) contributed by universities and research facilities across the United States. If your calculations rely on NVIDIA CUDA, PyTorch, TensorFlow, JAX, or GPU-accelerated simulation packages, you can submit batches of independent GPU jobs through HTCondor.

This guide explains how OSPool GPU scheduling works, how to request GPUs and set hardware filters, how to run GPU containers provided over CVMFS, and how to interpret real benchmark results.

The OSPool is **Non-sensitive only (P1; no protected data)**. If your data is protected, [ask Research Computing](../../help/) where it can go before you start.

---

## 1. When GPUs help (and when they do not)

A GPU is designed for massive data-parallel arithmetic. It accelerates workloads where thousands of matrix or tensor operations occur concurrently. GPUs can provide substantial speedups for:

- Deep learning model training and batch inference (PyTorch, TensorFlow);
- Molecular dynamics and structure prediction (AMBER, GROMACS, AlphaFold);
- GPU-accelerated Monte Carlo calculations;
- Image processing and computer vision pipelines;
- Linear algebra routines explicitly linked against cuBLAS, cuDNN, or CUDA runtime libraries.

GPUs do **not** accelerate general CPU programs. If your code is written in standard Python, R, or C++ without CUDA bindings or GPU runtime support, requesting a GPU wastes scarce resources and substantially lengthens your queue wait times. For general compute tasks, submit standard CPU jobs as described in [Submitting OSPool jobs and getting results](../kb037-ospool-jobs-and-results/).

---

## 2. The OSPool GPU pool: a dynamic snapshot

The OSPool aggregates spare GPU capacity from institutions nationwide. Because contributor clusters join and leave dynamically, pool composition changes from day to day and depends on contributed capacity.

The following table reflects a snapshot of GPU worker nodes observed via `condor_status` on access point `ap40` on 2026-11-05 (about 120 GPUs on 65 machines at around twenty contributing sites):

| GPU model | Memory per GPU | GPUs seen | Machines |
| :--- | :--- | :--- | :--- |
| Quadro RTX 6000 | 24 GB | 30 | 15 |
| NVIDIA RTX A5000 | 24 GB | 20 | 5 |
| NVIDIA A40 | 48 GB | 12 | 3 |
| NVIDIA GeForce RTX 3060 | 12 GB | 8 | 2 |
| Tesla V100 (16 GB and 32 GB) | 16 or 32 GB | 11 | 9 |
| Tesla P4 | 8 GB | 6 | 6 |
| NVIDIA H100 (80 GB HBM3, PCIe, 94 GB NVL) | 80 to 94 GB | 6 | 3 |
| NVIDIA L40 and L40S | 48 GB | 5 | 4 |
| NVIDIA GeForce RTX 3090 | 24 GB | 5 | 5 |
| NVIDIA A100 80GB | 80 GB | 4 | 4 |
| Tesla T4 | 16 GB | 4 | 4 |
| NVIDIA GeForce RTX 2080 Ti | 11 GB | 3 | 3 |
| NVIDIA RTX PRO 6000 Blackwell | 96 GB | 3 | 3 |
| NVIDIA GeForce GTX 1080 Ti | 11 GB | 1 | 1 |
| NVIDIA H100 MIG slice (1g.10gb) | 10 GB | a few | 1 |

These are counts of GPUs present, busy or idle, at one moment. Most were already running other people's jobs. Treat the table as a picture of the kind of hardware you may land on, not a list of what you can reserve.

Some sites split an H100 into Multi-Instance GPU (MIG) slices such as `1g.10gb`, a small fraction of the card with 10 GB of memory. A plain `request_gpus = 1` job can land on one. If your job needs more GPU memory than that, set `gpus_minimum_memory` (section 4).

---

## 3. Requesting a GPU in HTCondor

To allocate a GPU to your job, add `request_gpus = 1` to your submit file.

A basic GPU resource block looks like this:

```
request_gpus   = 1
request_cpus   = 1
request_memory = 4GB
request_disk   = 4GB
+JobDurationCategory = "Medium"
```

Keep your CPU and system memory requests proportional. Requesting 1 GPU alongside 32 CPUs or 128 GB of RAM severely restricts which worker nodes can accept your job. Asking for 1 or 2 CPU cores and a few GB of memory per GPU keeps the most machines eligible.

The `+JobDurationCategory` attribute is required on OSG-managed access points. Use `"Medium"` for jobs expected to finish in less than 10 hours (maximum allowed duration 20 hours), or `"Long"` for jobs expected to run between 10 and 20 hours (maximum allowed duration 40 hours).

---

## 4. Targeting specific GPU capabilities or memory

By default, `request_gpus = 1` matches any GPU in the pool, from an 8 GB Tesla P4 to an 80 GB A100. If your software requires modern tensor cores, a minimum CUDA compute capability, or a specific amount of VRAM, HTCondor provides attributes to filter candidate hosts.

### Compute capability (`gpus_minimum_capability`)

NVIDIA designates each hardware generation by a Compute Capability version number (for example, Volta is 7.0, Ampere is 8.0 or 8.6, and Hopper is 9.0). This value measures architectural features, not the CUDA software library version.

To require an Ampere-generation GPU or newer:

```
gpus_minimum_capability = 8.0
```

To restrict your job strictly to a specific architecture generation (for example, Volta only):

```
gpus_minimum_capability = 7.0
gpus_maximum_capability = 7.0
```

The following table summarizes compute capabilities for common GPU models documented by OSG:

| GPU Model | Compute Capability | Device Memory |
| :--- | :--- | :--- |
| Tesla V100 | 7.0 | 16 GB (or 32 GB) |
| GeForce RTX 2080 Ti | 7.5 | 11 GB |
| A100 | 8.0 | 40 GB or 80 GB |
| A10 | 8.6 | 22 GB |
| GeForce RTX 3090 | 8.6 | 24 GB |
| GeForce RTX 4090 | 8.9 | 24 GB |

### GPU device memory (`gpus_minimum_memory`)

If your model or dataset requires substantial onboard VRAM, specify the threshold using `gpus_minimum_memory`. In HTCondor, this attribute expects an integer in **megabytes (MB)**:

```
# Request a GPU with at least 20 GB of VRAM (20,000 MB)
gpus_minimum_memory = 20000

# Request a GPU with at least 40 GB of VRAM (40,000 MB)
gpus_minimum_memory = 40000
```

### The minimal requirement principle

Every constraint you add reduces the pool of eligible machines. In the 2026-11-05 snapshot, `request_gpus = 1` could match any of the 65 GPU machines, while `gpus_minimum_memory = 40000` narrowed that to 17. Fewer eligible machines usually means a longer wait. Whenever possible, set minimal requirements or none at all.

---

## 5. Walkthrough: A tested PyTorch GPU container job

The simplest way to run GPU work on the OSPool is inside an OSG-provided container served directly from the CernVM File System (CVMFS). Because CVMFS is mounted across OSPool compute nodes, you do not need to upload or transfer large container images.

The following test script and submit file were verified by Research Computing on access point `ap40`.

### The Python benchmark script (`gpu_test.py`)

Save the following file in your home directory on the access point:

```python
#!/usr/bin/env python3
# OSPool GPU smoke test: report the GPU, then time a matrix multiply on GPU vs CPU.
import socket, time, torch
print("host:", socket.gethostname())
print("torch", torch.__version__, "cuda available:", torch.cuda.is_available())
if torch.cuda.is_available():
    print("gpu:", torch.cuda.get_device_name(0))
def bench(dev, n=4096, reps=5):
    a = torch.randn(n, n, device=dev); b = torch.randn(n, n, device=dev)
    (a @ b); torch.cuda.synchronize() if dev == "cuda" else None
    t = time.time()
    for _ in range(reps): c = a @ b
    if dev == "cuda": torch.cuda.synchronize()
    return (time.time() - t) / reps
cpu = bench("cpu", reps=2); print(f"cpu matmul 4096: {cpu:.3f} s")
if torch.cuda.is_available():
    gpu = bench("cuda"); print(f"gpu matmul 4096: {gpu:.4f} s  speedup x{cpu/gpu:.0f}")
```

Make the script executable:

```bash
chmod +x gpu_test.py
```

### The submit file (`gpu_test.sub`)

Save the submit file next to `gpu_test.py`:

```
# One GPU job inside OSG's PyTorch container (served from CVMFS; nothing to upload)
container_image = /cvmfs/singularity.opensciencegrid.org/htc/pytorch:2.3.1-cuda11.8
executable      = gpu_test.py
output          = gpu_test.out
error           = gpu_test.err
log             = gpu_test.log
+JobDurationCategory = "Medium"
request_gpus    = 1
request_cpus    = 1
request_memory  = 4GB
request_disk    = 4GB
queue 1
```

Notice key details:
- `container_image`: Points to an OSG-maintained PyTorch image on CVMFS with PyTorch 2.3.1 built for CUDA 11.8. The GPU driver comes from the machine; the CUDA libraries come from the image.
- `+JobDurationCategory = "Medium"`: Labels the expected job runtime.
- `log = gpu_test.log`: Must reside inside your home directory.

### Submitting and reviewing results

Submit the job to HTCondor:

```bash
condor_submit gpu_test.sub
```

Check queue status:

```bash
condor_q
```

During our test run on `ap40`, the job waited in queue for approximately 1 minute, executed for approximately 1.5 minutes on a remote worker node, and completed with exit code 0.

Inspecting `gpu_test.out` revealed:

```
host: qa-rtx6k-029.crc.nd.edu
torch 2.3.1 cuda available: True
gpu: Quadro RTX 6000
cpu matmul 4096: 0.841 s
gpu matmul 4096: 0.0121 s  speedup x70
```

The job matched a Quadro RTX 6000 GPU at the University of Notre Dame. PyTorch recognized CUDA acceleration immediately, and the 4096x4096 matrix multiplication executed in 0.012 seconds on the GPU compared to 0.841 seconds on the CPU (a 70x speedup). HTCondor recorded about 733 MB of memory used, well under the 4 GB requested.

---

## 6. Provided GPU container images on CVMFS

You do not need to build custom software environments if your work uses standard scientific stacks. The OSG maintains pre-built Apptainer images on CVMFS with CUDA runtimes and machine learning frameworks configured:

- **PyTorch:**
  `/cvmfs/singularity.opensciencegrid.org/htc/pytorch:2.3.1-cuda11.8`
- **TensorFlow:**
  `/cvmfs/singularity.opensciencegrid.org/htc/tensorflow:2.15`
- **Base CUDA environments:**
  `/cvmfs/singularity.opensciencegrid.org/htc/rocky:9-cuda-12.6.0`
  `/cvmfs/singularity.opensciencegrid.org/htc/rocky:8-cuda-11.0.3`

Refer to the [OSG Available Containers List](https://portal.osg-htc.org/documentation/htc_workloads/using_software/available-containers-list/) for additional maintained container paths.

To use any of these images, set `container_image` in your submit file to the absolute CVMFS path. CVMFS delivers image layers to worker nodes on demand and caches them locally.

---

## 7. Bringing your own GPU container

If your project requires specific Python packages, custom compiled CUDA extensions, or proprietary libraries, you can create a custom Apptainer image (`.sif`).

Follow these guidelines when preparing custom GPU containers:

1. **Base image:** Start from an official NVIDIA CUDA base image (such as `nvidia/cuda:12.4.1-runtime-ubuntu22.04`) or install GPU-enabled wheels inside a clean Linux container.
2. **Match CUDA versions:** Verify that the CUDA runtime bundled with your framework (e.g. PyTorch) matches the CUDA capabilities of target GPUs.
3. **Build for `linux/amd64`:** OSPool compute nodes run x86_64 architecture. If you build images on an Apple Silicon Mac, specify `--platform linux/amd64` during container compilation.
4. **Stage via OSDF:** Do not transfer `.sif` files using standard HTCondor file transfer. Store your `.sif` file in `/ospool/apNN/data/YOUR_OSG_USERNAME/` and reference it with an OSDF URL:
   ```
   container_image = osdf:///ospool/ap40/data/YOUR_OSG_USERNAME/my-gpu-image-v1.sif
   ```
   Always increment filename versions (`v1`, `v2`) because OSDF edge caches retain objects by filename.

For a complete walkthrough of building portable containers using automated tools, see [Containerize your research software with an AI coding agent](../kb049-containerize-your-research/).

---

## 8. Best practices for OSPool GPU workloads

### Test small, then scale up

Always test your pipeline with 1 to 5 jobs first. Verify that CUDA is detected, memory consumption matches your submit file requests, and output files return intact.

Once verified, submit your larger batch. Contributed GPU capacity on the OSPool is dynamic: OSG facilitators note that several contributor clusters spin up GPU execution points only when active demand is detected in the central queue. Submitting a substantial batch of jobs pulls additional GPU capacity into the pool.

### Checkpoint long training loops

Individual OSPool jobs should complete in less than 20 hours. Contributed nodes can experience preemption or hardware reclamation at any time.

For multi-hour training routines:
- Save model checkpoints to disk periodically (e.g. at the end of every epoch).
- Write checkpoint files to your working directory or remap them to your OSDF storage space.
- Write your script so that it checks for an existing checkpoint upon startup and resumes training automatically.

Detailed checkpointing strategies are documented in the [OSG Checkpointing Guide](https://portal.osg-htc.org/documentation/htc_workloads/checkpointing-on-OSPool/).

---

## 9. When to use Nautilus, Jetstream2, or the HPCC instead

The OSPool is designed for high-throughput single-GPU batch processing of non-sensitive data. Other platforms may be a better fit depending on your technical requirements:

| If your workload needs | Recommended platform | Why |
| :--- | :--- | :--- |
| Multi-GPU distributed training (PyTorch DDP, FSDP, Ray) | [NRP Nautilus](../kb026-nautilus-batch-jobs-and-gpus/) | Kubernetes pods can request several GPUs; shared CephFS storage |
| Interactive Jupyter notebooks, Coder IDE, or web dashboards | [NRP Nautilus](../kb025-nautilus-jupyter-and-coder/) or [HPCC](../../services/hpcc/) | OSPool jobs are batch only |
| Persistent GPU virtual machines, root access, or custom OS drivers | [Jetstream2 GPU VMs](../kb044-jetstream2-gpu-vms/) | Dedicated virtual machines with full administrative control |
| Protected data (P2 to P4) | [Ask Research Computing](../../help/) | Where protected data can go depends on its level and any agreements |
| Slurm scheduling, direct lab storage mounts, or traditional HPC | [HPCC cluster](../../services/hpcc/) | UCR's campus cluster; see the HPCC site for its hardware and software |

---

## 10. Getting help

- **Research Computing:** we can help you decide whether your work fits and look over your first submit file. [Contact us](../../help/).
- **OSG Facilitators:** The OSG facilitation team provides direct support for OSPool job troubleshooting at [support@osg-htc.org](mailto:support@osg-htc.org).
- **OSG Office Hours:** OSG facilitators host virtual office hours every Tuesday from 4:00 PM to 5:30 PM Eastern Time. Connection details are available at the [OSG Office Hours Zoom Link](https://osg-htc.org/OfficeHoursZoom).
