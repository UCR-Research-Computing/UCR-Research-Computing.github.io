---
layout: default
title: "Accessing CephRDS with Python (boto3)"
parent: Knowledge Base
---

# Accessing CephRDS with Python (boto3)

CephRDS is fully compatible with the Amazon S3 API, meaning you can interact with it programmatically using standard S3 libraries like Python's `boto3`.

## Prerequisites
* Python 3.x installed
* The `boto3` library installed (`pip install boto3`)
* Your CephRDS Access Key and Secret Key

## Code Example

Below is a standard Python snippet to connect to your CephRDS bucket, list its contents, and upload a file. The crucial step is overriding the default AWS `endpoint_url` with our UCR endpoint.

```python
import boto3

# Configuration
ACCESS_KEY = 'your_access_key'
SECRET_KEY = 'your_secret_key'
ENDPOINT_URL = 'https://rds.ucr.edu'
BUCKET_NAME = 'your_bucket_name'

# Initialize the S3 client
s3_client = boto3.client('s3',
    endpoint_url=ENDPOINT_URL,
    aws_access_key_id=ACCESS_KEY,
    aws_secret_access_key=SECRET_KEY
)

# List objects in the bucket
response = s3_client.list_objects_v2(Bucket=BUCKET_NAME)
if 'Contents' in response:
    for obj in response['Contents']:
        print(obj['Key'])

# Upload a file
file_to_upload = 'local_data.csv'
s3_client.upload_file(file_to_upload, BUCKET_NAME, 'cloud_data.csv')
print("Upload complete!")
```

## Security Note
Never hardcode your credentials directly into your scripts. It is highly recommended to load `ACCESS_KEY` and `SECRET_KEY` from environment variables or a `.env` file to prevent accidentally committing them to version control systems like GitHub.
