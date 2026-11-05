---
title: "Chameleon testbed"
kicker: "National <span class='sep'>|</span> Bare-metal computer science testbed"
description: "Chameleon is an NSF-funded testbed for computer science research and education: reserve whole bare-metal servers (including GPUs, FPGAs and Arm) with root access, or virtual machines and edge devices, at sites in Chicago, Austin and Boulder."
status: External
tags: [Bare metal, Testbed, GPU, FPGA, Jupyter]
data_levels: P1 only (no protected data)
owner: "Chameleon (the testbed); Research Computing (UCR guidance)"
reviewed: 2026-11-05
governed_by: "Chameleon resource usage policies"
governed_url: https://chameleoncloud.org/learn/frequently-asked-questions/
fit:
  - Computer-systems research that needs a whole machine with root access (operating systems, kernels, virtualization, storage, power and performance studies)
  - Experiments that need a custom operating system image or bare-metal reconfiguration
  - Short GPU, FPGA or Arm experiments on hardware you control for up to a week at a time
  - Reproducible experiments packaged as Jupyter notebooks and shared through Chameleon's Trovi
  - Classes that teach systems, cloud or networking with hands-on machines
not_fit:
  - General research computing, long simulations or always-on services (use the HPCC, NSF ACCESS or Jetstream2)
  - Long GPU training runs; bare-metal and GPU leases last at most 7 days
  - Many small independent jobs (use the OSG / OSPool)
  - Any protected data (P2 to P4)
glance:
  - {k: "Who runs it", v: "The Chameleon team (NSF-funded): University of Chicago, TACC and NCAR"}
  - {k: "What you get", v: "Reserved bare-metal servers, KVM virtual machines, or edge devices (CHI@Edge)"}
  - {k: "Hardware", v: "Several hundred nodes, including GPUs, FPGAs, Arm, large-memory and storage nodes"}
  - {k: "How you work", v: "Web portal, Chameleon JupyterHub with the python-chi library, or the OpenStack command line"}
  - {k: "Sign-in", v: "Your UCR login (federated sign-in)"}
  - {k: "Access", v: "Join a project led by an approved PI (faculty or research staff)"}
  - {k: "Cost", v: "No recharge from UCR"}
cta:
  - {label: "Get started", url: "/kb/kb052-chameleon-getting-started/"}
  - {label: "Chameleon portal", url: "https://chameleoncloud.org/"}
  - {label: "Chameleon documentation", url: "https://chameleoncloud.readthedocs.io/en/latest/"}
  - {label: "Hardware", url: "https://chameleoncloud.org/hardware/"}
---

## What it is

Chameleon is a "deeply reconfigurable" testbed for computer science. Most clouds give you a slice of a shared machine. On Chameleon you reserve **whole physical servers** for your experiment, with root access, your choice of operating system image and direct access to the hardware: GPUs, FPGAs, Arm processors, large-memory and storage nodes, and programmable networking.

Chameleon runs bare-metal sites at the University of Chicago (CHI@UC), the Texas Advanced Computing Center (CHI@TACC) and the National Center for Atmospheric Research (CHI@NCAR), a virtual-machine cloud at TACC (KVM@TACC) and CHI@Edge for edge and IoT devices. Hardware differs by site, so you pick the site that has what you need.

## How you use it

- **The portal.** Find hardware, check the reservation calendars, reserve nodes, and launch and manage instances in a web interface.
- **JupyterHub and python-chi.** Chameleon's JupyterHub and Python library script a whole experiment (reserve, launch, configure, measure, release) so it can be rerun. Ready-made experiment patterns are shared on [Trovi](https://trovi.chameleoncloud.org/).
- **The command line.** Chameleon is built on OpenStack, so the OpenStack client works for scripting and automation.

## Projects, allocations and reservations

- **Projects.** All use happens inside a project. Its PI must be approved by Chameleon as PI-eligible: faculty and research staff at universities qualify, and students join their advisor's project.
- **Allocations.** A new project gets an allocation of service units (SUs) for six months, which the PI can extend or recharge by request. One SU is about one hour on a base bare-metal server; specialized nodes cost more per hour. See Chameleon's [FAQ](https://chameleoncloud.org/learn/frequently-asked-questions/) for the current allocation size and SU rates.
- **Reservations (leases).** Physical resources are reserved before use. Bare-metal and GPU leases last up to 7 days and can be renewed near the end; VM leases can run longer. Chameleon asks users not to stack back-to-back leases, and to save work between leases with snapshots instead.

## Limits and guidelines

- **Data level.** P1 only. No protected data.
- **Machines are temporary.** When a lease ends, the node is reclaimed. Save images with Chameleon's snapshot tool and keep data elsewhere.
- **Demand varies.** Popular hardware (especially GPUs) can be booked ahead; plan with the calendars and reserve in advance.
- **Acknowledgement.** Publications should acknowledge and cite Chameleon as described in its [FAQ](https://chameleoncloud.org/learn/frequently-asked-questions/).

## How to get started

1. **Sign in** at [chameleoncloud.org](https://chameleoncloud.org/) with your UCR login and accept the terms.
2. **Get into a project.** Students and postdocs ask their PI to add them. Faculty and research staff can request PI eligibility on their profile and then create a project.
3. **Reserve a node and launch an instance**, from the portal or from JupyterHub.

Our [getting-started guide]({{ '/kb/kb052-chameleon-getting-started/' | relative_url }}) walks through each step with the UCR specifics. Research Computing can help you decide whether Chameleon fits your work and get your group set up; [contact us]({{ '/help/' | relative_url }}).

## Related

- [FABRIC testbed]({{ '/services/fabric/' | relative_url }}): wide-area networking and distributed-systems experiments; Chameleon and FABRIC can be used together.
- [Jetstream2]({{ '/services/jetstream2/' | relative_url }}) and [NSF ACCESS]({{ '/services/nsf-access/' | relative_url }}): national cloud VMs and computing allocations for ongoing research work.
- [NRP Nautilus]({{ '/services/nautilus/' | relative_url }}): containers and GPUs on the National Research Platform.
