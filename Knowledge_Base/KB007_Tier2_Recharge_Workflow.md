# KB007: Ursa Major Tier 2 (Commercial Recharge) Workflow

**Scope:** Billable Google Cloud Projects (Project Polaris Tier 2)
**Audience:** Research Computing, Systems Team, PIs
**Last Updated:** Feb 13, 2026

---

## 1. Overview
This workflow governs the provisioning of Google Cloud projects that require a **Chart of Accounts (COA)** for direct billing (e.g., projects using GPUs, Marketplace models, or exceeding Tier 1 caps).

---

## 2. The 8-Step Provisioning Process

### Phase 1: Intake & Validation (Research Computing)
1.  **Request Received:** PI submits request via ServiceNow.
2.  **Initial Triage:** Research Computing (RC) validates the request as Tier 2 and informs the PI of the process. RC collects:
    *   Technical Requirements (APIs, GPUs, etc.)
    *   Full **Chart of Accounts (COA)** string.

### Phase 2: Administrative Setup & MOU Execution (Systems Team + ITS Finance)
3.  **Ticket Handoff:** RC creates a structured ServiceNow Task/Request for the **Systems Team** (led by Associate Director of Infrastructure Okey Uchendu) containing the project specs and COA.
4.  **MOU Drafting & Issuance:** Okey's Systems Team and AVC/CFO Shally Gupta's ITS Finance Team together draft the formal Memorandum of Understanding (MOU) outlining the recharge rates, COA string, and terms. Okey's team works directly with the PI to issue the MOU for signature.
5.  **MOU Execution & Billing ID Creation:** PI signs and returns the executed MOU. Okey's team takes the researcher's COA string, creates a dedicated Google Cloud Billing ID under the UCR Organization, and associates it with the new project.

### Phase 3: Technical Provisioning (Systems Team)
6.  **Project Creation:** Upon receipt of the signed MOU, the Systems Team:
    *   Provisions the GCP Project.
    *   Configures Billing Export to the COA.
    *   Sets up IAM bindings.
7.  **Completion Notice:** Systems Team updates the ticket and notifies RC that the project is live.

### Phase 4: Onboarding (Research Computing)
8.  **Researcher Handoff:** RC contacts the PI to:
    *   Confirm access.
    *   Assist with initial setup (SDKs, Login).
    *   Close the original request.

---

## 3. SLA & Responsibilities
*   **Research Computing:** Front-line communication, technical scoping, onboarding support.
*   **Systems Team:** Billing configuration, MOU legal/financial processing, infrastructure creation.
*   **PI:** Fiscal responsibility and MOU execution.
