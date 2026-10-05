---
title: "Storage"
heading: "Storage"
section: storage
permalink: /storage/
kicker: "Where to keep your data, at each stage"
kicker_plain: "Storage"
description: "Working, project, collaboration and archive storage: which fits which data, what is backed up, and how long you are required to keep it."
toc: true
owner: Research Computing
reviewed: 2026-10-04
redirect_from:
  - /pages/storage-overview.html
  - /pages/dryad.html
---

Most labs use more than one kind of storage, and move data between them as a project goes on. The right place depends on what the data is, how often you use it, who needs it, and its [protection level]({{ '/security/#data-protection-levels' | relative_url }}). ITS also publishes a campus-wide comparison on its [Storage at UCR](https://its.ucr.edu/storage) page.

## Storage by stage

| Stage | What it is for | Where |
| --- | --- | --- |
| Working (hot) | Data being computed on right now | [HPCC storage (GPFS)]({{ '/services/hpcc-storage/' | relative_url }}) |
| Project (warm) | Lab data that must stay online and shared | [CephRDS]({{ '/services/cephrds/' | relative_url }}) (pilot) |
| Collaboration | Documents, manuscripts, small shared files | [Google Drive and OneDrive]({{ '/services/google-drive/' | relative_url }}) |
| Archive (cold) | Data you must keep but rarely read | [Cloud archive]({{ '/services/cloud-archive/' | relative_url }}) |
| Cloud object | Data used by cloud workloads | [Cloud accounts]({{ '/services/cloud-accounts/' | relative_url }}), [Ursa Major]({{ '/services/ursa-major/' | relative_url }}) |
| Published | Data shared openly with a DOI | Dryad and other repositories (see below) |

{% assign st = "hpcc-gpfs,cephrds,drive,cloud-archive" | split: "," %}
<div class="hubgrid">{% for id in st %}{% assign s = site.data.services | where: "id", id | first %}{% include service-card.html s=s %}{% endfor %}</div>

## Backups are not archives

A **backup** is a recent copy kept so you can recover from a mistake or a failure. An **archive** is the long-term record you are required to keep. They solve different problems:

- Know which of your storage is backed up, how often, and for how long. Each service page and its terms say so; when in doubt, ask.
- Keep at least one copy of irreplaceable raw data somewhere other than where you compute on it.
- Before you archive, check how long you are required to keep the data. See [records retention]({{ '/security/records-retention/' | relative_url }}).

## Publishing data

Funders and journals increasingly ask for data to be shared. UC researchers can deposit data in [Dryad](https://datadryad.org/), a general-purpose repository that issues a DOI for each dataset. The [UCR Library](https://library.ucr.edu/) can advise on repositories and data management plans.

## Moving data

For large transfers between campus systems, national systems and collaborators, see [Globus data transfer]({{ '/kb/globus-transfer/' | relative_url }}). For CephRDS, see the [rclone guide]({{ '/kb/kb020-cephrds-mounting-folders/' | relative_url }}).
