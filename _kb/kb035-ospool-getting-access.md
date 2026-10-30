---
title: "Getting access to the OSPool: application, orientation and first login"
kb_id: KB035
topic: National
description: "Apply for OSPool access, meet a facilitator, register for an access point with your UCR NetID, set up SSH and log in."
audience: "UCR researchers and students starting on the OSG's Open Science Pool, and PIs setting up a group project"
reviewed: 2026-10-29
owner: Research Computing
series: ospool
series_order: 2
review_notes:
  - "Written 2026-10-29 from 'Start Here: Overview of Requesting OSPool Access' (portal.osg-htc.org/documentation/overview/account_setup/registration-and-login/, fetched 2026-10-29)."
  - "Tested 2026-10-29: the application form at portal.osg-htc.org/application was filled in and submitted by RC staff signed in with a UCR identity. The form fields listed in section 2 are from that form."
  - "CHECK: sections 3 to 5 (registration link, approval email, SSH key upload, login host) have not yet been done end to end by RC. Update after the first RC access point login."
---

Getting onto the OSPool is a short, people-first process: you apply, talk to a facilitator for about half an hour, then get an account on an **access point**. There is no allocation proposal.

## 1. Before you apply

Have ready:

- a sentence or two on your research and what one job does;
- a rough size: how many jobs, how long one runs, its memory, disk and input size;
- the software you use (scripts, compiled code, containers);
- whether you need GPUs.

If you are not sure your work fits, read the [researcher guide](../kb034-ospool-researcher-guide/) or [ask Research Computing](../../help/) first.

## 2. Apply

1. Go to the [OSPool application](https://portal.osg-htc.org/application) on the OSG Portal.
2. Fill in your name, **University of California, Riverside**, and your **ucr.edu** email address.
3. Choose your role, describe your research and the computing you need, and say whether you need GPUs, how much storage and roughly how many jobs.
4. Complete the check box test and submit.

The OSG Research Facilitation team emails you to set up an orientation meeting and to confirm whether you are joining an existing OSPool project (for example your lab's) or starting a new one.

## 3. The orientation meeting

The meeting usually takes 20 to 30 minutes. You talk through your work, how it maps onto the OSPool and practical next steps. Bring an example of one job if you can.

## 4. Register for an access point

**Wait until a facilitator asks you to register.** They send you a registration link. When you follow it:

1. CILogon asks for your institution. Choose **University of California, Riverside** and sign in with your NetID and Duo. Remember which identity you used; you will log in with it later.
2. On the enrollment page, click **Begin**, check your name and email, and submit.
3. Confirm your email address from the message sent by registry@cilogon.org.

After the meeting the facilitator approves your account, adds you to your OSPool project and emails your account details, including which access point to use (for example `ap40.uw.osg-htc.org`).

## 5. Log in with SSH

The facilitator's email and the [OSPool login guide](https://portal.osg-htc.org/documentation/overview/account_setup/registration-and-login/) explain how to add an SSH key and log in. In outline, on macOS, Linux or Windows PowerShell:

```bash
ssh-keygen -t ed25519 -f ~/.ssh/ospool
cat ~/.ssh/ospool.pub
```

Upload the public key (the `.pub` file, never the other one) where the guide says, then:

```bash
ssh -i ~/.ssh/ospool your_username@apNN.uw.osg-htc.org
```

The login message shows your quotas. Next: [Moving data on the OSPool](../kb036-ospool-moving-data/).

## Problems

- **"Permission denied (publickey)"** before your account is approved is expected. After approval, check the key path and that you used the username from the facilitator's email.
- **Signed in with the wrong identity in CILogon?** Clear your CILogon cookies at [cilogon.org/me](https://cilogon.org/me/) and sign in again with the UCR identity.
- Anything else: [support@osg-htc.org](mailto:support@osg-htc.org), or [Research Computing](../../help/).
