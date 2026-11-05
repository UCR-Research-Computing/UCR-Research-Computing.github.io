---
title: "Using the UCR AI gateway: a guide for lab PIs and members"
topic: Cloud
description: "Run your lab's access to AI models: add members, give each one a capped key by claim link, issue a dedicated key for an app, and see what the lab spends. Then use a key from Python, curl, Gemini CLI or OpenCode."
audience: "PIs and members of labs onboarded to the UCR AI gateway pilot"
reviewed: 2026-11-05
owner: Research Computing
unlisted: true
sitemap: false
review_notes:
  - "2026-11-05: Claude Code section rewritten for a separate, temporary gateway session (claude-ucr shell function, or a per-folder .claude/settings.local.json) that leaves normal Claude Code untouched. Tested on Claude Code 2.1.311 against the live gateway (claude-ucr in zsh and in bash 3.2): folder settings ran claude-sonnet-5-5 and gemini-3.8-flash through the gateway with all claude.ai connectors still listed and the key spend rising; the same command in another folder ran on the normal account with no gateway spend; the env wrapper ran gemini-3.8-flash and a Gemini session with the ANTHROPIC_DEFAULT_*_MODEL lines completed a Write tool call. A bad key in the header makes Claude Code hang and retry rather than print a clear error (seen 2026-10-27 and again 2026-11-05)."
  - "Unlisted on purpose (2026-10-08): the AI gateway is a pilot open to labs Research Computing has onboarded, so this page is shared by link with those labs and is kept out of the KB index, related guides, site search and the sitemap, with noindex. Make it a listed, numbered article when the gateway opens more widely."
  - "Tool names, roles, key policy (90-day expiry, daily cap of 30 percent of the monthly cap, rate limits on every key and lab) app keys, models on offer and terms of use follow the gateway admin server (aigw v0.8.0) as read live on 2026-10-08. Client setups come from aigw_client_setup, tested 2026-10-01; the OpenCode MCP command was tested 2026-10-08 (OpenCode 1.18)."
  - "Prices are deliberately not printed here: they change, and aigw_models shows the current price of every model."
  - "2026-10-27: tool setups in \"Use your key in your AI coding tool\" were run against the live gateway (Claude Code 2.1.311, Codex CLI 0.164.0, Gemini CLI 0.46.0, OpenCode 1.19.4). Claude Code connector behaviour was checked with a claude.ai login: any ANTHROPIC_AUTH_TOKEN or ANTHROPIC_API_KEY disables claude.ai connectors; the x-litellm-api-key header keeps them. Header mode confirmed: a bad key returns 401 and a good key returns 200 even with a claude.ai bearer sent alongside, and the key's spend rose after a header-mode call (the test key was also in use elsewhere, so the exact per-call amount was not isolated). Gateway Cloud Run logs for the test window (1,685 entries, 20 /v1/messages requests including the header-mode calls) were searched for the claude.ai bearer, the test keys and any Authorization or x-litellm-api-key text: zero matches, so request headers are not written to the service logs. The LiteLLM spend database was not inspected. CHECK: Codex with Claude models needs web_search disabled until the Google Cloud org policy allows it."
  - "2026-10-22: after a multi-model wording review, the app-key example is a research pipeline with a modest cap (teaching app keys are arranged case by case with leadership approval), and the data rule is P1 and P2 only with no exception path."
---

The UCR AI gateway is a Research Computing service, now in pilot, that gives labs access to Google's Gemini models, including embeddings, through one endpoint. Some keys also carry Anthropic's Claude models; ask Research Computing if you need Claude on yours. The gateway can route to other models and providers, and more are planned for the future, such as open-source models hosted elsewhere and third-party API sources. If you need a model that is not listed, contact Research Computing. Each lab has a monthly allowance. The lab's PI decides who is in the lab, what each person may spend, who holds a key, and whether an app the lab runs gets a key of its own, without filing a ticket.

**Printable version:** [AI gateway quick start (PDF, 2 pages, Letter)](../../assets/documents/ai-gateway-quick-start.pdf).

