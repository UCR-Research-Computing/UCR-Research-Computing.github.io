---
title: "Costs"
heading: "Costs and recharge"
section: costs
permalink: /costs/
kicker: "What things cost, and where the official rates live"
kicker_plain: "Costs"
description: "How recharge works for research computing services at UCR, the current published rates with their sources and dates, and the limits that apply."
toc: true
owner: Research Computing
reviewed: 2026-10-04
governed_by: "The rate sheets and MOUs linked on this page"
redirect_from:
  - /pages/cost_models.html
---

<div class="callout"><b>Read this first.</b> The figures below are copied from the published rate sheets and terms named next to each one, as of the date shown. They are here so you can plan. They are not a quote. The rate sheet or MOU in force when you are billed is the one that applies, and rates can change when sheets are renewed. For a budget, use the official rate sheet, or <a href="{{ '/help/' | relative_url }}">ask us</a>.</div>

## How recharge works

Some services are paid for by the lab from a UCR funding source (a chart of accounts string, or COA). This is called a **recharge**. Recharge rates are set by the unit that runs the service and approved through campus processes. Other services carry no recharge to the lab under current terms. Those depend on continued campus funding and are subject to eligibility and limits.

## Current published rates

<table class="rates">
  <thead><tr><th>Item</th><th>Rate</th><th>Source</th><th>As of</th></tr></thead>
  <tbody>
  {%- assign ids = "hpcc_lab_fee,hpcc_storage_rent_tb,hpcc_storage_rent_gb,hpcc_owned_storage_fee,hpcc_labor_rate,hpcc_user_storage,cephrds_rates,cloud_admin_setup,cloud_admin_annual" | split: "," -%}
  {%- for id in ids -%}{%- assign f = site.data.facts[id] -%}
  <tr><td>{{ f.label }}</td><td class="num">{{ f.value }}</td><td>{% if f.url != "" %}<a href="{{ f.url }}">{{ f.source }}</a>{% else %}{{ f.source }}{% endif %}</td><td>{{ f.as_of | date: "%b %Y" }}</td></tr>
  {%- endfor -%}
  </tbody>
</table>

HPCC figures are UC internal rates. External and non-UC rates differ: see the [HPCC Recharging Rates](https://hpcc.ucr.edu/about/overview/rates/). CephRDS rates are under review and not yet approved. Cloud usage itself is billed at the rates in the University of California agreement with each provider, and set out in your MOU.

## Services without a recharge under current terms

Some services carry no recharge to the lab today:

- **Campus collaboration storage** (Google Drive, OneDrive) within the quotas ITS publishes on its [storage page](https://its.ucr.edu/storage).
- **Ursa Major Tier 1:** AI model access for research (with a per-lab allowance), exotic hardware not available on the HPCC (by consultation, within limits set per project), and archive storage. See [KB005: Ursa Major service tiers]({{ '/kb/kb005-ursa-major-service-tiers/' | relative_url }}). Other Ursa Major cloud work is recharged.
- **National allocations** (NSF ACCESS, NAIRR Pilot, NRP Nautilus, OSG), which are awarded by those programs rather than sold.
- **Consultation** with Research Computing on choosing services, planning projects and grant preparation. There is no charge for consultation.
- **Cloud research credits:** Google and AWS both run research credit programs that can offset cloud costs. Credits are awarded by the provider, not by UCR. See [Cloud accounts]({{ '/services/cloud-accounts/' | relative_url }}#cloud-credits).

"No recharge under current terms" describes the present arrangement. It does not commit Research Computing or ITS to continuing it, or to any particular level of service or capacity.

## Limits and fair use

Shared resources have limits so that everyone can use them. Quotas, queue priorities, maximum run times, storage allowances and eligibility rules are set by each service and may be adjusted as demand and funding change. Where a page says a resource is available "within limits", the governing terms say what those limits are. If you cannot find them, ask us before you rely on them.

## Budgeting for a grant

For proposals, budget from the official rate sheets and include recharge services as direct costs where your sponsor allows. See the [grant toolkit]({{ '/grants/' | relative_url }}) for facilities text and templates, or [ask for a consultation]({{ '/help/' | relative_url }}).
