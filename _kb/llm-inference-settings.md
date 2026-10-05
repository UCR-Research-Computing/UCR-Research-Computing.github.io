---
title: "LLM Inference Settings"
topic: Cloud
owner: Research Computing
reviewed: 2026-10-04
redirect_from:
  - /Knowledge_Base/llm-inference-settings.html
review_notes:
  - "Corrected Maximum Tokens: in most tools it limits the length of the response, while the context window limits prompt plus response. Noted that a fixed seed makes output repeatable only with identical settings, model version and software."
  - "Corrected the temperature range (many tools allow values above 1), removed the reference to an image from an old blog post and the claim that Top K 40 improves efficiency, and added headings."
  - "Added where these settings appear (campus AI tools at its.ucr.edu/ai, the Ollama guide)."
---

Language models have a few generation settings that change how they write: Seed, Maximum Tokens, Temperature, Top P and Top K. Adjusting them can make output more repeatable, more focused or more varied. This article explains each one and gives an example combination.

Names, ranges and defaults differ between tools and model providers. Check the documentation of the tool you use. You will find these settings in model APIs, in local tools such as [Ollama](../ollama-how-to/), and in some campus AI tools (see [UCR AI tools](https://its.ucr.edu/ai)).

## Seed

The seed initializes the random number generator the model uses when it samples the next token.

- **Fixed seed:** with the same prompt, settings, model version and software, a fixed seed usually gives the same or very similar output. This helps when testing and comparing prompts. Some services do not support seeds, or treat them as best effort, and results can still change after a model or software update.
- **No seed (random):** each run uses a different random sequence, so the output varies from run to run.

## Maximum Tokens

Maximum Tokens limits how many tokens the model may generate in its response. A token is a word or part of a word.

This is separate from the model's **context window**, which limits the total of prompt plus response. A long prompt leaves less room in the context window for the response.

- Set too low, responses are cut off mid-sentence.
- Set high, long responses are allowed. They take longer to generate and, on paid services, cost more.

Pick a limit that fits the length of answer you need.

## Temperature

Temperature controls how random the choice of the next token is.

- **Low (close to 0):** the model nearly always picks the most likely token. Output is focused, predictable and repetitive across runs.
- **Higher (around 1):** less likely tokens are chosen more often. Output is more varied and creative but can drift off topic or become less coherent.

Many tools accept values above 1, which makes output more random still. Very high values often produce nonsense. A higher temperature does not make a model more accurate; for factual work, keep it low and still check the output, since a model can state wrong information at any temperature.

## Top P (nucleus sampling)

At each step the model assigns a probability to every possible next token. Top P keeps only the smallest set of the most likely tokens whose combined probability reaches P, and samples from that set.

- **Higher Top P** (for example 0.95): more tokens are considered, so output is more diverse.
- **Lower Top P** (for example 0.5): only the most likely tokens are considered, so output is more predictable.

Unlike Top K, the number of tokens considered changes from step to step, depending on how spread out the probabilities are.

## Top K

Top K limits the choice of next token to the K most likely tokens. For example, with K set to 40, the model samples only from the 40 most likely tokens at each step.

- **Smaller K:** more predictable text.
- **Larger K:** more variety.

When Top K and Top P are both set, most tools apply both filters. Some tools ignore Top K or do not offer it.

## Example combination

Seed = 10, Maximum Tokens = 2048, Temperature = 0.2, Top P = 0.8 and Top K = 40 is a setting that leans toward predictable, focused output while allowing some variety.

- **Seed = 10:** makes runs repeatable, which is handy for testing and comparing model behavior.
- **Maximum Tokens = 2048:** allows fairly long responses such as reports or detailed explanations. Longer responses take more time to generate.
- **Temperature = 0.2:** keeps the output focused and consistent. Suits technical writing, code and short factual answers.
- **Top P = 0.8:** samples from the tokens that make up 80% of the probability, allowing moderate variety while keeping the text coherent.
- **Top K = 40:** removes very unlikely tokens, which helps keep the text on topic.

For brainstorming or creative writing, try a higher temperature (for example 0.8 to 1.0) and a higher Top P.
