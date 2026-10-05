---
title: "CephRDS"
kicker: "Storage <span class='sep'>|</span> On-campus research data storage"
description: "On-campus project storage for lab data, instrument output and sequencing libraries, accessed over S3. Currently in pilot."
status: Pilot
tags: [Object storage (S3), Project data, Recharge]
data_levels: P1-P2
owner: "Research Computing"
reviewed: 2026-10-04
governed_by: "CephRDS pilot terms (set out when storage is allocated)"
redirect_from:
  - /pages/ceph_secure_research_storage.html
  - /pages/cephrds.html
fit:
  - Lab and project data that must stay online and shared within the group
  - Instrument output, imaging and sequencing libraries
  - Data accessed from scripts, pipelines or the cluster over S3
not_fit:
  - Data rated P3 or P4
  - Real-time document collaboration (use Google Drive)
  - Scratch space for running jobs (use HPCC storage)
  - Use cases that need a fixed long-term capacity commitment during the pilot
  - Mounting as a network drive over NFS or SMB (S3 access only)
  - Automatic deletion (lifecycle) rules
glance:
  - {k: "Who can use it", v: "UCR faculty and staff, allocated by project"}
  - {k: "Access", v: "S3-compatible API only, from the campus network or VPN"}
  - {k: "Rental", fact: cephrds_rent}
  - {k: "Purchase", fact: cephrds_purchase}
  - {k: "Data allowed", v: "P1 and P2"}
  - {k: "Status", v: "Pilot: terms and capacity may change"}
cta:
  - {label: "Request storage", url: "/kb/kb013-cephrds-onboarding/"}
  - {label: "Connect with rclone", url: "/kb/kb020-cephrds-mounting-folders/"}
---

## What it is

CephRDS is Research Computing's on-campus storage platform for active research data. It is built on Ceph, with the storage spread across campus data centers, and is accessed through an S3-compatible interface. The system was funded in part by an NSF Campus Cyberinfrastructure grant.

## What pilot means

CephRDS is in **pilot**. During the pilot, capacity is limited, terms may change, and allocations are reviewed individually. Pilot participation is not a commitment to a specific capacity, price or term beyond what is agreed in writing for your allocation.

## Costs

Pilot rates are {% include fact.html id="cephrds_rent" %} for rented capacity, or {% include fact.html id="cephrds_purchase" bare=true %} for purchased capacity. The terms that apply are the ones set out when your storage is allocated. See [Costs]({{ '/costs/' | relative_url }}).

## How to get access

The PI or lab lead requests storage through Research Computing. [KB013: CephRDS onboarding and access]({{ '/kb/kb013-cephrds-onboarding/' | relative_url }}) walks through the request, the access keys and the first connection.

## Connect and use

- [KB018: CephRDS with Python (boto3)]({{ '/kb/kb018-cephrds-python-boto3/' | relative_url }})
- [KB019: CephRDS with Cyberduck and other desktop clients]({{ '/kb/kb019-cephrds-gui-clients/' | relative_url }})
- [KB020: Mounting CephRDS buckets as local folders with rclone]({{ '/kb/kb020-cephrds-mounting-folders/' | relative_url }})

## Keep in mind

Keep your access keys private. Whether a given allocation is backed up, and how, is part of its terms. Ask before relying on CephRDS as the only copy of irreplaceable data. See [backups are not archives]({{ '/storage/#backups-are-not-archives' | relative_url }}).
