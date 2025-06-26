---
id: nautilus
title: NRP Nautilus Cluster
sidebar_label: NRP Nautilus Cluster
---

## Overview of NRP and the Nautilus Cluster

The **National Research Platform (NRP)** is a unique partnership of over 50 institutions, led by researchers at UC San Diego, University of Nebraska-Lincoln, and the Massachusetts Green High Performance Computing Center. Supported by the National Science Foundation (NSF), Department of Energy (DOE), and Department of Defense (DoD) among others, the NRP is a community-owned research and education platform. Its mission is to connect researchers and educators, fostering collaboration, accelerating innovation, and sharing resources. The NRP provides access to cutting-edge technologies in AI, high-performance computing, data storage, and networking, available free of charge to non-profit research and education institutions. As of early 2024, the NRP connects over 400 nodes across 70+ locations on 3 continents, serving over 5,000 users.

The **NRP Nautilus Cluster** is a key component of this national infrastructure. Nautilus is a HyperCluster specifically designed for running containerized Big Data and AI applications. It leverages Kubernetes (K8S) for managing applications and Rook for Ceph data services automation. Nautilus features a diverse range of computational resources, including CPUs, GPUs (from consumer-grade to high-end AI accelerators like NVIDIA A100s and H100s), FPGAs, and a federated national-scale CDN.

**Data Policy:** The NRP Nautilus Cluster, like all NRP resources, currently has no storage suitable for HIPAA, PID, FISMA, FERPA, or protected data of any kind. **Users are not permitted to store such data on NRP machines.**

## Getting Started with Nautilus

