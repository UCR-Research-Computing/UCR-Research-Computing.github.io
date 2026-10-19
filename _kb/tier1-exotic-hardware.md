---
title: "Tier 1 exotic hardware: how access works"
topic: Cloud
description: "How a UCR research project gets campus-supported access to hardware the HPCC cluster does not have, such as Google Cloud TPUs or Arm processors: what qualifies, the consultation, and what to bring."
audience: "PIs and researchers whose work needs hardware the HPCC cluster does not offer"
reviewed: 2026-10-19
owner: Research Computing
unlisted: true
sitemap: false
review_notes:
  - "Unlisted on purpose (2026-10-19): shared by link with groups Research Computing is already talking to, not announced. Scope gate (Chuck, 2026-10-19): this page describes only hardware the HPCC does not have. It says nothing about general CPU, GPU, high-memory or fast-clock compute, a web portal, the software stack, AI tools on the cluster, or the reason the cluster exists, because those overlap with the HPCC or are internal."
  - "Examples are TPUs and Arm only, per the standing rule in docs/SPEC.md (Chuck, 2026-10-04); say 'Arm processors' with no product name (Chuck, 2026-10-19). Wording follows the live site: 'a Research Computing HPC cluster in Google Cloud', and limits set as a budget with work stopping at the cap, as in KB005 (Chuck, 2026-10-19). Checked against the HPCC's hardware list and node sheet on 2026-10-19: no TPU and no Arm nodes. Google lists TPU and Arm machine types in us-central1 (gcloud, 2026-10-19)."
  - "No partition for either exists yet, and the Cloud TPU API is not yet enabled in the cluster project, so the page says hardware is set up per project after a consultation and promises no timeline. No prices: use is within limits set per project, as in KB005."
---

Some research needs hardware that the campus [HPCC cluster](../../services/hpcc/) does not have. Under [Ursa Major Tier 1](../kb005-ursa-major-service-tiers/), Research Computing can provide that hardware through a Research Computing HPC cluster in Google Cloud, with no recharge to the lab under current terms, within limits set per project.

This page explains what qualifies and how access works.

## Start with the HPCC

The HPCC is the place for batch computing at UCR, including CPU, high-memory and GPU work. If your work runs well there, it belongs there. See the [HPCC service page](../../services/hpcc/) to get an account. Tier 1 hardware is only for work the HPCC cannot readily run.

## What qualifies

Hardware the HPCC cluster does not offer and that is hard to find elsewhere. Two examples:

* **Google Cloud TPUs** (Tensor Processing Units), Google's accelerators for training and running machine learning models. TPU code is usually written in JAX, or in PyTorch or TensorFlow with TPU support.
* **Arm processors**, for building, testing and benchmarking software on Arm, or for work that is tied to that architecture.

If you have another kind of hardware in mind, ask. The test is the same: the work needs hardware the HPCC does not have.

## How access works

1. **Consultation.** Email Research Computing (below) with a short description of the work. We meet with you, look at the work, and confirm that it needs hardware the HPCC does not have.
2. **Limits.** We agree the project's limits with you: the hardware, how much of it, and for how long. Research Computing sets the limit as a budget on the project, and work stops when the budget is reached (see [project budgets](../ursa-major-project-budget/)).
3. **Setup.** We set the hardware up for your project on the cluster and add the people who will use it. You sign in with your UCR Google account. There is no separate password.
4. **Work.** You run your jobs within the agreed limits. We check in with you as the work goes, and adjust the limits if the work changes.

Hardware is set up per project, so plan for some lead time between the consultation and the first run. Cloud capacity for some accelerators also varies.

## What to bring to the consultation

* What the research is, and who will run the work.
* Why it needs this hardware: for example, a model written for TPUs, or software that has to be built and tested on Arm.
* Whether the code already runs on the target hardware, or still needs porting.
* A rough size: how many runs, how long each takes, and the data they need.
* Any data restrictions. Tier 1 hardware is for P1 and P2 data (public and internal). For P3 or P4 data, or data covered by a contract, data use agreement or regulation, ask us first; see [Security](../../security/).

## What Tier 1 does not cover

* Work that runs well on the HPCC.
* General cloud computing: virtual machines, GPUs, databases and other cloud services. These are recharged as [Tier 2](../kb005-ursa-major-service-tiers/) under an MOU.

## Get in touch

Email [research-computing@ucr.edu](mailto:research-computing@ucr.edu) with "Tier 1 hardware" in the subject line and a few sentences about the work.
