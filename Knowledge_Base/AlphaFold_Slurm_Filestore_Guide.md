# Guide: Installing and Running AlphaFold on a Slurm Cluster with Google Cloud Filestore

This guide outlines the process for setting up and running AlphaFold in a high-performance computing (HPC) environment using Slurm as the workload manager and Google Cloud Filestore for shared, high-performance storage.

### High-Level Architecture

1.  **Shared Filesystem (Google Cloud Filestore):** A single, high-performance NFS share will host the AlphaFold genetic databases (~3 TB) and the AlphaFold software itself. All nodes in the cluster will mount this share.
2.  **Slurm Cluster:** A workload manager that schedules jobs. We will configure it to be aware of a "GPU partition."
3.  **GPU Partition:** A logical grouping of compute nodes within Slurm that are equipped with GPUs. When a user requests a GPU for their job, Slurm will direct it to one of these nodes.
4.  **Execution Model:** Each AlphaFold prediction will be submitted as a separate job to Slurm. The job will request one node, a set number of CPUs, and one GPU from the GPU partition.

---

### Phase 1: One-Time Infrastructure Setup

This is the foundational work done by a system administrator.

#### 1. Provision and Mount Google Cloud Filestore

First, create a high-performance Filestore instance. For the MSA search stage, a higher-tier instance is recommended.

```bash
# Example: Create a 4TB Premium Filestore instance
gcloud filestore instances create alphafold-data \
    --project=your-gcp-project \
    --zone=us-central1-a \
    --tier=PREMIUM \
    --file-share=name=alphafold_share,capacity=4TB \
    --network=name="default"
```

Next, mount this Filestore instance on **all Slurm nodes** (both head node and compute nodes). This is typically done via `/etc/fstab` for persistence.

```bash
# 1. Create a mount point
sudo mkdir -p /slurm/shared/alphafold

# 2. Mount the share (get the IP from the gcloud command output)
sudo mount 10.0.0.2:/alphafold_share /slurm/shared/alphafold

# 3. Add to /etc/fstab to make it permanent
# (Entry in /etc/fstab)
# 10.0.0.2:/alphafold_share    /slurm/shared/alphafold   nfs   defaults,_netdev,hard,intr,actimeo=600 0 0
```

#### 2. Download AlphaFold Databases

On one of the nodes (e.g., the Slurm head node), download the databases **directly onto the mounted Filestore share**. This will take a very long time.

```bash
# Install aria2c if you haven't already
sudo apt-get update && sudo apt-get install -y aria2c

# Clone the AlphaFold repo to get the download script
git clone https://github.com/google-deepmind/alphafold.git /slurm/shared/alphafold/software/

# Run the download script, pointing to a directory on the Filestore mount
/slurm/shared/alphafold/software/scripts/download_all_data.sh /slurm/shared/alphafold/databases/
```

#### 3. Install AlphaFold Software (via Apptainer/Singularity)

We will use Apptainer (formerly Singularity), which is more secure and standard for HPC/Slurm environments than Docker.

```bash
# On a machine with Docker and Apptainer installed:
# 1. Navigate to the AlphaFold source directory
cd /slurm/shared/alphafold/software/

# 2. Build the Docker image first
docker build -f docker/Dockerfile -t alphafold .

# 3. Convert the Docker image to an Apptainer image file (.sif)
#    This file will be stored on the shared Filestore drive
apptainer build /slurm/shared/alphafold/containers/alphafold.sif docker-daemon:alphafold:latest
```

---

### Phase 2: Slurm Configuration (Admin Task)

The Slurm administrator needs to define the GPU resources in `slurm.conf`.

```ini
# Example snippet from /etc/slurm/slurm.conf

# Define the generic resources (GPUs) available on the nodes
GresTypes=gpu
NodeName=gpu-node-[01-04] Name=gpu Type=t4 CPUs=16 RealMemory=128000 Gres=gpu:t4:1 State=UNKNOWN

# Define the GPU partition
PartitionName=gpu_partition Nodes=gpu-node-[01-04] Default=NO MaxTime=72:00:00 State=UP
```

