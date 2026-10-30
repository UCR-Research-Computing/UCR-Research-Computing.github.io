---
title: "Open Science Data Federation (OSDF)"
kicker: "National <span class='sep'>|</span> Data delivery for distributed computing"
description: "A national network of data origins and caches, run by the OSG with Pelican software, that delivers datasets to OSPool jobs, notebooks and laptops."
status: External
tags: [Data delivery, Caching, Pelican]
data_levels: Non-sensitive only (P1; no protected data)
owner: "OSG and the Pelican Platform (the service); Research Computing (UCR guidance)"
reviewed: 2026-10-29
governed_by: "OSG and OSPool policies"
governed_url: https://osg-htc.org/services/osdf.html
fit:
  - OSPool jobs with input or output files over 1 GB, or inputs shared by many jobs
  - Container images used by many OSPool jobs
  - Reading datasets that are already published on the OSDF
  - Projects that want to share a dataset with many compute sites
not_fit:
  - Protected or confidential data (the OSDF is for open science data)
  - Files that change often under the same name (caches can serve an old copy)
  - A general-purpose place to keep your only copy of data
glance:
  - {k: "Who runs it", v: "The OSG, using software from the Pelican Platform"}
  - {k: "Access", v: "Comes with an OSPool account; public data needs no account"}
  - {k: "Client", v: "HTCondor osdf:// URLs in jobs, or the pelican command"}
  - {k: "Cost", v: "No recharge from UCR"}
cta:
  - {label: "Researcher guide", url: "/kb/kb034-ospool-researcher-guide/"}
  - {label: "Moving data with OSDF", url: "/kb/kb036-ospool-moving-data/"}
  - {label: "About the OSDF", url: "https://osg-htc.org/services/osdf.html"}
---

## What it is

The Open Science Data Federation (OSDF) joins many data repositories (called origins) into one national delivery network, with caches placed near the computers that read the data. It is part of the OSG's services and runs software from the [Pelican Platform](https://pelicanplatform.org/). Files are named with `osdf:///` paths, and the same path works from an OSPool job, a notebook or a laptop.

## Three ways UCR researchers use it

- **With the OSPool.** Every OSPool account on an OSG-operated access point includes OSDF space for larger inputs, outputs and containers. See [Moving data on the OSPool]({{ '/kb/kb036-ospool-moving-data/' | relative_url }}).
- **Reading public data.** Datasets published on the OSDF can be downloaded with the `pelican` command without an account.
- **Publishing a dataset.** A dataset in an [Open Storage Network]({{ '/services/osn/' | relative_url }}) bucket can be connected to the OSDF on request to the OSG, so that jobs anywhere read it through the caches.

## Data policy

The OSG describes the OSDF as suitable for non-public data from open science communities, but not for highly sensitive data. Non-public data is encrypted on the network, not on disk at the caches. Do not use it for protected data.

## How to get started

Start with the [researcher guide to the OSPool and OSDF]({{ '/kb/kb034-ospool-researcher-guide/' | relative_url }}). For help deciding whether your data fits, [contact Research Computing]({{ '/help/' | relative_url }}).
