---
id: ceph-secure-research-storage
title: Ceph Secure Research Storage
sidebar_label: Ceph Secure Research Storage
description: Ceph-Based Central Campus Research Storage Solution
---

## UCR's Ceph Research Storage Solution (Ceph RDS)

UC Riverside is excited to introduce a significant enhancement to our research infrastructure: the Ceph-Based Central Campus Research Storage Solution. Funded by an NSF CC* grant, this initiative aims to provide scalable, resilient, and flexible storage tailored to the diverse needs of our research community.

### Secure, Central, Campus-Wide, Research Storage

- **Scalable Storage**: 2.2PB of usable storage, integrating 20% with the NRP Nautilus cluster for advanced data processing.
- **Wide Connectivity**: Secure connections via NFS, CIFS, and S3 interfaces to various devices and systems.
- **Cost-Effective**: Base allocations from 200GB to 10TB at no cost, with additional storage at $30 per TB per year.

### Distribution Strategy

To ensure fair access among UCR’s 800-1000 research faculty:

- **Base Allocation**: Equitable initial storage allocation, adjustable based on research demands.
- **Merit and Need-Based Allocation**: Applications reviewed for scope, data needs, and impact.
- **Affordable Expansion**: Options to purchase additional storage at a nominal rate.

### Ceph RDS Feature Table

| Feature                              | Ceph RDS                                                 | Description                                                                                                     |
|--------------------------------------|----------------------------------------------------------|------------------------------------------------------------------------------------------------------------------|
| Default Storage (free/included)      | 200GB - 2TB (based on project needs)                     | Initial storage allocation based on project requirements, ranging from 200GB to 2TB.                          |
| Cost for additional storage          | $30/TB/year                                              | Cost-effective pricing for additional storage at $30 per TB per year.                                        |
| How to Purchase                      | Allocated based on project needs                        | Storage is allocated based on project needs, ensuring efficient resource utilization.                        |
| Normalized Cost for 1TB / annually   | $30                                                      | The normalized cost for 1TB of storage per year is $30, providing excellent value.                          |
| Replicated / backed up               | Yes (8k + 4m erasure coding)                             | Data is replicated and protected using an 8k + 4m erasure coding scheme, ensuring data integrity.           |
| Durability / Availability            | High (distributed across multiple data centers)          | High durability and availability achieved through a distributed architecture across multiple data centers.  |
| Access protocols                     |                                                          |                                                                                                                |
| NFS                                  | Yes                                                      | Supports NFS protocol for easy integration with existing systems.                                            |
| CIFS / SMB                           | Yes                                                      | Supports CIFS/SMB protocol, enabling file sharing and collaboration.                                        |
| S3                                   | Yes                                                      | Provides S3 access, allowing integration with cloud-native applications and services.                        |
| Web / HTTP                           | No                                                       | Web/HTTP access is not currently supported.                                                                  |
| FTP / SFTP / FTPS / ssh / scp / sshfs| Yes                                                      | Supports various file transfer protocols, including FTP, SFTP, FTPS, SSH, SCP, and SSHFS.                   |
| Proprietary / App                    | CLI, open source clients                                 | Accessible via command-line interface and open-source client applications.                                  |
| Rclone supported?                    | Yes                                                      | Supports Rclone, a versatile command-line tool for managing cloud storage.                                  |
| Folder Sharing                       | Yes                                                      | Enables folder sharing among authorized users, facilitating collaboration.                                  |
| Web Browser access                   | No                                                       | Web browser access is not currently supported.                                                               |
| Real-time Collaboration              | No                                                       | Real-time collaboration features are not available.                                                          |
| File Size limit                      | No explicit limit                                        | No explicit file size limit is imposed, ensuring flexibility for large datasets.                           |
| File Versioning / snapshots          | Yes                                                      | Supports file versioning and snapshots, providing data protection and version control.                     |
| Office Integration                   | No                                                       | Office integration features are not available.                                                               |
| File Deletion Retention              | Configurable                                             | File deletion retention period is configurable based on project requirements.                               |
| Share files outside of UCR           | Yes                                                      | Allows sharing files with external collaborators outside of UCR, enabling research collaborations.         |
| Data Encryption?                     | Yes                                                      | Data is encrypted, ensuring data security and compliance with policies.                                      |
| MFA?                                 | Yes                                                      | Supports multi-factor authentication (MFA) for enhanced security.                                           |
| Web SSO enabled?                     | Yes                                                      | Web-based single sign-on (SSO) is enabled for seamless access.                                              |
| Authorized UCR Customers             | Staff, Faculty (based on project allocations)            | Access is granted to staff and faculty members based on project allocations and research needs.             |

### Enhancements and Integrations

- **Nautilus Integration**: Seamless data transfer with a 100G connection via CENIC’s CalREN network.
- **Federated Identities**: Secure access management using Shibboleth and CILogon, promoting collaboration within the Pacific Research Platform.

### Cybersecurity Measures

A comprehensive strategy featuring:

- **Layered Security Model**: Incorporates encryption and network segmentation.
- **Regular Assessments**: To ensure adherence to IS-3 Standards and safeguard data integrity.

### Performance and Training

- **Benchmarking**: To measure storage performance and system adoption.
- **Training Sessions**: Scheduled soon after system launch, with ongoing workshops and resources.

### Future Plans

- **Strategic Expansion**: Consideration for network and storage capability enhancements.
- **Resilience and Redundancy**: Emphasis on system reliability and data accessibility.

---

### Getting Started

For researchers interested in leveraging the Ceph-Based Central Campus Research Storage Solution:

1. **Evaluate Your Storage Needs:** Consider the size and access patterns of your data.
2. **Engauge with the Research Computing Team:** Meet with the Research Computing Team to discuss your project's scope and storage requirements.
3. **Migrate or Upload Your Data:** Start utilizing the storage solution for your research projects.

Contact us for help or to learn more!
[research-computing@ucr.edu](mailto:research-computing@ucr.edu) - [UCR Research Computing Slack](https://ucr-research-compute.slack.com/)
