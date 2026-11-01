---
title: "Research Computing cluster portal: remote Linux desktop"
topic: Cloud
description: "Start a full Linux desktop on a compute node of the Research Computing HPC cluster from your web browser, with an NVIDIA GPU for 3D visualization if you need one: launch, connect, use the terminal and graphical programs, copy and paste, tune the display, and stop cleanly. Part 4 of the portal guide series."
audience: "Members of labs that Research Computing has set up on its HPC cluster in Google Cloud"
reviewed: 2026-10-29
owner: Research Computing
unlisted: true
sitemap: false
series: ursa-portal
series_order: 4
review_notes:
  - "Unlisted on purpose (2026-10-29): see the first article in this series for the audience and mechanism."
  - "Run end to end on 2026-10-29: standard-partition desktop (form, queued and running cards, XFCE in noVNC, Applications menu, terminal running whereami.sh), then a gpul4 desktop where nvidia-smi showed the NVIDIA L4 and 'vglrun -d egl glxinfo -B' reported the L4 as the OpenGL renderer. Screenshots are from those sessions with the user name replaced by netid."
  - "On 2026-10-29 plain 'vglrun' (no -d egl) failed on gpul4 because the node has no 3D X server; the page shows 'vglrun -d egl'. The app's own description was corrected the same day."
  - "The gpul4 node took about six minutes to start on 2026-10-29; standard took about a minute and a half."
  - "gpu1v1 (V100, Chang lab) added to the Desktop and Jupyter forms 2026-10-29 and tested the same day: a gpu1v1 desktop started in about six minutes; nvidia-smi showed Tesla V100-SXM2-16GB and 'vglrun -d egl glxinfo -B' reported the V100 as the OpenGL renderer."
---

This is part 4 of the portal series. If you have not connected yet, start with [Getting connected](../ursa-portal-getting-started/).

The portal's **Desktop** app starts a complete Linux desktop (XFCE) on a compute node and shows it in your browser tab. Nothing to install: any computer with a browser and the tunnel can use it, including a laptop on a hotel network. It is the easiest way to:

* run **graphical programs** on the cluster: molecular viewers (VMD), GaussView-style tools, R and Python plotting windows, image viewers, file managers;
* use a **GPU for 3D visualization** on a GPU node (gpul4, or gpu1v1 for labs with V100 access);
* have a **terminal on a compute node** for hours of interactive work, which keeps running if your laptop sleeps or your Wi-Fi drops.

The desktop is a Slurm job like any other. It has the cores (and GPU) you ask for, all to yourself, and counts against your lab's allocation while it runs.

## Start a desktop

1. Open **Interactive Apps > Desktop**.
2. Fill in the form:

![The Desktop launch form with partition standard, 4 cores, 1 hour, resolution 1920 by 1080, and the email-on-start checkbox](../../assets/images/ursa-portal/desktop-form.png)

| Field | What to choose |
| --- | --- |
| **Partition** | **standard** (16 cores, 124 GB) for most work; **gpul4** (8 cores and an NVIDIA L4 GPU) for 3D graphics or GPU computing; **gpu1v1** (4 cores and an NVIDIA V100 GPU), only for labs with access to it, such as the Chang lab; **highmem** (32 cores, 496 GB) for very large data. |
| **Cores** | 4 is plenty for viewing and light work. Memory comes with cores (about 7.9 GB per core on standard), so ask for more cores if a program needs more memory. |
| **Number of hours** | Up to 24. The desktop closes when the time is up, so save your work before then. |
| **Resolution** | The desktop's size in pixels. Pick something near your screen's size, such as `1920x1080`, or `1440x900` on a laptop. You can change how it is scaled after connecting. |
| **Email when the session starts** | Handy for the GPU partitions, which take longer to start. |

For a GPU desktop, choose **gpul4** and up to **8** cores (or **gpu1v1** and up to **4** cores if your lab uses the V100s):

![The Desktop form with partition gpul4 (8 cores plus NVIDIA L4 GPU) and 8 cores selected](../../assets/images/ursa-portal/desktop-form-gpu.png)

3. Click **Launch**. The session card appears under **My Interactive Sessions**:

![A queued Desktop session card while the compute node starts](../../assets/images/ursa-portal/desktop-queued.png)

