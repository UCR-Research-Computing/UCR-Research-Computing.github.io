---
title: "Ursa Major project budgets and spending alerts"
topic: Cloud
owner: Research Computing
reviewed: 2026-10-06
review_notes:
  - "Chuck 2026-10-04: project owners do not set budgets; Research Computing sets them on request, for Tier 2 projects, to help labs stay within grant funding. Rewritten from a self-service console guide to a request guide."
  - "2026-10-06: corrected to match operations: an Ursa Major budget is a spending cap, not only an alert. At the cap the throttle stops running VMs and turns off Vertex AI and the Gemini API; disks, storage and data are kept. Budgets count gross spend, before credits."
redirect_from:
  - /Knowledge_Base/Ursa_Major_Project_Budget_Creation.html
---

A budget on an Ursa Major project is a spending cap. It sends alerts as spending approaches the amount, and when the amount is reached, Research Computing's automatic throttle pauses the resources that cost money. Budgets help a lab keep cloud spending in line with its grant or other funding.

## How budgets work in Ursa Major

- **Budgets apply to Tier 2 projects**, the projects recharged to a lab funding source under an MOU. Most Ursa Major usage, including VMs, GPUs, Standard storage and Filestore, is Tier 2. Tier 1 resources are managed by Research Computing and do not use lab budgets. See [KB005: Ursa Major service tiers](../kb005-ursa-major-service-tiers/) and [KB007: Ursa Major recharge workflow](../kb007-tier2-recharge-workflow/).
- **Research Computing sets budgets up.** Project owners do not create budgets themselves. To add or change a budget, send a request to [research-computing@ucr.edu](mailto:research-computing@ucr.edu) or through the [UCR Support Portal](https://ucrsupport.service-now.com/ucr_portal/).
- **A budget is a cap.** When spending reaches the budget amount, the throttle acts (see below). Stop or delete resources you are not using well before then.

## What happens at the cap

Spending is checked each time Google Cloud updates the project's costs, several times an hour. When spending for the period reaches the budget amount:

- **Running virtual machines are stopped.**
- **Vertex AI and the Gemini API are turned off** for the project, so AI model calls fail.
- **Your data is kept.** Disks, Cloud Storage buckets and the project itself are not touched, and nothing is deleted.

Some costs continue after the throttle acts, because nothing is deleted. Persistent disks and stored data are still billed, so a lab with large idle disks can keep spending past its budget. Delete disks and data you no longer need.

## Getting going again after the cap

Ask Research Computing to raise the budget, or wait for the next budget period. A higher budget alone does not restart anything. Machines must be started again and the AI APIs turned back on, so tell us what you need running when you ask.

## What to include in a request

1. The project name (for example `my-lab-project`) and the PI.
2. The amount the lab expects to spend in each period, and the period (monthly is common).
3. The alert thresholds you want, for example 50%, 90% and 100% of the amount. Thresholds can be based on actual spending so far, or on forecast spending by the end of the period, which gives earlier warning.
4. Who should get the alerts. Project owners can be notified, and so can other people, such as a lab manager.

## Reading the alerts

- Budgets and alerts count gross cost: usage before credits. A project can reach its budget even when credits cover most of its bill.
- An alert before 100% is a warning. Check what is running in the project, and stop or delete what you do not need before the cap is reached.
- Ask Research Computing to adjust the budget as the lab's work changes.

## More information

- [Google Cloud: budgets and budget alerts](https://cloud.google.com/billing/docs/how-to/budgets)
- Questions: [research-computing@ucr.edu](mailto:research-computing@ucr.edu) or see [Get help](../../help/).
