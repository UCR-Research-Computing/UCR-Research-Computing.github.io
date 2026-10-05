---
title: "Ursa Major service tiers (before October 2026)"
topic: Cloud
audience: "Projects set up under the earlier Ursa Major tiers"
archived: true
archived_note: "the Ursa Major tiers as they were before October 2026, when the baseline tier covered a list of general cloud services"
superseded_by: /kb/kb005-ursa-major-service-tiers/
superseded_by_title: "KB005: Ursa Major service tiers"
updated: 2026-02-17
owner: Research Computing
---

Ursa Major, UCR's Google Cloud research program, groups cloud resources into tiers. The tier decides how a resource is funded. This article summarizes the tiers as they were. The [Ursa Major guidelines](../ursa-major-guidelines/) and, for recharged projects, your MOU, are the governing terms.

## Tier 1: Baseline (the campus pool)

**Purpose:** give UCR labs access to cloud tools, chiefly AI services and archive, that are not available on campus.

**Funding:** covered by the campus pool under current terms, with no recharge to the lab, within limits and subject to eligibility. Pool coverage depends on continued campus funding and can change.

Services that have been covered by the pool include:

| Resource | Typical use |
| --- | --- |
| Standard general-purpose VMs | Light compute, small services |
| GKE | Container orchestration |
| Cloud Storage (Coldline class) | Long-term archive and backups |
| Cloud Storage (Standard class) | Small working datasets |
| Persistent disk (balanced) | VM boot and data disks |
| Cloud SQL | Managed databases |
| BigQuery | Analytics |
| Gemini API | Google's AI models |
| Vertex AI Search | Search and agent applications, within standard limits |

The current list, and the limits that apply, are confirmed when your project is set up. A service on this list may still be recharged if a project's usage goes beyond pool limits.

### Not covered by the pool

These are recharged to a lab funding source:

- Cloud GPUs (all types).
- High-performance machine families (for example `n1`, `c2`, `m1`, `c3`).
- Marketplace and third-party models (for example Claude, Llama, Mistral) through Vertex AI.
- Bare Metal Solution.

## Tier 2: Recharge

**Purpose:** cloud-native work that goes beyond pool limits or needs specialized resources.

**Funding:** billed to a lab funding source (COA) through ITS, at the rates in the University of California agreement with Google, under an MOU.

Common Tier 2 resources: Google Filestore (managed NFS), cloud GPUs, high-performance VMs, marketplace models, and large-scale instructional use. See [KB007: Ursa Major recharge workflow](../kb007-tier2-recharge-workflow/).

## Tier 3: Dedicated agreement

**Purpose:** large or multi-year projects that need their own contract terms.

**Funding:** a direct agreement between the lab and Google, with ITS administrative oversight.

## When the cloud is not the best fit

For GPU and large batch computing, other options are often a better fit or cost the lab less. Consider them first:

1. The **[HPCC cluster](../../services/hpcc/)**, the campus shared cluster: {% include fact.html id="hpcc_lab_fee" %}.
2. **[NRP Nautilus](../../services/nautilus/)**, for containerized GPU work on non-sensitive data.
3. The **[NAIRR Pilot](../../services/nairr/)**, for AI research allocations by application.
4. **[NSF ACCESS](../../services/nsf-access/)**, for national allocations by application.

[Ask us](../../help/) if you are unsure which fits.
