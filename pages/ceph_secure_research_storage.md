id: ceph-secure-research-storage
title: Ceph Research Storage (Ceph RDS)
sidebar_label: Ceph Research Storage
description: Ceph-Based Central Campus Research Storage Solution (Ceph RDS)
---

## UCR's Ceph Research Storage Solution (Ceph RDS)

UC Riverside is excited to introduce a significant enhancement to our research infrastructure: the Ceph-Based Central Campus Research Storage Solution. Funded by an NSF CC* grant, this system is designed to optimize your research workflows by providing high-performance, secure, and scalable storage tailored to your project needs.

### Benefits for Researchers

A Ceph storage system offers a host of benefits and functionalities critical for researchers at an R1 research university:

- **Scalability and Flexibility:**
  - *Massive Storage Capacity:* Supports multi-petabyte deployments, enabling research projects to grow without the need for an infrastructure overhaul.
  - *Flexible Allocation:* Dynamically allocates storage based on project needs, accommodating diverse workloads—from small-scale studies to large, data-intensive experiments.

- **High Performance and Reliability:**
  - *Distributed Architecture:* Delivers fast, parallel data access and processing by distributing data across multiple nodes and data centers.
  - *Fault Tolerance:* Built-in replication and erasure coding ensure data durability and minimize downtime in case of hardware failures.

- **Multi-Protocol Access and Seamless Integration:**
  - *Protocol Support:* Provides access via industry-standard protocols such as NFS, CIFS/SMB, and S3, ensuring easy integration with your existing research tools.
  - *APIs and Automation:* Enables programmatic access and automation through APIs and tools like Rclone, simplifying integration with HPC clusters and cloud-based analytics.

- **Enhanced Data Security:**
  - *Encryption and Access Controls:* Secures data with robust encryption (both at rest and in transit), multi-factor authentication (MFA), and role-based access controls.
  - *Secure Collaboration:* Facilitates controlled sharing of data within UCR and with external collaborators, ensuring sensitive research data remains protected.

- **Robust Data Management and Versioning:**
  - *Snapshots and Versioning:* Allows creation of data snapshots and maintains multiple file versions to safeguard against accidental deletions or modifications.
  - *Automated Backups:* Regular, automated backups ensure your data is consistently preserved and available for recovery.

- **Cost Efficiency and Transparency:**
  - *Pay-As-You-Go Pricing:* Transparent rental pricing at $40 per TB per year for additional storage. Researchers can also 'purchase' permanent capacity at $200 per Usable TB for the 5-year hardware lifecycle.
  - *Resource Optimization:* Centralized storage management minimizes redundant data storage and streamlines resource allocation.

- **Support for Advanced Research Workflows:**
  - *Integration with HPC and Data Analysis Tools:* Seamlessly connects with high-performance computing clusters and analytics platforms essential for modern research.
  - *Customizable Data Policies:* Offers configurable retention policies and lifecycle management options to match specific research requirements.

- **User-Friendly and Community-Driven:**
  - *Open Source Ecosystem:* Benefits from a vibrant, active community contributing to continuous improvements and innovation.
  - *Comprehensive Documentation and Support:* Access robust documentation, user guides, and dedicated support channels to optimize your data workflows.

### Secure, Central, Campus-Wide, Research Storage

- **Scalable Storage:** 2.2PB of usable storage, with 20% integrated with the NRP Nautilus cluster for advanced data processing.
- **Wide Connectivity:** Secure access via NFS, CIFS/SMB, and S3 interfaces ensures compatibility with a variety of devices and systems.
- **Transparent Pricing:** Additional storage is available at a competitive rate of $40 per TB per year, or a one-time purchase of $200 per Usable TB.

### Ceph RDS Feature Table

