---
title: "Ursa Major (Google Cloud)"
kicker: "Cloud <span class='sep'>|</span> UCR's Google Cloud research program"
description: "UCR's Google Cloud research program: AI model access, exotic hardware not available on campus, and archive storage, plus recharged cloud projects for everything else."
status: By review
tags: [Cloud, AI access, Exotic hardware, Archive]
data_levels: P1-P2 by default
owner: "Research Computing"
reviewed: 2026-10-04
governed_by: "Ursa Major guidelines"
governed_url_rel: /kb/ursa-major-guidelines/
redirect_from:
  - /pages/ursa_major.html
  - /pages/ursa-major-ask.html
fit:
  - Generative AI model access for research and programming
  - Work that needs exotic hardware the HPCC does not have, such as TPUs or Arm processors
  - Long-term archive of data you must keep but rarely read
  - Cloud-native work (VMs, containers, databases, analytics), as a recharged project
not_fit:
  - Batch or GPU computing that runs well on the HPCC
  - Regulated data outside an approved environment (see the secure enclave)
  - Individual accounts not tied to a lab or PI project
  - Projects expecting Research Computing to fund recharged usage
glance:
  - {k: "Who can use it", v: "UCR PIs and their lab members, in a project anchored to the PI"}
  - {k: "How it is allocated", v: "By request and review, under a tiered framework"}
  - {k: "Tier 1 (campus-supported)", v: "AI model access, exotic hardware and archive storage: no recharge to the lab under current terms, within limits"}
  - {k: "Everything else", v: "Recharged to a lab funding source under an MOU"}
  - {k: "Data allowed", v: "P1 and P2 by default"}
cta:
  - {label: "Ask about a project", url: "/help/"}
  - {label: "Read the guidelines", url: "/kb/ursa-major-guidelines/"}
---

## What it is

Ursa Major is UCR's research program on Google Cloud, run by Research Computing with ITS. It focuses campus support on what campus systems cannot easily provide: access to AI models for research, exotic hardware the HPCC does not have, and long-term archive. Other cloud work is available as recharged projects. It complements, rather than replaces, the campus cluster.

## How allocation works

Requests are reviewed against current campus resources, funding and research priorities. Resources fall into tiers:

- **Tier 1, campus-supported.** Three things, with no recharge to the lab under current terms, within limits and subject to eligibility:
  - **AI model access** for research and programming, through a service Research Computing manages, with a per-lab allowance;
  - **exotic hardware** not available on the HPCC, such as TPUs or Arm processors, through a Research Computing HPC cluster in Google Cloud, within limits set per project, starting with a consultation;
  - **archive storage** in Google Cloud archive classes.
- **Tier 2, recharge.** All other cloud work, including VMs, GKE, Cloud SQL, BigQuery, Standard storage, GPUs and marketplace models, billed to a lab funding source through ITS.
- **Tier 3, dedicated agreements.** Very large or multi-year projects may need their own contract with the provider, with ITS oversight.

[KB005: Ursa Major service tiers]({{ '/kb/kb005-ursa-major-service-tiers/' | relative_url }}) describes the tiers in more detail.

{% include fact.html id="cloud_admin_setup" bare=true %} and {% include fact.html id="cloud_admin_annual" bare=true %} administrative fees can apply to recharged cloud accounts. These are set out in the MOU for the account.

## Costs and campus support

Tier 1 is funded from campus sources and depends on continued funding. Research Computing does not commit to how long any service will remain without recharge. Lab-funded (recharged) use is billed at the rates in your MOU.

Projects set up before October 2026 may still be arranged under the earlier tiers. See the [archived description]({{ '/kb/ursa-major-service-tiers-pre-2026-10/' | relative_url }}).

## How to get started

[Contact Research Computing]({{ '/help/' | relative_url }}) with a short description of the project, the data involved (and its protection level), which Tier 1 area you need (if any), and a funding source if recharged work is likely. Student requests are approved by the student's PI and placed in the PI's project.

## Related

- [AI at UCR]({{ '/compute/cloud-and-ai/' | relative_url }}) for campus AI tools and where their terms are published.
- [Cloud archive]({{ '/services/cloud-archive/' | relative_url }}) for long-term data retention in Google Cloud.
- [KB007: Ursa Major recharge workflow]({{ '/kb/kb007-tier2-recharge-workflow/' | relative_url }}) for setting up a recharged project.
