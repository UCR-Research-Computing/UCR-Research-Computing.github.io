---
id: storage-overview
title: Storage Overview
sidebar_label: Storage Overview
---

## The Research Data Lifecycle at UCR

UCR Research Computing provides a tiered storage ecosystem designed to support the entire lifecycle of your research data. Rather than choosing a single platform, we recommend a **Lifecycle Strategy** where data moves between tiers based on its current utility and access frequency.

---

## 🚀 Tier 1: High-Performance Analysis (Hot)
**Best for:** Active computation, temporary scratch space, and data currently being processed by the HPCC.

### HPCC – GPFS (Parallel File System)
*   **Performance:** Ultra-high throughput, optimized for massive parallel jobs.
*   [HPCC Rates and more info](https://hpcc.ucr.edu/about/overview/rates/)
*   **Note:** This tier is for "working data." Once analysis is complete, data should be moved to Tier 2 (Project) or Tier 4 (Archive).

---

## 🏢 Tier 2: Active Project Storage (Warm)
**Best for:** Lab shares, sequencing libraries, instrument data capture, and data that needs to remain "online" for frequent access but isn't actively computing.

### CephRDS (Secure Research Storage) — **[PILOT PHASE]**
CephRDS is our next-generation, on-premise storage platform designed specifically as the backbone for research project data.
*   **Status:** Currently in **Pilot**. Ideal for CAREER grants and labs needing high-capacity repositories.
*   **Scalability:** Starting at 2 PB and designed to scale seamlessly.
*   **Security:** Built on NVMe-backed storage with 8k + 4m erasure coding and robust encryption.
*   **Accessibility:** Supports NFS and S3; integrates directly with the HPCC.

### SDSC Qumulo – Universal Scale Storage
*   **Use Case:** Suited for everyday research needs, similar to an office NAS.
*   **Cost:** ~$70/TB/year (Normalized). Optimized for on-campus use.

---

## 🤝 Tier 3: Collaboration & Documentation
**Best for:** Manuscripts, administrative files, protocols, and sharing lightweight files with collaborators.

### Google Workspace (Google Drive)
*   **Included:** 100 GB for Faculty, Staff, and Grads.
*   **Best Practice:** Use for documents and small-scale data sharing. **Not recommended for raw genomic sequencing or multi-TB binary data.**

---

## ❄️ Tier 4: Long-Term Archive & Compliance (Cold)
**Best for:** Raw data retention, grant compliance (e.g., NSF/NIH 10-year rules), and disaster recovery.

### Ursa Major Cloud Storage (GCP Archive)
*   **Branding:** Part of the **Ursa Major Cloud** ecosystem.
*   **Cost:** Subsidized (Tier 1). No-cost to researchers within reasonable limits.
*   **Use Case:** "Write once, read never." Perfect for long-term preservation of raw reads or project snapshots required by federal grants.

### AWS S3 Glacier Deep Archive
*   **Cost:** ~$12/TB/year.
*   **Use Case:** Alternative for extreme long-term preservation where 12-hour retrieval times are acceptable.

---

## 💡 Which Tier is Right for You?

If you are unsure how to architect your lab's data flow, please [schedule a consultation](https://researchcomputing.ucr.edu/contact) with our team. We can help you automate the movement of data between these tiers to minimize costs while ensuring maximum data integrity and security.
