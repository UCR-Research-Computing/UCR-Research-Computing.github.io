---
title: "Using Ursa Major archive storage"
kb_id: KB012
topic: Storage
audience: "Researchers who need to keep data long term"
updated: 2026-02-09
reviewed: 2026-10-04
renumbered_from: "KB007 (Migrating Data to Archive)"
owner: Research Computing
redirect_from:
  - /Knowledge_Base/KB007_Migrating_Data_to_Archive.html
---

## Overview

Ursa Major archive storage uses Google Cloud archive storage classes, chiefly **Coldline**. These classes are designed for data you need to keep (for funder requirements, reproducibility or backup) but rarely read.

**Key rule:** reading data back from Coldline carries a retrieval charge, and objects deleted early carry a minimum storage duration charge. Do not use it for data you analyze actively. It suits data you read less than about once a quarter.

## Why archive classes

Archive classes cost much less per terabyte to store than Standard storage or provisioned disks. Google publishes current prices on its [Cloud Storage pricing page](https://cloud.google.com/storage/pricing). Under current Ursa Major terms, archive storage may be available without recharge to the lab, within limits. See [Cloud archive](../../services/cloud-archive/).

## How to archive data

### Method A: change a bucket's default storage class

If you have a Standard bucket (`gs://my-lab-data`) and want new objects stored as archive:

1. In the Google Cloud console, open **Cloud Storage**.
2. Click the bucket name.
3. Open the **Configuration** tab.
4. Change **Default storage class** to **Coldline**.

This affects *new* objects only. To change existing objects, use a lifecycle rule (Method B).

### Method B: lifecycle rule (automatic transition)

Moves objects that have not changed for 30 days. Create `lifecycle.json`:

```json
{
  "rule": [
    {
      "action": { "type": "SetStorageClass", "storageClass": "COLDLINE" },
      "condition": { "age": 30, "matchesStorageClass": ["STANDARD"] }
    }
  ]
}
```

Apply it:

```bash
gcloud storage buckets update gs://my-bucket-name --lifecycle-file=lifecycle.json
```

### Method C: upload directly to archive

```bash
gcloud storage cp -r --storage-class=COLDLINE ./my_local_data/ gs://my-archive-bucket/
```

## Recovering a locked project's disks

If a project was locked or suspended because of unattached ("orphaned") disks, Research Computing can help:

1. Take a snapshot of the disk.
2. Export the snapshot to a Coldline bucket.
3. Delete the disk.

The data is then kept in archive storage instead of on a provisioned disk. To request this, contact Research Computing and ask for a "snapshot export to Coldline" for your project.

## Before you archive

Check how long you are required to keep the data ([records retention](../../security/records-retention/)), and keep a record of what you archived and where.
