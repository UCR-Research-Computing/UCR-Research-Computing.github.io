---
title: "Run Nautilus jobs from your AI assistant (nrp-mcp quick start)"
kb_id: KB031
topic: National
description: "Connect your laptop to NRP Nautilus, give your AI assistant the nrp tools, then move a Slurm job to Kubernetes by asking in plain language."
audience: "UCR researchers and students with a Nautilus namespace who want to run jobs by talking to an AI assistant instead of writing Kubernetes files"
reviewed: 2026-10-08
owner: Research Computing
review_notes:
  - "Web version of the printable handout made for an October 2026 hands-on workshop. The PDF (assets/documents/nrp-mcp-quick-start.pdf) is built from docs/handouts/nrp-mcp-quick-start.html with headless Chrome."
  - "Steps follow the nrp-mcp README and CHANGELOG at v0.7.0 (2026-10-07). The Hermes Agent, Gemini CLI and OpenCode paths were tested with a Gemini API key before the workshop; the Slurm array example (examples/slurm-array-bootstrap) ran live, 10 of 10 tasks with distinct results, on nrp-mcp 0.6.3."
  - "Changed from the workshop handout after an install review: the Mac/Linux steps put ~/.local/bin on PATH explicitly (install.sh does not, and a new terminal does not fix it on macOS), the client command uses the full path, and Windows gets PowerShell lines instead of 'keep nrp-mcp.exe handy'."
  - "CHECK: the Windows PowerShell lines (unzip to LOCALAPPDATA, Unblock-File, user PATH) follow the install review's recommended fix but have not been run on a Windows machine. Remove this note once tested, or once nrp-mcp ships its own install.ps1."
  - "CHECK: the browser sign-in in nrp-mcp setup has been run on Linux only."
---

