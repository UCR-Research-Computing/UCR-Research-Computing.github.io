---
title: "Running Genomics Nextflow Pipelines on the UCR HPCC Cluster"
topic: HPCC
owner: Research Computing
reviewed: 2026-10-04
review_notes:
  - "Rewrote the example pipeline and config: the old main.nf mixed DSL1 and DSL2 syntax and would not run, and the old config set executor options at the wrong level. The new main.nf and nextflow.config were test-run with Nextflow 24.10 (local executor, FastQC stubbed); the Slurm profile was checked with nextflow config."
  - "Corrected HPCC facts against hpcc.ucr.edu: head nodes are bluejay and skylark, a nextflow module exists, GPU types and partition limits now point to the HPCC pages, Nextflow logs are .nextflow.log and .command.log (not slurm-JOBID.out). Storage size and lab fee now come from facts."
  - "Added running the Nextflow driver as its own batch job, since HPCC head nodes are limited to small tasks (under 1 GB RAM)."
  - "CHECK: the HPCC allows sbatch from inside a running job (the driver job submits the task jobs). If not, the driver should run on a head node in tmux instead."
  - "CHECK: module versions (nextflow 23.04/23.08, java 17.0.2, fastqc 0.11.9) are from the HPCC modules list and may change; the Slack link is still the right public channel."
redirect_from:
 - /Knowledge_Base/gnextnext5.html
 - /Knowledge_Base/nextflow-genomics.html
---

Nextflow is a workflow manager for building scalable, reproducible pipelines, widely used in bioinformatics. This guide shows how to run a Nextflow pipeline on the UCR High-Performance Computing Center (HPCC) cluster, with Nextflow submitting each step as a Slurm job.

You will:

* set up Nextflow on the cluster,
* write a small genomics pipeline (FastQC on a set of FASTQ files),
* configure Nextflow to submit jobs to Slurm partitions,
* run, monitor and tune the pipeline.

