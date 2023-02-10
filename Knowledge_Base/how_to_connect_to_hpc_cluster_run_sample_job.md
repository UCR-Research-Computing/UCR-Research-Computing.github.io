# Connecting to the HPC Cluster
Open a terminal window on your local machine.
Use the gcloud compute ssh command to connect to the master node of your HPC cluster. Replace <cluster-name> and <zone> with the appropriate values for your cluster.
```bash
gcloud compute ssh <cluster-name>-m --zone <zone>
```
Once connected to the master node, use the sinfo command to check the status of the cluster and see if it's up and running.
```bash
sinfo
```
Use the squeue command to check the status of any running or pending jobs on the cluster.
```bash
squeue
```
Use the scontrol show partition command to view details about the available partitions on the cluster. This will show you the number of nodes, cores, and memory available in each partition.
```bash
scontrol show partition
```
To submit a job to the cluster, create a job script that includes the necessary commands and options. Below is an example of a simple job script that runs the sleep command for 10 seconds on a single node:
```bash
#!/bin/bash

#SBATCH --job-name=test_job
#SBATCH --output=test_job.out
#SBATCH --error=test_job.err
#SBATCH --nodes=1
#SBATCH --ntasks-per-node=1
#SBATCH --time=00:00:10

sleep 10
```
Use the sbatch command to submit the job script to the cluster. Replace <path/to/jobscript.sh> with the appropriate path for your job script.
bash
Copy code
```bash
sbatch <path/to/jobscript.sh>
```
Use the squeue command to check the status of your job and see if it's running or pending.
```bash
squeue
```
Once the job is complete, use the sacct command to view the job's accounting information, including the start and end time, and the resources used by the job.
```bash
sacct --jobs <jobid>
```
Use the scancel command to cancel a running or pending job. Replace <jobid> with the appropriate job ID.
```bash
scancel <jobid>
```
Congratulations, you have now successfully connected to an HPC cluster running SLURM and submitted a job to the cluster! You can now use the above commands to monitor, manage and submit more jobs to the cluster.
