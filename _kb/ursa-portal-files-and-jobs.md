---
title: "Research Computing cluster portal: files and jobs"
topic: Cloud
description: "Use the cluster web portal's file browser, editor, Active Jobs page, Job Composer and module browser: upload and download data, edit a batch script, submit it, watch it run and find software. Part 2 of the portal guide series."
audience: "Members of labs that Research Computing has set up on its HPC cluster in Google Cloud"
reviewed: 2026-11-01
owner: Research Computing
unlisted: true
sitemap: false
series: ursa-portal
series_order: 2
review_notes:
  - "Unlisted on purpose (2026-10-29): see the first article in this series for the audience and mechanism."
  - "File browser, editor, row menus, Active Jobs, Job Composer and module browser were used on 2026-10-29 against the live portal (Open OnDemand 4.2.5); screenshots are from that session with the user name replaced by netid. The example batch script was submitted and ran on the standard partition that day."
  - "CHECK: the size limit for browser uploads is set by the portal's web server and was not measured; the page recommends scp/rsync or Globus-style tools for large data instead of naming a limit."
  - "2026-11-01: /apps/examples now has 13 templates incl. 13-gpu-v100; array examples need logs/ created first (Slurm does not create output folders; examples 05 and 09 say so, tested as jobs 1622)."
---

This is part 2 of the portal series. If you have not connected yet, start with [Getting connected](../ursa-portal-getting-started/).

The portal's file and job tools are the quickest way to move a few files, fix a script, submit it and watch it run without opening a terminal. The examples here use a small folder called `kb-demo` in your home directory; make your own with **New Directory** to follow along.

## Your storage, briefly

| Path | Use it for | Backed up |
| --- | --- | --- |
| `/home/NETID_ucr_edu` | code, scripts, notebooks, results you keep | no; keep your own copy of anything you can't recreate |
| `/scratch/NETID_ucr_edu` | big working data | no |
| `/data/shared` | public reference databases (read-only) | re-downloadable |

Home and scratch are shared file systems: the portal, the login node and every compute node see the same files. The file browser opens in your home directory; type `/scratch/NETID_ucr_edu` into **Change directory** to work in scratch.

## The file browser

Open **Files > Home Directory**.

![The file browser showing the kb-demo folder with data and results folders, hello.sbatch and README.md, and the toolbar of Open in Terminal, Refresh, New File, New Directory, Upload, Download, Copy/Move and Delete](../../assets/images/ursa-portal/files-browser.png)

The toolbar, left to right:

| Button | What it does |
| --- | --- |
| **Open in Terminal** | Opens a shell in this folder. Not working yet on this cluster; see [Troubleshooting](../ursa-portal-troubleshooting/#the-shell-gives-permission-denied). |
| **Refresh** | Re-reads the folder (use it after a job writes new files). |
| **New File** / **New Directory** | Create an empty file or a folder here. |
| **Upload** | Pick files, or drag them from your computer onto the page. |
| **Download** | Download the selected files. Selecting a folder downloads it as a zip. |
| **Copy/Move** | Puts the selection on a clipboard; go to the destination folder and choose Copy or Move there. |
| **Delete** | Deletes the selection, after you confirm. There is no undo and no trash. |

Under the toolbar:

* The **path bar** (`/ home / netid_ucr_edu / kb-demo /`) is clickable at every level. **Change directory** lets you type any path; **Copy path** puts the current path on your clipboard for use in a script.
* **Show Owner/Mode** adds permission columns; **Show Dotfiles** shows hidden files such as `.bashrc`.
* **Filter** narrows the list as you type.
* Tick the boxes on the left to select several files for Download, Copy/Move or Delete.

### Row menus: view, edit, rename, download, delete

Each row has a **three-dot** button with actions for that one file:

![The three-dot menu open on hello.sbatch, offering View, Edit, Rename, Download and Delete](../../assets/images/ursa-portal/files-row-menu.png)

**View** shows a text file or image in the browser, **Edit** opens the editor (below), and **Rename**, **Download** and **Delete** do what they say.

### Uploading and downloading

* **A few files, or tens of MB:** use **Upload** and **Download** in the browser.
* **Large data (many GB, or thousands of files):** use `scp` or `rsync` over the same tunnel from your own computer. These resume and check what they copy:

```bash
# Copy a folder from your computer to scratch on the cluster
gcloud compute scp --recurse ./my_dataset \
  ucrslurmcl-slurm-login-001:/scratch/NETID_ucr_edu/ \
  --zone us-central1-a --project PROJECT_ID --tunnel-through-iap

# Copy results back
gcloud compute scp --recurse \
  ucrslurmcl-slurm-login-001:~/kb-demo/results ./results \
  --zone us-central1-a --project PROJECT_ID --tunnel-through-iap
```

`PROJECT_ID` is in your welcome email from Research Computing. If you would rather use plain `ssh`, `scp`, `rsync` or VS Code Remote, ask Research Computing for a short SSH config block that does the tunnelling for you.

## The editor

Choose **Edit** on a text file. The editor opens in a new tab:

![The portal editor showing hello.sbatch with shell syntax highlighting, and the Save button, key bindings, font size, mode, theme, wrap and soft tabs settings on the left](../../assets/images/ursa-portal/file-editor.png)

* **Save** writes the file (or press Ctrl+S, Cmd+S on a Mac).
* **Mode** sets syntax highlighting. It guesses from the file name; for `.sbatch` files pick **SH**.
* **Key Bindings** offers Vim and Emacs keys if you prefer them.
* **Wrap** wraps long lines; **Soft Tabs** inserts spaces when you press Tab.

The editor is for scripts and small text files. Open large data files with code, not the browser.

## Worked example: edit, submit, watch

Here is the example batch script from the screenshots. Create `hello.sbatch` with **New File**, then **Edit** it:

```bash
#!/bin/bash
#SBATCH --job-name=hello-ursa
#SBATCH --partition=standard
#SBATCH --cpus-per-task=2
#SBATCH --time=00:10:00
#SBATCH --output=results/%x-%j.out
module load python-sci
python -c "import numpy, socket; print(socket.gethostname(), numpy.__version__)"
```

What each line does:

| Line | Meaning |
| --- | --- |
| `--job-name` | The name you see in job lists. |
| `--partition=standard` | Where it runs. `standard` is the default and right for almost all CPU work. |
| `--cpus-per-task=2` | Two cores. On shared partitions a job with no core request gets **one** core. |
| `--time=00:10:00` | Ten minutes. Always set a time; without one a job gets 24 hours. |
| `--output=results/%x-%j.out` | Output file: `%x` is the job name, `%j` the job number. Make the `results` folder first. |
| `module load python-sci` | Loads the cluster's scientific Python (numpy, scipy, pandas, matplotlib and more). |

Submit it with **Job Composer** (below) or over SSH:

```bash
cd ~/kb-demo
sbatch hello.sbatch          # prints: Submitted batch job 1609
squeue --me                  # your queued and running jobs
```

When it finishes, **Refresh** the `results` folder and **View** `hello-ursa-1609.out`. It contains the compute node's name and the numpy version. For a finished job, `seff 1609` over SSH shows how much of the requested time and cores it used.

More templates (OpenMP, MPI, GPU, job arrays, GROMACS, containers, BLAST, Spot, and a V100 example for the Chang lab) are in `/apps/examples` on the cluster: browse there with **Change directory**, select one and **Copy/Move** it into your own folder. The job-array examples write their logs to a `logs` folder, which Slurm does not create: make it first (**New Directory** in the file browser, or `mkdir -p logs`), or the jobs fail without writing any output.

## Active Jobs: see and cancel your jobs

**Jobs > Active Jobs** lists jobs that are queued or running.

![The Active Jobs page with Your Jobs and All Clusters filters, an entries-per-page selector, a filter box, and a table of ID, Name, User, Account, Time Used, Queue, Status, Cluster and Actions](../../assets/images/ursa-portal/active-jobs.png)

* **Your Jobs / All Jobs** switches between your jobs and everyone's (other people's jobs show only basic details).
* The **+** in the Details column expands a job: node, requested cores and time, working directory, and a button to open the job's folder in the file browser.
* The red **trash** button in Actions cancels the job, after you confirm. It is the same as `scancel JOBID`.
* **Status** shows Queued, Running or Completing. A job that has just been submitted often waits about a minute and a half while its compute node starts; nodes power down when idle.

