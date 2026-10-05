---
title: "Using NSF ACCESS and Jetstream2"
kb_id: KB009
topic: National
audience: "UCR faculty, postdocs and graduate students"
reviewed: 2026-10-04
owner: Research Computing
redirect_from:
  - /Knowledge_Base/KB009_Using_NSF_ACCESS.html
review_notes:
  - "Chuck 2026-10-04: Research Computing remains UCR ACCESS Campus Champion."
  - "Removed the ACCESS credit limits from the project-type table and the SU sizing section; the article now links the ACCESS project types page for current limits. Checked the remaining ACCESS steps, policies and Jetstream2 flavors, SU rates, state charges and default storage against access-ci.org and docs.jetstream-cloud.org on 2026-10-04."
  - "Added links to the NSF ACCESS, Nautilus and NAIRR service pages and the ACCESS resource list, a row pointing cloud VMs on Google Cloud to Ursa Major Tier 2, and a Research Computing contact."
  - "CHECK: the Exosphere sign-in steps (Add ACCESS account, then ACCESS CI (XSEDE) at CILogon) still match the current Jetstream2 interface."
---

## 1. What is ACCESS?

**ACCESS** (Advanced Cyberinfrastructure Coordination Ecosystem: Services & Support) is the National Science Foundation program that awards U.S. researchers allocations of time on national computing systems. It replaced XSEDE in 2022. If you had an XSEDE account, it is now your ACCESS account. See the [NSF ACCESS service page](../../services/nsf-access/) for a summary and [access-ci.org](https://access-ci.org) for the program itself.

ACCESS covers much more than large supercomputer jobs. Through one account you can request:

* **Cloud virtual machines** you fully control (root/sudo), on **Jetstream2**. Good for always-on servers, web apps, databases, Jupyter, and interactive work.
* **Batch HPC** on systems such as Anvil, Expanse, Stampede3 and Delta.
* **GPUs** (NVIDIA A100 and others) for AI and simulation.
* **Large-memory nodes** and storage.

The current list is on the [ACCESS resources page](https://allocations.access-ci.org/resources). UCR does not recharge for ACCESS allocations.

### When to use ACCESS

| Your need | Start here |
| :--- | :--- |
| Batch jobs, Slurm, GPU training on campus | UCR HPCC (see [KB004](../kb004-hpcc-account-creation/)) |
| Always-on VMs, servers with public IPs, full admin control | **ACCESS: Jetstream2** (this article) |
| VMs in Google Cloud in your lab's own project | Ursa Major, recharged as Tier 2 (see [KB005](../kb005-ursa-major-service-tiers/)) |
| More capacity than HPCC, or a specific national system | **ACCESS** (this article) |
| Containers and Kubernetes | [NRP Nautilus](../../services/nautilus/) |
| Large-scale AI, specialized AI hardware, model API credits | [NAIRR Pilot](../../services/nairr/) (see [KB008](../kb008-using-nairr-pilot/)) |

---

## 2. Project Types

You request a **project**. Most projects are awarded **ACCESS Credits**, which you then exchange for time on the specific resources you want.

| | Explore | Discover | Accelerate | Maximize |
| :--- | :--- | :--- | :--- | :--- |
| **What you submit** | Short overview (abstract) | 1-page proposal | Up to 3 pages | Up to 10 pages |
| **Review** | Eligibility and fit | Eligibility and fit | Panel merit review | Panel merit review |
| **When** | Anytime | Anytime | Anytime | Every 6 months |
| **Length** | 12 months or your grant's length, whichever is longer | Same | Same | 12 months |

Each project type has a credit limit, which grows from Explore to Accelerate; Maximize is awarded in resource units. ACCESS publishes the current limits on its [project types page](https://allocations.access-ci.org/project-types).

**Start with Explore** if you are new or unsure. It is meant for trying out resources, benchmarking, code development, small classes and graduate student work. You can upgrade later.

For Explore, Discover and Accelerate, up to half of the credit limit is awarded with the first request. You request the rest later with a progress report (a "Supplement").

---

## 3. Getting Started, Step by Step

You can do everything below yourself. Going from no account to a running machine often takes one to two weeks, most of it waiting on approvals.

### Step 1: Create your ACCESS account (about 10 minutes)

1. Go to the [ACCESS registration page](https://operations.access-ci.org/identity/new-user).
2. Choose one of two options:
   * **Register with an existing identity:** pick University of California, Riverside if it is listed and sign in with your UCR account.
   * **Register without an existing identity:** if UCR is not listed or the sign-in fails, create an ACCESS password and set up Duo (use Duo Push in the Duo Mobile app; ACCESS advises against the phone-call option).
3. Use your **ucr.edu** email address. Gmail, Yahoo and other personal addresses are not accepted.
4. Do not close the browser partway through. Enter the verification code that **registry@cilogon.org** emails you (check spam). If registration stalls, contact ACCESS support rather than creating a second account.
5. Write down your **ACCESS ID** (username). Collaborators need it to add you to projects.

Tip: fill in your profile and link your ORCID iD. Awarded projects then show up on your ORCID record.

### Step 2: Request an Explore project (decision usually by the next business day)

1. Log in at [allocations.access-ci.org](https://allocations.access-ci.org) and choose **Explore ACCESS**.
2. Have these ready:
   * **Title and overview (abstract):** your goals, how you plan to use ACCESS resources (for example, "run GPU VMs to train and serve models"), and the main software you need.
   * **CV or resume** for the project lead (and any co-leads), **PDF, 3 pages max**.
   * **Grant information,** if the work is funded (optional, but helpful).
   * **Graduate student leading the project?** Upload a signed letter from your advisor (or your NSF GRFP letter).
   * **Class use?** Upload the syllabus.
   * Check the box to request **ACCESS Credits**.
3. Submit. ACCESS sends a confirmation email, then a decision, usually by the next business day.

### Step 3: Exchange credits for resource time (allow up to a week)

**This step is easy to miss.** A new project shows "No active resources" until you exchange credits.

1. At [allocations.access-ci.org](https://allocations.access-ci.org), go to **Manage Allocations**, then **Manage My Projects**, then **New Action**, then **Exchange**.
2. Pick one or more resources and enter the amount. Your remaining credit balance updates as you type.
3. Each resource has its own exchange rate. The **Exchange Calculator** on the ACCESS site helps you estimate.
4. The resource provider reviews the exchange to confirm it fits your work. Allow up to a week. ACCESS emails you when it is approved.

For Jetstream2, see Section 4 for which resource to pick and how much to request.

### Step 4: Add your students and collaborators

1. Each person creates their own ACCESS account (Step 1) with an institutional email address.
2. Go to **Manage Allocations**, then **Manage Users**, choose your project, then **Add users to resources**, and search for their ACCESS ID.
3. This only works **after** your exchange is approved. New accounts can take a few days to activate on each resource.
4. Your username on each resource may differ from your ACCESS ID. Check **My Projects** on the Allocations site.

### Step 5: Log in and start working

Your project page lists your username on each resource and links to its documentation. For Jetstream2, see Section 4.

---

## 4. Jetstream2: Your Own VMs in a Research Cloud

**Jetstream2** is an NSF-funded research cloud run by Indiana University. You create and control your own virtual machines, with full admin rights, from a web browser. It is a good fit for work that HPCC's batch system does not handle: always-on services, web apps, databases, science gateways, interactive desktops, and VMs with public IP addresses.

### Pick the right Jetstream2 resource

Jetstream2 has **three separate resources**. When you exchange credits, pick each one you need; having one does **not** include the others.

| Resource | What you get | Cost |
| :--- | :--- | :--- |
| **Jetstream2 (CPU)** | Standard VMs, 1 to 64 cores | 1 SU per core per hour |
| **Jetstream2 Large Memory** | Twice the RAM of the equivalent CPU VM | 2 SUs per core per hour |
| **Jetstream2 GPU** | Part of an NVIDIA A100, or full GPUs | 2 SUs per core per hour |

Jetstream2 sets **1 ACCESS Credit = 1 Jetstream2 SU** ([ACCESS Credits and Jetstream2](https://docs.jetstream-cloud.org/general/access/)).

### Common VM sizes ("flavors")

| Flavor | Cores | RAM | Root disk | GPU | SUs per hour |
| :--- | :--- | :--- | :--- | :--- | :--- |
| m3.tiny | 1 | 3 GB | 20 GB | - | 1 |
| m3.small | 2 | 6 GB | 20 GB | - | 2 |
| m3.quad | 4 | 15 GB | 20 GB | - | 4 |
| m3.medium | 8 | 30 GB | 60 GB | - | 8 |
| m3.large | 16 | 60 GB | 60 GB | - | 16 |
| m3.xl | 32 | 125 GB | 60 GB | - | 32 |
| m3.2xl | 64 | 250 GB | 60 GB | - | 64 |
| g3.medium | 8 | 30 GB | 60 GB | 25% of an A100 (10 GB) | 16 |
| g3.large | 16 | 60 GB | 60 GB | 50% of an A100 (20 GB) | 32 |

Full-GPU and larger flavors are also available; some require a request to the Jetstream2 help desk. See the full [Instance Flavors](https://docs.jetstream-cloud.org/general/vmsizes/) list. Each allocation includes a default storage quota (1 TB at the time of writing); more storage is a separate request.

### How many SUs do I need?

* **Always on:** SUs per hour x 24 x 365. Example: one m3.medium running all year = 8 x 24 x 365 = **70,080 SUs**.
* **Part time:** SUs per hour x hours you will use it. Example: an m3.medium used 10 hours a week for a year = 8 x 520 = **4,160 SUs** (shelve it the rest of the time).
* **GPU example:** a g3.large running nonstop for a year is about 280,000 SUs (32 x 24 x 365).
* Compare your estimate with the credit limit for your project type on the [project types page](https://allocations.access-ci.org/project-types). Jetstream2 also has a [usage estimation calculator](https://docs.jetstream-cloud.org/general/vmsizes/).
* Running low is fixable: request the second half of your credits (Supplement) or move up to a larger project type.

### Launch your first VM

1. Go to [jetstream2.exosphere.app](https://jetstream2.exosphere.app) and click **Add ACCESS account**.
2. At the CILogon page, choose **ACCESS CI (XSEDE)** as the identity provider and sign in.
3. Select the allocations you want to use (select all of them; unselected ones are not added).
4. Click **Create**, then **Instance**. Choose an image (**Ubuntu 22.04** is the most common), give it a name, and pick a flavor.
5. Turn on **Web Desktop** if you want a graphical desktop. Add an SSH public key if you want to connect from your own machine.
6. Click **Create**. After a few minutes the status changes from Building to **Ready**.
7. Open it with the **Web Shell** or **Web Desktop** buttons in your browser, or SSH in.

If an instance shows **Error**, delete it and create a new one. Step-by-step walkthrough with screenshots: [Creating your First Instance](https://docs.jetstream-cloud.org/getting-started/first-instance/).

### Save credits: shelve what you are not using

A running VM uses SUs even when nobody is logged in.

| VM state | Charge |
| :--- | :--- |
| Active (running) | 100% |
| Suspended | 75% |
| Stopped | 50% |
| **Shelved** | **0%** |

**Shelve** VMs you are not using. Shelving and unshelving each take a few minutes, so shelve at the end of a day or week, not for short breaks. Usage appears on the ACCESS site 12 to 24 hours after the fact, so do not rely on it for same-day tracking.

---

## 5. Keeping Your Project Going

* **More credits:** submit a **Supplement** request (for the second half of your credits) with a short progress report. Decisions usually come within two weeks.
* **Upgrade:** when you outgrow Explore, request a Discover or Accelerate project.
* **Move credits:** use **Exchange** to add a resource, or **Transfer** to move units between resources.
* **Extensions:** unfunded projects can be extended in 12-month increments, up to five years. Funded projects can be extended if the grant is extended. See the [ACCESS allocations policy](https://allocations.access-ci.org/allocations-policy).
* **Acknowledge ACCESS** in papers and report publications on the ACCESS site. This helps future requests.

---

## 6. Where to Get Help

* **Jetstream2 documentation:** [docs.jetstream-cloud.org](https://docs.jetstream-cloud.org)
* **Jetstream2 help desk:** help@jetstream-cloud.org. They can also advise on which VM size and how many SUs fit your work.
* **ACCESS support, tickets and knowledge base:** [support.access-ci.org](https://support.access-ci.org)
* **ACCESS allocations guide:** [Get Your First Project](https://allocations.access-ci.org/get-your-first-project)
* **Research Computing:** research-computing@ucr.edu. We can look over a request with you or help you choose between ACCESS and campus options.

**Campus Champions:** Research Computing is UCR's ACCESS Campus Champion. Contact research-computing@ucr.edu for help with an ACCESS request.
