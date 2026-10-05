---
title: "Ursa Major service tiers"
kb_id: KB005
topic: Cloud
audience: "PIs, researchers and lab managers"
reviewed: 2026-10-04
owner: Research Computing
redirect_from:
  - /Knowledge_Base/KB005_Ursa_Major_Service_Tiers.html
---

Ursa Major, UCR's Google Cloud research program, groups cloud resources into tiers. The tier decides how a resource is funded. This article summarizes the tiers. The [Ursa Major guidelines](../ursa-major-guidelines/) and, for recharged projects, your MOU, are the governing terms.

Projects set up before October 2026 may still be arranged under the earlier tiers, which covered a list of general cloud services. That arrangement is described in an [archived reference article](../ursa-major-service-tiers-pre-2026-10/).

## Tier 1: Campus-supported (no recharge to the lab under current terms)

**Purpose:** support research that campus systems cannot easily serve, in three areas. Tier 1 resources carry no recharge to the lab under current terms, within limits and subject to eligibility. They depend on continued campus funding and can change.

### 1. AI model access for research

Access to generative AI models for research and programming, through a service Research Computing manages, with a per-lab allowance. The allowance and the models offered are set when access is arranged and may change. Use beyond the allowance, and models or services outside it, are recharged.

### 2. Exotic hardware not available on campus

Hardware the HPCC cluster does not offer and that is hard to find elsewhere, such as Google Cloud TPUs or Arm processors, provided through a Research Computing HPC cluster in Google Cloud, within limits set per project.

Access starts with a consultation. We look at the work with you, confirm it needs hardware the HPCC does not have, and set the project's limits. Work that runs well on the HPCC belongs on the HPCC.

### 3. Archive storage

Google Cloud Storage archive classes (such as Coldline) for data you need to keep but rarely read. See [Cloud archive](../../services/cloud-archive/) and [KB012: Using Ursa Major archive storage](../kb012-migrating-data-to-archive/). Reading data back can carry retrieval charges.

## Tier 2: Recharge

**Purpose:** all other cloud work.

**Funding:** billed to a lab funding source (COA) through ITS, at the rates in the University of California agreement with Google, under an MOU.

Tier 2 includes general-purpose cloud services, for example:

- virtual machines and research workstations;
- GKE (Kubernetes) clusters;
- Cloud SQL and other managed databases;
- BigQuery and other analytics;
- Standard-class Cloud Storage, persistent disks and Google Filestore;
- cloud GPUs and high-performance machine types used outside Tier 1;
- marketplace and third-party models through Vertex AI;
- large-scale instructional use.

See [KB007: Ursa Major recharge workflow](../kb007-tier2-recharge-workflow/).

## Tier 3: Dedicated agreement

**Purpose:** large or multi-year projects that need their own contract terms.

**Funding:** a direct agreement between the lab and Google, with ITS administrative oversight.

## Regulated data: the secure research enclave

The [secure research enclave](../../services/secure-enclave/) is a separate environment, recharged to a grant-funded COA, for work under NIST SP 800-171 or CMMC Level 2 requirements, including controlled-access data such as NIH dbGaP. It is available after review, an approved data security plan and training.

## When the cloud is not the best fit

For GPU and large batch computing, other options are often a better fit or cost the lab less. Consider them first:

1. The **[HPCC cluster](../../services/hpcc/)**, the campus shared cluster: {% include fact.html id="hpcc_lab_fee" %}.
2. **[NRP Nautilus](../../services/nautilus/)**, for containerized GPU work on non-sensitive data.
3. The **[NAIRR Pilot](../../services/nairr/)**, for AI research allocations by application.
4. **[NSF ACCESS](../../services/nsf-access/)**, for national allocations by application.

[Ask us](../../help/) if you are unsure which fits.
