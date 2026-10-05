---
title: "Cloud archive (Ursa Major)"
parent: Storage
parent_url: /storage/
kicker: "Storage <span class='sep'>|</span> Long-term retention in Google Cloud"
description: "Archive-class cloud storage for data you are required to keep but rarely read, through an Ursa Major project."
status: By review
tags: [Archive, Retention, Google Cloud]
data_levels: P1-P2
owner: "Research Computing"
reviewed: 2026-10-04
governed_by: "Ursa Major guidelines"
governed_url_rel: /kb/ursa-major-guidelines/
redirect_from:
  - /pages/ursa_major_data.html
fit:
  - Raw data and project snapshots kept for funder or university retention rules
  - Data you rarely read but cannot lose
  - A second copy of data held elsewhere
not_fit:
  - Data you read or change often (retrieval from archive classes is slower and can carry charges)
  - Data rated P3 or P4 outside an approved environment
  - The only plan for data with a retention requirement you have not checked
glance:
  - {k: "Who can use it", v: "UCR labs with an Ursa Major project"}
  - {k: "Storage class", v: "Google Cloud archive classes (for example Coldline)"}
  - {k: "Cost", v: "May be available without recharge under current Ursa Major terms, within limits; see the guidelines"}
  - {k: "Data allowed", v: "P1 and P2"}
cta:
  - {label: "Ask about archive", url: "/help/"}
  - {label: "Archive how-to", url: "/kb/kb012-migrating-data-to-archive/"}
---

## What it is

Labs with an Ursa Major project can keep long-term data in Google Cloud archive storage classes. These are designed for data you are required to keep but expect to read rarely, such as raw instrument data held to meet a funder's retention rules.

## Costs and terms

Under the current Ursa Major terms, archive storage may be available without recharge to the lab, within limits and subject to eligibility. That coverage depends on continued campus funding. Research Computing makes no commitment about how long it will continue or at what scale. Retrieval, early deletion and other operations can carry charges. The [Ursa Major guidelines]({{ '/kb/ursa-major-guidelines/' | relative_url }}) describe the current terms.

Plan for the possibility that terms change during the life of your data. Keep a record of what you archived, where, and why.

## How to use it

[KB012: Using Ursa Major archive storage]({{ '/kb/kb012-migrating-data-to-archive/' | relative_url }}) shows how to move data into archive classes. Before you start, check how long you are required to keep the data: see [records retention]({{ '/security/records-retention/' | relative_url }}).
