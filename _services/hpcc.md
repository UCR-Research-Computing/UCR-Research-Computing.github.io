---
title: "HPCC cluster"
kicker: "Campus compute <span class='sep'>|</span> Operated by the HPCC"
description: "The campus shared cluster for batch computing: simulations, pipelines, MPI and GPU jobs, scheduled with Slurm."
status: Available
tags: [Batch + GPU, Slurm, Lab subscription]
data_levels: P1-P2
owner: "High-Performance Computing Center (HPCC)"
reviewed: 2026-10-04
governed_by: "HPCC Recharging Rates 2026/2027 and HPCC policies"
governed_url: https://hpcc.ucr.edu/about/overview/rates/
redirect_from:
  - /pages/HPCC.html
fit:
  - Batch jobs you can queue and walk away from
  - Many-core or multi-node MPI work
  - GPU training and inference run as batch jobs
  - Pipelines with many independent tasks
not_fit:
  - Data rated P3 or P4 (see the secure enclave)
  - Always-on web services or databases
  - Work that needs a dedicated machine at a fixed time
  - Long-term storage of finished data
glance:
  - {k: "Who can use it", v: "Members of a UCR lab with an HPCC subscription, approved by the PI"}
  - {k: "Scheduler", v: "Slurm"}
  - {k: "Size", fact: hpcc_hardware}
  - {k: "Cost", fact: hpcc_lab_fee}
  - {k: "CPU quotas", fact: hpcc_cpu_quota}
  - {k: "Data allowed", v: "P1 and P2"}
cta:
  - {label: "Request an account", url: "https://hpcc.ucr.edu/about/overview/access/"}
  - {label: "Login instructions", url: "https://hpcc.ucr.edu/manuals/access/login/"}
---

## What you get

The High-Performance Computing Center (HPCC) runs UCR's shared research cluster. Lab members share access to its CPU and GPU partitions, a large library of installed software, parallel storage and HPCC workshops. The HPCC currently describes the cluster as {% include fact.html id="hpcc_hardware" %}, with {% include fact.html id="hpcc_software" %}.

Hardware, partitions and software change over time. The HPCC's [hardware pages](https://hpcc.ucr.edu/about/hardware/details/) are the authoritative and current description.

## Costs

Access is through an annual lab registration paid from a UCR funding source: {% include fact.html id="hpcc_lab_fee" %}. Additional storage can be rented ({% include fact.html id="hpcc_storage_rent_tb" bare=true %}, or {% include fact.html id="hpcc_storage_rent_gb" bare=true %}) or bought as lab-owned disk with an annual maintenance fee. A labor rate applies to work beyond the included consultation.

Rates for external collaborators differ. The [HPCC Recharging Rates](https://hpcc.ucr.edu/about/overview/rates/) document is the authority on every figure here, and the rate sheet in force when you are billed is the one that applies. See [Costs]({{ '/costs/' | relative_url }}) for how recharge works across services.

## Limits and fair use

The cluster is shared. The HPCC sets per-user and per-lab CPU quotas: currently {% include fact.html id="hpcc_cpu_quota" %}. Jobs over a quota are accepted but wait in the queue until resources within the quota become available. Queue priorities and maximum run times also apply and may be adjusted by the HPCC as demand changes. Start times for queued jobs depend on demand and are not predictable.

## How to get access

Account requests go to the HPCC by email from the PI, or with the PI copied, as described on the HPCC [Access page](https://hpcc.ucr.edu/about/overview/access/). A lab that is not yet registered provides a funding source (COA) for the annual registration. Once the account exists, follow the HPCC [login instructions](https://hpcc.ucr.edu/manuals/access/login/).

## Connect and run

You sign in over SSH and submit work with Slurm. The HPCC [manuals](https://hpcc.ucr.edu/manuals/) cover logging in, transferring data, the module system, and writing job scripts. Moving work from a cloud VM to the cluster is covered in [KB022: Migrating workloads from Google Cloud to HPCC]({{ '/kb/kb022-migrating-compute-to-hpcc/' | relative_url }}).

## Get help

For cluster questions (accounts, jobs, software installs), contact the HPCC directly through the channels on their site. For help choosing between the HPCC and other options, or planning a project, [contact Research Computing]({{ '/help/' | relative_url }}).
