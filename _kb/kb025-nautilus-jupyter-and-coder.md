---
title: "Notebooks, desktops and VS Code in the browser (JupyterHub, Coder)"
kb_id: KB025
topic: National
audience: "UCR researchers and students who want to use Nautilus from a web browser, without learning Kubernetes first"
reviewed: 2026-10-06
owner: Research Computing
series: nautilus
series_order: 3
review_notes:
  - "Written 2026-10-06 from the NRP documentation (nrp.ai/documentation, fetched 2026-10-06) and tests run in a UCR namespace the same day."
  - "CHECK: the exact hardware choices on the JupyterHub West spawn form (CPU, memory, GPU types, image list, region) were not captured; the article describes them only in general terms and points to the Scientific Images page."
  - "CHECK: whether the hosted JupyterHub images include code-server (VS Code in the browser); the article does not claim it and points to Coder for VS Code."
  - "CHECK: reaching the in-cluster S3 endpoint (http://rook-ceph-rgw-nautiluss3.rook) from a hosted JupyterHub server was not tested; the outside endpoint is shown as the default."
  - "CHECK: how to ask for a larger JupyterHub or Coder home folder (the docs say it can be requested; we assume the Nautilus Support chat)."
  - "CHECK: whether the hosted hub allows more than one server per user (named servers); the table says one notebook server."
  - "CHECK: whether NRP Coder workspaces auto-stop when idle; the docs do not say, so the article only says you start and stop them."
  - "CHECK: the Coder sign-in button label (OpenID Connect) and the location of the SSH key in user settings, as described in the NRP Coder page; not walked through in a UCR account."
---

## 1. Two ways to use Nautilus without Kubernetes

Most researchers do not want to start with YAML files and `kubectl`. The National Research Platform (NRP) runs two web services on its Nautilus cluster that let you skip that step. You sign in with your UCR account, pick the hardware you need, and get a working environment in a browser tab.

