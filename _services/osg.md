---
title: "OSG / OSPool"
kicker: "National <span class='sep'>|</span> Distributed high-throughput computing"
description: "The OSG's Open Science Pool runs large numbers of small, independent jobs on spare capacity contributed by institutions across the country."
status: External
tags: [High throughput, Batch, HTCondor]
data_levels: Non-sensitive only (P1; no protected data)
owner: "OSG (the service); Research Computing (UCR guidance)"
reviewed: 2026-10-04
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
  - {label: "About the OSPool", url: "https://osg-htc.org/services/ospool/"}
  - {label: "Submitting jobs", url: "/kb/submit-job-to-osg/"}
---

## What it is

OSG supports distributed high-throughput computing (dHTC): splitting work into many independent jobs that run wherever capacity is idle. The Open Science Pool (OSPool) is its shared pool for US-based researchers, made up of spare capacity contributed by institutions across the country.

## How to get started

See [About the OSPool](https://osg-htc.org/services/ospool/) for how to get an account and an access point. Our [guide to submitting jobs to OSG]({{ '/kb/submit-job-to-osg/' | relative_url }}) shows the shape of an HTCondor job. If you are unsure whether your work fits dHTC, [ask us]({{ '/help/' | relative_url }}).
