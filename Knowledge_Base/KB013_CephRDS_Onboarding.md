---
id: kb013-cephrds-onboarding
title: KB013 - CephRDS Onboarding & Access Guide
sidebar_label: KB013 - CephRDS Access
---

# KB013: CephRDS Onboarding & Access Guide

**Scope:** UCR Researchers, External Collaborators, Project Polaris Migrants
**Audience:** All Users
**Last Updated:** Feb 23, 2026

---

## 1. Learn More: What is CephRDS?
**Ceph Research Data Service (CephRDS)** is UCR's premier on-premise object storage cluster, funded by the NSF CC* program. 
It provides **2 PB** of highly resilient (6+3 Erasure Coded), S3-compatible storage designed specifically for active research data and large-scale computational workflows.

**Benefits:**
*   **High Performance:** Direct connection to the campus Science DMZ and HPCC for rapid data transfer.
*   **Resiliency:** Can survive multiple simultaneous drive or node failures without data loss.
*   **S3 Compatibility:** Works natively with standard tools like `rclone`, Python (`boto3`), and visual clients (Cyberduck, Mountain Duck).
*   **Sustainable Pricing:** Built-in hardware refresh cycles via a **$40/TB/Year** rental rate or a **$200/Usable TB** one-time permanent purchase.

---

## 2. Get Started & Get an Account

We operate a **Split Management** model to provide the best experience depending on your affiliation. 

### A. UCR Faculty & Internal Labs (The Concierge Path)
If you are a UCR PI needing storage for your lab, or migrating from an older system:
1.  **Request Access:** Email `research-computing@ucr.edu` with your requested storage quota (in TB) and your grant Chart of Accounts (COA) for billing.
2.  **Provisioning:** Our team will manually provision your account and establish your strict user quota.
3.  **Credential Delivery:** You will receive your S3 Access Key and Secret Key via a secure, one-time link.

### B. External Collaborators (The Federated Path)
If you are an external collaborator (e.g., from UCSD, or an NSF ACCESS researcher) working with a UCR lab:
1.  **Request Access:** You will be invited to the project by the UCR PI.
2.  **Self-Service Portal:** Navigate to the NRP Federation Portal (link provided in your invitation).
3.  **Authentication:** Log in via CILogon using your home institution's credentials.
4.  **Get Keys:** Generate your own S3 Access and Secret keys directly in the portal.

---

## 3. Get Your Token (S3 Keys)

Unlike standard campus services, CephRDS uses the **S3 API Protocol**. This means you do not use your NetID and password to log in interactively. Instead, you use an **Access Key** and a **Secret Key**.

**Security Warning:** Treat your Secret Key like a highly sensitive password. **Never** commit it to GitHub or share it in plaintext. 

---

## 4. Get Connected & Transfer Data

We recommend different tools based on your operating system and technical comfort level. 

### Method A: Visual Interface (Windows / Mac)
For a drag-and-drop experience similar to Google Drive or Dropbox, we recommend **Cyberduck** (Free) or **Mountain Duck** (Paid, mounts as a local drive). 

*Note: We do not recommend or support FileZilla for CephRDS as it does not natively support the modern S3 protocols required for our deployment.*

**Setup Cyberduck:**
1. Download and install [Cyberduck](https://cyberduck.io/).
2. Click **Open Connection**.
3. Select **Amazon S3** from the dropdown menu.
4. **Server:** `s3.ucr.edu` *(Note: exact endpoint pending final DNS configuration)*
5. **Port:** `443`
6. **Access Key ID:** Paste your provided Access Key.
7. **Secret Access Key:** Paste your provided Secret Key.
8. Click **Connect**.

### Method B: Command Line & HPCC (Linux)
For moving massive datasets (terabytes) or running scheduled jobs on the HPCC, **`rclone`** is the standard. It can saturate 100Gbps network links through parallel transfers.

**Setup `rclone`:**
1. Run `rclone config`
2. Press `n` for New remote.
3. Name it `cephrds`.
4. Choose `s3` (Amazon S3 Compliant Storage Providers).
5. Choose `Ceph` as the provider.
6. Enter `false` to enter credentials manually.
7. Enter your **Access Key ID**.
8. Enter your **Secret Access Key**.
9. Endpoint: `https://s3.ucr.edu`

**Example Transfer Command:**
Copy a local folder to a bucket on CephRDS:
```bash
rclone copy /local/data/my_dataset cephrds:my_project_bucket/ --progress --transfers 8
```

### Method C: Python Scripting (`boto3`)
If you are writing data analysis pipelines in Python:

```python
import boto3

# Initialize the S3 client
s3 = boto3.client('s3',
    endpoint_url='https://s3.ucr.edu',
    aws_access_key_id='YOUR_ACCESS_KEY',
    aws_secret_access_key='YOUR_SECRET_KEY'
)

# List all buckets
response = s3.list_buckets()
print(response['Buckets'])
```

---

## 5. Troubleshooting & FAQ

**Q: I got a "403 Forbidden" error when trying to upload.**
**A:** You have likely hit your assigned storage or object quota. Please contact support to request a quota increase.

**Q: I lost my Secret Key.**
**A:** Secret Keys cannot be recovered, only regenerated. Contact support (Internal UCR) or use the NRP Portal (External) to generate a new key pair. You will need to update all your scripts and clients.