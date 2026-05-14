# KB013: Connecting to CephRDS (S3 Object Storage)

**Category:** Storage & Data
**Audience:** Researchers, PIs, Students
**Last Updated:** May 8, 2026

## Overview

UCR's CephRDS is an S3-compatible object storage system. To access your allocated buckets, you cannot use a traditional network drive mapping (like SMB or NFS). Instead, you must use an S3 client.

This guide provides examples for connecting to the CephRDS endpoint (`https://rds.ucr.edu`) using three common methods: Cyberduck (GUI), Rclone (CLI), and Python (Programmatic).

**Prerequisites:**
You must have your **Access Key ID** and **Secret Access Key**. If you do not have these, your PI must request them via the Research Computing ticketing system.

---

## 1. Using Cyberduck (Graphical Interface)

Cyberduck is a free graphical client available for macOS and Windows, ideal for drag-and-drop file transfers.

1. **Download & Install:** Get Cyberduck from [https://cyberduck.io](https://cyberduck.io).
2. **Open a New Connection:**
   - Click the **Open Connection** icon.
   - From the drop-down at the top, select **Amazon S3**.
3. **Configure Connection:**
   - **Server:** `rds.ucr.edu`
   - **Port:** `443`
   - **Access Key ID:** Paste your Access Key.
   - **Secret Access Key:** Paste your Secret Key.
4. **Connect:** Click **Connect**. You will now see your assigned buckets and can drag and drop files.

---

## 2. Using Rclone (Command Line)

Rclone is a powerful command-line tool for managing cloud storage, ideal for transferring large datasets or scripting backups. It is available on Linux, macOS, Windows, and the UCR HPCC (`module load rclone`).

### Configuration

1. Run the configuration tool:
   ```bash
   rclone config
   ```
2. Follow the prompts to create a new remote:
   - **n/s/q>**: Press `n` for New remote.
   - **name>**: Enter a name (e.g., `ucr-ceph`).
   - **Storage>**: Select `s3` (Amazon Web Services S3 Compliant Storage).
   - **provider>**: Select **Ceph** (Ceph Object Gateway). **Do not select "Amazon S3"**.
   - **env_auth>**: Press `false`.
   - **access_key_id>**: Enter your Access Key ID.
   - **secret_access_key>**: Enter your Secret Access Key.
   - **region>**: Leave blank (press Enter).
   - **endpoint>**: Enter `https://rds.ucr.edu`.
   - **location_constraint>**: Leave blank (press Enter).
   - **acl>**: Leave blank (press Enter).
   - Advance through the remaining prompts (press Enter for defaults) until you save and exit.

### Basic Commands

*   **List buckets:**
    ```bash
    rclone lsd ucr-ceph:
    ```
*   **List files in a bucket:**
    ```bash
    rclone ls ucr-ceph:your-bucket-name
    ```
*   **Copy a local folder to CephRDS (with a progress bar):**
    ```bash
    rclone copy /path/to/local/data/ ucr-ceph:your-bucket-name/folder/ -P
    ```

---

## 3. Using Python (Boto3)

To interact with CephRDS programmatically in Python, use the standard AWS SDK (`boto3`). Because CephRDS is a private, on-premise cloud, it handles routing differently than standard AWS.

### Installation
```bash
pip install boto3
```

### Python Script Example
The crucial steps are explicitly setting `addressing_style='path'` and omitting the `region_name`.

```python
import boto3
from botocore.client import Config

# Configuration
ENDPOINT_URL = 'https://rds.ucr.edu'
ACCESS_KEY = 'your_access_key_here'
SECRET_KEY = 'your_secret_key_here'
BUCKET_NAME = 'your-bucket-name'

# Initialize the S3 client
# Note: config=Config(s3={'addressing_style': 'path'}) is crucial for Ceph server
s3_client = boto3.client('s3',
    endpoint_url=ENDPOINT_URL,
    aws_access_key_id=ACCESS_KEY,
    aws_secret_access_key=SECRET_KEY,
    config=Config(s3={'addressing_style': 'path'})
)

# 1. List files in the bucket
print(f"Files in bucket '{BUCKET_NAME}':")
response = s3_client.list_objects_v2(Bucket=BUCKET_NAME)
if 'Contents' in response:
    for item in response['Contents']:
        print(f" - {item['Key']} ({item['Size']} bytes)")
else:
    print(" (Bucket is empty)")
```

# 2. Upload a file
local_file = 'my_dataset.csv'
s3_key = 'data/my_dataset.csv'
print(f"Uploading {local_file} to {s3_key}...")
s3_client.upload_file(local_file, BUCKET_NAME, s3_key)
print("Upload complete.")

# 3. Download a file
download_path = 'downloaded_dataset.csv'
print(f"Downloading {s3_key} to {download_path}...")
s3_client.download_file(BUCKET_NAME, s3_key, download_path)
print("Download complete.")
```
