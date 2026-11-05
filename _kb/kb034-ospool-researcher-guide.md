---
title: "Researcher guide to the OSPool and OSDF"
kb_id: KB034
topic: National
description: "What the OSG's Open Science Pool and Open Science Data Federation are, which work fits, how they compare with the HPCC, Nautilus and ACCESS, and the path from first contact to results."
audience: "UCR faculty, postdocs, staff and students with work that splits into many independent jobs"
reviewed: 2026-11-05
owner: Research Computing
series: ospool
series_order: 1
review_notes:
  - "Written 2026-10-29 from the OSPool documentation (portal.osg-htc.org/documentation, fetched 2026-10-29), the OSDF service page and the Pelican client docs."
  - "Tested 2026-10-29 from a UCR laptop: pelican 7.26.3 object get, ls, stat and get -r against osdf:///ospool/uc-shared/public/OSG-Staff/validation/ (works without an account)."
  - "OSG accounting (GRACC) checked 2026-10-29: the UCR-HPCC site contributes capacity to the OSPool. Figure deliberately not quoted on the page."
  - "Tested 2026-11-05 on ap40 by RC: account enrollment, SSH and device authentication, CPU sweep, GPU job, and Apptainer container build and sweep jobs completed."
---

## 1. What they are

The **OSG** (originally the Open Science Grid) is a national consortium that supports distributed high-throughput computing (dHTC). Two of its services matter most to UCR researchers:

- The **Open Science Pool (OSPool)** runs large numbers of small, independent jobs on idle computing capacity contributed by institutions across the country. Jobs are described and scheduled with **HTCondor**. You log in to an **access point**, stage your files, and submit jobs. HTCondor runs them wherever compute slots become idle across the national pool and returns the results to your access point. UCR's HPCC is one of the sites that contributes capacity to the OSPool.
- The **Open Science Data Federation (OSDF)** is a distributed network of data origins and caches that delivers larger input and output files to those jobs, and to anyone reading public research datasets. See the [OSDF service page](../../services/osdf/).

There is no recharge from UCR for using the OSPool or the OSDF. Compute and storage resources are provided through the OSG consortium and participating institutions. See the [OSG / OSPool service page](../../services/osg/) for an overview.

---

## 2. What the OSPool looks like today

Unlike a traditional high-performance computing cluster where nodes share a common hardware specification and a unified file system, the OSPool aggregates opportunistic capacity contributed by dozens of universities, national laboratories, and research institutions.

### Pool scale snapshot

On 2026-11-05, a queue analysis (`condor_q -better-analyze`) on access point ap40 showed approximately 9,100 matchable slots across roughly 1,800 worker machines for a single-CPU job. Across the entire national pool at that time, approximately 15,000 jobs were actively running and roughly 94,000 jobs were queued. Because member institutions contribute and reclaim capacity dynamically, pool size and matching hardware change from day to day.

### GPU capacity snapshot

The OSPool is primarily designed for high-throughput CPU computing, but participating sites also contribute GPU nodes. A pool snapshot seen on 2026-11-05 showed about 120 GPUs on 65 machines at around twenty sites. Models observed included NVIDIA H100 (80GB and 94GB), A100 (80GB), RTX PRO 6000 (Blackwell 96GB), A40 (48GB), L40/L40S (48GB), Quadro RTX 6000 (the largest group, roughly 30 cards, 24GB), RTX A5000 (24GB), consumer cards (RTX 3090, 2080 Ti, 3060, 1080 Ti), V100 (16GB and 32GB), T4, P4, and NVIDIA H100 MIG 1g.10gb slices. Hardware changes from day to day. For details on selecting GPU architectures, compute capability, and memory thresholds, see [GPU jobs on the OSPool](../kb047-ospool-gpu-jobs/).

### Software execution

Worker nodes across the OSPool run diverse Linux distributions and do not provide a shared Environment Modules system:

