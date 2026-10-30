---
title: "Researcher guide to the Open Storage Network (OSN)"
kb_id: KB038
topic: Storage
description: "What OSN is, when to use it instead of campus storage, how buckets and keys work, and the path from an ACCESS allocation to data in a bucket."
audience: "UCR faculty, postdocs, staff and students who share data across institutions, publish datasets or feed pipelines on several platforms"
reviewed: 2026-10-29
owner: Research Computing
series: osn
series_order: 1
review_notes:
  - "Written 2026-10-29 from the OSN user documentation (openstoragenetwork.github.io/docs: Why use OSN, ACCESS Allocations, The OSN Portal, Create an OSN Bucket, Read and Write Data; fetched 2026-10-29)."
  - "Tested 2026-10-29: signed in to the OSN portal (coldfront.osn.mghpcc.org) with an ACCESS identity, completed an annual project review, requested a bucket and requested an allocation renewal. A UCR (InCommon) sign-in reached the portal but showed no projects."
  - "CHECK: the OSN docs and the OSN 'Get an allocation' page disagree on the minimum (1 TB vs 10 TB); the page quotes the docs. Confirm with help@osn.mghpcc.org."
---

## 1. What OSN is

The Open Storage Network is national **S3 object storage** funded by the NSF. It is allocated through [NSF ACCESS](../../services/nsf-access/) and reached with ordinary S3 tools, from a laptop, the HPCC, Nautilus, an OSPool job or the cloud.

Object storage is not a mounted drive. You put and get whole files ("objects") in a **bucket** over HTTPS. In exchange, any number of people and machines can read the same data from anywhere.

## 2. When to use it

| You want to | Use |
| --- | --- |
| Share a dataset with collaborators at other universities | OSN |
| Make a dataset publicly downloadable for a grant or paper | OSN (anonymous read bucket), or a repository such as Dryad for a DOI |
| Feed the same data to jobs on several platforms | OSN, optionally connected to the [OSDF](../../services/osdf/) |
| Keep lab data on campus, shared within UCR | [CephRDS](../../services/cephrds/) |
| Compute on data at the HPCC | [HPCC storage](../../services/hpcc-storage/) |
| Keep records you are required to retain | [Records retention](../../security/records-retention/) and the [cloud archive](../../services/cloud-archive/) |

OSN is for open science data only. Do not put protected data there.

## 3. Buckets, keys and endpoints

Each OSN bucket has:

- an **endpoint**, the address of the pod that holds it (for example `https://sdsc.osn.xsede.org`);
- a **name** and a **quota** in terabytes;
- a **read-write key pair** for you and your writers;
- a **read-only key pair** you can hand to readers;
- an **anonymous access** setting: when on, anyone can read without keys (writing always needs keys).

You find all of these on the bucket's page in the OSN portal. Treat keys like passwords: never commit them to Git or paste them in email.

## 4. The path from nothing to data in a bucket

1. **[Getting OSN storage](../kb039-osn-getting-storage/):** an ACCESS project, exchanging credits for OSN, signing in to the OSN portal, requesting a bucket, adding people.
2. **[Moving data in and out of OSN](../kb040-osn-moving-data/):** rclone, the AWS CLI, Cyberduck and Python; uploading, downloading, syncing and sharing.
3. **[Using OSN from compute systems](../kb041-osn-with-compute/):** reading and writing OSN from the HPCC, Nautilus, OSPool jobs and notebooks, and keeping your project in good standing.

## 5. Getting help

- OSN: [help@osn.mghpcc.org](mailto:help@osn.mghpcc.org) and the [OSN documentation](https://openstoragenetwork.github.io/docs/).
- ACCESS allocations: [ACCESS support](https://support.access-ci.org/).
- Research Computing can look over your ACCESS request and help you choose between OSN and campus storage. [Contact us](../../help/).
