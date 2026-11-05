---
title: "Submitting OSPool jobs and getting results"
kb_id: KB037
topic: National
description: "Write an HTCondor submit file, run a tested Monte Carlo parameter sweep, monitor queue status, diagnose stuck slots, and collect results."
audience: "UCR researchers with an OSPool account"
reviewed: 2026-11-05
owner: Research Computing
series: ospool
series_order: 4
review_notes:
  - "Written 2026-10-29 from 'Overview: Submit Jobs to the OSPool using HTCondor' and the Job Duration Categories page (portal.osg-htc.org/documentation, fetched 2026-10-29)."
  - "Tested 2026-11-05 on ap40 by RC: 10-job Monte Carlo pi parameter sweep (pi.py, pi.sub), queue monitoring, stuck slot diagnosis with condor_q -af RemoteUserCpu, and job removal."
  - "Tested 2026-11-05 on ap40 by RC: queue alpha, beta from params.txt produced one job per row with the right arguments (see KB048)."
  - "CHECK: the queue sample_file matching data/*.csv example is from the OSPool documentation and was not run by RC."
---

Submitting jobs to the Open Science Pool (OSPool) is how you turn a single research computation into a high-throughput workflow that can run across hundreds of remote computers. You write your computation into an executable, describe the work and its hardware requirements in an HTCondor submit file, and hand it to your access point.

The OSPool complements UCR's campus [HPCC](../../services/hpcc/). The HPCC is the place to start for most work, including MPI and shared-storage jobs; the OSPool suits large sweeps of independent single-machine tasks.

Work on the OSPool is strictly for **Non-sensitive only (P1; no protected data)**. There is no recharge from UCR for running jobs on the OSPool.

---

## 1. The shape of an OSPool job

Every HTCondor workload consists of two core files:

1. An **executable**: The program or script that does the calculation on a remote worker machine (such as a Python script, R script, compiled binary, or shell wrapper).
2. A **submit file**: A plain text configuration file that tells HTCondor what program to run, what arguments to pass, which input files to transfer, what hardware resources one task needs, and how many jobs to create.

---

## 2. A tested first workflow: 10-job Monte Carlo pi sweep

To see the complete lifecycle of an OSPool workload, follow this tested 10-job parameter sweep that estimates the value of pi using random sampling.

### Step 1: Create your working directories

Log in to your access point (for example, `ap40`) and create a project directory in your `/home/YOUR_OSG_USERNAME` directory:

```bash
mkdir -p ~/osg-pi/out ~/osg-pi/log
cd ~/osg-pi
```

HTCondor does not create missing output or log subdirectories automatically. If your submit file directs output or error logs into `out/` or `log/`, those directories must exist before you run `condor_submit`.

### Step 2: Create the executable (`pi.py`)

Save the following Python script as `pi.py`:

```python
#!/usr/bin/env python3
# Monte Carlo estimate of pi. One job = one seed. Usage: pi.py <seed> <samples>
import random, sys
seed, n = int(sys.argv[1]), int(sys.argv[2])
random.seed(seed)
hits = sum(1 for _ in range(n) if random.random()**2 + random.random()**2 <= 1.0)
print(f"seed={seed} samples={n} pi_estimate={4*hits/n:.6f}")
```

Make the script executable:

```bash
chmod +x pi.py
```

### Step 3: Create the submit file (`pi.sub`)

Save the following configuration as `pi.sub`:

```text
# HTCondor submit file: 10 independent Monte Carlo jobs (a parameter sweep over seeds)
executable     = pi.py
arguments      = $(Process) 2000000
output         = out/pi_$(Process).out
error          = log/pi_$(Process).err
log            = log/pi.log
+JobDurationCategory = "Medium"
request_cpus   = 1
request_memory = 1GB
request_disk   = 1GB
queue 10
```

Notice what each line specifies:

- `executable = pi.py`: The program transferred to and executed on the worker node.
- `arguments = $(Process) 2000000`: HTCondor replaces `$(Process)` with an integer starting from 0 for each job in the cluster (0 through 9). Each job receives a distinct random seed and tests two million sample points.
- `output` and `error`: Capture standard output and standard error from each process into separate files.
- `log = log/pi.log`: The HTCondor cluster event log. This file stays on the access point in `/home` and records when jobs match, start, run, and finish.
- `+JobDurationCategory = "Medium"`: Required job categorization for OSG access points.
- `request_cpus`, `request_memory`, `request_disk`: Hardware required for a single job instance.
- `queue 10`: Tells HTCondor to create 10 independent job tasks.

