---
title: "Secure enclave onboarding checklist"
kb_id: KB015
topic: Security
audience: "PIs preparing a secure enclave project"
updated: 2026-08-19
reviewed: 2026-10-04
owner: Research Computing with ITS and the Information Security Office
redirect_from:
  - /Knowledge_Base/KB015_Secure_Enclave_Onboarding_Checklist.html
---

This checklist shows the steps to bring a project into the [secure research enclave](../kb014-secure-enclave-guide/), and who is responsible for each. It is meant to help a PI plan. The exact steps for a project are set in its data security plan and MOU.

## Phase 1: Initiation and administration

**Request and consultation**
- [ ] PI contacts Research Computing; a kickoff meeting confirms the enclave is the right fit and explains the cost model.

**Funding and MOU**
- [ ] PI provides a funding source (COA).
- [ ] ITS systems and finance teams draft the MOU.
- [ ] The MOU is routed for signatures (PI, department and others as required).
- [ ] ITS creates a billing account for the project once the MOU is signed.

**Data security plan (DSP)**
- [ ] Research Computing prepares a draft DSP with the research team.
- [ ] The research team reviews it and lists everyone who needs access.
- [ ] The Information Security Office (ISO) reviews the DSP against the required controls.
- [ ] The final DSP is signed by all parties. This can run in parallel with Phase 2.

## Phase 2: Environment setup (ITS)

- [ ] A dedicated project is created and linked to the billing account.
- [ ] Baseline secure infrastructure is deployed, including controlled remote access and network restrictions.
- [ ] Compute resources are created to the project's requirements, and required research software is installed with the research team.
- [ ] Individual accounts are created for each authorized person named in the DSP, with least-privilege access and multi-factor authentication.

## Phase 3: Training, data transfer and handoff

- [ ] **Training.** The PI and every authorized user attend the mandatory enclave training with Research Computing and the ISO. Completion is recorded for each person.
- [ ] **Data transfer.** Project data is transferred into the enclave following the rules covered in training. See [KB016](../kb016-secure-enclave-data-ingress/).
- [ ] **Monitoring.** Audit logging, threat monitoring and endpoint protection are configured.
- [ ] **Handoff.** Trained users receive access instructions, and the project begins.
