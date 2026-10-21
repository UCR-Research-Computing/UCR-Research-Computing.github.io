---
title: "Run Nautilus jobs from your AI assistant (nrp-mcp quick start)"
kb_id: KB031
topic: National
description: "Connect your laptop to NRP Nautilus, give your AI assistant the nrp tools, keep your job results in NRP S3, then move a Slurm job to Kubernetes by asking in plain language."
audience: "UCR researchers and students with a Nautilus namespace who want to run jobs by talking to an AI assistant instead of writing Kubernetes files"
reviewed: 2026-10-21
owner: Research Computing
review_notes:
  - "Web version of the printable handout made for an October 2026 hands-on workshop. The PDF (assets/documents/nrp-mcp-quick-start.pdf) is built from docs/handouts/nrp-mcp-quick-start.html with headless Chrome."
  - "2026-10-21: updated for nrp-mcp 1.0.0 (released 2026-10-21). Install now uses the project's own installers (install.sh asks before adding ~/.local/bin to PATH; install.ps1 installs to LOCALAPPDATA Programs nrp-mcp, checks SHA256SUMS, sets the user PATH). nrp-mcp client hermes replaces hermes mcp add. New: nrp-mcp s3 setup for saved results (a job plan is refused without it unless the person says yes, discard results), nrp-mcp doctor, and 6-character approval codes from nrp-mcp approve for GPU, public, delete, upload and setup steps. Commands checked against the 1.0.0 binary; the Slurm example was re-planned on 1.0.0 (10 tasks, rocker/r-ver:4.4.2, 1 h limit)."
  - "2026-10-21: added the nrp-mcp 1.1.0 guide (nrp_guide tool and walk_me_through prompt): a Not sure what to do next? paragraph after Step 5 and a row in What to say. Checked against the 1.1.0 code and its live test (scripts/e2eguide)."
  - "CHECK: install.ps1 is run on Windows Server 2025 in the nrp-mcp CI on every change but has not been run on a student Windows laptop."
  - "CHECK: the browser sign-in in nrp-mcp setup has been run on Linux only."
---

