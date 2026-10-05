---
title: "Connecting to the HPC Cluster"
topic: HPCC
owner: Research Computing
reviewed: 2026-10-04
review_notes:
  - "Rewrote for the HPCC: the old steps used gcloud compute ssh to a Google Cloud cluster master node, which does not apply to the HPCC (KB004 links here as the HPCC first-job guide). Added a pointer for labs running their own cluster in Ursa Major."
  - "Fixed the sample job: a 10-second time limit with sleep 10 would be killed at the limit; it now asks for 5 minutes on the epyc partition. Removed stray 'bash / Copy code' text and the closing congratulations."
  - "CHECK: the HPCC login hostname, Duo and OnDemand details match hpcc.ucr.edu as of 2026-10-04; re-check if the HPCC changes its login page."
redirect_from:
  - /Knowledge_Base/how_to_connect_to_hpc_cluster_run_sample_job.html
---

This guide shows how to log in to the UCR High-Performance Computing Center (HPCC) cluster, look at the Slurm scheduler and run a first test job. You need an HPCC account first; see [Getting an HPCC account](../kb004-hpcc-account-creation/).

If your lab runs its own Slurm cluster in an Ursa Major (Google Cloud) project instead, see [Ursa Major HPC clusters](../ursa-major-hpc-clusters/). The Slurm commands below work the same way there once you are logged in.

## Log in

Open a terminal on your computer (Terminal on macOS or Linux, PowerShell or Windows Terminal on Windows) and connect with SSH:

```bash
ssh username@cluster.hpcc.ucr.edu
```

Replace `username` with your HPCC username. This address sends you to one of the HPCC head nodes.

* **UCR users** log in with their password plus Duo two-factor authentication.
* **External users** must use SSH keys.

The HPCC [login instructions](https://hpcc.ucr.edu/manuals/access/login/) cover both methods and SSH key setup. You can also use the cluster from a web browser through [Open OnDemand](https://hpcc.ucr.edu/manuals/hpc_cluster/selected_software/ondemand/).

Head nodes are for submitting jobs, editing files and very small tests. Run real work on compute nodes through Slurm.

## Look at the cluster

Show the partitions (queues) and the state of their nodes:

```bash
sinfo
```

Show jobs that are running or waiting. Add `-u $USER` to see only yours:

```bash
squeue
squeue -u $USER
```

Show details of each partition, including nodes, limits and defaults:

```bash
scontrol show partition
```

Show your own resource limits (an HPCC command):

```bash
slurm_limits
```

The HPCC [Queue Policies](https://hpcc.ucr.edu/manuals/hpc_cluster/queue/) page explains the partitions and limits.

## Submit a test job

Create a file named `test_job.sh` with a text editor such as `nano`:

```bash
#!/bin/bash -l

#SBATCH --job-name=test_job
#SBATCH --partition=epyc
#SBATCH --output=test_job.out
#SBATCH --error=test_job.err
#SBATCH --nodes=1
#SBATCH --ntasks=1
#SBATCH --mem=1G
#SBATCH --time=00:05:00

hostname
sleep 10
date
```

The job asks for one core, 1 GB of memory and 5 minutes on the `epyc` partition. It prints the compute node's name, waits 10 seconds and prints the date.

Submit it:

```bash
sbatch test_job.sh
```

Slurm replies with the job ID, for example `Submitted batch job 123456`.

## Monitor and manage the job

Check whether it is waiting or running:

```bash
squeue -u $USER
```

When it finishes, its output is in `test_job.out` (and any errors in `test_job.err`):

```bash
cat test_job.out
```

View accounting information such as start and end times and resources used. Replace `<jobid>` with your job ID:

```bash
sacct --jobs <jobid>
seff <jobid>
```

Cancel a running or waiting job:

```bash
scancel <jobid>
```

## Next steps

* HPCC guide to [Managing Jobs](https://hpcc.ucr.edu/manuals/hpc_cluster/jobs/) (interactive jobs, GPUs, arrays)
* [Running BLAST searches on the HPCC](../blast/)
* [Running Nextflow pipelines on the HPCC](../nextflow-genomics/)
* Questions about the HPCC: support@hpcc.ucr.edu
