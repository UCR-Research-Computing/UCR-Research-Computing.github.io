---
id: ucr-data-security-plans
title: UCR Data Security Plans (DSP)
sidebar_label: Data Security Plans
---

# UCR Data Security Plans (DSP) and High-Compliance Research

Conducting research with highly sensitive data—such as P3/P4 classified data, Protected Health Information (HIPAA), Controlled Unclassified Information (CUI), Export Controlled data, or datasets governed by strict Data Use Agreements (DUAs)—requires formal planning and approval. This ensures compliance with University of California policies (like IS-3) and external regulations.

This guide outlines the process for initiating a Data Security Plan (DSP), understanding your responsibilities, and securing the necessary infrastructure.

## 1. What is a Data Security Plan (DSP)?

At UCR, a Data Security Plan is a formal, comprehensive document that outlines the Roles, Responsibilities, Guidelines, Processes, and Technical Controls essential for safeguarding your research data. 

It serves as a blueprint, reviewed and approved by the Information Security Office (ISO), to ensure your research environment is constructed and maintained securely. It covers critical areas such as:
*   **Data Flow:** How data enters, moves through, and exits your environment.
*   **Access Controls:** Who has access, how they authenticate (e.g., MFA), and the principle of least privilege.
*   **Encryption:** Standards for data at rest and data in transit.
*   **Incident Response:** Procedures for handling potential breaches or security events.

**[Download the official UCR Data Security Plan Template (Google Doc)](https://docs.google.com/document/d/17oO97C_AtGzAsno6se8MYcZlqfiv3BpvPurFnVosi_0/edit?usp=sharing)**

## 2. The Discovery Phase: Before We Build

When requesting infrastructure for a confidential dataset, the Research Computing team and the ISO must first establish the compliance baseline. Before any technical solutions are proposed or hardware is purchased, researchers must complete the following intake steps:

### A. PI Oversight is Mandatory
All formal Data Security Plans and secure infrastructure setups **must be anchored to a faculty data custodian**. If you are a student, postdoc, or staff member initiating the request, your Principal Investigator (PI) or Faculty Advisor must be explicitly included in the communication and approve the requests. They hold the ultimate responsibility for the data.

### B. Provide Governing Documents (DUA)
Technical controls are driven entirely by contractual and regulatory obligations. You must provide the **Data Use Agreement (DUA)**, the grant contract, or the specific security policy document provided by the dataset owner. We cannot architect a compliant solution without reviewing the exact stipulations regarding storage, access, encryption, and auditing required by the provider.

### C. Initial Project Overview
When contacting support, be prepared to provide a brief, high-level summary of:
*   What the data is (e.g., genomic sequences, student records, clinical data).
*   Who the provider is (e.g., NIH dbGaP, a corporate partner, Department of Defense).
*   The general scope and duration of the research.

## 3. Secure Compute Options

The specific constraints of your DUA and the data classification will dictate which approved infrastructure you must use. **UCR does not support or approve the use of standalone workstations in individual offices for highly sensitive data.** 

### Standard P3/P4 Research Data
For general sensitive research data classified as P3 or P4 (e.g., standard confidential data without federal defense or specialized enclave requirements):

*   **Option 1: Google Cloud Platform (Tier 2 Recharge)** 
    *   **Availability:** All UCR Researchers.
    *   **Description:** Standard secure project shells built within the Ursa Major GCP organization. These projects are fully isolated but do not have the extreme logging and auditing overhead of a true enclave. 
    *   **Cost:** This is a **Tier 2 service** requiring a grant-funded Chart of Accounts (COA) for Direct Recharge.

*   **Option 2: On-Premise Hosting (CHASS Server Room)**
    *   **Availability:** Strictly limited to researchers within the **College of Humanities, Arts, and Social Sciences (CHASS)**.
    *   **Description:** Physical server hosting within the secure CHASS datacenter environment. 

### High-Compliance Federal Data (CMMC, NIST 800-171, NIH dbGaP)
If your grant or DUA involves the Department of Defense (DoD), Department of Energy (DOE), NIH dbGaP, or mandates specific federal compliance frameworks like **CMMC** or **NIST 800-171**:

*   **The UCR Secure Enclave**
    *   **Availability:** All UCR Researchers with qualifying federal grants.
    *   **Description:** A highly specialized, purpose-built environment within Google Cloud designed specifically to meet the rigorous technical controls of NIST 800-171. This includes extreme monitoring, restricted ingress/egress, and advanced auditing.
    *   **Cost:** Due to the significant security overhead, this is a premium **Tier 2 service** requiring a grant-funded Chart of Accounts (COA) for Direct Recharge.

## 4. Next Steps

If you need to begin the DSP process or request secure infrastructure, please submit a request to the Research Computing team (research-computing@ucr.edu) ensuring you have:
1. Copied your PI on the email.
2. Attached your DUA or data provider security requirements.
3. Provided a brief summary of your research goals.