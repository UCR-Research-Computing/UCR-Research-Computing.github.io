# 🌐 KB008: UCR Research Computing Guide to NAIRR Pilot Allocations & National AI Resources

**Scope:** Research Computing Services
**Audience:** UCR Faculty, Postdocs, Researchers & Students
**Last Updated:** August 19, 2026

---

**Category:** AI / Machine Learning / Federal Allocations  
**Service Tier:** Tier 3 National Infrastructure (Federal Bridge)  
**Target Audience:** UCR Faculty, Postdocs, and PhD Researchers seeking zero-cost H100 GPU clusters, Cerebras Wafer-Scale Accelerators, and Frontier/DeltaAI allocations.  

---

## 1. Executive Summary: What is the NAIRR Pilot?

The **National Artificial Intelligence Research Resource (NAIRR) Pilot** is a $100M+ joint federal initiative led by the National Science Foundation (NSF) and the Department of Energy (DOE) that provides **zero-cost access** to high-performance AI computing, specialized hardware, and foundation model APIs for U.S. researchers.

Through **UCR Research Computing**, faculty can leverage the NAIRR Pilot to scale AI workloads beyond local campus resources (*HPCC* and *GCP Ursa Major*) into national exascale supercomputers and specialized AI accelerators at no charge to their grants.

---

## 2. NAIRR Pilot Resource Portfolio (What You Can Request)

| RESOURCE CATEGORY | AVAILABLE HARDWARE / PLATFORMS | IDEAL RESEARCH USE CASE |
| :--- | :--- | :--- |
| **Exotic AI Accelerators** | **Cerebras CS-3**, SambaNova SN40L, Groq LPU | Wafer-scale AI training, ultra-low latency inference, & non-GPU chip architectures. |
| **Massive H100/A100 GPU Clusters** | **NCSA DeltaAI** (1,200+ H100 GPUs), **SDSC Expanse**, **TACC Vista** | Multi-node distributed LLM pre-training, fine-tuning, and large vision models. |
| **Exascale Supercomputing** | **ORNL Frontier** (DOE Exascale), **ALCF Aurora** | Climate AI, molecular dynamics, & massive multi-physics simulation campaigns. |
| **Foundation Model API Credits** | OpenAI, Anthropic Claude, Vertex AI, Hugging Face | Prompt engineering, evaluation benchmarks, & fine-tuning proprietary models. |

---

## 3. Allocation Tracks & How to Apply

### 🔹 Track 1: NAIRR Startup Allocations (Fast-Track On-Ramp)
* **Best For:** Code testing, benchmarking, and gathering preliminary data for grant proposals.
* **Review Time:** **Fast-tracked (1–2 weeks)** w/ lightweight 2-page proposal.
* **Allocation Size:** Up to 5,000 GPU-hours or $5,000 in model API credits.

### 🔹 Track 2: NAIRR Research Allocations (Full Campaign)
* **Best For:** Multi-node research campaigns, large-scale LLM training, and paper publications.
* **Review Time:** Monthly peer-review cycle.
* **Allocation Size:** Up to 100,000+ GPU-hours or wafer-scale Cerebras cluster access.

---

## 4. UCR Research Computing Onboarding & Support

UCR Research Computing acts as your **institutional bridge** to NAIRR Pilot allocations:

1. **Proposal Review & Benchmarking:** We assist UCR faculty in running scaling benchmarks on **HPCC** or **GCP Ursa Major** to include in your NAIRR application.
2. **Access & Credential Mapping:** Once granted, we help configure Globus endpoint transfers, SSH key authentication, and Slurm job scripts for DeltaAI, Expanse, or Cerebras.
3. **Hybrid Workflow Integration:** Run pre-processing on HPCC/Ursa Major, launch massive GPU training on NAIRR DeltaAI, and store results in **CephRDS S3**.

---

## 🚀 Get Started Today

* **NAIRR Portal:** [https://nairrpilot.org](https://nairrpilot.org)
* **Request UCR Proposal Assistance:** Email Research Computing at `research-computing@ucr.edu` or submit a request via [UCR Support Portal](https://ucrsupport.service-now.com).

---
*Published by UCR Research Computing | UC Riverside Information Technology Solutions*
