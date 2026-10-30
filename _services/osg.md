---
title: "OSG / OSPool"
kicker: "National <span class='sep'>|</span> Distributed high-throughput computing"
description: "The OSG's Open Science Pool runs large numbers of small, independent jobs on spare capacity contributed by institutions across the country."
status: External
tags: [High throughput, Batch, HTCondor]
data_levels: Non-sensitive only (P1; no protected data)
owner: "OSG (the service); Research Computing (UCR guidance)"
reviewed: 2026-10-29
governed_by: "OSG and OSPool policies"
governed_url: https://osg-htc.org/services/ospool/
redirect_from:
  - /pages/open_science_grid.html
fit:
  - Many independent jobs (parameter sweeps, Monte Carlo, per-sample pipelines)
  - Jobs that are short, restartable and need modest memory each
  - Researchers comfortable with HTCondor job descriptions
not_fit:
  - Tightly coupled MPI jobs (use the HPCC)
  - Sensitive data
  - Jobs that need large shared file systems or long uninterrupted runs
glance:
  - {k: "Who runs it", v: "OSG, with capacity from many institutions"}
  - {k: "Scheduler", v: "HTCondor"}
  - {k: "Cost", v: "No recharge from UCR"}
cta:
  - {label: "Researcher guide", url: "/kb/kb034-ospool-researcher-guide/"}
  - {label: "Get an account", url: "/kb/kb035-ospool-getting-access/"}
  - {label: "Submit jobs", url: "/kb/kb037-ospool-jobs-and-results/"}
  - {label: "About the OSPool", url: "https://osg-htc.org/services/ospool/"}
---

## What it is

OSG supports distributed high-throughput computing (dHTC): splitting work into many independent jobs that run wherever capacity is idle. The Open Science Pool (OSPool) is its shared pool for US-based researchers, made up of spare capacity contributed by institutions across the country.

UCR's HPCC is one of the sites that contributes capacity to the OSPool.

## Data for OSPool jobs

Files under 1 GB move with each job. Larger inputs and outputs, and container images, go through the [Open Science Data Federation (OSDF)]({{ '/services/osdf/' | relative_url }}), which comes with an OSPool account. Datasets you want to share widely can live in an [Open Storage Network]({{ '/services/osn/' | relative_url }}) bucket.

## How to get started

Start with our [researcher guide to the OSPool and OSDF]({{ '/kb/kb034-ospool-researcher-guide/' | relative_url }}), a series of four articles: what fits, [getting access]({{ '/kb/kb035-ospool-getting-access/' | relative_url }}), [moving data]({{ '/kb/kb036-ospool-moving-data/' | relative_url }}) and [submitting jobs and getting results]({{ '/kb/kb037-ospool-jobs-and-results/' | relative_url }}). There is no allocation proposal: you apply, meet an OSG facilitator, and get an account on an access point. If you are unsure whether your work fits, [ask us]({{ '/help/' | relative_url }}).
