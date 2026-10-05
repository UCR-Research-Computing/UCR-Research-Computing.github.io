---
title: "HPCC storage (GPFS)"
parent: Storage
parent_url: /storage/
kicker: "Storage <span class='sep'>|</span> Operated by the HPCC"
description: "Fast parallel storage attached to every node of the campus cluster, for data being actively computed on."
status: Available
tags: [Working data, Parallel file system, Recharge]
data_levels: P1-P2
owner: "High-Performance Computing Center (HPCC)"
reviewed: 2026-10-04
governed_by: "HPCC Recharging Rates 2026/2027"
governed_url: https://hpcc.ucr.edu/about/overview/rates/
redirect_from:
  - /pages/hpcc_gpfs.html
fit:
  - Input and output for jobs running on the HPCC cluster
  - Large datasets that are being analyzed now
  - Lab-shared working space on the cluster
not_fit:
  - Long-term archive of finished data
  - Data rated P3 or P4
  - Collaboration with people who do not have HPCC accounts
glance:
  - {k: "Who can use it", v: "HPCC account holders"}
  - {k: "Included", fact: hpcc_user_storage}
  - {k: "Extra (rent)", fact: hpcc_storage_rent_tb}
  - {k: "Lab-owned disk", fact: hpcc_owned_storage_fee}
  - {k: "Data allowed", v: "P1 and P2"}
cta:
  - {label: "HPCC storage details", url: "https://hpcc.ucr.edu/about/overview/access/"}
  - {label: "Compare storage", url: "/storage/"}
---

## What it is

The HPCC's parallel file system (GPFS) is mounted on all of the cluster's CPU and GPU nodes, so jobs read and write data in place without copying it elsewhere first. The HPCC describes its storage as {% include fact.html id="hpcc_storage_capacity" %}.

## Costs

Each standard user account includes {% include fact.html id="hpcc_user_storage" bare=true %}. Labs can rent more ({% include fact.html id="hpcc_storage_rent_tb" bare=true %} or {% include fact.html id="hpcc_storage_rent_gb" bare=true %}) or buy their own disks to HPCC specifications with an annual maintenance fee ({% include fact.html id="hpcc_owned_storage_fee" bare=true %}). Owned disk has a supported lifetime set by the HPCC's owned-storage document, after which it must be replaced or moved to rental. The [HPCC Recharging Rates](https://hpcc.ucr.edu/about/overview/rates/) are the authority.

## Keep in mind

Treat cluster storage as working space. When an analysis is finished, move results you must keep to project storage or an archive. See [Storage]({{ '/storage/' | relative_url }}) for the data lifecycle.