- **Simple scripts and standalone binaries:** Python scripts, shell scripts, Perl scripts, or compiled binaries with standard library dependencies run directly using the base operating system on execution nodes.
- **Provided container environments:** The OSG maintains curated container images on CVMFS (`/cvmfs/singularity.opensciencegrid.org/`) for common environments including PyTorch, TensorFlow, scikit-learn, R, Julia, and MATLAB Runtime.
- **Custom software stacks:** For complex dependencies, custom libraries, or specialized research pipelines, you package your code into an Apptainer or Docker container image. See [Containerize your research software with an AI coding agent](../kb049-containerize-your-research/).

---

## 3. Does your work fit?

The OSPool suits computational workloads that decompose into many independent tasks that do not communicate with each other:

- Parameter sweeps, Monte Carlo simulations, and bootstrap analyses evaluated across varied random seeds.
- Per-sample or per-file analysis pipelines (image processing, genomic sequence alignment against a reference, document OCR, or signal processing).
- Model training or inference runs where each individual task fits comfortably on a single machine or GPU.

Workloads that do not fit the OSPool include:

- Multi-node parallel programs requiring MPI or low-latency interconnects across separate physical servers.
- Long-running monolithic simulations that take days on a single machine without saving periodic checkpoints.
- Workflows that require a shared POSIX file system (such as NFS, Lustre, or GPFS) mounted across all worker nodes simultaneously.
- Workflows involving protected or sensitive data. The OSPool is **Non-sensitive only (P1; no protected data)**: no protected data (P2 to P4) on the access point or in jobs. [Ask Research Computing](../../help/) where protected data can go.
- Persistent web services, APIs, databases, or interactive notebook servers.

---

## 4. Limits and guidelines

The OSPool operates as a shared national resource. Sizing your tasks according to published OSG guidelines helps your jobs match available execution slots quickly and complete smoothly.

