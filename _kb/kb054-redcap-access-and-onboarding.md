---
title: "REDCap access, lab sponsorship and onboarding"
kb_id: KB054
topic: Security
description: "How faculty-led labs request access to campus REDCap (redcap.ucr.edu), add students and external collaborators, complete first sign-in, and determine whether an IRB protocol, Data Security Plan or School of Medicine REDCap applies."
audience: "UCR faculty PIs, graduate students, postdocs, lab managers and research staff collecting survey or study data"
applies_to: "Campus REDCap (redcap.ucr.edu)"
reviewed: 2026-11-17
owner: Research Computing
review_notes:
  - "Written 2026-11-17 from live redcap.ucr.edu login flow (REDCap 17.5.2, UCR Shibboleth Login + local external-collaborator login), UCR Kuali IRB PI-eligibility rules, and Research Computing's established REDCap allow-list, API-token and ISO Data Security Plan onboarding workflow."
---

Campus REDCap ([https://redcap.ucr.edu](https://redcap.ucr.edu)) is a web platform for building and managing online research surveys and study databases. Research Computing manages campus REDCap user onboarding, while ITS Systems maintains the underlying server. See the [REDCap service page]({{ '/services/redcap/' | relative_url }}) for an overview of what fits and what does not.

---

## 1. Before you request access: the faculty-lab rule

Campus REDCap access is organized by **faculty-led labs**, aligned with UCR Institutional Review Board (IRB) PI-eligibility policy and [Data Security Plan]({{ '/kb/ucr-data-security-plans/' | relative_url }}) custodianship rules:

- **Every lab group and project requires a PI-eligible UCR faculty sponsor.** Full faculty members serve as the lab Principal Investigator (PI), approve which lab members receive REDCap access, and act as the institutional data custodian for the lab's projects.
- **Graduate students, postdocs, lab managers and undergraduate RAs work under their faculty PI.** Non-faculty researchers do not hold standalone PI accounts on campus REDCap, because student and trainee appointments eventually end and research data must stay anchored to a continuing faculty custodian.
- **Day-to-day project leadership stays flexible.** Once the faculty PI approves access for the lab's members, a graduate student, postdoc or lab manager can create the REDCap project, design the surveys, and manage User Rights day-to-day under the faculty PI's oversight (with the faculty PI included on the project with full administrative rights).

If you are a graduate student, postdoc or staff member starting the request, copy your faculty PI / faculty advisor on your email to `research-computing@ucr.edu` so they can reply to confirm approval.

---

## 2. Check which instance and review path fits your study

Before collecting data, confirm whether your study belongs on the campus REDCap instance or the School of Medicine instance, and whether a Data Security Plan (DSP) is needed alongside your IRB protocol:

| What you are collecting | Instance | What is needed |
| --- | --- | --- |
| Non-human-subjects data or P1-P2 surveys | Campus REDCap (`redcap.ucr.edu`) | Faculty PI approval |
| Human-subjects surveys without sensitive P3-P4 identifiers | Campus REDCap (`redcap.ucr.edu`) | Faculty PI approval and an approved UCR IRB protocol (or exemption determination) |
| Human-subjects data with direct identifiers (names, email addresses, phone numbers) or sensitive P3-P4 responses (non-HIPAA) | Campus REDCap (`redcap.ucr.edu`) | Faculty PI approval, an approved UCR IRB protocol, and a short [UCR Data Security Plan]({{ '/kb/ucr-data-security-plans/' | relative_url }}) reviewed with Research Computing and approved by the Information Security Office (ISO) |
| Clinical care data, medical records or HIPAA Protected Health Information (PHI) | School of Medicine REDCap (`redcap.medsch.ucr.edu`) | Contact School of Medicine IT (SOM Help Desk). Campus REDCap is **not** HIPAA-designated; see [KB006]({{ '/kb/kb006-som-clinical-apps/' | relative_url }}) |

**If your study needs a Data Security Plan:** you do not need to draft the technical controls from scratch. Share your approved IRB protocol (or draft data-security section) with Research Computing; our team prepares the technical sections of the [UCR DSP template]({{ '/kb/ucr-data-security-plans/' | relative_url }}) with you and walks it through review with the Information Security Office.

---

## 3. Request access for a lab or new lab members

Have the faculty PI email **research-computing@ucr.edu** (or have a student/lab manager email with the faculty PI copied to reply with approval) and include:

1. **Faculty PI and lab name:** the sponsoring faculty member's name, department and UCR NetID (`netid@ucr.edu`).
2. **Lab members to add:** each person's full name, UCR NetID (`netid@ucr.edu`, not just a firstname.lastname alias) and role in the lab (for example PhD student, postdoc, lab manager, undergraduate RA). Include the faculty PI's NetID as well if the PI does not yet have a campus REDCap account.
3. **Three quick study triage answers** (for new studies):
   - What the project collects, and whether it is human-subjects research with an approved UCR IRB protocol (include the IRB number if assigned, or note if submission is in progress).
   - Whether the dataset includes identifiable or sensitive information (for example participant names, contact details, audio/video or health questions).
   - Whether any grant, contract or Data Use Agreement (DUA) imposes specific data-security terms.

### Copy-paste request template

```text
To: research-computing@ucr.edu
Cc: <faculty-pi@ucr.edu>
Subject: REDCap access request - <PI Last Name> Lab

Faculty PI / Sponsor: <Name, Department, netid@ucr.edu>

UCR NetIDs needing REDCap access:
- <pi_netid>@ucr.edu - <Name> (Faculty PI)
- <netid1>@ucr.edu - <Name> (<PhD student / Postdoc / Lab manager / Undergrad RA>)
- <netid2>@ucr.edu - <Name> (<Role>)

Study overview:
1. Study & IRB status: <1-2 sentences on what is collected + Kuali IRB # or status>
2. Identifiers / sensitivity: <De-identified only, OR includes names/contact info/sensitive survey items; confirm no clinical HIPAA/PHI>
3. Grant / DUA security terms: <None, OR name the agreement>
```

---

## 4. First sign-in and setting up your project

Access works in two layers: **campus SSO allow-list access** (managed by Research Computing) and **project-level User Rights** (managed by your lab inside REDCap).

1. **Allow-list confirmation.** Research Computing verifies each NetID in the campus directory, adds `netid@ucr.edu` to the REDCap SSO allow list, and replies on your thread.
2. **Every new user signs in once.** Go to [https://redcap.ucr.edu](https://redcap.ucr.edu), select **UCR Shibboleth Login**, and sign in with your UCR NetID and Duo multi-factor authentication (no campus VPN is required).
   - **Important:** a user's REDCap profile is created on their **first sign-in**. A project owner cannot grant project rights to a new lab member until that lab member has signed in to `redcap.ucr.edu` at least once.
   - If you already had a browser tab open before being added to the allow list, close and reopen the tab (or use a fresh window) so your SSO session refreshes.
3. **Create the project and add your lab.**
   - Click **+ New Project** to create the study database.
   - If a graduate student, postdoc or lab manager creates the project, add the sponsoring **faculty PI** under **Applications -> User Rights** with full **User Rights** and **Project Design and Setup** permissions so the lab retains continuity when students graduate.
   - Add approved lab members under **Applications -> User Rights** with the minimum privileges needed for their role (for example data entry only vs full export rights, and de-identified export vs full identifier export).

---

## 5. Adding or removing lab members later, external collaborators and API tokens

- **Adding UCR lab members to an existing lab:** email `research-computing@ucr.edu` with the faculty PI's approval (or from the PI directly) listing the new member's name and `netid@ucr.edu`. Once Research Computing confirms they are on the allow list and the member signs in once, your lab's project admin adds them under **User Rights**.
- **Removing departing students or RAs from a project:** your lab's project admin can remove or expire a user's access to a specific study immediately inside **Applications -> User Rights** without waiting on Research Computing.
- **External (non-UCR) collaborators:** if an IRB-approved multi-site study requires a collaborator outside UCR to enter or manage records, the UCR faculty PI can email `research-computing@ucr.edu` with the collaborator's name, institutional email address and affiliation. Research Computing creates a local REDCap login (`Use local REDCap login` on the sign-in page) with an expiration date, renewable on PI request.
- **API tokens:** to automate exports or imports from R or Python, ensure your project role includes API Export / API Import rights under **User Rights**, then click **Applications -> API** inside your REDCap project and select **Request API token**. Research Computing reviews the request against the lab's project roster and approves token generation; never hardcode an API token in code or commit it to Git.