[nrp-mcp](https://github.com/UCR-Research-Computing/nrp-mcp) is a small open-source program (MIT license) from UCR Research Computing that runs on your own computer and gives an AI assistant a set of tools for the [NRP Nautilus](../kb023-nautilus-researcher-guide/) cluster. You describe what you want ("run this script on a GPU", "run it 50 times with different seeds") and the assistant plans the Kubernetes work, shows you the plan and the `kubectl` it equals, and runs it once you agree.

This page is the web version of the one-sheet handout from our hands-on workshop. It covers nrp-mcp 1.1.0.

**Printable version:** [nrp-mcp quick start (PDF, 2 pages, Letter)](../../assets/documents/nrp-mcp-quick-start.pdf). Print it on one sheet, both sides.

## What you get

* **GPUs and CPUs on a national cluster.** Nautilus has CPUs, GPUs and storage contributed by many institutions. There is no recharge from UCR for using it, and no allocation proposal to write.
* **Plain language.** The assistant plans, runs, watches and cleans up for you.
* **Nothing hidden.** Every plan shows what it creates, the resources it asks for, the files it copies and skips, and the `kubectl` it equals, so you learn as you go.
* **Your approval for the risky steps.** GPU work, public web apps, deleting, uploading files and installing tools wait for **your** yes: a question in your AI app, or a 6-character code that only you can see. Ordinary CPU jobs need a plan you agree to; read it before you say yes.
* **Results come home.** What your job writes to `results/` is saved to your own NRP S3 storage and downloaded to your laptop when you ask.

## Before you start

* A **Nautilus account in a namespace.** Sign in once at [nrp.ai](https://nrp.ai) first: your PI cannot add you to a namespace until you have. Faculty can request a namespace. See [Getting access to Nautilus](../kb024-nautilus-getting-access/).
* A **laptop** running macOS, Linux or Windows, where you can install programs in your own user folder (no admin rights needed).
* An **AI assistant that speaks MCP** and a model key for it. This guide uses Hermes Agent with a Gemini API key; Claude Desktop, Claude Code, VS Code, Cursor, Gemini CLI and OpenCode work too (see [Prefer another assistant?](#prefer-another-assistant)).

Plan on about 25 minutes for setup.

## Step 1. Sign in to Nautilus (2 min)

Go to [nrp.ai](https://nrp.ai), click **Login**, choose **University of California, Riverside**, and accept the policy. Your first sign-in creates your NRP identity, and it is what activates a namespace invitation.

**Check:** you see your name on nrp.ai, and your namespace admin can see you in the namespace.

## Step 2. Install nrp-mcp (2 min)

**Mac and Linux.** In Terminal:

```bash
curl -fsSL https://raw.githubusercontent.com/UCR-Research-Computing/nrp-mcp/main/scripts/install.sh | sh
```

The installer checks the download against the published checksums, puts `nrp-mcp` in `~/.local/bin`, and asks before adding that folder to your PATH (in `~/.zprofile` on a Mac, `~/.bashrc` on Linux). Answer **y**, then open a new terminal window. If `curl` is missing on Ubuntu, run `sudo apt install curl` first.

**Windows.** In PowerShell (press **Start**, type `PowerShell`, press **Enter**):

```powershell
irm https://raw.githubusercontent.com/UCR-Research-Computing/nrp-mcp/main/scripts/install.ps1 | iex
```

It downloads the right zip for your processor, checks it against the published checksums, installs `nrp-mcp.exe` in `%LOCALAPPDATA%\Programs\nrp-mcp`, unblocks it, and adds that folder to your user PATH. Close PowerShell and open a new window.

Prefer to download it yourself? Every build is on the [Releases page](https://github.com/UCR-Research-Computing/nrp-mcp/releases/latest). On a Mac, a file downloaded in a browser needs `xattr -d com.apple.quarantine ~/.local/bin/nrp-mcp` before it will run. On Windows, if SmartScreen says "Windows protected your PC", choose **More info**, then **Run anyway**.

**Check:** `nrp-mcp version` prints 1.1.0 or newer.

## Step 3. Connect your laptop and set up saved results (8 min)

Download your config at [nrp.ai/config](https://nrp.ai/config) (it lands in Downloads), then run:

```bash
nrp-mcp setup
```

It installs `kubectl` and the kubelogin sign-in plugin into your user folder (official releases, checksums verified, no admin rights), puts the NRP config in place (backing up any existing one), then opens a normal browser tab for the UCR sign-in. It asks before changing anything.

**Check:** it ends with "This computer is ready for Nautilus."

Next, set up saved results. Open [nrp.ai/s3token](https://nrp.ai/s3token/), create or copy your S3 access key and secret key, and run:

```bash
nrp-mcp s3 setup
```

Paste the two keys when asked (the secret is hidden as you type). They stay in a private file in your home folder; jobs on the cluster never see them. Without this step, the assistant will refuse to start a job until you say "yes, discard results", because anything the job writes would be lost when it ends.

Finally, check everything at once:

```bash
nrp-mcp doctor
```

**Check:** every line says `ok`. Any line that does not tells you the next command to run or who to ask.

## Step 4. Install Hermes Agent and add your key (8 min)

Mac and Linux:

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
```

Windows (PowerShell):

```powershell
iex (irm https://hermes-agent.nousresearch.com/install.ps1)
```

Open a new terminal. Store your Gemini API key and pick the model:

```bash
hermes config set GEMINI_API_KEY your-key
hermes config set model.provider gemini
hermes config set model.default gemini-3.8-flash
```

The key goes into Hermes's own settings file in your home folder, not into the shared config.

**Check:** `hermes chat -q "hello"` answers.

## Step 5. Give Hermes the nrp tools (2 min)

```bash
nrp-mcp client hermes
```

This writes the nrp entry, with the full path to `nrp-mcp`, into Hermes's settings (keeping a backup of the old file). Add `--namespace your-namespace` if you are in more than one namespace. Then start `hermes` and ask:

> Where do I stand on Nautilus?

**Check:** it answers with your user, your namespace, what is running and your GPU quota.

**Not sure what to do next?** Ask your assistant:

> Walk me through it.

nrp-mcp 1.1 and newer has a guide: it checks where you stand (this computer, the sign-in, your namespace, saving results, and any runs you have) and has your assistant ask you one question at a time, from setup to your first run and cleanup. If your AI app can show forms, nrp-mcp also asks you for any missing details (which file, GPU or not, and so on) in a short form instead of guessing. You can ask for the guide again whenever you come back.

## Hands-on: move a Slurm array job to Nautilus

Download the `examples/slurm-array-bootstrap` folder from the [nrp-mcp repository](https://github.com/UCR-Research-Computing/nrp-mcp) (GitHub's green **Code** button, then **Download ZIP**, gives you the whole repository; the folder is inside). It holds an R bootstrap of a trimmed mean and an ordinary Slurm script with `--array=0-9`. Open a terminal in that folder, start `hermes`, and ask, one at a time:

1. "Plan the Slurm script in this folder and show me what each line becomes."
2. "Run it." (This example prints its answers to the logs and saves no files, so if you skipped saved results, say "yes, discard results".)
3. "How did it go?"
4. "Clean up everything I made." (Deleting needs your approval; see below.)

| Slurm line | Becomes on Nautilus |
| :--- | :--- |
| `--cpus-per-task=1`, `--mem=2G` | A CPU and memory request; limits equal requests |
| `--time=00:20:00` | A time limit on the Job (rounded up to whole hours) |
| `--array=0-9` | An Indexed Job: 10 tasks, each with its own `$SLURM_ARRAY_TASK_ID` |
| `module load R` | A container image with R in it (`rocker/r-ver`) |

Ten tasks, ten seeds, ten different answers, in about a minute. CPU-only work is kept off GPU machines so the GPUs are left for work that needs them. The script still reads `$SLURM_ARRAY_TASK_ID`, so the same file keeps running on a Slurm cluster such as the [HPCC](../../services/hpcc/).

## Approval codes

GPU work, public web apps, deleting, uploading files and installing tools wait for your own yes. If your AI app can ask you directly, it shows a question; otherwise nrp-mcp shows a 6-character code (such as `KQ7-M4P`) in a desktop notification. If you miss it, run this in your own terminal:

```bash
nrp-mcp approve
```

Type the code into the chat. It works once, for that one plan, for 10 minutes. The assistant never sees the code, so it cannot approve these steps for you.

## What to say

| You say | nrp does |
| :--- | :--- |
| "Walk me through it" | One step at a time from wherever you are: setup, your first run, results, cleanup |
| "Where do I stand?" | Who you are, what is running, your quotas, any warnings |
| "Run train.py on a GPU" | Plans it, waits for your approval, then runs it |
| "Run this 50 times, seeds 1 to 50" | A parameter sweep (an Indexed Job) |
| "Why did it fail?" | The logs, a plain-language diagnosis and the fix |
| "Give me a Jupyter notebook" | A private notebook session; with a GPU it stops after a time limit (6 hours by default) |
| "Copy the results to my laptop" | Downloads the run's saved results, or files from your volume |
| "Clean up" | Lists what you made, deletes it after your approval |

The [nrp-mcp README](https://github.com/UCR-Research-Computing/nrp-mcp#readme) lists all nine tools, [START-HERE](https://github.com/UCR-Research-Computing/nrp-mcp/blob/main/docs/START-HERE.md) has a longer walkthrough with a glossary, and the `docs/examples` folder has 20 worked research examples.

## Rules of the road

* **Non-sensitive data only (UCR P1).** Public, non-sensitive data. No student records, personal information, clinical or controlled data. For P2 and above, see the [HPCC](../../services/hpcc/), [Ursa Major](../../services/ursa-major/) or the [Secure Enclave](../../services/secure-enclave/).
* **No idle GPUs.** Ask for a GPU only when your code uses one. The NRP suspends accounts that hold idle GPUs.
* **Nothing public without asking Research Computing.** Publishing a web app also needs your own approval, and the app is set to expire after 14 days; the NRP removes long-running apps after two weeks.
* **Clean up when you finish.** Jobs left running hold resources other researchers need.
* **Keep your keys private.** Never paste a model key or your S3 keys into a chat, a repository, a shared document or a screenshot.

The full rules are the NRP [Cluster Policies](https://nrp.ai/documentation/userdocs/start/policies/).

## If you get stuck

Run `nrp-mcp doctor` first: any line that is not `ok` names the next step.

| Symptom | Fix |
| :--- | :--- |
| "no Nautilus context" | Download the config at nrp.ai/config again, then rerun `nrp-mcp setup` |
| "forbidden" or not in the namespace | Sign in at nrp.ai once more, then ask your namespace admin to check your membership |
| `nrp-mcp: command not found` | Open a new terminal window, or use the full path: `~/.local/bin/nrp-mcp` (Mac, Linux) or `& "$env:LOCALAPPDATA\Programs\nrp-mcp\nrp-mcp.exe"` (Windows) |
| The plan is refused because results would be lost | Run `nrp-mcp s3 setup` (Step 3), or say "yes, discard results" if the job saves nothing |
| Missed the approval code | Run `nrp-mcp approve` in your own terminal |
| Hermes has no nrp tools | Run `nrp-mcp client hermes` again, then restart `hermes` |
| Your laptop will not cooperate | Use the NRP JupyterHub, which needs only the sign-in: [jupyterhub-west.nrp-nautilus.io](https://jupyterhub-west.nrp-nautilus.io) |

## Prefer another assistant?

`nrp-mcp client` sets up the other common assistants the same way. Run the line for yours, then fully quit and reopen the app:

```bash
nrp-mcp client claude-desktop
nrp-mcp client claude-code
nrp-mcp client vscode
nrp-mcp client cursor
nrp-mcp client gemini
nrp-mcp client opencode
```

Each one writes your user-level settings for that app, with the full path to `nrp-mcp`, and keeps a backup of the old file. For anything else, add an MCP server whose `command` is the full path to `nrp-mcp` and whose `args` is `["serve"]`.

## Getting help

* **nrp-mcp questions and bugs:** [GitHub issues](https://github.com/UCR-Research-Computing/nrp-mcp/issues). Include what `nrp-mcp doctor` prints.
* **UCR Research Computing:** research-computing@ucr.edu or the [Get help](../../help/) page. We can help you get set up, port a Slurm workflow, or decide whether Nautilus or the HPCC fits your work. We do not run the NRP and cannot approve NRP accounts or change NRP quotas.
* **The cluster itself:** the [NRP contact page](https://nrp.ai/contact).

nrp-mcp is a community tool from UCR Research Computing, not an NRP product. Nautilus is operated by the National Research Platform.

## Related guides

* [Researcher guide to NRP Nautilus](../kb023-nautilus-researcher-guide/)
* [Getting access to Nautilus: accounts, namespaces and kubectl](../kb024-nautilus-getting-access/)
* [Running batch jobs and GPU work with Kubernetes](../kb026-nautilus-batch-jobs-and-gpus/)
* [Teaching a class or workshop on Nautilus](../kb030-nautilus-teaching-and-workshops/)
