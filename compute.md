---
title: "Compute"
heading: "Compute"
section: compute
permalink: /compute/
kicker: "Where to run your work"
kicker_plain: "Compute"
description: "Campus cluster, Google Cloud, national allocations and high-throughput computing: what each is for, who can use it, and how to start."
toc: true
owner: Research Computing
reviewed: 2026-10-04
redirect_from:
  - /pages/computing-resources-overview.html
  - /pages/ai-hpc-cluster.html
  - /pages/on-prem-facilities.html
---

Most research computing at UCR runs on the **HPCC cluster**. Cloud and national resources fill gaps: AI services, cloud-native tools, systems we do not have on campus, or more capacity than campus can offer. If you are not sure where to start, [ask us]({{ '/help/' | relative_url }}). A short description of your work is enough.

## Choose by what you are doing

| If you need to | Start with | Also consider |
| --- | --- | --- |
| Run batch simulations, pipelines or MPI jobs | [HPCC cluster]({{ '/services/hpcc/' | relative_url }}) | [NSF ACCESS]({{ '/services/nsf-access/' | relative_url }}) for larger runs |
| Train or run models on GPUs | [HPCC cluster]({{ '/services/hpcc/' | relative_url }}) | [NAIRR Pilot]({{ '/services/nairr/' | relative_url }}), [NSF ACCESS]({{ '/services/nsf-access/' | relative_url }}), [Nautilus]({{ '/services/nautilus/' | relative_url }}) |
| Use generative AI models in your research | [Ursa Major]({{ '/services/ursa-major/' | relative_url }}) (Tier 1 AI access) | [Cloud and AI]({{ '/compute/cloud-and-ai/' | relative_url }}) |
| Use exotic hardware the HPCC does not have (such as TPUs or Arm) | [Ursa Major]({{ '/services/ursa-major/' | relative_url }}) (Tier 1 exotic hardware, by consultation) | [NSF ACCESS]({{ '/services/nsf-access/' | relative_url }}) |
| Run thousands of small independent jobs | [HPCC cluster]({{ '/services/hpcc/' | relative_url }}) | [OSG / OSPool]({{ '/services/osg/' | relative_url }}) |
| Run containers or JupyterHub at scale | [NRP Nautilus]({{ '/services/nautilus/' | relative_url }}) | [Ursa Major]({{ '/services/ursa-major/' | relative_url }}) |
| Have your own cloud account on a grant | [Cloud accounts]({{ '/services/cloud-accounts/' | relative_url }}) | [Ursa Major]({{ '/services/ursa-major/' | relative_url }}) |
| Work with regulated data | [Secure research enclave]({{ '/services/secure-enclave/' | relative_url }}) | [Security and data]({{ '/security/' | relative_url }}) |
| Get help running a lab-owned cluster | [RCSAS]({{ '/services/rcsas/' | relative_url }}) | None |

## Campus

{% assign campus = "hpcc,ursa-major,cloud-discounts,rcsas" | split: "," %}
<div class="hubgrid">{% for id in campus %}{% assign s = site.data.services | where: "id", id | first %}{% include service-card.html s=s %}{% endfor %}</div>

## National and shared

National programs award time by application rather than by recharge. They have their own policies on eligibility and data.

{% assign nat = "nsf-access,nairr,nautilus,osg" | split: "," %}
<div class="hubgrid">{% for id in nat %}{% assign s = site.data.services | where: "id", id | first %}{% include service-card.html s=s %}{% endfor %}</div>

## A note on capacity

All of these are shared or allocated resources. Capacity, queue times, quotas and eligibility are set by each provider and change with demand. Choosing a service is not a reservation of capacity on it.
