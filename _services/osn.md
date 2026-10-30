---
title: "Open Storage Network (OSN)"
kicker: "National <span class='sep'>|</span> S3 object storage through NSF ACCESS"
description: "NSF-funded S3-compatible object storage, allocated through ACCESS, for sharing datasets across institutions, hosting public data and feeding pipelines on any platform."
status: External
tags: [Object (S3), Data sharing, ACCESS]
data_levels: Non-sensitive only (P1; no protected data)
owner: "Open Storage Network (the service); Research Computing (UCR guidance)"
reviewed: 2026-10-29
governed_by: "ACCESS allocation policies and OSN documentation"
governed_url: https://openstoragenetwork.github.io/docs/
fit:
  - Datasets shared with collaborators at other institutions
  - Public datasets that funders or journals ask you to make available
  - Data that feeds jobs on the OSPool, Nautilus, ACCESS systems or the cloud
  - Labs comfortable with S3 tools such as rclone, the AWS CLI or Cyberduck
not_fit:
  - Any protected data (HIPAA, FERPA, PII, CUI and similar)
  - The only copy of irreplaceable data (keep another copy elsewhere)
  - Data you need mounted as a normal file system on the HPCC
  - Long-term records you are required to retain (see records retention)
glance:
  - {k: "Who runs it", v: "The Open Storage Network, an NSF-funded partnership"}
  - {k: "Access", v: "An ACCESS allocation, then a bucket request in the OSN portal"}
  - {k: "Interface", v: "S3-compatible (rclone, AWS CLI, Cyberduck, Python, R)"}
  - {k: "Cost", v: "No recharge from UCR; ACCESS awards the allocation"}
cta:
  - {label: "Researcher guide", url: "/kb/kb038-osn-researcher-guide/"}
  - {label: "Get OSN storage", url: "/kb/kb039-osn-getting-storage/"}
  - {label: "Move data in and out", url: "/kb/kb040-osn-moving-data/"}
  - {label: "OSN documentation", url: "https://openstoragenetwork.github.io/docs/"}
---

## What it is

The Open Storage Network (OSN) is a national, NSF-funded object store. Storage sits in "pods" at several sites, joined by research networks, and you reach it with the same S3 tools used for Amazon S3. Storage is allocated as buckets. Each bucket has a read-write key pair and a read-only key pair, and can be made publicly readable.

OSN is allocated through [NSF ACCESS]({{ '/services/nsf-access/' | relative_url }}): you exchange ACCESS credits for OSN storage, then request buckets in the OSN portal. The OSN documentation describes project allocations of {% include fact.html id="osn_allocation_range" %}.

## How it fits with other UCR storage

OSN is for data that has to move between institutions or platforms, or be published openly. For lab data that stays on campus, use [CephRDS]({{ '/services/cephrds/' | relative_url }}). For data being computed on at the HPCC, use [HPCC storage]({{ '/services/hpcc-storage/' | relative_url }}). OSN buckets can also be connected to the [Open Science Data Federation]({{ '/services/osdf/' | relative_url }}) so that OSPool jobs read them through its caches.

## Data policy

OSN is for open science data. Do not store protected data there (see the [data protection levels]({{ '/security/#data-protection-levels' | relative_url }})). Anyone holding a bucket key has full access at that key's level, so treat keys like passwords.

## How to get started

Read the [researcher guide to OSN]({{ '/kb/kb038-osn-researcher-guide/' | relative_url }}), then follow [Getting OSN storage]({{ '/kb/kb039-osn-getting-storage/' | relative_url }}) and [Moving data in and out of OSN]({{ '/kb/kb040-osn-moving-data/' | relative_url }}). Research Computing can look over an ACCESS request with you and help you choose between OSN and campus storage. [Contact us]({{ '/help/' | relative_url }}).
