---
title: "Researcher guide to NRP Nautilus"
kb_id: KB023
topic: National
audience: "UCR faculty, postdocs, staff and students in any discipline who want GPUs, notebooks, hosted AI models or a place to run containers"
reviewed: 2026-10-06
owner: Research Computing
series: nautilus
series_order: 1
review_notes:
  - "Written 2026-10-06 from the NRP documentation (nrp.ai/documentation, fetched 2026-10-06) and tests run in a UCR namespace the same day."
  - "The list of data types the AUP excludes (HIPAA, PII, CUI, FERPA, data under a data-use agreement) and the non-commercial terms come from the NRP AUP PDF (https://nrp.ai/NRP-AUP.pdf) and the LLM fair use page; the AUP PDF was read through a search result, not the docs dump."
  - "CHECK: the hello-nautilus Job in section 6 follows the NRP Jobs pattern and the 1 CPU / 2 GB exemption, but was not itself run on 2026-10-06."
  - "CHECK: WebODM and SuperSplat are listed as Unsupported on the NRP Deployed Services page; confirm they are still listed before pointing a lab at them."
  - "CHECK: the Coder workspace limit (up to 5) was observed in the Coder interface on 2026-10-06; it is not stated in the NRP docs."
  - "CHECK: the comparison table in section 9 summarizes UCR service pages as of 2026-10-06; re-read them if those pages change."
---

## 1. What is NRP Nautilus?

