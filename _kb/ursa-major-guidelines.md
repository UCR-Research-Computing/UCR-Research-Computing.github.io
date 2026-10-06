---
title: "Ursa Major guidelines"
topic: Cloud
audience: "Everyone using Ursa Major"
reviewed: 2026-10-04
owner: Research Computing
redirect_from:
  - /Knowledge_Base/Ursa_Major_Guideline.html
---

These guidelines set out the terms for access to, and use of, Ursa Major, UCR's Google Cloud research program. Read them before you use the service. Research Computing may update them. The version on this page is the current one, and the review date at the bottom shows when it last changed.

## Access

### Eligibility

Ursa Major is available to UCR researchers: faculty, staff, postdoctoral researchers, and students working on research under a PI. You need a UCR NetID, and you must complete any onboarding steps (such as training or an agreement) required for your project.

### Projects and allocation

Ursa Major resources are allocated to projects anchored to a PI's lab, not to individuals. Requests are reviewed against current campus resources, funding and priorities. Allocation is not automatic, and an allocation does not reserve capacity beyond what is confirmed for the project.

Resources fall into tiers, described in [KB005: Ursa Major service tiers](../kb005-ursa-major-service-tiers/):

- **Tier 1, campus-supported:** AI model access for research (with a per-lab allowance), exotic hardware not available on the HPCC, such as TPUs or Arm (by consultation, within limits set per project), and archive storage. No recharge to the lab under current terms, within limits and subject to eligibility.
- **Tier 2, recharge:** all other cloud work, including VMs, GKE, Cloud SQL, BigQuery, Standard storage, GPUs and marketplace models, billed to a lab funding source under an MOU. For GPU work at lower cost to the lab, consider the [HPCC](../../services/hpcc/). The [secure research enclave](../../services/secure-enclave/) is also recharged.
- **Tier 3, dedicated agreement:** an environment funded by the researcher under a dedicated agreement with the provider, managed with ITS.

Tier 1 depends on continued campus funding. Research Computing may change the services covered, the allowances and limits, or the tiers. Projects set up before October 2026 may still be arranged under the [earlier tiers](../ursa-major-service-tiers-pre-2026-10/).

### How to request

[Contact Research Computing](../../help/) or see [KB021: Requesting an Ursa Major project](../kb021-ursa-major-project-request/).

### Monitoring usage

Project members can see their project's usage in the Google Cloud console (for example the Cloud Monitoring dashboards and, for recharged projects, billing reports). Research Computing also monitors usage across projects to manage Tier 1 allowances and limits. Tier 1 projects have a budget set by Research Computing; when it is reached, work stops (see [project budgets](../ursa-major-project-budget/)).

### Limits and restrictions

1. Ursa Major is for research use. Access may be limited by service, campus allocation and project limits.
2. Use must follow UC and UCR information security policies.
3. Research Computing may restrict or revoke access if these guidelines or university policies are not followed.

## Appropriate use

- Use Ursa Major for UCR academic research only, not for commercial or personal purposes.
- You are responsible for making sure your use complies with applicable laws, regulations and agreements, including those on data privacy and intellectual property.
- Do not interfere with the operation of the service or the security of others' data.
- Do not store or process sensitive or restricted data unless you have the required authorization and an appropriate environment. See [Security and Data](../../security/).

### Consequences of misuse

Misuse can lead to suspension or termination of access and resources, and may have other consequences under university policy and the law.

## Support

Research Computing offers best-effort support for Ursa Major: help getting started, troubleshooting, and escalation to Google Cloud where needed. Response and resolution times depend on the issue and on team workload. Where an MOU for a project sets out support terms, the MOU applies. Not every problem has a solution, and Google's documentation is a good companion to ours. If an issue is not resolved to your satisfaction, you can escalate it to ITS through the [UCR Support Portal](https://ucrsupport.service-now.com/ucr_portal/) or [ITS Help](https://its.ucr.edu/help).

## Privacy and data access

Ursa Major runs on Google Cloud. Research Computing staff do not access project data except as needed to operate and support the service, or as required by law or university policy. Researchers control access to their own projects and are responsible for who they share data with.

## Data ownership

Ownership of research data is governed by the [UC Research Data Policy](https://policy.ucop.edu/doc/2500700/ResearchData) and by the terms of any award or agreement. Using Ursa Major does not change ownership. The underlying hardware and systems belong to Google and are used by UCR under its agreement with Google.

## Security

### Controls

Data in Google Cloud is encrypted at rest and in transit by default. Access to projects is managed through UCR accounts and role-based permissions. Researchers are responsible for configuring their own resources securely, for strong authentication, and for following their data security plan if they have one.

### Reporting a security incident

If you suspect a security incident involving an Ursa Major project, report it to Research Computing immediately. Research Computing works with the Information Security Office and Google on investigation, remediation and any notifications required by law or policy.

### Training

Research Computing offers guidance and training on using the cloud securely, including protecting sensitive data, access controls, and multi-factor authentication. Some projects require training before access.

## Stewardship

Research Computing manages Ursa Major: monitoring the service, responding to issues, maintaining the shared configuration, communicating planned changes, and managing Tier 1 allowances and limits. Researchers are responsible for their own data, including backups and disaster recovery. Research Computing does not back up project data. It can advise on backup options.
