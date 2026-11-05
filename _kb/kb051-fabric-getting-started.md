---
title: "Getting started on FABRIC: sign up, join a project and run your first slice"
kb_id: KB051
topic: National
description: "Sign up for the FABRIC testbed with your UCR login, join or request a project, set up your bastion SSH key and run Hello, FABRIC from FABRIC's JupyterHub."
audience: "UCR faculty, students and staff doing networking, distributed-systems, edge or cybersecurity research, and instructors planning hands-on networking classes"
reviewed: 2026-11-05
owner: Research Computing
review_notes:
  - "Written 2026-11-05 from FABRIC's Knowledge Base (Quick Start Guide; Signing up for a FABRIC account; Creating or Joining a Project; FABRIC User Roles and Project Permissions; Generating SSH Configuration and SSH Keys; Creating your first experiment in Jupyter Hub; Things to know when using FABRIC for the first time; all fetched 2026-11-05) and the FABRIC portal (release 2.0.0 notice, portal version 1.10.4)."
  - "Checked 2026-11-05 by RC with an existing UCR FABRIC account: sign-in with the UCR identity through CILogon, the profile page fields (FABRIC ID, Bastion Login, Other Identities), the Roles & Projects page, an expired project's 'Renew Project' button and the Project Renewal form in the FABRIC help portal."
  - "Tested 2026-11-05 by RC on the renewed RC project: JupyterHub sign-in with the UCR identity, the default server image (FABRIC Examples v1.9.0), the Configure Environment step (it created the bastion key itself; no portal download was needed), and a Hello, FABRIC style slice: one Ubuntu 22 VM with 2 cores, 8 GB RAM and 10 GB disk at a randomly chosen site, ready in under 10 minutes, SSH through the bastion, then deleted."
  - "CHECK: the portal SSH Keys page route for working from your own computer (section 4, second half) was not run by RC; it follows FABRIC's SSH configuration guide."
  - "CHECK: the sign-up workflow screens (section 2) were not walked through by RC with a new account; they follow FABRIC's 'Signing up for a FABRIC account' article."
---

FABRIC is a national testbed for networking and distributed-systems research. You build a **slice** (virtual machines at the sites you choose, with GPUs, FPGAs, SmartNICs or NVMe attached, connected by the network services you choose), run your experiment and tear it down. See the [FABRIC service page](../../services/fabric/) for what fits and what does not.

FABRIC is **Non-sensitive only (P1; no protected data)**.

Getting started takes four steps: sign up, get into a project, open FABRIC's JupyterHub (which sets up your SSH keys for you), and run the Hello, FABRIC example. Research Computing can help at any step; [contact us](../../help/).

---

## 1. Before you start

- **Use your UCR login, always the same one.** FABRIC ties everything (portal, JupyterHub, Knowledge Base, API) to the identity you sign up with. Choose **University of California, Riverside** every time and use one email address (for example `netid@ucr.edu`) for all FABRIC activity. Google, GitHub, Microsoft and ORCID logins need extra manual review by FABRIC staff.
- **Know who your project will be.** Nothing runs outside a project. Students and postdocs join their PI's or instructor's project. Faculty and senior researchers lead their own.
- **Be ready for Python.** Most FABRIC work happens in Jupyter notebooks using FABRIC's Python library, FABlib.

---

## 2. Sign up for a FABRIC account

