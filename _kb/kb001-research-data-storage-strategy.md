---
title: "Research data storage at UCR: choosing by stage"
kb_id: KB001
topic: Storage
audience: "UCR faculty, postdocs, researchers and students"
reviewed: 2026-10-08
owner: Research Computing
redirect_from:
  - /Knowledge_Base/KB001_Research_Data_Storage_Strategy.html
---

Research data moves through stages: data you are computing on, project data the lab shares, documents you collaborate on, and data you must keep long term. Each stage has a storage option suited to it. This article maps them. Figures come from the source named beside each one, and the source is the authority.

## Working data (hot): HPCC parallel storage

**Best for:** active computation and data currently being processed on the HPCC cluster.

- Each standard HPCC user account includes {% include fact.html id="hpcc_user_storage" %}.
- Labs can rent more ({% include fact.html id="hpcc_storage_rent_tb" bare=true %}) or buy disks to HPCC specifications, with an annual maintenance fee.
- Details: [HPCC storage (GPFS)](../../services/hpcc-storage/).

## Project data (warm): CephRDS

**Best for:** lab shares, sequencing libraries, instrument output and other data that must stay online.

- Status: **pilot**. Terms and capacity may change during the pilot.
- Access over S3, with tools such as rclone and Cyberduck.
- Rates: under review, not yet approved.
- Details: [CephRDS](../../services/cephrds/).

Cloud projects that need high-performance shared file systems (such as Google Filestore) can use them through a recharged Ursa Major project or a [cloud account](../../services/cloud-accounts/).

## Collaboration: Google Drive and OneDrive

**Best for:** manuscripts, administrative files, protocols and lightweight shared files.

- Google Drive: {% include fact.html id="google_drive_default" %}.
- ITS notes that {% include fact.html id="google_drive_extra" bare=true %}.
- Details: [Google Drive and OneDrive](../../services/google-drive/) and the [ITS storage page](https://its.ucr.edu/storage).

## Long-term archive (cold): Ursa Major archive storage

**Best for:** raw data you are required to keep, reproducibility snapshots, and second copies.

- Uses Google Cloud archive classes (such as Coldline). Reading data back can carry retrieval charges.
- Under current Ursa Major terms, archive storage may be available without recharge to the lab, within limits and subject to eligibility. This depends on continued campus funding, and no duration is committed.
- Details: [Cloud archive](../../services/cloud-archive/) and [KB012: Using Ursa Major archive storage](../kb012-migrating-data-to-archive/).

## Before you choose

- Check the data's [protection level](../../security/#data-protection-levels). P3 and P4 data need a review first.
- Check how long you must keep it: [records retention](../../security/records-retention/).
- Keep at least one copy of irreplaceable raw data away from where you compute on it.
