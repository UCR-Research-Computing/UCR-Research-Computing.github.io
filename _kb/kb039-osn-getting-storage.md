---
title: "Getting OSN storage: ACCESS allocation, portal sign-in and bucket request"
kb_id: KB039
topic: Storage
description: "Create an ACCESS project, exchange credits for OSN storage, sign in to the OSN portal with your ACCESS identity, request a bucket, add people and keep the project current."
audience: "UCR PIs and the lab members who manage their data"
reviewed: 2026-10-29
owner: Research Computing
series: osn
series_order: 2
review_notes:
  - "Written 2026-10-29 from the OSN documentation (ACCESS Allocations, The OSN Portal, Create an OSN Bucket; fetched 2026-10-29)."
  - "Tested 2026-10-29 in the OSN portal (ColdFront 1.1.5) with an ACCESS identity: project page, annual project review form (reason + acknowledgement), 'Request Resource Allocation' with resource 'OSN Bucket (Storage)', Justification and TB fields, and 'Click to renew' on the OSN allocation. The bucket approval and keys step (section 5) was not yet seen."
  - "Tested 2026-10-29: signing in to ACCESS with a stale CILogon session gave 'User Not Registered'; deleting CILogon cookies at cilogon.org/me and choosing 'ACCESS CI (XSEDE)' fixed it."
  - "2026-10-30: exchange rate updated to the ACCESS catalog figure (conversionFactor 8014.5 / 8.0145 = 1,000 credits per TB); the OSN docs still say 3,000."
  - "CHECK: the 1 to 50 TB range is from the OSN docs."
---

## 1. Get an ACCESS project

OSN storage comes from an [NSF ACCESS](../../services/nsf-access/) allocation. If you do not have an ACCESS account and project yet, follow [KB009: Using NSF ACCESS](../kb009-using-nsf-access/) to create both. An **Explore** project is usually enough to start.

## 2. Exchange credits for OSN

In the [ACCESS allocations portal](https://allocations.access-ci.org/), open your project and choose to exchange credits for the **Open Storage Network** resource. ACCESS currently lists the rate as {% include fact.html id="osn_credit_rate" %} and the OSN documentation suggests starting with the minimum and adding more as you near your quota. Describe how OSN helps your project in a few sentences.

ACCESS Campus Champions can request a small test allocation. Say so in the exchange request.

## 3. Sign in to the OSN portal

The OSN portal is at [coldfront.osn.mghpcc.org](https://coldfront.osn.mghpcc.org/).

1. Click **Log in with Institutional Account**.
2. When CILogon asks for an identity provider, choose **ACCESS CI (XSEDE)**, not University of California, Riverside.
3. Sign in with your ACCESS username, password and Duo.

Your projects appear under **My Projects**. If you see no projects, you probably signed in with your UCR identity: log out and sign in again with ACCESS.

If ACCESS says **User Not Registered** even though you have an account, clear your CILogon cookies at [cilogon.org/me](https://cilogon.org/me/) and sign in again choosing ACCESS CI (XSEDE).

## 4. Request a bucket

Each bucket is its own allocation inside your project.

1. Open your project and scroll to **Allocations**.
2. Click **Request Resource Allocation**.
3. Check that the project name is right and the resource is **OSN Bucket (Storage)**.
4. In **Justification**, give the bucket name you would like (lower case letters, numbers and hyphens), what it holds, whether it should be **publicly readable**, and any pod preference.
5. Enter the quota in **TB** and submit.

The OSN team reviews the request. The OSN documentation asks you to allow two business days. You get an email when the bucket is approved.

## 5. Find your endpoint and keys

Open the project, click the folder icon next to the bucket in **Allocations**, and scroll to **Allocation Attributes**. You will find the endpoint, bucket name, quota, anonymous access setting and the read-write and read-only key pairs. Next: [Moving data in and out of OSN](../kb040-osn-moving-data/).

## 6. Add people

On the project page, **Add Users** lets you add collaborators who have ACCESS accounts. When you request a bucket you choose which project users can see its keys. For readers who should not see keys, share the read-only pair or make the bucket publicly readable.

## 7. Keep the project current

- **Annual review.** The portal asks the PI to review the project once a year (project description, grants, publications, users). Until you do, you cannot request new buckets. Click **Needs Review** on the project page.
- **Renewal.** Allocations have an end date. Use **Click to renew** on the allocation before it expires, and keep the ACCESS project itself active.
- **Publications.** ACCESS asks projects to report publications that used their allocations.
