# KB006: Clinical & HIPAA Application Hosting Standard (SOM vs. ITS)

**Scope:** School of Medicine (SOM) Projects, Clinical Data, HIPAA Workloads
**Audience:** SOM Researchers, Lab Managers, IT Staff
**Last Updated:** Feb 13, 2026

---

## 1. Primary Service Provider: SOM IT
The **School of Medicine Information Technology (SOM IT)** is the designated primary service provider for all applications, databases, and workloads involving:
*   **Clinical Data** (Patient Health Information - PHI).
*   **HIPAA Compliance** requirements.
*   **Medical Center Integrations** (Epic, etc.).

**Infrastructure:** SOM IT maintains specialized, HIPAA-compliant environments (typically **Azure HIPAA Zones**) designed for these workflows. 
**Contact:** Please coordinate with **Jeff Flogerzi** (IT Architect) and **Eduardo Silva** for architectural review.

---

## 2. Secondary Provider: ITS Research Computing (GCP)
**UCR Research Computing (ITS)** can provide cloud infrastructure for SOM projects, but strictly under an **Infrastructure-as-a-Service (IaaS)** model. We do **NOT** provide managed HIPAA application hosting.

### The "GCP Shell" Model
If SOM IT determines that Google Cloud Platform (GCP) is the preferred host, ITS will:
1.  **Provision:** A "Project Shell" in the Ursa Major organization.
2.  **Billing:** Link the project to a **Grant COA** (Direct Recharge). **No subsidies** are available for clinical/HIPAA hosting.
3.  **Network:** Provide standard campus networking.

### Researcher Responsibilities (The "Self-Managed" Rule)
The Research Team (PI and Technical Staff) is fully responsible for:
*   **Security:** Drafting the Data Security Plan (DSP) and obtaining ISO approval.
*   **Configuration:** Hardening the OS, configuring firewalls, and managing access controls.
*   **Compliance:** Ensuring all HIPAA/IRB requirements are met.
*   **Operations:** Patching, monitoring, and backups.

**Liability Statement:**
ITS Research Computing **does not** access, manage, or certify the compliance of data within these projects. All liability for data breaches or compliance failures rests with the PI and their unit (SOM).

---

## 3. Decision Matrix

| Requirement | Hosting Provider |
| :--- | :--- |
| **Standard Research (Non-Clinical)** | ITS Research Computing (GCP/HPCC) |
| **Clinical Data / PHI** | **SOM IT (Azure)** |
| **Clinical App on GCP** | **Self-Managed** (Billable, PI-Owned) |
