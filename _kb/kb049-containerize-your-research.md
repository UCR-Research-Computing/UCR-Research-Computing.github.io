---
title: "Containerize your research software with an AI coding agent"
kb_id: KB049
topic: Software
description: "Use an AI coding agent to package your research code into portable containers for the OSPool, Nautilus, and Google Cloud without learning container tooling first."
audience: "UCR researchers and students who have working scripts or pipelines on a laptop or the HPCC and want to run them on national HTC/HPC resources and cloud platforms"
reviewed: 2026-11-05
owner: Research Computing
review_notes:
  - "Written 2026-11-05 for researchers containerizing code for the OSPool, NRP Nautilus, and Google Cloud with AI coding agents."
  - "Tested 2026-11-05 on ap40 by RC: analyze.py container built as Dockerfile and Apptainer .def, run locally on Apple Silicon Mac via buildx (~14 s) and converted to sif via docker-archive (~7 s), built directly on ap40 with apptainer build (~15 s, 88 MB), and executed as a 5-job sweep from OSDF with exit 0 at three universities (one job sat on a stuck slot and was resubmitted)."
  - "Tested 2026-11-05: docker run of the Mac-built image printed the expected line; the same 2-job docker://python:3.12-slim test ran on ap40 with a one-line shell wrapper (run_hub.sh) that only checks the Python version."
  - "CHECK: GKE, Cloud Run, and Artifact Registry push commands were drafted to match standard Google Cloud patterns in Ursa Major Tier 2 recharge projects, but were not executed for this article."
  - "CHECK: sample prompts for R, C/Fortran, PyTorch, bioinformatics, and Jupyter notebooks are provided as guidance and were not executed end-to-end for this article."
---

You have written a script or data pipeline on your laptop or on the campus [HPCC](../../services/hpcc/). It runs cleanly in your local Python virtual environment, Conda environment, or R session. Now you want to scale it up: run thousands of independent parameter sweeps across the Open Science Pool (OSPool), train on shared GPUs on National Research Platform (NRP) Nautilus, or execute batch runs in Google Cloud.

To run reliably across hundreds of remote computers, your code needs its software environment packaged alongside it. Containers provide that portable environment. Writing Dockerfiles, Apptainer definition files, cross-platform build commands, and cluster submit files from scratch can be time-consuming.

An AI coding agent running on your computer can inspect your existing project, identify dependencies, generate standard container specifications, and draft the exact submit files for your target platform. This guide explains how to containerize research code using an AI coding agent, the portability rules required for academic clusters, and how to verify your container before scaling up.

---

## 1. Why containers?

A container is a lightweight package containing your application and the exact operating system libraries, runtimes, and dependencies it needs to execute. The same container runs with the same software on your laptop, on a machine at another institution, or in a cloud cluster.

### When you need a container

* **Custom Python or R dependencies:** Your code requires specific package versions (such as `pandas==2.2.3` or Bioconductor libraries) that are not preinstalled on remote cluster operating systems.
* **Compiled binaries and custom toolchains:** Your pipeline depends on system packages, C/C++ libraries, or bioinformatics utilities (such as `samtools` or `bwa`).
* **Complex runtime stacks:** Your software requires GPU drivers, PyTorch, CUDA libraries, or custom scientific packages.
* **Reproducibility:** You want your analysis environment preserved so that other researchers can rerun your pipeline years later.

### When you do not need a container

You do not always need to build a container. You can skip container creation when:

* **Your code uses only standard libraries:** Simple Python, Bash, or Perl scripts that rely entirely on the base operating system standard library can run directly. For example, the 10-job Monte Carlo calculation in [Submitting OSPool jobs and getting results](../kb037-ospool-jobs-and-results/) ran directly on the base host without a container.
* **A standard environment already exists:** Both the OSPool and NRP Nautilus provide curated container images for common tasks, including standard PyTorch, TensorFlow, R, and Julia images. If an official image satisfies your needs, use it directly as described in [GPU jobs on the OSPool](../kb047-ospool-gpu-jobs/).

---

## 2. One container image across multiple research platforms

