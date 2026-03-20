---
id: kb013-cephrds-onboarding
title: KB013 - CephRDS Onboarding & Access Guide
sidebar_label: KB013 - CephRDS Access
---

# KB013: CephRDS Onboarding & Access Guide

**Scope:** UCR Researchers, External Collaborators
**Audience:** All Users
**Last Updated:** March 20, 2026

---

## 1. What is CephRDS?
**Ceph Research Data Service (CephRDS)** is UCR's premier on-premise object storage cluster, funded by the NSF CC* program. 
It provides **over 2 PB** of highly resilient (6+3 Erasure Coded), S3-compatible storage designed specifically for active research data and large-scale computational workflows.

**Benefits:**
*   **High Performance:** Direct connection to the campus Science DMZ and HPCC for rapid data transfer.
*   **Resiliency:** Can survive multiple simultaneous drive or node failures without data loss.
*   **S3 Compatibility:** Works natively with standard tools like `rclone`, Python (`boto3`), and visual clients (Cyberduck, Universal S3 UI).
*   **Sustainable Pricing:** Built-in hardware refresh cycles via a **$40/TB/Year** rental rate or a **$200/Usable TB** one-time permanent purchase.

---

## 2. Naming Conventions & Account Structure

To clearly distinguish on-premise Ceph storage from other cloud offerings, CephRDS utilizes a standardized naming convention based on the Principal Investigator's (PI) NetID:

*   **Lab Account Name:** `ucr-rds-[pi-netid]-lab`
*   **Storage Buckets:** `ucr-rds-[pi-netid]-lab-hdd` (for standard storage) or `ucr-rds-[pi-netid]-lab-ssd` (for high-performance NVMe storage).

**Access Strategy:** 
The storage buckets belong to the Lab. If a PI wishes to grant access to a student or collaborator, Research Computing will create a unique account for that individual using their NetID, and grant them specific access permissions (ACLs) to the main Lab bucket. This ensures a clear audit trail for data management.

---

## 3. Getting Started & Provisioning

### A. UCR Faculty & Internal Labs
1.  **Request Access:** Submit a BearHelp ticket to Research Computing requesting CephRDS storage. Include your requested quota (in TB) and your Chart of Accounts (COA) if exceeding the initial subsidized allocation.
2.  **Provisioning:** Our team will provision your `ucr-rds-[pi-netid]-lab` account and establish your strict hardware quotas.
3.  **Credential Delivery:** You will receive your S3 Access Key and Secret Key securely. 

### B. Lab Members & External Collaborators
1.  **PI Approval:** The UCR PI must submit a ticket explicitly requesting access for the individual to their lab bucket.
2.  **Provisioning:** Our team will generate a unique set of Access/Secret keys for the user, scoped strictly to the UCR PI's bucket.

*Security Warning: Treat your Secret Key like a password. Never commit it to GitHub or share it in plaintext.*

---

## 4. Connecting to CephRDS (rds.ucr.edu)

CephRDS uses the **S3 API Protocol**. The official connection endpoint is:
**`https://rds.ucr.edu`**

For specific configuration guides and code examples, please see:
*   [KB018: Accessing CephRDS with Python (boto3)](KB018_CephRDS_Python_boto3.md)
*   [KB019: Accessing CephRDS via Graphical S3 Clients](KB019_CephRDS_GUI_Clients.md)

---

## 5. Troubleshooting & FAQ

**Q: I got a "403 Forbidden" error when trying to upload.**
**A:** You have likely hit your assigned storage quota for your bucket. Please contact Research Computing to request a quota increase.

**Q: Can I use FileZilla?**
**A:** We recommend FileZilla Pro (which supports S3), Cyberduck, or Universal S3 UI. The free version of FileZilla does not natively support the modern S3 protocols required for CephRDS.

**Q: I lost my Secret Key.**
**A:** Secret Keys cannot be recovered, only regenerated. Contact support to generate a new key pair. You will need to update all your scripts and clients with the new key.
