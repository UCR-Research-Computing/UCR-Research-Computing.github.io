---
title: "Using the NRP's hosted large language models"
kb_id: KB028
topic: National
audience: "UCR researchers, students and instructors in any discipline who want to chat with, script against or build on open-weights AI models hosted by the National Research Platform"
reviewed: 2026-10-06
owner: Research Computing
series: nautilus
series_order: 6
review_notes:
  - "Written 2026-10-06 from the NRP documentation (nrp.ai/documentation, fetched 2026-10-06) and tests run in a UCR namespace the same day."
  - "Tested 2026-10-06: a gpt-oss chat call answered a sentiment-classification prompt in 2.3 s; qwen3-embedding returned 4096-dimension vectors; 'drought tolerance in citrus' scored 0.70 cosine similarity with 'water stress in orange trees' and 0.29 with 'quantum error correction'."
  - "The model table in section 5 and the fair-use figures in section 9 are copied from the NRP Available Models and Fair Use pages (both last updated Sep 10, 2026). The catalog rotates; re-check both pages at each review."
  - "CHECK: how a group gets the LLM flag. The NRP docs say groups can have the LLM Proxy capability and that membership is shown on the namespaces page, but do not describe the request step; the article tells readers to ask their namespace admin or Nautilus Support."
  - "CHECK: the image-input example (section 7.3), the batch Job (section 7.5) and the retry loop (section 9) follow the OpenAI client conventions and the NRP pages, but were not themselves run on 2026-10-06."
  - "CHECK: the audio-input request format for gemma-small is not documented on the NRP pages; the article names the capability only and does not give an example."
  - "CHECK: the direct URLs of NRP Open WebUI and the LLM Status page were not in the docs dump; the article links the NRP pages that link to them."
---

## 1. What the NRP offers

