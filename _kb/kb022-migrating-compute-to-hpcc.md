---
title: "Migrating Workloads from Google Cloud to HPCC"
kb_id: KB022
topic: HPCC
audience: "Researchers moving from Ursa Major to HPCC"
reviewed: 2026-10-04
review_notes:
  - "Switched container steps from Apptainer to Singularity: the HPCC site says singularity-ce is the version on the cluster (module load singularity) and Apptainer is planned. Removed the unverifiable carbon-footprint claim and the 'VMDK' wording (Google Cloud disks are not VMDK files)."
  - "Added notes that /bigdata is lab-purchased space, that downloading from Cloud Storage can incur egress and retrieval charges (pointing to Google's pricing page), and that HPCC GPU jobs must request a GPU with --gres. Removed the stale updated: date."
  - "CHECK: whether the HPCC has since added an apptainer module; if so the singularity commands can switch back."
  - "CHECK: the statement that HPCC compute nodes have no public IP addresses, and the referral of web hosting to Nautilus."
renumbered_from: "KB006 (Migrating Compute to HPCC)"
owner: Research Computing
redirect_from:
  - /Knowledge_Base/KB006_Migrating_Compute_to_HPCC.html
---

This guide is for researchers moving compute work from an Ursa Major (Google Cloud) project to the UCR High-Performance Computing Center (HPCC) cluster. The HPCC is a separate service from Ursa Major; its documentation at [hpcc.ucr.edu](https://hpcc.ucr.edu) is the authority on its policies and software.

## Why move to the HPCC?

* **Cost model:** the HPCC charges an annual lab registration, {% include fact.html id="hpcc_lab_fee" %}, that covers the lab's members, subject to the HPCC's shared-use quotas ([Queue Policies](https://hpcc.ucr.edu/manuals/hpc_cluster/queue/)). For steady, long-running work this can cost a lab less than keeping cloud VMs running, which are recharged under Ursa Major Tier 2 (see [Ursa Major service tiers](../kb005-ursa-major-service-tiers/)).
* **Hardware:** CPU, high-memory and NVIDIA GPU nodes, with shared parallel storage. See the HPCC [Hardware Details](https://hpcc.ucr.edu/about/hardware/details/) page.
* **Batch scheduling:** jobs run when resources become available and stop when they finish, so nothing keeps running (or charging) while idle.

You need an HPCC account first. See [Getting an HPCC account](../kb004-hpcc-account-creation/).

## The three steps

### Step A: move your data (Cloud Storage to the HPCC)

Copy your data from Google Cloud Storage buckets to your lab's `/bigdata` space on the HPCC. `/bigdata` is storage a lab buys separately from cluster access; your home directory has a {% include fact.html id="hpcc_user_storage" bare=true %} quota (see [HPCC Recharging Rates](https://hpcc.ucr.edu/about/overview/rates/)), which is too small for most datasets. See the HPCC [Data Storage](https://hpcc.ucr.edu/manuals/hpc_cluster/storage/) page and [HPCC storage](../../services/hpcc-storage/).

**Costs on the Google side:** downloading data out of Google Cloud can incur network egress charges, and reading Coldline or Archive storage adds retrieval charges. These are billed to the Ursa Major project. Check [Google Cloud Storage pricing](https://cloud.google.com/storage/pricing) and estimate before moving large datasets.

**Using rclone**

1. **Log in to the HPCC:** `ssh username@cluster.hpcc.ucr.edu`
2. **Load the module:** `module load rclone`
3. **Configure a remote:** run `rclone config` and answer:
   * `n` for a new remote, named `gcp`.
   * Storage type: `Google Cloud Storage (this is not Google Drive)`.
   * Your project number (from the Google Cloud console).
   * Authentication: either give the path to a service account JSON key file that can read the bucket, or leave it blank to log in with your own Google account.
   * When asked to use auto config, answer `n` (the HPCC has no web browser). rclone then tells you to run a command on your laptop to authorize and paste the result back.

   The [rclone Google Cloud Storage guide](https://rclone.org/googlecloudstorage/) explains each option.

4. **Copy the data:**

   ```bash
   # Copy a bucket to your lab's bigdata space
   rclone copy gcp:my-lab-bucket /bigdata/labname/username/project_data/ -P
   ```

   `-P` shows progress. Replace `my-lab-bucket`, `labname` and `username` with your own. Run large copies inside a batch job or a `tmux` session so they keep going if your connection drops.

### Step B: move your software environment (Docker to Singularity)

In the cloud you may have used Docker or a custom VM image. You do not have root on the HPCC, so containers run with **Singularity** (singularity-ce), which can run Docker images. See the HPCC [Singularity](https://hpcc.ucr.edu/manuals/hpc_cluster/singularity/) page.

**1. Pull an image from Docker Hub:**

```bash
module load singularity
singularity pull my-env.sif docker://ubuntu:22.04
```

**2. Use your own Dockerfile:**

1. Build it on a machine where you have Docker: `docker build -t my-repo/my-image .`
2. Push it to Docker Hub or the GitHub Container Registry.
3. Pull it on the HPCC: `singularity pull my-env.sif docker://my-repo/my-image`

**3. Run it interactively on a compute node** (not the head node):

```bash
srun -p gpu --gres=gpu:1 --mem=16g -c 4 --time=1:00:00 --pty bash -l
module load singularity
singularity shell --nv my-env.sif
```

The `--nv` flag makes the node's NVIDIA GPU available inside the container. Leave it out on CPU-only nodes.

### Step C: move from always-on VMs to batch jobs

In the cloud you might leave a VM running around the clock. On the HPCC you submit **jobs**: instead of running a server, you ask for resources for a set number of hours, and the job ends when your script finishes.

**Example Slurm script (`submit_job.sh`):**

```bash
#!/bin/bash -l
#SBATCH --job-name=my_analysis
#SBATCH --output=logs/output_%j.txt
#SBATCH --error=logs/error_%j.txt
#SBATCH --ntasks=1
#SBATCH --cpus-per-task=4
#SBATCH --mem=16G
#SBATCH --time=24:00:00
#SBATCH --partition=gpu
#SBATCH --gres=gpu:1

# Load Singularity
module load singularity

# Run your script inside the container
singularity exec --nv my-env.sif python3 /bigdata/labname/username/scripts/run_model.py
```

Create the `logs` directory before submitting (`mkdir -p logs`); Slurm does not create it. Jobs on the `gpu` partition must request a GPU with `--gres`. For CPU-only work, use a CPU partition such as `epyc` and remove the `--gres` line and `--nv`. Partition limits (for example 7 days maximum on `gpu`) are on the HPCC [Queue Policies](https://hpcc.ucr.edu/manuals/hpc_cluster/queue/) page.

**Submit it:**

```bash
sbatch submit_job.sh
```

See the HPCC [Managing Jobs](https://hpcc.ucr.edu/manuals/hpc_cluster/jobs/) page for monitoring and more examples, and [Connecting to the HPC cluster](../how-to-connect-to-hpc-cluster-run-sample-job/) for a first test job.

## Troubleshooting and FAQ

**Q: My code needs a public IP address or hosts a web service.**
**A:** HPCC compute nodes do not have public IP addresses and are not meant to host services. Contact support@hpcc.ucr.edu or research-computing@ucr.edu. A Kubernetes platform such as [Nautilus](../../services/nautilus/) may fit better.

**Q: I need root access.**
**A:** Users do not get root on the HPCC. Install your dependencies into a container image, built where you do have root (your laptop, or a remote builder), then run that image on the HPCC with Singularity. Many tools are also already available as HPCC modules (`module avail`).

**Q: Can I move my VM disk to the HPCC?**
**A:** No. A Google Cloud VM disk cannot run on the HPCC. Copy the files you need (data, scripts, configuration) with `rclone` or `scp`, and rebuild the software environment as modules or a container.