For UCR-specific assistance or initial inquiries, please contact:
- Email: [research-computing@ucr.edu](mailto:research-computing@ucr.edu)
- Slack: [UCR Research Computing Slack](https://ucr-research-compute.slack.com/)

For general NRP support and documentation, refer to the following resources:
- **[NRP Documentation Home](https://nrp.ai/documentation/)**: The main portal for all Nautilus and NRP user guides.
- **[Getting Access to Nautilus](https://nrp.ai/documentation/userdocs/start/getting-started/)**: Steps to obtain an account and access the Nautilus cluster.
- **[Nautilus Quick Start Guide](https://nrp.ai/documentation/userdocs/start/quickstart/)**: A beginner's guide to quickly start using Nautilus.
- **[Nautilus Cluster Policies](https://nrp.ai/documentation/userdocs/start/policies/)**: Important operational policies for using the cluster.
- **[NRP Acceptable Use Policy (AUP)](https://nrp.ai/NRP-AUP.pdf)**: Overall AUP for the National Research Platform.
- **[NRP/Nautilus FAQ](https://nrp.ai/documentation/userdocs/start/faq/)**: Answers to frequently asked questions about Nautilus.
- **[General NRP FAQs](https://nrp.ai/#faqs)**: Broader questions about the National Research Platform.
- **[Glossary of Terms](https://nrp.ai/documentation/userdocs/start/glossary/)**: Definitions of common terms used in the NRP ecosystem.
- **[Asking for Support (Matrix/Chat)](https://nrp.ai/documentation/userdocs/start/support/)**: How to get help from the NRP support team.

## Using the Nautilus Cluster

This section provides links to essential documentation for leveraging the capabilities of the Nautilus Cluster.

### Core Concepts & Tutorials
- **[General Guide to Using Nautilus](https://nrp.ai/documentation/userdocs/start/using-nautilus/)**: An overview of best practices and how to effectively use the platform.
- **[Introduction to Docker and Containers](https://nrp.ai/documentation/userdocs/tutorial/docker/)**: Fundamental concepts for working with containerized applications.
- **[Basic Kubernetes on Nautilus](https://nrp.ai/documentation/userdocs/tutorial/basic/)**: Learn the basics of deploying and managing applications with Kubernetes.
- **[Working with Container Images](https://nrp.ai/documentation/userdocs/tutorial/images/)**: How to find, use, and manage container images, including [Scientific Images](https://nrp.ai/documentation/userdocs/running/sci-img/).
- **[Scheduling Pods and Jobs](https://nrp.ai/documentation/userdocs/tutorial/scheduling/)**: Understanding how to schedule your workloads effectively.
- **[Debugging Applications on Nautilus](https://nrp.ai/documentation/userdocs/tutorial/debugging/)**: Tips and techniques for troubleshooting.

### Running Computational Tasks
- **[Running GPU Pods](https://nrp.ai/documentation/userdocs/running/gpu-pods/)**: How to request and utilize GPU resources.
- **[Running Batch Jobs](https://nrp.ai/documentation/userdocs/running/jobs/)**: For non-interactive, compute-intensive tasks. See also: [Optimizing for High I/O Jobs](https://nrp.ai/documentation/userdocs/running/io-jobs/).
- **[Running CPU-only Jobs](https://nrp.ai/documentation/userdocs/running/cpu-only/)**: For workloads that do not require GPUs.
- **[Long-running Pods and Services](https://nrp.ai/documentation/userdocs/running/long-idle/)**: Guidelines for services that need to run continuously.
- **[Monitoring your Pods and Jobs](https://nrp.ai/documentation/userdocs/running/monitoring/)**: Keeping track of your resource usage and job status.
- For more advanced topics, see the full **[Running on Nautilus Documentation](https://nrp.ai/documentation/userdocs/running/)**.

### Storage on Nautilus
Nautilus offers a variety of storage solutions to meet different research needs.
- **[Storage Options Overview](https://nrp.ai/documentation/userdocs/storage/intro/)**: An introduction to the available storage types.
- **Ceph FileSystem (FS):** Provides home directories and project spaces. Accessed via `PersistentVolumeClaim` in Kubernetes. ([Details](https://nrp.ai/documentation/userdocs/storage/ceph/))
- **Ceph S3 Object Storage:** Scalable object storage compatible with the S3 API. ([Details](https://nrp.ai/documentation/userdocs/storage/ceph-s3/))
- **CVMFS (CernVM File System):** Used for distributing software and data efficiently. ([Details](https://nrp.ai/documentation/userdocs/storage/cvmfs/))
- **Local Scratch Storage:** Fast, temporary storage available on worker nodes. Data is not persistent. ([Details](https://nrp.ai/documentation/userdocs/storage/local/))
- **Data Management:**
    - **[Moving Data In and Out](https://nrp.ai/documentation/userdocs/storage/move-data/)**: Includes information on tools like `kubectl cp`, `rclone`, and [Globus Connect](https://nrp.ai/documentation/userdocs/running/globus-connect/).
    - **[Purging Data](https://nrp.ai/documentation/userdocs/storage/purging/)**: Policies and procedures for data lifecycle management.
    - **[Managing S3 Tokens/Credentials](https://nrp.ai/documentation/userdocs/storage/jwt-credential/)**.
- For other storage solutions like Linstor or Nextcloud, refer to the main **[Nautilus Storage Documentation](https://nrp.ai/documentation/userdocs/storage/)**.

### AI and Machine Learning
Nautilus is well-equipped for a wide range of AI and Machine Learning workloads.
- **[Overview of AI/ML on NRP](https://nrp.ai/documentation/userdocs/ai/)**: General information and resources.
- **[Using GPUs for AI/ML](https://nrp.ai/documentation/userdocs/running/gpu-pods/)**: Essential for training and inference.
- **[NRP Managed LLM Service](https://nrp.ai/documentation/userdocs/ai/llm-managed/)**: Access pre-configured Large Language Models.
- **[Running LLMs in JupyterHub](https://nrp.ai/documentation/userdocs/ai/llm-jupyterhub/)**: Integrate LLMs into your Jupyter environment.
- **[Using Qualcomm Cloud AI 100 Cards](https://nrp.ai/documentation/userdocs/ai/qaic/)**: For specialized AI acceleration.

### Jupyter and Interactive Computing
- **[Nautilus JupyterHub Service](https://nrp.ai/documentation/userdocs/jupyter/jupyterhub-service/)**: Easy access to JupyterLab instances.
- **[Deploying a Custom ML/Jupyter Pod](https://nrp.ai/documentation/userdocs/jupyter/jupyter-pod/)**: For tailored Jupyter environments with specific packages.
- **[Deploying Your Own JupyterHub](https://nrp.ai/documentation/userdocs/jupyter/jupyterhub/)**: For groups or classrooms needing a shared JupyterHub instance.
- **[Using Coder for an IDE-like Environment](https://nrp.ai/documentation/userdocs/coder/coder/)**: Access a VS Code-like interface in your browser. ([Deploying Coder](https://nrp.ai/documentation/userdocs/coder/deploy/))

### Development and Version Control
- **[Building Container Images in GitLab CI/CD](https://nrp.ai/documentation/userdocs/development/gitlab/)**: Automate your image building process.
- **[Using Private Container Registries/Repositories](https://nrp.ai/documentation/userdocs/development/private-repos/)**.
- **[Integrating GitLab and Kubernetes](https://nrp.ai/documentation/userdocs/development/k8s-integration/)**: Streamline your development workflow.

### Specialized Hardware and Networking
- **Using FPGAs:**
    - **[Vivado and Vitis for Xilinx FPGAs](https://nrp.ai/documentation/userdocs/fpgas/vivado-vitis/)**
    - **[ESnet SmartNIC Development](https://nrp.ai/documentation/userdocs/fpgas/esnet_development/)**
- **[Network Experiments with FABRIC Integration](https://nrp.ai/documentation/userdocs/networks/fabric/)**: For advanced networking research.

## Additional Resources & Community
- **[Deployed Services on NRP](https://nrp.ai/documentation/userdocs/start/resources/)**: Explore other tools and services available on the platform (many require separate registration).
- **NRP Cluster Dashboards & Visualizations:**
    - **[Main Dashboard](https://dash.nrp-nautilus.io/)**
    - **[Cluster Nodes Map](https://elastic-igrok.nrp-nautilus.io/login?next=/app/dashboards?auth_provider_hint=anonymous1&auth_provider_hint=anonymous1#/view/76b9b030-81d5-11eb-ad7c-1f5ec373b923?_g=(filters:!()))**
    - **[Busy Cluster Map (Traceroute View)](https://traceroute.nrp-nautilus.io/)**
- **[NRP Blog/News](https://nrp.ai/blog)**: Stay updated on the latest developments and events.
- **[Educational Use / Classroom Resources](https://nrp.ai/education)**: Information for educators wishing to use NRP in their curriculum.

The NRP Nautilus Cluster, as part of the broader National Research Platform, offers a rich set of resources and a collaborative environment to advance computational research and education.