Finished jobs disappear from this page. Use `sacct -u $USER --starttime today` over SSH, or the job's output file, for finished work.

## Job Composer

**Jobs > Job Composer** builds batch jobs in the browser, which is handy if you do not use a terminal.

![The Job Composer page with an empty jobs table and the getting-started tip: create a job from a template, edit its files, submit and monitor](../../assets/images/ursa-portal/job-composer.png)

The usual loop:

1. **New Job > From Default Template** (or **From Specified Path** to copy a folder you already have, such as `kb-demo`). It makes a job folder under `~/ondemand/data/sys/myjobs/projects/`.
2. Click **Open Editor** under the script name to edit the batch script, or **Open Dir** to add input files.
3. **Submit**. The status updates as the job runs.
4. **Stop** cancels it; the folder stays so you can edit and resubmit.

Job Composer writes ordinary Slurm scripts in ordinary folders, so you can switch to SSH and `sbatch` at any time.

## Module browser: find software

**Clusters > Module Browser** searches the more than 500 software modules installed on the cluster, refreshed every night.

![The module browser with a search box and cluster filter, showing the first of 516 modules alphabetically](../../assets/images/ursa-portal/module-browser.png)

Type part of a name, then click a result to see its versions, what it depends on, and the exact load command:

![The module browser filtered to python, with Python Sci expanded to show versions 2026.10 and 2026.09 on Ursa Major and the command module load python-sci](../../assets/images/ursa-portal/module-browser-python-sci.png)

Click a version to get its versioned load line (`module load python-sci/2026.10`); use that in scripts so a new default never surprises you. Then use it in a batch script, a Desktop terminal or a notebook.

The same information from a terminal:

```bash
module avail                 # what can be loaded now
module spider gromacs        # find anything, including builds that need an MPI loaded first
module spider gromacs/2025.3 # what that version needs
ursa-software                # a summary of the software stack
```

Some packages built with MPI appear only after you load an MPI (`module load openmpi`, then `module avail`). `module spider` finds them either way.

## Tips

* **Copy path** in the file browser, then paste it into a script, saves typing long paths.
* After a job finishes, **Refresh** the folder; the browser does not watch for new files.
* Deleting in the browser is permanent. Download anything you might want back first.

## Get help

Email [research-computing@ucr.edu](mailto:research-computing@ucr.edu) with your NetID, the job number and the exact message. Next in the series: [Jupyter notebooks](../ursa-portal-jupyter/).

Upstream documentation: [Open OnDemand files app](https://osc.github.io/ood-documentation/latest/applications/file-editor.html), [Open OnDemand job composer](https://osc.github.io/ood-documentation/latest/applications/job-composer.html), [Slurm sbatch](https://slurm.schedmd.com/sbatch.html), [Lmod user guide](https://lmod.readthedocs.io/en/latest/010_user.html).
