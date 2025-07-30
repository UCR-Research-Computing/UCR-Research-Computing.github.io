---
id: research-security
title: Security
sidebar_label: Security
---

<img src="../assets/research-security.png" alt="Banner Image" style="width: 100%; object-fit: scale-down; height: auto; max-height: 400px;">

## Research Security

At the University of California, Riverside (UCR), ensuring the security of research data is a priority. We work closely with UCR's Information Security Team to provide comprehensive consulting services on securing your research projects. Our goal is to ensure that all research activities meet the highest standards of data security, complying with relevant regulations and university policies. Understanding and adhering to records retention policies is also a critical component of responsible data management. For guidance, please refer to the [UC Riverside Research Records Retention: A Quick Guide for Researchers](./ucr_research_records_retention_guide.md).

We assist researchers in several key areas:

- **Understanding Your Research Security**: We delve into the specifics of your research to identify any applicable regulations, requirements, and necessary controls.
- **Data Security Plan**: We aid in developing a Data Security Plan for your project. The DSP outlines Roles, Responsibilities, Policies, Processes, and Controls essential for safeguarding your data.
- **Implementation**: Our team is here to help implement the plans or controls developed, ensuring your research data is secure.

We encourage researchers to connect with the Research Computing Team to explore how we can support your data security needs.

<details>

<summary>A Guide to the Safe and Secure Use of Artificial Intelligence in Research</summary>

### Introduction
Artificial Intelligence (AI) presents transformative opportunities for research across all disciplines at UC Riverside. From analyzing vast datasets to generating novel hypotheses, AI tools can accelerate discovery and innovation. However, the use of AI also introduces new challenges related to data security, privacy, and research integrity.
This document provides a comprehensive guide for all UCR researchers on the approved use of AI models and infrastructure. It is designed to help you navigate the complexities of using AI in your work while ensuring compliance with University of California policies, particularly the UC Information Security Policy IS-3, and protecting the confidentiality and integrity of of your research data.

### Approved AI Models
Researchers have access to a wide range of AI models. The appropriate model for your research will depend on your specific needs, the nature of your data, and the approved infrastructure you are using.

#### Closed-Source Models
**Gemini (via Google Cloud):** Google's Gemini family of models is approved for use within the UCR-managed Google Cloud environment ("Ursa Major"). These models offer state-of-the-art capabilities for a variety of tasks.
*Data Privacy:* When used within the UCR Google Cloud environment, your data is not used to train Google's models, and your prompts and data remain within the UCR tenant.

#### Open-Source Models
**Via Vertex AI Model Garden on Google Cloud:** UCR's "Ursa Major" Google Cloud environment provides access to a curated list of open-source models through the Vertex AI Model Garden. This is the recommended way to use open-source models for most research.
**On-Premise (HPCC or a private system):** Researchers can run open-source models on the UCR High-Performance Computing Center (HPCC) or on their own secure, departmentally-managed systems.

### What is Vertex AI?
Vertex AI is Google Cloud's unified machine learning (ML) platform, designed to help researchers and developers build, deploy, and scale ML models more efficiently. It provides a comprehensive suite of tools that support the entire ML lifecycle, from data preparation to model deployment and management, all within a single interface. For UCR researchers, it is the primary gateway to accessing advanced AI capabilities on Google Cloud.

**Key Capabilities of Vertex AI:**
- **Unified Environment:** It brings together all of Google's cloud services for building ML under one roof, eliminating the need to piece together separate services.
- **Data Preparation & Labeling:** Provides tools to ingest, analyze, and prepare your datasets for training, including data labeling services to create high-quality training data.
- **AutoML & Custom Training:** Researchers can use AutoML to automatically train high-quality models with minimal effort and ML expertise, or use Custom Training to have full control over the model architecture and training process using popular frameworks like TensorFlow, PyTorch, and Scikit-learn.
- **Model Garden:** As mentioned, this is a central repository of pre-trained and open-source models (including from Hugging Face) that can be easily deployed or fine-tuned for specific research tasks.
- **MLOps Tools:** Vertex AI includes a robust set of MLOps (Machine Learning Operations) features, such as pipelines for automating workflows, a model registry for versioning and management, and monitoring tools to track model performance and detect drift. This helps ensure that your research is reproducible, scalable, and manageable over time.
- **Generative AI Studio:** A dedicated environment within Vertex AI for prototyping and customizing generative AI models like Gemini. Researchers can design prompts, tune models with their own data, and deploy them for use in applications.

