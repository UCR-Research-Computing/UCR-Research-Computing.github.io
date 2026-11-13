---
title: "Research Computing cluster portal: troubleshooting"
topic: Cloud
description: "Fixes for the problems people hit with the Research Computing HPC cluster's web portal: the tunnel, sign-in, certificate warnings, sessions that stay queued or end at once, Jupyter kernels, desktop display, GPU graphics and the shell. Part 6 of the portal guide series."
audience: "Members of labs that Research Computing has set up on its HPC cluster in Google Cloud"
reviewed: 2026-11-01
owner: Research Computing
unlisted: true
sitemap: false
series: ursa-portal
series_order: 6
review_notes:
  - "Unlisted on purpose (2026-10-29): see the first article in this series for the audience and mechanism."
  - "Built from what was hit while testing the series on 2026-10-29 (Jupyter kernel cross-origin block, since fixed; vglrun needing -d egl; Shell Access permission denied; gpul4 start time; JupyterLab not drawing in a background browser tab) plus the portal's standard failure modes."
  - "Remove the Shell Access section when the portal shell is fixed."
  - "2026-11-01: account/partition error now names the lab-only partitions (amd112, amd56 Mueller; gpu1v1 Chang, Slurm AllowAccounts) and points at ursa-status, which lists the user's accounts and permitted partitions (checked live)."
---

This is part 6 of the portal series. Start with [Getting connected](../ursa-portal-getting-started/) if you have not used the portal before.

Find your symptom below. If none fits, email [research-computing@ucr.edu](mailto:research-computing@ucr.edu) with your NetID, what you clicked, the exact message (a screenshot helps) and, for a session, the **Session ID** from its card.

## The tunnel

**`ERROR: (gcloud...) There was a problem refreshing your current auth tokens` or `Reauthentication required`.** Your Google sign-in expired. Run `gcloud auth login`, choose your `NETID@ucr.edu` account, and start the tunnel again.

**`Error while connecting [4033: 'not authorized']` or `[4003: 'failed to connect to backend']`.**
* 4033: your account doesn't have tunnel access yet, or gcloud is using a different account. Run `gcloud auth list`; the `*` must be on your UCR address (`gcloud config set account NETID@ucr.edu` to switch). If it is, email us.
* 4003: the portal machine is not answering. Wait a minute and retry; if it persists, email us.

**`Address already in use` / `port 8443 is in use`.** Another tunnel is already running, perhaps in another window or left over from earlier. Close it, or find and stop it:

```bash
lsof -i :8443          # macOS and Linux: shows the process using the port
ursa-ood stop          # if you started it with the helper
```

On Windows, `netstat -ano | findstr 8443` shows the process ID; end it in Task Manager.

**The tunnel stops after a while.** Your computer slept or the network changed. Start it again; your sessions and jobs are unaffected.

## Signing in

