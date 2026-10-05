---
title: "Troubleshooting Overleaf Professional Access (SSO Entitlement)"
kb_id: KB017
topic: Software
reviewed: 2026-10-04
owner: Research Computing
redirect_from:
  - /Knowledge_Base/KB017_Overleaf_Troubleshooting.html
review_notes:
  - "Rewrote for users and support staff, aligned the linking steps with Overleaf's UC Riverside page (premium features for faculty and graduate students), and linked KB003 for the 'already registered' error."
  - "Removed the claim that UCR IT has no override controls and the 'do not escalate' instruction; users are now pointed to Overleaf support, with Research Computing as a fallback."
  - "CHECK: eligibility is still faculty and graduate students, as Overleaf's UC Riverside page stated on 2026-10-04."
---

## The problem

You sign in to Overleaf but your account shows Overleaf's basic plan instead of the premium (Professional) features UCR provides. Overleaf's [UC Riverside page](https://www.overleaf.com/edu/ucr) lists who is eligible; at the time of review it was faculty and graduate students.

## The cause

The upgrade is automatic and is based on your UCR Single Sign-On (SSO) affiliation. If you do not see the premium features, your Overleaf account is usually not linked to your UCR SSO identity, so Overleaf cannot confirm your affiliation.

## Step 1: Link your account to UCR SSO

1.  Sign in to your existing Overleaf account the way you normally do (email and password, Google or ORCID).
2.  Open your [Overleaf account settings](https://www.overleaf.com/user/settings).
3.  **If your `@ucr.edu` address is already listed:** look for the prompt to link your Overleaf account to your SSO identity. Select it, sign in with your UCR NetID, and approve the Duo prompt.
4.  **If your `@ucr.edu` address is not listed:** add it on the settings page, then confirm it by signing in with UCR SSO and Duo.

New to Overleaf? Use **Log in with SSO** on the [UC Riverside page](https://www.overleaf.com/edu/ucr) and sign in with your NetID and Duo.

If Overleaf says the address or institution account is already registered, see [KB003](../kb003-overleaf-account-error/).

## Step 2: Contact Overleaf support if the upgrade still does not appear

If your account is linked to UCR SSO but the premium features still do not appear, the entitlement has to be checked on Overleaf's side.

*   Email **support@overleaf.com**.
*   Suggested message: *"My Overleaf account is linked to my UC Riverside SSO identity, but the UCR institutional premium features are not applied to my account."* Include the email address on your Overleaf account.
*   Overleaf support can check the account and connect it to the UCR institutional subscription.

If Overleaf support cannot resolve it, contact Research Computing at research-computing@ucr.edu.
