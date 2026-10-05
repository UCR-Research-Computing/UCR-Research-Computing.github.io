---
title: "Cloud accounts (AWS, GCP, Azure)"
kicker: "Cloud <span class='sep'>|</span> Through ITS and University of California agreements"
description: "Your own cloud account under the University of California agreements with major providers, billed to your funds through ITS."
status: Available
tags: [Cloud, Recharge, MOU]
data_levels: Varies by configuration
owner: "ITS"
reviewed: 2026-10-04
governed_by: "Your ITS MOU and the UC agreement with the provider"
redirect_from:
  - /pages/gcp_aws_edp.html
  - /pages/gcs_aws_s3.html
  - /pages/gcp_subscription_agreements.html
  - /pages/GCP_and_AWS_Cloud_Credits.html
fit:
  - Labs that need their own cloud account, billed to a grant or other funds
  - Work that needs a specific provider's services
  - Projects funded with cloud credits from a provider program
not_fit:
  - Batch or GPU computing where the HPCC fits (usually lower cost to the lab)
  - Regulated data outside an approved environment
  - Accounts on personal credit cards for university work
glance:
  - {k: "Providers", v: "Amazon Web Services, Google Cloud, Microsoft Azure"}
  - {k: "How", v: "Request through ITS; an MOU and a funding source are required"}
  - {k: "Setup fee", fact: cloud_admin_setup}
  - {k: "Annual fee", fact: cloud_admin_annual}
  - {k: "Usage", v: "Billed at the rates in the UC agreement"}
cta:
  - {label: "Request a cloud account", url: "https://ucrsupport.service-now.com/ucr_portal?id=sc_cat_item&sys_id=550e9fb61b7ebc90609f86e9cd4bcb8d"}
  - {label: "Talk it through", url: "/help/"}
---

## What it is

The University of California has agreements with major cloud providers that include negotiated pricing for UC campuses. Through ITS, a UCR lab can have a cloud account under these agreements, billed to the lab's funds. Discount levels and agreement terms are set by the agreements, change when they are renewed, and are confirmed in your MOU rather than on this page.

## How to get an account

1. Request a cloud account through the [UCR Support Portal](https://ucrsupport.service-now.com/ucr_portal?id=sc_cat_item&sys_id=550e9fb61b7ebc90609f86e9cd4bcb8d).
2. ITS drafts an MOU that sets out the services, fees and billing.
3. You provide a funding source (COA) for the recharge.
4. ITS creates the account or moves an existing one under the agreement.

## Costs

Usage is billed at the agreement rates. ITS administrative fees apply: {% include fact.html id="cloud_admin_setup" %} and {% include fact.html id="cloud_admin_annual" bare=true %}. The MOU is the authority.

## Cloud credits

Both Google and AWS run research credit programs that UCR researchers can apply for: [Google Cloud for researchers](https://cloud.google.com/edu/researchers) and [AWS Cloud Credit for Research](https://aws.amazon.com/government-education/research-and-technical-computing/cloud-credit-for-research/). Eligibility, amounts and terms are set by the provider. Research Computing can help you think through an application.

## Storage in the cloud

Object storage such as Google Cloud Storage or Amazon S3 is available in these accounts at the agreement rates. For archive storage through Ursa Major, see [Cloud archive]({{ '/services/cloud-archive/' | relative_url }}).
