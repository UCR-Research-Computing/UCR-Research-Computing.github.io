# KB006: Migrating Workloads from Google Cloud to HPCC

**Scope:** Compute Migration (VMs -> Slurm)
**Audience:** Researchers moving from Ursa Major to HPCC
**Last Updated:** Feb 9, 2026

---

## 1. Why Migrate?
*   **Cost-Effective:** HPCC operates on a flat-rate **$1,000/year Lab Subscription** model. This provides unlimited access for your entire group, whereas a single medium Cloud VM can cost $1,500+/year.
*   **Power:** Access to NVIDIA A100/H100 GPUs and high-speed Infiniband storage.
*   **Sustainability:** Reduces campus carbon footprint by using shared infrastructure.

---

## 2. Migration Strategy: "The 3 Steps"

### Step A: Data Transfer (GCS to HPCC)
You need to move your data from Google Cloud Storage (Buckets) to your HPCC `/bigdata` directory.

**Method: Using Rclone**
1.  **Login to HPCC:** `ssh netid@cluster.hpcc.ucr.edu`
2.  **Load Module:** `module load rclone`
3.  **Configure:** `rclone config`
    *   Select `n) New remote`
    *   Name: `gcp`
    *   Storage: `Google Cloud Storage (this is not Google Drive)`
    *   Auth: Select `service_account_file` if you have a JSON key, or `auto` if running on a GCP VM (and pushing *to* HPCC).
    *   *Tip:* If authenticating from HPCC, use "Headless Machine" mode. It will give you a URL to click on your laptop to authorize.
4.  **Sync Data:**
    ```bash
    # Copy bucket to HPCC
    rclone copy gcp:my-bucket-name /bigdata/labname/username/project_data/ -P
    ```
    *(`-P` shows progress)*

### Step B: Environment Migration (Docker to Apptainer)
You likely used Docker or a raw VM image in the cloud. On HPCC, we use **Apptainer** (formerly Singularity) for security.

**1. Pull your Docker Image:**
If your image is on Docker Hub:
```bash
apptainer build my-env.sif docker://ubuntu:20.04
```

**2. Convert Custom Dockerfile:**
If you have a `Dockerfile`:
1.  Build it on your laptop: `docker build -t my-repo/my-image .`
2.  Push to Docker Hub/GitHub Registry.
3.  Pull to HPCC using Apptainer as above.

**3. Running Interactively:**
```bash
apptainer shell --nv my-env.sif
```
*(The `--nv` flag enables GPU access inside the container).*

### Step C: Job Submission (Always-On to Batch)
In the cloud, you leave a VM running 24/7. On HPCC, you submit "Jobs."

**Concept:** Instead of "Running a server," you "Ask for resources for X hours."

**Example Slurm Script (`submit_job.sh`):**
```bash
#!/bin/bash
#SBATCH --job-name=my_analysis
#SBATCH --output=logs/output_%j.txt
#SBATCH --error=logs/error_%j.txt
#SBATCH --ntasks=1
#SBATCH --cpus-per-task=4
#SBATCH --mem=16G
#SBATCH --time=24:00:00
#SBATCH --partition=gpu
#SBATCH --gres=gpu:1

# Load Apptainer
module load apptainer

# Run your script inside the container
apptainer exec --nv my-env.sif python3 /bigdata/labname/username/scripts/run_model.py
```

**Submit it:**
```bash
sbatch submit_job.sh
```

---

## 3. Troubleshooting & FAQ

**Q: My code needs a specific IP address.**
**A:** HPCC compute nodes do not have public IPs. If you need to host a web server, please contact us. We may direct you to **Nautilus** (Kubernetes) instead of HPCC.

**Q: I need root access.**
**A:** You do not get root on HPCC. Use **Apptainer** to install your dependencies into a container image (where you *are* root during the build process) and then run that image on HPCC.

**Q: How do I move my VM disk?**
**A:** You cannot "move" a VM disk image (VMDK) directly to HPCC. You must extract the *files* (Data/Scripts) using `rclone` or `scp`.