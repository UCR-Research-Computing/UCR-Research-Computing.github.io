---
title: "Moving data in and out of OSN: rclone, AWS CLI, Cyberduck and Python"
kb_id: KB040
topic: Storage
description: "Configure rclone, the AWS CLI, Cyberduck or Python for your OSN bucket, then upload, download, sync, list and share data."
audience: "UCR researchers with an OSN bucket and its keys"
reviewed: 2026-10-29
owner: Research Computing
series: osn
series_order: 3
review_notes:
  - "Written 2026-10-29 from the OSN 'Read and Write Data' pages for rclone, AWS CLI and Cyberduck (openstoragenetwork.github.io/docs/dataset-access/, fetched 2026-10-29) and the Tools, Tips & Tricks page."
  - "CHECK: not yet run against a real OSN bucket (RC bucket request pending 2026-10-29). Run every command on this page, including anonymous read and the presigned URL, and record what was seen."
  - "CHECK: whether OSN supports presigned URLs (section 6) is not stated in the OSN docs; test before relying on it."
---

You need your bucket's **endpoint**, **bucket name** and an **access key** and **secret key** (from the bucket's page in the OSN portal, see [Getting OSN storage](../kb039-osn-getting-storage/)). Use the read-write keys only on machines you control.

## 1. rclone (recommended)

[rclone](https://rclone.org/) runs on macOS, Linux and Windows and is installed on many clusters. Add this to your rclone config (`rclone config file` shows where it is):

```
[osn]
type = s3
provider = Ceph
access_key_id = YOUR_ACCESS_KEY
secret_access_key = YOUR_SECRET_KEY
endpoint = https://YOUR_ENDPOINT
no_check_bucket = true
```

Then:

```bash
rclone ls osn:your-bucket                          # list
rclone copy results.csv osn:your-bucket/project1/  # upload one file
rclone copy ./data osn:your-bucket/data -P         # upload a folder, with progress
rclone copy osn:your-bucket/data ./data -P         # download
rclone sync ./data osn:your-bucket/data --dry-run  # preview a one-way sync
rclone check ./data osn:your-bucket/data           # compare
```

`rclone sync` deletes files at the destination that are not in the source. Always run it with `--dry-run` first.

## 2. AWS CLI

Install the [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html), then add a profile. In `~/.aws/config`:

```
[profile osn]
endpoint_url = https://YOUR_ENDPOINT
request_checksum_calculation = when_required
response_checksum_validation = when_required
```

and in `~/.aws/credentials`:

```
[osn]
aws_access_key_id = YOUR_ACCESS_KEY
aws_secret_access_key = YOUR_SECRET_KEY
```

Then:

```bash
aws s3 ls --profile osn s3://your-bucket/ --recursive
aws s3 cp --profile osn results.csv s3://your-bucket/project1/
aws s3 cp --profile osn --recursive ./data s3://your-bucket/data/
aws s3 sync --profile osn s3://your-bucket/data ./data
```

The two checksum lines are needed with recent AWS CLI versions, per the OSN documentation.

## 3. Cyberduck (graphical, macOS and Windows)

1. In Cyberduck preferences, open **Profiles** and enable **S3 (Deprecated path style requests)**.
2. Create a bookmark with that profile. Server: your endpoint without `https://`. Access Key ID and Secret Access Key: your keys. Path: your bucket name.
3. Double-click the bookmark to browse, then drag and drop to upload or download.

## 4. Python (boto3)

```python
import boto3
s3 = boto3.client(
    "s3",
    endpoint_url="https://YOUR_ENDPOINT",
    aws_access_key_id="YOUR_ACCESS_KEY",
    aws_secret_access_key="YOUR_SECRET_KEY",
)
s3.upload_file("results.csv", "your-bucket", "project1/results.csv")
s3.download_file("your-bucket", "project1/results.csv", "results_copy.csv")
for obj in s3.list_objects_v2(Bucket="your-bucket").get("Contents", []):
    print(obj["Key"], obj["Size"])
```

Read the keys from environment variables or a file outside your code repository rather than typing them into scripts. R users can use the `aws.s3` package the same way.

## 5. Sharing data

- **Collaborators who need to write:** add them to the project and the bucket (see [Getting OSN storage](../kb039-osn-getting-storage/)).
- **Readers:** give them the **read-only** keys.
- **Everyone:** ask for anonymous access when you request the bucket. Anyone can then read with `https://YOUR_ENDPOINT/your-bucket/path/to/file` or rclone with no keys:

```bash
rclone ls --s3-provider Ceph --s3-endpoint https://YOUR_ENDPOINT :s3:your-bucket
```

## 6. Good habits

- Name files with lower case letters, numbers, hyphens, underscores and periods. Avoid names that differ only by case.
- Bundle many tiny files into archives before uploading. Object stores handle fewer, larger objects better.
- Keep another copy of anything irreplaceable somewhere else.

Next: [Using OSN from compute systems](../kb041-osn-with-compute/).