A single research container can run across local machines, national high-throughput grids, Kubernetes clusters, and commercial cloud providers. The underlying container format and submission mechanism vary by platform:

| Platform | Image format | Where image lives | How a job starts it | Guide link |
| :--- | :--- | :--- | :--- | :--- |
| **OSPool** | Apptainer (.sif) or Docker image | OSDF (`osdf:///ospool/ap40/data/YOUR_OSG_USERNAME/x.sif`) or Docker Hub (`docker://...`) or CVMFS | HTCondor `container_image` attribute in submit file | [Moving data on the OSPool](../kb036-ospool-moving-data/) and [GPU jobs on the OSPool](../kb047-ospool-gpu-jobs/) |
| **NRP Nautilus** | OCI / Docker container | Container registry (NRP GitLab registry, Docker Hub, GitHub Container Registry) | Kubernetes Job manifest (`spec.template.spec.containers[0].image`) | [Running batch jobs and GPU work on Nautilus with Kubernetes](../kb026-nautilus-batch-jobs-and-gpus/) |
| **Google Cloud GKE** | OCI / Docker container | Google Artifact Registry (`REGION-docker.pkg.dev/PROJECT_ID/...`) | Kubernetes Job manifest (`spec.template.spec.containers[0].image`) | [Ursa Major (Google Cloud)](../../services/ursa-major/) and [Ursa Major project request](../kb021-ursa-major-project-request/) |
| **Google Cloud Run** | OCI / Docker container | Google Artifact Registry (`REGION-docker.pkg.dev/PROJECT_ID/...`) | Cloud Run job invocation (`gcloud run jobs create` and `execute`) | [Ursa Major (Google Cloud)](../../services/ursa-major/) and [Ursa Major project request](../kb021-ursa-major-project-request/) |

**Data levels.** The OSPool and NRP Nautilus are Non-sensitive only (P1; no protected data). GKE and Cloud Run in [Ursa Major](../../services/ursa-major/) are Tier 2 recharge projects billed to a lab funding source; what data a project may hold is set when the project is reviewed. Ask Research Computing before putting P3 or P4 data anywhere.

---

## 3. Rules for creating portable research containers

To make your container work reliably across all of these environments, instruct your AI coding agent to follow these core portability rules:

1. **Build for `linux/amd64` (x86_64):** OSPool jobs run on x86_64 machines, and most Nautilus and Google Cloud nodes are x86_64 too. On an Apple Silicon Mac, Docker builds `linux/arm64` images by default, and those fail on x86_64 machines. You must pass `--platform linux/amd64` to `docker buildx build`.
2. **Pin every dependency version:** Never write unversioned installation commands like `pip install pandas` or `apt-get install -y samtools`. Pin specific release numbers (such as `numpy==2.1.3 pandas==2.2.3`). Unpinned dependencies can pull in breaking changes during future rebuilds.
3. **Do not define an `ENTRYPOINT` for OSPool containers:** On the OSPool, HTCondor invokes your container using your specified executable (for example, `executable = /opt/analyze.py`). If your Dockerfile defines an `ENTRYPOINT`, HTCondor passes the script path as an argument to that entrypoint, which can cause execution failures. Leave `ENTRYPOINT` unset, or use a standard default shell.
4. **Keep data out of the container image:** A container image should hold only the code and dependencies required to execute. Input datasets, parameter files, and large reference databases belong in external storage: OSDF or file transfers for the OSPool, PersistentVolumeClaims or S3 buckets for Nautilus, and Cloud Storage buckets for Google Cloud. Keeping data outside the image keeps images small and fast to download.
5. **Install code in standard system paths:** Place your executable scripts and binaries in `/opt` (for example, `/opt/analyze.py`) or `/usr/local/bin`, and make them executable (`chmod +x`). Avoid placing code in `/root` or user-specific home paths that might not be readable when running under non-root user IDs on remote hosts.
6. **Use lightweight base images:** Start from minimal distributions such as `python:3.12-slim`, `debian:bookworm-slim`, or `ubuntu:24.04`. Avoid large desktop or development base images that produce multi-gigabyte downloads.
7. **Use official CUDA base images for GPU software:** If your pipeline requires GPU acceleration, build on official NVIDIA CUDA images (such as `nvidia/cuda:12.6.0-base-ubuntu22.04`) or use prebuilt PyTorch/TensorFlow container images. Verify that the CUDA runtime version in the container matches the CUDA version expected by your PyTorch or JAX installation.
8. **Use explicit version tags, never `latest`:** Tag your images with explicit versions, such as `v1` or `2026-11-05`. The Open Science Data Federation (OSDF) caches `.sif` files by filename and URL. If you overwrite `analyze.sif` in place without updating the filename, remote execute nodes will continue to run the older cached version.
9. **Never bake secrets or credentials into images:** Never include API tokens, passwords, private SSH keys, or cloud access keys inside a Dockerfile or Apptainer definition file. Container images are shared across public registries or distributed caches. Pass credentials at runtime through environment variables or Kubernetes secrets.
10. **Cloud Run architecture rules:** For batch workloads on Google Cloud Run, use Cloud Run jobs rather than Cloud Run services. Cloud Run services are designed for HTTP web endpoints and expect a server listening on the port defined by `$PORT`. Batch scripts that run to completion and exit are executed as Cloud Run jobs.