[nrp-mcp](https://github.com/UCR-Research-Computing/nrp-mcp) is a small open-source program (MIT license) from UCR Research Computing that runs on your own computer and gives an AI assistant a set of tools for the [NRP Nautilus](../kb023-nautilus-researcher-guide/) cluster. You describe what you want ("run this script on a GPU", "run it 50 times with different seeds") and the assistant plans the Kubernetes work, shows you the plan and the `kubectl` it equals, and runs it once you agree.

This page is the web version of the one-sheet handout from our hands-on workshop.

**Printable version:** [nrp-mcp quick start (PDF, 2 pages, Letter)](../../assets/documents/nrp-mcp-quick-start.pdf). Print it on one sheet, both sides.

## What you get

* **GPUs and CPUs on a national cluster.** Nautilus has CPUs, GPUs and storage contributed by many institutions. There is no recharge from UCR for using it, and no allocation proposal to write.
* **Plain language.** The assistant plans, runs, watches and cleans up for you.
* **Nothing hidden.** Every plan shows what it creates and the `kubectl` it equals, so you learn as you go.
* **Asks before acting.** Running, publishing and deleting each need a plan you approve, and publishing a web app needs you to type its URL back. Your assistant is meant to ask you first; read the plan before you say yes.

## Before you start

* A **Nautilus account in a namespace.** Students are added by their PI; faculty can request a namespace. See [Getting access to Nautilus](../kb024-nautilus-getting-access/).
* A **laptop** running macOS, Linux or Windows, where you can install programs in your own user folder (no admin rights needed).
* An **AI assistant that speaks MCP** and a model key for it. This guide uses Hermes Agent with a Gemini API key; Gemini CLI, OpenCode, Claude Code and others work too (see [Prefer another assistant?](#prefer-another-assistant)).

Plan on about 25 minutes for setup.

## Step 1. Sign in to Nautilus (2 min)

Go to [nrp.ai](https://nrp.ai), click **Login**, choose **University of California, Riverside**, and accept the policy. Your first sign-in is what activates a namespace invitation.

**Check:** you see your name on nrp.ai, and your namespace admin can see you in the namespace.

## Step 2. Install nrp-mcp (2 min)

**Mac and Linux.** Install it, then put `~/.local/bin` on your PATH. The installer leaves the program in `~/.local/bin`, which is not on the PATH of a new terminal on macOS or on many Linux desktops.

```bash
curl -fsSL https://raw.githubusercontent.com/UCR-Research-Computing/nrp-mcp/main/scripts/install.sh | sh
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc    # macOS (zsh)
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc   # Linux (bash)
export PATH="$HOME/.local/bin:$PATH"                       # this terminal, now
```

Run only the `echo` line for your shell. If `curl` is missing on Ubuntu, run `sudo apt install curl` first.

**Windows.** Download `nrp-mcp_<version>_windows_amd64.zip` from the [Releases page](https://github.com/UCR-Research-Computing/nrp-mcp/releases) into your Downloads folder. Then, in PowerShell:

```powershell
$d = "$env:LOCALAPPDATA\Programs\nrp-mcp\bin"
New-Item -ItemType Directory -Force $d | Out-Null
$zip = Get-ChildItem "$HOME\Downloads\nrp-mcp_*_windows_amd64.zip" | Sort-Object LastWriteTime | Select-Object -Last 1
Expand-Archive $zip.FullName "$env:TEMP\nrp-mcp" -Force
Copy-Item "$env:TEMP\nrp-mcp\*\nrp-mcp.exe" $d -Force
Unblock-File "$d\nrp-mcp.exe"
[Environment]::SetEnvironmentVariable("Path", "$d;" + [Environment]::GetEnvironmentVariable("Path", "User"), "User")
```

Close PowerShell and open a new window. Do not use `setx PATH` for this: it can overwrite your existing PATH.

**Check:** `nrp-mcp version` prints 0.7.0 or newer.

## Step 3. Connect your laptop (8 min)

Download your config at [nrp.ai/config](https://nrp.ai/config) (it lands in Downloads), then run:

```bash
nrp-mcp setup
```

It installs `kubectl` and the kubelogin sign-in plugin into your user folder (official releases, checksums verified, no admin rights), puts the NRP config in place (backing up any existing one), then opens a normal browser tab for the UCR sign-in. It asks before changing anything.

**Check:** it ends with "This computer is ready for Nautilus."

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

Use the full path to `nrp-mcp`, so Hermes finds it whatever your PATH looks like.

Mac and Linux:

```bash
hermes mcp add nrp --command "$HOME/.local/bin/nrp-mcp" --args serve
```

Windows (PowerShell):

```powershell
hermes mcp add nrp --command "$env:LOCALAPPDATA\Programs\nrp-mcp\bin\nrp-mcp.exe" --args serve
```

Answer **Y** to enable all 9 tools. If Hermes says it cannot connect and offers to "save config anyway", answer **N** and fix the path first; a saved server that cannot start stays disabled. Check it with `hermes mcp test nrp`, then start `hermes` and ask:

> Where do I stand on Nautilus?

**Check:** it answers with your user, your namespace, what is running and your GPU quota.

## Hands-on: move a Slurm array job to Nautilus

Download the `examples/slurm-array-bootstrap` folder from the [nrp-mcp repository](https://github.com/UCR-Research-Computing/nrp-mcp) (GitHub's green **Code** button, then **Download ZIP**, gives you the whole repository; the folder is inside). It holds an R bootstrap of a trimmed mean and an ordinary Slurm script with `--array=0-9`. Open a terminal in that folder, start `hermes`, and ask, one at a time:

1. "Plan the Slurm script in this folder and show me what each line becomes."
2. "Run it."
3. "How did it go?"
4. "Clean up everything I made."

| Slurm line | Becomes on Nautilus |
| :--- | :--- |
| `--cpus-per-task=1`, `--mem=2G` | A CPU and memory request; limits equal requests |
| `--time=00:20:00` | A time limit on the Job (rounded up to whole hours) |
| `--array=0-9` | An Indexed Job: 10 tasks, each with its own `$SLURM_ARRAY_TASK_ID` |
| `module load R` | A container image with R in it |

Ten tasks, ten seeds, ten different answers, in about a minute. The script still reads `$SLURM_ARRAY_TASK_ID`, so the same file keeps running on a Slurm cluster such as the [HPCC](../../services/hpcc/).

## What to say

| You say | nrp does |
| :--- | :--- |
| "Where do I stand?" | Who you are, what is running, your quotas, any warnings |
| "Run train.py on a GPU" | Plans it, waits for your yes, then runs it |
| "Run this 50 times, seeds 1 to 50" | A parameter sweep (an Indexed Job) |
| "Why did it fail?" | The logs, a plain-language diagnosis and the fix |
| "Give me a Jupyter notebook" | A private notebook session on Nautilus |
| "Copy the results to my laptop" | Downloads files from your volume |
| "Clean up" | Lists what you made, deletes it after a second yes |

The [nrp-mcp README](https://github.com/UCR-Research-Computing/nrp-mcp#readme) lists all nine tools, and its `docs/examples` folder has 20 worked research examples.

## Rules of the road

* **Non-sensitive data only (UCR P1).** Public, non-sensitive data. No student records, personal information, clinical or controlled data. For P2 and above, see the [HPCC](../../services/hpcc/), [Ursa Major](../../services/ursa-major/) or the [Secure Enclave](../../services/secure-enclave/).
* **No idle GPUs.** Ask for a GPU only when your code uses one. The NRP suspends accounts that hold idle GPUs.
* **Nothing public without asking Research Computing.** Publishing a web app also needs you to type its URL back.
* **Clean up when you finish.** Jobs left running hold resources other researchers need.
* **Keep your key private.** Never paste it into a chat, a repository, a shared document or a screenshot.

The full rules are the NRP [Cluster Policies](https://nrp.ai/documentation/userdocs/start/policies/).

## If you get stuck

| Symptom | Fix |
| :--- | :--- |
| "no Nautilus context" | Download the config at nrp.ai/config again, then rerun `nrp-mcp setup` |
| "forbidden" or not in the namespace | Sign in at nrp.ai once more, then ask your namespace admin to check your membership |
| `nrp-mcp: command not found` | The PATH step in Step 2 was missed; run it, or use the full path (`~/.local/bin/nrp-mcp`) |
| `setup` says "Not ready yet: kubectl" | An older `kubectl` (often from Docker Desktop) comes first on your PATH; tell us which one `which kubectl` shows |
| Hermes has no nrp tools | Run `hermes mcp test nrp`; if it fails, `hermes mcp remove nrp` and repeat Step 5 with the full path |
| Your laptop will not cooperate | Use the NRP JupyterHub, which needs only the sign-in: [jupyterhub-west.nrp-nautilus.io](https://jupyterhub-west.nrp-nautilus.io) |

## Prefer another assistant?

* **Gemini CLI** (needs Node.js 20 or newer): `npm install -g @google/gemini-cli`, set `GEMINI_API_KEY`, then `gemini mcp add nrp "$HOME/.local/bin/nrp-mcp" serve`.
* **OpenCode:** set `GOOGLE_GENERATIVE_AI_API_KEY`, choose the model `google/gemini-3.8-flash`, and add nrp under `mcp` in `opencode.json`.
* **Claude Code:** `claude mcp add nrp -- "$HOME/.local/bin/nrp-mcp" serve`.
* **Claude Desktop, Cursor, VS Code and others:** add an `mcpServers` entry whose `command` is the full path to `nrp-mcp` and whose `args` is `["serve"]`.

On Windows, use the full path `%LOCALAPPDATA%\Programs\nrp-mcp\bin\nrp-mcp.exe` in each of these.

## Getting help

* **nrp-mcp questions and bugs:** [GitHub issues](https://github.com/UCR-Research-Computing/nrp-mcp/issues).
* **UCR Research Computing:** research-computing@ucr.edu or the [Get help](../../help/) page. We can help you get set up, port a Slurm workflow, or decide whether Nautilus or the HPCC fits your work. We do not run the NRP and cannot approve NRP accounts or change NRP quotas.
* **The cluster itself:** the [NRP contact page](https://nrp.ai/contact).

nrp-mcp is a community tool from UCR Research Computing, not an NRP product. Nautilus is operated by the National Research Platform.

## Related guides

* [Researcher guide to NRP Nautilus](../kb023-nautilus-researcher-guide/)
* [Getting access to Nautilus: accounts, namespaces and kubectl](../kb024-nautilus-getting-access/)
* [Running batch jobs and GPU work with Kubernetes](../kb026-nautilus-batch-jobs-and-gpus/)
* [Teaching a class or workshop on Nautilus](../kb030-nautilus-teaching-and-workshops/)
