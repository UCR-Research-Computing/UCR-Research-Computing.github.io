# KB010: Research Computing Resource Catalog (4-Tier GPU/Compute Hierarchy)

**Scope:** All Compute & Storage Services
**Audience:** All Researchers
**Last Updated:** September 28, 2026 (NSF ACCESS and Jetstream2 entry)

---

## ☁️ Ursa Major (Google Cloud) - The Baseline
**Best For:** Generative AI, Compliance, Big Data.
*   **Strategic (Pool):** Gemini API, Vertex AI, Coldline Archive. *(Subsidized, strictly no GPUs allowed)*.
*   **Commercial (Recharge):** Custom VMs, Hot Storage. *(Billable to Grant)*.
*   **Access:** Google Cloud Console (SSO).

*When advanced compute or GPU workloads exceed the subsidized Tier 1 limits of Ursa Major, researchers must follow the 4-Tier GPU Offload Hierarchy below:*

---

## The 4-Tier GPU & Compute Offload Hierarchy

### 1. 🖥️ UCR HPCC (Primary Offload)
*The main and preferred destination to maximize ROI on local infrastructure.*
**Best For:** Batch jobs, Simulation, GPU Training, MPI.
*   **Hardware:** 6,000+ Cores, NVIDIA A100/H100/T4 GPUs, Infiniband.
*   **Storage:** GPFS Parallel File System (Fast I/O).
*   **Cost:** **$1,000/year Flat Rate** per Lab (Unlimited Access). Hardware Buy-in available.
*   **Access:** SSH / OpenOnDemand.

### 2. ☸️ Nautilus - National Research Platform (Secondary)
*A regional/national grid leveraging existing UCR hardware contributions.*
**Best For:** Docker Containers, Web Services, Jupyter Notebooks that overflow HPCC.
*   **Hardware:** Distributed GPU cluster across California.
*   **Storage:** Ceph Object Storage.
*   **Cost:** Free (Allocated via simple request).
*   **Access:** Kubernetes (kubectl) / Portal.

### 3. 🇺🇸 NAIRR Pilot - National AI Resource (Tertiary)
*For specialized, high-end AI allocations when local/regional capacity is insufficient.*
**Best For:** Massive-scale AI, Exotic Hardware (Cerebras, SambaNova), hundreds of H100s.
*   **Cost:** Free (Competitive Proposal - Startup or Research Allocation).
*   **Access:** Application via nairrpilot.org.

### 4. 🇺🇸 NSF ACCESS (Quaternary)
*National computing resources funded by NSF: supercomputers, GPUs, and the Jetstream2 research cloud.*
**Best For:** Always-on VMs you fully control (Jetstream2), servers and web services with public IPs, and HPC capacity beyond HPCC.
*   **Hardware:** Jetstream2 CPU, Large Memory and A100 GPU VMs; national HPC systems such as Anvil, Expanse, Stampede3 and Delta.
*   **Cost:** Free (start with an Explore project: up to 400,000 credits, decision usually by the next business day).
*   **Access:** Self-service via access-ci.org. Step-by-step guide: [KB009: Using NSF ACCESS and Jetstream2](KB009_Using_NSF_ACCESS.md).
