---
title: "Ursa Major project budgets and spending alerts"
topic: Cloud
owner: Research Computing
reviewed: 2026-10-04
review_notes:
  - "Chuck 2026-10-04: project owners do not set budgets; Research Computing sets them on request, for Tier 2 projects, to help labs stay within grant funding. Rewritten from a self-service console guide to a request guide."
redirect_from:
  - /Knowledge_Base/Ursa_Major_Project_Budget_Creation.html
---

A Google Cloud budget watches what an Ursa Major project spends and emails alerts when spending reaches set thresholds. Budgets help a lab keep cloud spending in line with its grant or other funding.

## How budgets work in Ursa Major

- **Budgets apply to Tier 2 projects**, the projects recharged to a lab funding source under an MOU. Most Ursa Major usage, including VMs, GPUs, Standard storage and Filestore, is Tier 2. Tier 1 resources are managed by Research Computing and do not use lab budgets. See [KB005: Ursa Major service tiers](../kb005-ursa-major-service-tiers/) and [KB007: Ursa Major recharge workflow](../kb007-tier2-recharge-workflow/).
- **Research Computing sets budgets up.** Project owners do not create budgets themselves. To add or change a budget, send a request to [research-computing@ucr.edu](mailto:research-computing@ucr.edu) or through the [UCR Support Portal](https://ucrsupport.service-now.com/ucr_portal/).
- **A budget does not stop spending.** It only sends alerts. To limit costs, stop or delete resources you are not using.

## What to include in a request

1. The project name (for example `my-lab-project`) and the PI.
2. The amount the lab expects to spend in each period, and the period (monthly is common).
3. The alert thresholds you want, for example 50%, 90% and 100% of the amount. Thresholds can be based on actual spending so far, or on forecast spending by the end of the period, which gives earlier warning.
4. Who should get the alerts. Project owners can be notified, and so can other people, such as a lab manager.

## Reading the alerts

- Alerts are based on net cost: usage minus any discounts and credits that apply.
- An alert means spending has reached a threshold. Check what is running in the project, and stop or delete what you do not need.
- Ask Research Computing to adjust the budget as the lab's work changes.

## More information

- [Google Cloud: budgets and budget alerts](https://cloud.google.com/billing/docs/how-to/budgets)
- Questions: [research-computing@ucr.edu](mailto:research-computing@ucr.edu) or see [Get help](../../help/).