The HPCC documentation at [hpcc.ucr.edu](https://hpcc.ucr.edu) is the authority on partitions, limits and software. Where this guide and the HPCC site differ, follow the HPCC site.

## Prerequisites

* **An HPCC account.** See [Getting an HPCC account](../kb004-hpcc-account-creation/). Accounts belong to a registered lab; the annual lab registration is {% include fact.html id="hpcc_lab_fee" %}.
* **Basic Linux and Slurm skills:** the command line, `sbatch` and `squeue`.
* **Your data on HPCC storage.** Your home directory has a {% include fact.html id="hpcc_user_storage" bare=true %} quota (see [HPCC Recharging Rates](https://hpcc.ucr.edu/about/overview/rates/)), which is too small for most genomics data. Use your lab's `/bigdata` space for inputs, results and the Nextflow work directory. See the HPCC [Data Storage](https://hpcc.ucr.edu/manuals/hpc_cluster/storage/) page and [HPCC storage](../../services/hpcc-storage/).

## Setting up Nextflow

### Log in

Connect with SSH. The address `cluster.hpcc.ucr.edu` sends you to one of the head nodes (bluejay or skylark):

```bash
ssh username@cluster.hpcc.ucr.edu
```

Replace `username` with your HPCC username. See the HPCC [login instructions](https://hpcc.ucr.edu/manuals/access/login/) for Duo and SSH key options.

### Option A: use the HPCC module

The HPCC provides Nextflow as a module. List the versions and load one:

```bash
module avail nextflow
module load nextflow
nextflow -v
```

### Option B: install your own copy

If you need a newer Nextflow than the module offers, install it in your home directory. Nextflow needs Java 17 or later; load the HPCC Java module first:

```bash
module load java/17.0.2
mkdir -p $HOME/apps
cd $HOME/apps
curl -s https://get.nextflow.io | bash
```

This places a `nextflow` launcher in `$HOME/apps`. Add that directory to your `PATH`:

```bash
echo 'export PATH=$PATH:$HOME/apps' >> ~/.bashrc
source ~/.bashrc
nextflow -v
```

Load the same Java module (in `~/.bashrc` or your job script) whenever you run this copy.

## A basic genomics pipeline

This example runs FastQC on every `*.fastq.gz` file in an input directory.

### Create a pipeline directory

```bash
mkdir nf-genomics-pipeline
cd nf-genomics-pipeline
```

### Write the pipeline (`main.nf`)

```groovy
#!/usr/bin/env nextflow
nextflow.enable.dsl = 2

params.input_dir  = "${projectDir}/data/fastq"
params.output_dir = "${projectDir}/results"

process FASTQC {
    tag "${sample_id}"
    module 'fastqc'
    publishDir "${params.output_dir}/${sample_id}", mode: 'copy'

    cpus 2
    memory '4 GB'
    time '1h'

    input:
    tuple val(sample_id), path(reads)

    output:
    path "*_fastqc.{html,zip}"

    script:
    """
    fastqc --threads ${task.cpus} -o . ${reads}
    """
}

workflow {
    reads_ch = Channel
        .fromPath("${params.input_dir}/*.fastq.gz", checkIfExists: true)
        .map { fq -> tuple(fq.simpleName, fq) }
        .view()

    FASTQC(reads_ch)
}
```

What it does:

* **`params.input_dir` and `params.output_dir`:** default input and output locations. Override them on the command line, for example `--input_dir /bigdata/labname/username/fastq`.
* **`process FASTQC`:** one step of the pipeline.
  * `tag`: labels each task with its sample name in the progress display.
  * `module 'fastqc'`: Nextflow runs `module load fastqc` inside each job, so the HPCC's FastQC is available.
  * `publishDir`: copies the outputs to `results/<sample>/` when a task finishes.
  * `cpus`, `memory`, `time`: the resources each task requests from Slurm.
  * `input`: a tuple of sample name and FASTQ file.
  * `output`: the HTML report and zip file FastQC writes.
  * `script`: the shell command each task runs.
* **`workflow`:** builds a channel of FASTQ files, turns each into a `(sample_name, file)` tuple, prints it (`view`) and runs `FASTQC` on each, in parallel.

### Add test input (optional)

```bash
mkdir -p data/fastq
```

Copy a few real (or small test) `.fastq.gz` files into `data/fastq/`. FastQC needs valid FASTQ content; empty placeholder files make it fail.

## Configuring Nextflow for Slurm

Create `nextflow.config` in the same directory:

```groovy
profiles {
    slurm {
        process.executor         = 'slurm'
        process.queue            = 'epyc'
        executor.queueSize       = 50
        executor.submitRateLimit = '10/1min'
    }
}
```

* **`profiles { slurm { ... } }`:** a profile you turn on with `-profile slurm`. Without it, Nextflow runs tasks on the machine where it was started.
* **`process.executor = 'slurm'`:** submit each task as a Slurm job.
* **`process.queue = 'epyc'`:** the default partition. Individual processes can override it with a `queue` directive.
* **`executor.queueSize` and `executor.submitRateLimit`:** cap how many jobs Nextflow keeps in the queue and how fast it submits them. Users can have at most 5000 jobs queued or running at once on the HPCC.

You do not need a Slurm account option on the HPCC. Put resource requests (`cpus`, `memory`, `time`) on each process, as in `main.nf`, rather than one setting for all.

### Choosing partitions

* **`epyc`**, **`intel`**, **`batch`**: general CPU work (AMD 2021, Intel 2016 and AMD 2012 nodes). Default 1 GB memory and 7 days walltime if you do not request otherwise.
* **`highmem`**: memory-heavy steps. Jobs must request at least 100 GB.
* **`gpu`**: GPU-accelerated tools. Jobs must request a GPU with `--gres`.
* **`short`**: mixed nodes, 2 hours maximum. Good for quick tests.

Limits per user, per job and per lab are on the HPCC [Queue Policies](https://hpcc.ucr.edu/manuals/hpc_cluster/queue/) page; node types and GPU models are on the HPCC [Managing Jobs](https://hpcc.ucr.edu/manuals/hpc_cluster/jobs/) page. For this FastQC example, `epyc` or `intel` is fine.

## Running the pipeline

The Nextflow driver keeps running for the whole pipeline and can use a few GB of memory. HPCC head nodes are for small tasks, so run the driver as its own small batch job. Save this as `run_nextflow.sh` in the pipeline directory:

```bash
#!/bin/bash -l
#SBATCH --job-name=nf-driver
#SBATCH --partition=epyc
#SBATCH --cpus-per-task=2
#SBATCH --mem=4G
#SBATCH --time=2-00:00:00
#SBATCH --output=nf-driver_%j.out

module load nextflow                 # or: module load java/17.0.2 for your own copy
export NXF_OPTS='-Xms500M -Xmx2G'    # keep the driver's Java memory inside the job

nextflow run main.nf -profile slurm \
    -work-dir /bigdata/labname/username/nf-work \
    -resume
```

Replace `labname` and `username` with your own. Then submit it:

```bash
sbatch run_nextflow.sh
```

* **`-profile slurm`:** uses the Slurm settings from `nextflow.config`, so each FASTQC task becomes its own Slurm job.
* **`-work-dir`:** where Nextflow keeps intermediate files. Putting it on `/bigdata` keeps your home directory under quota.
* **`-resume`:** reuses results from earlier runs where inputs and code have not changed (see below).

For a quick test with a few small files you can also run `nextflow run main.nf -profile slurm` directly in an interactive session (`srun -p short --mem=4G -c 2 -t 2:00:00 --pty bash -l`).

When the pipeline finishes, the reports are in `results/`:

```bash
ls results/sample1/
# sample1_fastqc.html  sample1_fastqc.zip
```

## Monitoring the pipeline

**Nextflow output and logs**

* The driver job's output file (`nf-driver_<JOBID>.out`) shows progress for each process.
* `.nextflow.log` in the launch directory has the detailed log for the latest run.
* `nextflow log` lists past runs; `nextflow log <run_name> -f name,status,exit,workdir` shows each task.
* Each task has its own work directory with `.command.sh` (the script), `.command.log` and `.command.err` (output and errors). Nextflow prints the work directory of any task that fails.

**Slurm commands**

* `squeue -u $USER`: your running and queued jobs. Nextflow task jobs are named `nf-<PROCESS>_(<tag>)`.
* `squeue --start -u $USER`: estimated start times.
* `scontrol show job <JOBID>`: details of one job.
* `sacct -u $USER -l`: your past jobs.
* `jobMonitor` (or `qstatMonitor`): an HPCC command that summarizes activity of all users on the cluster.

## Tuning the pipeline for the HPCC

**Request resources per process.** Set `cpus`, `memory` and `time` on each process so each step asks for what it needs:

```groovy
process ALIGN {
    cpus 8
    memory '32 GB'
    time '6h'
    queue 'intel'        // optional: override the default partition

    input:
    // ...

    output:
    // ...

    script:
    """
    # use ${task.cpus} threads in your tool's command
    """
}
```

Processes without these directives get Nextflow's defaults (1 CPU, no memory or time request), which on the HPCC means the partition defaults (1 GB, and 7 days on the CPU partitions).

**Check efficiency with `seff`.** After a task's job finishes, run `seff <JOBID>` to see CPU and memory efficiency. Lower the requests for steps that use much less than they ask for, keeping about 20% above the memory actually used.

**Pick the right partition per step.**

* Memory-heavy steps: `queue 'highmem'` and `memory` of at least 100 GB.
* GPU steps: `queue 'gpu'` and `clusterOptions '--gres=gpu:1'` (or a specific type, for example `--gres=gpu:a100:1`).
* MPI steps: a homogeneous partition such as `batch` or `intel`, with `--ntasks` passed through `clusterOptions`.

**Parallelism.** Nextflow runs one task per item in a channel, in parallel, up to `executor.queueSize`. For multithreaded tools, set `cpus` and pass `${task.cpus}` to the tool's thread option.

**Caching and resume.** Nextflow caches each task's results in the work directory. Re-running with `-resume` skips tasks whose inputs and code have not changed:

```bash
nextflow run main.nf -profile slurm -resume
```

Keep the work directory until the pipeline is final, then delete it to free space.

## Getting help

* HPCC accounts, the cluster, software and modules: support@hpcc.ucr.edu
* Other Research Computing questions: research-computing@ucr.edu
* UCR Research Computing Slack: [https://ucr-research-compute.slack.com/](https://ucr-research-compute.slack.com/) (ask research-computing@ucr.edu for an invitation)
* HPCC Slurm examples: [github.com/ucr-hpcc/hpcc_slurm_examples](https://github.com/ucr-hpcc/hpcc_slurm_examples)
* Nextflow documentation: [https://www.nextflow.io/docs/](https://www.nextflow.io/docs/), including the [Slurm executor](https://www.nextflow.io/docs/latest/executor.html) page
