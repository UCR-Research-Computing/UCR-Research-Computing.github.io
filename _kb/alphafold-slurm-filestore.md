---
title: "AlphaFold on a Slurm cluster with Google Cloud Filestore"
topic: Cloud
owner: Research Computing
reviewed: 2026-10-04
review_notes:
  - "Added tier context (a lab's own cluster, GPUs and Filestore are Tier 2 recharge; Filestore is charged for provisioned capacity even when idle) and a pointer to the AlphaFold module on the HPCC."
  - "Fixed commands: aria2 package name (was aria2c), Filestore tier PREMIUM is a legacy alias so the example uses BASIC_SSD, placeholder Filestore IP, dropped the obsolete intr mount option, moved GPU Name/Type to gres.conf (they are not slurm.conf node parameters), and lowered --mem to 120G so it fits a node with RealMemory=128000."
  - "Replaced the string-plus-eval job command with a direct apptainer exec call; flags and database paths checked against the AlphaFold 2 repository (run_docker.py) on 2026-10-04."
  - "CHECK: the T4 example GPU is enough for the protein sizes your users run; AlphaFold's own testing used A100s."
redirect_from:
  - /Knowledge_Base/AlphaFold_Slurm_Filestore_Guide.html
---

This guide shows one way to run AlphaFold 2 on a lab's own Slurm cluster in Google Cloud, with the genetic databases on a shared Google Cloud Filestore (NFS) instance. It is written for whoever administers the cluster (Phases 1 and 2) and for the researchers who run predictions (Phase 3).

## Before you start

