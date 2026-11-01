---
title: "Research Computing cluster portal: use it from an AI assistant"
topic: Cloud
description: "Connect an AI assistant (Claude, Codex, Gemini CLI, OpenCode, Hermes) to the Research Computing HPC cluster so it can check the cluster, explain your jobs, look up software, check batch scripts and, with your approval, submit and cancel your jobs. Part 5 of the portal guide series."
audience: "Members of labs that Research Computing has set up on its HPC cluster in Google Cloud"
reviewed: 2026-10-29
owner: Research Computing
unlisted: true
sitemap: false
series: ursa-portal
series_order: 5
review_notes:
  - "Unlisted on purpose (2026-10-29): see the first article in this series for the audience and mechanism. Rewritten from the withdrawn 2026-10-19 draft."
  - "The server's name and address are left out on purpose: the site wording rules do not name this service publicly. Research Computing sends the address (SERVER_URL here) when it adds a person to the server's sign-in list."
  - "Client commands follow the server's client guide (docs/CLIENTS.md in its repository). The server was checked live on 2026-10-29 from a Hermes client (health and allocation tools answered from the cluster's login node). Tool behaviour (two-step approval, 10-minute single-use plans, own files only, untrusted-text labelling) follows the server's README and specification."
  - "Dollar figures are left out (Chuck, 2026-10-19). CHECK: per-person caps are set per person and not printed here."
---

This is part 5 of the portal series. If you have not connected yet, start with [Getting connected](../ursa-portal-getting-started/).

The cluster has an **MCP server**: a service that gives an AI assistant a fixed set of cluster tools. Once your assistant is connected, you can ask in plain language, from your own laptop, with no tunnel open:

* "What's running on the cluster, and is anything queued?"
* "Why did my job 1234 fail?"
* "Which module has GROMACS, and what does it need loaded first?"
* "Check this batch script before I submit it."
* "How much of our lab's allocation have I used this month?"
* "Submit it on standard with 8 cores for two hours." (you approve the plan first)

The assistant works **as you**: it sees your jobs and your files, nothing more, and every action is checked against limits Research Computing sets per person. There is no shell tool, so it can't run arbitrary commands on the cluster.

## Before you start

* A cluster account (see [Getting connected](../ursa-portal-getting-started/#before-you-start)).
* Research Computing adds your `NETID@ucr.edu` account to the server's sign-in list and sends you its address. Below it appears as `SERVER_URL`.
* An AI assistant that supports remote MCP servers. You sign in through your browser with your UCR Google account; there is no API key to copy.

## Connect your assistant

Pick your client. Each opens a browser for sign-in the first time; choose your `NETID@ucr.edu` account.

**Claude Code**

```bash
claude mcp add --transport http -s user ursa SERVER_URL
```

Then in Claude Code run `/mcp`, choose `ursa`, **Authenticate**, and sign in. (`-s user` makes it available in every project; leave it off to add it to the current project only.)

**Claude Desktop or claude.ai**: Settings, Connectors, **Add custom connector**, name `Ursa cluster`, URL `SERVER_URL`. On a Team or Enterprise plan an owner may need to allow custom connectors first.

**OpenAI Codex CLI**

```bash
codex mcp add ursa --url SERVER_URL
```

It signs in right away. Later, `codex mcp login ursa` signs in again and `codex mcp list` shows the connection.

**Gemini CLI**

```bash
gemini mcp add -s user -t http ursa SERVER_URL
```

Start `gemini`, then run `/mcp auth ursa`.

**OpenCode**

```bash
opencode mcp add ursa --url SERVER_URL
opencode mcp auth ursa
```

**Hermes Agent**

```bash
hermes mcp add ursa --url SERVER_URL --auth oauth
hermes mcp test ursa
```

Any other client that supports remote MCP servers over HTTP with OAuth sign-in works the same way: give it `SERVER_URL` and sign in when asked.

**Check that it works:** ask your assistant "What partitions does the Ursa cluster have?" It should list standard, gpul4, highmem and the others, and show the commands it ran.

## What it can do

**Look things up** (no approval needed):

* Cluster status, partitions and their limits, and how busy each one is.
* Your jobs: list, details, efficiency, the end of a log, and a plain-language explanation of why a job failed or is still pending.
* Software: search modules, see what a module sets and what it needs loaded first, find containers, tested recipes and shared reference databases.
* Your files: list a folder or read a text file in your home or scratch. Hidden and credential-like files are never shown.
* Check a batch script against the cluster before you submit it, and test that modules load (in a short job on the `check` partition, never on the login node).
* Your own usage, your lab's allocation, and avoidable waste (jobs that asked for much more than they used).
* The exact command for an interactive session.

**Act on your own jobs** (two steps; you approve each one):

* Submit, cancel, hold or release a job. Step one returns a **plan**: the checked script, partition, nodes, time limit, when Slurm expects it to start, and any problems. Nothing happens until step two confirms that exact plan. A plan expires after 10 minutes and works once.
* Upload an input file for a job, and get download links for its results.

**Read the plan before you say yes.** Assistants can be wrong; the plan is what will actually run.

Every answer includes the scheduler commands that produced it, so you can check it yourself over SSH.

## A worked example

```text
You:       Why did job 1612 end early?
Assistant: [job_explain 1612]
           It was a Jupyter session from the web portal on standard with 4 cores.
           It ended when its 1-hour limit ran out (TIMEOUT), not from an error.
           For longer work, launch with more hours, or move the notebook's code
           into a batch job.

You:       Write a batch script that runs analysis.py with python-sci on 8 cores
           for 6 hours, check it, and submit it.
Assistant: [script_check] -> looks fine: asks for cores and a time limit
           [job_submit]   -> Plan (nothing submitted yet):
                             partition standard, 1 node, 8 cores, 6 h
                             Slurm expects it to start within a few minutes
           Submit this?
You:       Yes.
Assistant: [job_submit_confirm] -> Submitted job 1631.
```

## Limits and privacy

* Each person has **caps** set by Research Computing: nodes and hours per job, and how much can be submitted per day. A plan over a cap is refused with the reason. If a cap blocks real work, email us.
* The server **records each tool call** (who, which tool, the command it ran, and the result size), not your conversation with the assistant.
* **Job output and log text** that comes back to the assistant is marked as untrusted data, so text in a file can't instruct the assistant to do something.
* Your conversation goes to whichever AI company runs your assistant. Follow [UCR's guidance on AI tools](https://its.ucr.edu/ai) and keep it to P1 and P2 information.

## Tips

* Give job IDs: "explain job 1234" is faster than "my job from this morning".
* Ask the assistant to **check a script before you submit it**; it catches a missing core or time request, a module that doesn't exist, or a partition that's wrong for the job.
* For work that will take many hours or many nodes, have the assistant show the plan, then think about it before confirming.
* The assistant's view is your view: it can't see other people's jobs or files, and it can't change the cluster.

## Get help

Email [research-computing@ucr.edu](mailto:research-computing@ucr.edu) with your NetID, your client and what it said. If sign-in fails with an access message, you are probably not on the sign-in list yet. Next in the series: [Troubleshooting](../ursa-portal-troubleshooting/).

Upstream documentation: [Model Context Protocol](https://modelcontextprotocol.io/), [Claude Code MCP](https://docs.anthropic.com/en/docs/claude-code/mcp), [Codex MCP](https://developers.openai.com/codex/mcp), [Gemini CLI MCP servers](https://github.com/google-gemini/gemini-cli/blob/main/docs/tools/mcp-server.md).
