---
title: "Ursa Major cloud storage"
topic: Storage
audience: "Researchers with an Ursa Major project"
reviewed: 2026-10-04
owner: Research Computing
redirect_from:
  - /Knowledge_Base/Ursa_Major_Research_Storage.html
---

Ursa Major projects can store data in Google Cloud Storage buckets. How storage is funded depends on the storage class and scale.

* [How to create a storage bucket](../ursa-major-storage-create-bucket/)
* [How to access a storage bucket](../ursa-major-storage-access-bucket/)

## Storage by tier

**Tier 1: archive storage.** Under current Ursa Major terms, archive storage classes (such as Coldline) may be available without recharge to the lab, within limits and subject to eligibility. This depends on continued campus funding. See [Cloud archive](../../services/cloud-archive/).

**Tier 2: everything else.** Standard-class storage for active work, persistent disks and managed file systems (such as Google Filestore) are recharged to a lab funding source under an MOU. For large active datasets, also consider campus options such as [HPCC storage](../../services/hpcc-storage/) and [CephRDS](../../services/cephrds/).

## Analytics

Data in Cloud Storage can be analyzed with services such as BigQuery. Analytics services such as BigQuery are recharged (Tier 2). See [KB005](../kb005-ursa-major-service-tiers/).

## Sharing and security

Buckets use Google Cloud's access controls and are encrypted at rest and in transit by default. You control who can access your buckets. Sensitive data (P3, P4 or regulated) needs a review and an appropriate environment before it is stored. See [Security and Data](../../security/).

## Documents and collaboration

For documents and day-to-day collaboration, use [Google Drive](../../services/google-drive/). ITS publishes its quotas on the [ITS storage page](https://its.ucr.edu/storage).
