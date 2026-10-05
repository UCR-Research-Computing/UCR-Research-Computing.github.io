---
title: "Submitting jobs to OSG"
topic: National
owner: Research Computing
reviewed: 2026-10-04
redirect_from:
  - /Knowledge_Base/submit-job-to-osg.html
review_notes:
  - "Rewrote the article around the current OSPool process (consultation request, orientation, access point registration) and the OSPool documentation's submit-file example, using the correct HTCondor terms (submit file, not JDL)."
  - "Added the required +JobDurationCategory line and resource requests, replaced +ProjectName as a required line with a note that it is only needed for users in several projects, and linked osg-htc.org and the OSG service page."
  - "CHECK: the OSPool documentation links (portal.osg-htc.org/documentation/...) resolved on 2026-10-04 but OSG reorganizes its docs from time to time."
---

The OSG's Open Science Pool (OSPool) runs large numbers of small, independent jobs on spare capacity contributed by institutions across the country. It suits work that splits into many short jobs, such as parameter sweeps, Monte Carlo runs and per-sample pipelines. Jobs are scheduled with HTCondor. See the [OSG / OSPool service page](../../services/osg/) for what fits, and [osg-htc.org](https://osg-htc.org) for the program itself.

## 1. Get access to an OSPool access point

An **access point** is the login server where you stage files and submit jobs. US-based researchers can request an account on an OSG-managed access point. The steps, described in [Overview of Requesting OSPool Access](https://portal.osg-htc.org/documentation/overview/account_setup/registration-and-login/), are:

1. Fill out the OSPool consultation request form linked from that page.
2. Meet with an OSG research computing facilitator for a short orientation about your work.
3. Register for an account on the access point you are assigned. Wait until a facilitator asks you to register.
4. Log in to the access point with SSH.

Your account is placed in an OSPool project, usually your research group, which is used to track usage.

## 2. Prepare your job

Before writing a submit file, work out:

- the executable or script to run and the input files it needs;
- how much memory, disk and how many CPU cores one job needs (run a test job to measure);
- how long one job runs. OSPool jobs should finish in under 20 hours, or save checkpoints so they can restart.

For example, a script `my_script.sh`:

```bash
#!/bin/bash
# my_script.sh: processes one input file given as the first argument
echo "Running on $(hostname) with input $1"
# your commands here
```

## 3. Write a submit file

An HTCondor **submit file** describes the job: what to run, which files to move, and what resources it needs. A basic example, `my_job.sub`, that runs the script on two input files:

```
# my_job.sub
executable = my_script.sh
arguments  = $(infile)

transfer_input_files = $(infile)

log    = job_$(Cluster)_$(Process).log
output = job_$(Cluster)_$(Process).out
error  = job_$(Cluster)_$(Process).err

# Required on OSG-managed access points: "Medium" (under 10 hours) or "Long" (under 20 hours)
+JobDurationCategory = "Medium"

request_cpus   = 1
request_memory = 1GB
request_disk   = 2GB

queue infile from (
  input_file1.txt
  input_file2.txt
)
```

Each line under `queue` becomes one job. HTCondor transfers the files to the machine that runs the job and copies output back to the submit directory when the job ends.

If you belong to more than one OSPool project, set the project for these jobs with a line such as `+ProjectName = "MyProject"`. Otherwise your default project is used.

See [Job Duration Categories](https://portal.osg-htc.org/documentation/htc_workloads/workload_planning/jobdurationcategory/) for the limits behind each category.

## 4. Submit and monitor

Submit the jobs from the directory that holds the submit file:

```bash
condor_submit my_job.sub
```

Check their status:

```bash
condor_q
```

Add `-nobatch` to list each job on its own line, or use `condor_watch_q` for a live view (press Ctrl+C to exit).

## 5. Review the results

When jobs finish they leave the queue, and their output, error and log files appear in the submit directory. The `.log` file records what happened to each job and compares the memory and disk it used with what you requested; use it to adjust your requests before scaling up.

## More help

- [Overview: Submit Jobs to the OSPool using HTCondor](https://portal.osg-htc.org/documentation/htc_workloads/workload_planning/htcondor_job_submission/), the OSPool's own walkthrough.
- [OSPool documentation](https://portal.osg-htc.org/documentation/), including data transfer, software containers and GPU jobs.
- [Policies for using OSG services and the OSPool](https://portal.osg-htc.org/documentation/overview/references/policy/). The OSPool is not suitable for sensitive data.
- OSG support: support@osg-htc.org, or see [getting help](https://portal.osg-htc.org/documentation/support_and_training/support/getting-help-from-RCFs/) for office hours.
- Research Computing can help you decide whether your work fits the OSPool, the HPCC or another option: research-computing@ucr.edu.