The National Research Platform (NRP) runs a rotating catalog of **open-weights large language models** (LLMs) on GPUs in the Nautilus cluster. You can use them two ways ([NRP-Managed LLMs](https://nrp.ai/documentation/userdocs/ai/llm-managed/)):

* **In a browser or desktop chat app**, much like ChatGPT, with no code. The NRP hosts an Open WebUI site, and the same models work in desktop apps such as Cherry Studio and Chatbox.
* **From your own code**, through an **OpenAI-compatible API** at `https://ellm.nrp-nautilus.io/v1`. Anything that speaks the OpenAI API (the `openai` Python package, `curl`, R packages, coding assistants, notebook plugins) can point at it by changing the base URL and the key.

The catalog covers general chat and reasoning models, models that read images and video, one that accepts audio, and an **embedding model** that turns text (or images) into vectors for semantic search. Models are added and retired as better open models appear, so this article teaches the pattern and points you to the NRP pages for the current list.

UCR does not recharge for NRP use. The NRP applies its own fair-use rules to the models (Section 9).

### Two rules before you send a single prompt

1. **Prompts are data, and Nautilus is for non-sensitive data only.** Everything you type or upload is sent to NRP servers. Treat it as P1 (public or non-sensitive). Do not send protected data: HIPAA, FERPA, PII, FISMA or CUI, interview transcripts with personal details, student records, or anything under a data-use agreement. For P2 and higher work, talk to Research Computing about the [HPCC](../../services/hpcc/), [Ursa Major](../../services/ursa-major/) or the [Secure Enclave](../../services/secure-enclave/).
2. **Non-profit, non-commercial use only.** The NRP is non-profit and non-commercial, and all use of the cluster, including the LLMs, must be too ([Fair Use Policy](https://nrp.ai/documentation/userdocs/ai/llm-managed/fair-use/)).

For campus-wide AI tools and UCR guidance on using AI, see [ITS: AI at UCR](https://its.ucr.edu/ai). For AI research support, see [RAISE](https://raise.ucr.edu/).

---

## 2. Ways researchers use the hosted models

Each scenario assumes the text or images are public or otherwise non-sensitive.

| If you want to | Use | Section |
| :--- | :--- | :--- |
| Try a model, draft text, explain code, summarize a public paper | Open WebUI or a desktop chat app | 4 |
| Label or code thousands of documents (stance, topic, sentiment, genre) | A chat model through the API, in a script | 7.1 |
| Find passages by meaning across a large archive | The embedding model, plus a vector index | 7.2 |
| Describe images, read figures or scanned pages | A multimodal model (image input) | 7.3 |
| Get help writing code in VS Code or a terminal assistant | A coding-strong model through a client config | 7.4 |
| Process a whole corpus overnight without your laptop | A Kubernetes Job on Nautilus that calls the API | 7.5 |
| Ground answers in your own documents (retrieval-augmented generation) | Embeddings plus the NRP-managed Milvus vector database | 7.6 |
| Give a class or workshop its own keys | A training join link | 7.7 |

A few concrete examples:

* **History.** Embed 40,000 public-domain newspaper articles and search for "disputes over irrigation water" to find articles that never use the words "water rights".
* **Political science.** Hand-code 500 public bill summaries, have a model code 200,000 more, and report agreement between the model and your coders.
* **Linguistics.** Ask a model to tag discourse markers in a public corpus, then compare its tags with an annotated gold standard.
* **Entomology or plant pathology.** Ask a multimodal model to describe what it sees in field photos, as a first pass before expert review.
* **Engineering and CS.** Point a coding assistant at the NRP's coding-strong models while you write simulation or analysis code.
* **Library and archives.** Draft first-pass descriptions for a finding aid, then edit them by hand.

In every case, a model's output is a draft or a measurement to be checked, not a finding on its own. Plan a validation step (a hand-coded sample, an expert review, an agreement statistic) into the design.

---

## 3. Getting access and your token

### What you need

* **An NRP account and namespace membership.** [KB024](../kb024-nautilus-getting-access/) walks through signing in at nrp.ai with your UCR account (through CILogon) and getting added to a namespace.
* **Membership of a group with the LLM flag.** API access needs this ([API Access](https://nrp.ai/documentation/userdocs/ai/llm-managed/api-access/)). Your memberships are listed on the [namespaces page](https://nrp.ai/namespaces). If your group does not have LLM access, ask your namespace admin; if they are not sure how, ask in Nautilus Support.

### Create a token

1. Sign in to nrp.ai.
2. Open the LLM token page: [https://nrp.ai/llmtoken](https://nrp.ai/llmtoken).
3. Create a token and copy it. The same page can also generate a ready-made configuration for the Chatbox app.

### Keep the token private

The token is tied to you. Anything sent with it counts against your fair-use limits, and the NRP holds you responsible for it.

* **Never paste it into code, a notebook you share, a Git repository or a Kubernetes spec.** Job and Deployment specs on Nautilus are visible to other cluster users.
* On your own computer, keep it in an environment variable. In a terminal, `read -s` prompts for it without echoing it or saving it in your shell history:

```bash
read -s -p "NRP LLM token: " OPENAI_API_KEY && export OPENAI_API_KEY
export OPENAI_BASE_URL="https://ellm.nrp-nautilus.io/v1"
```

* On Nautilus, store it in a **Kubernetes Secret** (Section 7.5).
* If a token leaks, delete it on the token page and create a new one.

---

## 4. Chatting in the browser or a desktop app

No code is needed for these. All are described on the NRP [Chat Interfaces](https://nrp.ai/documentation/userdocs/ai/llm-managed/chat-interfaces/) page.

* **NRP Open WebUI** is the most full-featured option: a ChatGPT-style site for every NRP-hosted model. It is the quickest way to try several models on the same prompt before you write a script.
* **Cherry Studio** (desktop app). In Settings, then Model Provider, add a provider of type OpenAI, enter your token and the API host `https://ellm.nrp-nautilus.io/v1`, then fetch the model list.
* **Chatbox** (desktop or web). Generate the Chatbox configuration on the [token page](https://nrp.ai/llmtoken), then in Chatbox go to Settings, then Model Provider, and choose Import from clipboard.

**Leave "Max Tokens" or "Max Output Tokens" empty** in these apps unless you know what it does. It caps the length of the answer, not the size of the conversation, and setting it to the model's full context length makes requests fail. If an app insists on a value, the NRP suggests roughly a third to a quarter of the context window ([API Access](https://nrp.ai/documentation/userdocs/ai/llm-managed/api-access/)). [LLM Inference Settings](../llm-inference-settings/) explains this and the other common settings.

---

## 5. Choosing a model

The NRP's [Available Models](https://nrp.ai/documentation/userdocs/ai/llm-managed/models/) page has a feature matrix, benchmark charts and a card for each model. This is the catalog as listed on that page (last updated Sep 10, 2026):

| Model name (use this in code) | Status | Context (tokens) | Inputs besides text | Notes from the NRP model card |
| :--- | :--- | :--- | :--- | :--- |
| `qwen3` | main | 1,000,000 | image, video | Flagship; strongest agentic coder in the catalog; reasoning on by default (verbose) |
| `qwen3-small` | main | 1,000,000 | image, video | Compact, lower latency; good when qwen3 is more than you need |
| `gpt-oss` | main | 131,072 | none | General-purpose; the NRP lists it for reproducible research and as an LTS candidate |
| `gemma` | main | 262,144 | image, video | Efficient multimodal assistant |
| `qwen3-embedding` | main | 262,144 | image, video | **Embedding model only**, not for chat |
| `gemma-small` | evaluating | 262,144 | image, video, audio | The only model that accepts audio (speech-to-text) |
| `kimi` | evaluating | 131,072 | image, video | Large coding model |
| `glm-5` | evaluating | 1,048,576 | none | Coding and long-form reasoning; thinking always on |
| `deepseek-v4-flash` | evaluating | 1,048,576 | image | Long documents mixed with figures or scans |
| `minimax-m2` | evaluating | 204,800 | none | Cost-efficient coding |

"Main" means generally supported; "evaluating" means in testing and may change. Get the live list of model names from the API at any time:

```bash
curl -s -H "Authorization: Bearer $OPENAI_API_KEY" https://ellm.nrp-nautilus.io/v1/models
```

### Quick picks

* **Reproducible research pipelines, high-volume labeling:** `gpt-oss`. It is text-only with a smaller context, but the NRP describes it as stable, efficient at high concurrency and pinnable.
* **Hardest reasoning, long documents, images:** `qwen3`.
* **Fast multimodal tasks:** `qwen3-small` or `gemma`.
* **Semantic search, clustering, RAG:** `qwen3-embedding`.
* **Coding assistants:** `qwen3`, `glm-5`, `kimi` or `minimax-m2`, per the NRP overview page.

Benchmarks measure someone else's tasks. The NRP itself suggests using the charts to make a shortlist, then trying the top two or three on your own prompts.

### Reasoning ("thinking") models cost time and tokens

Most models in the catalog reason before answering, and several default to their most thorough setting. For a simple labeling task this is slow and uses many output tokens. The model cards give the per-model switch. For `qwen3`, `qwen3-small`, `gemma` and `gemma-small`, you can turn thinking off in a request with:

```python
extra_body={"chat_template_kwargs": {"enable_thinking": False}}
```

`qwen3` and `qwen3-small` also accept `reasoning_effort="low"` (or `"medium"`). `glm-5` and `deepseek-v4-flash` use different switches, listed on their cards. Check the card before you rely on a setting, because these have changed with model updates ([Lifecycle and changelog](https://nrp.ai/documentation/userdocs/ai/llm-managed/lifecycle/)).

---

## 6. Your first API calls

Install the OpenAI Python package (`pip install openai`) and set `OPENAI_API_KEY` as in Section 3.

### Chat completion (Python)

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["OPENAI_API_KEY"],
    base_url="https://ellm.nrp-nautilus.io/v1",
)

resp = client.chat.completions.create(
    model="gpt-oss",
    messages=[
        {"role": "system", "content": "You are a careful research assistant."},
        {"role": "user", "content": "In two sentences, what is a Kubernetes namespace?"},
    ],
)
print(resp.choices[0].message.content)
```

### Chat completion (curl)

```bash
curl -s https://ellm.nrp-nautilus.io/v1/chat/completions \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-oss",
    "messages": [{"role": "user", "content": "Name three uses of word embeddings in the humanities."}]
  }'
```

### Embeddings (Python)

```python
import math, os
from openai import OpenAI

client = OpenAI(api_key=os.environ["OPENAI_API_KEY"],
                base_url="https://ellm.nrp-nautilus.io/v1")

texts = [
    "drought tolerance in citrus",
    "water stress in orange trees",
    "quantum error correction",
]
vecs = [d.embedding for d in client.embeddings.create(model="qwen3-embedding", input=texts).data]

def cosine(a, b):
    dot = sum(x * y for x, y in zip(a, b))
    return dot / (math.sqrt(sum(x * x for x in a)) * math.sqrt(sum(y * y for y in b)))

print(len(vecs[0]))                 # vector length
print(round(cosine(vecs[0], vecs[1]), 2))
print(round(cosine(vecs[0], vecs[2]), 2))
```

When we ran this in a UCR namespace on 2026-10-06, the vectors had 4,096 dimensions, the two citrus phrases scored about 0.70 and the citrus and quantum phrases about 0.29. The two related phrases share almost no words, which is the point of embeddings: they match on meaning.

### Other languages and tools

Because the API is OpenAI-compatible, most libraries that let you set a base URL work. In R, for example, you can call the endpoint with `httr2`, or use a package that accepts a custom OpenAI base URL. Coding assistants and editors are covered in Section 7.4.

---

## 7. Research recipes

### 7.1 Labeling text at scale (and measuring how well it worked)

*Scenario: a sociologist wants to classify 50,000 public news headlines about housing as supportive, opposed or neutral toward new construction.*

1. **Hand-code a sample first** (a few hundred items, ideally two coders). This is your gold standard.
2. **Write a tight prompt** that lists the allowed labels and asks for the label only.
3. **Validate the output.** Anything that is not an allowed label is flagged, not guessed.
4. **Measure agreement** between the model and your coders (for example, Cohen's kappa) before you run the full set, and report it.

```python
import csv, os
from openai import OpenAI

client = OpenAI(api_key=os.environ["OPENAI_API_KEY"],
                base_url="https://ellm.nrp-nautilus.io/v1")

MODEL = "gpt-oss"
LABELS = {"supportive", "opposed", "neutral"}
SYSTEM = (
    "You label news headlines by their stance toward building new housing. "
    "Answer with exactly one word: supportive, opposed or neutral."
)

def label(headline):
    resp = client.chat.completions.create(
        model=MODEL,
        temperature=0,
        messages=[{"role": "system", "content": SYSTEM},
                  {"role": "user", "content": headline}],
    )
    answer = (resp.choices[0].message.content or "").strip().lower().strip(".")
    return answer if answer in LABELS else "UNPARSED:" + answer[:40]

with open("headlines.csv") as fin, open("labels.csv", "w", newline="") as fout:
    reader = csv.DictReader(fin)              # expects columns: id, headline
    writer = csv.writer(fout)
    writer.writerow(["id", "label", "model"])
    for row in reader:
        writer.writerow([row["id"], label(row["headline"]), MODEL])
```

In our test, a single `gpt-oss` classification call of this kind returned in 2.3 seconds. Time a few hundred of your own items before estimating a full run, and add the retry logic from Section 9 before you leave it running.

Tips:

* Setting `temperature=0` makes answers more consistent from run to run, though not always identical. See [LLM Inference Settings](../llm-inference-settings/).
* Save the model name, the exact prompt and the date with your results. Models are swapped behind the same name over time (Section 8).
* Keep the `UNPARSED` rows. How often the model fails to follow instructions is itself worth reporting.

### 7.2 Searching an archive by meaning

*Scenario: a historian has 40,000 OCR'd pages of public-domain newspapers and wants every article about water rights, including ones that never use the phrase.*

1. Split the text into passages (a few paragraphs each).
2. Send passages to `qwen3-embedding` in batches (pass a list as `input`, as in Section 6) and save each vector next to its passage ID.
3. Embed your question the same way and rank passages by cosine similarity.
4. Read the top results yourself. Use a chat model only to summarize or tag what you have already found.

For a few hundred thousand passages, a NumPy array or a library such as FAISS in a [JupyterHub notebook](../kb025-nautilus-jupyter-and-coder/) is enough. Beyond that, or if several people need to query the same index, use the NRP-managed vector database (Section 7.6). Run the embedding step as a Job (Section 7.5) if it will take hours.

### 7.3 Images, figures and scanned pages

*Scenario: an ecologist wants a first-pass description of 3,000 public camera-trap images; an art historian wants descriptions of digitized public-domain prints.*

Models with image input (`qwen3`, `qwen3-small`, `gemma`, `gemma-small`, `kimi`, `deepseek-v4-flash`) take images as `image_url` parts in the message, as in the OpenAI API ([Lifecycle and changelog](https://nrp.ai/documentation/userdocs/ai/llm-managed/lifecycle/)). A local file can be sent as a base64 data URL:

```python
import base64, os
from openai import OpenAI

client = OpenAI(api_key=os.environ["OPENAI_API_KEY"],
                base_url="https://ellm.nrp-nautilus.io/v1")

with open("trap_0001.jpg", "rb") as f:
    b64 = base64.b64encode(f.read()).decode()

resp = client.chat.completions.create(
    model="qwen3-small",
    messages=[{
        "role": "user",
        "content": [
            {"type": "text", "text": "List the animals visible in this image and how many of each. Say 'none' if there are none."},
            {"type": "image_url", "image_url": {"url": "data:image/jpeg;base64," + b64}},
        ],
    }],
    extra_body={"chat_template_kwargs": {"enable_thinking": False}},
)
print(resp.choices[0].message.content)
```

Treat the output as a triage aid. Models miss small or camouflaged subjects and can describe things that are not there; have an expert check a sample.

`gemma-small` is the one model in the catalog that also accepts **audio** (speech-to-text). It is still marked "evaluating". Ask in the Nautilus AI/ML channel for the current request format before you build on it, and remember that recordings of people speaking are often identifiable data that does not belong on Nautilus.

### 7.4 Coding assistants

The NRP publishes ready-to-paste configurations for VS Code (Copilot Chat custom endpoint), OpenCode, Crush, Kimi CLI, Claude Code, Copilot CLI, pi and oh-my-pi on its [Client Configurations](https://nrp.ai/documentation/userdocs/ai/llm-managed/client-configs/) page. They use the same token. Two details from that page:

* Most tools use the OpenAI-compatible endpoint `https://ellm.nrp-nautilus.io/v1`. Claude Code uses the Anthropic-compatible endpoint `https://ellm.nrp-nautilus.io/anthropic`.
* If a tool asks for a context window, match the model's value from Section 5; if it asks for a maximum output size, keep it well below the context window.

Do not let a coding assistant read files that contain secrets or protected data. It sends what it reads to the model.

### 7.5 Running a large job on Nautilus itself

For anything that runs longer than you want your laptop open, run the script as a **Kubernetes Job** in your namespace ([KB026](../kb026-nautilus-batch-jobs-and-gpus/) covers Jobs). The work is mostly waiting on the API, so the Job needs no GPU and very little CPU.

**Step 1: store the token as a Secret** (from a terminal where `kubectl` works, see [KB024](../kb024-nautilus-getting-access/)):

```bash
read -s -p "NRP LLM token: " TOKEN
kubectl create secret generic nrp-llm -n <your-namespace> --from-literal=token="$TOKEN"
unset TOKEN
```

**Step 2: put your script in a ConfigMap** (for a quick start; for real work, bake it into a container image or keep it on a volume, see [KB027](../kb027-nautilus-storage-and-data/)):

```bash
kubectl create configmap label-script -n <your-namespace> --from-file=label.py
```

**Step 3: run the Job.** Save as `llm-job.yaml`:

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: llm-labeling
spec:
  backoffLimit: 2
  template:
    spec:
      restartPolicy: Never
      containers:
        - name: worker
          image: python:3.12-slim
          command: ["bash", "-c", "pip install --quiet openai && python /scripts/label.py"]
          env:
            - name: OPENAI_BASE_URL
              value: https://ellm.nrp-nautilus.io/v1
            - name: OPENAI_API_KEY
              valueFrom:
                secretKeyRef:
                  name: nrp-llm
                  key: token
          resources:
            requests:
              cpu: "1"
              memory: 2Gi
            limits:
              cpu: "1"
              memory: 2Gi
          volumeMounts:
            - name: scripts
              mountPath: /scripts
      volumes:
        - name: scripts
          configMap:
            name: label-script
```

```bash
kubectl apply -n <your-namespace> -f llm-job.yaml
kubectl logs -n <your-namespace> -f job/llm-labeling
```

Why these settings:

* The token comes from the Secret, so it never appears in the spec.
* Requests of 1 CPU and 2 GB fall under the NRP's exemption from its usage-violation checks, which matters for a pod that mostly waits on the network ([Cluster Policies](https://nrp.ai/documentation/userdocs/start/policies/)). Limits equal requests, which satisfies the rule that limits stay within 20% of requests.
* The command ends when the script ends. Never end a Job with `sleep`; the NRP bans users who do.
* Write results to a persistent volume or S3 as you go, so a restart does not lose finished work ([KB027](../kb027-nautilus-storage-and-data/)).

Splitting a corpus across several workers (an Indexed Job) is covered in [KB026](../kb026-nautilus-batch-jobs-and-gpus/). Keep total concurrency within the fair-use limits in Section 9: more workers past that point do not make the run faster, they only collect HTTP 429 errors.

### 7.6 Retrieval-augmented generation with the NRP vector database

*Scenario: a lab wants a chat assistant that answers questions from its own public protocols and published papers, with citations to the passages it used.*

The NRP runs a managed **Milvus** vector database ([NRP-Managed vector database](https://nrp.ai/documentation/userdocs/ai/vector-database/)):

* gRPC endpoint: `milvus.nrp-nautilus.io:50051`.
* Get a username and password from the Milvus password page linked on that NRP page (the password arrives by email).
* You need membership of a group with the Milvus (Vector DB) feature. A namespace admin can create one. Database names follow group names, with dashes converted to underscores.

The usual pattern: embed passages with `qwen3-embedding`, store vectors and passage text in a Milvus collection, embed each question, retrieve the closest passages, and send them to a chat model with an instruction to answer only from those passages and cite them. Only load documents you would be comfortable making public. If you want to put a web page in front of it, see [KB029](../kb029-nautilus-hosting-web-tools/).

### 7.7 Classes and workshops

A namespace admin can create a **training join link** that adds attendees to a namespace for up to 90 days and, on namespaces with LLM access, gives each attendee their own LLM API key. The join page shows each attendee their key and the base URL. Keys are revoked shortly after access ends ([Training Join Links](https://nrp.ai/documentation/userdocs/start/training-join-links/)). [KB030](../kb030-nautilus-teaching-and-workshops/) covers planning a class around this.

---

## 8. Reproducibility: models change under the same name

The NRP updates models behind stable names. In 2026 alone, `qwen3`, `qwen3-small`, `glm-5`, `kimi`, `gemma` and `deepseek-v4-flash` were each switched to newer checkpoints while keeping their names, and older models such as `olmo` and `llama3-sdsc` were removed ([Lifecycle and changelog](https://nrp.ai/documentation/userdocs/ai/llm-managed/lifecycle/)). A script that worked in March can give different answers in September.

What to do:

* **Record everything with your results:** model name, date, prompt text, settings (temperature, reasoning settings) and the model card's upstream checkpoint name on that date (for example, `qwen3` was `Qwen/Qwen3.8-Flash-Next-FP8` as of September 2026).
* **Prefer `gpt-oss` for pipelines that must stay stable.** The NRP describes it as an LTS candidate and stable for reproducible research.
* **Declare research use.** If your group depends on a specific model, ask in the Nautilus AI/ML channel for it to be marked for active research. Deprecated models with declared research use stay up until the research concludes, so removal is communicated rather than automatic.
* **Archive outputs, not just code.** Keep the model's raw responses. Re-running later may not reproduce them.
* **Need a frozen model?** Run a specific checkpoint yourself (Section 11).

---

## 9. Fair use and writing well-behaved scripts

The NRP's [Fair Use Policy](https://nrp.ai/documentation/userdocs/ai/llm-managed/fair-use/) sets these limits (as of Sep 10, 2026):

* **Enforced automatically:** 200,000 output tokens per minute, per API token and model. Past that, requests get HTTP 429. Input tokens are not counted. Each response carries `x-ratelimit-remaining` and `x-ratelimit-reset` headers so a script can slow down before it is rejected.
* **Concurrency (not enforced automatically, but expected):** at most 2 simultaneous requests per user for `kimi`, `glm-5` and `deepseek-v4-flash`; 8 for `minimax-m2`, `qwen3-small`, `gemma` and `gemma-small`; 16 for `qwen3`, `gpt-oss` and `qwen3-embedding`.
* **Long requests:** any request that uses at least 35% of a model's context length is limited to 1 concurrent request per user, and all your concurrent requests together should stay under 35% of the context length.

The NRP also asks that automated scripts **retry indefinitely with a growing wait**, because models go down and come back for maintenance, and **reduce concurrency when latency rises**. A simple pattern:

```python
import os, random, time
import openai
from openai import OpenAI

client = OpenAI(api_key=os.environ["OPENAI_API_KEY"],
                base_url="https://ellm.nrp-nautilus.io/v1",
                max_retries=0)       # we handle retries ourselves

def chat_with_retry(**kwargs):
    wait = 5
    while True:
        try:
            return client.chat.completions.create(**kwargs)
        except (openai.RateLimitError, openai.APIConnectionError,
                openai.APITimeoutError, openai.InternalServerError) as err:
            print(f"retrying in {wait}s after: {type(err).__name__}")
            time.sleep(wait + random.uniform(0, 1))
            wait = min(wait * 2, 600)    # grow the wait, cap at 10 minutes
```

If you see slow responses and high request volume, report it in the Nautilus AI/ML channel rather than adding more workers. The NRP's LLM Status page, linked from the [NRP-Managed LLMs](https://nrp.ai/documentation/userdocs/ai/llm-managed/) overview, shows live health for each model.

---

## 10. Privacy: shared response caching

The serving software caches prompts to speed up repeated requests. By default your cached prompts and responses can mix with other users' caches. For prompts that should be cached only for you, the NRP asks you to send a `cache_salt`: a base64-encoded random string of at least 256 bits that only you know ([API Access](https://nrp.ai/documentation/userdocs/ai/llm-managed/api-access/)). The trade-off is slightly lower performance.

Generate a salt once and keep it with your token:

```bash
python3 -c "import base64, secrets; print(base64.b64encode(secrets.token_bytes(32)).decode())"
```

Then pass it in each request:

```python
resp = client.chat.completions.create(
    model="gpt-oss",
    messages=messages,
    extra_body={"cache_salt": os.environ["NRP_CACHE_SALT"]},
)
```

A cache salt does **not** make Nautilus suitable for sensitive data. The rule in Section 1 still applies.

---

## 11. When the hosted catalog is not enough

* **You need a specific or frozen model, or fine-tuned weights.** The NRP supports running your own model server with vLLM or SGLang in your namespace ([NRP-Managed LLMs](https://nrp.ai/documentation/userdocs/ai/llm-managed/)). GPU quotas and policies apply; see [KB026](../kb026-nautilus-batch-jobs-and-gpus/). For a quick experiment with Hugging Face models in a notebook, see the NRP's [LLM in JupyterHub](https://nrp.ai/documentation/userdocs/ai/llm-jupyterhub/) page, and note that model files can reach hundreds of GB.
* **You want to suggest a model for the catalog.** New-model suggestions are discussed in the Nautilus AI/ML channel.
* **Your data is not P1.** Do not use Nautilus. Contact Research Computing about campus options for protected data.
* **You want commercial models, or AI model access through UCR.** Ursa Major Tier 1 includes AI model access for research and programming, through a service Research Computing manages, with a per-lab allowance; see the [Ursa Major service page](../../services/ursa-major/). The [NAIRR Pilot](../../services/nairr/) also offers model API access by application ([KB008](../kb008-using-nairr-pilot/)).

---

## 12. Troubleshooting

| Symptom | Likely cause and fix |
| :--- | :--- |
| `401` or "invalid API key" | Token mistyped, deleted, or not exported in this shell. Create a new one at [nrp.ai/llmtoken](https://nrp.ai/llmtoken). |
| Cannot create a token, or token page says no access | You are not in a group with the LLM flag. Ask your namespace admin. |
| `404` or "model not found" | The model name changed or was retired. List current names with `/v1/models`. |
| `429 Too Many Requests` | You passed 200,000 output tokens per minute for that model. Back off (Section 9) and check whether reasoning is producing long hidden output. |
| Error mentioning max tokens or context length | `max_tokens` set too high, or prompt plus answer exceeds the context window. Remove `max_tokens` or lower it. |
| Very slow answers to simple questions | The model is reasoning at full effort. Turn thinking off or lower `reasoning_effort` (Section 5). |
| Answer contains reasoning text or tags | Some models (for example `gemma-small`) return thinking inline. Turn thinking off or strip it in code. |
| Connection errors for a few minutes | The model may be restarting for maintenance. Retry with backoff and check the LLM Status page. |

---

## Getting help

* **NRP documentation:** [NRP-Managed LLMs](https://nrp.ai/documentation/userdocs/ai/llm-managed/), [Available Models](https://nrp.ai/documentation/userdocs/ai/llm-managed/models/), [API Access](https://nrp.ai/documentation/userdocs/ai/llm-managed/api-access/), [Fair Use Policy](https://nrp.ai/documentation/userdocs/ai/llm-managed/fair-use/).
* **NRP support:** the Nautilus Support chat on Matrix, including its AI/ML channel for model questions (joining is covered in [KB024](../kb024-nautilus-getting-access/)), or the [NRP contact page](https://nrp.ai/contact). The NRP team runs the models and decides what is in the catalog.
* **UCR Research Computing:** research-computing@ucr.edu or the [Get help](../../help/) page. We can help you design a labeling or search workflow, check whether your data belongs on Nautilus, or choose between the NRP models and campus options. We do not run the NRP models and cannot change NRP limits.

## Related guides

* [KB023: Researcher guide to NRP Nautilus](../kb023-nautilus-researcher-guide/)
* [KB024: Getting access to Nautilus: accounts, namespaces and kubectl](../kb024-nautilus-getting-access/)
* [KB025: Notebooks, desktops and VS Code in the browser (JupyterHub, Coder)](../kb025-nautilus-jupyter-and-coder/)
* [KB026: Running batch jobs and GPU work with Kubernetes](../kb026-nautilus-batch-jobs-and-gpus/)
* [KB027: Storage and moving data on Nautilus](../kb027-nautilus-storage-and-data/)
* KB028: Using the NRP's hosted large language models (this article)
* [KB029: Hosting a lab web tool or service on Nautilus](../kb029-nautilus-hosting-web-tools/)
* [KB030: Teaching a class or workshop on Nautilus](../kb030-nautilus-teaching-and-workshops/)
* [LLM Inference Settings](../llm-inference-settings/)
* [NRP Nautilus service page](../../services/nautilus/)