The **National Research Platform (NRP)** is a partnership of research institutions, supported by National Science Foundation awards. Its main system, **Nautilus**, is one large Kubernetes cluster spread across more than 75 sites, mostly in the US with a few in Asia and Europe ([Using Nautilus](https://nrp.ai/documentation/userdocs/start/using-nautilus/)). Institutions contribute machines, and researchers at participating institutions run their work on the shared pool. UCR participates, and UCR does not recharge for Nautilus use. See the [NRP Nautilus service page](../../services/nautilus/) for the short version.

What is in the pool, per the NRP documentation:

* **GPUs** of many kinds, from consumer and workstation cards (for example RTX 2080 Ti, RTX 3090, RTX 4090, A10) to data-center cards such as the A100 ([Introduction](https://nrp.ai/documentation/userdocs/tutorial/introduction/)). Up to 16 GPUs sit in a single node.
* **CPUs**, from 16 to 384 cores per node, and **memory** from 16 GB to 1.6 TB per node.
* **FPGAs** (AMD/Xilinx Alveo U55C cards) and **Qualcomm Cloud AI 100** inference accelerators ([Cloud AI 100](https://nrp.ai/documentation/userdocs/ai/qaic/)).
* **Storage**: shared file systems, block volumes and S3-compatible object storage, in several regions ([Storage introduction](https://nrp.ai/documentation/userdocs/storage/intro/)).
* **Hosted services** you can use without building anything: JupyterHub, Coder, hosted large language models, GitLab, Overleaf, Nextcloud, Jitsi and more ([Deployed Services](https://nrp.ai/documentation/userdocs/start/resources/)).

The live list of nodes and what is available to schedule right now is on the [NRP portal resources page](https://portal.nrp.ai/resources).

### Two things to know before anything else

1. **Non-sensitive data only.** The NRP states that it has no storage suitable for HIPAA, PII, FISMA, FERPA or other protected data, and its [Acceptable Use Policy](https://nrp.ai/NRP-AUP.pdf) (AUP) also excludes CUI and data covered by a data-use agreement. At UCR, treat Nautilus as P1 (public or non-sensitive) only. If your data is P2 or higher, use the [HPCC](../../services/hpcc/), [Ursa Major](../../services/ursa-major/) or the [Secure Enclave](../../services/secure-enclave/) instead.
2. **Non-profit, non-commercial use.** The NRP is non-profit and non-commercial, and all use of the cluster, including the hosted AI models, must be too ([LLM fair use](https://nrp.ai/documentation/userdocs/ai/llm-managed/fair-use/)). The AUP rules out use for financial gain.

---

## 2. Is Nautilus a good fit for you?

**A good fit:**

* You need a GPU for hours or days and the HPCC queue or your laptop is the bottleneck.
* You want a Jupyter notebook or a VS Code session with a GPU behind it, in a browser.
* You want to call a large language model from a script, with an OpenAI-compatible API.
* Your work splits into many independent pieces (one file, one parameter set, one image batch per worker).
* You want to host a small web tool for your lab or a public dataset.
* You are teaching a class or workshop and want every student to get the same environment.
* Your collaborators are at other NRP institutions and you want one shared place to work.

**Not a fit:**

* Any protected or regulated data (see section 1).
* Work that needs reserved capacity at a fixed time, or a deadline that cannot slip. Nautilus is shared, and the AUP is explicit that resources may not always be available and data can be lost.
* Long-term or archival storage. Volumes not accessed for 6 months can be purged without notice ([Cluster Policies](https://nrp.ai/documentation/userdocs/start/policies/)).
* Commercial work.
* A tightly coupled MPI job across many nodes. The [HPCC](../../services/hpcc/) is built for that.

**Skills.** The NRP's own tutorial says familiarity with the Unix command line is the single biggest predictor of success on Nautilus ([Introduction](https://nrp.ai/documentation/userdocs/tutorial/introduction/)). You can go a long way with JupyterHub, Coder and the LLM API without knowing Kubernetes. To run batch jobs or services yourself, you will need to learn some basic Kubernetes; the [NRP tutorials](https://nrp.ai/documentation/userdocs/tutorial/introduction/) cover it.

---

## 3. How access works, in one paragraph

You sign in at [nrp.ai](https://nrp.ai) through CILogon, choosing **University of California, Riverside**, and accept the AUP. That registers you but does not give you any compute. Compute comes from membership in a **namespace** (the NRP's word for a project space; in its hierarchy, Organization, then Lab, then Project, and each Project is a Kubernetes namespace). Students ask their PI or supervisor to add them to the lab's namespace. Faculty, staff and postdocs can request their own group with the namespace request form after logging in ([Getting access](https://nrp.ai/documentation/userdocs/start/getting-started/)). The namespace admin answers for everything that runs in the namespace and for keeping its member list current. In our test, membership changes reached the cluster within about a minute.

Full steps, including installing `kubectl`: [Getting access to Nautilus](../kb024-nautilus-getting-access/).

---

## 4. Four ways of working

Most people use more than one of these. They all run on the same namespace and can share the same storage.

### 4.1 In the browser: JupyterHub and Coder

**JupyterHub** ([jupyterhub-west.nrp-nautilus.io](https://jupyterhub-west.nrp-nautilus.io)) is the quickest start. You pick the hardware (CPU, memory, GPU type) when your server starts, and you get JupyterLab with a 5 GB home folder that can be extended on request. Your server shuts down 1 hour after your browser disconnects, so it suits interactive work, not overnight runs ([JupyterHub Service](https://nrp.ai/documentation/userdocs/jupyter/jupyterhub-service/)).

**Coder** ([coder.nrp-nautilus.io](https://coder.nrp-nautilus.io)) gives you longer-lived development workspaces from templates: a general one with JupyterLab, VS Code and a noVNC desktop; a full KDE desktop streamed to your browser; CUDA/PyTorch/TensorFlow; RStudio; and FPGA toolchains. Coder accounts need approval from the cluster admins, which you ask for in the Nautilus Support chat. Deleting a workspace deletes its volume ([Using Coder](https://nrp.ai/documentation/userdocs/coder/coder/)).

Details: [Notebooks, desktops and VS Code in the browser](../kb025-nautilus-jupyter-and-coder/).

### 4.2 From a script: the hosted language models

The NRP runs a rotating catalog of open-weights large language models, reachable through an **OpenAI-compatible API** at `https://ellm.nrp-nautilus.io/v1` and through browser chat interfaces ([NRP-Managed LLMs](https://nrp.ai/documentation/userdocs/ai/llm-managed/)). The catalog includes general chat models and an embedding model for search and clustering. You need to be in a group with the LLM feature turned on, then you create a personal token at [nrp.ai/llmtoken](https://nrp.ai/llmtoken). Per-model concurrency limits apply ([Fair use](https://nrp.ai/documentation/userdocs/ai/llm-managed/fair-use/)).

In our test, a chat model answered a sentiment-classification prompt in 2.3 seconds, and the embedding model scored "drought tolerance in citrus" at 0.70 cosine similarity with "water stress in orange trees" against 0.29 with "quantum error correction". In other words, it groups text by meaning, not by shared words.

Details: [Using the NRP's hosted large language models](../kb028-nautilus-llm-api/).

### 4.3 With Kubernetes: batch jobs, GPUs and services

With `kubectl` you describe what you want in a short YAML file and the cluster finds a place to run it. The NRP's rule of thumb ([Cluster Policies](https://nrp.ai/documentation/userdocs/start/policies/)):

| You want to | Use a | Limits to know |
| :--- | :--- | :--- |
| Run a computation to completion | **Job** | Runs until done. Up to 8 GPUs per node. Never end a Job with `sleep`. |
| Poke around, debug, test | **Pod** (no controller) | Treated as interactive: removed after 6 hours; at most 2 GPUs, 32 GB RAM, 16 cores. |
| Keep something running (a web tool, a database) | **Deployment** | Removed after 2 weeks unless the namespace is on the exceptions list. Idle Deployments cannot request GPUs. |

In our test, a pod asking for one GPU landed on an NVIDIA RTX A4000 at SDSC and measured about 40 TFLOPS on a PyTorch half-precision matrix multiply. A two-worker Indexed Job finished in 28 seconds, with both workers writing to the same shared volume.

Details: [Running batch jobs and GPU work with Kubernetes](../kb026-nautilus-batch-jobs-and-gpus/), [Storage and moving data](../kb027-nautilus-storage-and-data/) and [Hosting a lab web tool or service](../kb029-nautilus-hosting-web-tools/).

### 4.4 Hosted collaboration services

Some NRP services need no compute knowledge at all: [GitLab](https://gitlab.nrp-nautilus.io) with a container registry and CI runners, Overleaf, Nextcloud file sharing, Jitsi video calls, EtherPad, Draw.io and others. Each is labelled Stable, Unsupported or Experimental on the [Deployed Services](https://nrp.ai/documentation/userdocs/start/resources/) page, and most need their own registration.

---

## 5. Ways researchers use Nautilus

These scenarios show the range. Each one assumes the data is public or otherwise non-sensitive (P1). Read them for the pattern, then pick the guide that matches.

### Humanities: searching an archive by meaning

*A historian has 40,000 digitized pages of public-domain regional newspapers and wants to find every article about water rights, including the ones that never use the phrase.*

* Run OCR or text cleanup as a batch **Job**, one worker per box of scans, writing text to a shared volume.
* Send each article to the **embedding model** through the LLM API, then group and search the vectors in a notebook on **JupyterHub**.
* Use a **chat model** to draft short summaries for a finding aid, and check them by hand.

Guides: [KB028](../kb028-nautilus-llm-api/), [KB026](../kb026-nautilus-batch-jobs-and-gpus/), [KB025](../kb025-nautilus-jupyter-and-coder/).

### Social science: coding public documents at scale

*A political scientist wants to label 200,000 public legislative bill summaries by policy area and stance.*

* Hand-code a sample, then prompt a hosted **chat model** to label the rest, and measure agreement against the hand codes.
* Keep the prompts, model name and settings with the results. The NRP marks some models as long-term-support choices for reproducible research ([NRP-Managed LLMs](https://nrp.ai/documentation/userdocs/ai/llm-managed/)), and models are retired over time.
* Survey responses, interviews or anything with personal details do not belong here. Use a campus service rated for that data.

Guide: [KB028](../kb028-nautilus-llm-api/).

### Life science: images from the field and the lab

*A plant pathologist has thousands of photos of citrus leaves from field trials and wants to train a model that flags disease symptoms.*

* Explore and label in a **JupyterHub** notebook with a small GPU.
* Train as a GPU **Job** that saves checkpoints to persistent storage, so a restart picks up where it left off.
* Keep the image set in **S3 object storage**, which is the most scalable way to move many files in and out ([Moving Data](https://nrp.ai/documentation/userdocs/storage/move-data/)).

Guides: [KB026](../kb026-nautilus-batch-jobs-and-gpus/), [KB027](../kb027-nautilus-storage-and-data/).

### Environmental science: drone and sensor data

*An agronomy group flies drones over research plots and wants orthomosaics and plant counts.*

* The NRP lists a WebODM instance for drone image stitching on its [Deployed Services](https://nrp.ai/documentation/userdocs/start/resources/) page (marked Unsupported, so expect it to change).
* Run your own counting model as a batch **Job**, and publish a simple map viewer for collaborators as a **Deployment** with a web address.

Guides: [KB026](../kb026-nautilus-batch-jobs-and-gpus/), [KB029](../kb029-nautilus-hosting-web-tools/).

### Engineering: parameter sweeps

*A mechanical engineer needs 5,000 runs of a simulation, each taking ten minutes on a few cores.*

* Package the solver in a container and run an **Indexed Job**, where each worker reads its index and picks its own parameter set.
* For large CPU-only work, the NRP suggests the `opportunistic` priority class and keeping off GPU nodes, so your runs fill idle space and give way to others ([CPU Only Jobs](https://nrp.ai/documentation/userdocs/running/cpu-only/)). Pods at that priority can be stopped at any time, so write results as you go.
* Above roughly 100 pods, set resource limits equal to requests (a cluster policy).

Guide: [KB026](../kb026-nautilus-batch-jobs-and-gpus/).

### Physics and astronomy: big public datasets

*An astrophysicist wants to reprocess a public survey catalog with Dask or Ray.*

* The NRP runs Dask, Ray and Kubeflow operators, so you can start a cluster in your namespace from a short YAML file ([Dask Cluster](https://nrp.ai/documentation/userdocs/running/dask-cluster/), [Ray Cluster](https://nrp.ai/documentation/userdocs/running/ray-cluster/)).
* Read-only software and large datasets published through the OSDF can be mounted with CVMFS ([CVMFS](https://nrp.ai/documentation/userdocs/storage/cvmfs/)).

Guides: [KB026](../kb026-nautilus-batch-jobs-and-gpus/), [KB027](../kb027-nautilus-storage-and-data/).

### Computer science: models, accelerators and hardware

*A machine-learning lab wants to fine-tune open models; a hardware lab wants FPGAs.*

* Fine-tune on GPUs as a **Job**. A100 GPUs have a default quota of zero and are requested with the NRP's A100 form; H100, H200 and GH200 cards can only be reached opportunistically, where the pod can be preempted at any time ([Opportunistic Use](https://nrp.ai/documentation/userdocs/running/priority-classes/)).
* Serve your own model with vLLM or SGLang if the hosted catalog does not fit.
* Develop FPGA designs in a **Coder** FPGA template with Vivado and Vitis already set up, then run long synthesis as a Job from the same image ([FPGAs from pods](https://nrp.ai/documentation/userdocs/fpgas/using-fpgas-from-pods/)).

Guides: [KB025](../kb025-nautilus-jupyter-and-coder/), [KB026](../kb026-nautilus-batch-jobs-and-gpus/).

### Any discipline: a lab web tool

*A lab wants a Shiny or Streamlit app, a small API, or a project page that shows results from a public dataset.*

* Run it as a **Deployment**, put a Service and an Ingress in front, and it gets an HTTPS address under `nrp-nautilus.io`. In our test, a page was live a couple of minutes after the YAML was applied.
* Ask in Nautilus Support to add the namespace to the exceptions list if the tool needs to run longer than 2 weeks.

Guide: [Hosting a lab web tool or service](../kb029-nautilus-hosting-web-tools/).

### Teaching: a class or workshop

*An instructor wants 30 students in GPU notebooks for a semester, or 60 attendees for a one-day workshop.*

* A namespace admin creates a **training join link**. Anyone who opens it and logs in joins the namespace, and can also receive an LLM API key. Access lasts at most 90 days, and the link can be revoked ([Training Join Links](https://nrp.ai/documentation/userdocs/start/training-join-links/)).
* Use a namespace set up just for the class, so students do not see your research work.

Guide: [Teaching a class or workshop on Nautilus](../kb030-nautilus-teaching-and-workshops/).

---

## 6. A first look: what a Job is

To make section 4.3 concrete, here is the smallest useful Job. It asks for 1 CPU and 2 GB of memory, prints a line, and stops. Save it as `hello.yaml`:

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: hello-nautilus
spec:
  backoffLimit: 0
  template:
    spec:
      restartPolicy: Never
      containers:
      - name: hello
        image: python:3.12-slim
        command: ["python", "-c", "import platform; print('Hello from', platform.node())"]
        resources:
          requests:
            cpu: "1"
            memory: 2Gi
          limits:
            cpu: "1"
            memory: 2Gi
```

Run it, read its output, and clean up (replace `ucr-example` with your namespace):

```bash
kubectl apply -f hello.yaml -n ucr-example
kubectl wait --for=condition=complete job/hello-nautilus -n ucr-example --timeout=300s
kubectl logs job/hello-nautilus -n ucr-example
kubectl delete job hello-nautilus -n ucr-example
```

Real work changes three things: the container image (your code and its libraries), the command, and the resources (more CPU or memory, a GPU, a volume). [KB026](../kb026-nautilus-batch-jobs-and-gpus/) walks through each one.

---

## 7. Rules that catch new users

Nautilus works because everyone shares it, and the admins watch usage closely. These come from the [Cluster Policies](https://nrp.ai/documentation/userdocs/start/policies/) and [Getting access](https://nrp.ai/documentation/userdocs/start/getting-started/) pages:

* **Use what you request.** A user cannot have more than 4 pods running outside these bands: GPU use above 40% of what was requested, CPU use between 20% and 200%, memory use between 20% and 150%. Pods asking for 1 CPU and 2 GB are exempt. Check the Violations page on the NRP portal. Namespaces with consistently unused requests risk being banned.
* **Keep limits within 20% of requests.** For more than about 100 pods, set limits equal to requests.
* **Never run `sleep` in a Job.** A Job whose command is `sleep`, or a script that ends in `sleep`, gets the user banned. Sleep is fine in an interactive pod.
* **Containers are stateless.** Anything not on a persistent volume or in object storage is lost when the container restarts, and restarts are normal.
* **Do not force-delete pods.** If a pod is stuck terminating, ask in Nautilus Support.
* **Clean up storage.** Nautilus is not archival. Volumes not accessed for 6 months can be purged without notice. To delete a large number of files (over 10,000), use `find dir -type f -delete` rather than `rm -rf`.
* **Keep secrets out of job specs.** Job specs are visible to other cluster users. Put passwords and keys in Kubernetes Secrets.
* **Plan big GPU runs in public.** Before deploying jobs that use more than 50 GPUs, present a plan in Nautilus Support.
* **Join the support chat.** All Nautilus users are expected to join the Nautilus Support chat on Matrix for help and real-time notices.

---

## 8. Data on Nautilus

* **Allowed:** public data, published datasets, de-identified data that is classified P1 and not bound by a restrictive data-use agreement, synthetic data, your own code and models.
* **Not allowed:** HIPAA data, PII, FERPA student records, CUI, FISMA data, or anything under a data-use agreement that restricts where it can go ([AUP](https://nrp.ai/NRP-AUP.pdf)). This applies to what you send to the hosted language models as well as what you store.
* **Where P2 and above go:** the [HPCC](../../services/hpcc/), [Ursa Major](../../services/ursa-major/) or the [Secure Enclave](../../services/secure-enclave/), depending on the data. Ask Research Computing if you are unsure which.
* **Keep a copy elsewhere.** Treat Nautilus storage as working space. Keep the master copy of anything you cannot recreate in campus storage.

Storage classes, S3, and moving data in and out: [Storage and moving data on Nautilus](../kb027-nautilus-storage-and-data/).

---

## 9. Nautilus or something else?

| Your need | Start here |
| :--- | :--- |
| GPU notebooks, hosted LLM API, containers on a shared national pool, non-sensitive data | **NRP Nautilus** (this series) |
| Batch jobs with Slurm, MPI across nodes, P1-P2 data, a campus cluster | [HPCC](../../services/hpcc/) (see [KB004](../kb004-hpcc-account-creation/)) |
| Your lab's own Google Cloud project, VMs and managed services, P1-P2 data | [Ursa Major](../../services/ursa-major/) (see [KB005](../kb005-ursa-major-service-tiers/)) |
| Regulated or controlled data | [Secure Enclave](../../services/secure-enclave/) (see [KB014](../kb014-secure-enclave-guide/)) |
| Very large numbers of short, independent jobs (high-throughput computing) | [OSG / OSPool](../../services/osg/) |
| An allocation on a specific national supercomputer, or VMs on Jetstream2 | [NSF ACCESS](../../services/nsf-access/) (see [KB009](../kb009-using-nsf-access/)) |
| Large-scale AI resources awarded by proposal | [NAIRR Pilot](../../services/nairr/) (see [KB008](../kb008-using-nairr-pilot/)) |

Many projects use more than one. A common pattern: prototype on Nautilus in a notebook, then run the production pipeline on the HPCC where the data already lives.

---

## 10. Credit and acknowledgement

The NRP asks that papers acknowledge its NSF awards in the format given in the AUP, and cite *The National Research Platform: Stretched, Multi-Tenant, Scientific Kubernetes Cluster* (PEARC '25, [doi:10.1145/3708035.3736060](https://doi.org/10.1145/3708035.3736060)) ([FAQ](https://nrp.ai/documentation/userdocs/start/faq/)). Acknowledging the platform helps keep it funded.

---

## Getting help

* **NRP documentation:** [nrp.ai/documentation](https://nrp.ai/documentation/).
* **NRP support:** the Nautilus Support chat on Matrix (joining steps are on the [Getting access](https://nrp.ai/documentation/userdocs/start/getting-started/) page) and the [NRP contact page](https://nrp.ai/contact). When you ask, include your namespace and pod name, or a minimal example ([Asking for support](https://nrp.ai/documentation/userdocs/start/support/)).
* **UCR Research Computing:** research-computing@ucr.edu or the [Get help](../../help/) page. We can help you decide whether Nautilus fits your project, set up a lab namespace, or plan a class.

## Related guides

1. Researcher guide to NRP Nautilus (this article)
2. [Getting access to Nautilus: accounts, namespaces and kubectl](../kb024-nautilus-getting-access/)
3. [Notebooks, desktops and VS Code in the browser (JupyterHub, Coder)](../kb025-nautilus-jupyter-and-coder/)
4. [Running batch jobs and GPU work with Kubernetes](../kb026-nautilus-batch-jobs-and-gpus/)
5. [Storage and moving data on Nautilus](../kb027-nautilus-storage-and-data/)
6. [Using the NRP's hosted large language models](../kb028-nautilus-llm-api/)
7. [Hosting a lab web tool or service on Nautilus](../kb029-nautilus-hosting-web-tools/)
8. [Teaching a class or workshop on Nautilus](../kb030-nautilus-teaching-and-workshops/)

See also: [Run Nautilus jobs from your AI assistant (nrp-mcp quick start)](../kb031-nrp-mcp-quick-start/), which sets up an AI assistant to plan and run Nautilus jobs for you.
