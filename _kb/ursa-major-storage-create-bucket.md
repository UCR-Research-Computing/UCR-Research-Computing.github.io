---
title: "Creating an Ursa Major storage bucket"
topic: Storage
owner: Research Computing
reviewed: 2026-10-04
review_notes:
  - "Chuck 2026-10-04: us-central1 is the Ursa Major default region."
  - "Updated console steps (Cloud Storage, Buckets, Create) and replaced the legacy gsutil mb command with gcloud storage buckets create, with project, location, storage class, uniform access and public access prevention."
  - "Added tier context for storage classes: Standard and other active classes are Tier 2 recharge; Coldline/Archive are Tier 1 under current terms, with retrieval charges."
redirect_from:
  - /Knowledge_Base/Ursa_Major_Research_Storage_How_to_Create_Bucket.html
---

This guide shows how to create a Google Cloud Storage bucket in your Ursa Major project. To upload, download and share files afterward, see [Accessing an Ursa Major storage bucket](../ursa-major-storage-access-bucket/).

## Choose a storage class

The storage class decides how the bucket is funded:

- **Standard** (and other classes for active data, such as Nearline): Tier 2, recharged to a lab funding source under an MOU.
- **Coldline and Archive:** Tier 1 under current terms, within limits and subject to eligibility. Use them for data you need to keep but rarely read. Reading data back carries retrieval charges, and these classes have minimum storage durations. See [Cloud archive](../../services/cloud-archive/) and [KB012: Using Ursa Major archive storage](../kb012-migrating-data-to-archive/).

See [KB005: Ursa Major service tiers](../kb005-ursa-major-service-tiers/) and Google's [storage classes](https://cloud.google.com/storage/docs/storage-classes) page. For large active datasets, also consider [HPCC storage](../../services/hpcc-storage/) and [CephRDS](../../services/cephrds/).

**Sensitive data:** P3, P4 or regulated data needs a review before it is stored. See [Security and Data](../../security/).

## Web console

1. Go to the [Google Cloud console](https://console.cloud.google.com/) and select your project (for example `my-lab-project`).
2. Open the navigation menu and select **Cloud Storage**, then **Buckets**.
3. Click **Create**.
4. **Name:** enter a name. Bucket names are globally unique across all of Google Cloud, so include something specific to your lab (for example `my-lab-bucket`). Do not put sensitive information in the name.
5. **Location:** choose where the data is stored. Use the single region `us-central1` (Iowa), the Ursa Major default, unless your work needs another region.
6. **Storage class:** choose a default class (see above).
7. **Access control:** keep **Prevent public access** on and choose **Uniform** access control.
8. Click **Create**.

## Command line (gcloud)

Use the [Google Cloud CLI](https://cloud.google.com/sdk/docs/install), or [Cloud Shell](https://console.cloud.google.com/) in the console.

1. Sign in and set your project:

   ```bash
   gcloud auth login
   gcloud config set project my-lab-project
   ```

2. Create the bucket:

   ```bash
   gcloud storage buckets create gs://my-lab-bucket \
       --location=us-central1 \
       --default-storage-class=STANDARD \
       --uniform-bucket-level-access \
       --public-access-prevention
   ```

   For an archive bucket, use `--default-storage-class=COLDLINE` or `ARCHIVE`.

3. Check that the bucket exists:

   ```bash
   gcloud storage ls
   ```

Replace `my-lab-project`, `my-lab-bucket` and the location with your own values. Google's guide: [Create buckets](https://cloud.google.com/storage/docs/creating-buckets).

Questions: [research-computing@ucr.edu](mailto:research-computing@ucr.edu).
