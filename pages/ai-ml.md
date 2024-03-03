---
id: ai-ml
title: AI/ML Hub
sidebar_label: AI/ML Hub
---

## AI/ML Hub

Welcome to the UCR Research Computing AI and ML Hub, your gateway to exploring artificial intelligence and machine learning resources. Dive into the latest technologies, tools, and platforms designed to empower your research and innovation.

## Featured AI Chatbots

Explore the capabilities of the leading AI chatbots and find the perfect match for your research needs.

| Chatbot    | Specialization          | Description                                                                                     | Link               |
|------------|-------------------------|-------------------------------------------------------------------------------------------------|--------------------|
| Groq.com   | Speed & Efficiency      | Offers lightning-fast computations, ideal for complex ML models.                                | [Visit Groq](https://groq.com/)    |
| Perplexity | Natural Language Understanding | Excels in understanding and generating human-like text, perfect for NLP tasks.             | [Visit Perplexity](https://www.perplexity.ai/) |
| Genimi     | Creative Content        | Best for creative content generation, including writing, art, and music composition.            | [Visit Genimi](https://gemini.google.com/)  |
| ChatGPT    | Versatile Conversations | Known for its versatility in engaging in detailed conversations and providing informative responses. | [Visit ChatGPT](https://chat.openai.com/) |
| Claude     | Contextual Understanding | Stands out for its deep contextual understanding, making it great for nuanced dialogues.        | [Visit Claude](https://www.claude.ai/)  |

## Popular AI & ML Software Tools for HPC Clusters

Leverage powerful software tools designed to harness the full potential of HPC clusters for AI and ML tasks.

| Software     | Use Case                    | Example Command                                                                 | Link                      |
|--------------|-----------------------------|---------------------------------------------------------------------------------|---------------------------|
| TensorFlow   | Deep Learning               | `tensorflow_model_server --port=8500 --model_name=my_model --model_base_path=/models/my_model` | [Visit TensorFlow](#)     |
| PyTorch      | Machine Learning Models     | `python -m torch.distributed.launch --nproc_per_node=NUM_GPUS_YOU_HAVE my_train_script.py`    | [Visit PyTorch](#)        |
| Horovod      | Distributed Training        | `horovodrun -np 4 -H localhost:4 python train.py`                               | [Visit Horovod](#)        |
| CUDA         | Parallel Computing          | `nvcc my_cuda_program.cu -o my_cuda_program`                                    | [Visit CUDA](#)           |
| Hugging Face Transformers | Natural Language Processing | `transformers-cli convert --model_type bert --tf_checkpoint /path/to/checkpoint --config /path/to/bert_config.json --pytorch_dump_output /path/to/pytorch_model.bin` | [Visit Hugging Face](#) |

## Open-Source LLMs

Discover the potential of open-source Large Language Models (LLMs) for your research projects.

| LLM          | Use Case                           | Hugging Face Link                              |
|--------------|------------------------------------|------------------------------------------------|
| GPT-Neo      | Text Generation & Completion       | [Visit GPT-Neo on Hugging Face](#)             |
| BERT         | Text Classification & Representation | [Visit BERT on Hugging Face](#)                |
| RoBERTa      | Text Understanding & Sentiment Analysis | [Visit RoBERTa on Hugging Face](#)            |

Below are the proposed tables for the new sections on research-focused online AI tools and development tools for AI innovation, including placeholders for specific tools and links where applicable:

### Research-Focused AI Tools

**AI-Powered Research Assistants**

| Tool Name   | Description                                                                                                   | Application in Research                                                  | Link                        |
|-------------|---------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------|-----------------------------|
| NotebookLM  | An AI-first notebook designed to help users summarize information, understand complex ideas, and brainstorm new connections. | Ideal for synthesizing facts and generating document guides.              | [Visit Google Labs](https://labs.google/) |
| Other Tool  | Description of the tool                                                                                       | How it assists in specific research tasks                                | Link to the tool            |

### Development Tools for AI Innovation

**LangChain: Language Model Applications**

| Tool Name    | Description                                                                                                 | Usage in AI Development                                                  | Link                        |
|--------------|-------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------|-----------------------------|
| LangChain    | A framework for building applications around language models, simplifying embedding, tokenization, and more. | Facilitates the creation and deployment of LLM-based applications.       | [Visit LangChain](#)        |
| Vector Stores | Solutions for storing and retrieving vectors, essential for models like RAG.                               | Enhances the efficiency of retrieval-augmented generation models.        | [Visit Vector Store](#)     |
| Embedding Tools | Tools for creating vector embeddings of textual data.                                                     | Used in processing text for NLP models and improving model understanding. | [Visit Embedding Tool](#)   |
| Tokenization Libraries | Libraries that support the conversion of text into tokens, suitable for language models.                  | Essential for preparing data for training and fine-tuning AI models.      | [Visit Tokenization Library](#) |
| Fine-Tuning & Hosting | Tools for customizing pre-trained models and hosting them for inference.                                  | Allows for the customization and deployment of AI models for specific tasks. | [Visit Fine-Tuning Tool](#) |

---

## Useful Links & Resources

- [Hugging Face](https://huggingface.co/) - A platform for collaborative AI model development and sharing.
- [UCR Research Computing Knowledge Base](#) - Find specific examples and tutorials tailored to UCR's research computing environment.

---

### Image & Video Generation Resources

Dive into the forefront of AI-driven creativity with tools designed for generating stunning images and videos. These platforms offer innovative solutions, from creating detailed artworks to producing dynamic videos, catering to a range of creative needs.

**Image Generation**

| AI Tool          | Application            | Description                                                                                               | Link                      |
|------------------|------------------------|-----------------------------------------------------------------------------------------------------------|---------------------------|
| DALL·E 3         | Image Generation       | Generates high-quality images from textual descriptions, offering unparalleled creative freedom.          | [Visit DALL·E 3](https://openai.com/dall-e-3) |
| Stable Diffusion | Image Synthesis        | State-of-the-art image synthesis from user inputs, perfect for creating detailed and imaginative visuals. | [Visit Stable Diffusion](https://stability.ai/) |
| MidJourney       | Artistic Image Creation | Creates artistic images and visualizations based on textual descriptions, blending art and AI.            | [Visit MidJourney](https://www.midjourney.com/) |

**Video Generation**

| AI Tool         | Application      | Description                                                                                              | Link                        |
|-----------------|------------------|----------------------------------------------------------------------------------------------------------|-----------------------------|
| Kaiber AI       | Video Generation | Transforms textual descriptions into engaging videos, simplifying content creation.                      | [Visit Kaiber AI](https://kaiber.ai/) |
| DeepBrain AI    | Video Synthesis  | Produces lifelike AI-generated videos, including virtual human content, for a range of applications.     | [Visit DeepBrain AI](https://www.deepbrain.io/) |
| OpenAI's Sora   | Video Generation | (Upcoming) Promises to revolutionize video creation with AI, generating videos from descriptions.        | [Visit OpenAI's Sora](https://openai.com/sora) |

**Music Generation**

| LLM Tool            | Application       | Description                                                                                              | Link                       |
|---------------------|-------------------|----------------------------------------------------------------------------------------------------------|----------------------------|
| Suno.ai             | Music Generation  | Empowers users to create unique music compositions using AI, making music creation accessible to all.    | [Visit Suno.ai](https://app.suno.ai/) |
| Google's Magenta    | Music & Art Innovation | A research project exploring the role of AI in the process of creating art and music.                    | [Visit Magenta](https://magenta.tensorflow.org/) |
| Google Labs' Music FX | Music Effects & Tools | Offers a suite of experimental music tools and effects designed to expand creative possibilities through AI. | [Visit Google Labs](https://labs.google/experiments/) |


**Voice Cloning and Synthesis**

| LLM Tool     | Application                 | Description                                                                                          | Link                        |
|--------------|-----------------------------|------------------------------------------------------------------------------------------------------|-----------------------------|
| ElevenLabs   | Voice Cloning & Synthesis   | Offers revolutionary voice cloning and synthesis capabilities, ideal for creating lifelike audio from text. | [Visit ElevenLabs](https://elevenlabs.io/speech-synthesis) |

These LLM resources are designed to push the boundaries of digital creativity and audio production, providing researchers, artists, and developers with powerful tools to explore new realms of audio-visual expression. Whether you're looking to generate unique musical pieces or clone voices for various applications, these platforms offer the technology and flexibility to bring your visions to life.