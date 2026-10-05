---
title: "Research Computing resource catalog"
kb_id: KB010
topic: General
audience: "All researchers"
updated: 2026-09-28
reviewed: 2026-10-04
owner: Research Computing
redirect_from:
  - /Knowledge_Base/KB010_Resource_Catalog.html
---

A one-page summary of the main compute options and what each is best for. The full, filterable catalog is on the [home page](../../), and [Compute](../../compute/) compares them side by side.

## Ursa Major (Google Cloud)

**Best for:** AI model access for research, exotic hardware not available on campus, and archive storage.

- Tier 1 (no recharge to the lab under current terms, within limits): AI model access with a per-lab allowance, exotic hardware (such as TPUs or Arm) through a Research Computing HPC cluster in Google Cloud, by consultation, and archive storage.
- Everything else (VMs, databases, analytics, Standard storage, GPUs) is recharged to a lab funding source.
- Details: [Ursa Major](../../services/ursa-major/) and [KB005: Ursa Major service tiers](../kb005-ursa-major-service-tiers/).

## Where to take GPU and advanced compute work

### 1. UCR HPCC (first choice for most work)

**Best for:** batch jobs, simulation, GPU training, MPI.

- The HPCC describes the cluster as {% include fact.html id="hpcc_hardware" %}. Current hardware is on the [HPCC hardware pages](https://hpcc.ucr.edu/about/hardware/details/).
- Cost: {% include fact.html id="hpcc_lab_fee" %}. Shared use is subject to the HPCC's quotas and queue policies.
- Access: SSH and Slurm. See [HPCC cluster](../../services/hpcc/).

### 2. NRP Nautilus

**Best for:** containers, web services and Jupyter notebooks on non-sensitive data.

- A Kubernetes platform shared across many institutions.
- No recharge from UCR. Access is through the NRP's own sign-up.
- Details: [NRP Nautilus](../../services/nautilus/).

### 3. NAIRR Pilot

**Best for:** AI research that needs more, or different, accelerators than campus offers.

- Allocations are awarded competitively by the program. No recharge from UCR.
- Details: [NAIRR Pilot](../../services/nairr/).

### 4. NSF ACCESS

**Best for:** virtual machines you fully control (Jetstream2), servers and web services, and HPC capacity beyond campus.

- Allocations are awarded by application. No recharge from UCR. Small Explore projects are the usual starting point.
- Step-by-step guide: [KB009: Using NSF ACCESS and Jetstream2](../kb009-using-nsf-access/).

If your work needs exotic hardware none of these offer, such as TPUs or Arm, ask us about Ursa Major Tier 1.

This order is a suggestion. The right choice depends on your work and data. [Ask us](../../help/).
