---
title: "Try the OSPool today in your browser (OSPool Notebooks)"
kb_id: KB050
topic: National
description: "Sign in to OSPool Notebooks with your UCR login, no account needed, to try HTCondor and the OSPool tutorials in JupyterLab; then apply for your own account when you are ready for the full pool."
audience: "UCR researchers and students curious whether the OSPool fits their work, and instructors planning a hands-on session"
reviewed: 2026-11-05
owner: Research Computing
series: ospool
series_order: 2
review_notes:
  - "Written 2026-11-05 from the OSG facilitator's orientation with Research Computing that day (the notebook service was demonstrated and its link shared by email), the OSPool Notebooks page (portal.osg-htc.org/documentation/htc_workloads/submitting_workloads/jupyter/, fetched 2026-11-05) and osg-htc.org/notebooks, which redirects to notebook.ospool.osg-htc.org."
  - "Confirmed with the OSG facilitator on 2026-11-05: there are no sub-accounts. Each researcher applies for their own OSPool account; Research Computing guides UCR researchers through it."
  - "Tested 2026-11-05 on ap40: condor_submit flags the OSG page's 'should_transfer_input = YES' as an unused line (typo); 'should_transfer_files = YES' is the real option. The article gives the corrected line."
  - "CHECK: the guest sign-in and Server Options screens were not walked through by RC with a guest identity (the RC tester already has a full account, which the service attaches to instead). Timeouts and the 8 CPU / 16 GB figures are from the OSG page."
---

You can try the Open Science Pool (OSPool) today, in a web browser, with your UCR login. **OSPool Notebooks** is a JupyterLab service run by the OSG. It needs no account, no SSH key and no software on your computer. Use it to see how HTCondor jobs work, run the OSG tutorials, and decide whether your research fits before you apply for an account.

The OSPool is **Non-sensitive only (P1; no protected data)**. That applies to the notebook service too: use test or public data.

## 1. Start a notebook

1. Go to [osg-htc.org/notebooks](https://osg-htc.org/notebooks) (it opens [notebook.ospool.osg-htc.org](https://notebook.ospool.osg-htc.org/)).
2. Click **Sign in** and choose **University of California, Riverside**. Sign in with your NetID and Duo.
3. On the **Server Options** page, pick an environment and click **Start**. Starting can take a few minutes; the page moves on by itself when the notebook is ready.
4. You land in JupyterLab: a file browser, notebooks, text editors and a **Terminal**.

To finish, use **File > Log Out**.

## 2. What you get without an account (guest access)

Without an OSPool account, your notebook runs as a temporary guest on an OSG access point. According to the OSG:

- your notebook has **8 CPUs and 16 GB of memory**;
- **HTCondor is installed**, so you can write submit files and run small practice jobs;
- a notebook **times out after one hour of inactivity** and runs for **at most four hours**;
- guest access is for practice: the OSG describes it as a way to try small high-throughput workflows before requesting an account, and it runs on a temporary access point, so do not rely on it to keep files.

Running jobs across the full OSPool needs your own account (section 4).

## 3. Things to try in your first session

- **The OSG tutorials.** The notebook service is set up for the OSG's self-serve tutorials, which walk through submit files, many-job sweeps and data handling. They are also used in the OSG's [user training sessions](https://portal.osg-htc.org/documentation/support_and_training/training/osgusertraining/), which you can follow along in a notebook.
- **A ten-job sweep.** In the notebook's **Terminal**, try the Monte Carlo example from [Submitting OSPool jobs and getting results](../kb037-ospool-jobs-and-results/). Add this line to the submit file:

  ```
  should_transfer_files = YES
  ```

  The OSG's notebook page asks for this setting when you submit from a notebook. (That page spells it `should_transfer_input`; HTCondor reports that spelling as an unused line, so use `should_transfer_files`.)
- **Your own small test.** Upload a script and a small input through the file browser and run one job. If it runs as a single, independent task in a few minutes to a few hours, it is likely a good OSPool fit.

## 4. Getting your own account

The notebook is a way in, not the whole service. To run on the full OSPool:

- **Every researcher applies for their own account.** There are no shared accounts or sub-accounts under a lab or under Research Computing; each student, postdoc and PI who submits jobs needs their own.
- Follow [Getting access to the OSPool](../kb035-ospool-getting-access/): the application, a short orientation with an OSG facilitator, registration with your UCR login, then your first login.
- **Research Computing can guide you through it.** We can help you decide whether your work fits, what to say in the application, and how to get your first jobs running. [Contact us](../../help/).

Once you have an account on `ap40.uw.osg-htc.org`, the same notebook service connects to it. You then work in your own home directory, your jobs run on the OSPool, and you can keep using the browser instead of an SSH terminal if you prefer.

## 5. For instructors

Because no account is needed, OSPool Notebooks works for a class or workshop: everyone signs in with their own institutional login and follows the OSG tutorials. Plan for the one-hour inactivity timeout and the four-hour limit. The OSG also runs regular [user training sessions](https://portal.osg-htc.org/documentation/support_and_training/training/osgusertraining/) and can advise on running your own; ask the facilitators at [support@osg-htc.org](mailto:support@osg-htc.org).

## 6. Next steps

- [Researcher guide to the OSPool and OSDF](../kb034-ospool-researcher-guide/): what fits, limits and guidelines
- [Getting access to the OSPool](../kb035-ospool-getting-access/): your own account
- [Common OSPool job types](../kb048-ospool-common-job-types/)
- Help: [support@osg-htc.org](mailto:support@osg-htc.org), OSG office hours (Tuesdays, [Zoom link](https://osg-htc.org/OfficeHoursZoom)), or [Research Computing](../../help/)
