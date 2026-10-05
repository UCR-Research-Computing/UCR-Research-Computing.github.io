---
title: "Running open-source language models with Ollama"
topic: Cloud
owner: Research Computing
reviewed: 2026-10-04
redirect_from:
  - /Knowledge_Base/ollama-how-to.html
review_notes:
  - "Fixed the setup steps (Compute Engine, not App Engine), replaced the 'full data privacy' and 'no extra cost' claims, and added notes on shutting the VM down and keeping the Ollama port private."
  - "Replaced the outdated Llama 2 era model table with a short list of current models from the Ollama library (sizes as listed on 2026-10-04) and updated examples from llama2 to llama3.2."
  - "Linked the Ollama import, Modelfile and CLI docs, removed a developer's name from an example file path, and kept the Tier 2 recharge note with links to KB005 and KB007."
  - "CHECK: the Google Cloud console still offers the 'Switch image' prompt to a GPU-ready Deep Learning VM image when a GPU is added, and that image still asks to install NVIDIA drivers at first login."
---

**Cost note:** a cloud VM with a GPU (such as the NVIDIA T4 used below) in your lab's Ursa Major project is a Tier 2 service. Following this guide on Google Cloud creates usage recharged to your lab's funding source, billed for as long as the VM runs. See [Ursa Major service tiers](../kb005-ursa-major-service-tiers/) and [how Tier 2 setup works](../kb007-tier2-recharge-workflow/). Other options:

- The [HPCC](../../services/hpcc/) has GPU partitions for batch work. Ask support@hpcc.ucr.edu whether Ollama or a similar tool fits your work there.
- For general-purpose AI tools available to the campus, see [UCR AI tools](https://its.ucr.edu/ai).

This guide shows how to set up a GPU virtual machine (a research workstation) in your Ursa Major Google Cloud project and run an open-source large language model (LLM), such as Llama or Gemma, with Ollama. The model runs on your VM, so prompts and responses are not sent to an outside model API. You are still responsible for the VM's security and for following the rules for your data's classification; see [Security](../../security/).

## Step 1: Create the GPU workstation

1. Open the [Google Cloud console](https://console.cloud.google.com) and select your lab's project.
2. Go to **Compute Engine**, then **VM instances**, then **Create instance**.
3. Under machine configuration, choose **GPUs** and select an **NVIDIA T4**. If no GPU is available in your project or zone, contact research-computing@ucr.edu.
4. In the **Boot disk** section, the console notes that the selected image needs the NVIDIA CUDA stack installed manually. Click **Switch image** to use a GPU-ready Deep Learning VM image (Debian with CUDA).
5. Click **Create**. The VM is usually ready within a few minutes.

For more detail, see [Launching an Ursa Major research workstation](../ursa-major-workstation-launch/).

## Step 2: Connect and install Ollama

1. When the VM is ready, click **SSH** next to it in the console.
2. At first login, the Deep Learning VM image asks whether to install the NVIDIA driver. Enter `y`. Check the driver with `nvidia-smi`.
3. Install Ollama:

    ```bash
    curl -fsSL https://ollama.com/install.sh | sh
    ```

4. Confirm the install:

    ```bash
    ollama --version
    ```

Ollama serves its API on `localhost` port 11434. Leave it there. Do not open that port to the internet with a firewall rule; anyone who can reach it can use your model and your GPU time.

## Step 3: Download and run a model

Browse the [Ollama model library](https://ollama.com/library) for available models. To download and chat with Llama 3.2:

```bash
ollama run llama3.2
```

Type `/bye` to leave the chat.

Some current models, with the download size of the default version as listed in the library on 2026-10-04 (models and sizes change often):

| Model | Parameters | Size | Command |
| --- | --- | --- | --- |
| Llama 3.2 | 1B | 1.3 GB | `ollama run llama3.2:1b` |
| Llama 3.2 | 3B | 2.0 GB | `ollama run llama3.2` |
| Gemma 3 | 4B | 3.3 GB | `ollama run gemma3` |
| Mistral | 7B | 4.4 GB | `ollama run mistral` |
| Qwen 3 | 8B | 5.2 GB | `ollama run qwen3` |
| Phi-4 | 14B | 9.1 GB | `ollama run phi4` |

**Memory:** Ollama suggests at least 8 GB of RAM for 7B models, 16 GB for 13B models and 32 GB for 33B models. To run fully on the GPU, the model also needs to fit in GPU memory (a T4 has 16 GB). Check each model's license before using it in your research.

**When you are done:** stop the VM in the console. A stopped VM is not charged for GPU and CPU time, but its disk is still charged. Delete the VM and disk when you no longer need them.

## Customize a model

### Import a GGUF model

1. Create a file named `Modelfile` with a `FROM` line that points to the local GGUF file:

    ```plaintext
    FROM ./my-model.Q4_0.gguf
    ```

2. Create the model in Ollama:

    ```bash
    ollama create example -f Modelfile
    ```

3. Run it:

    ```bash
    ollama run example
    ```

### Import from PyTorch or Safetensors

See the Ollama guide to [importing models](https://docs.ollama.com/import).

### Customize a prompt

Models from the Ollama library can be customized with a prompt and parameters. For example, with `llama3.2`:

1. Pull the model:

    ```bash
    ollama pull llama3.2
    ```

2. Create a `Modelfile`:

    ```plaintext
    FROM llama3.2

    # set the temperature to 1 [higher is more creative, lower is more coherent]
    PARAMETER temperature 1

    # set the system message
    SYSTEM """
    You are Mario from Super Mario Bros. Answer as Mario, the assistant, only.
    """
    ```

3. Create and run the model:

    ```bash
    ollama create mario -f ./Modelfile
    ollama run mario
    ```

    ```plaintext
    >>> hi
    Hello! It's your friend Mario.
    ```

For all `Modelfile` options, see the [Modelfile reference](https://docs.ollama.com/modelfile). For what settings such as temperature do, see [LLM inference settings](../llm-inference-settings/).

## CLI reference

- **Create a model** from a `Modelfile`:

    ```bash
    ollama create mymodel -f ./Modelfile
    ```

- **Pull a model:** `ollama pull llama3.2`. This also updates a local model; only the changes are downloaded.
- **Remove a model:** `ollama rm llama3.2`
- **Copy a model:** `ollama cp llama3.2 my-llama`
- **List downloaded models:** `ollama list`
- **Multiline input:** wrap text in `"""`:

    ```plaintext
    >>> """Hello,
    ... world!
    ... """
    ```

- **Images (vision models such as `gemma3`):** include the image path in the prompt:

    ```plaintext
    >>> What's in this image? ./smile.png
    ```

- **Pass a prompt as an argument:**

    ```bash
    ollama run llama3.2 "Summarize this file: $(cat README.md)"
    ```

See the [Ollama CLI reference](https://docs.ollama.com/cli) and [API reference](https://docs.ollama.com/api) for more.
