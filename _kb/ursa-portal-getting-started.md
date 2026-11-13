---
title: "Research Computing cluster portal: getting connected"
topic: Cloud
description: "Reach the web portal of the Research Computing HPC cluster in Google Cloud from your own computer: install the Google Cloud CLI, open the secure tunnel, sign in with your UCR account, and find your way around. Part 1 of the portal guide series."
audience: "Members of labs that Research Computing has set up on its HPC cluster in Google Cloud"
reviewed: 2026-11-01
owner: Research Computing
unlisted: true
sitemap: false
series: ursa-portal
series_order: 1
review_notes:
  - "Unlisted on purpose (2026-10-29): Chuck reversed the 2026-10-19 scope rule for this series. The portal guides are shared by link with labs that Research Computing has moved onto the cluster (first the Mueller and Chang labs), and are kept out of the KB index, related guides, site search and the sitemap, with noindex. Give the series KB numbers and list it if the cluster opens more widely."
  - "Every step was run on 2026-10-29 against the live portal (Open OnDemand 4.2.5) from macOS in a UCR account: tunnel on local port 8443, Google sign-in, dashboard, menus. Screenshots are from that session; the user name in them is replaced with the placeholder netid."
  - "The portal's 'Shell Access' menu item returned 'Permission denied (publickey, ...)' on 2026-10-29; this page tells readers to use SSH or a Desktop terminal instead. Remove that note when it is fixed."
  - "CHECK: the Windows steps (same gcloud commands in PowerShell or the Google Cloud SDK Shell) were not run on Windows. The ursa-ood helper is a bash script for macOS and Linux."
  - "2026-11-01: ursa-status line updated; it now prints the user's Slurm accounts and permitted partitions (checked live on the login node)."
---

