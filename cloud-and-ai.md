---
title: "Cloud and AI"
heading: "Cloud and AI"
section: compute
permalink: /compute/cloud-and-ai/
parent: Compute
parent_url: /compute/
kicker: "Google Cloud, campus AI tools, and where their terms live"
kicker_plain: "Compute"
description: "How Research Computing supports cloud and AI research, and where to find the campus guidance on approved AI tools."
toc: true
owner: Research Computing
reviewed: 2026-10-04
redirect_from:
  - /pages/ai-ml.html
---

## Campus AI tools

ITS maintains the campus guidance on generative AI tools available to UCR faculty, staff and students, including which tools are licensed, how to sign in, training materials, and guidance on appropriate use. **Go to [AI at UCR (ITS)](https://its.ucr.edu/ai)** for the current list and for the terms that apply to each tool.

Research Computing does not restate those terms here. Before using any AI tool with research data, check the ITS guidance and your data's [protection level]({{ '/security/#data-protection-levels' | relative_url }}). Your data security plan or agreements may restrict it further.

## AI research at UCR

The [RAISE Institute](https://raise.ucr.edu/) (Riverside Artificial Intelligence Research and Education) brings together UCR researchers working on AI and its applications, and runs seminars and workshops.

## AI computing

| You want to | Where |
| --- | --- |
| Train or fine-tune models on GPUs | [HPCC cluster]({{ '/services/hpcc/' | relative_url }}), or national allocations ([NAIRR Pilot]({{ '/services/nairr/' | relative_url }}), [NSF ACCESS]({{ '/services/nsf-access/' | relative_url }})) |
| Call generative AI models from your research code | [Ursa Major]({{ '/services/ursa-major/' | relative_url }}) Tier 1 AI model access, with a per-lab allowance |
| Use Google's AI platform services (such as Vertex AI) directly | A recharged [Ursa Major]({{ '/services/ursa-major/' | relative_url }}) project |
| Run open-source language models yourself | [Running local LLMs with Ollama]({{ '/kb/ollama-how-to/' | relative_url }}), on the HPCC or a workstation |
| Use containers and notebooks with GPUs | [NRP Nautilus]({{ '/services/nautilus/' | relative_url }}) |

## Cloud for research

UCR researchers reach the major cloud providers in two ways:

- **[Ursa Major]({{ '/services/ursa-major/' | relative_url }})**, UCR's Google Cloud research program, with campus-supported AI model access, exotic hardware and archive storage, and recharged projects for other cloud work.
- **[Cloud accounts]({{ '/services/cloud-accounts/' | relative_url }})** under University of California agreements with AWS, Google Cloud and Azure, billed to your funds through ITS.

Cloud can be the right answer when you need managed services, elastic scale for a short time, or tools that do not exist on campus. For long-running batch or GPU work, the HPCC usually costs the lab less. [Ask us]({{ '/help/' | relative_url }}) to compare for your case.