This page has two parts: [for PIs](#for-pis-run-your-lab) and [for lab members](#for-lab-members-collect-and-use-your-key).

## How it works

* **A lab** has a PI, a monthly allowance that resets on the 1st, members, and a shared speed limit (tokens and requests per minute) that all its keys count against together.
* **Each member** has their own monthly cap inside the lab's allowance. Every lab has a default member cap, so nobody is ever uncapped.
* **Each person gets their own key**, delivered by a one-time claim link. The link holds no key and works only for the person it names, for 72 hours. The key is created when they open the link, sign in with their own UCR Google account and accept the terms of use, and it is shown to them once.
* **Every key** expires after 90 days, has a daily cap of 30 percent of its monthly cap, has rate limits (tokens per minute, requests per minute, requests at once), and carries the Gemini models. The PI's own key gets higher rate limits than students' keys.
* **An app can have a key of its own.** For a web app or service that many people use (a research pipeline or a shared lab tool, for example), the PI issues one app key. It belongs to the lab rather than a person, has its own monthly cap, daily cap and higher rate limits sized for many users at once, and its spend shows as its own line. The app does any per-user limits on its side. The lab's shared speed limit still applies.
* **The gateway records usage** (who, which model, tokens and cost), not the text of prompts or answers.

Everyone is identified by their UCR NetID account (for example `jdoe001@ucr.edu`). Use NetIDs when you add people; the gateway resolves other UCR addresses to the NetID account.

## For PIs: run your lab

You run your lab through **aigw**, the gateway's admin server. It is an MCP server, so it works with any AI agent or harness that supports MCP (Hermes Agent, Claude Code, OpenCode, Gemini CLI and others). Plug it into the one you use, then ask in plain language; the agent calls the tools. Research Computing creates your lab and adds you to the sign-in list first.

### 1. Plug aigw into your agent (5 min)

Pick one:

```bash
# Hermes Agent (run on its own in a terminal, then restart Hermes)
hermes mcp add aigw --url https://ai-gateway-mcp-575977597413.us-central1.run.app/mcp --auth oauth

# Claude Code (then type /mcp inside Claude Code to sign in)
claude mcp add --transport http aigw https://ai-gateway-mcp-575977597413.us-central1.run.app/mcp

# OpenCode (then run: opencode mcp auth aigw)
opencode mcp add aigw --url https://ai-gateway-mcp-575977597413.us-central1.run.app/mcp

# Gemini CLI
gemini mcp add -s user -t http aigw https://ai-gateway-mcp-575977597413.us-central1.run.app/mcp
```

Any other MCP-capable agent: add a remote (Streamable HTTP) MCP server at `https://ai-gateway-mcp-575977597413.us-central1.run.app/mcp` with OAuth sign-in.

A browser opens once. Sign in with your UCR NetID account. Then ask:

> Who am I on the AI gateway?

**Check:** it shows your NetID, your lab, and your role in it as PI.

### 2. Add your students

> Add jdoe001 to my lab with a monthly cap of 50 dollars.

The agent shows the person's directory name back so you can confirm it is the right person. Leave out the cap and the lab's default member cap applies.

### 3. Give each student a key

> Issue a key to jdoe001.

Changes that create keys or remove people are two-step: the agent shows a plan first, and nothing happens until you confirm. You get a claim link and a short message to paste into an email to the student. Send it from your UCR email.

Your own key works the same way: "Issue a key to me."

### 4. Give an app its own key (optional)

If your lab runs a web app or service that calls AI models for many people, give it one key of its own instead of using a personal key:

> Issue an app key named lab-pipeline for my lab with a monthly cap of 100 dollars.

Only the PI can issue an app key. Give it a monthly cap that fits the app (without one it starts at a modest default you can raise later). Confirm the plan, then open the claim link yourself: the key appears once in your browser, and you put it straight into the app's settings (never in its code or repository). The app key:

* belongs to the lab, not to you, so your personal key stays separate;
* has a daily cap of 30 percent of its monthly cap and higher rate limits than a personal key (sized for many users at once; ask to change them);
* shows as its own line when you ask what the lab spent;
* carries the same Gemini models as personal keys;
* is one per app name; to replace it, ask to rotate it.

The gateway sees all of the app's traffic as one key, so per-user quotas belong in the app itself.

### 5. Watch spending and adjust

| You say | aigw does |
| :--- | :--- |
| "Show my lab." | Allowance, spent this month, reset date, every member with cap and spend |
| "What did my lab spend in the last 30 days?" | Spend by member, by model and by day |
| "Set jdoe001's cap to 100 dollars." | Changes the member's cap (never above the allowance) |
| "Show my lab's rate limits." | The lab's shared limit and the default limits for new keys |
| "Lower jdoe001's key to 100 requests a minute." | Changes a key's rate limits at once, no new key needed |
| "Raise the lab-pipeline app key to 500 requests a minute." | Changes an app key's rate limits, live |
| "Give new student keys 1M tokens a minute." | Changes the lab's default rate limits for keys issued from now on |
| "Which claims are still open?" | Claim links not yet collected, and when they expire |
| "Block jdoe001's key." | Refuses that key at once; unblock undoes it |
| "Remove jdoe001 from my lab." | Takes access away; history is kept |
| "Make jsmith002 a delegate." | A delegate can add members and issue personal keys for you (not app keys) |
| "Freeze my lab because of a runaway script." | Blocks every key in the lab at once, until you unfreeze |
| "Set my lab's keys to expire after 30 days." | A stricter lab policy for new keys (never looser than the gateway's) |

To ask for a bigger allowance, or for anything aigw cannot do, email research-computing@ucr.edu.

## For lab members: collect and use your key

### 1. Collect your key

Open the claim link your PI sent you, sign in with your UCR NetID account, read and accept the terms of use, and click **Show my key**. Copy it straight into a safe place: it is shown only once. If you lose it, ask your PI to issue a new one.

Store it in an environment variable, not in your code:

```bash
export UCR_AI_GATEWAY_KEY=your-key     # add this line to ~/.zshrc or ~/.bashrc
```

### 2. Use it

The gateway speaks the OpenAI API, so most tools and libraries work by changing the base URL. Base URL:

```text
https://ucr-ursa-major-ai-gateway-service-575977597413.us-central1.run.app/v1
```

**Python** (`pip install openai`):

```python
import os
from openai import OpenAI

client = OpenAI(
    base_url="https://ucr-ursa-major-ai-gateway-service-575977597413.us-central1.run.app/v1",
    api_key=os.environ["UCR_AI_GATEWAY_KEY"],
)
r = client.chat.completions.create(
    model="gemini-3.8-flash",
    messages=[{"role": "user", "content": "hello"}],
)
print(r.choices[0].message.content)
```

**curl:**

```bash
curl https://ucr-ursa-major-ai-gateway-service-575977597413.us-central1.run.app/v1/chat/completions \
  -H "Authorization: Bearer $UCR_AI_GATEWAY_KEY" -H 'Content-Type: application/json' \
  -d '{"model": "gemini-3.8-flash", "messages": [{"role": "user", "content": "hello"}]}'
```

**See your own spend and limits** (costs nothing):

```bash
curl https://ucr-ursa-major-ai-gateway-service-575977597413.us-central1.run.app/key/info \
  -H "Authorization: Bearer $UCR_AI_GATEWAY_KEY"
```

### Use your key in your AI coding tool

Pick the tool you already use. Each setup below was tested against the gateway on 2026-10-27.

**Claude Code.** You can try the gateway in Claude Code without touching your normal Claude Code. The setups below only change the one Claude Code session you start with them. Your usual `claude` keeps working exactly as before, with your own login, models and claude.ai connectors (Gmail, Drive, Slack and the rest).

The key goes in a header (`ANTHROPIC_CUSTOM_HEADERS`), not in `ANTHROPIC_AUTH_TOKEN` or `ANTHROPIC_API_KEY`. That's on purpose. If either of those two is set, Claude Code switches your claude.ai connectors off and prints "claude.ai connectors are disabled because ANTHROPIC_API_KEY or another auth source is set". With the header, the gateway runs the models and your claude.ai login keeps the connectors working.

**Option A: a separate `claude-ucr` command (recommended).** Add this to `~/.zshrc` (Mac) or `~/.bashrc` (Linux), then open a new terminal:

```bash
claude-ucr() {
  env ANTHROPIC_BASE_URL=https://ucr-ursa-major-ai-gateway-service-575977597413.us-central1.run.app \
      ANTHROPIC_CUSTOM_HEADERS="x-litellm-api-key: Bearer $UCR_AI_GATEWAY_KEY" \
      ANTHROPIC_MODEL="${UCR_MODEL:-gemini-3.8-flash}" \
      ANTHROPIC_DEFAULT_SONNET_MODEL="${UCR_MODEL:-gemini-3.8-flash}" \
      ANTHROPIC_DEFAULT_OPUS_MODEL=gemini-4-argon \
      ANTHROPIC_DEFAULT_HAIKU_MODEL=gemini-3.5-flash-lite \
      claude "$@"
}
```

Run `claude-ucr` for a gateway session and `claude` for your normal one. You can have both open in different terminals at the same time. The settings exist only inside that one `claude-ucr` session: nothing is exported to your shell, and nothing is written to your Claude Code settings.

The three `ANTHROPIC_DEFAULT_*_MODEL` lines matter. Claude Code quietly makes its own background calls (titles, summaries, quick checks) on a small "Haiku" model, and when you pick Sonnet or Opus in `/model` it asks for those by name. If your key carries Gemini only, those calls would fail. The lines point each of them at a Gemini model your key has. If your key also carries Claude models, use those names instead:

```bash
UCR_MODEL=claude-sonnet-5-5 claude-ucr              # one session on Claude Sonnet
claude-ucr --model gemini-2.5-pro                   # or pick any model your key has
```

To leave: quit the session (`/exit` or Ctrl-D) and run `claude` as usual. To remove it for good, delete the function from your shell file.

**Option B: one project folder that always uses the gateway.** Use this when you want a test folder where every Claude Code session goes through the gateway, while every other folder stays normal. In that folder, create `.claude/settings.local.json`:

```json
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://ucr-ursa-major-ai-gateway-service-575977597413.us-central1.run.app",
    "ANTHROPIC_CUSTOM_HEADERS": "x-litellm-api-key: Bearer YOUR-KEY",
    "ANTHROPIC_MODEL": "gemini-3.8-flash",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "gemini-3.8-flash",
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "gemini-4-argon",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "gemini-3.5-flash-lite"
  }
}
```

Then `cd` into the folder and run `claude`. This file holds your key in plain text, so:

- Run `chmod 600 .claude/settings.local.json`.
- Keep it out of git: add `.claude/settings.local.json` to the folder's `.gitignore`, and check `git status` before you commit anything.
- Never use this in a shared or synced folder.

To leave: `cd` to any other folder (or delete the file) and start `claude` again.

**Check which one you're on.** In a gateway session, Claude Code prints the `[claude-code:unrecognized_model]` notice on Gemini models, and your key's spend goes up (see "See your own spend and limits" above). `/mcp` still lists your claude.ai connectors in both kinds of session. If in doubt, quit and start again with the command you want.

Things you'll notice:

- On Gemini models, Claude Code prints a `[claude-code:unrecognized_model]` notice. It's only a notice; replies and tool use (editing files, running commands) work.
- In header mode, Claude Code still sends your claude.ai sign-in token to the gateway. The gateway ignores it and bills your gateway key. Request headers are not written to the gateway's service logs.
- **If Claude Code just sits there and never answers,** the key is almost always missing or mistyped: with a bad key in the header, Claude Code keeps retrying quietly instead of printing an error. Check the key with the "See your own spend and limits" command above. A good key returns your key's details; a bad one returns an error. In a new terminal, make sure `echo $UCR_AI_GATEWAY_KEY` prints something.
- Your key's limits apply to this session. Which one you hit:
  - Per-minute limits (tokens, requests, requests at once): a `429` error. Claude Code slows down and retries on its own.
  - Daily dollar cap: a `422` "Key over 24h budget" error until the 24-hour window resets.
  - Monthly dollar cap, or your lab's monthly allowance: a budget error until the 1st of the month (00:00 UTC). A lab stop affects everyone in the lab.
- If you don't use a claude.ai login at all, `ANTHROPIC_AUTH_TOKEN` in place of the header line also works; you just have no connectors to keep.

**Codex CLI** (any model). Add this to `~/.codex/config.toml`:

```toml
model = "gemini-3.8-flash"
model_provider = "ucr"

[model_providers.ucr]
name = "UCR AI Gateway"
base_url = "https://ucr-ursa-major-ai-gateway-service-575977597413.us-central1.run.app/v1"
env_key = "UCR_AI_GATEWAY_KEY"
wire_api = "responses"
```

Codex prints "Model metadata not found" for non-OpenAI models. It still works. For Claude models, add `-c web_search="disabled"` to the command (see the table below).

**Gemini CLI** (choose "Use Gemini API Key"):

```bash
export GOOGLE_GEMINI_BASE_URL=https://ucr-ursa-major-ai-gateway-service-575977597413.us-central1.run.app
export GEMINI_API_KEY=$UCR_AI_GATEWAY_KEY
gemini -m gemini-3.8-flash
```

If you also have `GOOGLE_API_KEY` set, Gemini CLI prefers it; unset it first.

**OpenCode.** Add this to `opencode.json` (or `~/.config/opencode/opencode.json`), then run `opencode` and pick the model:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "ucr": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "UCR AI Gateway",
      "options": { "baseURL": "https://ucr-ursa-major-ai-gateway-service-575977597413.us-central1.run.app/v1", "apiKey": "{env:UCR_AI_GATEWAY_KEY}" },
      "models": { "gemini-3.8-flash": {}, "claude-sonnet-5-5": {} }
    }
  }
}
```

**Other OpenAI-compatible tools:** use the base URL above (with `/v1`) and your key.

| Tool | Gemini models | Claude models | Notes |
| :--- | :--- | :--- | :--- |
| Claude Code | works (unrecognized-model notice only) | works | Use the header setup to keep claude.ai connectors; set the `ANTHROPIC_DEFAULT_*_MODEL` lines on a Gemini-only key |
| Codex CLI | works | works with `-c web_search="disabled"` | Without it, Claude calls fail with a 400 about `web_search` (the gateway's Google Cloud policy does not allow Claude's web search) |
| Gemini CLI | works | not applicable | Wrong key gives a 401 |
| OpenCode | works | works | |

### 3. Pick a model

| Model | Good for |
| :--- | :--- |
| `gemini-3.8-flash` | Fast, low-cost general model; the sensible default |
| `gemini-2.5-flash-lite` | Cheapest; bulk classification, extraction, short summaries |
| `gemini-2.5-pro` | Deeper reasoning than Flash, at a higher price |
| `gemini-embedding-001` | Embeddings for search and retrieval |

Model choice is the biggest cost lever: Flash models cost a fraction of Pro, and agent tools that make many calls add up quickly. If you also plug in aigw (step 1 for PIs works for members too, once Research Computing adds you to the sign-in list), ask it "Which models can I use, and what do they cost?" or "What would a million input tokens on gemini-3.8-flash cost?" Your key also lists its models at `/v1/models`. If you need a model that is not listed, ask Research Computing.

## Rules

* **Data: UC protection levels P1 (public) and P2 (internal) only.** Never send P3 or P4 data to the gateway. P3 and P4 include identifiable health information, student records, government ID numbers, financial account numbers, export-controlled data and CUI.
* **Your key is yours.** Never put it in code, a repository, chat, email or a shared file, and never share it.
* **If a key leaks,** report it at once: ask your agent to "report my key as leaked" (it is blocked immediately), or email research-computing@ucr.edu.
* **UCR work only.** Use follows UC policy, including the Electronic Communications Policy and IS-3. Research Computing may block a key at any time to protect the service.
* **Access depends on the pilot.** Allowances, models and terms can change as the pilot develops.

## If you get stuck

| Symptom | Fix |
| :--- | :--- |
| 401 from the gateway | The key is wrong, blocked or expired; check it with the `/key/info` call above, then ask your PI |
| 400 or 401 naming a model | Your key does not include that model; pick one from the table above |
| A "budget exceeded" error | You hit your daily or monthly cap; it resets, or ask your PI to raise it |
| 429 "rate limit" errors | Too many requests or tokens per minute for your key or your lab; wait a minute or slow your script, or ask your PI to raise the key's limits |
| The claim link says it was issued to someone else | Sign in with the NetID account the link names; ask your PI if it is not yours |
| The claim link has expired | Links last 72 hours; ask your PI to issue a new one |
| aigw sign-in refuses you | You are not on the sign-in list yet; ask Research Computing |
| Your agent shows no aigw tools | Start a new session after adding aigw |

## Getting help

research-computing@ucr.edu. Include your NetID, your lab, and the time and error message if something failed. Never include your key.
