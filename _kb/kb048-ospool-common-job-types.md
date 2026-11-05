---
title: "Common OSPool job types: sweeps, Monte Carlo, per-file pipelines and workflows"
kb_id: KB048
topic: National
description: "Reference patterns and HTCondor submit files for parameter sweeps, Monte Carlo simulations, per-file processing, containerized pipelines, multithreading, and DAGMan workflows."
audience: "UCR researchers and students preparing to scale computational workloads across the OSPool"
reviewed: 2026-11-05
owner: Research Computing
series: ospool
series_order: 6
review_notes:
  - "Written 2026-11-05 from OSG documentation (portal.osg-htc.org/documentation/htc_workloads/) and HTCondor submit features."
  - "Tested 2026-11-05 on ap40 by RC: Monte Carlo seed sweep (pi.sub, queue 10, $(Process)) ran across 10 jobs; container jobs via OSDF SIF and Docker Hub ran across multiple sites."
  - "Tested 2026-11-05 on ap40 by RC: sweep.sub (queue alpha, beta from params.txt, 3 rows) ran 3 jobs with the right arguments; r-job.sub with the osgvo-r:4.0.2 CVMFS image ran Rscript (R 4.0.2) on a remote machine."
  - "CHECK: perfile.sub, biosample.sub, multicore.sub, largemem.sub and the DAGMan files (pipeline.dag and its node submit files) are patterns from the OSPool documentation and were not run by RC."
---

High-throughput computing (HTC) on the Open Science Pool (OSPool) is built around independent tasks. Rather than running one massive multi-node job, HTC scales out by running hundreds, thousands, or tens of thousands of self-contained tasks in parallel across distributed national resources.

The OSPool is **Non-sensitive only (P1; no protected data)**. If your data is protected, [ask Research Computing](../../help/) where it can go before you start.

This guide provides practical submit file patterns and architectures for the most common computational patterns run on the OSPool.

---

## 1. Parameter sweeps (`queue x, y from params.txt`)

### When it fits
Parameter sweeps are ideal when exploring experimental parameter grids, performing hyperparameter optimization, or evaluating model sensitivity across distinct parameter combinations.

### How it works
Place parameter values in a plain text file on the access point, one run per line, with columns separated by spaces or commas. HTCondor reads this file at submit time and spawns one independent job per line, binding each column to a variable name.

Create `params.txt`:

```
0.01 64
0.01 128
0.05 64
0.05 128
0.10 64
0.10 128
```

Save the submit file as `sweep.sub`:

```
executable     = run_sim.py
arguments      = --alpha $(alpha) --beta $(beta)

output         = out/sim_$(alpha)_$(beta).out
error          = log/sim_$(alpha)_$(beta).err
log            = log/sweep.log

+JobDurationCategory = "Medium"

request_cpus   = 1
request_memory = 2GB
request_disk   = 2GB

queue alpha, beta from params.txt
```

When you submit this file, HTCondor creates 6 jobs. Each job receives its assigned `alpha` and `beta` values via the command-line arguments. Output and error filenames incorporate the variable names so results do not overwrite each other.

---

## 2. Monte Carlo simulations (`$(Process)` as random seed)

### When it fits
Monte Carlo workflows evaluate stochastic processes by repeating identical computational models with different pseudo-random number seeds, gathering statistical distributions upon completion.

### How it works
HTCondor assigns a unique integer index, `$(Process)`, to every job in a cluster, starting at `0` and incrementing to `N - 1`. Passing `$(Process)` directly as the random seed provides each parallel task with an independent starting state.

This pattern was tested by Research Computing on access point `ap40` using an estimate of pi (detailed in [Submitting OSPool jobs and getting results](../kb037-ospool-jobs-and-results/)).

Save the submit file as `monte_carlo.sub`:

```
executable     = pi.py
arguments      = $(Process) 2000000

output         = out/pi_$(Process).out
error          = log/pi_$(Process).err
log            = log/pi.log

+JobDurationCategory = "Medium"

request_cpus   = 1
request_memory = 1GB
request_disk   = 1GB

queue 100
```