**Queued** means the node is starting: about a minute and a half on standard, several minutes on gpul4 and gpu1v1 (about six in our tests; GPU nodes start from scratch and depend on Google having L4 capacity). When it is ready the card turns green:

![A running Desktop card showing the compute node host, time remaining, compression and image quality sliders, the Launch Desktop button and a view-only link](../../assets/images/ursa-portal/desktop-running.png)

4. Adjust the two sliders if you like (below), then click **Launch Desktop**. The desktop opens in a new tab.

### Compression and image quality

The sliders trade picture sharpness for speed:

* On a fast connection (campus, home fiber), set **compression low** (0-2) and **image quality high** (8-9) for crisp text.
* On a slow or distant connection (hotel, phone hotspot), set **compression high** (6-9) and **image quality lower** (3-5); it stays responsive.

They apply each time you click **Launch Desktop**, so close the desktop tab and relaunch from the card to try other settings. The session itself keeps running.

**View Only (Share-able Link)** gives a link that shows your desktop without control, for example to show a colleague who also has portal access what you are seeing. Anyone with the link and portal access can watch while it is open, so share it carefully.

## The desktop

![The XFCE desktop in the browser, with the Applications menu, a panel across the top, and a terminal open](../../assets/images/ursa-portal/desktop-xfce.png)

It works like a normal Linux desktop:

* **Applications** (top left) has a terminal, a file manager, a text editor, a web browser and system tools:

![The Applications menu open, listing Terminal Emulator, File Manager, Mail Reader, Web Browser, Settings, Accessories, Development, Graphics, Internet, Multimedia, Office and System](../../assets/images/ursa-portal/desktop-applications-menu.png)

* Your **home directory** and **scratch** are the same files as everywhere else on the cluster.
* Every software **module** is available from the terminal with `module load`.

### The terminal

Open **Applications > Terminal Emulator**. This is a shell on the compute node, inside your session's cores. Here it runs a small script that reports what the session has:

