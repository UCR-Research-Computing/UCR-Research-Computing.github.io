---
title: "UCR Data Security Plans (DSP)"
topic: Security
owner: Research Computing
redirect_from:
  - /Knowledge_Base/UCR_Data_Security_Plans.html
reviewed: 2026-10-04
review_notes:
  - "Chuck 2026-10-04: DSP template current; CHASS server room option removed (no longer offered)."
  - "Reworded the secure enclave section to match KB014 and the enclave service page (designed to support NIST SP 800-171 / CMMC Level 2 work, after review, an approved DSP and training; ITS covers the shared infrastructure, project usage and admin fees are recharged)."
  - "Added a pointer to campus policy (UC IS-3) through the Security hub, a HIPAA pointer to KB006, and fixed the broken Next steps list."
  - "Removed 'compliance' framing and softened the workstation statement to what Research Computing supports."
---

Research with highly sensitive data needs formal planning and approval before it starts. This includes P3 or P4 data, protected health information (HIPAA), data regulated under NIST SP 800-171 Rev 2, export-controlled data, and datasets governed by strict data use agreements (DUAs). The governing rules are University of California policy, in particular UC IS-3, plus any external regulations or agreements that apply to the data. The [Security and Data](../../security/) page lists the policies and links to the official sources; where this article and a policy differ, the policy wins.

This article describes how to start a Data Security Plan (DSP), what you are responsible for, and the infrastructure options.

## 1. What is a Data Security Plan?

At UCR, a Data Security Plan is a formal document that sets out the roles, responsibilities, processes and technical controls that protect your research data.

It describes how your research environment is built and maintained securely, and it is reviewed and approved by the campus Information Security Office (ISO) in ITS. It covers areas such as:

*   **Data flow:** how data enters, moves through, and leaves your environment.
*   **Access controls:** who has access, how they authenticate (for example, with multi-factor authentication), and least-privilege access.
*   **Encryption:** standards for data at rest and in transit.
*   **Incident response:** what to do if a breach or security event is suspected.

**[UCR Data Security Plan template (Google Doc)](https://docs.google.com/document/d/17oO97C_AtGzAsno6se8MYcZlqfiv3BpvPurFnVosi_0/edit?usp=sharing)**

## 2. Before anything is built

When you request infrastructure for a confidential dataset, Research Computing and the ISO first establish the security requirements. Before any technical solution is proposed or hardware is purchased, complete these intake steps.

### A. PI oversight is required

Every Data Security Plan and secure environment must be anchored to a faculty data custodian. If you are a student, postdoc or staff member starting the request, include your Principal Investigator (PI) or faculty advisor in the communication. The PI approves the request and holds responsibility for the data.

### B. Provide the governing documents

The technical controls follow from contractual and regulatory obligations. Provide the data use agreement (DUA), the grant or contract terms, or the security requirements issued by the data provider. An appropriate environment cannot be designed without reviewing the provider's exact requirements for storage, access, encryption and auditing.

### C. Give a short project overview

Be ready to summarize:

*   What the data is (for example, genomic sequences, student records, clinical data).
*   Who the provider is (for example, NIH dbGaP, a corporate partner, the Department of Defense).
*   The general scope and duration of the research.

## 3. Secure compute options

The DUA and the data classification decide which environment is appropriate. Standalone workstations in individual offices are not an appropriate place for highly sensitive data, and Research Computing does not support them for this purpose.

### P3 and P4 research data

For sensitive research data classified as P3 or P4 without federal NIST SP 800-171 or CMMC requirements:

*   **Google Cloud (Ursa Major, Tier 2 recharge)**
    *   **Availability:** UCR researchers.
    *   **Description:** a dedicated project in the Ursa Major Google Cloud organization, isolated from other projects, configured to the controls in the DSP. It does not include the additional monitoring and audit logging of the secure research enclave.
    *   **Cost:** recharged to a lab funding source (COA) under an MOU. See [KB005](../kb005-ursa-major-service-tiers/) and [KB007](../kb007-tier2-recharge-workflow/).


Clinical data and HIPAA applications follow a different path. See [KB006: Clinical and HIPAA applications](../kb006-som-clinical-apps/).

### Federal controlled data (NIST SP 800-171, CMMC Level 2, NIH dbGaP)

If your grant, contract or DUA requires NIST SP 800-171 or CMMC Level 2 controls, for example Department of Defense work or controlled-access data such as NIH dbGaP:

*   **The UCR secure research enclave**
    *   **Availability:** projects whose agreements require these controls, after review, an approved data security plan and training.
    *   **Description:** a separate, controlled environment in Google Cloud, run by Research Computing with ITS and the ISO. It is designed to support projects that require NIST SP 800-171 controls, including controlled access, monitoring, restricted data transfer and audit logging. Whether it is suitable for a given project is decided in review. See [KB014](../kb014-secure-enclave-guide/) and the [secure research enclave](../../services/secure-enclave/) service page.
    *   **Cost:** the shared secure infrastructure is currently covered by ITS. The cloud compute and storage the project uses, and the administrative fees, are recharged to a grant-funded COA under an MOU.

## 4. Next steps

To start the DSP process or request a secure environment, email Research Computing at research-computing@ucr.edu and:

1. Copy your PI on the email.
2. Attach your DUA or the data provider's security requirements.
3. Include a short summary of your research goals.

Start early. If a proposal or agreement mentions NIST SP 800-171, CMMC, controlled-access NIH data or a restrictive DUA, contact Research Computing before you submit or sign it.