By leveraging Vertex AI, UCR researchers can significantly accelerate their research workflows, moving from idea to production-ready model faster and with greater ease.

### Approved Infrastructure and Data Usage
The infrastructure you use to run AI models is directly tied to the level of data protection required for your research. The following table outlines the approved configurations and the corresponding data protection levels they are cleared to handle.

| Infrastructure | Approved Models | P1 Data | P2 Data | P3 Data | P4 Data |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **UCR "Ursa Major" Google Cloud** | Gemini, Vertex AI Model Garden | ✅ | ✅ | ✅ | ⚠️ |
| **UCR High-Performance Computing Center (HPCC)** | Open-Source Models | ✅ | ✅ | ✅ | ❌ |
| **Researcher/Department-Managed Systems** | Open-Source Models | ✅ | ✅ | ⚠️ | ❌ |

**⚠️ Important Considerations:**
- **P4 Data on Google Cloud:** Using P4 data with AI models on Google Cloud requires a formal risk assessment and the implementation of specific security controls, such as data de-identification and the use of a secure, compliant environment. You must consult with the UCR Information Security Office before using P4 data with any AI model.
- **P3 Data on Researcher Systems:** Using P3 data on a researcher or department-managed system requires a robust security plan that meets the requirements of IS-3. This includes, but is not limited to, data encryption, access controls, and regular security patching. Consult with your department's IT lead and the Information Security Office.
- **Export Control:** Research data subject to export control regulations has specific handling requirements. If your research involves such data, you must consult with the Office of Research Integrity.

### Safe Storage of Research Data
Properly storing your data is as important as choosing the right AI model and infrastructure. The appropriate storage solution depends on the Protection Level of your data.

| Protection Level | Approved Storage Solutions | Key Considerations |
| :--- | :--- | :--- |
| **P1 / P2** | UCR Google Drive, UCR OneDrive, HPCC Storage, Departmental Servers | These solutions are suitable for data that is public or for internal use. |
| **P3** | UCR Google Drive (with appropriate sharing restrictions), HPCC Storage, Secure Departmental Servers | Requires strict access controls. Data should only be shared on a "need-to-know" basis. Encryption is mandatory. |
| **P4** | Must be approved by the Information Security Office. Typically requires a dedicated, secure environment like a secured enclave within Google Cloud or a physically secured, encrypted server. | Do not store P4 data in standard cloud storage or on unencrypted devices. A formal Data Security Plan and risk assessment are required. |

**General Best Practices for All Data Levels:**
- **Encryption:** All devices used to store or access P2, P3, and P4 data (laptops, external drives) must be encrypted.
- **Access Control:** Use the principle of least privilege. Only grant access to individuals who absolutely require it for their research duties.
- **Data Minimization:** Collect and retain only the data that is essential for your research.
- **Secure Deletion:** When data is no longer needed, ensure it is disposed of securely according to university policy.

### Getting Started
- For access to UCR's "Ursa Major" Google Cloud environment, please contact Research Computing at research-computing@ucr.edu.
- For access to the HPCC, please visit the HPCC website for information on getting an account.
- For questions about data classification and security, please contact the UCR Information Security Office.

### Conclusion
AI offers powerful tools to enhance our research capabilities. By following these guidelines, we can leverage these tools responsibly, ensuring the security and integrity of our research and the data we are entrusted to protect. Information Technology Solutions (ITS) is committed to supporting the research community in this endeavor. We encourage you to reach out with any questions or for assistance in navigating the use of AI in your work.

