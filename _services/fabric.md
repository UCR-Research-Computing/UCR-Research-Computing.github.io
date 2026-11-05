---
title: "FABRIC testbed"
kicker: "National <span class='sep'>|</span> Networking and distributed-systems testbed"
description: "FABRIC is an NSF-funded national testbed where researchers and classes build their own networks of virtual machines, GPUs, FPGAs and programmable network hardware across sites in the US and abroad."
status: External
tags: [Networking, Testbed, GPU, FPGA, Jupyter]
data_levels: P1 only (no protected data)
owner: "FABRIC (the testbed); Research Computing (UCR guidance)"
reviewed: 2026-11-05
governed_by: "FABRIC acceptable use policy"
governed_url: https://learn.fabric-testbed.net/knowledge-base/fabric-acceptable-use-policy/
fit:
  - Networking research (new protocols, congestion control, SDN, P4 programmable switches, in-band telemetry)
  - Distributed-systems, edge and cybersecurity experiments that need machines in several places linked by real wide-area paths
  - Experiments that need direct access to hardware (SmartNICs, FPGAs, GPUs, NVMe) inside a VM you control
  - Classes and workshops that teach networking or systems with hands-on topologies
  - Researchers comfortable with Python and Jupyter notebooks
not_fit:
  - General batch computing or long simulations (use the HPCC, or NSF ACCESS for larger runs)
  - Many small independent jobs (use the OSG / OSPool)
  - Always-on servers, web apps or databases (consider Jetstream2)
  - Any protected data (P2 to P4)
  - Production services; slices are experiments with a finite lifetime
glance:
  - {k: "Who runs it", v: "The FABRIC team (NSF-funded), with sites at universities, national labs and network exchanges"}
  - {k: "What you build", v: "A slice: VMs at the sites you choose, connected by the network services you choose"}
  - {k: "Hardware", v: "VMs up to 64 cores, plus attachable GPUs, FPGAs, SmartNICs, NVMe and P4 switches at supported sites"}
  - {k: "How you work", v: "FABRIC JupyterHub and its Python library (FABlib), the web portal, or the API from your own computer"}
  - {k: "Sign-in", v: "Your UCR login through CILogon"}
  - {k: "Access", v: "Sign up with your UCR login, then join a project led by a faculty member or senior researcher"}
  - {k: "Cost", v: "No recharge from UCR"}
cta:
  - {label: "Get started", url: "/kb/kb051-fabric-getting-started/"}
  - {label: "FABRIC portal", url: "https://portal.fabric-testbed.net/"}
  - {label: "FABRIC Knowledge Base", url: "https://learn.fabric-testbed.net/"}
  - {label: "About FABRIC", url: "https://www.whatisfabric.net/"}
---

## What it is

FABRIC is a national research instrument for networking, distributed systems, cybersecurity and related computer science. Instead of submitting jobs to a cluster, you build a **slice**: a set of virtual machines placed at the FABRIC sites you choose, with the devices you need attached directly to them (GPUs, FPGAs, SmartNICs, NVMe drives), connected by the network services you choose. You then run your experiment on that topology, measure it and tear it down.

FABRIC sites are at universities, national labs and network exchange points across the US, with partner sites in Europe and Asia. Slices can also connect to other facilities, including the [National Research Platform]({{ '/services/nautilus/' | relative_url }}), cloud providers and campus networks.

## How you use it

FABRIC offers three ways in:

- **JupyterHub.** FABRIC runs a JupyterHub where you sign in with your UCR login and get a private notebook environment with FABRIC's Python library (FABlib) and a folder of example notebooks. FABRIC recommends starting here.
- **The portal.** Manage your projects and SSH keys, see which resources are available, and build simple slices with a graphical slice builder.
- **The API from your own computer.** FABlib installs from PyPI, so experiments can run from a laptop or a script once you are comfortable.

## Projects, roles and permissions

Everything on FABRIC is done on behalf of a **project**, and the project's permissions decide what its members can use.

- **Project Lead.** A faculty member or senior researcher who has been approved by FABRIC staff to lead projects. The lead creates the project and is responsible for the people in it.
- **Project Owner and Member.** Owners manage membership; members (students, postdocs, collaborators) use the testbed under the project's permissions.
- **Permissions.** New projects start with modest limits. Larger VMs, GPUs, FPGAs, P4 switches and some network features are unlocked by permission tags that FABRIC staff add at an owner's request, with a human review.
- **Renewal.** Projects have an expiration date and are renewed by request through the FABRIC help portal.

A signed-up FABRIC account on its own cannot create slices: you need to be in an active project first.

## Limits and guidelines

- **Data level.** P1 only. No protected data.
- **Slices are temporary.** Each slice has a lifetime and can usually be extended before it expires. Keep your code and results somewhere else.
- **Shared, reservable hardware.** Availability changes with demand. FABRIC's portal shows what is available at each site and when, so you can plan before you request.
- **Acceptable use.** Using FABRIC means accepting the [FABRIC acceptable use policy](https://learn.fabric-testbed.net/knowledge-base/fabric-acceptable-use-policy/). Publications that use FABRIC should [cite FABRIC](https://learn.fabric-testbed.net/knowledge-base/citing-fabric/).

## How to get started

1. **Sign up** at the [FABRIC portal](https://portal.fabric-testbed.net/) with your UCR login.
2. **Join a project.** Students and postdocs ask their PI or instructor to add them. Faculty and senior researchers can request to become a Project Lead and create a project for their group or class.
3. **Open JupyterHub**, run the "Configure Environment" notebook, then "Hello, FABRIC" to create your first slice.

Our [getting-started guide]({{ '/kb/kb051-fabric-getting-started/' | relative_url }}) walks through each step with the UCR specifics. Research Computing can help you decide whether FABRIC fits your work and get your group set up; [contact us]({{ '/help/' | relative_url }}).

## Related

- [NRP Nautilus]({{ '/services/nautilus/' | relative_url }}): Kubernetes, GPUs and JupyterHub on the National Research Platform, which FABRIC can connect to.
- [NSF ACCESS]({{ '/services/nsf-access/' | relative_url }}) and [Jetstream2]({{ '/services/jetstream2/' | relative_url }}): national computing allocations and cloud VMs.
- [OSG / OSPool]({{ '/services/osg/' | relative_url }}): distributed high-throughput computing.
