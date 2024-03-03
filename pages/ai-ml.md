---
id: ai-ml
title: AI/ML Hub
sidebar_label: AI/ML Hub
---

## AI/ML Hub

Welcome to the UCR Research Computing AI and ML Hub, your gateway to exploring artificial intelligence and machine learning resources. Dive into the latest technologies, tools, and platforms designed to empower your research and innovation.

## Featured AI Chatbots

Explore the capabilities of the leading AI chatbots and find the perfect match for your research needs.

| Chatbot                                | Specialization                     | Description                                                                                     |
|----------------------------------------|------------------------------------|-------------------------------------------------------------------------------------------------|
| [Groq.com](https://groq.com/)          | Speed & Efficiency                 | Offers lightning-fast computations, ideal for complex ML models.                                |
| [Perplexity](https://www.perplexity.ai/) | Natural Language Understanding    | Excels in understanding and generating human-like text, perfect for NLP tasks.                  |
| [Genimi](https://gemini.google.com/)   | Creative Content                   | Best for creative content generation, including writing, art, and music composition.            |
| [ChatGPT](https://chat.openai.com/)    | Versatile Conversations            | Known for its versatility in engaging in detailed conversations and providing informative responses. |
| [Claude](https://www.claude.ai/)       | Contextual Understanding           | Stands out for its deep contextual understanding, making it great for nuanced dialogues.        |

## Popular AI & ML Software Tools for HPC Clusters

Leverage powerful software tools designed to harness the full potential of HPC clusters for AI and ML tasks, across various domains.

### General Purpose and Cross-Domain Tools

| Software                                       | Use Case                    | Example Command                                                                 |
|------------------------------------------------|-----------------------------|---------------------------------------------------------------------------------|
| [TensorFlow](#)                                | Deep Learning               | `tensorflow_model_server --port=8500 --model_name=my_model --model_base_path=/models/my_model` |
| [PyTorch](#)                                   | Machine Learning Models     | `python -m torch.distributed.launch --nproc_per_node=NUM_GPUS_YOU_HAVE my_train_script.py`    |
| [Horovod](#)                                   | Distributed Training        | `horovodrun -np 4 -H localhost:4 python train.py`                               |
| [CUDA](#)                                      | Parallel Computing          | `nvcc my_cuda_program.cu -o my_cuda_program`                                    |
| [Hugging Face Transformers](#)                 | Natural Language Processing | `transformers-cli convert --model_type bert --tf_checkpoint /path/to/checkpoint --config /path/to/bert_config.json --pytorch_dump_output /path/to/pytorch_model.bin` |

### Life Sciences & Biology

| Software                                       | Use Case                    | Example Command                                                                 |
|------------------------------------------------|-----------------------------|---------------------------------------------------------------------------------|
| [AlphaFold](#)                                 | Protein Structure Prediction| `alphafold --fasta_path=my_sequence.fasta --output_dir=output`                  |
| [FreeSurfer](#)                                | Neuroimaging Analysis       | `recon-all -s subject_name -i input_volume.nii -all`                            |

### Earth Science

| Software                                       | Use Case                    | Example Command                                                                 |
|------------------------------------------------|-----------------------------|---------------------------------------------------------------------------------|
| [GDAL](#)                                      | Geospatial Data Processing  | `gdal_translate -of GTiff input.tif output.tif`                                 |
| [Pangeo](#)                                    | Climate and Ocean Science   | Example usage involves deploying Pangeo on cloud platforms for scalable data processing. |

### Chemistry & Physics

| Software                                       | Use Case                    | Example Command                                                                 |
|------------------------------------------------|-----------------------------|---------------------------------------------------------------------------------|
| [GROMACS](#)                                   | Molecular Dynamics          | `gmx mdrun -s topol.tpr -deffnm output`                                         |
| [Quantum ESPRESSO](#)                          | Materials Modeling          | `pw.x -in Si.scf.in > Si.scf.out`                                               |

### Humanities & Social Sciences

| Software                                       | Use Case                    | Example Command                                                                 |
|------------------------------------------------|-----------------------------|---------------------------------------------------------------------------------|
| [MALLET](#)                                    | Text Analysis               | `bin/mallet import-dir --input /path/to/texts --output topic-input.mallet`      |
| [Voyant Tools](#)                              | Digital Humanities          | Voyant Tools is primarily used through its web interface for text analysis.     |

## Open-Source LLMs

Discover the potential of open-source Large Language Models (LLMs) for your research projects.

| LLM                                            | Use Case                               |
|------------------------------------------------|----------------------------------------|
| [GPT-Neo](#)                                   | Text Generation & Completion           |
| [BERT](#)                                      | Text Classification & Representation   |
| [RoBERTa](#)                                   | Text Understanding & Sentiment Analysis|

### Research-Focused AI Tools



**AI-Powered Research Assistants**

| Tool Name                                     | Description                                                                                                   | Application in Research                                                  |
|------------------------------------------------|---------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------|
| [NotebookLM](https://labs.google/)            | An AI-first notebook designed to help users summarize information, understand complex ideas, and brainstorm new connections. | Ideal for synthesizing facts and generating document guides.              |
| Other Tool                                    | Description of the tool                                                                                       | How it assists in specific research tasks                                |

### Development Tools for AI Innovation

**LangChain: Language Model Applications**

| Tool Name                                     | Description                                                                                                 | Usage in AI Development                                                  |
|------------------------------------------------|-------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------|
| [LangChain](#)                                | A framework for building applications around language models, simplifying embedding, tokenization, and more. | Facilitates the creation and deployment of LLM-based applications.       |
| [Vector Stores](#)                            | Solutions for storing and retrieving vectors, essential for models like RAG.                               | Enhances the efficiency of retrieval-augmented generation models.        |
| [Embedding Tools](#)                          | Tools for creating vector embeddings of textual data.                                                       | Used in processing text for NLP models and improving model understanding. |
| [Tokenization Libraries](#)                   | Libraries that support the conversion of text into tokens, suitable for language models.                    | Essential for preparing data for training and fine-tuning AI models.      |
| [Fine-Tuning & Hosting](#)                    | Tools for customizing pre-trained models and hosting them for inference.                                    | Allows for the customization and deployment of AI models for specific tasks. |

---

### Image & Video Generation Resources

Dive into the forefront of AI-driven creativity with tools designed for generating stunning images and videos. These platforms offer innovative solutions, from creating detailed artworks to producing dynamic videos, catering to a range of creative needs.

**Image Generation**

| AI Tool                                      | Application               | Description                                                                                               |
|----------------------------------------------|---------------------------|-----------------------------------------------------------------------------------------------------------|
| [DALL·E 3](https://openai.com/dall-e-3)      | Image Generation          | Generates high-quality images from textual descriptions, offering unparalleled creative freedom.          |
| [Stable Diffusion](https://stability.ai/)    | Image Synthesis           | State-of-the-art image synthesis from user inputs, perfect for creating detailed and imaginative visuals. |
| [MidJourney](https://www.midjourney.com/)    | Artistic Image Creation   | Creates artistic images and visualizations based on textual descriptions, blending art and AI.            |

**Video Generation**

| AI Tool                                      | Application               | Description                                                                                              |
|----------------------------------------------|---------------------------|----------------------------------------------------------------------------------------------------------|
| [Kaiber AI](https://kaiber.ai/)             | Video Generation          | Transforms textual descriptions into engaging videos, simplifying content creation.                      |
| [DeepBrain AI](https://www.deepbrain.io/)   | Video Synthesis           | Produces lifelike AI-generated videos, including virtual human content, for a range of applications.     |
| [OpenAI's Sora](https://openai.com/sora)     | Video Generation          | (Upcoming) Promises to revolutionize video creation with AI, generating videos from descriptions.        |

**Music Generation**

| AI Tool                                      | Application               | Description                                                                                              |
|----------------------------------------------|---------------------------|----------------------------------------------------------------------------------------------------------|
| [Suno.ai](https://app.suno.ai/)              | Music Generation          | Empowers users to create unique music compositions using AI, making music creation accessible to all.    |
| [Google's Magenta](https://magenta.tensorflow.org/) | Music & Art Innovation | A research project exploring the role of AI in the process of creating art and music.                    |
| [Google Labs' Music FX](https://labs.google/experiments/) | Music Effects & Tools    | Offers a suite of experimental music tools and effects designed to expand creative possibilities through AI. |

**Voice Cloning and Synthesis**

| AI Tool                                      | Application               | Description                                                                                          |
|----------------------------------------------|---------------------------|------------------------------------------------------------------------------------------------------|
| [ElevenLabs](https://elevenlabs.io/speech-synthesis) | Voice Cloning & Synthesis | Offers revolutionary voice cloning and synthesis capabilities, ideal for creating lifelike audio from text. |

These LLM resources are designed to push the boundaries of digital creativity and audio production, providing researchers, artists, and developers with powerful tools to explore new realms of audio-visual expression. Whether you're looking to generate unique musical pieces or clone voices for various applications, these platforms offer the technology and flexibility to bring your visions to life.

---

## Useful Links & Resources

- [Hugging Face](https://huggingface.co/) - A platform for collaborative AI model development and sharing.
- [UCR Research Computing Knowledge Base](#) - Find specific examples and tutorials tailored to UCR's research computing environment.

---