### Step 4: Submit and monitor the jobs

Submit the workload to HTCondor:

```bash
condor_submit pi.sub
```

HTCondor confirms submission and reports your assigned cluster ID:

```text
Submitting job(s)..........
10 job(s) submitted to cluster 12345678.
```

Check queue status:

```bash
condor_q
```

In testing on access point ap40:

1. The jobs initially entered the idle state (`I`) while HTCondor matched slots across the pool (approximately 1 minute).
2. Once matched, each individual job took approximately 3 seconds of CPU execution time.
3. 9 of the 10 jobs completed successfully within approximately 2 minutes from submission.

### Step 5: Read and aggregate the results

When jobs finish, their standard output files appear in `out/`:

```bash
cat out/pi_0.out
```

Output:

```text
seed=0 samples=2000000 pi_estimate=3.141634
```

Inspect all completed output files:

```bash
cat out/pi_*.out
```

You can summarize the results across all completed jobs using Python:

```bash
python3 -c "
import glob
estimates = []
for path in glob.glob('out/pi_*.out'):
    for line in open(path):
        if 'pi_estimate=' in line:
            estimates.append(float(line.split('pi_estimate=')[1].strip()))
if estimates:
    print(f'Finished jobs: {len(estimates)}, Mean pi estimate: {sum(estimates)/len(estimates):.6f}')
"
```

In our test run, the 9 completed runs produced a combined mean pi estimate of approximately 3.1413.

---

## 3. Sizing resources and job duration

Requesting accurate resources is critical for scheduling efficiency. Smaller resource requests match thousands of idle machines, while oversized requests lead to long queue delays.

### Duration category (`+JobDurationCategory`)

OSG access points enforce job duration categories:

- `+JobDurationCategory = "Medium"`: For jobs expected to run under 10 hours (maximum 20 hours).
- `+JobDurationCategory = "Long"`: For jobs expected to run under 20 hours (maximum 40 hours).

On ap40, jobs submitted without this line ran as Medium. Including the line makes your intent clear.

Contributing institutions can reclaim their machines, which interrupts the job running there; the longer a job runs, the more likely that is. If your computations take longer, split your work into smaller batches or implement self-checkpointing.

### Cores, memory, and disk

Request only what one task requires:

- **CPUs (`request_cpus`):** Single-core jobs (`request_cpus = 1`) match the largest portion of the pool. On 2026-11-05, a single-CPU request matched about 9,100 slots on roughly 1,800 machines (most of them busy with other jobs). Multicore jobs should generally request 8 or fewer cores.
- **Memory (`request_memory`):** The default is typically 2 GB if omitted. Ask for what your code needs with units (for example, `1GB`, `4GB`). Requesting 16 GB or 32 GB dramatically restricts the number of matching machines.
- **Disk (`request_disk`):** Scratch disk space needed in the remote job sandbox (for example, `1GB` or `5GB`).

To determine accurate requests, inspect your cluster log file (`log/pi.log`) after test jobs finish. Look for the resource usage summary block:

```text
        Partitionable Resources :    Usage  Request Allocated
           Cpus                 :                 1         1
           Disk (KB)            :        1  1048576  35843931
           GPUs                 :                           0
           Memory (MB)          :              1024      2000
```

That block is from our test. A job this short can finish before HTCondor records memory use, which is why the Usage column is blank for memory. Longer jobs show a number there.

Adjust your submit file requests so that your requests comfortably cover actual usage with a modest buffer.

### GPUs

To request GPU acceleration, add `request_gpus = 1`. GPU capacity represents a smaller fraction of the national pool, so queue times are generally longer than for CPU jobs. See [GPU jobs on the OSPool](../kb047-ospool-gpu-jobs/) for details on filtering by GPU memory and CUDA compute capability.

---

## 4. Scaling up to many jobs

Once a test run of 5 to 10 jobs succeeds, you can scale to hundreds or thousands of tasks using HTCondor's `queue` directives.

### Numeric parameter sweeps

Use `queue N` with the `$(Process)` macro:

```text
executable           = simulation.py
arguments            = $(Process) 50000
+JobDurationCategory = "Medium"
queue 100
```

### Processing a list of files

Use `queue matching` to run one job per data file:

```text
executable           = process_sample.py
arguments            = $(sample_file)
transfer_input_files = $(sample_file)
+JobDurationCategory = "Medium"
queue sample_file matching data/*.csv
```

