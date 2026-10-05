---
title: "Secure research enclave"
parent: Security
parent_url: /security/
kicker: "Sensitive data <span class='sep'>|</span> Operated with ITS and the Information Security Office"
description: "A controlled cloud environment for research under NIST SP 800-171 or CMMC Level 2 requirements, including controlled-access data such as NIH dbGaP, available after review, an approved data security plan and training."
status: By review
tags: [Regulated data, Data security plan, Recharge]
data_levels: Regulated, by review
owner: "Research Computing with ITS and the Information Security Office"
reviewed: 2026-10-04
governed_by: "The project's data security plan and MOU"
redirect_from:
  - /pages/research_security.html
fit:
  - Projects whose contract, grant or data use agreement requires NIST SP 800-171 or CMMC Level 2 controls
  - Controlled-access data such as NIH dbGaP
  - Data that cannot be held on the shared cluster or ordinary cloud projects
  - Teams able to follow strict access and data transfer rules
not_fit:
  - US classified data (not supported)
  - HIPAA clinical data and applications (see KB006: clinical and HIPAA hosting)
  - Projects without an approved data security plan
  - Quick, unplanned analysis; onboarding takes time
glance:
  - {k: "Who can use it", v: "Approved projects, after review and training"}
  - {k: "Requires", v: "Data security plan, MOU, mandatory training"}
  - {k: "Setup fee", fact: cloud_admin_setup}
  - {k: "Annual fee", fact: cloud_admin_annual}
  - {k: "Usage", v: "Cloud compute and storage used by the project are recharged"}
  - {k: "Funding", v: "A grant-funded COA is required"}
cta:
  - {label: "Start a conversation", url: "/help/"}
  - {label: "Read the enclave guide", url: "/kb/kb014-secure-enclave-guide/"}
---

## What it is

The secure research enclave is a NIST SP 800-171 environment in Google Cloud. It is designed to support projects whose agreements require NIST SP 800-171 or CMMC Level 2 controls, including controlled-access data such as NIH dbGaP. It is provided by Research Computing with ITS and the campus Information Security Office (ISO). Whether it is suitable for a particular project is decided in review, against that project's requirements.

## How onboarding works

1. **Consultation.** We review your contract, grant or data use agreement with you.
2. **Data security plan.** You, Research Computing and the ISO write a data security plan that documents the controls for your project.
3. **Funding and MOU.** You provide a grant-funded funding source (COA) and ITS drafts an MOU for the recharged services.
4. **Training.** The PI and every authorized user complete the required enclave training before access.
5. **Provisioning.** A dedicated, isolated workspace is set up for the project.

[KB014: Secure research enclave guide]({{ '/kb/kb014-secure-enclave-guide/' | relative_url }}) and [KB016: Enclave data transfer rules]({{ '/kb/kb016-secure-enclave-data-ingress/' | relative_url }}) give more detail.

## Costs

Administrative fees ({% include fact.html id="cloud_admin_setup" bare=true %}, {% include fact.html id="cloud_admin_annual" bare=true %}) and the cloud compute and storage your project uses are recharged to the project. The MOU sets out the terms that apply.

## Keep in mind

Start early. If your proposal or agreement mentions NIST SP 800-171, CMMC, NIH controlled-access data or similar requirements, contact us before the award, not after. Approval of a data security plan, and the time onboarding takes, depend on the project.
