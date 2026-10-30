---
title: "Researcher guide to Jetstream2"
kb_id: KB042
topic: Compute
description: "What Jetstream2 is, when to use it, how VM sizes and service units work, and the path from an ACCESS project to a running VM or GPU VM."
audience: "UCR faculty, postdocs, staff and students who need a Linux machine or a GPU machine they fully control"
reviewed: 2026-10-30
owner: Research Computing
series: jetstream2
series_order: 1
review_notes:
  - "Written 2026-10-30 from the Jetstream2 documentation (Instance Flavors, Budgeting, Instance Management, GPU FAQ; docs.jetstream-cloud.org, fetched 2026-10-30) and the ACCESS resource list (allocations.access-ci.org/resources.json)."
  - "Tested 2026-10-30 on the Research Computing Campus Champion allocation: created an m3.quad CPU VM and a g3.medium GPU VM (Ubuntu 24.04) in Exosphere, connected by SSH, web shell and web desktop, ran Docker, Python, JupyterLab and PyTorch, then shelved both."
---

## 1. What Jetstream2 is

Jetstream2 is a **research cloud** funded by the NSF and run by Indiana University. You create Linux **virtual machines** (Jetstream2 calls them *instances*) in a web browser and get full administrator rights (`sudo`). A VM can run for an hour or for months.

What you get on each VM, as tested by Research Computing:

- Ubuntu 24.04 (or Rocky Linux) with Docker and Python already installed;
- a **web shell** and a **web desktop** in the browser, plus SSH;
- the Jetstream2 software collection (R, RStudio, MATLAB, Intel compilers, Miniforge, Apptainer and NVIDIA HPC SDK) through `module load`;
- on GPU sizes, an NVIDIA A100 (part of a card, or a whole card) with the driver and CUDA already set up.

## 2. When to use it

| You want to | Use |
| --- | --- |
| Run batch jobs, Slurm or MPI on campus | [HPCC](../../services/hpcc/) |
| Run containers or GPU jobs on Kubernetes | [NRP Nautilus](../../services/nautilus/) |
| Have a Linux machine you fully control, with `sudo` | **Jetstream2** |
| Log in to a GPU and work on it interactively | **Jetstream2** GPU sizes |
| Host a web app, database, Jupyter or RStudio server | **Jetstream2** (or Nautilus for containers) |
| Give a class identical VMs | **Jetstream2** |
| Work with protected data | Not Jetstream2: see [secure research computing](../../services/secure-enclave/) |

## 3. Sizes and service units

Time on Jetstream2 is counted in **service units (SUs)**. A VM uses SUs for every hour it exists in a running state, at a rate set by its size (its *flavor*). A **shelved** VM uses none.

Common sizes (from the [Jetstream2 flavor list](https://docs.jetstream-cloud.org/general/vmsizes/)):

| Flavor | Cores | RAM | Disk | GPU | SUs per hour |
| --- | --- | --- | --- | --- | --- |
| m3.tiny | 1 | 3 GB | 20 GB | none | 1 |
| m3.small | 2 | 6 GB | 20 GB | none | 2 |
| m3.quad | 4 | 15 GB | 20 GB | none | 4 |
| m3.medium | 8 | 30 GB | 60 GB | none | 8 |
| m3.large | 16 | 60 GB | 60 GB | none | 16 |
| g3.medium | 8 | 30 GB | 60 GB | 25% of an A100 (10 GB GPU memory) | 16 |
| g3.large | 16 | 60 GB | 60 GB | 50% of an A100 (20 GB) | 32 |
| g3.xl | 32 | 120 GB | 60 GB | a whole A100 (40 GB) | 64 |

Larger CPU sizes, large-memory sizes, and L40S and H100 GPU sizes also exist. Some need a request to the Jetstream2 help desk.

Some arithmetic to plan with:

- an m3.quad running every working day, 8 hours a day, for a month uses about 700 SUs (4 x 8 x 22);
- a g3.medium left on for a week uses about 2,700 SUs (16 x 24 x 7);
- **shelve VMs you are not using.** Shelving is the single biggest saving.

## 4. Three separate resources

Jetstream2 CPU, Jetstream2 GPU and Jetstream2 Large Memory are **separate ACCESS resources**. When you exchange ACCESS credits, pick each one you need. Having CPU time does not let you start a GPU VM. One ACCESS credit buys one Jetstream2 SU.

## 5. The path to a running VM

1. **Get an ACCESS account and project.** An *Explore* project is usually enough to start and is often approved within a few business days. Follow [KB009: Using NSF ACCESS](../kb009-using-nsf-access/).
2. **Exchange credits** for Jetstream2 (CPU), and Jetstream2 GPU if you need GPUs, in the [ACCESS allocations portal](https://allocations.access-ci.org/).
3. **Sign in to Exosphere** at [jetstream2.exosphere.app](https://jetstream2.exosphere.app/) with your ACCESS identity.
4. **Create a VM**, then connect to it: [Your first Jetstream2 VM](../kb043-jetstream2-first-vm/).
5. For GPUs, see [GPU VMs on Jetstream2](../kb044-jetstream2-gpu-vms/).
6. To manage your VMs and your SUs, see [Managing Jetstream2 VMs and SUs](../kb045-jetstream2-managing-vms/).

## 6. Your responsibilities

- You are the administrator of your VMs: install updates, use SSH keys, and open only the ports you need.
- Keep a copy of important data somewhere else (for example [CephRDS](../../services/cephrds/) or an [OSN](../../services/osn/) bucket). VMs and allocations end.
- Follow the [Jetstream2 acceptable use policy](https://docs.jetstream-cloud.org/) and your ACCESS project's terms.

## 7. Help

- Jetstream2 documentation: [docs.jetstream-cloud.org](https://docs.jetstream-cloud.org/)
- Jetstream2 help desk: help@jetstream-cloud.org (VM problems, larger sizes, GPU access)
- ACCESS questions: [ACCESS support](https://support.access-ci.org/)
- Choosing a platform, or an ACCESS request: [contact Research Computing](../../help/)
