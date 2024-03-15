---
id: storage-overview
title: Storage Overview
sidebar_label: Storage Overview
---

## Storage Overview

# UCR Research Computing Storage Overview

## Introduction

At the University of California, Riverside (UCR), our strategic vision for research computing is aligned with the highest standards set by leading American Association of Universities (AAU). Our commitment is to provide an advanced, comprehensive storage infrastructure that supports our vibrant research community's diverse needs, fosters innovation, and enhances collaboration within and beyond campus borders.

## Strategic Goals and Objectives

Our storage strategy is crafted to support the broad spectrum of research activities at UCR, ensuring that our infrastructure not only meets current demands but is also poised for future advancements in research methodologies and data-intensive sciences. The core objectives of our storage solutions include:

- **Enhancing Research Productivity and Innovation**: By offering a variety of storage solutions, we aim to streamline research workflows, thereby accelerating discovery and innovation.
- **Ensuring Data Integrity and Security**: With a focus on secure storage options, we prioritize the protection of sensitive research data through compliance with federal regulations and university policies.
- **Promoting Open Science and Collaboration**: By facilitating easy access to data and supporting data sharing practices, we encourage collaborative research efforts and contribute to the global advancement of knowledge.

## UCR Research Storage Resources

UCR offers diverse storage solutions to meet the needs of various research projects. For a detailed comparison of available storage solutions, view the [Storage Solutions Comparison Sheet](https://docs.google.com/spreadsheets/d/e/2PACX-1vTvztWU2sZNbFEznVGUcCKwRK7xRrIUndqoDAKCWIBHPuhfUhbESQIvUMnuGM6Ugg/pubhtml?widget=true&headers=false).

### Storage Feature/Cost Matrix


| Feature                              | Ceph RDS (Proposed)                                                 | Google Drive                            | HPCC - GPFS                               | GCP (GCS)                                                                                             | AWS S3                                                                                                                                                                    | Crashplan Backup                                               |
|--------------------------------------|----------------------------------------------------------|----------------------------------------|-------------------------------------------|---------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------|
| Default Storage (free/included)      | 100GB - 1TB (based on Lab needs)                     | Faculty/Staff - 100GB, Students - 25GB  | 20GB                                      | 0                                                                                                     | 0                                                                                                                                                                          | N/A                                                            |
| Cost for additional storage          | $30/TB/year                                              | $300/10TB/mo, $3600/10TB/yr             | TB plan: $1000/10TB/yr, GB plan: $25/100GB/yr | Standard - $20/TB/mo, Nearline - $10/TB/mo, Coldline - $4/TB/mo, Archive - $1.20/TB/mo               | Standard - $23/TB/mo, Std Infreq - $12.50/TB/mo, One Zone - $10/TB/mo, Glacier Instant - $4/TB/mo, Glacier Flex - $3.60/TB/mo, Glacier Deep - $1/TB/mo                      | Essential - $3/200GB/mo, $1/100GB/mo additional, Professional - $8/Unlimited/mo |
| How to Purchase                      | Allocated based on project needs                        | Managed centrally, additional storage up to quota can be requested at no charge. | Directly from HPCC | Various options, including direct billing from Google and Subscription Service agreements. See GCP Pricing for details. | Direct purchase available with Amazon discounts. See AWS Pricing for details.                                                                                                | Direct purchase available.                                      |
| Normalized Cost for 1TB / annually   | $30                                                      | $360                                     | $100                                       | Standard - $240, Nearline - $120, Coldline - $48, Archive - $14.4 [^1][^2]                             | Standard - $276, Std Infreq - $150, One Zone - $120, Glacier Instant - $48, Glacier Flex - $43.20, Glacier Deep - $12 [^3][^4][^5]                                            | Essential - $132, Professional - $88                           |
| Replicated / backed up               | Yes (8k + 4m erasure coding)                             | Yes                                     | Yes                                       | Yes                                                                                                   | Yes                                                                                                                                                                        | Yes                                                            |
| Durability / Availability            | High (distributed across multiple data centers)          | 3, minimum                              | 3 / 3                                     | 11 / 4 (durability / availability)                                                                    | 11 / 4 (durability / availability)                                                                                                                                           | 3 / 3                                                          |
| Access protocols                     |                                                          |                                         |                                           |                                                                                                       |                                                                                                                                                                            |                                                                |
| NFS                                  | Yes                                                      | No                                      | No                                        | No                                                                                                    | No                                                                                                                                                                         | No                                                             |
| CIFS / SMB                           | Yes                                                      | No                                      | No                                        | No                                                                                                    | No                                                                                                                                                                         | No                                                             |
| S3                                   | Yes                                                      | No                                      | No                                        | Yes                                                                                                   | Yes                                                                                                                                                                        | No                                                             |
| Web / HTTP                           | No                                                       | Yes                                     | No                                        | Yes                                                                                                   | Yes                                                                                                                                                                        | No                                                             |
| FTP / SFTP / FTPS / ssh / scp / sshfs| Yes                                                      | No                                      | Yes                                       | No                                                                                                    | No                                                                                                                                                                         | No                                                             |
| Proprietary / App                    | CLI, open source clients                                 | Google Drive client, CyberDuck          | CyberDuck                                 | gsutil / gcloud CLI, CyberDuck                                                                        | Desktop client, CyberDuck                                                                                                                                                   | Crashplan App                                                  |
| Rclone supported?                    | Yes                                                      | Yes                                     | Yes                                       | Yes                                                                                                   | Yes                                                                                                                                                                        | No                                                             |
| Folder Sharing                       | Yes                                                      | Yes                                     | Yes                                       | Yes                                                                                                   | Yes                                                                                                                                                                        | No                                                             |
| Web Browser access                   | No                                                       | Yes                                     | No                                        | Yes                                                                                                   | Yes                                                                                                                                                                        | No                                                             |
| Real-time Collaboration              | No                                                       | Yes                                     | Yes                                       | No                                                                                                    | Yes                                                                                                                                                                        | No                                                             |
| File Size limit                      | No explicit limit                                        | 15GB                                    | 5TB                                       | 5TB                                                                                                   | 5TB                                                                                                                                                                         | 5TB                                                            |
| File Versioning / snapshots          | Yes                                                      | Yes                                     | No                                        | Yes                                                                                                   | Yes                                                                                                                                                                        | Yes                                                            |
| Office Integration                   | No                                                       | Yes                                     | No                                        | No                                                                                                    | No                                                                                                                                                                         | No                                                             |
| File Deletion Retention              | Configurable                                             | 30 days                                 | 30 days                                   | Yes                                                                                                   | 25 days                                                                                                                                                                     | Unlimited                                                      |
| Share files outside of UCR           | Yes                                                      | Yes                                     | Yes                                       | Yes                                                                                                   | Yes                                                                                                                                                                        | No                                                             |
| Data Encryption?                     | Yes                                                      | Yes                                     | Yes                                       | Yes                                                                                                   | Yes                                                                                                                                                                        | Yes                                                            |
| MFA?                                 | Yes                                                      | Yes                                     | Yes                                       | Yes                                                                                                   | Yes                                                                                                                                                                        | Yes                                                            |
| Web SSO enabled?                     | Yes                                                      | Yes                                     | No                                        | Yes                                                                                                   | No                                                                                                                                                                         | No                                                             |
| Authorized UCR Customers             | Staff, Faculty (based on project allocations)            | Staff, Faculty, Students                | Faculty, Students                         | Staff, Faculty, Students, provisioned individually                                                     | Staff, Faculty, Students                                                                                                                                                     | Staff, Faculty, Students                                        |


[Detailed Storage Comparison](https://docs.google.com/spreadsheets/d/e/2PACX-1vTvztWU2sZNbFEznVGUcCKwRK7xRrIUndqoDAKCWIBHPuhfUhbESQIvUMnuGM6Ugg/pubhtml?widget=true&headers=false)

For more information on research computing services at UCR, visit our [website](https://researchcomputing.ucr.edu) or contact our support team.

## Tiered Research Storage Approach

UCR Research Computing recognizes the diverse storage needs of our research community and has adopted a tiered storage approach to ensure that researchers have access to the appropriate solutions for their specific requirements. This approach is designed to provide a comprehensive and flexible storage ecosystem that supports the entire research lifecycle, from data generation and analysis to collaboration and long-term preservation.

### Tier 1: Ceph RDS – Foundation for Research Data

The Ceph Research Data Service (Ceph RDS) serves as the foundation for research data storage at UCR. This highly scalable and secure storage solution is designed to meet the evolving needs of our researchers, providing a robust platform for storing, managing, and accessing large datasets.

Ceph RDS offers the following key benefits:

- **Scalability**: Starting with an initial capacity of 2 PB, the Ceph RDS can seamlessly scale to accommodate growing data storage requirements.
- **Data Integrity and Security**: With 8k + 4m erasure coding and encryption, Ceph RDS ensures the highest levels of data integrity and security, making it suitable for sensitive research data.
- **Performance**: Leveraging high IOPS NVMe-backed storage pools, Ceph RDS delivers the performance required for data-intensive research workloads.
- **Accessibility**: Ceph RDS supports a wide range of access protocols, including NFS, CIFS/SMB, S3, and various file transfer protocols, enabling seamless integration with existing research 
- **Campus Integration**: Ceph RDS connects directly to the High-Performance Computing Center (HPCC), campus clusters, and centers providing a tightly integrated storage solution for computational research and analysis.

By establishing Ceph RDS as the foundation for research data storage, UCR ensures that researchers have access to a robust, secure, and scalable storage solution that can support their data-intensive projects.

### Tier 2: Google Drive – Collaboration and Document Management

Google Drive serves as the next tier in UCR's research storage approach, focused on enabling efficient collaboration and document management. Tightly integrated with UCR's G Suite, Google Drive provides a user-friendly environment for storing, sharing, and editing various file types, including documents, spreadsheets, and presentations.

Key benefits of Google Drive include:

- **Collaboration**: Real-time collaboration features facilitate seamless teamwork and enable researchers to work on shared documents simultaneously.
- **Ease of Access**: With web-based access and integration with various productivity tools, Google Drive offers convenient access to research materials from any location.
- **Interoperability**: Google Drive supports interoperability with web-based services like the Open Science Framework (OSF), enabling researchers to leverage additional tools for research management and dissemination.

While Ceph RDS serves as the foundation for research data storage, Google Drive complements this by providing a focused solution for document management and small file sharing, enhancing collaboration and productivity within research teams.

### Tier 3: Cloud and Backup Storage – Scalable and Secure

UCR recognizes the importance of providing cost-effective and secure storage solutions for various research needs, including long-term archiving, data backup, and cloud-based storage. To address these requirements, UCR offers access to cloud storage platforms like Google Cloud Storage (GCS) and Amazon Web Services (AWS) S3, as well as backup solutions like CrashPlan.

These storage solutions offer the following benefits:

- **Scalability**: Cloud storage platforms like GCS and AWS S3 provide virtually unlimited scalability, enabling researchers to store and manage large datasets without capacity constraints.
- **Cost-Effectiveness**: UCR has negotiated discounted pricing for these storage solutions, making them cost-effective options for researchers.
- **Data Protection**: Backup solutions like CrashPlan ensure the longevity and integrity of research data by providing reliable backup and recovery capabilities.
- **Flexibility**: With various storage classes and access options, these solutions can accommodate a wide range of research needs, from frequently accessed data to long-term archiving.

By incorporating cloud and backup storage into the tiered approach, UCR empowers researchers with flexible, secure, and cost-effective storage solutions tailored to their specific project requirements.

This tiered research storage approach ensures that UCR's researchers have access to the most appropriate storage solutions for their needs, enabling them to focus on their research while benefiting from a robust, secure, and collaborative storage ecosystem.

### Ursa Major Storage

The Ursa Major project, in partnership with Google Cloud Platform (GCP), offers expansive cloud storage solutions that cater to all types of research data. This initiative is designed to enhance storage flexibility, scalability, and access, supporting both high-performance computing needs and everyday research data management.

- [Learn more about Ursa Major Storage](https://ursa-major.ucr.edu/storage)

### Google Drive

Google Drive provides a collaborative environment for storing, sharing, and editing documents, spreadsheets, and presentations. Integrated with UCR's G Suite, Google Drive is a versatile tool for managing research projects and facilitating teamwork.

- [Access Google Drive](https://drive.google.com)

### GCS & AWS S3

We offer access to Google Cloud Storage (GCS) and Amazon Web Services (AWS) S3 for scalable and secure cloud storage solutions. These platforms are ideal for storing large datasets, with robust data management and access controls.

- [GCS Information](https://cloud.google.com/storage)
- [AWS S3 Details](https://aws.amazon.com/s3/)

### HPCC - GPFS

The High-Performance Computing Center's General Parallel File System (GPFS) is tailored for computational research requiring high-speed access to large datasets. It supports the demanding I/O requirements of HPC applications.

- [HPCC GPFS Overview](https://hpcc.ucr.edu/gpfs)

### Ceph Secure Research Storage

Ceph provides a highly reliable and scalable storage solution for the secure management of large volumes of data. It is particularly suited for research projects that require enhanced data protection measures.

- [Ceph Storage Details](https://ceph.ucr.edu/secure-storage)

### Dryad

Dryad is an open-source, research data repository that promotes the discoverability, reuse, and citation of research data across all disciplines. It supports UCR's commitment to open science and data sharing.

- [Submit to Dryad](https://datadryad.org/stash)

### Backup Solutions

Ensuring the longevity and integrity of research data, we offer comprehensive backup solutions. These include campus-wide services like CrashPlan for endpoint backup and specialized options for critical research data.

- [CrashPlan Backup Service](https://crashplan.ucr.edu)

## Conclusion

UCR's research storage solutions are designed with the strategic intent to empower our researchers with the tools they need to excel in their fields, collaborate effectively, and contribute to the global body of knowledge. We are committed to continually evolving our infrastructure to meet the dynamic needs of our research community and uphold our position as a leading institution within the AAU and beyond.

For detailed information on accessing and utilizing these storage resources, please visit the [UCR Research Computing website](https://researchcomputing.ucr.edu) or contact our support team.