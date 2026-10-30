---
title: "Submitting OSPool jobs and getting results"
kb_id: KB037
topic: National
description: "Write an HTCondor submit file, run a small test, scale to many jobs, monitor and fix held jobs, and read the results."
audience: "UCR researchers with an OSPool account"
reviewed: 2026-10-29
owner: Research Computing
series: ospool
series_order: 4
review_notes:
  - "Written 2026-10-29 from 'Overview: Submit Jobs to the OSPool using HTCondor' and the Job Duration Categories page (portal.osg-htc.org/documentation, fetched 2026-10-29). The older 'Submitting jobs to OSG' article stays as a short summary."
  - "CHECK: none of the commands on this page have been run by RC yet (account pending as of 2026-10-29). Run the hello job, the 10-job sweep and a GPU test, then replace this note with what was seen."
---

## 1. The shape of an OSPool job

Every OSPool job has two parts:

- an **executable**: the script or program one job runs;
- a **submit file**: tells HTCondor what to run, which files to move, what resources one job needs and how many jobs to make.

## 2. A first test

On the access point, in your home directory, create `hello-ospool.sh`:

```bash
#!/bin/bash
echo "Hello OSPool from job $1 on $(hostname)"
sleep 60
```

and `hello-ospool.sub`:

```
executable = hello-ospool.sh
arguments  = $(Process)

log    = hello_$(Cluster)_$(Process).log
error  = hello_$(Cluster)_$(Process).err
output = hello_$(Cluster)_$(Process).out

+JobDurationCategory = "Medium"

request_cpus   = 1
request_memory = 1GB
request_disk   = 1GB

queue 3
```

Submit and watch it:

```bash
chmod +x hello-ospool.sh
condor_submit hello-ospool.sub
condor_q
```

When the jobs leave the queue, read the results:

```bash
cat hello_*.out
```

Each file names a different machine. That is the OSPool at work.

## 3. Choosing resources

- **Duration.** `+JobDurationCategory` is required on OSG-operated access points: `"Medium"` for jobs under 10 hours and `"Long"` for jobs under 20 hours. See [Job Duration Categories](https://portal.osg-htc.org/documentation/htc_workloads/workload_planning/jobdurationcategory/).
- **CPU, memory and disk.** Ask for what one job needs. Smaller requests match more machines and start sooner. Run a few test jobs, then read the memory and disk actually used in the `.log` file.
- **GPUs.** Add `request_gpus = 1`. GPU capacity is a smaller share of the pool, so expect longer waits.

## 4. Scaling up

Use one submit file for many jobs:

```
queue infile matching data/*.csv
```

or a list of arguments:

```
queue seed from seeds.txt
```

Test with a handful of jobs first, check the outputs, then submit the full set.

## 5. Monitoring and fixing problems

| Command | What it shows |
| --- | --- |
| `condor_q` | Your jobs: idle, running, held |
| `condor_q -nobatch` | One line per job |
| `condor_q -hold` | Why jobs are held |
| `condor_q -better-analyze JOBID` | Why a job is not starting |
| `condor_history -limit 20` | Recently finished jobs |
| `condor_rm JOBID` | Remove a job or cluster |
| `condor_release JOBID` | Release a held job after fixing the cause |

Common reasons for held jobs: a missing input file, an output transfer failure, using more memory or disk than requested, or a full quota.

## 6. Getting and viewing results

- Small outputs land next to your submit file. Each job also writes `.out`, `.err` and `.log` files.
- Large outputs sent with `transfer_output_remaps` land in your OSDF space (see [Moving data](../kb036-ospool-moving-data/)).
- Combine or summarize results on the access point, then copy them home with `rsync`.

## 7. Next steps

- Workflows with dependent steps: HTCondor DAGMan, described in the [OSPool documentation](https://portal.osg-htc.org/documentation/).
- Software: containers and pre-built environments, in the same documentation.
- Help: [support@osg-htc.org](mailto:support@osg-htc.org) or [Research Computing](../../help/).
