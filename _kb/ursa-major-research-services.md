---
title: "Ursa Major research services"
audience: "Researchers considering Google Cloud"
reviewed: 2026-10-22
review_notes:
  - "2026-10-22: rewritten from older marketing copy after a multi-model wording review: removed patient-data examples (clinical data follows KB006), the claim that cloud resources never run out (every project has a budget cap), and the same-day promise."
topic: Cloud
owner: Research Computing
redirect_from:
  - /Knowledge_Base/Ursa_Major_Research_Services.html
  - /Knowledge_Base/Ursa_Major.html
---

Ursa Major is UCR's research program on Google Cloud, run by Research Computing with ITS. This page describes the kinds of Google Cloud services a lab can use through it. For what is campus-supported and what is recharged, see [KB005: Ursa Major service tiers](../kb005-ursa-major-service-tiers/).

## What is campus-supported, and what is recharged

Under current terms, three Ursa Major areas carry no recharge to the lab, within limits and subject to eligibility: AI model access for research (with a per-lab allowance), exotic hardware the HPCC does not have (such as TPUs or Arm, by consultation), and archive storage. Everything else on this page, including the analytics, data management and machine learning platforms, is Tier 2: recharged to a lab funding source under an MOU.

Every Ursa Major project has a budget, and work stops when it is reached. See [project budgets](../ursa-major-project-budget/). For long-running batch or GPU work, the campus [HPCC cluster](../../services/hpcc/) is usually the better fit and costs the lab less.

## Services labs use (recharged unless Tier 1 covers them)

- **Data analytics.** [BigQuery](https://cloud.google.com/bigquery) for querying large tables with SQL, for example years of public sensor or survey data.
- **Storage.** [Cloud Storage](https://cloud.google.com/storage) buckets for data used by cloud workloads. Archive classes are covered under Tier 1 within limits; see [Cloud archive](../../services/cloud-archive/).
- **Machine learning platforms.** [Vertex AI](https://cloud.google.com/vertex-ai) for training, tuning and serving your own models. Calling generative AI models from research code is Tier 1 AI model access instead; ask us how it is arranged.
- **Virtual machines and containers.** [Research workstations](../ursa-major-research-workstations/) and GKE clusters, for software that needs a specific operating system or administrator rights.
- **Public datasets.** Google hosts many [public datasets](https://cloud.google.com/datasets) that can be queried in place.
- **Collaboration.** Projects can include collaborators from other institutions, with access controlled by the PI.

## Data

Ursa Major projects are for P1 and P2 data by default. P3 and P4 data need a review and an approved data security plan before they are stored; see [Security and Data](../../security/). Clinical data and HIPAA applications follow a different path: see [KB006](../kb006-som-clinical-apps/).

Google Cloud provides encryption, access control and data governance tools. Researchers are responsible for configuring them for their data.

## Getting started

Email [research-computing@ucr.edu](mailto:research-computing@ucr.edu?subject=Ursa%20Major) with a short description of the project, the data and its protection level, and a funding source if recharged work is likely. See [KB021: Requesting an Ursa Major project](../kb021-ursa-major-project-request/).
