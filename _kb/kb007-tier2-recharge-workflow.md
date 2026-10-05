---
title: "Ursa Major recharge projects: how setup works"
kb_id: KB007
topic: Cloud
audience: "PIs and department administrators"
updated: 2026-02-13
reviewed: 2026-10-04
owner: Research Computing
redirect_from:
  - /Knowledge_Base/KB007_Tier2_Recharge_Workflow.html
---

Some Google Cloud projects are billed to a lab funding source, which covers all Ursa Major cloud work outside Tier 1 (for example VMs, databases, analytics, Standard storage, GPUs and marketplace models). This article describes how such a "Tier 2" recharge project is set up. See [KB005](../kb005-ursa-major-service-tiers/) for the tiers.

## The steps

**1. Request.** The PI submits a request through the [UCR Support Portal](https://ucrsupport.service-now.com/ucr_portal/) or to research-computing@ucr.edu.

**2. Scoping.** Research Computing confirms that the work needs a recharge project, explains the process, and collects:

- the technical requirements (APIs, GPUs and so on);
- the full chart of accounts (COA) string.

**3. MOU.** The ITS systems and finance teams prepare a Memorandum of Understanding (MOU) that sets out the recharge rates, the COA and the terms, and send it to the PI for signature.

**4. Billing setup.** Once the MOU is signed, ITS creates a billing account for the COA and links it to the project.

**5. Project creation.** ITS creates the project, configures billing export and sets up access for the people named.

**6. Handoff.** Research Computing confirms access with the PI and helps with initial setup (for example the Cloud SDK and signing in).

## Who does what

- **Research Computing:** your point of contact, technical scoping and onboarding.
- **ITS systems and finance teams:** the MOU, billing configuration and project creation.
- **The PI:** signing the MOU and financial responsibility for the project's usage.

How long setup takes depends mainly on how quickly the MOU is signed and routed.