| Feature                              | Ceph RDS                                          | Description                                                                                                     |
|--------------------------------------|---------------------------------------------------|-----------------------------------------------------------------------------------------------------------------|
| Cost for Additional Storage (Rent)   | $40/TB/year                                       | Cost-effective rental pricing for additional storage at $40 per TB per year.                                    |
| Cost for Permanent Storage (Purchase)| $200/Usable TB                                    | One-time equipment purchase funding the hardware lifecycle.                                                     |
| How to Purchase                      | Allocated based on project needs                  | Storage is provided based on individual project requirements for optimal resource utilization.                  |
| Normalized Cost for 1TB / Annually   | $40                                               | The normalized rental cost for 1TB of storage per year is $40, generating the lifecycle refresh fund.           |
| Replicated / Backed Up               | Yes (8k + 4m erasure coding)                      | Data is secured using advanced erasure coding, ensuring robust protection and data integrity.                     |
| Durability / Availability            | High (distributed across multiple data centers)   | A distributed architecture ensures high durability and continuous availability.                                 |
| Access Protocols                     |                                                   |                                                                                                                 |
| - NFS                                | Yes                                               | Supports the NFS protocol for reliable and secure integration with your systems.                                |
| - CIFS/SMB                           | Yes                                               | Enables file sharing and collaboration through CIFS/SMB support.                                                |
| - S3                                 | Yes                                               | Provides S3 access for integration with cloud-native applications and services.                                 |
| - Web/HTTP                           | No                                                | Web/HTTP access is not currently supported.                                                                     |
| - FTP/SFTP/FTPS/SSH/SCP/SSHFS         | Yes                                               | Offers a variety of file transfer protocols, accommodating diverse research environments.                        |
| Proprietary / App                    | CLI, open source clients                          | Managed via a command-line interface and open-source clients, ensuring flexibility in control.                     |
| Rclone Supported                     | Yes                                               | Rclone support allows for powerful, command-line management of your storage resources.                            |
| Folder Sharing                       | Yes                                               | Enables secure folder sharing among authorized users to foster collaboration.                                    |
| Web Browser Access                   | No                                                | Web browser access is not currently supported.                                                                  |
| Real-time Collaboration              | No                                                | Real-time collaboration features are not available, keeping the focus on secure storage and data integrity.         |
| File Size Limit                      | No explicit limit                                 | Designed for large datasets, with no explicit file size limit imposed.                                             |
| File Versioning / Snapshots          | Yes                                               | Provides file versioning and snapshots, so you can recover previous versions of your data if needed.                |
| Office Integration                   | No                                                | Office integration features are not available.                                                                  |
| File Deletion Retention              | Configurable                                      | Configure retention periods to suit your project requirements and ensure data is preserved as needed.               |
| Share Files Outside of UCR           | Yes                                               | Facilitates secure sharing with external collaborators, fostering interdisciplinary research.                     |
| Data Encryption                      | Yes                                               | All data is encrypted to protect sensitive information and meet compliance standards.                             |
| MFA                                  | Yes                                               | Multi-factor authentication (MFA) provides an additional layer of security.                                        |
| Web SSO Enabled                      | Yes                                               | Web-based single sign-on (SSO) enables seamless and secure access to the system.                                   |
| Authorized UCR Customers             | Staff, Faculty (based on project allocations)     | Access is provided to UCR staff and faculty based on their project requirements.                                   |

### Enhancements and Integrations

- **Nautilus Integration:** Enjoy seamless data transfers with a dedicated 100G connection via CENIC’s CalREN network.
- **Federated Identities:** Secure access management through Shibboleth and CILogon supports collaborations across the Pacific Research Platform.

### Cybersecurity and Data Management

- **Layered Security Model:** Combines advanced encryption, network segmentation, and routine security assessments to keep your data safe.
- **Data Lifecycle Management:** Features automated backups, file versioning, and configurable deletion retention to protect and preserve your research data over time.

### Support

- **Dedicated Support:** Our support team is available via multiple channels to promptly resolve any issues, minimizing disruptions to your work.
- **Comprehensive Training:** Access quick-start guides, video tutorials, and scheduled workshops designed to help you get up and running quickly with Ceph RDS.

### Future Plans

- **Strategic Expansion:** Ongoing enhancements to both network and storage capabilities will continuously support evolving research needs.
- **Enhanced Collaboration:** Future updates will focus on integrating additional features that further streamline collaboration and data management.

---

### Getting Started

For researchers ready to elevate their data management:

1. **Evaluate Your Storage Needs:** Consider the size, frequency of access, and sensitivity of your data.
2. **Engage with the Research Computing Team:** Discuss your project’s requirements and receive tailored recommendations.
3. **Migrate or Upload Your Data:** Seamlessly transition to Ceph RDS and start benefiting from secure, high-performance storage.

For more information or assistance, contact us at:  
[research-computing@ucr.edu](mailto:research-computing@ucr.edu)  
[UCR Research Computing Slack](https://ucr-research-compute.slack.com/)