### Parameter combinations from a text file

Use `queue from` to pass rows of parameters from an input file:

```text
executable           = model.py
arguments            = --alpha $(alpha) --beta $(beta)
+JobDurationCategory = "Medium"
queue alpha, beta from parameters.txt
```

### Best practices for scaling

- Always test with 5 to 10 jobs first. Verify that outputs are valid and that memory and disk limits are respected before submitting large clusters.
- On access point ap40, up to 50,000 jobs can be queued per user at once (`MAX_JOBS_PER_OWNER = 50000`).
- For advanced workflow orchestration (including directed acyclic graphs and multi-step pipelines), see [Common OSPool job types: sweeps, Monte Carlo, per-file pipelines and workflows](../kb048-ospool-common-job-types/).

---

## 5. Monitoring the queue and fixing problems

### Essential monitoring commands

| Command | Purpose |
| :--- | :--- |
| `condor_q` | View your active jobs summarized by cluster |
| `condor_q -nobatch` | Display one line per individual job task |
| `condor_q -hold` | Show why held jobs stopped running |
| `condor_q -better-analyze JOBID` | Detailed analysis of why an idle job is not matching slots |
| `condor_q -af RemoteUserCpu JOBID` | Show accumulated CPU execution time for a running job |
| `condor_history -limit 20` | Show recently completed or removed jobs |
| `condor_rm JOBID` | Remove an active job or an entire cluster |
| `condor_release JOBID` | Release a held job after fixing the issue |

### Diagnosing stuck slots (tested tip)

In opportunistic distributed computing, a remote worker machine can occasionally enter an unhealthy state where a job is listed as running (`R`) but makes no computational progress.

During RC testing of the 10-job pi sweep, 9 jobs finished in roughly 3 seconds each, but one job sat in the running state without completing.

To diagnose a potentially stuck slot:

1. Check accumulated CPU time across your running jobs:
   ```bash
   condor_q -af ClusterId ProcId JobStatus RemoteUserCpu
   ```
2. If a job has been in status `2` (Running) for several minutes but shows `RemoteUserCpu = 0.0`, the execute slot is stuck.
3. Inspect slot details with `condor_q -better-analyze JOBID`.
4. Remove only the stuck job:
   ```bash
   condor_rm 12345678.9
   ```
5. Resubmit just that single seed or task with a targeted submit file (`queue 1`).

### Held jobs (`H` status)

When HTCondor encounters an error it cannot recover from, it places the job on hold (`H`).

Run `condor_q -hold` to read the exact error message. Common causes include:

- **Missing input files:** A file listed in `transfer_input_files` does not exist on the access point.
- **Resource limit exceeded:** The job consumed more memory or scratch disk than declared in `request_memory` or `request_disk`.
- **Quota exceeded:** Your `/home` or `/ospool/apNN/data/` directory exceeded its storage quota.

Once you resolve the cause (for example, by increasing memory in the submit file or clearing old files), release the job with `condor_release JOBID`, or remove it with `condor_rm JOBID` and resubmit.

---

## 6. Containers and software stacks

If your research code requires specialized libraries, specific Python packages, or software not installed in standard Linux distributions:

1. Use curated CVMFS container images provided by the OSG for environments like PyTorch, TensorFlow, R, or Julia.
2. Build custom Apptainer container images (`.sif`) and stage them in your OSDF directory.
3. Point your submit file at the container using `container_image`.

For data staging rules and container submit requirements, see [Moving data on the OSPool](../kb036-ospool-moving-data/). To build portable container images with an AI coding agent, see [Containerize your research software with an AI coding agent](../kb049-containerize-your-research/).

---

## 7. Next steps and support

- [Moving data on the OSPool](../kb036-ospool-moving-data/)
- [GPU jobs on the OSPool](../kb047-ospool-gpu-jobs/)
- [Common OSPool job types: sweeps, Monte Carlo, per-file pipelines and workflows](../kb048-ospool-common-job-types/)
- [Containerize your research software with an AI coding agent](../kb049-containerize-your-research/)

### Getting help

- **Research Computing:** we can help you decide whether your work fits and look over your first submit file. [Contact us](../../help/).
- **OSG Facilitators:** For access point issues, account quotas, and distributed computing questions, contact OSG facilitators at [support@osg-htc.org](mailto:support@osg-htc.org) or attend weekly OSG office hours on Tuesdays ([Zoom link](https://osg-htc.org/OfficeHoursZoom)).