| Dimension | Guideline or limit | Operational notes |
| :--- | :--- | :--- |
| **Job duration** | Medium: expected under 10 hours, maximum 20 hours (default)<br>Long: expected under 20 hours, maximum 40 hours | Specify `+JobDurationCategory = "Medium"` or `"Long"` in your submit file. Jobs exceeding their category maximum are held by HTCondor. Single executions exceeding 20 hours in testing require self-checkpointing at least every 10 hours. |
| **CPU cores** | 1 core recommended; at most 8 cores | Request cores with `request_cpus`. Multicore jobs support threaded or OpenMP code only. Your code must be explicitly configured to use the requested core count (avoid core auto-detection). |
| **Memory (RAM)** | 2 GB default | Request memory with `request_memory` (for example, `request_memory = 4GB`). Large memory requests match fewer available slots and result in longer queue wait times. |
| **Per-job data transfer** | Under 1 GB total input and output via HTCondor | Files transferred directly between your `/home` directory and worker nodes should total under 1 GB per job. Files over 1 GB, or input files shared across many jobs, must use the OSDF. |
| **Access point storage** | 50 GB `/home`, 100 GB OSDF origin default | OSG documentation sets default quotas at 50 GB for `/home` and 100 GB for `/ospool/*/data`. On access point ap40, the `quota -s` command reports a 40 GB soft quota and a 50 GB hard quota for `/home`. Your login message shows your active quotas. |
| **Queue capacity** | Up to 50,000 queued jobs per user on ap40 | The access point enforces `MAX_JOBS_PER_OWNER = 50000`. You can queue large batches without submitting them in separate files. |
| **Parallel computing** | Single-node only (no multi-node MPI) | Execution nodes are scattered across independent institutional networks. Tasks cannot exchange network traffic with one another. |
| **Data classification** | Non-sensitive only (P1; no protected data) | Inputs, intermediate files and results must all be P1. |
| **Acceptable use** | Governed by OSG policies | All user activity must comply with the [OSG End-User Acceptable Use Policy](https://osg-htc.org/end-user-aup). |
| **Citing the OSPool** | Asked for in publications | OSG asks that papers using the OSPool [acknowledge it](https://osg-htc.org/acknowledging). |

---

## 5. How it compares with other platforms

UCR researchers have access to campus, regional, and national computing platforms. Each platform serves distinct workload patterns:

| If your research needs | Platform to consider | Why it fits |
| :--- | :--- | :--- |
| Thousands of independent jobs, parameter sweeps, or Monte Carlo runs | **OSPool** | High-throughput capacity across national institutions with no recharge from UCR and no formal allocation proposal. |
| Multi-node MPI, long monolithic runs, shared POSIX storage, or software modules | [HPCC cluster](../../services/hpcc/) | UCR's campus cluster, scheduled with Slurm; see the HPCC site for hardware, software and policies. |
| Containerized workloads, multi-GPU nodes, interactive JupyterHub, or persistent web tools | [NRP Nautilus](../../services/nautilus/) | Kubernetes-based national platform with GPUs, shared storage and browser-based notebooks. |
| Large allocations on national supercomputers or cloud virtual machines | [NSF ACCESS](../../services/nsf-access/) or [Jetstream2](../../services/jetstream2/) | National supercomputers through an allocation, or cloud VMs you manage. |
| Cross-institutional research dataset distribution | [Open Storage Network](../../services/osn/) | S3-compatible object storage designed for sharing multi-terabyte public or project datasets across institutions. |

The campus HPCC is UCR's primary cluster for research computing and the place to start for most work. The OSPool complements it: many research groups develop and validate their code on the HPCC, and then scale large parameter sweeps or per-file processing pipelines across the OSPool.

---

## 6. The path from first contact to results

This series covers the full life cycle of high-throughput computing on the OSPool:

1. **[Getting access to the OSPool](../kb035-ospool-getting-access/):** Submit an application, attend an orientation consultation with an OSG facilitator, register for an access point, configure SSH keys, and complete your first login.
2. **[Moving data on the OSPool](../kb036-ospool-moving-data/):** Transfer files to your access point, use HTCondor file transfer for small files, stage larger files and container images in the OSDF, and manage storage quotas.
3. **[Submitting OSPool jobs and getting results](../kb037-ospool-jobs-and-results/):** Write submit files, run initial test jobs, scale across thousands of tasks, monitor queues with `condor_q`, diagnose held jobs, and collect outputs.
4. **[GPU jobs on the OSPool](../kb047-ospool-gpu-jobs/):** Request GPU resources, filter by compute capability and GPU memory, run jobs using pre-built CUDA containers, and understand throughput dynamics.
5. **[Common OSPool job types](../kb048-ospool-common-job-types/):** Structured templates for parameter sweeps, Monte Carlo simulations, per-file processing, multicore threading, and multi-step DAGMan workflows.
6. **[Containerize your research software with an AI coding agent](../kb049-containerize-your-research/):** Package your code, libraries, and runtime dependencies into portable Apptainer and Docker container images for the OSPool, Nautilus, and cloud environments.

---

## 7. Try the OSDF now, without an account

You can read public OSDF data from your local computer without an OSPool account. Download the Pelican client for macOS, Linux, or Windows from the [Pelican releases page](https://github.com/PelicanPlatform/pelican/releases), extract the executable, and test data retrieval:

```bash
pelican object ls osdf:///ospool/uc-shared/public/OSG-Staff/validation/
pelican object get osdf:///ospool/uc-shared/public/OSG-Staff/validation/test.txt ./test.txt
cat test.txt
```

The final command prints `Hello, World!`. Adding `-r` to `object get` downloads an entire directory hierarchy through the federation cache network.

---

## 8. Getting help

- **OSG Facilitators:** The OSG Research Facilitation team handles account approvals, projects, job questions and quota requests. Contact them by email at [support@osg-htc.org](mailto:support@osg-htc.org). Facilitators also host weekly virtual office hours on Tuesdays from 4:00 to 5:30 PM Eastern Time via [OSG Office Hours Zoom](https://osg-htc.org/OfficeHoursZoom).
- **Research Computing:** we can help you decide whether your work fits high-throughput computing and look over your first submit file or container recipe. Research Computing does not administer the OSPool, approve OSPool accounts, or alter storage quotas. [Contact Research Computing](../../help/).
