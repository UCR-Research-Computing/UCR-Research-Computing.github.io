---
title: "Choosing a model on the UCR AI gateway (and keeping agent costs down)"
topic: Cloud
description: "Which gateway model to use for what: a capability ranking from independent benchmarks, picks by job, and how to cut the cost of long AI agent sessions without giving up quality."
audience: "PIs and members of labs onboarded to the UCR AI gateway pilot"
reviewed: 2026-11-10
owner: Research Computing
unlisted: true
sitemap: false
review_notes:
  - "Companion to the unlisted AI gateway lab guide; unlisted for the same reason (pilot, shared by link with onboarded labs). Make it listed with the lab guide when the gateway opens more widely."
  - "Model list read live from the gateway admin server (aigw_models) on 2026-11-10. Capability scores are the Artificial Analysis Intelligence Index v5 as read from artificialanalysis.ai on 2026-11-10 (leaderboard and per-model pages). NRP model identities and scores come from the NRP Available Models page (last updated 2026-10-26), whose scores were read from Artificial Analysis on an earlier index version; they are shown as approximate. Per-category strengths (math, knowledge, coding) are from llmbenchmark.ai, read 2026-11-10."
  - "Prices are deliberately not printed (they change); only price ratios between models are given, computed from aigw_models on 2026-11-10. Gemini 4 Argon's announced price rise on 2026-12-01 is noted without figures."
  - "The cost breakdown for agent sessions comes from one heavy pilot user's 30 days of gateway usage (2026-10-12 to 2026-11-10): about 13 billion input tokens against 84 million output tokens, 93 percent of input served from the prompt cache. Shown as proportions only."
  - "Hermes Agent compression settings checked against the Hermes source (agent/context_compressor.py) and configuration docs on 2026-11-10: compression.threshold is a fraction of the context window (default 0.50) and compression.threshold_tokens is an optional absolute cap; the lower of the two wins. CHECK: the before/after cost effect of a 200K cap has not yet been measured on the gateway."
  - "CHECK: nrp-gemma4-12b, nrp-gemma4-small, nrp-gemma-small-e4b and nrp-minimax-m2 are listed by the gateway but not on NRP's current catalog page; not yet tested whether they answer or fall back. They are left out of the tables until checked."
---

This page helps you pick the right model for the job on the UCR AI gateway, and shows how to keep long AI agent sessions affordable. It is a companion to the [AI gateway lab guide](../ai-gateway-lab-guide/), which covers keys, caps and setup.

Which models your key carries depends on your lab: every key has the Gemini models, some keys also carry Anthropic's Claude models, and the open-weight models hosted on the National Research Platform (NRP) are on some keys while they are tested. Ask your agent (with aigw plugged in) "Which models can I use, and what do they cost?" for the current list and prices, or call `/v1/models` with your key.

## The short answer

| Job | Use | Why |
| :--- | :--- | :--- |
| The hardest reasoning, long agent sessions, careful drafting | `claude-opus-5-5` | Most capable model on the gateway; also the most expensive |
| Strong coding and analysis at about half Opus's price | `claude-sonnet-5-5` | Close to Opus on benchmarks for much less |
| Math, science, broad knowledge, very large documents | `gemini-4-argon` | Google's flagship; top marks on math and knowledge; 1M-token context |
| A sensible everyday default | `gemini-3.8-flash` | Fast and inexpensive, good with tools |
| Bulk work that still needs some judgment | `claude-haiku-5-5` | Very cheap and smarter than many older flagships |
| The cheapest bulk work (classify, extract, summarize) | `gemini-3.5-flash-lite` | Lowest price for simple tasks |
| Free coding agent or long documents (if your key has NRP models) | `nrp-glm-5`, `nrp-deepseek-v4-flash` | Best of the open-weight models; no per-token charge to your allowance |
| Speech to text | `nrp-gemma-small` | The only model on the gateway that takes audio |
| Search and retrieval (RAG) | `gemini-embedding-001` or `nrp-qwen3-embedding` | Embedding models, not chat |

