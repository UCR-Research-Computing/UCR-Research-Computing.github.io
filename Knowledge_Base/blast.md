# Running BLAST Searches on the HPCC Cluster

## Introduction

This article will guide you through running BLAST (Basic Local Alignment Search Tool) searches on the UC Riverside High-Performance Computing Cluster (HPCC), also known as Ursa Major. BLAST is a suite of algorithms used to compare biological sequences, such as nucleotide or protein sequences, to databases and identify statistically significant similarities.  The HPCC provides the computational resources necessary to perform large-scale BLAST searches efficiently. This guide will cover accessing the cluster, choosing the appropriate resources, submitting BLAST jobs both interactively and in batch mode, and optimizing your searches.

## Table of Contents
1. [Accessing the HPCC Cluster](#accessing-the-hpcc-cluster)
2. [Choosing the Right Partition](#choosing-the-right-partition)
3. [Interactive BLAST Searches](#interactive-blast-searches)
4. [Batch BLAST Searches (SBATCH Scripts)](#batch-blast-searches-sbatch-scripts)
5. [Optimizing BLAST Searches](#optimizing-blast-searches)
6. [Getting Help](#getting-help)

## 1. Accessing the HPCC Cluster <a name="accessing-the-hpcc-cluster"></a>

To run BLAST searches on the HPCC, you first need to access the cluster. The preferred method for accessing the HPCC is via the web console SSH.

**Steps to Access the HPCC:**

1. **Open a web browser** and navigate to the UCR Research Computing web console (if available - otherwise use a standard SSH client).
2. **Use SSH to connect to the HPCC.**  The hostname is `cluster.hpcc.ucr.edu`.  Use your HPCC username and password to log in.  This address will automatically direct you to one of the head nodes (Jay or Lark), which are designed for job submission and light development.

   ```bash
   ssh username@cluster.hpcc.ucr.edu
   ```
   *(Replace `username` with your HPCC username)*

**Note:** Head nodes (Jay and Lark) are primarily for submitting jobs and light development tasks.  Avoid running computationally intensive BLAST searches directly on the head nodes.  Instead, submit jobs to the worker nodes using Slurm.

## 2. Choosing the Right Partition <a name="choosing-the-right-partition"></a>

The HPCC cluster utilizes Slurm as its job scheduler. Jobs are submitted to partitions (queues), which are groups of compute nodes with specific hardware configurations. Choosing the right partition is crucial for efficient BLAST searches. Here are some relevant partitions for BLAST and their characteristics:

* **`batch`:**
    * **Nodes:** `c01-c48`
    * **CPU:** AMD cores (64 cores per node)
    * **RAM:** 512 GB memory per node
    * **Suitable for:** General BLAST searches, especially when using software that benefits from AMD CPUs.  Good for jobs with standard memory requirements.
* **`intel` (Default Partition):**
    * **Nodes:** `i01-02, i17-i40`
    * **CPU:** Intel Broadwell cores (32 cores per node)
    * **RAM:** 512 GB memory per node
    * **Suitable for:** BLAST searches that perform well on Intel CPUs.  This is the default partition if you don't specify one.
* **`epyc`:**
    * **Nodes:** `r21-r38`
    * **CPU:** AMD EPYC cores (64 cores per node)
    * **RAM:** 1 TB memory per node
    * **Suitable for:** BLAST searches that are memory-intensive or benefit from the latest AMD EPYC architecture. Offers more memory per node than `batch` or `intel`.
* **`short`:**
    * **Nodes:** Mixed set of nodes from `batch`, `intel`, and `gpu` partitions.
    * **Time Limit:** 2 hours maximum walltime.
    * **Suitable for:**  Quick, short BLAST searches for testing purposes or when you need results rapidly and can guarantee your job will finish within 2 hours.  Since it's a mixed set of nodes, you can use constraints (see below) to request specific CPU types if needed.

**Specifying a Partition:**

When submitting jobs (both interactive and batch), you can use the `-p` flag to specify the partition. For example:

```bash
sbatch -p epyc SBATCH_SCRIPT.sh
srun -p intel --pty bash -l
```

**Feature Constraints (for `short` partition):**

If you use the `short` partition and need a specific CPU type, you can use constraints:

* **Intel Node:**
  ```bash
  srun -p short -t 2:00:00 -c 8 --mem 8GB --constraint intel --pty bash -l
  ```
* **AMD Node (Rome or Milan generation):**
  ```bash
  srun -p short -t 2:00:00 -c 8 --mem 8GB --constraint "amd&(rome|milan)" --pty bash -l
  ```

## 3. Interactive BLAST Searches <a name="interactive-blast-searches"></a>

For testing BLAST commands, exploring databases, or running small, quick searches, interactive sessions are useful.  Use the `srun` command to start an interactive session on a compute node.

**Steps for Interactive BLAST:**

1. **SSH into the HPCC cluster** as described in Section 1.
2. **Start an interactive session on a compute node using `srun`:**

   ```bash
   srun -p intel --cpus-per-task=4 --mem=4G --time=00:30:00 --pty bash -l
   ```

   * **`-p intel`:**  Specifies the `intel` partition (you can change this to `batch`, `epyc`, or `short` as needed).
   * **`--cpus-per-task=4`:** Requests 4 CPU cores for your interactive session.  BLAST can utilize multiple threads, so requesting more cores can speed up searches if your database and query are large enough.
   * **`--mem=4G`:** Requests 4 GB of memory. Adjust this based on your expected BLAST database and query size.
   * **`--time=00:30:00`:**  Requests 30 minutes of walltime.  Adjust this based on the expected duration of your search. For short tests, 30 minutes or less is usually sufficient. For longer interactive work, increase the time.  Remember the `short` partition has a 2-hour maximum.
   * **`--pty bash -l`:** Starts a bash shell in the interactive session.

3. **Load the BLAST module:**  Use the `module load` command to make the BLAST software available in your environment.  The module name might vary slightly depending on the BLAST version installed.  Use `module avail blast` to see available BLAST modules.

   ```bash
   module load blast+
   ```
   *(or the appropriate BLAST module name shown by `module avail blast`)*

4. **Run your BLAST command:**  Execute your BLAST search command within the interactive session. For example:

   ```bash
   blastn -query input.fasta -db nt -out output.blast -num_threads 4
   ```

   * **`blastn`:**  Example BLAST program (nucleotide-nucleotide BLAST).  Use the appropriate BLAST program for your sequences (e.g., `blastp`, `blastx`, `tblastn`, `tblastx`).
   * **`-query input.fasta`:**  Specifies your input query file in FASTA format.
   * **`-db nt`:** Specifies the NCBI `nt` nucleotide database.  Choose the appropriate database for your search (e.g., `nr` for protein, specific organism databases, custom databases).
   * **`-out output.blast`:**  Specifies the output file for your BLAST results.
   * **`-num_threads 4`:**  Tells BLAST to use 4 threads for the search, matching the `--cpus-per-task=4` request in `srun`.

5. **Exit the interactive session:**  Once your BLAST search is complete or you are finished with your interactive work, type `exit` to terminate the interactive session and return to the head node.

## 4. Batch BLAST Searches (SBATCH Scripts) <a name="batch-blast-searches-sbatch-scripts"></a>

For larger BLAST searches, repetitive searches, or when you want to run searches without keeping an interactive session open, batch submission using SBATCH scripts is the recommended approach.

**Steps for Batch BLAST Searches:**

1. **Create an SBATCH script:**  Use a text editor (like `vim`, `nano`, or `emacs` on the HPCC, or edit on your local machine and transfer the script) to create a file with a `.sh` extension (e.g., `blast_job.sh`).  This script will contain the Slurm directives and the BLAST commands.

   Here is an example SBATCH script for a `blastn` search:

   ```bash
   #!/bin/bash -l

   #SBATCH --job-name=blastn_search
   #SBATCH --partition=epyc
   #SBATCH --nodes=1
   #SBATCH --ntasks=1
   #SBATCH --cpus-per-task=16
   #SBATCH --mem=32G
   #SBATCH --time=24:00:00
   #SBATCH --output=blastn_job_%j.out  # %j will be replaced with the job ID

   # Load the BLAST module
   module load blast+

   # Run the BLAST search
   blastn -query input.fasta -db nt -out output.blast -num_threads 16

   # Print hostname to log which node the job ran on
   hostname

   echo "BLAST search completed."
   date
   ```

   **Explanation of SBATCH directives:**

   * **`#!/bin/bash -l`:**  Shebang line, specifies the script interpreter (bash). `-l` ensures the shell is a login shell, which is often needed for module loading.
   * **`#SBATCH --job-name=blastn_search`:**  Sets a name for your job, helpful for tracking in `squeue`.
   * **`#SBATCH --partition=epyc`:**  Specifies the `epyc` partition. Choose the appropriate partition based on your needs (e.g., `intel`, `batch`, `short`).
   * **`#SBATCH --nodes=1`:**  Requests 1 node. For most BLAST searches, 1 node is sufficient.
   * **`#SBATCH --ntasks=1`:**  Requests 1 task.  For single-program BLAST jobs, `ntasks=1` is usually appropriate.
   * **`#SBATCH --cpus-per-task=16`:**  Requests 16 CPU cores per task.  This is important for BLAST's multithreading capabilities. Adjust this based on the number of threads you want BLAST to use and the available cores on the chosen partition.
   * **`#SBATCH --mem=32G`:**  Requests 32 GB of memory. Adjust this based on your expected memory needs.  Overestimating slightly is better than underestimating and having the job fail due to out-of-memory errors.
   * **`#SBATCH --time=24:00:00`:**  Requests 24 hours of walltime (1 day).  Estimate the runtime of your BLAST search and request an appropriate time.  If you are unsure, overestimate and monitor the job.
   * **`#SBATCH --output=blastn_job_%j.out`:**  Specifies the output file for Slurm job information (STDOUT and STDERR). `%j` will be replaced with the Slurm job ID, making it easy to identify log files.

   **Important:** Do not include `#SBATCH --mail-user`, `#SBATCH --mail-type`, or `#SBATCH --account` directives in your SBATCH scripts, as these are not used on the HPCC cluster.

2. **Transfer your input files (if needed):** If your input FASTA file (`input.fasta` in the example) or any custom databases are not already on the HPCC, you need to transfer them. You can use `scp` or `sftp` to transfer files from your local machine to your HPCC home directory.

3. **Submit the SBATCH script:**  From the directory where your SBATCH script and input files are located on the HPCC, submit the job using the `sbatch` command:

   ```bash
   sbatch blast_job.sh
   ```

   Slurm will queue your job and run it on the requested partition when resources become available.

4. **Monitor your job:**  Use the `squeue` command to check the status of your job.

   ```bash
   squeue -u $USER --start
   ```
   This will show your queued and running jobs, and the estimated start time if available.

5. **Check output and error logs:** Once the job completes, check the output file (e.g., `blastn_job_JOBID.out`) for any errors or information printed by your BLAST command and the `hostname` output to see which node your job ran on.  Your BLAST result file (`output.blast` in the example) will also be in the same directory.

## 5. Optimizing BLAST Searches <a name="optimizing-blast-searches"></a>

To run BLAST searches efficiently on the HPCC, consider these optimization strategies:

* **Multithreading:** BLAST is capable of using multiple threads to speed up searches.  Use the `-num_threads` option in your BLAST command to specify the number of threads.  Match this number to the `--cpus-per-task` you request in your SBATCH script or `srun` command.  For example, if you request `--cpus-per-task=16`, use `-num_threads 16` in your BLAST command.

* **Database Choice:** Select the most specific and relevant BLAST database for your search.  Searching larger, more general databases (like `nt` or `nr`) will take longer than searching smaller, targeted databases.  Consider using organism-specific databases if appropriate.

* **E-value Threshold:** Adjust the E-value threshold to filter results.  A less stringent E-value (e.g., 10) will return more hits (including less significant ones), while a more stringent E-value (e.g., 1e-6) will return fewer, more significant hits and potentially speed up the search.

* **Resource Monitoring with `seff`:** After your batch job completes, use the `seff` command followed by your job ID to analyze resource utilization:

   ```bash
   seff JOBID
   ```
   *(Replace `JOBID` with your actual job ID)*

   `seff` will show you CPU utilization, memory utilization, and efficiency.  Use this information to optimize your resource requests for future jobs.

   * **CPU Efficiency:** If CPU efficiency is low, check if your BLAST command is correctly using multithreading (`-num_threads`).  If it is, and efficiency is still low, you might be requesting too many cores for the size of your search. Try reducing `--cpus-per-task` in future jobs.
   * **Memory Efficiency:** If memory efficiency is low, you can reduce the `--mem` request in future jobs. However, it's generally better to overestimate memory slightly to avoid out-of-memory errors. Aim for approximately 20% higher memory than reported by `seff`.

* **Test with Smaller Datasets:** Before running large BLAST searches, test your commands and resource requests with smaller query files or subsets of your data. This helps you estimate runtime and resource needs and identify any issues before submitting large, long-running jobs.

## 6. Getting Help <a name="getting-help"></a>

If you encounter issues running BLAST searches on the HPCC or have further questions, please reach out to UCR Research Computing for assistance:

* **Email:** research-computing@ucr.edu
* **UCR Research Computing Slack:**  [https://ucr-research-compute.slack.com/](https://ucr-research-compute.slack.com/)

We are here to help you utilize the HPCC effectively for your research!