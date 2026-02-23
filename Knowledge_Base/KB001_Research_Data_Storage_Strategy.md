# KB001: UCR Research Data Storage Strategy

UCR Research Computing provides a tiered storage ecosystem designed to support the entire lifecycle of your research data.

---

## 🚀 Tier 1: High-Performance Analysis (Hot)
**Best for:** Active computation, temporary scratch space, and data currently being processed by the HPCC.

### HPCC – GPFS (Parallel File System)
*   **Standard Allocation:** 100 GB included for Faculty/Staff/Grads.
*   **Project Expansion (OPEX):** Rent capacity at **$1,000 per 10 TB per year**.
*   **Hardware Buy-In (CAPEX):** Purchase disks/shelves via grant equipment funds (One-time cost). We host and manage it for the life of the hardware.

---

## 🏢 Tier 2: Active Project Storage (Warm)
**Best for:** Lab shares, sequencing libraries, and "online" project data.

### CephRDS (Secure Research Storage)
*   **Status:** **Coming Soon**.
*   **Scalability:** 3.2 PB capacity.
*   **Protocols:** S3, NFS, Globus.

### Ursa Major (Commercial Tier)
*   **Google Filestore:** High-performance NFS for Cloud VMs.
*   **Cost:** Direct Recharge to Grant COA.

---

## 🤝 Tier 3: Collaboration & Documentation
**Best for:** Manuscripts, administrative files, protocols, and sharing lightweight files.

### Google Workspace (Google Drive)
*   **Included:** 100 GB for Faculty, Staff, and Grads.
*   **Expansion:** Individual drives up to **1 TB** (Request via ITS).
*   **Shared Drives:** Unlimited 1 TB drives (Self-Service).

---

## ❄️ Tier 4: Long-Term Archive & Compliance (Ursa Major Strategic)
**Best for:** Raw data retention, grant compliance.

### Ursa Major Cloud Storage (Coldline)
*   **Cost:** **Subsidized (Tier 1)** under the PSSA.
*   **Capacity:** 400 TB Shared Pool.
*   **Use Case:** "Write once, read never" / Compliance Archiving.
