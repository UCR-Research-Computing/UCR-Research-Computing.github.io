---
title: "What is High-Performance Computing (HPC)?"
topic: HPCC
owner: Research Computing
reviewed: 2026-10-04
review_notes:
  - "Removed marketing language, and the wording that grouped Ursa Major with the HPCC as one HPC offering; the HPCC and Ursa Major are now described as separate services with their own links."
  - "Added a short explanation of clusters, schedulers and when HPC helps, plus links to the HPCC first-job guide."
redirect_from:
  - /Knowledge_Base/What_is_HPC.html
---

High-performance computing (HPC) means using many computers together to solve problems too large or too slow for a single workstation. An HPC cluster links many servers (nodes) with a fast network and shared storage, so one job can use many CPU cores, GPUs or large amounts of memory at once, and many jobs can run side by side.

## How a cluster is used

* You log in to a **head node** over SSH and prepare your files and scripts.
* You describe what your job needs (cores, memory, GPUs, time) and submit it to a **scheduler**, such as Slurm.
* The scheduler runs the job on **compute nodes** when the resources become available and writes the results to shared storage.

## When HPC helps

* Work that can be split into many independent pieces, such as running the same analysis on hundreds of samples.
* Programs that use many cores or GPUs at once, such as simulations, genome assembly or model training.
* Jobs that need more memory or storage than a laptop or workstation has.

## HPC at UCR

* **HPCC:** the campus HPC cluster run by the High-Performance Computing Center. See [HPCC](../../services/hpcc/), the HPCC website at [hpcc.ucr.edu](https://hpcc.ucr.edu), and [Connecting to the HPC cluster](../how-to-connect-to-hpc-cluster-run-sample-job/) for a first job.
* **Ursa Major:** UCR's Google Cloud program, a separate service run by Research Computing. It covers cloud resources, including hardware not available on the HPCC. See [Ursa Major](../../services/ursa-major/) and [Ursa Major service tiers](../kb005-ursa-major-service-tiers/).
* **National resources** such as [NSF ACCESS](../../services/nsf-access/) and the [NAIRR Pilot](../../services/nairr/).

For an overview of all options, see [Computing resources](../../compute/).
