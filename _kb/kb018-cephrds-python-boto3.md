---
title: "Accessing CephRDS with Python (boto3)"
kb_id: KB018
topic: Storage
audience: "UCR Faculty, Postdocs, Researchers & Students"
reviewed: 2026-10-04
owner: Research Computing
review_notes:
  - "Chuck 2026-10-04: CephRDS needs the campus network or VPN."
  - "Replaced 'fully compatible' with 'S3-compatible'; the example now reads keys from environment variables instead of hardcoding them."
  - "Added download, pagination and error handling to the example; used a placeholder bucket name."
  - "CHECK: path-style addressing is still the recommended setting for rds.ucr.edu (bucket subdomains also resolve in DNS)."
redirect_from:
  - /Knowledge_Base/KB018_CephRDS_Python_boto3.html
---

CephRDS supports the Amazon S3 API, so you can work with it from Python using the standard AWS SDK, `boto3`. For requesting storage and keys, see [KB013: Connecting to CephRDS](../kb013-cephrds-onboarding/).

## Prerequisites

* Python 3
* The `boto3` library (`pip install boto3`)
* Your CephRDS Access Key ID and Secret Access Key
* The name of your bucket

## Two settings that matter

CephRDS runs on campus, not in AWS, so two settings differ from a standard AWS script:

1.  **Endpoint:** set `endpoint_url` to `https://rds.ucr.edu`.
2.  **Path-style addressing:** set `addressing_style` to `path`. You do not need `region_name`.

## Keep your keys out of your code

Do not type your keys into a script. Set them as environment variables in your shell (or load them from a file that is never committed to version control):

```bash
export CEPHRDS_ACCESS_KEY="your-access-key-id"
export CEPHRDS_SECRET_KEY="your-secret-access-key"
```

## Code example

This script lists the objects in a bucket, uploads a file and downloads it again. Replace `my-lab-bucket` with your bucket name.

```python
import os
import boto3
from botocore.client import Config
from botocore.exceptions import ClientError

ENDPOINT_URL = "https://rds.ucr.edu"
BUCKET_NAME = "my-lab-bucket"

s3 = boto3.client(
    "s3",
    endpoint_url=ENDPOINT_URL,
    aws_access_key_id=os.environ["CEPHRDS_ACCESS_KEY"],
    aws_secret_access_key=os.environ["CEPHRDS_SECRET_KEY"],
    config=Config(s3={"addressing_style": "path"}),
)

# List objects (the paginator handles buckets with more than 1,000 objects)
paginator = s3.get_paginator("list_objects_v2")
for page in paginator.paginate(Bucket=BUCKET_NAME, Prefix="data/"):
    for obj in page.get("Contents", []):
        print(obj["Key"], obj["Size"])

# Upload a file
try:
    s3.upload_file("local_data.csv", BUCKET_NAME, "data/local_data.csv")
    print("Upload complete.")
except ClientError as err:
    print("Upload failed:", err)

# Download it again
s3.download_file(BUCKET_NAME, "data/local_data.csv", "downloaded_data.csv")
print("Download complete.")
```

`upload_file` and `download_file` split large files into parts and transfer them in parallel automatically.

## Troubleshooting

- **`AccessDenied` or `InvalidAccessKeyId`:** check that the environment variables hold the right keys and that your key has access to that bucket.
- **`NoSuchBucket`:** check the bucket name spelling. Bucket names are case-sensitive.
- **Connection timeouts:** CephRDS is reachable only from the campus network. Off campus, connect to the [UCR campus VPN](https://vpn.ucr.edu/) (Cisco Secure Client) first. Contact research-computing@ucr.edu if the problem continues.

## Security note

Never commit keys to GitHub or another repository. If a key may have been exposed, contact research-computing@ucr.edu so it can be replaced.