This single command submits 100 parallel jobs. Once all tasks finish, aggregate the distributed outputs on the access point using standard command-line tools:

```bash
awk -F= '{s+=$NF} END {print "mean pi:", s/NR}' out/pi_*.out
```

---

## 3. Per-file processing pipelines (`queue infile matching`)

### When it fits
Per-file processing fits workflows that apply an identical analysis pipeline across a collection of input files, such as image sets, raw sensor logs, or independent CSV datasets.

### How it works
HTCondor provides the `matching` keyword to expand wildcards across local files on the access point. Pair this with `transfer_input_files = $(infile)` so HTCondor automatically stages each input file to the assigned worker node.

Save the submit file as `perfile.sub`:

```
executable           = process_file.py
arguments            = $(infile)

transfer_input_files = $(infile)

output               = out/proc_$(ItemIndex).out
error                = log/proc_$(ItemIndex).err
log                  = log/perfile.log

+JobDurationCategory = "Medium"

request_cpus         = 1
request_memory       = 2GB
request_disk         = 2GB

queue infile matching data/*.csv
```

In this pattern:
- `$(infile)` expands to the path of each matched file (for example, `data/sample_01.csv`).
- `$(ItemIndex)` provides a zero-based sequence number for distinguishing output logs.
- The input file is transferred to the execution node's scratch directory and processed locally.

---

## 4. Per-sample bioinformatics pipelines using containers

### When it fits
Bioinformatics tools often rely on complex dependency trees, specific Linux libraries, or Conda environments (such as FastQC, Samtools, or Bowtie). Packaging them in an Apptainer container gives every job the same software, wherever it lands.

### How it works
Store your container image (`.sif`) in your Open Science Data Federation (OSDF) space on the access point under `/ospool/apNN/data/YOUR_OSG_USERNAME/`. Input read files can also be transferred through OSDF.

Save the submit file as `biosample.sub`:

```
container_image      = osdf:///ospool/ap40/data/YOUR_OSG_USERNAME/rnaseq-v1.sif
executable           = /opt/run_sample.sh
transfer_executable  = false
arguments            = $(sample)

transfer_input_files = osdf:///ospool/ap40/data/YOUR_OSG_USERNAME/samples/$(sample).fastq.gz

output               = out/$(sample).out
error                = log/$(sample).err
log                  = log/bio.log

+JobDurationCategory = "Medium"

request_cpus         = 2
request_memory       = 4GB
request_disk         = 10GB

queue sample from sample_ids.txt
```

Key features:
- `container_image`: Points to an OSDF path. Compute nodes stream the image via OSDF caching proxies.
- `transfer_executable = false`: Tells HTCondor that `/opt/run_sample.sh` exists inside the container image itself.
- For complete instructions on building and packaging research containers, see [Containerize your research software with an AI coding agent](../kb049-containerize-your-research/).

---

## 5. Statistical computing in R, MATLAB Runtime, and Julia

### When it fits
Statistical analysis, econometrics, and mathematical modeling written in R, compiled MATLAB, or Julia.

