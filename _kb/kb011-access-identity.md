---
title: "Signing in: accounts and identity by service"
kb_id: KB011
topic: General
audience: "All Users"
reviewed: 2026-10-04
owner: Research Computing
redirect_from:
  - /Knowledge_Base/KB011_Access_Identity.html
review_notes:
  - "Aligned the HPCC row with the HPCC login page (username plus password and Duo, or SSH keys; external users use SSH keys) and replaced the 'PI has paid the subscription' fix with the lab registration process from KB004."
  - "Made the sign-in entries plain links to the official pages (Google Cloud console, NRP, ACCESS, UCR Support Portal) and added links to KB004, KB009 and KB021."
  - "CHECK: the NRP Nautilus sign-in still goes through CILogon with the UCR identity provider."
  - "CHECK: the Ursa Major sign-in step (UCR Google account at console.cloud.google.com, with UCR Duo) matches current practice."
---

Your **UCR NetID** is the starting point for most research computing services, but each service signs you in its own way. This table shows how.

## 1. How to sign in to each service

| Service | How you sign in | How to start |
| :--- | :--- | :--- |
| **HPCC cluster** | HPCC username (normally your NetID) with password and Duo, or an SSH key | `ssh <username>@cluster.hpcc.ucr.edu`, see the [HPCC login instructions](https://hpcc.ucr.edu/manuals/access/login/) |
| **Ursa Major (Google Cloud)** | Your UCR Google account (`netid@ucr.edu`) through UCR Single Sign-On with Duo | [Google Cloud console](https://console.cloud.google.com) |
| **NRP Nautilus** | CILogon, choosing University of California, Riverside as the identity provider | [NRP getting started](https://nrp.ai/documentation/userdocs/start/getting-started/) |
| **NSF ACCESS** | An ACCESS account, registered through CILogon with your UCR identity | [access-ci.org](https://access-ci.org), see [KB009](../kb009-using-nsf-access/) |
| **UCR Support Portal** | UCR Single Sign-On (NetID and Duo) | [UCR Support Portal](https://ucrsupport.service-now.com/ucr_portal/) |

Notes:

*   **HPCC:** an HPCC account is separate from your NetID and is created by the HPCC on request. See [KB004](../kb004-hpcc-account-creation/). Password and Duo login only works if your HPCC username matches your NetID. External collaborators do not have UCR Duo and sign in with SSH keys. The HPCC login page is the authority.
*   **Ursa Major:** you see a project only after it has been set up and you have been given access. See [KB021](../kb021-ursa-major-project-request/).

## 2. Common issues

### "Permission denied" when logging in to the HPCC

*   **Possible causes:** your account has not been created or activated yet; your HPCC username does not match your NetID, so password and Duo login fails; your password has expired; or your SSH key is not installed on the cluster.
*   **What to do:** check the [HPCC login instructions](https://hpcc.ucr.edu/manuals/access/login/). If your lab is new, confirm that your PI has completed the HPCC lab registration ([KB004](../kb004-hpcc-account-creation/)). If it still fails, email support@hpcc.ucr.edu with your username and the exact error message.

### "No projects found" in Google Cloud

*   **Cause:** you are signed in with a personal Google account (for example `@gmail.com`) instead of your `@ucr.edu` account.
*   **What to do:** open a private or incognito browser window and sign in with your UCR email address. If you still see no projects, ask your project's owner or Research Computing to confirm that your account has been added.

### CILogon sign-in fails on Nautilus

*   **Cause:** the wrong identity provider was selected.
*   **What to do:** choose "University of California, Riverside" from the identity provider list, not "Google".
