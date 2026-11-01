---
title: "Research Computing cluster portal: Jupyter notebooks"
topic: Cloud
description: "Start JupyterLab on a compute node of the Research Computing HPC cluster from the web portal: choose a Python environment, cores, a GPU, and hours; open notebooks and terminals; add your own packages and kernels; and stop the session cleanly. Part 3 of the portal guide series."
audience: "Members of labs that Research Computing has set up on its HPC cluster in Google Cloud"
reviewed: 2026-11-01
owner: Research Computing
unlisted: true
sitemap: false
series: ursa-portal
series_order: 3
review_notes:
  - "Unlisted on purpose (2026-10-29): see the first article in this series for the audience and mechanism."
  - "Run end to end on 2026-10-29: form, queued and running cards, JupyterLab on ucrslurmcl-stdnodeset-0 with python-sci/2026.10, the example notebook executed (node, Slurm job, 4 cores, pandas describe, matplotlib plot). Screenshots are from that session with the user name replaced by netid."
  - "That run found that notebooks could not start a kernel (Jupyter's cross-origin check rejected the proxied requests); fixed the same day in the app template (allow_origin set to the portal's own origin) and re-tested."
  - "The venv + ipykernel recipe was run on the login node on 2026-10-29 with python-sci/2026.10 (tabulate installed into a --system-site-packages venv, kernel registered, then removed)."
  - "2026-11-01 sync with cluster changes: core limits per partition incl. gpu1v1 (the form now enforces them, ucr-slurm-production PR #33); V100 PyTorch note from test job 1621 (python-ml 2.5.1 and PyPI cu126 run on sm_70; cu128 and cu130 fail with no kernel image). The form again preselects python-sci 2026.10, matching the screenshots."
---

This is part 3 of the portal series. If you have not connected yet, start with [Getting connected](../ursa-portal-getting-started/).

The portal's **Jupyter** app starts **JupyterLab** on a compute node, as a Slurm job, with one of the cluster's ready-made Python environments loaded. You get the node's cores (and its GPU, if you pick one) all to yourself for the hours you ask for, and your notebooks live in your home directory, so they are there next time and visible over SSH.

## Start a session

1. Open **Interactive Apps > Jupyter**.
2. Fill in the form:

![The Jupyter launch form with Python environment set to python-sci 2026.10, partition standard, 4 cores, 1 hour and the email-on-start checkbox](../../assets/images/ursa-portal/jupyter-form.png)

| Field | What to choose |
| --- | --- |
| **Python environment** | Which Python is loaded (table below). Most people want **python-sci**. |
| **Partition** | **standard** (16 cores, 124 GB per node) for most work; **gpul4** (8 cores and one NVIDIA L4 GPU with 24 GB) for PyTorch and other GPU code; **gpu1v1** (4 cores and an NVIDIA V100 GPU with 16 GB), for labs with access to it; **highmem** (32 cores, 496 GB) for very large in-memory data. |
| **Cores** | How many cores your notebook can use. 4 is plenty for exploring; ask for more only for parallel code. The most you can ask for is the partition's cores per node: 16 on standard, 8 on gpul4, 4 on gpu1v1, 32 on highmem. The form stops you going over. |
| **Number of hours** | How long the session may run, up to 24. It stops at the end, even mid-calculation, so save often. |
| **I would like to receive an email when the session starts** | Handy when a GPU node takes a few minutes to start. |

3. Click **Launch**. You land on **My Interactive Sessions** with a card for the new session:

![A queued Jupyter session card: the job is waiting for its compute node to start](../../assets/images/ursa-portal/jupyter-queued.png)

**Queued** means the compute node is starting. Nodes power down when idle, so allow about a minute and a half on **standard**, and several minutes on **gpul4** or **gpu1v1** (in our test, about six) because GPU nodes start from scratch and depend on Google having L4 capacity. Then the card turns green:

![A running Jupyter session card showing the host, time remaining and session ID, with the Connect to Jupyter button](../../assets/images/ursa-portal/jupyter-running.png)

4. Click **Connect to Jupyter**. JupyterLab opens in a new tab.

## The Python environments