| | **JupyterHub West** | **Coder** |
| :--- | :--- | :--- |
| Address | [jupyterhub-west.nrp-nautilus.io](https://jupyterhub-west.nrp-nautilus.io) | [coder.nrp-nautilus.io](https://coder.nrp-nautilus.io) |
| What you get | A JupyterLab server: notebooks, terminal, file browser | One or more "workspaces": JupyterLab, VS Code, a terminal, Linux desktops, RStudio and more |
| Before first use | Be a member of a namespace | Be a member of a namespace **and** have your Coder account approved by the NRP admins |
| Home folder | Persistent, 5 GB to start, can be extended on request | Persistent per workspace, 5 GB to start, more on request |
| When it stops | Shuts down 1 hour after your browser disconnects | You start and stop workspaces; each keeps its home folder until you delete the workspace |
| How many | One notebook server | Up to 5 active workspaces |
| Best for | Quick analysis, teaching examples, trying a GPU, prototyping code | Day-to-day development, desktop applications, R, FPGA work, longer-lived setups |

Both are run by the NRP, not by UCR, and there is no recharge from UCR for using them. Both sit on the same cluster as everything else in this series, so the same [Cluster Policies](https://nrp.ai/documentation/userdocs/start/policies/) and data rules apply.

If you have not signed up yet, start with [KB024: Getting access](../kb024-nautilus-getting-access/). You only need Steps 1 and 2 there (an NRP account and namespace membership); the `kubectl` setup is optional for this article.

---

## 2. Data rules first

* **Non-sensitive data only (UCR P1).** The NRP states that its systems have no storage suitable for HIPAA, PII, FISMA, FERPA or other protected data, and that such data must not be stored there. That includes files you upload into a notebook or a Coder workspace. Interview transcripts with names, student records, patient data and CUI do not belong on Nautilus. For P2 and higher data, use the [HPCC](../../services/hpcc/), [Ursa Major](../../services/ursa-major/) or the [Secure Enclave](../../services/secure-enclave/), or [ask Research Computing](../../help/).
* **Non-commercial use only.** The NRP is non-profit and non-commercial, and its Acceptable Use Policy applies that to all use, including these services.
* **Not a place to keep things.** Nautilus storage is for data you are actively computing on, not an archive. Volumes that are not accessed for 6 months can be purged without notice. Keep your code in Git and your important results somewhere else as well.

---

## 3. JupyterHub West: a notebook server in a few clicks

### Start a server

1. Make sure you are in a namespace. Sign in at [nrp.ai/namespaces](https://nrp.ai/namespaces); your namespaces are shown in bold. Without one, the hub cannot start a server for you.
2. Go to [jupyterhub-west.nrp-nautilus.io](https://jupyterhub-west.nrp-nautilus.io) and sign in through CILogon, choosing **University of California, Riverside**.
3. On the spawn page, **choose the hardware** (CPU cores, memory and, if you need one, a GPU) and a software image. Ask for what you will actually use; the [Cluster Policies](https://nrp.ai/documentation/userdocs/start/policies/) explain why idle requests are a problem on a shared cluster.
4. Click start. It can take a few minutes the first time, while the node downloads the image.
5. You land in JupyterLab. Your home folder is `/home/jovyan`.

### Choosing an image

The hub offers images from two families described on the NRP [Scientific Images](https://nrp.ai/documentation/userdocs/running/sci-img/) page:

* **Docker Stacks** (Jupyter's own images): Python, R, Julia, data science, and GPU builds of TensorFlow and PyTorch.
* **B-Data** images: Python, R and Julia with CUDA, including R images such as tidyverse and geospatial variants.
* **The NRP Python image**, based on the Docker Stacks TensorFlow and PyTorch images with extra packages. You can ask in Nautilus Support for more libraries to be added to it. Its package list is in the [NRP GitLab](https://gitlab.nrp-nautilus.io/nrp/scientific-images/python).
* **Desktop images**: one with an X11 desktop you can open from Jupyter, and a **Selkies Desktop** image that streams a full KDE Plasma desktop. In the Selkies image, the Selkies item in the JupyterLab launcher opens the desktop in a new browser tab, signed in through JupyterHub, and it uses the GPU for encoding when your server has one.

The NRP notes that if you open notebooks with VS Code against the NRP Python image, you should pick the base Python environment as the kernel, and call `python` or `python3` rather than `/usr/bin/python3`.

### Installing extra packages

Install into your home folder so the packages survive a restart:

```bash
pip install --user --upgrade pandas scikit-learn
```

In a notebook cell, prefix the same command with `!`. Remember the home folder starts at 5 GB, and Python environments, model weights and datasets fill it fast. Check usage from a terminal with:

```bash
du -sh ~/.cache ~/.local ~/* 2>/dev/null | sort -h | tail
```

If you want your own conda environments to persist between sessions, the NRP suggests keeping them under your home folder with a `~/.condarc` like this (the image needs `nb_conda_kernels` for them to show up as notebook kernels):

```yaml
envs_dirs:
  - /home/jovyan/my-conda-envs/
```

### The one-hour rule

**Your server shuts down 1 hour after your browser disconnects from it.** Closing the tab, a laptop going to sleep or losing Wi-Fi all count. Files in your home folder survive; whatever was running in memory does not.

That shapes how to use the hub:

* Good for: exploring data, writing and testing code, a training run of a few minutes, a class exercise.
* Not good for: an overnight model training run or a simulation that takes a day. Turn that into a Kubernetes **Job** instead, which runs without a browser and restarts if a node fails. [KB026](../kb026-nautilus-batch-jobs-and-gpus/) shows how.

A common pattern: prototype in JupyterHub on a small slice of the data, save the working code as a `.py` script, then submit it as a Job against the full dataset.

### Getting data in and out

* **Small files:** drag them into the JupyterLab file browser, or right-click a file there and choose Download.
* **Code:** use Git from the JupyterLab terminal. The NRP runs its own [GitLab](https://gitlab.nrp-nautilus.io), or use GitHub.
* **Public datasets:** download them straight into the server with `wget`, `curl` or the dataset's own tool. That is usually much faster than going through your laptop.
* **Larger data:** use the NRP's S3 object storage. Get keys from the NRP portal (User, then S3 Tokens) and use the outside endpoint `https://s3-west.nrp-nautilus.io`. Never paste keys into a notebook you share or commit to Git; keep them in a file in your home folder or an environment variable. [KB027](../kb027-nautilus-storage-and-data/) covers S3, volumes and moving data in detail.

### Trying a language model in a notebook

The NRP's [LLM in JupyterHub](https://nrp.ai/documentation/userdocs/ai/llm-jupyterhub/) page shows how to run open models with Hugging Face libraries on a GPU server. Two things to plan for: model files are cached under `/home/jovyan/.cache/huggingface` and can reach hundreds of GB, so ask for a larger home folder first; and you need a GPU type with enough memory for the model. If you only want to *call* a model rather than host one, the NRP's hosted models are simpler. See [KB028](../kb028-nautilus-llm-api/).

---

## 4. Coder: persistent workspaces with VS Code, desktops and RStudio

[Coder](https://nrp.ai/documentation/userdocs/coder/coder/) gives you development environments ("workspaces") that stay put. You configure a workspace once, start it when you need it, and stop it when you are done. Each one has its own persistent home folder.

### Get approved, then sign in

1. Be a member of a namespace (see [KB024](../kb024-nautilus-getting-access/)).
2. **Ask for Coder access in the Nautilus Support chat.** The NRP admins approve Coder accounts individually. Mention your name, institution and namespace.
3. After approval, go to [coder.nrp-nautilus.io](https://coder.nrp-nautilus.io) and sign in with your institutional account through OpenID Connect.

### Pick a template

Every workspace starts from a template. The NRP currently lists:

| Template | What is in it | Typical use |
| :--- | :--- | :--- |
| **General** | JupyterLab, an in-browser terminal, VS Code integration, Cursor integration and a noVNC desktop. You choose region, CPU cores, memory, GPU type and FPGAs. | The everyday choice: a JupyterHub-like setup you can come back to |
| **Selkies** | A KDE Plasma desktop streamed to your browser, with PyCharm, VS Code in the browser (code-server), Firefox, Chrome, LibreOffice and Wine for Windows applications. 1 GPU by default, up to 8; it encodes on the CPU if you choose none. | Graphical applications, visualization, tools that only come as desktop programs |
| **CUDA/PyTorch/TensorFlow** | A large set of machine learning libraries with GPU support | Deep learning development |
| **U55C FPGA Vitis Workflow** | Several versions of Vivado and Vitis, the Xilinx license server (including the VitisNetP4 license), and Xilinx Alveo U55C FPGAs on request | FPGA design and deployment |
| **ESnet FPGA SmartNICs** | Everything in the Vitis template plus ESnet SmartNIC tools for P4-programmable 100 Gbps network cards | Networking research |
| **Other environments** | Additional images, including **RStudio** and Golang | R users, other languages |

You can change a workspace's settings (CPU, memory, GPU) later from its settings menu.

### Rules to know

* **Up to 5 active workspaces** per user.
* **Home folder starts at 5 GB**; you can ask for more.
* **Deleting a workspace deletes its storage volume.** Everything in that workspace's home folder goes with it. Push code to Git and copy results out before you delete.
* **Older workspaces:** the NRP warns that if your workspace was created before 1 November 2024, you should back up your data before updating the workspace version, or the data might be lost.
* Each workspace comes with an **SSH key** (shown in your Coder user settings) that you can add to GitLab or GitHub, so `git push` works from inside the workspace.
* The **Coder CLI**, installed on your own computer, lets you manage your account and workspaces and SSH into any workspace from your terminal. See the [Coder page](https://nrp.ai/documentation/userdocs/coder/coder/) for the download link.
* Stop workspaces you are not using, especially ones holding a GPU. A GPU assigned to your workspace is unavailable to anyone else while it runs, and the NRP watches for under-used requests.

---

## 5. Which one fits your work? Scenarios across disciplines

These are starting points, not rules. Mix them: many people use JupyterHub for a quick look and Coder or Jobs for the real work.

**Digital humanities: topic modeling a public-domain corpus.** A historian has 20,000 digitized newspaper pages from a public archive. JupyterHub with a CPU-only Python image is enough: load the text, run spaCy or gensim, and plot topics over time. If the corpus outgrows 5 GB, keep the raw text in S3 and stream it in. Note that the corpus must be non-sensitive; oral-history transcripts with identifiable people belong elsewhere.

**Social science: survey analysis in R.** A sociologist works in R and the tidyverse on a public, de-identified survey dataset. A Coder workspace from the RStudio template feels like desktop RStudio, keeps packages installed in the workspace's home folder between sessions. JupyterHub's R images are an alternative for shorter sessions. Restricted-use survey files, or anything with direct identifiers, need a P2-or-higher environment such as the [Secure Enclave](../../services/secure-enclave/).

**Life sciences: segmenting microscopy images.** A cell biology lab wants to try a deep learning segmentation model on a few hundred images. Start a JupyterHub server with a GPU and a PyTorch image, install the tool with `pip install --user`, and check results visually in the notebook. Once the settings are right, the batch over thousands of images becomes a Job ([KB026](../kb026-nautilus-batch-jobs-and-gpus/)) reading from S3 or a shared volume ([KB027](../kb027-nautilus-storage-and-data/)). Human or patient-derived images with identifiers do not go on Nautilus.

**Engineering: a desktop CAD or visualization tool.** A mechanical engineering student needs to view large simulation output in ParaView-style software that only has a graphical interface. A Coder **Selkies** workspace streams a GPU-accelerated Linux desktop to the browser. Install the application in the home folder or ask how to build a custom image. Wine is included for some Windows-only tools.

**Physics and chemistry: prototyping a GPU code.** A physicist is porting a NumPy simulation to CuPy or JAX. A Coder workspace from the CUDA template, opened in VS Code, gives a persistent development box with a GPU; test at small size there, then run production sizes as Jobs, which can use up to 8 GPUs on one node.

**Computer science: fine-tuning a model.** A CS student fine-tunes a small open model. Develop and debug in a Coder workspace or JupyterHub on one GPU. Long training runs should be Jobs, not a notebook waiting on an open browser tab. If the goal is to use a large model rather than train one, the NRP's hosted models may be all you need ([KB028](../kb028-nautilus-llm-api/)).

**Electrical engineering: FPGA development.** A lab working on hardware accelerators uses the **U55C FPGA Vitis Workflow** template. Vivado and Vitis run in the workspace's noVNC desktop, the license server is already configured, and U55C cards are requested in the template settings. See the NRP's [AMD/Xilinx FPGA page](https://nrp.ai/documentation/userdocs/fpgas/vivado-vitis/).

**Teaching: a notebook-based lab section.** An instructor wants 30 students running the same notebooks. The hosted JupyterHub works if every student is in a namespace; a training join link adds them in one step. For a course-specific image and shared class data, a namespace admin can run their own JupyterHub (Section 6). [KB030](../kb030-nautilus-teaching-and-workshops/) covers both.

---

## 6. When the hosted services are not enough

### Your own Jupyter pod (for kubectl users)

If you need an image the hub does not offer, you can run a Jupyter container in your own namespace and reach it with `kubectl port-forward`. The NRP's [ML/Jupyter pod](https://nrp.ai/documentation/userdocs/jupyter/jupyter-pod/) page walks through it. A pod like this, without a controller, is treated as interactive: it is destroyed after 6 hours and is limited to 2 GPUs, 32 GB RAM and 16 CPU cores. Delete it when you finish. One advantage: because it runs in your namespace, it can mount your namespace's storage volumes, so it sees the same data as your Jobs.

### Your own JupyterHub (for a lab or class)

A namespace admin can deploy a JupyterHub in their own namespace with Helm, following the NRP's [Deploy JupyterHub](https://nrp.ai/documentation/userdocs/jupyter/jupyterhub/) guide. That lets you choose the images, add a shared class folder, and decide who can sign in. The NRP sets conditions:

* **Culling is required.** Idle servers must be shut down after no more than 6 hours (the NRP's example uses 1 hour). A hub without culling is against cluster policy.
* **Do not leave it open to anyone.** Restrict sign-in to UCR (and your collaborators' institutions) with `allowed_idps`, or to a list of people with `allowed_users`. An open hub can get the namespace locked.
* The NRP recommends adding its admins as hub admins, so they can help when something breaks.

This takes Kubernetes and Helm experience. If you are planning it for a course, [contact Research Computing](../../help/) early and read [KB030](../kb030-nautilus-teaching-and-workshops/).

---

## 7. Troubleshooting

| Symptom | Likely cause | What to do |
| :--- | :--- | :--- |
| JupyterHub signs me in but cannot start a server | You are not in a namespace yet | Check [nrp.ai/namespaces](https://nrp.ai/namespaces); ask your PI to add you |
| My server was gone when I came back | It shut down 1 hour after the browser disconnected | Start it again; move long runs to Jobs |
| The server stays pending for a long time | The hardware you asked for (often a specific GPU) is busy | Try a smaller request or a different GPU type, or try later |
| `No space left on device` in my home folder | The 5 GB home is full | Clear `~/.cache`, move data to S3, or ask for a larger home folder |
| Coder says my account is not approved | Coder needs admin approval | Ask in the Nautilus Support chat |
| I deleted a Coder workspace and lost files | Deleting a workspace deletes its volume | Keep code in Git and results elsewhere; this cannot be undone |
| The Selkies desktop is laggy | Network path or encoder choice | The NRP's [GUI Desktop](https://nrp.ai/documentation/userdocs/running/gui-desktop/) page has tips on streaming settings |

When you ask for help in Nautilus Support, say which service you are using and its URL. The NRP notes that the hosted JupyterHub West runs in the namespace `jupyterlab`, which helps the admins find your server.

---

## Getting help

* **NRP documentation:** [JupyterHub Service](https://nrp.ai/documentation/userdocs/jupyter/jupyterhub-service/), [Using Coder](https://nrp.ai/documentation/userdocs/coder/coder/), [Scientific Images](https://nrp.ai/documentation/userdocs/running/sci-img/) and [Cluster Policies](https://nrp.ai/documentation/userdocs/start/policies/).
* **NRP support:** the Nautilus Support chat on Matrix (registration is linked from the NRP [Getting access](https://nrp.ai/documentation/userdocs/start/getting-started/) page), or the [NRP contact page](https://nrp.ai/contact). Coder approval and home-folder increases go through the NRP.
* **UCR Research Computing:** research-computing@ucr.edu or the [Get help](../../help/) page. We can help you choose between JupyterHub, Coder, the HPCC and other options, or plan a class setup. We do not run these NRP services and cannot approve accounts or change their limits.

## Related guides

* [KB023: Researcher guide to NRP Nautilus](../kb023-nautilus-researcher-guide/)
* [KB024: Getting access to Nautilus: accounts, namespaces and kubectl](../kb024-nautilus-getting-access/)
* KB025: Notebooks, desktops and VS Code in the browser (this article)
* [KB026: Running batch jobs and GPU work with Kubernetes](../kb026-nautilus-batch-jobs-and-gpus/)
* [KB027: Storage and moving data on Nautilus](../kb027-nautilus-storage-and-data/)
* [KB028: Using the NRP's hosted large language models](../kb028-nautilus-llm-api/)
* [KB029: Hosting a lab web tool or service on Nautilus](../kb029-nautilus-hosting-web-tools/)
* [KB030: Teaching a class or workshop on Nautilus](../kb030-nautilus-teaching-and-workshops/)
* [NRP Nautilus service page](../../services/nautilus/)
