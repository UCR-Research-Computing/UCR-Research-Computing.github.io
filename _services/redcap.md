---
title: "REDCap"
parent: Security
parent_url: /security/
kicker: "Data collection <span class='sep'>|</span> Surveys and research databases"
description: "Secure web application for building and managing online research surveys and longitudinal study databases, organized by faculty-led labs at https://redcap.ucr.edu."
status: Available
tags: [Surveys, Study databases, Faculty PI required]
data_levels: Per IRB and DSP (no HIPAA)
owner: "Research Computing"
reviewed: 2026-11-17
governed_by: "UC IS-3, UCR IRB requirements, and the study's data security plan where applicable"
governed_url: https://security.ucop.edu/policies/institutional-information-and-it-resource-classification.html
fit:
  - Online research surveys, participant screening, longitudinal questionnaires and lab study databases
  - Faculty-led UCR research groups (graduate students, postdocs, staff and undergraduate RAs work under a faculty PI)
  - Non-clinical human-subjects studies with UCR IRB approval, and identifiable/P3-P4 survey studies once an ISO-approved data security plan is in place
  - Multi-institution studies where external collaborators need project-scoped REDCap accounts sponsored by the UCR faculty PI
not_fit:
  - Clinical care, medical records, HIPAA workflows or Protected Health Information (use the School of Medicine REDCap instance through SOM IT; see KB006)
  - Unsponsored student or trainee projects without a PI-eligible UCR faculty member serving as lab PI and institutional data custodian
  - Federal controlled data under NIST SP 800-171 or CMMC Level 2 (see the secure research enclave)
  - Bulk storage for large raw instrument, imaging or genomic files (use CephRDS, HPCC storage or OSN)
glance:
  - {k: "Address", v: "https://redcap.ucr.edu"}
  - {k: "Who can sponsor access", v: "PI-eligible UCR faculty (lab members join under their faculty PI)"}
  - {k: "Sign-in", v: "UCR Shibboleth Login (NetID + Duo; no VPN needed)"}
  - {k: "Cost", v: "No recharge to the lab from UCR under current terms"}
  - {k: "Data allowed", v: "P1-P2; identifiable or P3-P4 human-subjects data after IRB and ISO DSP review (no HIPAA/PHI)"}
  - {k: "Clinical / HIPAA studies", v: "School of Medicine REDCap via SOM IT (see KB006)"}
cta:
  - {label: "Request lab access (KB054)", url: "/kb/kb054-redcap-access-and-onboarding/"}
  - {label: "Data security plans", url: "/kb/ucr-data-security-plans/"}
---

## What it is

REDCap (Research Electronic Data Capture) is a web application developed at Vanderbilt University for building and managing online surveys and research databases. It supports branching logic, longitudinal study schedules, survey invitations, role-based user permissions, audit trails, API access, and exports to R, Python, Stata, SPSS, SAS and CSV.

Research Computing administers the campus REDCap application at [https://redcap.ucr.edu](https://redcap.ucr.edu), with server infrastructure maintained by ITS Systems. The School of Medicine operates a separate REDCap instance (`redcap.medsch.ucr.edu`) through School of Medicine Information Technology (SOM IT) for clinical and HIPAA studies; see [KB006: Clinical and HIPAA applications]({{ '/kb/kb006-som-clinical-apps/' | relative_url }}).

## Organized by faculty-led labs

Access on the campus REDCap instance is organized by **faculty-led research labs**, matching UCR Institutional Review Board (IRB) PI-eligibility rules and campus data-custodianship requirements:

- **A PI-eligible UCR faculty member anchors every lab and project.** The faculty PI approves which lab members may access REDCap, serves as the institutional data custodian, and holds responsibility for IRB and Data Security Plan obligations.
- **Students, postdocs and staff run projects day-to-day under their PI.** Once a faculty PI approves their lab members, graduate students, postdoctoral scholars, lab managers and undergraduate research assistants can sign in, create projects, design instruments and manage study operations under the PI's direction. Anchoring access to a faculty lab keeps longitudinal and human-subjects datasets under continuous institutional stewardship when students graduate or change roles.
- **External collaborators.** Non-UCR collaborators on a joint study can receive local REDCap accounts at the UCR faculty PI's request. External accounts carry an expiration date (typically one year) and are renewed on PI request.

## Data levels, IRB approval and Data Security Plans

Which review steps apply depends on what your study collects:

| Study and data type | Where it belongs | Required review |
| --- | --- | --- |
| Non-human-subjects surveys or P1-P2 research data | Campus REDCap (`redcap.ucr.edu`) | Faculty PI approval |
| Human-subjects survey research without sensitive/P3-P4 identifiers | Campus REDCap (`redcap.ucr.edu`) | Faculty PI approval + UCR IRB approval (or determination) |
| Human-subjects data with direct identifiers or sensitive P3-P4 responses (non-HIPAA) | Campus REDCap (`redcap.ucr.edu`) | Faculty PI approval + UCR IRB approval + a [UCR Data Security Plan]({{ '/kb/ucr-data-security-plans/' | relative_url }}) reviewed with Research Computing and approved by the Information Security Office |
| Clinical studies, patient records or HIPAA / Protected Health Information (PHI) | School of Medicine REDCap (`redcap.medsch.ucr.edu`) | Contact SOM IT; see [KB006]({{ '/kb/kb006-som-clinical-apps/' | relative_url }}) |
| NIST SP 800-171 or CMMC Level 2 controlled data | Not REDCap | See the [secure research enclave]({{ '/services/secure-enclave/' | relative_url }}) |

For studies that need a Data Security Plan, Research Computing guides the lab through the [UCR Data Security Plan template]({{ '/kb/ucr-data-security-plans/' | relative_url }}) and drafts the technical sections from your approved IRB protocol before routing it to the Information Security Office for review.

## Costs

There is no recharge to the lab from UCR under current terms, subject to eligibility and continued campus support.

## How to get access

1. **Email `research-computing@ucr.edu` with your faculty PI.** Have the faculty PI send the request, or copy the faculty PI on your email so they can reply with approval. Include the UCR NetIDs (`netid@ucr.edu`) of everyone who needs access and brief answers to the three intake questions in [KB054: REDCap access, lab sponsorship and onboarding]({{ '/kb/kb054-redcap-access-and-onboarding/' | relative_url }}).
2. **Sign in once to initialize each account.** Research Computing adds approved NetIDs to the campus SSO allow list. Each person then signs in once at [https://redcap.ucr.edu](https://redcap.ucr.edu) using **UCR Shibboleth Login** (NetID and Duo) so their REDCap profile exists.
3. **Assign project rights inside REDCap.** Campus allow-list access lets a user sign in to REDCap; project-level access is managed inside REDCap (**User Rights**) by the faculty PI or the lab's designated project lead.

## Related guides

- [KB054: REDCap access, lab sponsorship and onboarding]({{ '/kb/kb054-redcap-access-and-onboarding/' | relative_url }})
- [UCR Data Security Plans (DSP)]({{ '/kb/ucr-data-security-plans/' | relative_url }})
- [KB006: Clinical and HIPAA applications]({{ '/kb/kb006-som-clinical-apps/' | relative_url }})
- [Records retention]({{ '/security/records-retention/' | relative_url }})