Research Computing runs an HPC cluster in Google Cloud for labs it has set up on it. Besides the usual SSH login, the cluster has a **web portal** built on [Open OnDemand](https://openondemand.org/), the same portal software many university HPC centers use. From a web browser you can:

* browse, upload, download and edit your files;
* watch and cancel your Slurm jobs;
* look up installed software;
* start a **full Linux desktop** on a compute node, with an NVIDIA GPU if you want one;
* start **JupyterLab** on a compute node with the cluster's Python environments.

Everything interactive runs as an ordinary Slurm job on a compute node, never on a shared login machine, and counts against your lab's allocation like any other job.

This page gets you connected. The rest of the series:

| Part | Guide | What it covers |
| --- | --- | --- |
| 1 | **Getting connected** (this page) | The tunnel, sign-in, the dashboard |
| 2 | [Files and jobs in the portal](../ursa-portal-files-and-jobs/) | File browser, editor, upload and download, Active Jobs, Job Composer, module browser |
| 3 | [Jupyter notebooks](../ursa-portal-jupyter/) | Starting JupyterLab, Python environments, GPUs, your own packages and kernels |
| 4 | [Remote Linux desktop](../ursa-portal-desktop/) | A desktop on a compute node, GPU visualization, copy and paste, display settings |
| 5 | [Use it from an AI assistant](../ursa-portal-ai-assistant/) | Let Claude, Codex, Gemini and others check jobs, explain failures and submit work for you |
| 6 | [Troubleshooting](../ursa-portal-troubleshooting/) | Fixes for the problems people actually hit |
| 7 | [Cloud TPUs: running and porting workloads](../ursa-portal-tpus/) | TPU v5e and v6e Trillium partitions, preinstalled TPU modules, batch scripts, and AI-agent porting |

## Before you start

Research Computing sets up three things for you. You can't do these yourself, and if any is missing the portal refuses you at sign-in:

1. **Cloud access** for your UCR Google account (`NETID@ucr.edu`): permission to log in to the cluster's machines and to reach them through Google's secure tunnel.
2. **A cluster account.** Your Linux user name is your NetID with `_ucr_edu` added: `jsmith@ucr.edu` becomes `jsmith_ucr_edu`. There is no cluster password; you sign in with your UCR Google account.
3. **A Slurm account** for your lab (named after your PI's NetID), set as your default. Jobs from someone with no Slurm account are refused.

If you received a "moving to the shared cluster" email from Research Computing, all three are already done.

You also need, on your own computer:

* a current web browser (Chrome, Edge, Firefox or Safari);
* the **Google Cloud CLI** (`gcloud`), used only to open the tunnel.

## Step 1: install the Google Cloud CLI (once)

Follow Google's [install guide](https://cloud.google.com/sdk/docs/install) for your system. On a Mac with [Homebrew](https://brew.sh/):

```bash
brew install --cask google-cloud-sdk
```

On Windows, run Google's installer and use the **Google Cloud SDK Shell** it adds, or PowerShell, for the commands below.

Then sign in once with your UCR account:

```bash
gcloud auth login
```

A browser window opens. Choose your `NETID@ucr.edu` account and allow access. Check it worked:

```bash
gcloud auth list
```

Your UCR address should be marked with `*` (active). UCR sign-ins expire after some hours; when a command later says your credentials have expired, run `gcloud auth login` again.

## Step 2: open the tunnel

The portal has no public internet address. Your browser reaches it through **Google's Identity-Aware Proxy (IAP) tunnel**, which forwards a port on your own computer to the portal over an encrypted, Google-authenticated connection. Only people Research Computing has given access can open it.

Run this and **leave the window open** while you use the portal:

```bash
gcloud compute start-iap-tunnel ucrslurmcl-ood-001 443 \
  --local-host-port=localhost:8443 \
  --zone us-central1-a --project PROJECT_ID
```

`PROJECT_ID` is the cluster's Google Cloud project ID. Research Computing sends it in your welcome email (it is the `--project` value in the login command there); the site does not publish project IDs.

On Windows (PowerShell), put it on one line, or replace each `\` with a backtick.

When it is ready you see:

```text
Testing if tunnel connection works.
Listening on port [8443].
```

A warning suggesting you install NumPy "to increase the performance of the tunnel" is harmless; you can ignore it.

**Use port 8443 exactly.** Google sign-in sends you back to `https://localhost:8443/`, so the tunnel works on any port but sign-in fails on every other one.

### Optional: the ursa-ood helper (macOS and Linux)

Research Computing has a small script that starts the tunnel in the background, checks the portal answers, and opens your browser. Ask for it, put it on your `PATH` (for example `~/.local/bin/ursa-ood`), make it executable, then:

```bash
ursa-ood start      # open the tunnel in the background and open the portal
ursa-ood status     # is it up, and does the portal answer?
ursa-ood stop       # close the tunnel
ursa-ood logs       # show the tunnel log if something is wrong
```

## Step 3: open the portal and sign in

1. Browse to **[https://localhost:8443/](https://localhost:8443/)**.
2. Your browser warns that the connection is not private or the certificate is not trusted. **That is expected here.** The certificate is a local one for `localhost`; your traffic is already encrypted end to end inside Google's tunnel. Choose **Advanced**, then **Proceed to localhost** (Chrome, Edge), **Accept the Risk and Continue** (Firefox), or **Show Details, visit this website** (Safari).
3. Google's sign-in page appears. Sign in with your **`NETID@ucr.edu`** account. Personal Gmail accounts are refused, and so is a UCR account without a cluster account.
4. The portal dashboard opens.

![The portal dashboard after sign-in, with Files, Jobs, Clusters and Interactive Apps menus across the top and Recently Used Apps below](../../assets/images/ursa-portal/dashboard.png)

Bookmark `https://localhost:8443/`. Each time, you open the tunnel first (Step 2), then the bookmark.

## Find your way around

The four menus across the top hold almost everything:

| Menu | Item | What it does | Guide |
| --- | --- | --- | --- |
| **Files** | Home Directory | File browser: upload, download, edit, move, delete | [Part 2](../ursa-portal-files-and-jobs/) |
| **Jobs** | Active Jobs | Your queued and running Slurm jobs, with details and a cancel button | [Part 2](../ursa-portal-files-and-jobs/#active-jobs-see-and-cancel-your-jobs) |
| | Job Composer | Build and submit batch jobs from templates in the browser | [Part 2](../ursa-portal-files-and-jobs/#job-composer) |
| | Project Manager | Group related jobs into projects (optional) | |
| **Clusters** | Module Browser | Search every installed software package and get its `module load` line | [Part 2](../ursa-portal-files-and-jobs/#module-browser-find-software) |
| | Shell Access | Not working yet; use SSH or a Desktop terminal | [Part 6](../ursa-portal-troubleshooting/) |
| | System Status | How many nodes and cores the cluster can start | |
| **Interactive Apps** | Desktop | A Linux desktop on a compute node | [Part 4](../ursa-portal-desktop/) |
| | Jupyter | JupyterLab on a compute node | [Part 3](../ursa-portal-jupyter/) |

![The Interactive Apps menu open, listing Desktop under Desktops and Jupyter under Servers](../../assets/images/ursa-portal/menu-interactive-apps.png)

Two icons next to the menus are shortcuts: **My Interactive Sessions** (the stacked-windows icon) lists the desktops and notebooks you have started, and **All Apps** (the grid icon) lists every portal app. The **?** menu has a **Restart Web Server** item, which fixes most "the portal is acting strangely" problems (see [Troubleshooting](../ursa-portal-troubleshooting/)).

## How the portal relates to SSH

The portal and SSH reach the same cluster, the same files and the same Slurm. Use whichever suits the task, or both at once:

```bash
# SSH to the login node, through the same kind of tunnel
gcloud compute ssh ucrslurmcl-slurm-login-001 --zone us-central1-a \
  --project PROJECT_ID --tunnel-through-iap
```

The first time, gcloud creates an SSH key for you and may ask for a passphrase. A file you upload in the portal is immediately visible over SSH, and a job you submit with `sbatch` over SSH shows up under **Jobs > Active Jobs**.

On the login node, `ursa-status` shows the partitions, your Slurm accounts and which partitions they let you use, your jobs and your storage, and `/apps/docs/QUICKSTART.md` is the cluster's own quick reference.

## Finishing up

* **Interactive sessions keep running when you close the browser tab.** A desktop or notebook is a Slurm job that runs, and counts against your allocation, until its hours run out or you **Delete** it under **My Interactive Sessions**. Delete sessions you are done with.
* **Close the tunnel** with Ctrl+C in its window (or `ursa-ood stop`). Closing the tunnel does not stop your sessions or jobs either; reopen it later and they are still there.
* **Log out** with the arrow icon at the top right if you are on a shared computer.

## Rules that apply

* **Data:** the cluster is for P1 and P2 data under the [UC data classification](https://security.ucop.edu/policies/institutional-information-and-it-resource-classification.html). Ask Research Computing first about anything at P3 or P4, or data covered by a contract or data use agreement.
* **Usage:** every job, including portal sessions, counts against your lab's allocation. On the login node, `ursa-status` shows where you stand.
* **No backups:** home and scratch are working space, not an archive. Keep a copy of anything you can't recreate.

## Get help

Email [research-computing@ucr.edu](mailto:research-computing@ucr.edu) with your NetID, what you clicked or ran, and the exact message you saw (a screenshot helps). Problems people often hit are in [Troubleshooting](../ursa-portal-troubleshooting/).

Upstream documentation: [Open OnDemand user documentation](https://osc.github.io/ood-documentation/latest/), [Google Cloud IAP TCP forwarding](https://cloud.google.com/iap/docs/using-tcp-forwarding), [gcloud compute start-iap-tunnel](https://cloud.google.com/sdk/gcloud/reference/compute/start-iap-tunnel).
