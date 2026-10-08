---
title: "Connecting to CephRDS (S3 Object Storage)"
kb_id: KB013
topic: Storage
audience: "Researchers, PIs, Students"
reviewed: 2026-10-08
owner: Research Computing
review_notes:
  - "Chuck 2026-10-04: S3 only for now; campus network or VPN only."
  - "Removed a staff name and internal team routing; described the request process instead of promising outcomes."
  - "Added pilot status, P1-P2 data limit and costs; removed price-claim wording."
  - "2026-10-08: CephRDS rate figures removed; rates under review, not yet approved."
  - "Replaced the duplicated Python script with a short example and a link to KB018; used placeholder bucket names."
redirect_from:
  - /Knowledge_Base/KB013_CephRDS_Onboarding.html
---

## Overview

CephRDS is Research Computing's on-premises research data storage, built on Ceph. Labs reach their buckets through an S3-compatible interface only, so you use an S3 client rather than mapping a network drive. Other access methods, such as NFS, are not offered at this time.

This article covers how to request storage and keys, and how to connect to the CephRDS endpoint (`https://rds.ucr.edu`) with Cyberduck (graphical), rclone (command line) and Python.

Before you request storage, note:

- **Pilot service.** CephRDS is in pilot. Capacity is limited, terms may change, and each request is reviewed individually. See [CephRDS](../../services/cephrds/).
- **Network.** CephRDS is reachable from the campus network only. Off campus, connect to the [UCR campus VPN](https://vpn.ucr.edu/) (Cisco Secure Client) first.
- **Data allowed.** P1 and P2 data only. Do not store P3 or P4 data on CephRDS.
- **Costs.** Rates are under review, not yet approved. Terms are set out when your storage is allocated. See [Costs](../../costs/).

## Requesting storage and access keys

1. **Send a request.** The PI or lab lead contacts Research Computing through the [UCR Support Portal](https://ucrsupport.service-now.com/ucr_portal/) or by email to research-computing@ucr.edu.
2. **Include these details:**
   - PI or lab lead name and NetID
   - Department and college
   - Estimated initial capacity (for example, 10 TB)
   - Lab members (NetIDs) who need access to the bucket
   - The kind of data you plan to store, so its data classification can be confirmed
3. **Review and setup.** Research Computing reviews the request and works with ITS to create the storage. When it is set up, the S3 Access Key ID and Secret Access Key are sent to the PI through a secure channel.

Keep your keys private. Do not email them, paste them into chat, or commit them to a code repository. If a key may have been exposed, contact research-computing@ucr.edu so it can be replaced.

## 1. Using Cyberduck (graphical)

Cyberduck is an open-source graphical client for macOS and Windows, suited to drag-and-drop transfers. [KB019](../kb019-cephrds-gui-clients/) covers it and a Linux alternative in more detail.

1. **Download and install** Cyberduck from [https://cyberduck.io](https://cyberduck.io).
2. **Open a new connection:**
   - Click **Open Connection**.
   - From the drop-down at the top, select **Amazon S3**.
3. **Enter the connection details:**
   - **Server:** `rds.ucr.edu`
   - **Port:** `443`
   - **Access Key ID:** your access key
   - **Secret Access Key:** your secret key
4. Click **Connect**. Your buckets are listed, and you can drag and drop files.

## 2. Using rclone (command line)

rclone is a command-line tool for cloud and object storage, suited to large transfers and scripted copies. It runs on Linux, macOS and Windows.

### Configuration

1. Start the configuration tool:
   ```bash
   rclone config
   ```
2. Answer the prompts to create a new remote:
   - **n/s/q>**: `n` (new remote)
   - **name>**: a name for the remote, for example `ucr-ceph`
   - **Storage>**: `s3` (Amazon S3 Compliant Storage Providers)
   - **provider>**: **Ceph** (Ceph Object Storage). Do not select "Amazon S3".
   - **env_auth>**: `false` (enter credentials in the next step)
   - **access_key_id>**: your Access Key ID
   - **secret_access_key>**: your Secret Access Key
   - **region>**: leave blank (press Enter)
   - **endpoint>**: `https://rds.ucr.edu`
   - **location_constraint>**: leave blank (press Enter)
   - **acl>**: leave blank (press Enter)
   - Accept the defaults for the remaining prompts, then save and quit.

### Basic commands

Replace `my-lab-bucket` with your bucket name.

*   **List buckets:**
    ```bash
    rclone lsd ucr-ceph:
    ```
*   **List files in a bucket:**
    ```bash
    rclone ls ucr-ceph:my-lab-bucket
    ```
*   **Copy a local folder to CephRDS, with progress shown:**
    ```bash
    rclone copy /path/to/local/data/ ucr-ceph:my-lab-bucket/folder/ -P
    ```

To use a bucket like a local folder, see [KB020: Mounting CephRDS buckets as local drives](../kb020-cephrds-mounting-folders/).

## 3. Using Python (boto3)

Use the AWS SDK for Python (`boto3`) with two settings: point `endpoint_url` at CephRDS, and use path-style addressing. You do not need a region.

```python
import os
import boto3
from botocore.client import Config

s3 = boto3.client(
    "s3",
    endpoint_url="https://rds.ucr.edu",
    aws_access_key_id=os.environ["CEPHRDS_ACCESS_KEY"],
    aws_secret_access_key=os.environ["CEPHRDS_SECRET_KEY"],
    config=Config(s3={"addressing_style": "path"}),
)

for obj in s3.list_objects_v2(Bucket="my-lab-bucket").get("Contents", []):
    print(obj["Key"], obj["Size"])
```

[KB018: Accessing CephRDS with Python (boto3)](../kb018-cephrds-python-boto3/) has a fuller example, including uploads and downloads.

## Getting help

Contact Research Computing at research-computing@ucr.edu.
