# KB005: Ursa Major Service Tiers & Allocation Guide

**Scope:** Ursa Major (Google Cloud)
**Audience:** PIs, Researchers, Lab Managers
**Last Updated:** Feb 17, 2026 (Operational Alignment)

---

## 1. Overview
Ursa Major provides a tiered resource model to ensure sustainable access to cloud computing for the UCR research community.

---

## 2. Tier 1: Strategic Allocation (The "Pool")
**Objective:** Democratize access to strategic cloud tools (AI & Archive) that cannot be delivered on-premise.
**Cost:** Covered by the Campus Shared Pool (Zero cost to PI).

### Included Resources (Strict Whitelist)
| Resource | Specification | Notes |
| :--- | :--- | :--- |
| **Compute** | `e2-standard-2` | Standard general-purpose VMs. |
| **GKE** | `e2-standard-4` | Container orchestration clusters. |
| **Storage (Object)** | `Coldline` Class | Long-term compliance archiving/backups. |
| **Storage (Object)** | `Standard` Class | Working datasets (small scale). |
| **Persistent Disk** | Zonal Balanced | VM Boot and local data disks. |
| **Database** | Cloud SQL | Postgres HA. |
| **Analytics** | BigQuery | Enterprise Edition. |
| **AI** | **Gemini API** | Google Models Only (1.5 Pro/Flash). |
| **Agent Builder** | Vertex AI Search | Subsidized if within standard vector limits. |

### Excluded (Billable Overages)
**Warning:** The following are **NOT** covered by the subsidy and will trigger a recharge invoice:
*   **Marketplace Offerings:** 3rd Party Models (Claude, Llama, Mistral) via Vertex AI.
*   **High-Performance VMs:** `n1`, `c2`, `m1`, `c3` families.
*   **Cloud GPUs:** `a2`, `t4`, `l4`, `v100`.
*   **Bare Metal Solution.**

---

## 3. Tier 2: Commercial Recharge (The "Override")
**Objective:** Support cloud-native workloads that exceed the pool limits or require specialized infrastructure.
**Cost:** Full pass-through billing to Grant COA at PSSA List Price via ITS.

**Common Tier 2 Resources:**
*   **Google Filestore (NFS):** Managed high-performance file shares.
*   **Cloud GPUs:** All NVIDIA GPU types (A100, T4, L4).
*   **High-Perf VMs:** `n1`, `c2`, `m1`, `c3` families.
*   **Marketplace Models:** Claude (Anthropic), Llama (Meta) via Vertex AI.
*   **Instructional Use:** Large-scale courses (unless using Consumer/Free tiers).

---

## 4. Tier 3: Dedicated Subscription (The "Enterprise")
**Objective:** Large-scale, multi-year projects requiring their own contractual terms.
**Cost:** **Direct Contract** between the Lab and Google (with ITS administrative oversight).

---

## 5. Strategic GPU & Compute Offload Hierarchy
When workloads exceed the Tier 1 Ursa Major limits, we enforce a strict 4-tier hierarchy to maximize local ROI before utilizing national resources:

1.  **UCR HPCC (Primary):** The main and preferred destination for displaced GPU and advanced compute workloads. 
    *   **Standard Access:** $1,000/year Flat Rate per Lab.
    *   **Hardware Buy-In (CAPEX):** Purchase hardware; we host it at zero ongoing cost.
2.  **NRP Nautilus Cluster (Secondary):** A regional/national Kubernetes grid leveraging UCR hardware contributions. Best for containerized GPU tasks that overflow HPCC.
3.  **NAIRR Pilot (Tertiary):** National AI Research Resource. Used for specialized, high-end AI allocations (e.g., massive H100 arrays, exotic accelerators) when local/regional capacity is insufficient.
4.  **NSF ACCESS (Quaternary):** Traditional national supercomputing grids reserved for massive-scale jobs requiring thousands of nodes.
