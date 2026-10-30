---
title: "Jetstream2"
kicker: "National <span class='sep'>|</span> Research cloud VMs, including NVIDIA A100 GPUs, through NSF ACCESS"
description: "NSF-funded research cloud at Indiana University: Linux virtual machines you fully control, with partial or full NVIDIA A100 GPUs, a web desktop and web shell, allocated through NSF ACCESS."
status: External
tags: [Cloud VMs, GPU, ACCESS]
data_levels: Non-sensitive only (P1-P2; no protected data)
owner: "Indiana University and partners (the service); Research Computing (UCR guidance)"
reviewed: 2026-10-30
governed_by: "ACCESS allocation policies and Jetstream2 policies"
governed_url: https://docs.jetstream-cloud.org/
fit:
  - A Linux machine you fully control (sudo), for hours or for months
  - A GPU machine with part of, or all of, an NVIDIA A100
  - Web apps, databases, Jupyter or RStudio servers with a public address
  - Classes and workshops that need many identical VMs
  - Software that does not suit a batch cluster
not_fit:
  - Any protected data (HIPAA, FERPA, PII, CUI and similar)
  - Large multi-node MPI jobs (use the HPCC or an ACCESS batch system)
  - The only copy of irreplaceable data
  - A permanent production service with no allocation behind it
glance:
  - {k: "Who runs it", v: "Indiana University, with NSF funding, as an ACCESS resource"}
  - {k: "Access", v: "An ACCESS project with Jetstream2 resources, then the Exosphere web interface"}
  - {k: "GPUs", v: "NVIDIA A100: a quarter, a half or a whole card per VM"}
  - {k: "Cost", v: "No recharge from UCR; ACCESS awards the allocation"}
cta:
  - {label: "Researcher guide", url: "/kb/kb042-jetstream2-researcher-guide/"}
  - {label: "Your first VM", url: "/kb/kb043-jetstream2-first-vm/"}
  - {label: "GPU VMs", url: "/kb/kb044-jetstream2-gpu-vms/"}
  - {label: "Jetstream2 documentation", url: "https://docs.jetstream-cloud.org/"}
---

## What it is

Jetstream2 is a research cloud funded by the NSF and run by Indiana University. You create your own Linux virtual machines (instances) in a web browser and get full administrator rights on them. Sizes run from one core to 64 cores, and GPU sizes come with part of, or all of, an NVIDIA A100. Each VM can have a web desktop, a web shell and SSH access.

Jetstream2 is allocated through [NSF ACCESS]({{ '/services/nsf-access/' | relative_url }}). Time is counted in service units (SUs): a VM uses SUs for every hour it runs, at a rate set by its size, and uses none while shelved.

## How it fits with other UCR compute

Use the [HPCC]({{ '/services/hpcc/' | relative_url }}) for batch jobs on campus. Use [NRP Nautilus]({{ '/services/nautilus/' | relative_url }}) for containers and GPU jobs on Kubernetes. Use Jetstream2 when you want a whole machine of your own: a server that stays up, a GPU you can log in to and work on interactively, or a set of identical VMs for a class.

## Data policy

Jetstream2 is for open research data. Do not put protected data on it (see the [data protection levels]({{ '/security/#data-protection-levels' | relative_url }})). You administer your VMs, so keeping them patched and locked down is your job.

## How to get started

Read the [researcher guide to Jetstream2]({{ '/kb/kb042-jetstream2-researcher-guide/' | relative_url }}). It covers getting an ACCESS project (see also [KB009]({{ '/kb/kb009-using-nsf-access/' | relative_url }})). Then follow [Your first Jetstream2 VM]({{ '/kb/kb043-jetstream2-first-vm/' | relative_url }}), and [GPU VMs on Jetstream2]({{ '/kb/kb044-jetstream2-gpu-vms/' | relative_url }}) if you need a GPU. Research Computing can look over an ACCESS request with you. [Contact us]({{ '/help/' | relative_url }}).
