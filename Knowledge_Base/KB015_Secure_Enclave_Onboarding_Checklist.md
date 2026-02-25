---
id: kb015-secure-enclave-onboarding-checklist
title: KB015 - Secure Enclave Project Onboarding Checklist
sidebar_label: KB015 - Secure Enclave Checklist
---

# KB015: Secure Enclave Project Onboarding Checklist (NIST 800-171)

**Target Audience:** Research Computing Team, ISO, ITS
**Purpose:** To provide a complete, step-by-step checklist for fully onboarding a new NIST 800-171 compliant research project into the Secure Enclave, including environment setup, resource configuration, and security documentation.

---

## Phase 1: Project Initiation & Administrative Setup

### 1.1: Initial Request & Consultation
- [ ] Log initial researcher request in the CRM (Nexus).
- [ ] Hold a kickoff meeting with the PI to confirm the need for a Secure Enclave and discuss the shared cost model.

### 1.2: Financial & Legal Prerequisites
- [ ] **(Chuck)** Obtain the Chart of Accounts (COA) from the researcher.
- [ ] **(Okey)** Draft the Memorandum of Understanding (MOU) using the provided COA.
- [ ] **(Chuck/PI)** Route the MOU for all required signatures (PI, Department Head, etc.).
- [ ] **(Okey/Steven)** Once the MOU is fully executed, create the unique Google Billing ID for the project.

### 1.3: Data Security Plan (DSP) Development
- [ ] **(Chuck)** Generate the initial DSP draft using the AI-powered script/template.
- [ ] **(Chuck/Nick)** Send the draft to the PI and their research team for review and to add all personnel who will need access.
- [ ] **(Nick)** Conduct the formal security review of the DSP, ensuring all NIST 800-171 controls are addressed.
- [ ] **(Chuck/PI/Nick)** Route the finalized DSP for official signatures from all parties. *(Note: This can happen in parallel with Phase 2).*

---

## Phase 2: Technical Environment Configuration

### 2.1: GCP Project & Billing
- [ ] **(Steven)** Create the new, dedicated GCP project (e.g., `ucr-ursa-major-<lab-name>`).
- [ ] **(Steven)** Apply the newly created Google Billing ID to the project.

### 2.2: Core Infrastructure & Access
- [ ] **(Steven)** Deploy the baseline infrastructure using the Stellar Engine Terraform blueprints.
- [ ] **(Steven)** Configure the Bastion Host (Jump Host) for secure SSH access.
- [ ] **(Steven)** Implement all necessary VPC Service Controls and firewall rules.
- [ ] **(Nick)** Verify that FIPS mode is enabled on all VMs.

### 2.3: Compute & Software Setup
- [ ] **(Steven)** Deploy the required number of Linux VMs based on the researcher's requirements.
- [ ] **(Steven/Chuck)** Work with the research team to install and configure all required custom software and Python libraries.
- [ ] **(Steven)** Document the final baseline configuration for the VMs.

### 2.4: User & Identity Management
- [ ] **(Chuck)** Ensure all project members (PI, researchers, external collaborators) are in the CRM (Nexus).
- [ ] **(Steven)** Create unique user accounts on the compute nodes for all authorized personnel listed in the DSP.
- [ ] **(Steven/Nick)** Define and apply appropriate, least-privilege IAM roles in GCP.
- [ ] **(Nick)** Ensure MFA is enforced for all user access.

---

## Phase 3: Training, Data Transfer & Hand-off

### 3.1: Mandatory Security Training
- [ ] **(Chuck)** Schedule the mandatory Secure Enclave Training (Zoom) with the PI, their research team, and the ISO Risk team.
- [ ] **(Chuck/Nick)** Conduct the training, covering: researcher responsibilities, secure access methods, compute environment rules, and strict protocols for data ingress/egress.
- [ ] **(Chuck)** Log training completion for all authorized users in the CRM (Nexus).

### 3.2: Data Ingress
- [ ] **(Chuck)** Work with the researcher to securely transfer the project data into the enclave's Google Cloud Storage bucket.
    *   *Note: Data often originates from sources like dbGaP (NIH), DOD, NSF, or DOE, and may contain Controlled Unclassified Information (CUI). Data ingress must strictly follow the protocols established in the training.*

### 3.3: Final Security & Monitoring Setup
- [ ] **(Nick)** Configure and verify that all audit logs are being exported to the central log sink.
- [ ] **(Nick)** Configure Security Command Center (SCC) to monitor for threats and vulnerabilities.
- [ ] **(Charles/Team)** Install and configure endpoint security tools (e.g., Trellix) on all VMs.

### 3.4: Project Hand-off
- [ ] **(Chuck)** Send a final "Project Ready" email summarizing the environment details and providing the necessary credentials to the trained users.