### Appendix: Available Models in Vertex AI Model Garden
This list is a sample of the models available and is subject to change. In addition to the models listed below, Vertex AI Model Garden provides access to thousands of the most popular models from Hugging Face for easy installation and use. For the most current list, please consult the Vertex AI Model Garden directly within the Google Cloud console.

#### Foundation Models
**Google Models**
- Gemini 2.5 Flash-Lite: Most balanced Gemini model for low latency use cases.
- Gemini 2.5 Pro: Strongest model quality, especially for code & complex prompts.
- Gemini 2.5 Flash: Best for balancing reasoning and speed.
- Gemini 2.0 Flash-Lite: Our cost-effective Gemini model to support high throughput.
- Gemini 2.0 Flash: Workhorse model for all daily tasks.
- Gemini 1.5 Pro: Created to be multimodal (text, images, videos) and to scale across a wide range of tasks.
- Gemini 1.5 Flash: The best performing Gemini model with features for a wide range of tasks.
- Gemini 1.0 Pro & Pro Vision: Designed to balance quality, performance, and cost for various tasks including multimodal (text, images, code) applications.
- Gemma Family (Gemma 3n, MedGemma, Gemma 3, ShieldGemma 2, Gemma 2, PaliGemma, CodeGemma, T5Gemma, TxGemma): Lightweight, state-of-the-art open models from Google for various specialized tasks.
- Imagen Family (4 Ultra, 4 Fast, 4, 2, Product Recontext, Virtual Try-On): A suite of models for high-quality image generation, editing, and customization.
- Lyria 2 for Music Generation: Generates high-quality instrumental music from text.
- PaLM 2 (Chat Bison, Text Bison, Text Unicorn): Models designed for natural conversation and single-turn instruction tasks.
- Codey (Code Chat, Code Generation, Code Completion): A family of models specialized for code-related assistance.
- Chirp 2: A multilingual model for speech-to-text transcription.
- Health & Science Models (HeAR, Path Foundation, Derm Foundation, CXR Foundation): Foundation models that produce embeddings for specialized health and science data (acoustic, pathology, dermatology, chest X-rays).
- Other Google Models (WeatherNext, TimesFM, Embeddings for Text/Multimodal): Specialized models for weather forecasting, time-series forecasting, and generating data embeddings.

**Third-Party & Open-Source Models**
- Anthropic - Claude Family (Opus 4, Sonnet 4, 3.7 Sonnet, 3.5 Sonnet, 3 Haiku): A range of powerful models from Anthropic, excelling in tasks from coding and research to fast, user-facing chatbots.
- Meta - Llama Family (Llama 4, 3.1, 3.3, 3.2, 3, 2, Guard, Prompt Guard, Code Llama): State-of-the-art open large language models from Meta, available as both APIs and for self-deployment.
- Mistral (OCR, Codestral, Small 3.1, Large, Mixtral, 7B & Nemo): A family of efficient and high-performing models from Mistral AI for various tasks including OCR and code generation.
- AI21 Labs - Jamba Family (Large 1.6, 1.5 Large, 1.5 Mini): Powerful models with very large context windows, optimized for long-form input, accuracy, and speed.
- Microsoft - Phi Family (Phi-4, Phi-3): Explore and build with Microsoft's Phi models.
- Stability AI (Stable Diffusion XL Lightning, XL LCM, XL, v2.1, 4x-upscaler, Inpainting): A suite of popular latent diffusion models for fast, high-fidelity text-to-image generation and editing.
- Other Notable Models:
  - Image Generation: Flux, HiDream-I1, Instant ID
  - Speech & Audio: Sesame CSM, MARS7, Dia-1.6B, Whisper Large
  - Multimodal & Vision: CogVideoX-2b, MaMMUT, LLaVA, OWL-ViT, CLIP, BLIP
  - Specialized: BioGPT (biomedical text), LayoutLM (document understanding), NLLB (translation for 200 languages)

