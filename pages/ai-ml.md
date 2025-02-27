---
id: ai-ml
title: AI/ML Hub
sidebar_label: AI/ML Hub
---

## AI/ML Hub

Welcome to the UCR Research Computing AI and ML Hub—your gateway to cutting-edge artificial intelligence and machine learning resources. Explore the latest technologies, open-source models, and software platforms that empower your research and innovation.

---

### Featured How-To
**Run Your Own Open-Source LLM Today**  
Learn how to run your own copy of an open-source large language model on UCR Ursa Major or your workstation.  
[How To Run Offline LLMs](../Knowledge_Base/ollama-how-to.md) 

---

## Featured: AI Chatbots

Explore the leading AI chatbots designed to support your research needs.  
> **Warning:** Ensure you have the necessary permissions and take appropriate steps before using AI chatbots with sensitive or proprietary data.

| Chatbot                                   | Description                                                                                     |
|-------------------------------------------|-------------------------------------------------------------------------------------------------|
| [ChatGPT (GPT-4)](https://chat.openai.com/) | Versatile and widely adopted for detailed conversations, research assistance, and creative tasks. |
| [Claude](https://www.claude.ai/)            | Renowned for its contextual understanding and nuance in dialogue, ideal for complex inquiries.  |
| [Gemini](https://gemini.google.com/)        | Excels in creative content generation, including writing, art, and multimedia synthesis.         |
| [Perplexity](https://www.perplexity.ai/)      | Specializes in natural language queries with quick, informative responses.                        |
| [Pi.ai](https://pi.ai/talk)                  | A personal AI assistant that offers empathetic conversations and factual information across platforms. |
| [Bing Chat](https://www.bing.com/chat)        | Integrates with Microsoft’s search and AI ecosystem, offering real-time data insights and responses. |

---

## AI & ML Software Tools for Researchers

Harness the power of advanced software tools tailored to leverage HPC clusters and accelerate AI/ML research.

> **Note:** Some installations and configurations may require advanced setup. Contact us at [research-computing@ucr.edu](mailto:research-computing@ucr.edu) for assistance.

### General Purpose & Cross-Domain Tools

| Software                                       | Use Case                        | Example Command                                                                 |
|------------------------------------------------|---------------------------------|---------------------------------------------------------------------------------|
| [TensorFlow](https://www.tensorflow.org/)      | Deep Learning                   | `tensorflow_model_server --port=8500 --model_name=my_model --model_base_path=/models/my_model` |
| [PyTorch](https://pytorch.org/)                | Machine Learning Models         | `python -m torch.distributed.launch --nproc_per_node=<NUM_GPUS> my_train_script.py`    |
| [Horovod](https://horovod.ai/)                 | Distributed Training            | `horovodrun -np 4 -H localhost:4 python train.py`                               |
| [CUDA](https://developer.nvidia.com/cuda-zone) | Parallel Computing              | `nvcc my_cuda_program.cu -o my_cuda_program`                                    |
| [Hugging Face Transformers](https://huggingface.co/docs/transformers) | Natural Language Processing     | `transformers-cli convert --model_type bert --tf_checkpoint /path/to/checkpoint --config /path/to/bert_config.json --pytorch_dump_output /path/to/pytorch_model.bin` |

### Life Sciences & Biology

| Software                                       | Use Case                          | Example Command                                                           |
|------------------------------------------------|-----------------------------------|---------------------------------------------------------------------------|
| [AlphaFold](https://github.com/deepmind/alphafold) | Protein Structure Prediction      | `alphafold --fasta_path=my_sequence.fasta --output_dir=output`            |
| [FreeSurfer](https://surfer.nmr.mgh.harvard.edu/) | Neuroimaging Analysis             | `recon-all -s subject_name -i input_volume.nii -all`                      |

### Earth Science

| Software                                       | Use Case                          | Example Command                                                        |
|------------------------------------------------|-----------------------------------|------------------------------------------------------------------------|
| [GDAL](https://gdal.org/)                      | Geospatial Data Processing       | `gdal_translate -of GTiff input.tif output.tif`                         |
| [Pangeo](https://pangeo.io/)                   | Climate & Ocean Science          | *Deploy on cloud platforms for scalable data processing; see documentation for examples.* |

### Chemistry & Physics

| Software                                       | Use Case                          | Example Command                                                        |
|------------------------------------------------|-----------------------------------|------------------------------------------------------------------------|
| [GROMACS](https://www.gromacs.org/)            | Molecular Dynamics               | `gmx mdrun -s topol.tpr -deffnm output`                                  |
| [Quantum ESPRESSO](https://www.quantum-espresso.org/) | Materials Modeling               | `pw.x -in Si.scf.in > Si.scf.out`                                        |

### Humanities & Social Sciences

| Software                                       | Use Case                          | Example Command or Description                                          |
|------------------------------------------------|-----------------------------------|-------------------------------------------------------------------------|
| [SpaCy](https://spacy.io/)                     | NLP & Text Processing             | High-performance syntactic analysis and entity recognition.             |
| [Gensim](https://radimrehurek.com/gensim/)     | Topic Modeling & Similarity       | Ideal for unsupervised topic modeling and document similarity tasks.    |
| [TextBlob](https://textblob.readthedocs.io/en/dev/) | Simplified Text Processing        | Provides an intuitive interface for sentiment analysis and text processing. |
| [NLTK](https://www.nltk.org/)                  | Natural Language Toolkit          | Offers extensive corpora and lexical resources for language processing. |

---

## Top Open Source AI Models

Discover state-of-the-art open-source models that are driving innovation across disciplines—from text generation to image synthesis and beyond.

### Featured How-To:
Run your own open-source LLM on UCR Ursa Major or your workstation today!  
[How To Run Offline LLMs](../Knowledge_Base/ollama-how-to.md)

| Name                                          | Description                          | Name                                          | Description                          |
|-----------------------------------------------|--------------------------------------|-----------------------------------------------|--------------------------------------|
| [google/gemma-7b](https://huggingface.co/google/gemma-7b)        | Text Generation                      | [ByteDance/SDXL-Lightning](https://huggingface.co/ByteDance/SDXL-Lightning) | Text-to-Image Generation              |
| [bigcode/starcoder2-15b](https://huggingface.co/bigcode/starcoder2-15b) | Code & Text Generation               | [playgroundai/playground-v2.5-1024px-aesthetic](https://huggingface.co/playgroundai/playground-v2.5-1024px-aesthetic) | Artistic Text-to-Image               |
| [google/gemma-2b](https://huggingface.co/google/gemma-2b)        | Text Generation                      | [stabilityai/stable-video-diffusion-img2vid-xt](https://huggingface.co/stabilityai/stable-video-diffusion-img2vid-xt) | Image-to-Video Synthesis              |
| [meta-llama/Llama-2-7b-chat-hf](https://huggingface.co/meta-llama/Llama-2-7b-chat-hf) | Conversational AI                   | [mistralai/Mixtral-8x7B-Instruct-v0.1](https://huggingface.co/mistralai/Mixtral-8x7B-Instruct-v0.1) | Instruction-Tuned Text Generation     |

---

## AI Models by Domains and Applications

Explore foundational tasks and the state-of-the-art models across key AI domains:

| Natural Language Processing                                         | Audio Processing                                        | Computer Vision                                          | Multimodal                                           |
|----------------------------------------------------------------------|---------------------------------------------------------|----------------------------------------------------------|------------------------------------------------------|
| [Text Classification](https://huggingface.co/docs/transformers/en/tasks/sequence_classification) | [Audio Classification](https://huggingface.co/docs/transformers/en/tasks/audio_classification) | [Image Classification](https://huggingface.co/docs/transformers/en/tasks/image_classification) | [Image Captioning](https://huggingface.co/docs/transformers/en/tasks/image_captioning) |
| [Token Classification](https://huggingface.co/docs/transformers/en/tasks/token_classification)    | [ASR (Speech Recognition)](https://huggingface.co/docs/transformers/en/tasks/asr)                | [Image Segmentation](https://huggingface.co/docs/transformers/en/tasks/semantic_segmentation) | [Document Question Answering](https://huggingface.co/docs/transformers/en/tasks/document_question_answering) |
| [Question Answering](https://huggingface.co/docs/transformers/en/tasks/question_answering)          |                                                         | [Object Detection](https://huggingface.co/docs/transformers/en/tasks/object_detection)             | [Visual Question Answering](https://huggingface.co/docs/transformers/en/tasks/visual_question_answering) |
| [Causal Language Modeling](https://huggingface.co/docs/transformers/en/tasks/language_modeling)       |                                                         | [Zero-Shot Image Classification](https://huggingface.co/docs/transformers/en/tasks/zero_shot_image_classification) | [Text-to-Speech](https://huggingface.co/docs/transformers/en/tasks/text-to-speech) |
| [Masked Language Modeling](https://huggingface.co/docs/transformers/en/tasks/masked_language_modeling) |                                                         | [Monocular Depth Estimation](https://huggingface.co/docs/transformers/en/tasks/monocular_depth_estimation) |                                                      |
| [Translation](https://huggingface.co/docs/transformers/en/tasks/translation)                        |                                                         | [Image-to-Image](https://huggingface.co/docs/transformers/en/tasks/image_to_image)                   |                                                      |
| [Multiple Choice](https://huggingface.co/docs/transformers/en/tasks/multiple_choice)                  |                                                         | [Mask Generation](https://huggingface.co/docs/transformers/en/tasks/mask_generation)                 |                                                      |

---

## Large Language Model (LLM) Development Tools

Advance your AI applications with these state-of-the-art development tools:

| Tool Name                                      | Description                                                                                           | Application                                          |
|------------------------------------------------|-------------------------------------------------------------------------------------------------------|------------------------------------------------------|
| [Flowise AI](https://flowiseai.com/)             | Build and deploy LLM applications on custom data, with interactive workflows for PDF Q&A.              | Rapid prototyping of LLM-powered apps                |
| [LangChain](https://python.langchain.com/docs/)  | A powerful framework for building applications around language models, with integrations for embeddings and tokenization. | Simplifies LLM-based application development         |
| [Vector Stores](https://docs.flowiseai.com/integrations/langchain/vector-stores) | Manage and retrieve vector embeddings efficiently—crucial for RAG and similarity search models.         | Enhances retrieval-augmented generation              |
| [Embedding Tools](https://docs.flowiseai.com/integrations/langchain/embeddings)  | Generate high-quality vector embeddings from textual data for better model performance.                | Improves NLP model understanding and performance     |
| [Tokenization Libraries](https://smltar.com/tokenization.html) | Convert text to tokens using optimized libraries that power modern language models.                    | Essential for data preprocessing in LLM training     |
| [Fine-Tuning & Hosting](https://medium.com/@gkarthikkumar517/fine-tuning-of-llms-in-gcp-vertex-ai-a8afb86a3511) | Customize pre-trained models and host them for inference using cloud platforms like GCP Vertex AI.       | Tailors AI models to specific research tasks         |

> **Tip:** Experiment with these development tools to find the optimal setup for your projects—innovation often emerges from blending multiple approaches.

---

## Other Online AI Tools

### RAG-Enabled Tools

| Tool Name                       | Description                                                                                                             | Application in Research                         |
|---------------------------------|-------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------|
| [Notebook LM](https://notebooklm.google.com/)  | An AI-first interactive notebook for summarizing information and generating insights from complex datasets.          | Ideal for synthesizing research findings        |
| *Other Tools*                   | *Emerging tools to enhance retrieval and synthesis; check our Knowledge Base for the latest updates.*                    |                                                 |

### Image Generation

Discover AI-powered image generation tools that turn textual descriptions into vivid visuals:

| AI Tool                                         | Application              | Description                                                                                             |
|-------------------------------------------------|--------------------------|---------------------------------------------------------------------------------------------------------|
| [DALL·E 3](https://openai.com/dall-e-3)           | Image Generation         | Generates high-quality images from textual prompts with remarkable creativity.                         |
| [Stable Diffusion XL](https://stability.ai/blog/stable-diffusion-xl-launch) | Image Synthesis          | State-of-the-art image synthesis that produces detailed and imaginative visuals from user inputs.      |
| [MidJourney](https://www.midjourney.com/)         | Artistic Image Creation  | Blends art and AI to create visually striking and creative images based on text descriptions.            |

### Video Generation

Explore how AI is transforming video content creation:

| AI Tool                                        | Application              | Description                                                                                           |
|------------------------------------------------|--------------------------|-------------------------------------------------------------------------------------------------------|
| [Kaiber AI](https://kaiber.ai/)                | Video Generation         | Transforms textual prompts into engaging, dynamic video content with minimal user input.               |
| [DeepBrain AI](https://www.deepbrain.io/)      | Video Synthesis          | Produces lifelike videos, including virtual human content, for various research and communication needs.|
| [OpenAI's Sora](https://openai.com/sora)         | Video Generation         | (Upcoming) Promising next-generation video synthesis capabilities from text descriptions.              |
| [Haiper AI](https://haiper.ai/)                | Video Creation           | Enables creative video generation for educational and promotional content.                           |

### Music Generation

Harness AI to compose and innovate in music production:

| AI Tool                                        | Application              | Description                                                                                              |
|------------------------------------------------|--------------------------|----------------------------------------------------------------------------------------------------------|
| [Suno.ai](https://app.suno.ai/)                | Music Generation         | Create original music compositions using AI, accessible to creators of all backgrounds.                  |
| [Google Magenta](https://magenta.tensorflow.org/) | Music & Art Innovation   | Explores the intersection of AI and creativity in music and art.                                         |
| [Google Labs Music FX](https://labs.google/experiments/) | Music Effects & Tools    | Offers experimental tools to enhance creative musical expression using AI.                             |

### Voice Cloning & Synthesis

Leverage state-of-the-art voice technologies for realistic audio production:

| AI Tool                                        | Application              | Description                                                                                             |
|------------------------------------------------|--------------------------|---------------------------------------------------------------------------------------------------------|
| [ElevenLabs](https://elevenlabs.io/speech-synthesis) | Voice Cloning & Synthesis | Advanced voice cloning and synthesis for lifelike audio production, perfect for accessibility and multimedia. |

---

## Useful Links & Resources

- [Hugging Face](https://huggingface.co/) – A leading platform for collaborative AI model development and sharing.
- [UCR Research Computing Knowledge Base](#) – Find tutorials, examples, and guides tailored for UCR’s research computing environment.

---

*For additional support or inquiries, please contact [research-computing@ucr.edu](mailto:research-computing@ucr.edu).*
