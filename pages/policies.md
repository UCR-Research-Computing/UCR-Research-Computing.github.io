---
id: guidelines
title: Guidelines
sidebar_label: Guidelines
---

# Guidelines

Welcome to the University of California, Riverside (UCR) Research Computing Guidelines page. Here, you'll find a comprehensive guide to the Guidelines and procedures governing the use of research computing resources at UCR. Our aim is to support our vibrant research community by providing clear guidelines on access to High-Performance Computing (HPC) resources, cloud computing services, data management practices, and much more. These Guidelines are designed to ensure that all researchers have the tools and information they need to conduct their work efficiently, securely, and in compliance with both university and federal regulations. Whether you're looking to leverage the power of UCR's HPC clusters, access cloud platforms like Google Cloud Platform (GCP) and Amazon Web Services (AWS), or understand your responsibilities regarding data management, you'll find all the necessary information here. Additionally, we offer insights into the support structures in place to assist you with your computing needs, from system administration to grant collaboration and lab support. For the latest updates and more detailed information, we invite you to explore our dedicated Research Computing website and discover how our Guidelines and resources can enhance your research endeavors at UCR.

## Compute Resource Guidelines

- [**HPCC Guideline**](https://hpcc.ucr.edu/about/overview/introduction/): Access to High-Performance Computing (HPC) resources is based on project needs, prioritizing research impact and computational demand. Cloud computing services are offered in partnership with major providers, including tailored solutions and discounted rates.
- [**UCR-Ursa Major Guideline**](../Knowledge_Base/Ursa_Major_Policy.md): Provides no-cost access to baseline Google Cloud Platform (GCP) resources (Tier 1) for research projects demonstrating significant potential for innovation. **Note:** High-performance, GPU, and massive-scale workloads operate on a direct recharge model (Tier 2) or should utilize our on-premise HPCC. Projects are selected through an internal review process, focusing on the potential impact and innovative use of cloud resources.
- [**NSF ACCESS**](https://allocations.access-ci.org/allocations-policy): UCR researchers can access a range of National Science Foundation (NSF) computing resources, including those offered through the ACCESS program. This policy describes the process for applying for and managing allocations on NSF-funded infrastructure, aiming to support advanced computational research.
- [**Nautilus**](https://docs.nationalresearchplatform.org/): As part of the Pacific Research Platform, Nautilus offers UCR researchers access to Kubernetes-managed computing resources, facilitating large-scale data analysis and sharing across the research community. This platform supports a variety of research projects, especially those requiring collaborative efforts and significant data processing capabilities.
- [**GCP and AWS not under Ursa Major**](./gcp_aws_edp.md): For projects not covered under the Ursa Major Guidelines, UCR offers guidance and support for accessing Google Cloud Platform (GCP) and Amazon Web Services (AWS) through direct partnerships. This includes information on educational discounts, enterprise agreements, and best practices for leveraging these cloud services in research projects, ensuring researchers can efficiently manage and scale their computational resources outside the Ursa Major initiative.

These Guidelines collectively ensure that UCR researchers have comprehensive access to a wide array of computing resources, from high-performance computing clusters and cloud platforms to NSF-funded resources and collaborative computing networks, all supported by detailed guidelines and support structures.

## Data Management Guidelines

- [**Data Solutions and Plans**](./storage-overview.md#storage-overview): At the University of California, Riverside (UCR), we align our research computing storage infrastructure with the highest standards of the American Association of Universities (AAU). Our commitment is to offer advanced storage solutions that meet the diverse needs of our research community, foster innovation, and enhance collaboration. Our strategy includes enhancing research productivity, ensuring data integrity and security, and promoting open science and collaboration. For a detailed overview, including a comparison of available storage solutions, view the [Storage Solutions Comparison Sheet](https://ucr-research-computing.github.io/pages/storage-overview.html#storage-overview).
- [**UC Riverside Research Records Retention: A Quick Guide for Researchers**](./ucr_research_records_retention_guide.md): Provides essential information for UCR researchers on understanding and complying with the University of California Records Retention Schedule.
- **[UC Research Data Policy](https://policy.ucop.edu/doc/2500700/ResearchData)**: Reflects the long-standing principle of ownership of research data by the Regents of the University of California, as articulated in Section 020 of the Academic Personnel Manual (APM-020). This policy clarifies the ownership and responsibility for research data generated during University research, promotes active data management and sharing practices, and guides procedures when a University Researcher leaves the University.

## Support Guidelines

- [**Research Computing System Administration Service (RCSAS)**](./research_infrastructure_support.md): Offers system design consultation, performance optimization, and security compliance checks. Tiered support ensures basic assistance for all projects and advanced support for those with specialized needs.
- [**Research Facilitation and Training**](./research_facilitation.md): Provides workshops and training sessions on a variety of topics, from basic computing to advanced machine learning. Personalized advice on computing strategies, software selection, and workflow optimization is available by appointment.
- [**Grant Collaboration**](./grant_colab.md): Assists researchers in incorporating computing resources into grant proposals, offering support in drafting computational methodologies, estimating resource needs, and ensuring proposals are competitive.
- [**Lab Support**](./lab-support.md): Tailored to meet the specific computational needs of research labs, including software installations, configuration of computing clusters, and data storage solutions. This service also offers troubleshooting and periodic reviews to align with evolving research demands.

## Security Guidelines

- **Security Guidelines and Regulations**: UCR's research computing environment are designed to align with several key security standards to protect sensitive data:
    - **[CMMC (Cybersecurity Maturity Model Certification)](https://dodcio.defense.gov/CMMC/Model/)**: A framework designed to protect the defense industrial base from cybersecurity threats. CMMC outlines a comprehensive range of cybersecurity standards and best practices to ensure the security and resilience of defense-related information and technologies.
    - **[UC IS-3](https://policy.ucop.edu/doc/7000543/BFB-IS-3)**: The University of California's policy on information security, which sets forth the standards for protecting institutional and personal information across all UC campuses. This policy mandates a proactive approach to information security management, risk assessment, and incident response.
    - **[NIST 800-171](https://www.nist.gov/blogs/manufacturing-innovation-blog/what-nist-sp-800-171-and-who-needs-follow-it-0)**: Provides guidelines for protecting controlled unclassified information (CUI) in non-federal systems and organizations. NIST 800-171 is critical for research projects that handle sensitive information, ensuring that data security practices align with federal standards for information confidentiality, integrity, and availability.
    - **[NSPM-33](https://trumpwhitehouse.archives.gov/presidential-actions/presidential-memorandum-united-states-government-supported-research-development-national-security-policy/)**: A National Security Presidential Memorandum focused on improving the security of systems related to National Security, Defense, and the Intelligence Community. NSPM-33 emphasizes the importance of securing research and development activities against espionage, theft, and exploitation.


## Service Level Agreements (SLAs)

- **SLA Overview**: Defines expectations for major services, including uptime guarantees for HPC resources, response times for cloud services, resolution times for RCSAS support requests, and post-session support for training services.


| Service                 | Availability/Uptime       | Response Time          | Resolution Time        | Additional Support                          |
|-------------------------|---------------------------|------------------------|------------------------|---------------------------------------------|
| **HPC Resources**       | 99% uptime, excluding scheduled maintenance. | Within 4 hours for critical issues. | Critical issues resolved within 1 business day; non-critical within 5 business days. | Scheduled consultation for optimization every 6 months. |
| **Cloud Services**      | 99.5% uptime for critical services. | Within 24 hours for critical issues; within 72 hours for non-critical. | Critical issues resolved within 2 business days; non-critical within 7 business days. | Access to cloud management tools and best practices workshops. |
| **RCSAS Support**       | N/A | Initial response within 1 business day. | Standard requests resolved within 3 business days; complex issues may take up to 10. | Ongoing system performance monitoring and alerts. |
| **Training & Facilitation** | N/A | Registration confirmation within 1 business day. | Post-session support for up to two weeks for follow-up questions. | Access to recorded sessions and materials post-workshop. |
| **Grant Collaboration** | N/A | Acknowledgement within 2 business days of receiving request. | Draft support documents provided within 10 business days. | Assistance in identifying potential funding opportunities. |
| **Lab Support**         | N/A | Within 1 business day for lab-specific issues. | Minor issues resolved within 3 business days; major installations/setup within 15 business days. | Periodic review of lab computing needs every 12 months. |

---

## Campus Guidelines

- **[Campus Policies](https://compliance.ucr.edu/policies)**: Guidelines and procedures are foundational at UCR.  Guidelines show us what type of place UCR is–how we are to treat one another, and how we can expect to be treated.  Guidelines and procedures show us how we are expected to do certain aspects of our jobs, and how we conduct ourselves when representing the university.


