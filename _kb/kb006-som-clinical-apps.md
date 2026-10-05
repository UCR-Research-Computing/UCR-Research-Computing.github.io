---
title: "Clinical and HIPAA applications: where to host them"
kb_id: KB006
topic: Security
audience: "School of Medicine researchers, lab managers and IT staff"
updated: 2026-02-13
reviewed: 2026-10-04
owner: Research Computing
redirect_from:
  - /Knowledge_Base/KB006_SOM_Clinical_Apps.html
---

## Primary provider: SOM IT

The **School of Medicine Information Technology (SOM IT)** is the primary service provider for applications, databases and workloads involving:

- clinical data and protected health information (PHI);
- HIPAA requirements;
- medical center integrations (Epic and similar).

SOM IT maintains environments designed for these workflows. Contact SOM IT for architectural review.

## Research Computing on Google Cloud: infrastructure only

Research Computing can provide Google Cloud infrastructure for SOM projects, but only as infrastructure (IaaS). Research Computing does **not** provide managed hosting for HIPAA applications.

If SOM IT decides that Google Cloud is the preferred host, Research Computing can:

1. Create a project in the Ursa Major organization.
2. Link it to a grant funding source (COA). Clinical and HIPAA hosting is recharged; Tier 1 does not cover it.
3. Provide standard campus networking.

### What the research team is responsible for

The PI and the project's technical staff are responsible for:

- **Security:** writing the data security plan and obtaining Information Security Office approval.
- **Configuration:** hardening operating systems, configuring firewalls and managing access.
- **Regulatory requirements:** meeting all HIPAA and IRB requirements.
- **Operations:** patching, monitoring and backups.

Research Computing does not access or manage the data in these projects, and does not attest to their compliance. Responsibility for the data and for meeting regulatory requirements rests with the PI and their unit.

## Decision guide

| Requirement | Where to host |
| --- | --- |
| Standard (non-clinical) research | Research Computing services (HPCC, Ursa Major) |
| Clinical data or PHI | SOM IT |
| Clinical application on Google Cloud | Self-managed project, recharged, owned by the PI |
