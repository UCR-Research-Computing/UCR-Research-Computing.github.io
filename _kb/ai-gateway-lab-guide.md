---
title: "Using the UCR AI gateway: a guide for lab PIs and members"
topic: Cloud
description: "Run your lab's access to AI models: add members, give each one a capped key by claim link, and see what the lab spends. Then use your key from Python, curl, Claude Code or Gemini CLI."
audience: "PIs and members of labs onboarded to the UCR AI gateway pilot"
reviewed: 2026-10-08
owner: Research Computing
unlisted: true
sitemap: false
review_notes:
  - "Unlisted on purpose (2026-10-08): the AI gateway is a pilot open to labs Research Computing has onboarded, so this page is shared by link with those labs and is kept out of the KB index, related guides, site search and the sitemap, with noindex. Make it a listed, numbered article when the gateway opens more widely."
  - "Tool names, roles, key policy (90-day expiry, daily cap of 30 percent of the monthly cap, Opus models by approval) and terms of use follow the gateway admin server (aigw v0.5.1) as read live on 2026-10-08. Client setups come from aigw_client_setup, tested 2026-10-01."
  - "Prices are deliberately not printed here: they change, and aigw_models shows the current price of every model."
  - "CHECK: the PI walkthrough (sign in, add a member, issue a key) follows the live tool definitions; the first faculty PI had not yet run it end to end when this was written."
---

The UCR AI gateway is a Research Computing service, now in pilot, that gives labs access to AI models (Google Gemini, Anthropic Claude on Google Cloud, open-weight models and embeddings) through one endpoint and one key per person. Each lab has a monthly allowance. The lab's PI decides who is in the lab, what each person may spend, and who holds a key, without filing a ticket.

**Printable version:** [AI gateway quick start (PDF, 2 pages, Letter)](../../assets/documents/ai-gateway-quick-start.pdf).

