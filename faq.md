---
title: "Frequently asked questions"
heading: "Frequently asked questions"
section: help
permalink: /faq/
parent: Help
parent_url: /help/
kicker: "Short answers, with links to the details"
kicker_plain: "Help"
description: "Common questions about costs, storage, cloud, security and getting access, with links to the pages and terms that govern each answer."
toc: true
owner: Research Computing
reviewed: 2026-10-04
redirect_from:
  - /pages/faq.html
---

## Costs

**How much does the HPCC cost?**
The HPCC charges an annual lab registration: {% include fact.html id="hpcc_lab_fee" %}. Use of the cluster is shared and subject to the HPCC's quotas and queue policies ({% include fact.html id="hpcc_cpu_quota" bare=true %}). See [HPCC cluster]({{ '/services/hpcc/' | relative_url }}).

**What does Ursa Major cover without a recharge?**
Under current terms, three things, within limits: AI model access for research (with a per-lab allowance), exotic hardware the HPCC does not have (such as TPUs or Arm), by consultation, and archive storage. Other cloud work, including VMs, databases, analytics and GPUs, is recharged to a lab funding source. See [KB005: Ursa Major service tiers]({{ '/kb/kb005-ursa-major-service-tiers/' | relative_url }}).

**What does archive storage cost?**
Under current Ursa Major terms, archive storage may be available without recharge, within limits and subject to eligibility. That depends on continued funding. See [Cloud archive]({{ '/services/cloud-archive/' | relative_url }}).

## Storage

**Where should I keep data I am computing on?**
On [HPCC storage]({{ '/services/hpcc-storage/' | relative_url }}) while it is in use. Project data that must stay online can go to [CephRDS]({{ '/services/cephrds/' | relative_url }}) (pilot). See [Storage]({{ '/storage/' | relative_url }}) for the full picture.

**Can I put terabytes of sequencing data in Google Drive?**
Drive is built for documents and collaboration, and has quotas set by ITS ([its.ucr.edu/storage](https://its.ucr.edu/storage)). Large binary datasets belong in project storage or an archive.

## Cloud and AI

**Which AI tools can I use with research data?**
ITS maintains the list of campus AI tools and the guidance for each at [AI at UCR](https://its.ucr.edu/ai). Check it, and your data's [protection level]({{ '/security/' | relative_url }}#data-protection-levels), before using any AI tool with research data.

**Can I run open-source language models?**
Yes. The HPCC's GPUs are usually the lower-cost place to run them yourself. For calling models from code, ask about Ursa Major Tier 1 AI model access. Cloud GPU workstations in Ursa Major are recharged. See [Running local LLMs with Ollama]({{ '/kb/ollama-how-to/' | relative_url }}).

**How do I request an Ursa Major project?**
[Contact us]({{ '/help/' | relative_url }}) with a short description of the project. See [KB021: Requesting an Ursa Major project]({{ '/kb/kb021-ursa-major-project-request/' | relative_url }}).

## Security

**I work with HIPAA or NIST SP 800-171 data. Can I use the shared cluster?**
No. Regulated data needs a review, an approved [data security plan]({{ '/kb/ucr-data-security-plans/' | relative_url }}), and an appropriate environment such as the [secure research enclave]({{ '/services/secure-enclave/' | relative_url }}). Contact us before you start.

## Access

**My work needs more than campus has. What are my options?**
National programs award allocations by application: [NSF ACCESS]({{ '/services/nsf-access/' | relative_url }}), the [NAIRR Pilot]({{ '/services/nairr/' | relative_url }}), [NRP Nautilus]({{ '/services/nautilus/' | relative_url }}) and [OSG]({{ '/services/osg/' | relative_url }}). We can help you choose and apply.

**How do I move from a cloud VM to the HPCC?**
See [KB022: Migrating workloads from Google Cloud to HPCC]({{ '/kb/kb022-migrating-compute-to-hpcc/' | relative_url }}).