Benchmarks rank models on somebody else's tasks. Use the tables to shortlist two or three models, then try them on your own prompts.

## How the models compare

The capability column is the [Artificial Analysis Intelligence Index](https://artificialanalysis.ai/leaderboards/models), an independent composite of reasoning, knowledge, coding, long-context and agentic tool-use tests that Artificial Analysis runs itself. Higher is better. For scale: the best model anywhere scored 65 in November 2026, and the median model about 24. Scores are at each model's highest reasoning setting. Scores marked "~" come from an earlier version of the index and are approximate; "n/s" means not scored on the current index.

The price column compares output price per token to `gemini-3.8-flash` (1x). Input and cached-input prices follow roughly the same order.

### Most capable

| Model | Capability | Price vs Flash | Best for |
| :--- | :---: | :---: | :--- |
| `claude-opus-5-5` | 59 | about 5x | Hardest reasoning, long agent sessions, high-stakes writing. Leads Artificial Analysis's real-world knowledge-work test (GDPval-AA). |
| `claude-sonnet-5-5` | 55 | about 2.7x | The best value for serious coding and analysis. |
| `gemini-4-argon` | 50 | about 2.7x | Math, science and broad knowledge; very large documents. Google has announced a price increase from 2026-12-01. |

### Strong and inexpensive, or free

| Model | Capability | Price vs Flash | Best for |
| :--- | :---: | :---: | :--- |
| `claude-haiku-5-5` | 36 | about 0.13x | High-volume work that still needs judgment; sub-tasks inside agents. |
| `nrp-deepseek-v4-flash` | ~33 | none | Best open-weight model on the gateway: 1M context, image input, whole-repository and long-document work. |
| `nrp-glm-5` | ~32 | none | Best open-weight coding agent (top terminal-coding score on NRP). Text only. |
| `nrp-qwen3` | ~29 | none | General workhorse with image and video input and a 1M context. Reasoning effort can be turned down. |
| `gemini-3.8-flash` | 31 | 1x | Everyday chat, tool calls and scripts; the gateway default. |

### Everyday, bulk and specialty

| Model | Capability | Price vs Flash | Best for |
| :--- | :---: | :---: | :--- |
| `nrp-qwen3-small` | ~20 | none | Small, quick model with image and video input. |
| `nrp-kimi` | ~19 | none | Kimi K2.7 Code: coding agents and screenshot-to-code. |
| `gemini-3.5-flash-lite` | 12 | about 0.7x | Cheapest Gemini for classification, extraction and short summaries. |
| `nrp-gemma-small` | ~10 | none | Audio transcription and speech-to-text; light image and video tasks. |
| `nrp-gemma` | ~4 to 10 | none | Image and video questions; light assistant work. |
| `nrp-gpt-oss` | 4 | none | Stable, pinnable model for reproducible research pipelines and large batch runs. |
| `gpt-oss-120b`, `gpt-oss-20b` | 4, n/s | about 0.1x | The same open weights hosted by Google. Not for agent tools that force a tool choice (OpenCode). |

### Older models still on the list

`claude-opus-5`, `claude-sonnet-5`, `gemini-3.1-pro-preview`, `gemini-3.7-flash`, `gemini-3.6-flash`, `gemini-3.5-flash`, `gemini-2.5-pro`, `gemini-2.5-flash` and `gemini-2.5-flash-lite` still work, but a newer model on this page does the same job better, and in several cases for the same price or less (`claude-opus-5` costs more than `claude-opus-5-5`; `claude-sonnet-5` costs the same as `claude-sonnet-5-5`). Use the newer one for new work.

### Not chat models

`gemini-embedding-001`, `text-embedding-004`, `text-multilingual-embedding-002` and `nrp-qwen3-embedding` make embeddings for search and retrieval (`nrp-qwen3-embedding` also embeds images and video). `gemini-2.5-flash-image` generates and edits images.

### About the NRP models

The `nrp-` models run on the National Research Platform's GPUs, not Google's, and cost nothing against your allowance. They are on some keys while they are tested. They share rate limits with everyone using them, NRP marks most of them as evaluating (their setup can change without notice), and they run at reduced numeric precision, which can move scores a point or two. The same data rule applies: P1 and P2 only. For anything that must stay stable, name a specific model and keep a fallback.

## Keeping AI agent sessions affordable

AI agents (Hermes Agent, Claude Code, OpenCode, Codex and others) call the model again for every step: every tool call, every file read, every retry. Each call resends the whole conversation so far. That changes what drives the bill.

### Where the money goes

In one heavy pilot user's month of daily agent work on `claude-opus-5-5`, input outweighed output by more than 150 to 1: each request carried, on average, about 178,000 tokens of conversation and wrote only about 1,100. The gateway's prompt cache served 93 percent of that input at a tenth of the normal price, which is the only reason the month was affordable at all. Even so, **more than two thirds of the spend was the model re-reading cached conversation**, not writing answers.

So for agent work, the length of the conversation you carry matters as much as which model you pick.

### What to do, biggest saving first

1. **Keep the conversation short.** Most agents compress (summarize) older turns once the conversation passes a size limit. On a model with a 1M-token window, the default limit can be very large, so every step near the end of a long session resends hundreds of thousands of tokens. Lower the limit to around 150,000 to 200,000 tokens. Your standing instructions, memory and skills are loaded fresh each turn, so they are not lost; older turns are summarized rather than kept word for word.
2. **Start a new session for each new task.** Carrying a finished task's history into an unrelated one costs money on every step and adds noise. In most agents this is `/new` or `/clear`.
3. **Match the model to the stretch of work.** Use `claude-opus-5-5` for planning, judgment and writing that matters; switch to `claude-sonnet-5-5` (about 2.5 times cheaper per cached token) for routine stretches such as running commands, moving files and repetitive edits; switch back when it matters again. Many agents switch mid-session with `/model`.
4. **Use cheap models for helper jobs.** Point the agent's background tasks (summarizing, titles, image description, sub-agents) at `gemini-3.8-flash` or `claude-haiku-5-5` rather than your main model.
5. **Turn reasoning effort down for simple work.** Reasoning models think before answering, and thinking is billed as output. Several models default to their highest setting; a lower setting answers simple prompts faster and for less.

### Example: Hermes Agent

These settings go in `~/.hermes/config.yaml`; start a new session after changing them.

```yaml
model:
  default: claude-opus-5-5        # your main model
  provider: custom:ucr-gateway

compression:
  enabled: true
  threshold: 0.50                 # fraction of the context window (default)
  threshold_tokens: 200000        # absolute cap: compress by 200K tokens at the latest

auxiliary:                        # helper jobs on a cheap model
  compression:
    provider: ucr-gateway
    model: gemini-3.8-flash
  title_generation:
    provider: ucr-gateway
    model: gemini-3.8-flash
  vision:
    provider: ucr-gateway
    model: gemini-3.8-flash

delegation:                       # sub-agents
  provider: ucr-gateway
  model: gemini-3.8-flash
```

Compression starts at whichever comes first, the `threshold` fraction of the model's window or the `threshold_tokens` cap, and the cap still applies after you switch models. In a session, `/model claude-sonnet-5-5` switches the main model and `/new` starts fresh. See the [Hermes configuration guide](https://hermes-agent.nousresearch.com/docs/user-guide/configuration) for every compression setting.

### Watch the effect

Ask your agent, with aigw plugged in, "Show my gateway spend for the last 7 days by model, with the cache hit rate." Compare a week before and a week after a change. The `/key/info` call in the lab guide also shows your key's spend so far.

## Rules

The lab guide's rules apply to every model on this page: P1 and P2 data only, your key is yours, and report a leaked key at once. See [Rules](../ai-gateway-lab-guide/#rules).

## Getting help

research-computing@ucr.edu. Tell us which model and tool you are using and what you are trying to do; we can suggest a setup. Never include your key.
