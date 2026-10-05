---
title: "Running BLAST Searches on the HPCC Cluster"
topic: HPCC
owner: Research Computing
reviewed: 2026-10-04
review_notes:
  - "Corrected HPCC facts against hpcc.ucr.edu: head nodes are bluejay and skylark, the BLAST module is ncbi-blast (not blast+), NCBI databases come from the db-ncbi module, and the short partition draws from batch, intel and lab nodes (not gpu)."
  - "Removed per-node hardware specs and the claim that mail directives are not used on the HPCC; the HPCC's own example uses them. Removed the manual table of contents (the page builds one) and the closing fluff."
  - "CHECK: the db-ncbi module sets the database path so that -db nt resolves without a full path (the HPCC databases page lists the module but not the variable)."
  - "CHECK: the Research Computing Slack link is still the right public channel (the workspace exists but requires sign-in)."
redirect_from:
 - /Knowledge_Base/blast.html
---

BLAST (Basic Local Alignment Search Tool) compares nucleotide or protein sequences against a database and reports statistically significant matches. This guide covers running BLAST on the UCR High-Performance Computing Center (HPCC) cluster: logging in, choosing a partition, running interactive and batch searches, and tuning resource requests.

The HPCC documentation at [hpcc.ucr.edu](https://hpcc.ucr.edu) is the authority on partitions, limits and software. Where this guide and the HPCC site differ, follow the HPCC site.

## Logging in to the HPCC

You need an HPCC account first. See [Getting an HPCC account](../kb004-hpcc-account-creation/).

Connect with SSH. The address `cluster.hpcc.ucr.edu` sends you to one of the head nodes (bluejay or skylark):

```bash
ssh username@cluster.hpcc.ucr.edu
```

Replace `username` with your HPCC username. UCR users log in with password plus Duo; external users use SSH keys. See the HPCC [login instructions](https://hpcc.ucr.edu/manuals/access/login/). A browser option, [Open OnDemand](https://hpcc.ucr.edu/manuals/hpc_cluster/selected_software/ondemand/), is also available.

Head nodes are for submitting jobs, editing code and very small tests. Do not run BLAST searches on a head node. Submit them to compute nodes through Slurm, as shown below.

## Choosing a partition

The HPCC uses the Slurm scheduler. Jobs go to partitions (queues), which are groups of compute nodes. The general-purpose CPU partitions suit most BLAST work:

* **`epyc`**: AMD EPYC nodes (2021). A good default for BLAST.
* **`intel`**: Intel nodes (2016).
* **`batch`**: AMD nodes (2012).
* **`highmem`**: for very large memory needs. Jobs must request at least 100 GB.
* **`short`**: a mixed set of nodes from the batch, intel and lab partitions, with a 2-hour maximum. Useful for quick tests.

Default memory is 1 GB per job and default walltime is 7 days on epyc, intel and batch, so always request what you need. Per-user and per-lab limits are on the HPCC [Queue Policies](https://hpcc.ucr.edu/manuals/hpc_cluster/queue/) page, and node details are on the HPCC [Managing Jobs](https://hpcc.ucr.edu/manuals/hpc_cluster/jobs/) and [Hardware Details](https://hpcc.ucr.edu/about/hardware/details/) pages. Run `slurm_limits` on the cluster to see your current limits.

Set the partition with `-p` (or `--partition`) on every job:

```bash
sbatch -p epyc blast_job.sh
srun -p epyc --pty bash -l
```

**Feature constraints on `short`.** Because `short` mixes node types, you can ask for a CPU type with `--constraint`:

```bash
# Any Intel node
srun -p short -t 2:00:00 -c 8 --mem 8GB --constraint intel --pty bash -l

# AMD Rome or Milan node
srun -p short -t 2:00:00 -c 8 --mem 8GB --constraint "amd&(rome|milan)" --pty bash -l
```

## Loading BLAST and the NCBI databases

BLAST+ is installed as the `ncbi-blast` module. Several versions are available; list them first:

```bash
module avail ncbi-blast
module load ncbi-blast          # default version
# or a specific version, for example:
module load ncbi-blast/2.14.1+
```

The HPCC keeps copies of common NCBI databases (nr, nt, core_nt and others) through the `db-ncbi` module (`db-swissprot` for SwissProt). They are refreshed about every 6 months and kept for about 3 years. If your project needs a fixed database version for longer, copy it to your own storage. See the HPCC [Databases](https://hpcc.ucr.edu/manuals/hpc_cluster/selected_software/databases/) page.

```bash
module load db-ncbi
```

## Interactive BLAST searches

Interactive sessions are useful for testing commands and running small searches.

1. Log in to the cluster.
2. Start a session on a compute node:

   ```bash
   srun -p epyc --cpus-per-task=4 --mem=4G --time=00:30:00 --pty bash -l
   ```

   * `-p epyc`: the partition (use `short` for quick tests).
   * `--cpus-per-task=4`: 4 CPU cores. BLAST can use several threads.
   * `--mem=4G`: 4 GB of memory. Large databases such as nt need more.
   * `--time=00:30:00`: 30 minutes of walltime.
   * `--pty bash -l`: starts a login shell on the compute node.

3. Load the modules:

   ```bash
   module load ncbi-blast db-ncbi
   ```

4. Run the search:

   ```bash
   blastn -query input.fasta -db nt -out output.blast -num_threads 4
   ```

   * `blastn`: nucleotide against nucleotide. Use `blastp`, `blastx`, `tblastn` or `tblastx` as your data requires.
   * `-query input.fasta`: your query sequences in FASTA format.
   * `-db nt`: the NCBI nt database. Use `nr` for proteins, or a custom database.
   * `-out output.blast`: the results file.
   * `-num_threads 4`: matches the 4 cores requested with `srun`.

5. Type `exit` to end the session and return to the head node.

## Batch BLAST searches (sbatch scripts)

For larger or repeated searches, submit a batch script so the job runs without an open session.

1. Create a script, for example `blast_job.sh`:

   ```bash
   #!/bin/bash -l

   #SBATCH --job-name=blastn_search
   #SBATCH --partition=epyc
   #SBATCH --nodes=1
   #SBATCH --ntasks=1
   #SBATCH --cpus-per-task=16
   #SBATCH --mem=32G
   #SBATCH --time=24:00:00
   #SBATCH --output=blastn_job_%j.out   # %j is replaced with the job ID

   # Load BLAST and the NCBI databases
   module load ncbi-blast db-ncbi

   # Run the search, one thread per requested core
   blastn -query input.fasta -db nt -out output.blast -num_threads ${SLURM_CPUS_PER_TASK}

   # Record which node the job ran on and when it finished
   hostname
   date
   ```

   What the directives do:

   * `#!/bin/bash -l`: runs a login shell, so the `module` command is available.
   * `--job-name`: a name shown by `squeue`.
   * `--partition=epyc`: the partition. Change it as needed.
   * `--nodes=1` and `--ntasks=1`: BLAST runs as one multithreaded process on one node.
   * `--cpus-per-task=16`: cores for BLAST's threads. `${SLURM_CPUS_PER_TASK}` passes the same number to `-num_threads`.
   * `--mem=32G`: memory for the job. Running out of memory ends the job, so allow some headroom.
   * `--time=24:00:00`: walltime. Estimate from a smaller test run.
   * `--output`: the file for the job's standard output and error.

   You can add `--mail-user` and `--mail-type` if you want email when the job starts or ends.

2. **Copy your input files to the cluster** if they are not there yet, with `scp`, `sftp` or another method from the HPCC [Sharing Data](https://hpcc.ucr.edu/manuals/hpc_cluster/sharing/) page. Your home directory has a {% include fact.html id="hpcc_user_storage" bare=true %} quota (see [HPCC Recharging Rates](https://hpcc.ucr.edu/about/overview/rates/)); large data belongs in your lab's `/bigdata` space. See the HPCC [Data Storage](https://hpcc.ucr.edu/manuals/hpc_cluster/storage/) page.

3. **Submit the job** from the directory that holds the script and input:

   ```bash
   sbatch blast_job.sh
   ```

4. **Monitor the job:**

   ```bash
   squeue -u $USER --start
   ```

   This lists your queued and running jobs, with an estimated start time when one is available.

5. **Check the results.** When the job ends, read `blastn_job_<JOBID>.out` for errors and the node name. The BLAST results (`output.blast`) are in the same directory.

## Tuning BLAST searches

* **Threads:** set `-num_threads` to the number of cores you request (`--cpus-per-task`).
* **Database choice:** large general databases such as nt and nr take longer to search than smaller, targeted ones. Use an organism-specific or custom database when it fits the question.
* **E-value threshold:** a stricter threshold (for example `-evalue 1e-6`) returns fewer, more significant hits; a looser one (for example `10`) returns more hits, including weak ones.
* **Check efficiency with `seff`:** after a job finishes, run:

  ```bash
  seff JOBID
  ```

  * Low CPU efficiency: confirm `-num_threads` matches your core request. If it does, try fewer cores next time.
  * Low memory efficiency: lower `--mem` next time, keeping about 20% above the memory `seff` reports.

* **Test small first:** run a subset of your queries to estimate runtime and memory before a large search.

## Getting help

* HPCC accounts, the cluster, software and modules: support@hpcc.ucr.edu
* Other Research Computing questions: research-computing@ucr.edu
* UCR Research Computing Slack: [https://ucr-research-compute.slack.com/](https://ucr-research-compute.slack.com/)