This page has two parts: [for PIs](#for-pis-run-your-lab) and [for lab members](#for-lab-members-collect-and-use-your-key).

## How it works

* **A lab** has a PI, a monthly allowance that resets on the 1st, and members.
* **Each member** can have their own monthly cap inside the lab's allowance.
* **Each person gets their own key**, delivered by a one-time claim link. The link holds no key and works only for the person it names, for 72 hours. The key is created when they open the link, sign in with their own UCR Google account and accept the terms of use, and it is shown to them once.
* **Every key** expires after 90 days, has a daily cap of 30 percent of its monthly cap, and leaves out the most expensive models (Claude Opus 5 and 5.5) unless the PI approves them on that key.
* **The gateway records usage** (who, which model, tokens and cost), not the text of prompts or answers.

Everyone is identified by their UCR NetID account (for example `jdoe001@ucr.edu`). Use NetIDs when you add people; the gateway resolves other UCR addresses to the NetID account.

## For PIs: run your lab

You run your lab through **aigw**, the gateway's admin server, from an AI assistant that supports MCP (Hermes Agent, Claude Code, Gemini CLI and others). You ask in plain language; the assistant calls the tools. Research Computing creates your lab and adds you to the sign-in list first.

### 1. Connect your assistant (5 min)

Pick one:

```bash
# Hermes Agent (run on its own in a terminal, then restart Hermes)
hermes mcp add aigw --url https://ai-gateway-mcp-575977597413.us-central1.run.app/mcp --auth oauth

# Claude Code (then type /mcp inside Claude Code to sign in)
claude mcp add --transport http aigw https://ai-gateway-mcp-575977597413.us-central1.run.app/mcp

# Gemini CLI
gemini mcp add -s user -t http aigw https://ai-gateway-mcp-575977597413.us-central1.run.app/mcp
```

A browser opens once. Sign in with your UCR NetID account. Then ask:

> Who am I on the AI gateway?

**Check:** it shows your NetID, your lab, and your role in it as PI.

### 2. Add your students

> Add jdoe001 to my lab with a monthly cap of 50 dollars.

The assistant shows the person's directory name back so you can confirm it is the right person. A member without a cap can spend up to the whole lab allowance, so give everyone a cap.

### 3. Give each student a key

> Issue a key to jdoe001.

Changes that create keys or remove people are two-step: the assistant shows a plan first, and nothing happens until you confirm. You get a claim link and a short message to paste into an email to the student. Send it from your UCR email.

### 4. Watch spending and adjust

| You say | aigw does |
| :--- | :--- |
| "Show my lab." | Allowance, spent this month, reset date, every member with cap and spend |
| "What did my lab spend in the last 30 days?" | Spend by member, by model and by day |
| "Set jdoe001's cap to 100 dollars." | Changes the member's cap (never above the allowance) |
| "Which claims are still open?" | Claim links not yet collected, and when they expire |
| "Block jdoe001's key." | Refuses that key at once; unblock undoes it |
| "Remove jdoe001 from my lab." | Takes access away; history is kept |
| "Make jsmith002 a delegate." | A delegate can add members and issue keys for you |
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

**Claude Code** (Claude models only; note the base URL has no `/v1`):

```bash
export ANTHROPIC_BASE_URL=https://ucr-ursa-major-ai-gateway-service-575977597413.us-central1.run.app
export ANTHROPIC_AUTH_TOKEN=$UCR_AI_GATEWAY_KEY
export ANTHROPIC_MODEL=claude-sonnet-5
export ANTHROPIC_DEFAULT_SONNET_MODEL=claude-sonnet-5 ANTHROPIC_DEFAULT_HAIKU_MODEL=claude-sonnet-5
claude
```

**Gemini CLI** (Gemini models only; choose "Use Gemini API Key"):

```bash
export GOOGLE_GEMINI_BASE_URL=https://ucr-ursa-major-ai-gateway-service-575977597413.us-central1.run.app
export GEMINI_API_KEY=$UCR_AI_GATEWAY_KEY
gemini
```

**OpenCode and other OpenAI-compatible tools:** use the base URL above (with `/v1`) and your key.

### 3. Pick a model

| Model | Good for |
| :--- | :--- |
| `gemini-3.8-flash` | Fast, low-cost general model; the sensible default |
| `gemini-2.5-flash-lite` | Cheapest; bulk classification, extraction, short summaries |
| `gemini-2.5-pro` | Deeper reasoning than Flash, at a higher price |
| `claude-sonnet-5` | Strong coding and analysis |
| `gpt-oss-120b` | Low-cost open-weight model (not for agent tools that send `tool_choice`) |
| `gemini-embedding-001` | Embeddings for search and retrieval |

Model choice is the biggest cost lever: Flash models cost a small fraction of Claude, and a Claude agent session can spend tens of dollars an hour. If you also connect aigw (step 1 for PIs works for members too, once Research Computing adds you to the sign-in list), ask it "Which models can I use, and what do they cost?" or "What would a million input tokens on gemini-3.8-flash cost?"

## Rules

* **Data: UC protection levels P1 (public) and P2 (internal) only.** P3 and P4 data are not allowed unless UCR's Information Security Office has approved that specific use in writing. P3 and P4 include identifiable health information, student records, government ID numbers, financial account numbers, export-controlled data and CUI.
* **Your key is yours.** Never put it in code, a repository, chat, email or a shared file, and never share it.
* **If a key leaks,** report it at once: ask your assistant to "report my key as leaked" (it is blocked immediately), or email research-computing@ucr.edu.
* **UCR work only.** Use follows UC policy, including the Electronic Communications Policy and IS-3. Research Computing may block a key at any time to protect the service.
* **Access depends on the pilot.** Allowances, models and terms can change as the pilot develops.

## If you get stuck

| Symptom | Fix |
| :--- | :--- |
| 401 from the gateway | The key is wrong, blocked or expired; check it with the `/key/info` call above, then ask your PI |
| 400 or 401 naming a model | Your key does not include that model (Opus needs PI approval); pick another |
| A "budget exceeded" error | You hit your daily or monthly cap; it resets, or ask your PI to raise it |
| The claim link says it was issued to someone else | Sign in with the NetID account the link names; ask your PI if it is not yours |
| The claim link has expired | Links last 72 hours; ask your PI to issue a new one |
| aigw sign-in refuses you | You are not on the sign-in list yet; ask Research Computing |
| Your assistant shows no aigw tools | Start a new session after adding aigw |

## Getting help

research-computing@ucr.edu. Include your NetID, your lab, and the time and error message if something failed. Never include your key.