#### Task-Specific & Pre-Built Models
**Text & Language**
- Translation LLM: The best performing translation model, fine-tuned from Gemini specifically for translating text between languages.
- Text Translation: Use Google's proven pre-trained text model to get text translations for 100+ languages.
- Text Moderation: Analyzes a document and returns a list of harmful and sensitive categories.
- Syntax analysis: Extracts linguistic information, breaking up text into sentences and tokens.
- Entity sentiment analysis: Identifies the prevailing emotional opinion of an entity within the text.
- Sentiment analysis: Determines the overall attitude (positive or negative) expressed within the text.
- Content classification: Analyzes text content and returns content categories for the content (supports over 1,000 categories).
- Entity analysis: Inspects text to identify and label persons, organizations, locations, events, products and more.

**Code**
- Codestral: A cutting-edge model specifically designed for code generation, including fill-in-the-middle and code completion.
- Qodo-Embed-1-7B: A suite of large-scale code embedding models for efficient code & text retrieval.

**Video Analysis**
- Video Speech Transcription: Transcribes speech in video files.
- Video Text Detection: Detects visible text in video files.
- MoViNet Video Action Recognition/Clip Classification: Efficient models for video classification tasks.
- Bytetrack Multi-Object Tracking: Detects, identifies, and tracks objects across video frames.
- Person blur: Masks or blurs a person's appearance in video.
- PPE detector: Identifies people and personal protective equipment (PPE).
- Object detector: Identifies and locates objects in video.
- Person/vehicle detector: Detects and counts people and vehicles in video.
- Occupancy analytics: Detects people and vehicles, plus zone detection, dwell time, and more.

**Image Analysis**
- BiomedCLIP: Zero-shot image classification with the BiomedCLIP biomedical vision-language foundation model.
- Pic2Word Composed Image Retrieval: A state-of-the-art image retrieval model.
- Watermark detector: Detects watermarks in an input image.
- Text detector (Vision API): Detects and extracts text from images using OCR.
- Face detector (Vision API): Detects multiple faces and provides bounding polygons and facial landmarks.
- Content moderation (Vision): Detects objectionable or unwanted content across predefined or custom labels.
- Tag recognizer: Extracts text in product and price tags.
- Product recognizer: Identifies products at the GTIN or UPC level.

**Document AI**
- Form Parser: Extracts key-value pairs, checkboxes, and tables from documents in over 200+ languages.
- Document AI OCR processor: Identifies and extracts text from documents in over 200 printed and 50 handwritten languages.
- Tabular Data
- TabNet: A general model which performs well on a wide range of classification and regression tasks.
- AutoML Tabular Workflow: A complete AutoML pipeline for classification and regression tasks.


</details>

#### Understanding your Research Security

