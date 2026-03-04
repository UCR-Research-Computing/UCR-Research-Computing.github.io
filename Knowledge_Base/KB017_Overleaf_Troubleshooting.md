---
id: kb017-overleaf-troubleshooting
title: KB017 - Troubleshooting Overleaf Professional Access
sidebar_label: KB017 - Overleaf Pro Access
---

# KB017: Troubleshooting Overleaf Professional Access (SSO Entitlement)

**Scope:** Overleaf Professional Subscriptions
**Audience:** BearHelp Tier 1 Support, Faculty, Graduate Students
**Last Updated:** March 4, 2026

---

## 1. The Problem
A user (Faculty or Graduate Student) logs into Overleaf but is defaulted to the "Free" version instead of their entitled "Professional" (Pro) tier. 

## 2. The Cause
The Overleaf upgrade process is entirely automated based on UCR Single Sign-On (SSO) affiliation. If a user is not seeing their Pro features, their existing Overleaf account is likely not properly linked to the UCR SSO backend to verify their entitlement attribute.

## 3. Troubleshooting Steps (For Tier 1 Support / Users)

### Step 1: Force SSO Account Linking
Advise the user to perform the following steps to manually force the SSO link to verify their affiliation:

1.  Log in to your existing Overleaf account.
2.  Navigate to your Account Settings page: [https://www.overleaf.com/user/settings](https://www.overleaf.com/user/settings)
3.  **If your `@ucr.edu` email is already listed:** Look for a message prompting you to *"Log in and link your Overleaf account to your SSO identity."* Click it and follow the Duo authentication prompts.
4.  **If your `@ucr.edu` email is NOT listed:** Add your official UCR email address to the account on this settings page, then confirm it by logging in via SSO and Duo. 

### Step 2: Escalation to Vendor (If Step 1 Fails)
If the user successfully links their account via SSO but is *still* locked out of the Professional tier, it indicates a deep entitlement mapping error on Overleaf's backend system. 

*   **⚠️ Do not escalate to ITS Systems or Research Computing.** UCR IT does not have manual override controls for individual Overleaf licenses.
*   **Action:** Instruct the user to email **support@overleaf.com** directly. 
*   **Message Template:** *"My UCR SSO link is active, but it is not triggering the Pro upgrade entitlement on my account."* 
*   The Overleaf Support Team will manually verify and map their account to the UCR institutional license.