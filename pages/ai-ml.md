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
| [Groq](https://groq.com/)          | Speed & Efficiency                 | Offers lightning-fast computations, ideal for complex ML models.                                |
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

| Software                                       | Use Use Case                | Example Command                                                                 |
|------------------------------------------------|-----------------------------|---------------------------------------------------------------------------------|
| [SpaCy](https://spacy.io/)                     | NLP & Text Processing       | SpaCy is optimized for performance, with capabilities for syntactic analysis, tokenization, and entity recognition. |
| [Gensim](https://radimrehurek.com/gensim/)     | Topic Modeling & Similarity | Gensim is specialized in unsupervised topic modeling and natural language document similarity. |
| [TextBlob](https://textblob.readthedocs.io/en/dev/) | Simplified Text Processing  | TextBlob simplifies text processing, providing an intuitive interface for common NLP tasks like sentiment analysis. |
| [NLTK](https://www.nltk.org/)                  | Natural Language Toolkit    | NLTK is a leading platform for building Python programs to work with human language data, offering interfaces to over 50 corpora and lexical resources. |



### Top Open Source AI Models
Explore a handpicked selection of top open-source AI models that are driving innovation across various domains. From sophisticated text generation to dynamic text-to-image models, these contributions represent the cutting edge of AI research and application.

| Name | Description | Name | Description |
|------|-------------|------|-------------|
| [google/gemma-7b](https://huggingface.co/google/gemma-7b) | Text Generation | [ByteDance/SDXL-Lightning](https://huggingface.co/ByteDance/SDXL-Lightning) | Text-to-Image |
| [bigcode/starcoder2-15b](https://huggingface.co/bigcode/starcoder2-15b) | Text Generation | [playgroundai/playground-v2.5-1024px-aesthetic](https://huggingface.co/playgroundai/playground-v2.5-1024px-aesthetic) | Text-to-Image |
| [google/gemma-7b-it](https://huggingface.co/google/gemma-7b-it) | Text Generation | [mistralai/Mixtral-8x7B-Instruct-v0.1](https://huggingface.co/mistralai/Mixtral-8x7B-Instruct-v0.1) | Text Generation |
| [google/gemma-2b](https://huggingface.co/google/gemma-2b) | Text Generation | [stabilityai/stable-video-diffusion-img2vid-xt](https://huggingface.co/stabilityai/stable-video-diffusion-img2vid-xt) | Image-to-Video |
| [stabilityai/stable-cascade](https://huggingface.co/stabilityai/stable-cascade) | Text-to-Image | [meta-llama/Llama-2-7b-chat-hf](https://huggingface.co/meta-llama/Llama-2-7b-chat-hf) | Text Generation |

### Key AI Domains and Applications
This section outlines critical areas within AI, including natural language processing, audio processing, computer vision, and multimodal systems. Discover the transformative power of AI through these domains, each linking to foundational tasks and state-of-the-art models.

| Natural Language Processing          | Audio Processing                       | Computer Vision                        | Multimodal                              |
|--------------------------------------|----------------------------------------|----------------------------------------|-----------------------------------------|
| [Text classification](https://huggingface.co/docs/transformers/en/tasks/sequence_classification) | [Audio classification](https://huggingface.co/docs/transformers/en/tasks/audio_classification) | [Image classification](https://huggingface.co/docs/transformers/en/tasks/image_classification) | [Image captioning](https://huggingface.co/docs/transformers/en/tasks/image_captioning) |
| [Token classification](https://huggingface.co/docs/transformers/en/tasks/token_classification) | [Automatic speech recognition](https://huggingface.co/docs/transformers/en/tasks/asr) | [Image segmentation](https://huggingface.co/docs/transformers/en/tasks/semantic_segmentation) | [Document Question Answering](https://huggingface.co/docs/transformers/en/tasks/document_question_answering) |
| [Question answering](https://huggingface.co/docs/transformers/en/tasks/question_answering) |  | [Video classification](https://huggingface.co/docs/transformers/en/tasks/video_classification) | [Visual Question Answering](https://huggingface.co/docs/transformers/en/tasks/visual_question_answering) |
| [Causal language modeling](https://huggingface.co/docs/transformers/en/tasks/language_modeling) |  | [Object detection](https://huggingface.co/docs/transformers/en/tasks/object_detection) | [Text to speech](https://huggingface.co/docs/transformers/en/tasks/text-to-speech) |
| [Masked language modeling](https://huggingface.co/docs/transformers/en/tasks/masked_language_modeling) |  | [Zero-shot object detection](https://huggingface.co/docs/transformers/en/tasks/zero_shot_object_detection) |  |
| [TranslationSummarization](https://huggingface.co/docs/transformers/en/tasks/translation) |  | [Zero-shot image classification](https://huggingface.co/docs/transformers/en/tasks/zero_shot_image_classification) |  |
| [Multiple choice](https://huggingface.co/docs/transformers/en/tasks/multiple_choice) |  | [Depth estimation](https://huggingface.co/docs/transformers/en/tasks/monocular_depth_estimation) |  |
|  |  | [Image-to-Image](https://huggingface.co/docs/transformers/en/tasks/image_to_image) |  |
|  |  | [Mask Generation](https://huggingface.co/docs/transformers/en/tasks/mask_generation) |  |
|  |  | [Knowledge Distillation for Computer Vision](https://huggingface.co/docs/transformers/en/tasks/knowledge_distillation_for_image_classification) |  |


These sections aim to provide a comprehensive overview and easy access to explore and utilize the potential of AI across a broad spectrum of applications and research areas.

### Research-Focused AI Tools



**AI-Powered Research Assistants**

| Tool Name                                     | Description                                                                                                   | Application in Research                                                  |
|------------------------------------------------|---------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------|
| [NotebookLM](https://notebooklm.google.com/)            | An AI-first notebook designed to help users summarize information, understand complex ideas, and brainstorm new connections. | Ideal for synthesizing facts and generating document guides.              |
| Other Tool                                    | Description of the tool                                                                                       | How it assists in specific research tasks                                |

### Development Tools for AI Innovation

**LangChain: Language Model Applications**

| Tool Name                                     | Description                                                                                                 | Usage in AI Development                                                  |
|------------------------------------------------|-------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------|
| [LangChain](https://python.langchain.com/docs/get_started/introduction)                                | A framework for building applications around language models, simplifying embedding, tokenization, and more. | Facilitates the creation and deployment of LLM-based applications.       |
| [Vector Stores](https://docs.flowiseai.com/integrations/langchain/vector-stores)                            | Solutions for storing and retrieving vectors, essential for models like RAG.                               | Enhances the efficiency of retrieval-augmented generation models.        |
| [Embedding Tools](https://docs.flowiseai.com/integrations/langchain/embeddings)                          | Tools for creating vector embeddings of textual data.                                                       | Used in processing text for NLP models and improving model understanding. |
| [Tokenization Libraries](https://smltar.com/tokenization.html)                   | Libraries that support the conversion of text into tokens, suitable for language models.                    | Essential for preparing data for training and fine-tuning AI models.      |
| [Fine-Tuning & Hosting](https://medium.com/@gkarthikkumar517/fine-tuning-of-llms-in-gcp-vertex-ai-a8afb86a3511)                    | Tools for customizing pre-trained models and hosting them for inference.                                    | Allows for the customization and deployment of AI models for specific tasks. |



---

### Image & Video Generation Resources

Dive into the forefront of AI-driven creativity with tools designed for generating stunning images and videos. These platforms offer innovative solutions, from creating detailed artworks to producing dynamic videos, catering to a range of creative needs. This section highlights some of the most advanced tools available for artists, creators, and researchers looking to explore the limits of digital creativity and automated content creation.

##### **Image Generation**

Explore the latest in AI-powered image generation, where these tools leverage deep learning models to transform textual descriptions into vivid, high-resolution images. From generating unique artworks to designing specific visuals, these platforms enable an unprecedented level of creative expression.

| AI Tool                                      | Application               | Description                                                                                               |
|----------------------------------------------|---------------------------|-----------------------------------------------------------------------------------------------------------|
| [DALL·E 3](https://openai.com/dall-e-3)      | Image Generation          | Generates high-quality images from textual descriptions, offering unparalleled creative freedom.          |
| [Stable Diffusion](https://stability.ai/)    | Image Synthesis           | State-of-the-art image synthesis from user inputs, perfect for creating detailed and imaginative visuals. |
| [MidJourney](https://www.midjourney.com/)    | Artistic Image Creation   | Creates artistic images and visualizations based on textual descriptions, blending art and AI.            |

##### **Video Generation**

The realm of video generation is being transformed by AI, making it possible to produce engaging and dynamic videos from simple descriptions. These tools are revolutionizing content creation, offering new ways to create educational, entertaining, and promotional videos with minimal effort.

| AI Tool                                      | Application               | Description                                                                                              |
|----------------------------------------------|---------------------------|----------------------------------------------------------------------------------------------------------|
| [Kaiber AI](https://kaiber.ai/)             | Video Generation          | Transforms textual descriptions into engaging videos, simplifying content creation.                      |
| [DeepBrain AI](https://www.deepbrain.io/)   | Video Synthesis           | Produces lifelike AI-generated videos, including virtual human content, for a range of applications.     |
| [OpenAI's Sora](https://openai.com/sora)     | Video Generation          | (Upcoming) Promises to revolutionize video creation with AI, generating videos from descriptions.        |

##### **Music Generation**

AI is also making waves in the music industry, enabling creators to generate unique compositions, experiment with sound, and even innovate in the realm of music production. These tools provide a new avenue for musical exploration and creativity.

| AI Tool                                      | Application               | Description                                                                                              |
|----------------------------------------------|---------------------------|----------------------------------------------------------------------------------------------------------|
| [Suno.ai](https://app.suno.ai/)              | Music Generation          | Empowers users to create unique music compositions using AI, making music creation accessible to all.    |
| [Google's Magenta](https://magenta.tensorflow.org/) | Music & Art Innovation | A research project exploring the role of AI in the process of creating art and music.                    |
| [Google Labs' Music FX](https://labs.google/experiments/) | Music Effects & Tools    | Offers a suite of experimental music tools and effects designed to expand creative possibilities through AI. |

##### **Voice Cloning and Synthesis**

Voice cloning and synthesis technologies are breaking new ground, offering tools to create realistic and customizable voiceovers and audio content. From enhancing accessibility to enabling more natural and engaging user experiences, these tools are at the forefront of audio innovation.

| AI Tool                                      | Application               | Description                                                                                          |
|----------------------------------------------|---------------------------|------------------------------------------------------------------------------------------------------|
| [ElevenLabs](https://elevenlabs.io/speech-synthesis) | Voice Cloning & Synthesis | Offers revolutionary voice cloning and synthesis capabilities, ideal for creating lifelike audio from text. |

These LLM resources are designed to push the boundaries of digital creativity and audio production, providing researchers, artists, and developers with powerful tools to explore new realms of audio-visual expression. Whether you're looking to generate unique musical pieces or clone voices for various applications, these platforms offer the technology and flexibility to bring your visions to life.

---

## Useful Links & Resources

- [Hugging Face](https://huggingface.co/) - A platform for collaborative AI model development and sharing.
- [UCR Research Computing Knowledge Base](#) - Find specific examples and tutorials tailored to UCR's research computing environment.

---