Understanding and adhering to security policies and regulations is critical for safeguarding research data at UCR. All research data falls under a classification of security level ranging from P1 to P4, refer to the detailed descriptions of each level on the UCOP Security Classification page: [UCOP Information Security Classification Standards](https://security.ucop.edu/policies/institutional-information-and-it-resource-classification.html):
- **P1/P2** involving data without Personal Identifiable Information (PII)—P1 being public and P2 internal.
- **P3/P4** categories deal with data containing PII, necessitating a [Security Plan](https://docs.google.com/document/d/17oO97C_AtGzAsno6se8MYcZlqfiv3BpvPurFnVosi_0/edit?usp=sharing), where P3 is classified as sensitive and P4 as confidential.

By default, the systems we build and manage at UCR Research Computing are designed to comply with the UC IS-3 policy at the P2 level, ensuring a robust foundation for data security and integrity. While our infrastructure supports projects up to P4 level, accommodating the highest levels of data sensitivity, it is important to note that we do not support the handling of US classified data.

Our team provides guidance on key standards including, but not limited to, the UC IS-3 policy, external regulations from data providers, and state and federal guidelines. Here is an overview of the frameworks we adhere to and guide our research community in complying with:

- **UC IS-3**: As part of the UC system, we adhere to the [University of California's policy on information security](http://policy.ucop.edu/doc/7000543/BFB-IS-3), setting forth standards for protecting institutional and personal information across all UC campuses. This internal policy mandates a proactive approach to information security management, risk assessment, and incident response.
- **External Requirements**: Beyond the UC's internal IS-3 policy, research projects may need to comply with external security requirements from specific data providers (e.g., Cal-Edison, Department of Education), state health departments, or regulations like NIST-800-171 and CMMC. These are crucial for projects that involve data from outside entities with their own security policies.
    - **[CMMC (Cybersecurity Maturity Model Certification)](https://dodcio.defense.gov/CMMC/Model/)**: Protects the defense industrial base from cybersecurity threats. It outlines cybersecurity standards and best practices for defense-related information and technologies.    
    - **[NIST 800-171](https://www.nist.gov/blogs/manufacturing-innovation-blog/what-nist-sp-800-171-and-who-needs-follow-it-0)**: Guidelines for protecting controlled unclassified information (CUI) in non-federal systems, ensuring data security practices align with federal standards.    
    - **[NSPM-33](https://trumpwhitehouse.archives.gov/presidential-actions/presidential-memorandum-united-states-government-supported-research-development-national-security-policy/)**: Focuses on securing systems related to National Security, Defense, and the Intelligence Community against espionage and theft.
    
Adherence to these standards is essential for maintaining the integrity and security of research activities at UCR. Our team is available to assist researchers in understanding these regulations and implementing the necessary security measures to comply with them. For more guidance or to discuss how these standards apply to your research, please reach out to our support team.

#### Data Security Plan (DSP)

<div style="float: right; margin-left: 20px; margin-bottom: 10px; max-width: 50%;">
  <img src="../assets/dsp.jpg" alt="Researchers discussing the Research Data Security Plan" style="width: 100%; object-fit: scale-down; height: auto; max-height: 360px;">
</div>

At UCR Research Computing, we understand the critical importance of safeguarding your research data. To this end, we offer assistance in developing a **Data Security Plan (DSP)** tailored to your project's specific needs. A DSP is a comprehensive document that outlines the Roles, Responsibilities, Policies, Processes, and Controls essential for the protection of your data. It serves as a blueprint to ensure that your research is conducted securely, in compliance with relevant standards, and with the utmost safety.

For research projects classified under **P3** and **P4** levels—which involve sensitive data containing **Personal Identifiable Information (PII)** necessitating a security plan—we adhere to a detailed template to guide the creation of your DSP. This template is designed with the aim of securing the highest levels of data sensitivity and ensuring compliance with both internal and external security requirements.

- **[UCR Data Security Plan Template](https://docs.google.com/document/d/17oO97C_AtGzAsno6se8MYcZlqfiv3BpvPurFnVosi_0/edit?usp=sharing):** 
Our template facilitates the creation of Data Security Plans at UCR, providing a structured approach to identify and mitigate risks associated with handling sensitive data. 

For projects classified under **P1** and **P2** levels, which involve data without Personal Identifiable Information (PII), **nothing is requiered**. We are building a streamlined and modified version of the DSP template. This adaptation reflects the reduced risk and security requirements associated with these levels of data sensitivity.

Our commitment at UCR Research Computing extends to collaborating closely with your lab and the UCR Information Security Office (ISO) team. This collaboration ensures that we provide comprehensive support in planning and conducting your secure research as smoothly and efficiently as possible.
    
#### Research Security Resources:

- **[UCR Data Security Plan Template](https://docs.google.com/document/d/17oO97C_AtGzAsno6se8MYcZlqfiv3BpvPurFnVosi_0/edit?usp=sharing)**: A template designed for use at UCR to facilitate the creation of comprehensive Data Security Plans.
- **[UC Data Protection Level Classification](https://security.ucop.edu/policies/institutional-information-and-it-resource-classification.html)**: UC's established classifications for the protection level of information and IT resources, guiding researchers on the security measures needed for their data.
- **[Cloud Services Protection Level Handout](https://drive.google.com/file/d/1SFxCeJL0GebFgBNwvwda37ucCHx5Is__/view?usp=sharing)**: An overview of the protection levels applicable to cloud services, ensuring researchers choose the right platforms for their data security requirements.
- **[CMMC (Cybersecurity Maturity Model Certification)](https://dodcio.defense.gov/CMMC/Model/)**: A framework designed to protect the defense industrial base from cybersecurity threats. CMMC outlines a comprehensive range of cybersecurity standards and best practices to ensure the security and resilience of defense-related information and technologies.
- **[UC IS-3](http://policy.ucop.edu/doc/7000543/BFB-IS-3)**: The University of California's policy on information security, which sets forth the standards for protecting institutional and personal information across all UC campuses. This policy mandates a proactive approach to information security management, risk assessment, and incident response.
- **[NIST 800-171](https://www.nist.gov/blogs/manufacturing-innovation-blog/what-nist-sp-800-171-and-who-needs-follow-it-0)**: Provides guidelines for protecting controlled unclassified information (CUI) in non-federal systems and organizations. NIST 800-171 is critical for research projects that handle sensitive information, ensuring that data security practices align with federal standards for information confidentiality, integrity, and availability.
- **[NSPM-33](https://trumpwhitehouse.archives.gov/presidential-actions/presidential-memorandum-united-states-government-supported-research-development-national-security-policy/)**: A National Security Presidential Memorandum focused on improving the security of systems related to National Security, Defense, and the Intelligence Community. NSPM-33 emphasizes the importance of securing research and development activities against espionage, theft, and exploitation.



#### Computing Resources and Security Classifications

| Resource Type | Resource | Description | Top Security Classification | Remarks |
|---------------|----------|-------------|-----------------------------|---------|
| Compute | **High-Performance Computing Center (HPCC)** | A key resource for intensive computational tasks. | P3 | Suitable for a broad range of research workflows. |
| Compute | **NSF Compute Resources** | Advanced computing systems and services provided by the NSF. | Varies | Accessibility to national-scale computational infrastructure. |
| Compute | **Cloud Computing** | Offers a wide range of computational resources including on-demand HPC clusters. | P4 | Requires all security controls to be in place. |
| Compute | **Sherlock Cloud** | A secure, managed cloud platform designed to meet stringent security requirements. | FISMA, HIPAA, & NIST CUI | Operated by the San Diego Supercomputer Center. |
| Compute | **On-Prem Solutions** | Department-specific VMs, file sharing services, and physical computing resources. | P4 | Supports sensitive data with appropriate security measures. |
| Storage | **Google Drive & Ursa Major Secure Research Storage** | Cloud-based storage solutions for collaboration and secure data storage. | P4 | UCR-subsidized resources for secure, scalable storage. |
| Storage | **GCS & AWS S3** | Scalable and secure cloud storage solutions for a wide range of data types. | P4 | Supports sensitive data up to P4 with proper security controls. |
| Storage | **HPCC-GPFS Cluster Storage** | High-performance cluster storage attached to the HPCC. | P3 | High-speed, parallel computing storage suitable for compute-intensive tasks. |
| Storage | **Ceph Secure Research Storage** | Scalable, resilient storage solution designed for diverse research needs. | P3 | Upcoming enhancement to UCR's research computing infrastructure. |
| Storage | **Dryad** | Platform for publishing and archiving research data for enhanced discoverability. | Public | Focused on open science and data sharing. |
| Storage | **Backup Solutions (e.g., CrashPlan)** | Services for data protection and disaster recovery. | P4 | Ensures data safety and integrity across research projects. |


#### Collaboration for Security

Collaborating with UCR's Research Computing Team ensures that your research projects are secure and compliant with the latest data protection standards. Our team is dedicated to supporting UCR researchers in navigating the complexities of research security, offering tailored solutions that meet the unique needs of each project.
