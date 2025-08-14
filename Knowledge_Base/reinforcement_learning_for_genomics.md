
# Reinforcement Learning for Genomics on an HPC Cluster

This document summarizes the process of setting up a reinforcement learning environment for a genomics task on a Slurm-based HPC cluster, and then developing and running the code on both the CPU and a GPU.

## 1. Environment Setup: From Conda to Micromamba

We began by discussing the best practices for managing Python environments on an HPC cluster. We concluded that while Conda is user-friendly, its large number of small files can strain shared filesystems. We opted for **Micromamba**, a lightweight and fast alternative.

I installed Micromamba in the user's home directory:

```bash
# Micromamba was installed to:
/home/forsythc_ucr_edu/bin/micromamba
```

## 2. Creating the Reinforcement Learning Environment

Our goal was to create an environment for a reinforcement learning project in genomics. We created a Micromamba environment named `rl_genomics`.

### Initial Attempt and Dependency Resolution

Our first attempt to create the environment with `tensorflow-agents` failed due to package incompatibilities. We then pivoted to a PyTorch-based approach, which is well-suited for the available hardware.

The final environment was created with the following command:

```bash
/home/forsythc_ucr_edu/bin/micromamba create -n rl_genomics python=3.10 pytorch jupyter -c conda-forge -y
```

We then installed the necessary Python packages using `pip`:

```bash
source ~/.bashrc
micromamba activate rl_genomics
pip install torchrl stable-baselines3[extra] gymnasium ale-py pygame
```

## 3. CPU-Based Reinforcement Learning for Genomics

We started by creating a Python script, `genomics_rl.py`, that uses a simple Q-learning algorithm to design a DNA sequence that binds to a specific transcription factor.

The script was run on the CPU using the following command:

```bash
source ~/.bashrc
micromamba activate rl_genomics
python genomics_rl.py
```

The script successfully trained the agent, which learned to generate sequences that were close to the target motif.

## 4. GPU-Accelerated Reinforcement Learning

To leverage the available L4 GPUs on the cluster, we adapted our script to use PyTorch for GPU-based computation.

### 4.1. Investigating the Slurm Configuration

We first investigated the Slurm configuration to determine the correct partition and GPU type. We used the following commands:

```bash
sinfo -o "%P %G"
scontrol show partition gpu
scontrol show node cluster-g2s4nodeset-0
```

To definitively identify the GPU, we submitted a simple Slurm job to run `nvidia-smi`:

```bash
sbatch --wait check_gpu.sbatch
```

The output confirmed the presence of an **NVIDIA L4** GPU.

### 4.2. Creating the GPU-Enabled Script

I created a new script, `genomics_rl_gpu.py`, which was a modified version of the original script that uses PyTorch tensors and automatically moves them to the GPU if available.

### 4.3. Creating the Slurm Submission Script

We then created a Slurm submission script, `run_on_gpu.sbatch`, to run the GPU-enabled script. After an initial failure due to an incorrect constraint, we arrived at the following working script:

```bash
#!/bin/bash
#SBATCH --partition=gpu
#SBATCH --gres=gpu:1
#SBATCH --output=genomics_rl_gpu.out
#SBATCH --error=genomics_rl_gpu.err

source ~/.bashrc
micromamba activate rl_genomics
python genomics_rl_gpu.py
```

### 4.4. Submitting and Verifying the GPU Job

The job was submitted to the Slurm queue using:

```bash
sbatch run_on_gpu.sbatch
```

The job ran successfully on an L4 GPU, and the output file, `genomics_rl_gpu.out`, confirmed that the script used the `cuda` device.

This entire process demonstrates a complete workflow for setting up a reinforcement learning environment, developing code, and running it on both CPUs and GPUs on an HPC cluster.
