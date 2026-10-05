---
title: "Ursa Major HPC clusters"
topic: Cloud
audience: "Researchers who need their own cluster in Google Cloud"
reviewed: 2026-10-04
owner: Research Computing
redirect_from:
  - /Knowledge_Base/Ursa_Major_HPC_Clusters.html
---

**Two different things.** This guide is about a lab building **its own** Slurm cluster in its Ursa Major project. That is recharged to a lab funding source (COA) under an MOU.

Separately, Research Computing runs a shared HPC cluster in Google Cloud for **Tier 1 exotic hardware** the HPCC does not have, such as TPUs or Arm processors. Access starts with a consultation, and it is campus-supported under current terms, within limits set per project. See [KB005](../kb005-ursa-major-service-tiers/). [Ask us](../../help/) which fits.

For most batch and GPU work, the campus [HPCC cluster](../../services/hpcc/) is the first place to look and usually costs the lab less.

## What it is

Using Google's Cluster Toolkit, a lab can run its own Slurm cluster in its Ursa Major project:

- personal, lab or shared clusters;
- software installed to the lab's needs;
- compute nodes that scale up with the queue and down when idle (recharged by usage);
- clusters that can be stopped and restarted without losing data on persistent storage;
- connection to Cloud Storage and managed file systems (storage is charged separately).

## Getting started

* [Launching an Ursa Major HPC cluster](../ursa-major-cluster-launch/)
* [Connecting to a cluster and running a first job](../how-to-connect-to-hpc-cluster-run-sample-job/)
* [Google Cloud HPC solutions](https://cloud.google.com/solutions/hpc/)

[Talk to Research Computing](../../help/) before you build a cloud cluster. We can help you compare it with the HPCC and estimate costs.
