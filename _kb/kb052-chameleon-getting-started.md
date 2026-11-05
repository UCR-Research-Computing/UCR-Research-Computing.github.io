---
title: "Getting started on Chameleon: sign in, join a project and launch your first bare-metal node"
kb_id: KB052
topic: National
description: "Sign in to the Chameleon testbed with your UCR login, request PI eligibility or join a project, reserve a bare-metal node, launch an instance and connect with SSH."
audience: "UCR faculty, research staff and students doing computer-systems, cloud, networking or hardware research, and instructors planning hands-on systems classes"
reviewed: 2026-11-05
owner: Research Computing
review_notes:
  - "Written 2026-11-05 from Chameleon's documentation (Getting Started; PI Eligibility; Project Management; Reservations) and FAQ (allocation size, SU rates, lease limits, lease stacking policy), all fetched 2026-11-05."
  - "Checked 2026-11-05 by RC with an existing UCR Chameleon account: sign-in with the UCR identity, the site terms page on first sign-in, the empty Projects page message, and the profile Edit form for requesting PI eligibility (fields listed in section 3, including the department directory link that appears when the box is ticked). The request then showed 'PI Eligibility: Requested'."
  - "Tested 2026-11-05 by RC: the PI eligibility request was approved the same day, then the Create a Project form (title, nickname, research-area tag, public abstract, private resource justification, funding question, acceptable use box) created a project at once, with its allocation shown as Pending until Chameleon reviews it."
  - "CHECK: sections 4 to 6 (reserving a node, launching an instance, SSH, JupyterHub) follow Chameleon's documentation and were not yet run by RC; the RC project allocation was pending review."
---

Chameleon is a national testbed for computer science. You reserve **whole physical servers** (or VMs) for up to a week at a time, with root access and your own operating system image, at sites in Chicago, Austin and Boulder. See the [Chameleon service page](../../services/chameleon/) for what fits and what does not.

Chameleon is **Non-sensitive only (P1; no protected data)**.

Getting started takes four steps: sign in, get into a project, reserve a node, and launch an instance on it. Research Computing can help at any step; [contact us](../../help/).

---

## 1. Before you start

- **Use your UCR login.** Chameleon uses federated sign-in, so you sign in with your NetID and Duo by choosing University of California, Riverside.
- **Have an SSH key pair.** You will connect to your machines with SSH. If you do not have a key, Chameleon can generate one for you when you launch an instance, or see its FAQ on creating key pairs.
- **Know who your project will be.** Nothing runs outside a project. Students and postdocs join their advisor's project; faculty and research staff can lead their own.

---

## 2. Sign in

1. Go to [chameleoncloud.org](https://chameleoncloud.org/) and click **Log in**.
2. On the sign-in page, choose **University of California, Riverside** and sign in with your NetID and Duo.
3. The first time, Chameleon asks you to accept its terms of use.
4. You land on your **Dashboard**, which shows your active projects, open help-desk tickets and any outages.

Your account is created at first sign-in. You are also subscribed to Chameleon's users and outage mailing lists, which you can change under **Profile > Manage Email Subscriptions**.

---

## 3. Get into a project

Until you are in a project, **Projects** shows "You don't have any projects!" and you cannot reserve anything.

**Students and postdocs.** Ask your PI to add you to their project, giving them your Chameleon username (your sign-in email). Students, including PhD students and paid research assistants, are not eligible to be PIs (NSF Graduate Research Fellows are the exception).

**Faculty and research staff: request PI eligibility.**

1. Go to **Profile** and click **Edit Profile**.
2. Fill in your institution, department, phone, position/title and country. For research staff the matching title is "University Research Staff (excluding postdoctorates)"; faculty choose "Faculty".
3. Tick **Request PI Eligibility**. A **Department directory link** field appears and is required: give the address of your public UCR profile, for example your `https://profiles.ucr.edu/<your.name>` page or your department's people page.
4. Click **Save Profile**. Your profile now shows **PI Eligibility: Requested**. Chameleon says requests are usually reviewed within one business day.

**Create a project (after approval).** Go to **Projects** and click **Create a Project**. The form asks for:

- a **title** and a short **nickname** used across Chameleon's sites;
- a **research-area tag** (choose the closest);
- a public **abstract** of about 200 words covering your objectives, planned activities and why the work matters;
- a private **resource justification**: roughly how much hardware you will use and for how long, which Chameleon reviewers use to size the allocation (a simple estimate such as "about 15 one-day bare-metal leases and 4 GPU leases" is fine);
- whether the work is grant-funded, and agreement to Chameleon's acceptable use policies.

The project appears straight away, but its allocation shows **Pending** until Chameleon staff review it, so you cannot reserve hardware until then. Once approved, the project receives a startup allocation of service units for six months (see Chameleon's [FAQ](https://chameleoncloud.org/learn/frequently-asked-questions/) for the current amount). PIs and managers can add members, set per-member budgets, and request extensions or recharges from the project page.

---

## 4. Reserve a node

Physical machines must be reserved (leased) before you can use them.

1. Find hardware on [Hardware Discovery](https://chameleoncloud.org/hardware/). Note which **site** has it (CHI@UC, CHI@TACC or CHI@NCAR); hardware is per site.
2. From the portal's **Experiment** menu, choose that site. Check that your project is selected in the menu at the top left.
3. Go to **Reservations > Leases** and click **Host Calendar**. Filter by **Node Type** and click a free node's name.
4. In the **Create Lease** form, name the lease, keep "start now" for an on-demand lease or choose a later start, and set the length (up to 7 days for bare metal and GPUs).
5. Under **Networks**, tick **Reserve Floating IP** so you will have a public address for SSH.
6. Click **Create**. The lease shows PENDING, then ACTIVE.

Chameleon charges the reserved time whether you use it or not, so cancel a lease you no longer need before it starts. Do not stack back-to-back leases to get around the 7-day limit; save your work with a snapshot and make a new lease instead.

---

## 5. Launch an instance and connect

1. On the site, go to **Compute > Instances** and click **Launch Instance**.
2. Choose your **reservation**, an **image** (Chameleon's supported Ubuntu and CentOS images are a good start), the **sharednet1** network, and your SSH **key pair**.
3. Click **Launch**. Building a bare-metal instance often takes **10 to 20 minutes**.
4. When it is running, use the instance's menu to **Associate Floating IP**.
5. Connect: `ssh cc@<floating-ip>` (the default user on Chameleon images is `cc`).

---

## 6. Next steps

- **Save your work.** Before a lease ends, save the machine's state as an image with Chameleon's `cc-snapshot` tool, and copy data you need elsewhere.
- **Script it.** Chameleon's [JupyterHub](https://jupyter.chameleoncloud.org/) and the python-chi library can reserve, launch and configure an experiment from a notebook; see the [Jupyter and python-chi guide](https://chameleoncloud.readthedocs.io/en/latest/getting-started/jupyter-python-chi.html).
- **Start from a template.** [Trovi](https://trovi.chameleoncloud.org/) has shared experiment patterns you can launch and adapt.
- **Get help.** Chameleon's [documentation](https://chameleoncloud.readthedocs.io/en/latest/), [forum](https://forum.chameleoncloud.org/) and [help desk](https://chameleoncloud.org/user/help/) cover the testbed itself; questions about whether it fits your research go to Research Computing: [contact us](../../help/).
- **Acknowledge Chameleon** in publications, as described in its [FAQ](https://chameleoncloud.org/learn/frequently-asked-questions/).