**"Your connection is not private" / certificate warning.** Expected; see [Getting connected, step 3](../ursa-portal-getting-started/#step-3-open-the-portal-and-sign-in). Your browser may ask again after an update.

**Google says `redirect_uri_mismatch`, or sign-in loops back to Google.** You are not using `https://localhost:8443/`. Use port 8443 exactly, with `localhost` (not `127.0.0.1`).

**"Access denied", "user not found", or a page about a missing account after Google sign-in.** You signed in with an account that has no cluster account: usually a personal Gmail. Log out of Google in that browser, or use a private window, and sign in as `NETID@ucr.edu`. If you did use your UCR account, email us; your cluster account may not be set up yet.

**The portal looks broken or out of date** (menus missing, an app not listed, endless spinner). Use **? > Restart Web Server** at the top right. It restarts your own copy of the portal (not the cluster) in a few seconds and fixes most odd behaviour. Your files, jobs and sessions are not affected.

## Sessions (Desktop and Jupyter)

**The card stays "Queued".**
* Normal: about a minute and a half on standard; several minutes on **gpul4** and **gpu1v1** (GPU nodes start from scratch and depend on Google having GPU capacity).
* Over 15 minutes: check what Slurm says. Over SSH or from a desktop terminal, `squeue --me` shows the reason in the last column. `(Resources)` or `(Priority)` means waiting its turn; `(ReqNodeNotAvail)` or a launch failure means the cloud couldn't provide a node right now, which happens for GPUs. Delete the session and try again later, or use standard if you don't need the GPU.
* An AI assistant connected to the cluster can explain it too: "why is job 1234 pending?" (see [Use it from an AI assistant](../ursa-portal-ai-assistant/)).

**The card goes straight to "Completed", or says the session failed.** Something stopped the session starting. Click the **Session ID** link on the card; the file browser opens the session folder. Open `output.log` and read the last lines. Common causes:
* Asking for more cores than the partition has (16 on standard, 8 on gpul4, 4 on gpu1v1, 32 on highmem).
* A broken shell start-up file: something in `~/.bashrc` that prints text, waits for input, or starts conda's base environment. Comment it out and relaunch.
* A full home directory. Check with `ursa-status` or `du -sh ~/* | sort -h` and clear space.

**My session ended before I was done.** It reached its hours limit. Launch with more hours next time (up to 24), and save often. For longer work, use a batch job.

**I closed the tab. Is my session gone?** No. Go to **My Interactive Sessions** and click **Connect to Jupyter** or **Launch Desktop** again. Sessions run until their hours are up or you **Delete** them.

## Jupyter

**A notebook opens but the kernel never starts, or saving fails with a 403 or "forbidden".** Restart the session (Delete it and launch a new one). Sessions started before 29 October 2026 had a setting that blocked this; new sessions are fixed. If it still happens, email us with the Session ID.

**JupyterLab is blank, grey, or stops updating.** Some browsers pause pages in background tabs. Click into the JupyterLab tab and wait a few seconds, or reload it; your notebooks and kernels survive a reload.

**`ModuleNotFoundError` for a package.** The package isn't in the environment you chose. Check the table in [Jupyter notebooks](../ursa-portal-jupyter/#the-python-environments) (for example, PyTorch is in **python-ml**, gravitational-wave tools in **python-gw**), or add it yourself with a virtual environment and kernel ([how](../ursa-portal-jupyter/#your-own-packages-and-kernels)).

**`pip install` fails with "Read-only file system" or a permission error.** The cluster environments are read-only. Use `%pip install --user PACKAGE` or a venv ([how](../ursa-portal-jupyter/#your-own-packages-and-kernels)).

**The kernel dies or restarts during a big calculation.** Usually out of memory. Memory comes with cores (about 7.9 GB per core on standard), so ask for more cores, use **highmem**, or process data in pieces.

**`torch.cuda.is_available()` is False.** You are not on a GPU partition (**gpul4** or **gpu1v1**), or not using **python-ml**. Launch a new session with both.

## Desktop

**Black or grey screen.** Wait ten seconds and reload the tab. If it stays, close the tab and click **Launch Desktop** on the card again.

**Slow, laggy or blurry.** Raise **compression** and lower **image quality** on the card, then relaunch the desktop tab. Close programs that redraw constantly (animated plots) when you don't need them.

**Text is tiny or the desktop doesn't fit.** Open the noVNC side panel (tab at the left edge) **> Settings > Scaling mode** and pick **Local scaling**, or launch a new session at a resolution closer to your screen.

**Copy and paste doesn't work.** Use the clipboard box in the noVNC side panel; see [Remote Linux desktop](../ursa-portal-desktop/#copy-and-paste).

**A 3D program is slow, or fails with an OpenGL or GLX error.** On a **gpul4** or **gpu1v1** desktop, start it with `vglrun -d egl program`. Plain `vglrun` (without `-d egl`) fails on these nodes with an error about opening a display. On standard and highmem there is no GPU; launch a gpul4 desktop.

## Files and jobs

**An upload fails or stalls.** Browser uploads are for small files. For large data, use `gcloud compute scp` or `rsync` ([how](../ursa-portal-files-and-jobs/#uploading-and-downloading)).

**A new file from a job doesn't appear.** Click **Refresh** in the file browser.

**My job isn't in Active Jobs.** It has finished; Active Jobs shows only queued and running jobs. Look for its output file, or run `sacct -u $USER --starttime today` over SSH.

**`sbatch: error: Batch job submission failed: Invalid account or account/partition combination`.** Your Slurm account can't use that partition. Some partitions belong to one lab: **amd112** and **amd56** to the Mueller lab, **gpu1v1** to the Chang lab. On the login node, `ursa-status` lists your accounts and the partitions you may use. If one is missing that you should have, email us with the job script.

**My job got only one core.** On shared partitions a job gets one core unless it asks: add `#SBATCH --cpus-per-task=N`.

## The shell gives "Permission denied"

**Clusters > Shell Access** and the file browser's **Open in Terminal** button currently fail with `Permission denied (publickey,...)`. This is a known problem with the portal's built-in shell. Until it is fixed, use one of these, which all give you the same files, modules and Slurm:

* A **terminal in JupyterLab** (Launcher > Terminal), on a compute node. Quickest.
* A **terminal on a Desktop** (Applications > Terminal Emulator), on a compute node.
* **SSH** to the login node from your own computer:

```bash
gcloud compute ssh ucrslurmcl-slurm-login-001 --zone us-central1-a \
  --project PROJECT_ID --tunnel-through-iap
```

`PROJECT_ID` is in your welcome email from Research Computing.

## AI assistant

**Sign-in fails with an access or "not allowed" message.** You are not on the server's sign-in list yet, or you signed in with a non-UCR Google account. Email us.

**A submit or cancel plan "expired" or "not found".** Plans last 10 minutes and work once. Ask the assistant to make a new plan.

**The plan was refused over a cap.** Your per-person limits block that job size. Make it smaller, or email us if real work needs more.

## Still stuck

Email [research-computing@ucr.edu](mailto:research-computing@ucr.edu). Include your NetID, what you were doing, the exact message, and the Session ID or job number. Back to the series: [Getting connected](../ursa-portal-getting-started/), [Files and jobs](../ursa-portal-files-and-jobs/), [Jupyter](../ursa-portal-jupyter/), [Desktop](../ursa-portal-desktop/), [AI assistant](../ursa-portal-ai-assistant/), [Cloud TPUs](../ursa-portal-tpus/).

Upstream documentation: [Open OnDemand troubleshooting for users](https://osc.github.io/ood-documentation/latest/user-guide/troubleshooting.html), [Slurm job reason codes](https://slurm.schedmd.com/job_reason_codes.html), [Google Cloud IAP troubleshooting](https://cloud.google.com/iap/docs/troubleshooting-tcp-forwarding).