### How it works
You may not need to package R, Julia or the MATLAB Runtime yourself: OSG publishes ready-made images on the CernVM File System (CVMFS). They carry older versions, so if you need a newer R or extra packages, build your own image (see [KB049](../kb049-containerize-your-research/)). The current list is on the [OSPool containers page](https://portal.osg-htc.org/documentation/htc_workloads/using_software/available-containers-list/).

Available container environments include:
- **R:** `/cvmfs/singularity.opensciencegrid.org/opensciencegrid/osgvo-r:4.0.2` (also `3.5.0` and `latest`)
- **MATLAB Runtime:** `/cvmfs/singularity.opensciencegrid.org/htc/matlab-runtime:R2023a`
- **Julia:** `/cvmfs/singularity.opensciencegrid.org/opensciencegrid/osgvo-julia:1.7.3` (other versions are listed)

Save the submit file as `r-job.sub`:

```
container_image      = /cvmfs/singularity.opensciencegrid.org/opensciencegrid/osgvo-r:4.0.2
executable           = run_r.sh
arguments            = $(Process)

transfer_input_files = analysis.R, data_$(Process).csv

output               = out/r_$(Process).out
error                = log/r_$(Process).err
log                  = log/r.log

+JobDurationCategory = "Medium"

request_cpus         = 1
request_memory       = 2GB
request_disk         = 2GB

queue 10
```

Create a short wrapper script `run_r.sh`:

```bash
#!/bin/bash
Rscript analysis.R "$1"
```

Make the wrapper script executable (`chmod +x run_r.sh`) before submitting.

---

## 6. Multicore threaded jobs

### When it fits
Jobs that utilize OpenMP, Python `multiprocessing` or `concurrent.futures`, or C++ multithreading to speed up computation on a single computer.

### How it works
Add `request_cpus = N` to your submit file. OSG guidelines recommend requesting a maximum of 8 CPU cores per job. Higher core counts substantially restrict the number of matching candidate nodes and increase queuing delays.

Save the submit file as `multicore.sub`:

```
executable     = parallel_sim.py
arguments      = --threads 4 --seed $(Process)

environment    = "OMP_NUM_THREADS=4"

output         = out/mc_$(Process).out
error          = log/mc_$(Process).err
log            = log/mc.log

+JobDurationCategory = "Medium"

request_cpus   = 4
request_memory = 8GB
request_disk   = 4GB

queue 5
```

### Critical rule: Do not use CPU auto-detection
Worker nodes in the OSPool often contain 64, 128, or more hardware cores. Many programming libraries (such as OpenMP, NumPy, PyTorch, and BLAS) query the total number of hardware cores on the physical system by default.

If your job requests 4 cores but your software starts 64 threads, it competes with other jobs on that machine and runs slower; the OSPool documentation warns against core auto-detection for this reason. Always constrain your application using environment variables (`OMP_NUM_THREADS`, `MKL_NUM_THREADS`) or explicit command-line flags.

---

## 7. Large memory jobs

### When it fits
Calculations that construct extensive in-memory graphs, large lookup tables, or massive matrix decompositions requiring more than the default 2 GB of RAM.

### How it works
Specify your required memory using `request_memory` with explicit units.

Save the submit file as `largemem.sub`:

```
executable           = memory_analysis.py
arguments            = dataset_$(Process).parquet

transfer_input_files = dataset_$(Process).parquet

output               = out/mem_$(Process).out
error                = log/mem_$(Process).err
log                  = log/mem.log

+JobDurationCategory = "Medium"

request_cpus         = 2
request_memory       = 16GB
request_disk         = 10GB

queue 5
```

### Memory trade-offs
In the OSPool, machines with high memory (16 GB, 32 GB, or 64 GB per slot) represent a smaller percentage of contributed resources. Larger memory requests lead to longer queue wait times.

Always run a small test job and check the memory actually used before submitting a large batch, for example with `condor_history -limit 5 -af ProcId MemoryUsage` (in MB) or in the resource table at the end of the `.log` file.

Request only what your application requires, plus a modest safety buffer (15 percent to 20 percent).

---

## 8. Multi-step workflows with HTCondor DAGMan

### When it fits
Complex computational workflows where jobs must run in a specific sequence, such as a three-stage pipeline:
1. **Preprocessing:** Split a large master dataset into shards.
2. **Analysis:** Run parallel analysis jobs across each shard.
3. **Aggregation:** Combine the analyzed shards into a single summary report.

### How it works
HTCondor includes **DAGMan** (Directed Acyclic Graph Manager), a meta-scheduler that submits jobs automatically as their prerequisite dependencies finish.

Create a DAG description file named `pipeline.dag`:

```
JOB PREP    prep.sub
JOB ANALYZE analyze.sub
JOB COMBINE combine.sub

PARENT PREP CHILD ANALYZE
PARENT ANALYZE CHILD COMBINE
```

Here:
- `PREP` runs first and creates the chunked files.
- `ANALYZE` submits only after `PREP` exits with code 0.
- `COMBINE` submits only after all jobs from `ANALYZE` finish successfully.

### Submitting and monitoring a DAG

Submit the entire workflow using `condor_submit_dag`:

```bash
condor_submit_dag pipeline.dag
```

DAGMan launches a lightweight scheduler job that monitors the workflow and submits individual node submit files as prerequisites complete. Monitor the workflow status:

```bash
condor_q -dag -nobatch
```

For detailed status information and failure diagnostics, inspect `pipeline.dag.dagman.out`. For advanced DAGMan features (such as retries, pre-scripts, and rescue DAGs), consult the [OSG DAGMan Guide](https://portal.osg-htc.org/documentation/htc_workloads/automated_workflows/dagman-workflows/).

---

## 9. Long-running jobs: splitting and self-checkpointing

### Duration categories and maximum runtimes

Each job on an OSG-managed access point is labeled with a duration category (Medium if you leave it out):

| JobDurationCategory | Expected Job Duration | Maximum Allowed Duration |
| :--- | :--- | :--- |
| Medium (default) | Less than 10 hours | 20 hours |
| Long | Less than 20 hours | 40 hours |

Jobs that run past their category's maximum are placed on hold. Remove them, shorten or checkpoint the work, and resubmit.

### Splitting workloads
Jobs requiring more than 20 hours of single-core compute should be divided into smaller chunks whenever possible. For example:
- Split a 100-hour simulation into ten 10-hour parameter stages.
- Shard a 50 GB dataset into 50 individual 1 GB tasks.

### Self-checkpointing
If a calculation cannot be split into independent pieces, implement self-checkpointing. A self-checkpointing application saves its state to disk at regular intervals (at least once every 10 hours). If the job is interrupted, HTCondor restarts it and your code resumes from the latest checkpoint instead of from the beginning.

Review the [OSG Checkpointing Documentation](https://portal.osg-htc.org/documentation/htc_workloads/checkpointing-on-OSPool/) and [Job Duration Categories](https://portal.osg-htc.org/documentation/htc_workloads/workload_planning/jobdurationcategory/) for implementation patterns.

---

## 10. What does NOT fit on the OSPool (and where to go instead)

The OSPool architecture is optimized for distributed high-throughput processing. Certain classes of computing are fundamentally incompatible with opportunistic, distributed nodes:

| Workload characteristic | Why it does not fit the OSPool | Where to run it instead |
| :--- | :--- | :--- |
| Multi-node MPI jobs | OSPool jobs each run on one machine; machines are spread across institutions | Campus [HPCC](../../services/hpcc/) or [NSF ACCESS](../../services/nsf-access/) |
| Single jobs running longer than 20 hours without checkpoints | Machines can be reclaimed and jobs are held past their duration limit | Campus [HPCC](../../services/hpcc/), or add checkpoints |
| Protected research data (P2 to P4) | The OSPool is Non-sensitive only (P1; no protected data) | [Ask Research Computing](../../help/) |
| Workloads requiring a shared POSIX cluster filesystem | Compute nodes run on isolated filesystems and transfer data via HTCondor or OSDF | Campus [HPCC](../../services/hpcc/) |
| Persistent web services, APIs, or database servers | OSPool executes batch jobs that terminate upon completion | [NRP Nautilus](../../services/nautilus/) or [Jetstream2](../../services/jetstream2/) |
| Interactive development or graphical desktop sessions | Access points support job submission, not interactive GUI computing | [HPCC](../../services/hpcc/) or [NRP Nautilus](../../services/nautilus/) |

---

## 11. Getting help

- **Research Computing:** we can help you decide whether your work fits and look over your first submit file. [Contact us](../../help/).
- **OSG Facilitators:** The OSG facilitation team provides direct technical support for HTCondor job configurations at [support@osg-htc.org](mailto:support@osg-htc.org).
- **OSG Office Hours:** Facilitators hold weekly virtual office hours every Tuesday from 4:00 PM to 5:30 PM Eastern Time. Access details are available at the [OSG Office Hours Zoom Link](https://osg-htc.org/OfficeHoursZoom).
