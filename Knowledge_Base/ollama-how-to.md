### How to Run an Open-Source Offline AI LLM Model at UCR Research Computing

This comprehensive guide outlines the process for setting up a GPU-enabled workstation on UCR Research Computing's Ursa Major (GCP Console) to run your own copy of an offline AI Large Language Model (LLM), such as Llama 2 or Gemma, with full data privacy.

#### Step 1: Create Your GPU Workstation

- **Access Ursa Major (GCP Console)**: Go to the Google Cloud Platform (GCP) console and select App Engine.
- **Create Instance**: Click "Create Instance" to initiate the setup of your new workstation.
- **Select GPU Node**: Opt for a GPU node configuration that includes a T4 GPU for optimal performance.
- **Switch Image for CUDA Support**: In the Boot Disk section, notice a prompt regarding manual NVIDIA CUDA stack installation. Click "Switch Image" to choose a GPU-optimized Debian OS image with CUDA support at no extra cost.
- **Create Your Workstation**: Complete the creation of your workstation. It will be ready in about 30 seconds to 3 minutes.

#### Step 2: Initial Setup and Installation

- **SSH Connection**: After your workstation is ready, click the SSH button to connect.
- **NVIDIA Drivers Installation**: At your first login, you'll be prompted to install NVIDIA drivers. Enter "Y" for yes to continue with the installation.
- **Install Ollama**: Execute the following command to install Ollama, the tool that makes it easy to access and use popular open-source LLM models like Llama2 and Gemma. The installation is quick and efficient.

```bash
curl -fsSL https://ollama.com/install.sh | sh
```

After installing, verify the installation with `ollama --version` to ensure Ollama is correctly installed.

#### Step 3: Downloading and Running Models

Visit the [Ollama Model Library](https://ollama.com/library?sort=popular) to explore and download popular models. Here's a quick start to running and chatting with Llama 2:

- **Run Llama 2**: Input `ollama run llama2` in your terminal.

Ollama supports a variety of models, including but not limited to:

| Model               | Parameters | Size  | Download Command            |
|---------------------|------------|-------|-----------------------------|
| Llama 2             | 7B         | 3.8GB | `ollama run llama2`         |
| Mistral             | 7B         | 4.1GB | `ollama run mistral`        |
| Dolphin Phi         | 2.7B       | 1.6GB | `ollama run dolphin-phi`    |
| Phi-2               | 2.7B       | 1.7GB | `ollama run phi`            |
| Neural Chat         | 7B         | 4.1GB | `ollama run neural-chat`    |
| Starling            | 7B         | 4.1GB | `ollama run starling-lm`    |
| Code Llama          | 7B         | 3.8GB | `ollama run codellama`      |
| Llama 2 Uncensored  | 7B         | 3.8GB | `ollama run llama2-uncensored` |
| Llama 2 13B         | 13B        | 7.3GB | `ollama run llama2:13b`     |
| Llama 2 70B         | 70B        | 39GB  | `ollama run llama2:70b`     |
| Orca Mini           | 3B         | 1.9GB | `ollama run orca-mini`      |
| Vicuna              | 7B         | 3.8GB | `ollama run vicuna`         |
| LLaVA               | 7B         | 4.5GB | `ollama run llava`          |
| Gemma               | 2B         | 1.4GB | `ollama run gemma:2b`       |
| Gemma               | 7B         | 4.8GB | `ollama run gemma:7b`       |

**Note:** You should have at least 8 GB of RAM available to run the 7B models, 16 GB to run the 13B models, and 32 GB to run the 33B models.

### Customizing Models

- **Import GGUF Models**: Create a `Modelfile` with a `FROM` instruction specifying the local filepath to the model you wish to import.
- **Create and Run Custom Models**: Utilize `ollama create` and `ollama run` commands to construct and initiate your custom model.

### Further Customizations and Commands

- **Customize a Prompt**: Models can be personalized with specific prompts to produce tailored responses.
- **CLI Reference**: Employ commands such as `ollama create`, `ollama pull`, `ollama rm`, `ollama cp`, and `ollama list` for model management on your workstation.

By adhering to these instructions, you're well-equipped to run and interact with a broad range of open-source LLM models securely and privately on a GPU workstation within the UCR Research Computing environment.