| Environment | What is in it | Use with |
| --- | --- | --- |
| **python-sci 2026.10** | numpy, scipy, pandas, matplotlib, scikit-learn, statsmodels, xarray, astropy and astronomy tools, and more | standard or highmem |
| **python-sci 2026.09** | The previous release of the same, for reproducing older results | standard or highmem |
| **python-gw 2026.10** | Gravitational-wave tools: LIGO LAL, Bilby, PyCBC, GWpy | standard |
| **python-ml 2026.09** | PyTorch with CUDA, for machine learning | **gpul4** or **gpu1v1** (a GPU) |

To see exactly what is in an environment, run `%pip list` in a notebook cell, or `module show python-sci/2026.10` in a terminal. The same environments are available in batch jobs with `module load`, so code you write in a notebook runs unchanged in a batch script.

## JupyterLab on a compute node

JupyterLab opens in your home directory:

![The JupyterLab launcher with the file browser on the left showing kb-demo, and tiles for a Python 3 notebook, console, terminal, text file and markdown file](../../assets/images/ursa-portal/jupyterlab-launcher.png)

* The **file browser** on the left is your home directory. Double-click folders to open them; drag files from your computer onto it to upload them.
* The **Launcher** (the + tab) makes a new **Notebook**, **Console**, **Terminal**, or text or Markdown file.
* A **Terminal** here is a shell on the compute node itself, inside your session's cores. It is the portal's easiest working command line: `module load`, `sbatch`, `squeue`, `git` and everything else work as they do over SSH.

### Worked example: analyse a CSV on the node

This notebook reads a small CSV, summarizes it and saves a plot. The first cell checks where it is running:

```python
import os, socket
import numpy as np, pandas as pd

print("Node:          ", socket.gethostname())
print("Slurm job:     ", os.environ.get("SLURM_JOB_ID"))
print("Cores I can use:", len(os.sched_getaffinity(0)))
```

```python
df = pd.read_csv("data/measurements.csv")
df.describe().round(2)
```

```python
import matplotlib.pyplot as plt

fig, ax = plt.subplots(figsize=(8, 3))
ax.plot(df.time_s, df.temperature_c, lw=0.8, label="raw")
ax.plot(df.time_s, df.temperature_c.rolling(15, center=True).mean(), lw=2, label="15-point mean")
ax.set_xlabel("time (s)"); ax.set_ylabel("temperature (deg C)"); ax.legend()
os.makedirs("results", exist_ok=True)
fig.savefig("results/temperature.png", dpi=150, bbox_inches="tight")
```

Here it is after **Run > Run All Cells**. The notebook is on compute node `ucrslurmcl-stdnodeset-0`, in Slurm job 1612, with the 4 cores the form asked for:

![The example notebook after running: node name, Slurm job number and four cores printed, then the summary table of time, temperature and pressure](../../assets/images/ursa-portal/jupyter-notebook.png)

![The plot cell and its output: raw temperature readings over 200 seconds with a smooth 15-point rolling mean](../../assets/images/ursa-portal/jupyter-plot.png)

Use `len(os.sched_getaffinity(0))` rather than `os.cpu_count()` when you size a worker pool: the second counts every core on the node, not the ones Slurm gave you.

```python
from concurrent.futures import ProcessPoolExecutor
n = len(os.sched_getaffinity(0))
with ProcessPoolExecutor(max_workers=n) as pool:
    results = list(pool.map(my_function, my_inputs))
```

## Using the GPU

Choose **python-ml** and partition **gpul4** (or **gpu1v1** if your lab uses the V100s). Then check the GPU from a notebook:

```python
import torch
print(torch.cuda.is_available())          # True
print(torch.cuda.get_device_name(0))      # NVIDIA L4 (or Tesla V100-SXM2-16GB)
x = torch.randn(8192, 8192, device="cuda")
print((x @ x).sum().item())
```

In a JupyterLab terminal, `nvidia-smi` shows the GPU's memory and use. The L4 has 24 GB and the V100 16 GB; if you run out of GPU memory, reduce the batch size or restart the kernel to free memory held by old tensors.

## Your own packages and kernels

The environments are read-only, so `pip install` into them fails. Pick the approach that fits:

**A quick extra package for yourself.** In a notebook cell:

```python
%pip install --user tabulate
```