![A terminal on the desktop running whereami.sh: the node name ucrslurmcl-stdnodeset-0, the Slurm job and partition standard, 4 cores, the node's memory, and no GPU](../../assets/images/ursa-portal/desktop-terminal.png)

The script, if you want it (save it as `whereami.sh`, then `chmod +x whereami.sh`):

```bash
#!/bin/bash
# Show what this session has: node, Slurm job, cores, memory, GPU
echo "Node:       $(hostname)"
echo "Slurm job:  ${SLURM_JOB_ID:-none} on partition ${SLURM_JOB_PARTITION:-none}"
echo "Cores:      $(nproc)"
echo "Memory:     $(free -g | awk '/Mem:/{print $2}') GB on the node"
command -v nvidia-smi >/dev/null \
  && nvidia-smi --query-gpu=name,memory.total --format=csv,noheader \
  || echo "GPU:        none (pick a GPU partition: gpul4 or gpu1v1)"
```

`nproc` shows the cores Slurm gave you (4 here), not all the cores in the node. From this terminal you can also submit and watch batch jobs (`sbatch`, `squeue --me`), use `git`, and start any program.

### Graphical programs

Load the module and start the program from the terminal; its window opens on the desktop:

```bash
module load vmd
vmd structure.pdb &

module load r
R            # then plot() opens a graphics window

module load python-sci
python -c "import matplotlib.pyplot as plt; plt.plot([1,4,9]); plt.show()"
```

Search for anything else with **Clusters > Module Browser** in the portal or `module spider NAME` (see [Files and jobs](../ursa-portal-files-and-jobs/#module-browser-find-software)).

## GPU visualization (gpul4 and gpu1v1)

On a **gpul4** desktop the node has an NVIDIA L4 GPU; on **gpu1v1** it has an NVIDIA Tesla V100. Programs that draw 3D graphics with OpenGL (VMD, ParaView, PyMOL, ChimeraX and similar) use it when started through **VirtualGL** with `vglrun -d egl`:

```bash
module load vmd
vglrun -d egl vmd structure.pdb
```

Without `vglrun -d egl`, the program still runs but draws with the CPU (slowly, and some programs refuse). Plain `vglrun` without `-d egl` fails on these nodes with an error about opening a display, because there is no separate 3D X server; `-d egl` talks to the GPU directly.

To check that the GPU is in use, compare the OpenGL renderer with and without it:

```bash
nvidia-smi --query-gpu=name,memory.total --format=csv,noheader
#  NVIDIA L4, 23034 MiB

glxinfo -B | grep "OpenGL renderer"
#  OpenGL renderer string: llvmpipe (LLVM ...)      <- software, CPU

vglrun -d egl glxinfo -B | grep "OpenGL renderer"
#  OpenGL renderer string: NVIDIA L4/PCIe/SSE2      <- the GPU
#  (on gpu1v1: Tesla V100-SXM2-16GB/PCIe/SSE2)
```

The GPU is also there for computing: CUDA programs, PyTorch (`module load python-ml`) and GPU builds of simulation codes work from the desktop terminal without `vglrun`. For long GPU runs, a batch job is better than a desktop (see [Files and jobs](../ursa-portal-files-and-jobs/)).

## Copy and paste

Copy and paste between your computer and the desktop goes through the **clipboard panel** in noVNC, the browser viewer:

1. Click the small tab at the **left edge** of the desktop tab to open the noVNC side panel.
2. Click the **clipboard** icon. A text box appears.
3. **From your computer to the desktop:** paste into the box (Ctrl+V or Cmd+V), then paste inside the desktop with the terminal's **Edit > Paste** or Shift+Ctrl+V.
4. **From the desktop to your computer:** select text in the desktop; it appears in the box, and you copy it from there.

Text only; for files, use the portal file browser or `scp` (see [Files and jobs](../ursa-portal-files-and-jobs/#uploading-and-downloading)).

The same side panel has **Full screen** and **Settings**. In Settings, **Scaling mode: Local scaling** fits the desktop to your browser window; **Remote resizing** changes the desktop's resolution to match the window.

Keyboard shortcuts your own computer uses (such as Cmd+Tab on a Mac or Alt+Tab on Windows) go to your computer, not the desktop. In the terminal, copy and paste are Shift+Ctrl+C and Shift+Ctrl+V.

## Leaving and coming back

* **Close the browser tab** whenever you like. The desktop keeps running with your windows as you left them; click **Launch Desktop** on the card to get back. This is the desktop's big advantage over a plain SSH session: closing your laptop doesn't kill your work.
* **Log Out** from the desktop's menu ends the desktop session but the Slurm job may linger for a moment; deleting the card (next) is cleaner.
* **When you are done**, go to **My Interactive Sessions** in the portal and click **Delete** on the card. That ends the job and frees the node. Otherwise it keeps running, and counting against your allocation, until its hours are up.

![My Interactive Sessions listing a running desktop session card with its Delete button](../../assets/images/ursa-portal/sessions-list.png)

## If something goes wrong

| What you see | What to do |
| --- | --- |
| The card stays **Queued** for a long time | Normal for a few minutes, longer on gpul4 and gpu1v1. Over 15 minutes, see [Troubleshooting](../ursa-portal-troubleshooting/). |
| The card goes straight to **Completed** | The desktop failed to start. Click the card's **Session ID** link and open `output.log`. |
| Grey or black screen in the browser | Wait ten seconds, then reload the tab. If it persists, close the tab and click **Launch Desktop** again. |
| Very slow or blurry | Raise compression and lower quality on the card, then relaunch the desktop tab. |
| A 3D program is slow or says no OpenGL | On gpul4 or gpu1v1, start it with `vglrun -d egl`. On standard there is no GPU; use a GPU partition. |

More fixes are in [Troubleshooting](../ursa-portal-troubleshooting/).

## Get help

Email [research-computing@ucr.edu](mailto:research-computing@ucr.edu) with your NetID, the session ID from the card and the end of its `output.log`. Next in the series: [Use it from an AI assistant](../ursa-portal-ai-assistant/).

Upstream documentation: [Open OnDemand interactive desktops](https://osc.github.io/ood-documentation/latest/enable-desktops.html), [noVNC](https://novnc.com/info.html), [VirtualGL user guide](https://rawcdn.githack.com/VirtualGL/virtualgl/3.1/doc/index.html), [XFCE documentation](https://docs.xfce.org/).