1. Go to the [FABRIC portal](https://portal.fabric-testbed.net/) and accept the cookie policy (sign-up will not work without it).
2. Click **Sign up**, then **Proceed**.
3. On the CILogon page, choose **University of California, Riverside** and sign in with your NetID and Duo.
4. Click **Begin**, choose UC Riverside again, confirm your name and email, and click **Submit**.
5. Open the confirmation email from FABRIC and click its link. Campus email protection sometimes rewrites the link; if it shows as invalid, follow FABRIC's [sign-up article](https://learn.fabric-testbed.net/knowledge-base/signing-up-for-a-fabric-account/) to decode it.
6. Wait for the approval email ("FABRIC Registration has been approved"), then sign in to the portal. A user icon at the top right means you are in.

Your **profile** page (click your initials, then **Profile**) shows your FABRIC ID and your **Bastion Login**, the username you will use for SSH. You can also add a bio, job title, website and your ORCID there.

---

## 3. Get into a project

Your account can see the portal, but it cannot create slices until you are a member of an active project.

**Students, postdocs and collaborators.** Ask your PI or instructor to add you. They open the project under **Experiments > Projects & Slices**, go to **Memberships**, search for you (at least four letters of your name or email) and click **Add**. Use the same email you signed up with.

**Faculty and senior researchers.** Request to become a Project Lead: in the portal, go to **Experiments > Projects & Slices** and click **Request a New Project**. This opens a form in the FABRIC help portal; use the same email as your FABRIC account. FABRIC staff review the request and then create the project with you as Project Lead and first owner. Tips from FABRIC's own guidance:

- Write a clear project description. Project descriptions are public by default; you can make a project private in its Basic Information tab.
- Create separate projects for groups with different experience or needs (for example a research group and a class), rather than one project for everyone.
- Only add people you know and are responsible for, and remove members you have lost touch with.

**Permissions.** New projects start with limits on VM size and devices. To use larger VMs, GPUs, FPGAs, P4 switches or some network features, a project owner asks FABRIC staff to add the matching permission tags. If a slice asks for something your project does not have, FABRIC's error message names the tag that is needed.

**Renewal.** Projects expire (the RC project had a one-year term). An expired project shows "This project is expired and no operations are allowed" and a **Renew Project** button. The button opens a short Project Renewal form in the FABRIC help portal that asks for a justification, your project field and keywords, any award information and publications, and confirmation that the description, membership and FABRIC Matrix are up to date. Renew before your project expires if you can.

---

## 4. Your SSH keys (JupyterHub does this for you)

FABRIC VMs are reached through FABRIC's **bastion** host, so you need two key pairs: a **bastion** key pair that lets you through the bastion, and a **slice** key pair for the VMs themselves.

**If you work in JupyterHub (recommended),** you do not need to make either key by hand. The Configure Environment notebook in section 5 creates the bastion key, the slice key and the SSH config in your JupyterHub `fabric_config` folder. Bastion keys expire; when one does, run Configure Environment again and it makes a new one.

**If you work from your own computer instead,** create a bastion key in the portal (your profile, **SSH Keys**) and follow FABRIC's [SSH configuration guide](https://learn.fabric-testbed.net/knowledge-base/generating-ssh-configuration-and-ssh-keys/). Keep the FABRIC settings in their own file (for example `~/.ssh/fabric_ssh_config`) rather than your main `~/.ssh/config`.

---

## 5. Open JupyterHub and run Hello, FABRIC

1. From the portal's top menu, click **JupyterHub** (or go to [jupyter.fabric-testbed.net](https://jupyter.fabric-testbed.net/)) and sign in with CILogon, choosing UC Riverside. Click through the sign-in once and wait: if you click **Log On** a second time, or sign in from two tabs at once, JupyterHub can send you back to its sign-in page. If that happens, sign in again once.
2. On **Server Options**, keep the **(default)** stable release and click **Start**. Your server takes a minute or two to start the first time.
3. In the file browser, open the `jupyter-examples-rel...` folder (the name includes the release number) and the **start_here** notebook. It lists every example.
4. Run **Configure Environment** (`configure_and_validate`) first. Replace `REPLACE_WITH_YOUR_PROJECT_ID` with your project's ID (the long code shown on your project's page in the portal), then run each cell. It checks your settings, creates your bastion and slice keys, and saves the configuration. If it reports that the bastion username is missing, add `bastion_username="<your Bastion Login>"` (from your portal profile) to the `fablib_manager(...)` line and run it again.
5. Open **Hello, FABRIC** (`fabric_examples/fablib_api/hello_fabric`) and run each cell in turn. It creates a small slice with one VM at a site with free capacity, runs a command on it over SSH, and deletes the slice.

What to expect: in our test the slice (one Ubuntu 22 VM with 2 cores and 8 GB of memory) was ready in under 10 minutes, and the VM answered over SSH within seconds. VMs have a FABRIC management address (IPv6 at many sites) and come with a default lease of about one day, which you can extend.

Your JupyterHub files are kept between sessions, but slices are not: save results to your own storage, and delete slices when you are done.

---

## 6. Next steps

- **Plan around availability.** The portal's Resources pages show what each site has free, and FABRIC 2.0 added a way to see when the resources you need are available before you request them.
- **Explore the examples.** The start-here notebook links to examples for multi-site networks, GPUs, FPGAs, SmartNICs, P4, measurement tools and connecting to other facilities.
- **Ask the community.** FABRIC's [Knowledge Base](https://learn.fabric-testbed.net/) and [forums](https://learn.fabric-testbed.net/forums/) are the first stop for experiment questions; account and project problems go to the [FABRIC help portal](https://portal.fabric-testbed.net/help).
- **Cite FABRIC** in papers that use it, as described in [Cite FABRIC](https://learn.fabric-testbed.net/knowledge-base/citing-fabric/).

Questions about whether FABRIC fits your research, or help getting a group or class set up, go to Research Computing: [contact us](../../help/).
