---
title: "Secure research enclave: a guide for researchers"
kb_id: KB014
topic: Security
audience: "UCR faculty, postdocs, researchers and students"
updated: 2026-02-25
reviewed: 2026-10-04
owner: Research Computing with ITS and the Information Security Office
redirect_from:
  - /Knowledge_Base/KB014_Secure_Enclave_Guide.html
---

## What is the secure research enclave?

The UCR secure research enclave is a cloud-based computing environment for research projects with contractual or regulatory obligations to protect data. It is designed to support projects that must meet controls such as NIST SP 800-171 Rev 2, for example under Department of Defense awards. Whether it is suitable for a given project is decided in review, against that project's requirements.

ITS manages the underlying cloud infrastructure and its security configuration. Researchers are responsible for following the project's data security plan, the training, and the data transfer rules.

## Who is it for?

Projects with contractual or regulatory obligations to protect sensitive data, such as:

- Department of Defense funded projects with enhanced security requirements.
- Research involving data subject to NIST SP 800-171 Rev 2 or CMMC Level 2 requirements.
- Controlled-access data, such as NIH dbGaP, whose terms require NIST SP 800-171 controls.

The enclave is for NIST SP 800-171 and CMMC Level 2 work. Other options may suit P3 or P4 data without these requirements. See [UCR data security plans](../ucr-data-security-plans/).

## Key protections

- **Controlled access:** identity and access management limited to authorized individuals, with multi-factor authentication.
- **Encryption:** data is encrypted in transit and at rest.
- **Monitoring and audit logging:** the environment is monitored for threats and vulnerabilities, and audit logs are retained.
- **Managed infrastructure:** ITS manages the underlying cloud infrastructure, firewalls and security configuration.

## How onboarding works

1. **Initial consultation.** Contact Research Computing to discuss your project's requirements. We review your contract, grant or data use agreement with you.
2. **Data security plan.** We work with you and the campus Information Security Office (ISO) on a data security plan that documents the controls and procedures for your project.
3. **Billing and MOU.** You provide a grant-funded funding source (COA). ITS drafts an MOU for the recharged services for your review and signature.
4. **Mandatory training.** Before access, the PI and all authorized researchers attend a training session with Research Computing and the ISO. It covers researcher responsibilities, secure access, compute rules, and data transfer rules.
5. **Provisioning.** Once the MOU is signed and training is complete, ITS sets up a dedicated, isolated workspace for the project.
6. **Access.** Approved users receive access instructions.

Onboarding time depends on the project. Start well before you need access. [KB016](../kb016-secure-enclave-data-ingress/) covers the data transfer rules.

## Costs

The shared secure infrastructure and the labor of setup and security management are currently covered by ITS. The following are recharged to the project:

- Cloud compute (VMs, GPUs and so on) used by the project.
- Cloud storage used by the project.
- Administrative fees: {% include fact.html id="cloud_admin_setup" %} and {% include fact.html id="cloud_admin_annual" bare=true %}.

The MOU sets out the terms that apply.

## Contact

Research Computing, Information Technology Solutions: research-computing@ucr.edu