Then **Kernel > Restart Kernel**. It installs into `~/.local`, which every python-sci session sees. Keep this to a few small packages; `--user` installs can clash with the environment's own versions.

**A project environment with its own kernel (recommended).** In a JupyterLab terminal, make a virtual environment that builds on python-sci, so numpy, pandas and the rest come along and you add only what is missing:

```bash
module load python-sci/2026.10
python -m venv --system-site-packages ~/envs/myproject
source ~/envs/myproject/bin/activate
pip install tabulate some-other-package
python -m ipykernel install --user --name myproject --display-name "Python (myproject)"
deactivate
```

Reload the JupyterLab page. **Python (myproject)** now appears in the Launcher and under **Kernel > Change Kernel**. To remove it later:

```bash
jupyter kernelspec remove myproject
rm -rf ~/envs/myproject
```

**Conda or pixi environments** work the same way: create the environment, install `ipykernel` into it, and run `python -m ipykernel install --user --name ...` from inside it. Put large environments in `/scratch/NETID_ucr_edu` rather than home.

**Your own PyTorch on the V100 (gpu1v1).** The cluster's **python-ml** runs on the V100 as it is. If you install PyTorch yourself, use the CUDA 12.6 builds:

```bash
pip install torch --index-url https://download.pytorch.org/whl/cu126
```

The newer CUDA 12.8 and 13.0 builds no longer include the V100, and fail on it with `no kernel image is available for execution on the device`. On gpul4 (L4) any current build works.

**Something else entirely** (R, Julia, a container): ask Research Computing; several are installed as modules (`module spider r`), and Apptainer runs containers (`module load apptainer`).

## Running longer work

A notebook stops when the session's hours run out, and the browser tab has to stay connected for output to appear. For anything that runs more than a few hours:

1. Move the working code into a `.py` file (**File > Save and Export Notebook As > Executable Script**, then tidy it).
2. Submit it as a batch job with the same environment:

```bash
#!/bin/bash
#SBATCH --job-name=analysis
#SBATCH --partition=standard
#SBATCH --cpus-per-task=8
#SBATCH --time=12:00:00
#SBATCH --output=results/%x-%j.out
module load python-sci/2026.10
python analysis.py
```

Or run the notebook itself unattended: `jupyter nbconvert --to notebook --execute --inplace analysis.ipynb` inside the batch script. See [Files and jobs](../ursa-portal-files-and-jobs/) for submitting and watching jobs.

## Stop the session

When you are done, save your notebooks, then go back to **My Interactive Sessions** in the portal and click **Delete** on the session's card. That ends the Slurm job and frees the node.

Closing the JupyterLab tab does **not** stop the session: it keeps running, and counting against your lab's allocation, until its hours run out. Coming back is easy, though: click **Connect to Jupyter** on the card again and your notebooks and kernels are as you left them.

## If something goes wrong

| What you see | What to do |
| --- | --- |
| The card stays **Queued** for a long time | Normal for up to a few minutes, longer on the GPU partitions. If it is over 15 minutes, see [Troubleshooting](../ursa-portal-troubleshooting/). |
| The card goes straight to **Completed** | The session failed to start. Click the **Session ID** link on the card and open `output.log`; the reason is near the end. |
| "Kernel error" or the kernel keeps restarting | Often a `--user` package clashing with the environment. Try `pip uninstall --user PACKAGE`, or move it into a venv as above. |
| Notebook runs out of memory (kernel dies) | Ask for **highmem**, or more cores on standard (memory is shared out with cores), or load data in chunks. |

More fixes are in [Troubleshooting](../ursa-portal-troubleshooting/).

## Get help

Email [research-computing@ucr.edu](mailto:research-computing@ucr.edu) with your NetID, the session ID from the card and the end of its `output.log`. Next in the series: [Remote Linux desktop](../ursa-portal-desktop/).

Upstream documentation: [JupyterLab user guide](https://jupyterlab.readthedocs.io/en/stable/user/interface.html), [IPython kernels for virtual environments](https://ipython.readthedocs.io/en/stable/install/kernel_install.html), [Open OnDemand interactive apps](https://osc.github.io/ood-documentation/latest/applications/interactive-apps.html), [PyTorch CUDA semantics](https://pytorch.org/docs/stable/notes/cuda.html).