- **Try the HPCC first.** The campus [HPCC cluster](../../services/hpcc/) offers AlphaFold as a module, with databases already downloaded. See the HPCC's [AlphaFold usage page](https://hpcc.ucr.edu/manuals/hpc_cluster/selected_software/alphafold/). For most labs this is the simpler and lower-cost path.
- **Costs.** A lab's own cluster in its Ursa Major project is Tier 2: compute nodes, GPUs, disks and Filestore are recharged to a lab funding source under an MOU. Filestore is charged for its provisioned capacity the whole time it exists, whether or not jobs are running. See [KB005: Ursa Major service tiers](../kb005-ursa-major-service-tiers/), Google's [Filestore pricing](https://cloud.google.com/filestore/pricing) and [GPU pricing](https://cloud.google.com/compute/gpus-pricing).
- **Building the cluster.** See [Launching an Ursa Major HPC cluster](../ursa-major-cluster-launch/). Cluster Toolkit blueprints can create and mount a Filestore instance for you, which can replace step 1 below. [Talk to Research Computing](../../help/) before you build.

## Architecture

1. **Shared file system (Filestore):** one NFS share holds the AlphaFold databases (about 2.6 TB unpacked for the full set), the software and the container image. Every node mounts it.
2. **Slurm:** schedules the jobs.
3. **GPU partition:** a group of GPU nodes. Jobs that ask for a GPU are sent there.
4. **Execution model:** each prediction is a separate Slurm job that asks for one node, a set number of CPUs and one GPU.

## Phase 1: One-time setup (administrator)

### 1. Create and mount the Filestore instance

The database search (MSA) stage reads heavily from the databases, so an SSD tier is recommended. Basic SSD instances start at 2.5 TiB.

```bash
# Example: a 4 TB Basic SSD Filestore instance
gcloud filestore instances create alphafold-data \
    --project=my-lab-project \
    --zone=us-central1-a \
    --tier=BASIC_SSD \
    --file-share=name=alphafold_share,capacity=4TB \
    --network=name="default"

# Show the instance's IP address
gcloud filestore instances describe alphafold-data \
    --zone=us-central1-a --format="value(networks[0].ipAddresses[0])"
```

Put the Filestore instance in the same zone and network as the cluster. Then mount it on **all Slurm nodes** (login, controller and compute):

```bash
# 1. Install the NFS client (nfs-common on Debian/Ubuntu, nfs-utils on Rocky Linux)
sudo apt-get install -y nfs-common

# 2. Create a mount point
sudo mkdir -p /slurm/shared/alphafold

# 3. Mount the share (replace FILESTORE_IP with the address from above)
sudo mount FILESTORE_IP:/alphafold_share /slurm/shared/alphafold

# 4. To mount at boot, add this line to /etc/fstab
# FILESTORE_IP:/alphafold_share  /slurm/shared/alphafold  nfs  defaults,_netdev,hard,actimeo=600  0 0
```

On autoscaling clusters, compute nodes are created and deleted as needed, so put the mount in the node image or startup script (or let the Cluster Toolkit blueprint handle it) rather than editing each node by hand.

### 2. Download the AlphaFold databases

On one node (for example the login node), download the databases directly onto the Filestore share. This takes many hours.

```bash
# Install aria2 (provides the aria2c downloader)
sudo apt-get update && sudo apt-get install -y aria2

# Clone the AlphaFold repository to get the download scripts
git clone https://github.com/google-deepmind/alphafold.git /slurm/shared/alphafold/software/

# Download all databases and model parameters to the Filestore share
/slurm/shared/alphafold/software/scripts/download_all_data.sh /slurm/shared/alphafold/databases/
```

The model parameters are under the CC BY 4.0 license and the code under Apache 2.0. See the [AlphaFold repository](https://github.com/google-deepmind/alphafold) for license terms and the reduced database option.

### 3. Build the container (Apptainer)

Apptainer (formerly Singularity) is the usual container runtime on Slurm clusters, because it runs as the user rather than as root.

```bash
# On a machine with both Docker and Apptainer installed:
cd /slurm/shared/alphafold/software/

# 1. Build the Docker image
docker build -f docker/Dockerfile -t alphafold .

# 2. Convert it to an Apptainer image file (.sif) on the shared drive
mkdir -p /slurm/shared/alphafold/containers
apptainer build /slurm/shared/alphafold/containers/alphafold.sif docker-daemon:alphafold:latest
```

## Phase 2: Slurm configuration (administrator)

Slurm needs to know about the GPUs. If the cluster was built with Cluster Toolkit, it generates this configuration from the blueprint; check the generated files rather than editing them by hand. For a hand-built cluster, the relevant lines look like this:

```ini
# /etc/slurm/slurm.conf (excerpt)
GresTypes=gpu
NodeName=gpu-node-[01-04] CPUs=16 RealMemory=128000 Gres=gpu:t4:1 State=UNKNOWN
PartitionName=gpu_partition Nodes=gpu-node-[01-04] Default=NO MaxTime=72:00:00 State=UP

# /etc/slurm/gres.conf on the GPU nodes
NodeName=gpu-node-[01-04] Name=gpu Type=t4 File=/dev/nvidia0
```

## Phase 3: Running a prediction (researcher)

### 1. Prepare the input

Put your FASTA file (for example `my_protein.fasta`) in your home directory or another directory on a shared file system that every node can see.

### 2. Create a Slurm job script

Create a file named `run_alphafold.sbatch`:

```bash
#!/bin/bash
#SBATCH --job-name=alphafold_prediction
#SBATCH --output=slurm-%j.out
#SBATCH --partition=gpu_partition
#SBATCH --nodes=1
#SBATCH --ntasks=1
#SBATCH --cpus-per-task=16
#SBATCH --mem=120G            # must fit within the node's RealMemory
#SBATCH --gres=gpu:1
#SBATCH --time=24:00:00

echo "Job ID: $SLURM_JOB_ID on node: $SLURMD_NODENAME"

# Paths
CONTAINER_IMAGE="/slurm/shared/alphafold/containers/alphafold.sif"
FASTA_PATH="$HOME/my_protein.fasta"                     # change to your file
OUTPUT_DIR="$HOME/alphafold_outputs/${SLURM_JOB_ID}"     # one folder per job
mkdir -p "$OUTPUT_DIR"

# Run AlphaFold. The shared directories are bound into the container.
apptainer exec --nv \
    --bind /slurm/shared/alphafold:/data \
    --bind "$OUTPUT_DIR":/app/output \
    --bind "$(dirname "$FASTA_PATH")":/app/input \
    "$CONTAINER_IMAGE" \
    /app/run_alphafold.sh \
    --fasta_paths=/app/input/"$(basename "$FASTA_PATH")" \
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
    --use_gpu_relax=True

echo "AlphaFold job finished."
```

These flags are for a monomer prediction with the full databases. Multimer predictions use different flags; see the [AlphaFold repository](https://github.com/google-deepmind/alphafold).

### 3. Submit the job

```bash
sbatch run_alphafold.sbatch
```

### 4. Monitor the job

```bash
# Your running and pending jobs
squeue -u $USER

# Details of one job
scontrol show job <job_id>

# The log, once the job has started
cat slurm-<job_id>.out
```

The results, including PDB files, are written to `~/alphafold_outputs/<job_id>`.

## When you are finished

Delete the Filestore instance and the cluster when the lab no longer needs them; both are charged while they exist. Copy results you want to keep to a [storage bucket](../ursa-major-storage-create-bucket/) or campus storage first.