---

## 4. Safety first: protecting data, code, and credentials

AI coding agents inspect files in your workspace and communicate with remote AI models to generate code. Follow these rules before launching an agent:

> **RESEARCH DATA AND AI SAFETY CHECKLIST**
>
> * **No protected or restricted data:** Never expose P3 or P4 protected data (such as HIPAA health records, FERPA student records, sensitive personal data, or controlled research data) to an AI assistant.
> * **No credentials or access tokens:** Check that your workspace does not contain `.env` files, SSH private keys, AWS/GCP credentials, database passwords, or CILogon tokens before starting an AI session.
> * **No proprietary or restricted code:** Do not provide source code covered by non-disclosure agreements, commercial licenses, or pending patent filings unless your tool terms permit it.
> * **Check UCR AI guidelines:** Review campus guidance on artificial intelligence tools at [https://its.ucr.edu/ai](https://its.ucr.edu/ai).
> * **Inspect before running:** AI assistants can generate plausible commands that contain syntax errors, incorrect resource limits, or unintended deletion flags. Review every generated file and command before executing it on your machine or submitting it to a cluster.

---

## 5. The AI agent workflow: step by step with Hermes Agent

This workflow uses [Hermes Agent](https://hermes-agent.nousresearch.com/), an open-source terminal AI coding agent, as the primary example. Other AI coding assistants (including Claude Code, OpenAI Codex CLI, Gemini CLI, OpenCode, or IDE tools like Cursor and VS Code) follow the same conceptual steps.

### Step 1. Open the agent in your project directory

Install Hermes Agent if you have not already done so:

```bash
# macOS and Linux
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
```

Hermes needs an API key for a model provider; the [nrp-mcp quick start](../kb031-nrp-mcp-quick-start/) walks through installing it on macOS, Linux and Windows and adding a key.

Navigate to your research code repository and launch the agent:

```bash
cd ~/my-research-project
hermes
```

When you ask, the agent reads your project files (scripts, requirements files) to work out what the container needs. It asks before running commands, unless you change that setting.

### Step 2. Provide the containerization prompt

Copy and paste the following prompt template into the agent, updating the bracketed placeholders with your project details:

```text
I have a research pipeline in this directory that I need to containerize.
Here are the project requirements:
1. Main entry script: analyze.py (takes an integer seed as an argument).
2. Language and dependencies: Python 3.12, numpy, pandas.
3. Compute type: CPU only (single core, 1 GB RAM).
4. Target platforms:
   - OSPool (HTCondor submit file and Apptainer .def file)
   - NRP Nautilus (Kubernetes Job YAML)
   - Google Cloud Run (batch job command for Ursa Major Tier 2)

Please provide:
1. A Dockerfile based on python:3.12-slim that installs pinned versions of dependencies,
   copies analyze.py to /opt/analyze.py, sets executable permissions, and defines NO ENTRYPOINT.
2. An Apptainer definition file (analyze.def) with equivalent instructions.
3. The exact docker buildx command to build this image for linux/amd64 architecture.
4. A local test command to verify the container image works.
5. An HTCondor submit file (analyze.sub) configured for the OSPool using +JobDurationCategory = "Medium".
6. A Kubernetes batch Job manifest (analyze-job.yaml) for NRP Nautilus.
7. A gcloud run jobs command pattern for Google Cloud Run using PROJECT_ID and REGION placeholders.
8. A brief README.md documenting how to build, test, and deploy.
```

### Step 3. Review the generated files

Inspect the files generated by the agent against the portability checklist:

* Does the `Dockerfile` avoid `ENTRYPOINT`?
* Are dependency versions pinned with exact numbers (`==`)?
* Is the script placed in `/opt` with executable permissions?
* Did the build command specify `--platform linux/amd64`?
* Does the HTCondor submit file contain `+JobDurationCategory = "Medium"`?
* Does the Kubernetes manifest specify resource requests and limits within cluster policy bounds?

### Step 4. Test the container locally

Build and test the container on your local computer before transferring it to remote clusters.

On macOS (Apple Silicon) or Linux, build the image for `linux/amd64`:

```bash
docker buildx build --platform linux/amd64 -t analyze:v1 --load .
```

Run a short test container locally:

```bash
docker run --rm --platform linux/amd64 analyze:v1 python3 /opt/analyze.py 42
```

Verify that the command exits cleanly and prints the expected research output.

### Step 5. Publish or transfer the container image

Depending on your target cluster, prepare the image for remote access:

* **For the OSPool (Apptainer SIF):** Convert your local Docker image to a `.tar` archive and convert it on your access point, or build the `.sif` file directly on the access point:
  ```bash
  # Option A: Export from local Docker and copy to OSPool AP
  docker save analyze:v1 -o analyze_v1.tar
  scp analyze_v1.tar ap40:

  # On ap40: convert to Apptainer SIF
  apptainer build analyze-v1.sif docker-archive://analyze_v1.tar

  # Option B: Build directly from analyze.def on ap40
  apptainer build analyze-v1.sif analyze.def
  ```
  Move the resulting `.sif` file to your OSDF storage space:
  ```bash
  mkdir -p /ospool/ap40/data/YOUR_OSG_USERNAME/
  mv analyze-v1.sif /ospool/ap40/data/YOUR_OSG_USERNAME/
  ```

* **For NRP Nautilus (OCI Registry):** Push your Docker image to an accessible container registry such as the NRP GitLab registry, Docker Hub, or GitHub Container Registry:
  ```bash
  docker tag analyze:v1 your-username/analyze:v1
  docker push your-username/analyze:v1
  ```

* **For Google Cloud GKE and Cloud Run:** Push the image to your Google Artifact Registry repository in your Ursa Major Tier 2 project (see Section 8).

### Step 6. Run a small test on the target platform, then scale

Submit a test job with a queue of 1 or 2 tasks. Once the test tasks exit with status 0 and produce correct output files, expand your queue to your full production sweep.

---

## 6. What you should get back: tested example and benchmarks

To illustrate the expected output from an AI coding agent, Research Computing tested an end-to-end containerization workflow on 2026-11-05 using an example data analysis script.

### The research script (`analyze.py`)

This test script generates 100,000 random normal values given a random seed, calculates summary statistics using `pandas` and `numpy`, and reports the host information:

```python
#!/usr/bin/env python3
# Example "research script": summarize a CSV column with pandas. Usage: analyze.py <seed>
import sys, socket, numpy as np, pandas as pd
seed = int(sys.argv[1]) if len(sys.argv) > 1 else 0
rng = np.random.default_rng(seed)
df = pd.DataFrame({"x": rng.normal(10, 2, 100000)})
print(f"seed={seed} host={socket.gethostname()} pandas={pd.__version__} mean={df.x.mean():.4f} sd={df.x.std():.4f}")
```

### The generated Dockerfile (`Dockerfile`)

```dockerfile
# Container for analyze.py: Python 3.12 + numpy + pandas. No ENTRYPOINT (OSPool runs your executable inside it).
FROM python:3.12-slim
RUN pip install --no-cache-dir numpy==2.1.3 pandas==2.2.3
COPY analyze.py /opt/analyze.py
RUN chmod +x /opt/analyze.py
```

### The generated Apptainer definition (`analyze.def`)

```singularity
Bootstrap: docker
From: python:3.12-slim

%files
    analyze.py /opt/analyze.py

%post
    pip install --no-cache-dir numpy==2.1.3 pandas==2.2.3
    chmod +x /opt/analyze.py
```

### Measured build times and file sizes (2026-11-05)

* **Local Docker build on Apple Silicon Mac:**
  `docker buildx build --platform linux/amd64 -t analyze:v1 --load .`
  Completed in approximately 14 seconds.
* **Docker archive export:**
  `docker save analyze:v1 -o analyze_v1.tar`
  Produced an 89 MB archive file.
* **Apptainer conversion on access point (ap40):**
  `apptainer build analyze-docker-v1.sif docker-archive://analyze_v1.tar`
  Completed in approximately 7 seconds.
* **Direct Apptainer build on access point (ap40):**
  `apptainer build analyze-v1.sif analyze.def`
  Completed in approximately 15 seconds, creating an 88 MB `.sif` file.

*Apptainer cache tip on ap40:* If your first `apptainer build` fails with `failed to create build parent dir: stat /home/YOUR_OSG_USERNAME/.apptainer_cache: no such file or directory`, run `mkdir -p ~/.apptainer_cache`. On ap40, the environment variable `APPTAINER_CACHEDIR` points to `~/.apptainer_cachedir`.

### Tested OSPool submission (`sif.sub`)

This submit file references the `.sif` image in OSDF storage and runs 5 tasks with seeds 0 through 4:

```condor
container_image = osdf:///ospool/ap40/data/YOUR_OSG_USERNAME/analyze-v1.sif
executable = /opt/analyze.py
transfer_executable = false
arguments = $(Process)
output = out/sif_$(Process).out
error = log/sif_$(Process).err
log = log/sif.log
+JobDurationCategory = "Medium"
request_cpus = 1
request_memory = 1GB
request_disk = 2GB
queue 5
```

When submitted from ap40 on 2026-11-05, all 5 jobs completed with exit status 0 on machines at three universities (Utah, UW-Milwaukee and Kansas State). One job first landed on a machine where it never started; it was removed with `condor_rm` and resubmitted, and then finished in seconds.

### Direct Docker Hub submission (`hub.sub`)

For small verification tests, you can also run directly against an official image on Docker Hub:

```condor
container_image = docker://python:3.12-slim
executable = run_hub.sh
transfer_input_files = analyze.py
output = out/hub_$(Process).out
error = log/hub_$(Process).err
log = log/hub.log
+JobDurationCategory = "Medium"
request_cpus = 1
request_memory = 1GB
request_disk = 2GB
queue 2
```

In the test, `run_hub.sh` was a one-line script that printed the Python version and host name; the plain `python:3.12-slim` image has no numpy or pandas, so it cannot run `analyze.py` itself. Both jobs ran cleanly on machines at Utah and Montana State. OSG facilitators request that production workloads use OSDF or CVMFS container images rather than pulling from Docker Hub at scale.

---

## 7. Ready prompts for common research workflows

Copy and adapt these prompts for your specific research programming language and framework.

### Prompt 1: Python with scientific packages (numpy, pandas, scipy, scikit-learn)

```text
I have a Python scientific analysis pipeline.
Files: run_model.py, requirements.txt
Dependencies: python 3.11, numpy, scipy, scikit-learn, pandas.
Please create:
1. A Dockerfile using python:3.11-slim with pinned versions from requirements.txt.
2. An Apptainer definition file (model.def).
3. Do not include an ENTRYPOINT. Place run_model.py at /opt/run_model.py and chmod +x.
4. An HTCondor submit file for OSPool requesting 1 CPU, 2 GB RAM, 2 GB disk, and +JobDurationCategory = "Medium".
5. A command to test the container locally on an Apple Silicon Mac using --platform linux/amd64.
```

### Prompt 2: R with CRAN and Bioconductor packages

```text
I have an R differential expression workflow.
Files: run_deseq.R, packages.R
Dependencies: R 4.4, tidyverse, DESeq2 (Bioconductor), data.table.
Please create:
1. A Dockerfile based on rocker/r-ver:4.4.2 that installs the required CRAN and Bioconductor packages.
2. An Apptainer definition file (deseq.def).
3. Place run_deseq.R at /opt/run_deseq.R and make it executable.
4. An HTCondor submit file for OSPool requesting 2 CPUs, 8 GB RAM, 5 GB disk, +JobDurationCategory = "Medium",
   transferring an input sample matrix $(sample).csv and returning output figures.
```

### Prompt 3: Compiled C or Fortran application with a Makefile

```text
I have a C simulation that compiles with a Makefile.
Files: Makefile, simulation.c, simulation.h
Dependencies: gcc, make, libgsl-dev (GNU Scientific Library), OpenMP.
Please create:
1. A multi-stage Dockerfile based on ubuntu:24.04 that compiles simulation.c with -O3 -fopenmp,
   installs libgsl, and places the compiled binary at /opt/simulation.
2. An Apptainer definition file (simulation.def) that performs the same compilation.
3. A local test command to run /opt/simulation with 4 OpenMP threads.
4. An HTCondor submit file requesting request_cpus = 4, request_memory = 4GB, and setting OMP_NUM_THREADS=4.
```

### Prompt 4: PyTorch GPU training job

```text
I have a PyTorch neural network training script.
Files: train.py, model.py
Dependencies: Python 3.11, PyTorch 2.3.1 with CUDA 11.8 support, torchvision.
Please create:
1. A Dockerfile based on pytorch/pytorch:2.3.1-cuda11.8-cudnn8-runtime.
2. An Apptainer definition file (gpu_train.def).
3. An HTCondor submit file for OSPool requesting 1 GPU, gpus_minimum_memory = 16000, 1 CPU, 8 GB RAM.
4. A Kubernetes Job YAML for NRP Nautilus requesting nvidia.com/gpu: 1, 4 CPUs, 16Gi memory,
   and mounting a PersistentVolumeClaim at /data.
```

### Prompt 5: Bioinformatics toolchain (samtools, bwa)

```text
I have a sequence alignment workflow.
Files: align.sh
Dependencies: bwa, samtools, fastqc.
Please create:
1. A Dockerfile based on debian:bookworm-slim that installs bwa, samtools, and fastqc via apt-get,
   cleans package caches, and places align.sh at /opt/align.sh.
2. An Apptainer definition file (align.def).
3. An HTCondor submit file for OSPool that takes sample ID as an argument, requests 4 CPUs, 8 GB RAM, 20 GB disk,
   and pulls reference genome data from OSDF.
```

### Prompt 6: Jupyter notebook converted to headless batch execution

```text
I have a Jupyter notebook exploratory analysis that I want to run as an unattended batch sweep.
Files: analysis.ipynb
Dependencies: Python 3.11, papermill, matplotlib, pandas, seaborn.
Please:
1. Convert analysis.ipynb to run headlessly using papermill, parameterized by an input integer seed and sample name.
2. Create a Dockerfile and Apptainer definition file that installs papermill and runtime libraries.
3. Write a wrapper script /opt/run_notebook.sh that executes papermill with arguments.
4. Write an HTCondor submit file to run this notebook sweep over 10 parameter sets.
```

---

## 8. Running on Google Cloud (Ursa Major Tier 2)

If your research requires cloud-managed scale, managed databases, or commercial cloud APIs, your container can run on Google Cloud through [Ursa Major](../../services/ursa-major/). GKE and Cloud Run are Tier 2 services in Ursa Major, billed to a lab funding source through ITS. See [Ursa Major project request](../kb021-ursa-major-project-request/) to establish a cloud project.

The commands in this section follow standard Google Cloud CLI patterns. They are marked with CHECK notes because they were drafted as illustrative templates and were not executed for this article. Replace `PROJECT_ID` and `REGION` with your project identifiers.

### Pushing your container to Google Artifact Registry

Before running on GKE or Cloud Run, authenticate Docker and push your local image to Google Artifact Registry:

```bash
# CHECK: Artifact Registry push pattern (untested for this article)
# Configure authentication for your target region
gcloud auth configure-docker REGION-docker.pkg.dev

# Tag your local image for Artifact Registry
docker tag analyze:v1 REGION-docker.pkg.dev/PROJECT_ID/research-images/analyze:v1

# Push the container image
docker push REGION-docker.pkg.dev/PROJECT_ID/research-images/analyze:v1
```

### Running batch tasks with Cloud Run jobs

Cloud Run jobs are designed for containerized batch workloads that run to completion. Create and execute a batch job with:

```bash
# CHECK: Cloud Run job pattern (untested for this article)
# Create the batch job definition
gcloud run jobs create analyze-batch \
  --image=REGION-docker.pkg.dev/PROJECT_ID/research-images/analyze:v1 \
  --tasks=5 \
  --command="/opt/analyze.py" \
  --args="0" \
  --region=REGION

# Execute the job
gcloud run jobs execute analyze-batch --region=REGION
```

*Note on Cloud Run services versus jobs:* If you deploy a container as a Cloud Run *service*, Cloud Run expects an HTTP server listening on the port specified by `$PORT`. For research scripts and simulations that execute and exit, always deploy as a Cloud Run *job*.

### Running on Google Kubernetes Engine (GKE)

If you maintain a GKE cluster in your Ursa Major project, submit your container as a Kubernetes Job:

```yaml
# CHECK: GKE Kubernetes Job manifest (untested for this article)
apiVersion: batch/v1
kind: Job
metadata:
  name: analyze-gke-job
spec:
  backoffLimit: 2
  template:
    spec:
      restartPolicy: Never
      containers:
        - name: analyze
          image: REGION-docker.pkg.dev/PROJECT_ID/research-images/analyze:v1
          command: ["/opt/analyze.py", "42"]
          resources:
            requests:
              cpu: "1"
              memory: 1Gi
            limits:
              cpu: "1"
              memory: 1Gi
```

Apply the job to your GKE cluster:

```bash
# CHECK: GKE job apply (untested for this article)
kubectl apply -f analyze-gke-job.yaml
```

---

## 9. Next steps and getting help

Once your container is verified locally and running on your target platform, refer to these guides for scaling up and managing data:

* **OSPool data transfers and submit files:** Read [Moving data on the OSPool](../kb036-ospool-moving-data/) to store containers and datasets in OSDF, and read [Submitting OSPool jobs and getting results](../kb037-ospool-jobs-and-results/) for queue management.
* **OSPool GPU jobs:** Read [GPU jobs on the OSPool](../kb047-ospool-gpu-jobs/) to select GPU memory and compute capabilities.
* **OSPool job architectures:** Read [Common OSPool job types](../kb048-ospool-common-job-types/) for parameter sweeps, DAGMan multi-step workflows, and checkpointing.
* **NRP Nautilus Kubernetes batch computing:** Read [Running batch jobs and GPU work on Nautilus with Kubernetes](../kb026-nautilus-batch-jobs-and-gpus/) and [Run Nautilus jobs from your AI assistant (nrp-mcp quick start)](../kb031-nrp-mcp-quick-start/).
* **Campus cluster:** For workloads requiring low-latency MPI across multiple nodes or local campus storage, compute on the campus [HPCC](../../services/hpcc/).

### Support and consultations

* **UCR Research Computing:** We can help you decide which platform fits and look over your first submit file or Kubernetes manifest. [Contact Research Computing](../../help/).
* **OSPool facilitators:** For access point issues, project approvals, or HTCondor troubleshooting on the OSPool, contact OSG facilitators at `support@osg-htc.org` or attend weekly virtual office hours (Tuesdays, [https://osg-htc.org/OfficeHoursZoom](https://osg-htc.org/OfficeHoursZoom)).
