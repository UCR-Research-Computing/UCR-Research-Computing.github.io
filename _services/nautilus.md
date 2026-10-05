---
title: "NRP Nautilus"
kicker: "National <span class='sep'>|</span> National Research Platform"
description: "A shared Kubernetes platform for containerized research and education workloads, with CPUs, GPUs and storage contributed by many institutions."
status: External
tags: [Containers, Kubernetes, GPU, Jupyter]
data_levels: Public / non-sensitive only
owner: "National Research Platform (the platform); Research Computing (UCR guidance)"
reviewed: 2026-10-04
governed_by: "NRP policies and acceptable use policy"
governed_url: https://nrp.ai/documentation/userdocs/start/policies/
redirect_from:
  - /pages/Nautilus.html
fit:
  - Containerized workloads, including GPU jobs
  - JupyterHub and interactive notebooks
  - Collaborations that span several institutions
not_fit:
  - Any protected data (HIPAA, FERPA, PII and similar); the NRP does not permit it
  - Researchers who cannot work with containers and Kubernetes
  - Work that needs reserved or predictable capacity
glance:
  - {k: "Who runs it", v: "The National Research Platform, a multi-institution partnership"}
  - {k: "Access", v: "Through the NRP's own sign-up and namespaces"}
  - {k: "Cost", v: "No recharge from UCR"}
  - {k: "Data allowed", v: "Non-sensitive data only, per NRP policy"}
cta:
  - {label: "Get started with NRP", url: "https://nrp.ai/documentation/userdocs/start/getting-started/"}
  - {label: "NRP policies", url: "https://nrp.ai/documentation/userdocs/start/policies/"}
---

## What it is

The National Research Platform (NRP) is a partnership of many institutions supported by federal funding. Its Nautilus cluster runs containerized research and education workloads on Kubernetes, with a mix of CPUs and GPUs and several storage options. UCR participates in the platform.

## Data policy

The NRP states that its systems have no storage suitable for HIPAA, PII, FISMA, FERPA or other protected data, and that such data must not be stored there. Read the [NRP policies](https://nrp.ai/documentation/userdocs/start/policies/) before you start.

## How to get started

The [NRP documentation](https://nrp.ai/documentation/) covers getting access, running GPU pods and batch jobs, storage, JupyterHub and support channels. For UCR-specific questions, or help deciding whether Nautilus or the HPCC fits your work, [contact Research Computing]({{ '/help/' | relative_url }}).