---

### Phase 3: Running a Prediction (User Workflow)

This is the process a researcher follows to predict a protein structure.

#### 1. Prepare Input

Place your FASTA file (e.g., `my_protein.fasta`) in your user directory, which should also be on a shared filesystem.

#### 2. Create a Slurm Submission Script

Create a file named `run_alphafold.sbatch`. This script tells Slurm exactly what resources you need and what commands to run.

```bash
#!/bin/bash

#=======================================================================
# Slurm SBATCH Directives
#=======================================================================
# Job name
#SBATCH --job-name=alphafold_prediction
#
# Standard output and error log
#SBATCH --output=slurm-%j.out
#
# Partition (queue) to submit to
#SBATCH --partition=gpu_partition
#
# Request one node
#SBATCH --nodes=1
#
# Request one task (process)
#SBATCH --ntasks=1
#
# Request 16 CPU cores for the task
#SBATCH --cpus-per-task=16
#
# Request 128GB of memory
#SBATCH --mem=128gb
#
# Request 1 GPU of any type
#SBATCH --gres=gpu:1
#
# Job time limit
#SBATCH --time=24:00:00

#=======================================================================
# Job Execution
#=======================================================================

echo "Starting AlphaFold prediction job..."
echo "Job ID: $SLURM_JOB_ID"
echo "Running on node: $SLURMD_NODENAME"

# --- 1. Set up environment variables ---
# Path to the Apptainer image file
CONTAINER_IMAGE="/slurm/shared/alphafold/containers/alphafold.sif"

# Path to the directory containing all genetic database subdirectories
DATA_DIR="/slurm/shared/alphafold/databases"

# Path to your input FASTA file
FASTA_PATH="/home/user/my_protein.fasta" # Change to your actual path

# Directory where AlphaFold will write the output structures
OUTPUT_DIR="/home/user/alphafold_outputs/${SLURM_JOB_ID}" # Use Job ID for unique output folder

mkdir -p $OUTPUT_DIR

# --- 2. Define the AlphaFold command ---
# Note: We bind the shared directories to the container so it can see the data.
APPTAINER_COMMAND="apptainer exec \
    --nv \
    --bind /slurm/shared/alphafold:/data \
    --bind $OUTPUT_DIR:/app/output \
    --bind $(dirname $FASTA_PATH):/app/input \
    $CONTAINER_IMAGE \
    /app/run_alphafold.sh \
    --fasta_paths=/app/input/$(basename $FASTA_PATH) \
    --max_template_date=2024-01-01 \
    --data_dir=/data/databases \
    --output_dir=/app/output \
    --uniref90_database_path=/data/databases/uniref90/uniref90.fasta \
    --mgnify_database_path=/data/databases/mgnify/mgy_clusters_2022_05.fa \
    --bfd_database_path=/data/databases/bfd/bfd_metaclust_clu_complete_id30_c90_final_seq.sorted_opt \
    --uniref30_database_path=/data/databases/uniref30/UniRef30_2021_03 \
    --pdb70_database_path=/data/databases/pdb70/pdb70 \
    --template_mmcif_dir=/data/databases/pdb_mmcif/mmcif_files \
    --obsolete_pdbs_path=/data/databases/pdb_mmcif/obsolete.dat \
    --model_preset=monomer_ptm \
    --use_gpu_relax=True"

# --- 3. Run the command ---
echo "Executing command: $APPTAINER_COMMAND"
eval $APPTAINER_COMMAND

echo "AlphaFold job finished."

```

#### 3. Submit the Job

From the command line, submit your script to the Slurm scheduler.

```bash
sbatch run_alphafold.sbatch
```

#### 4. Monitor the Job

You can check the status of your job in the queue.

```bash
# See all your running/pending jobs
squeue -u your_username

# Check the status of a specific job
scontrol show job <job_id>

# Once finished, check the output log
cat slurm-<job_id>.out
```

The results, including PDB files, will be in the `/home/user/alphafold_outputs/<job_id>` directory.
