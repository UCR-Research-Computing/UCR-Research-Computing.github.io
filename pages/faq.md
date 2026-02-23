---
id: faq
title: Frequently Asked Questions
sidebar_label: FAQ
---

## Frequently Asked Questions (FAQ)

Welcome to the Research Computing FAQ. If you cannot find the answer to your question here, please [contact our support team](mailto:research-computing@ucr.edu) or join our [Slack Channel](https://ucr-research-compute.slack.com/).

---

### 🌩️ Cloud Computing & Ursa Major

**Q: Are Google Cloud GPUs free under the Ursa Major subsidy?**
**A:** No. Under the strict Tier 1 subsidy rules (Project Polaris), Ursa Major covers baseline compute (`e2-standard-2`) and strategic AI (Gemini). All Secure Enclaves (NIST/CMMC), Cloud GPUs (A100, L4, T4), high-performance compute (c3, n2), and massive storage workloads must operate via the Tier 2 Direct Recharge model to your grant COA. If you need no-cost GPU access, please utilize the [UCR HPCC](../pages/HPCC.md).

**Q: How do I request an Ursa Major allocation?**
**A:** Please review the [Ursa Major Service Tiers](../Knowledge_Base/KB005_Ursa_Major_Service_Tiers.md) and submit a request via our [Intake Form](https://docs.google.com/forms/d/e/1FAIpQLSclKhikqwHOWhDDJV5tNAGGFdoqpkx8sdWnudLBhXWlj5NofA/viewform?usp=sf_link).

**Q: Can I run local open-source LLMs like Llama 2 or Ollama on Ursa Major?**
**A:** Yes, but running these models requires a GPU-enabled workstation (e.g., a T4 node). Because Cloud GPUs are excluded from the Tier 1 subsidy, this will incur a Direct Recharge to your lab. We strongly recommend running offline LLMs on the HPCC for subsidized access. See our [Ollama Guide](../Knowledge_Base/ollama-how-to.md) for details.

---

### 💾 Data Storage

**Q: Where should I store my active, hot research data?**
**A:** Active data being processed should reside on the [HPCC GPFS Storage](../pages/hpcc_gpfs.md). For warm project data, we recommend the new [Ceph RDS System](../pages/ceph_secure_research_storage.md) (currently in Pilot) or SDSC Qumulo.

**Q: I have terabytes of raw genomic sequencing data. Should I put it in Google Drive?**
**A:** **No.** Google Drive has a strict 500GB limit per account and is designed for document collaboration, not massive binary datasets. Please utilize [Ursa Major Coldline Storage](../Knowledge_Base/KB007_Migrating_Data_to_Archive.md) for long-term archiving or Ceph RDS for active storage.

**Q: What is the cost of archiving data in Ursa Major?**
**A:** Coldline storage (for compliance archiving and backups) is fully subsidized under the Tier 1 pool at no cost to the researcher, provided usage remains within reasonable limits. See [KB001: Data Storage Strategy](../Knowledge_Base/KB001_Research_Data_Storage_Strategy.md).

---

### 🖥️ High-Performance Computing (HPCC)

**Q: How much does it cost to use the UCR HPCC?**
**A:** The HPCC operates on a **$1,000/year Flat Rate** per Lab. This provides unlimited compute access for your entire research group.

**Q: My compute needs exceed the capacity of the UCR HPCC. What are my options?**
**A:** We utilize a strict [4-Tier GPU & Compute Offload Hierarchy](../pages/computing-resources-overview.md). If the local HPCC cannot meet your needs, we will assist you in migrating your workloads to the regional **Nautilus Cluster**, or help you apply for national allocations via the **NAIRR Pilot** or **NSF ACCESS**.

**Q: How do I migrate my code from a Google Cloud VM to the HPCC?**
**A:** We use Apptainer (Singularity) on the HPCC instead of raw Docker containers. Please refer to [KB006: Migrating Compute to HPCC](../Knowledge_Base/KB006_Migrating_Compute_to_HPCC.md) for a step-by-step guide.

---

### 🔒 Security & Compliance

**Q: I am working with HIPAA, NIST 800-171, or CUI data. Can I process this on the standard cluster?**
**A:** **No.** Highly regulated data (P4_CRITICAL) requires a formally approved Data Security Plan (DSP) and must be processed within a designated **Secure Enclave**. Please contact us immediately to initiate the enclave provisioning process.

**Q: Can I use ChatGPT or Google Gemini with my unpublished research data?**
**A:** You may use the institutional, enterprise version of Google Gemini provided through UCR, as we have a Business Associate Agreement (BAA) ensuring your data is not used to train external models. Do **not** input sensitive or P3/P4 classified data into public, consumer-tier AI chatbots. Read our [AI Safety Guide](../Knowledge_Base/AI-Safe-Secure-Research.md) for more information.