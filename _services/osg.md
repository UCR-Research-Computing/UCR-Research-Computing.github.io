---
title: "OSG / OSPool"
kicker: "National <span class='sep'>|</span> Distributed high-throughput computing"
description: "The OSG's Open Science Pool runs large numbers of small, independent jobs, including GPU jobs, on spare capacity contributed by institutions across the country."
status: External
tags: [High throughput, Batch, HTCondor, GPU, Containers]
data_levels: Non-sensitive only (P1; no protected data)
owner: "OSG (the service); Research Computing (UCR guidance)"
reviewed: 2026-11-05
governed_by: "OSG and OSPool policies"
governed_url: https://osg-htc.org/services/ospool/
redirect_from:
  - /pages/open_science_grid.html
fit:
  - Many independent jobs (parameter sweeps, Monte Carlo, per-sample or per-file pipelines)
  - Jobs that each run on one machine, under about 20 hours, or that save checkpoints
  - Modest per-job needs (1 to 8 cores, a few GB of memory, inputs under a few GB)
  - Short GPU jobs that fit on one GPU (inference sweeps, many small trainings)
  - Researchers willing to describe jobs with HTCondor, or to ask an AI agent to help
not_fit:
  - Tightly coupled MPI jobs that span machines (use the HPCC)
  - Any protected data (P2 to P4)
  - Single jobs longer than about 20 hours without checkpointing
  - Work that needs a large shared file system, a database or a long-running service
  - Multi-GPU or multi-day model training (consider NRP Nautilus)
glance:
  - {k: "Who runs it", v: "OSG, with capacity from many institutions"}
  - {k: "Scheduler", v: "HTCondor, from an OSG access point"}
  - {k: "Hardware", v: "Shared CPUs and GPUs at many sites; the mix changes from day to day"}
  - {k: "Software", v: "Your own scripts, or containers (Apptainer or Docker images)"}
  - {k: "Access", v: "Apply, meet an OSG facilitator, get an access point account"}
  - {k: "Cost", v: "No recharge from UCR"}
cta:
  - {label: "Researcher guide", url: "/kb/kb034-ospool-researcher-guide/"}
  - {label: "Get an account", url: "/kb/kb035-ospool-getting-access/"}
  - {label: "Submit jobs", url: "/kb/kb037-ospool-jobs-and-results/"}
  - {label: "GPU jobs", url: "/kb/kb047-ospool-gpu-jobs/"}
  - {label: "Containerize your software", url: "/kb/kb049-containerize-your-research/"}
  - {label: "About the OSPool", url: "https://osg-htc.org/services/ospool/"}
---

## What it is

OSG supports distributed high-throughput computing (dHTC): splitting work into many independent jobs that run wherever capacity is idle. The Open Science Pool (OSPool) is its shared pool for US-based researchers, made up of spare capacity contributed by institutions across the country. You log in to an OSG **access point**, keep your files there, and submit jobs with HTCondor. HTCondor sends each job to an idle machine somewhere in the pool and brings the results back.

UCR's HPCC is one of the sites that contributes capacity to the OSPool.

## What it looks like in practice

Research Computing ran test jobs from an OSG access point on 2026-11-05. A 10-job Monte Carlo sweep started within about a minute and ran on machines at several universities. A GPU job got a GPU in about a minute and ran PyTorch inside an OSG-provided container. Our own container image, built on the access point, ran a 5-job sweep on machines at three universities.

- **CPUs.** Several thousand slots typically match a small one-core job. Smaller requests start sooner.
- **GPUs.** About a hundred GPUs were in the pool when we looked, from older cards to current data-center GPUs, at around twenty sites. The mix changes from day to day, so you ask for what your code needs (for example a minimum amount of GPU memory) rather than a model. See [GPU jobs on the OSPool]({{ '/kb/kb047-ospool-gpu-jobs/' | relative_url }}).
- **Software.** Simple, self-contained scripts run as they are. Bigger software stacks (Python or R packages, CUDA, bioinformatics tools) go in a container, either one of the images OSG provides or your own. See [Containerize your research software]({{ '/kb/kb049-containerize-your-research/' | relative_url }}).

## Limits and guidelines

The OSPool documentation sets these, and access points enforce some of them when you submit:

- **Job length.** Label each job Medium (expected under 10 hours) or Long (expected under 20 hours). Jobs that run past their category's maximum are held. Work longer than about 20 hours per job should be split up or save checkpoints.
- **Cores and memory.** One core and a couple of GB of memory match the most machines. Requests up to about 8 cores, and larger memory, are possible but wait longer.
- **Data per job.** Files under 1 GB move with each job. Larger files and container images go through the [OSDF]({{ '/services/osdf/' | relative_url }}).
- **Quotas.** Your home and data directories on the access point have quotas, shown in the login message.
- **Data level.** P1 only. No protected data.
- **Acknowledgement.** Using an access point means accepting the [OSG acceptable use policy](https://osg-htc.org/end-user-aup); publications should [acknowledge the OSPool](https://osg-htc.org/acknowledging).

The [researcher guide]({{ '/kb/kb034-ospool-researcher-guide/' | relative_url }}) explains each of these with examples.

## Data for OSPool jobs

Files under 1 GB move with each job. Larger inputs and outputs, and container images, go through the [Open Science Data Federation (OSDF)]({{ '/services/osdf/' | relative_url }}), which comes with an OSPool account. Datasets you want to share widely can live in an [Open Storage Network]({{ '/services/osn/' | relative_url }}) bucket.

## How to get started

Start with our [researcher guide to the OSPool and OSDF]({{ '/kb/kb034-ospool-researcher-guide/' | relative_url }}), a series of six articles:

1. [What fits, limits and guidelines]({{ '/kb/kb034-ospool-researcher-guide/' | relative_url }})
2. [Getting an account and logging in]({{ '/kb/kb035-ospool-getting-access/' | relative_url }})
3. [Moving data]({{ '/kb/kb036-ospool-moving-data/' | relative_url }})
4. [Submitting jobs and getting results]({{ '/kb/kb037-ospool-jobs-and-results/' | relative_url }})
5. [GPU jobs]({{ '/kb/kb047-ospool-gpu-jobs/' | relative_url }})
6. [Common job types: sweeps, Monte Carlo, per-file pipelines and workflows]({{ '/kb/kb048-ospool-common-job-types/' | relative_url }})

If your software needs packages or libraries, [Containerize your research software with an AI coding agent]({{ '/kb/kb049-containerize-your-research/' | relative_url }}) shows how to package it once so it runs on the OSPool, NRP Nautilus and Google Cloud.

There is no allocation proposal: you apply, meet an OSG facilitator, and get an account on an access point. If you are unsure whether your work fits, [ask us]({{ '/help/' | relative_url }}). Research Computing can help you decide and look over your first submit file. OSG facilitators run the service, approve accounts and hold weekly office hours ([support@osg-htc.org](mailto:support@osg-htc.org)).
