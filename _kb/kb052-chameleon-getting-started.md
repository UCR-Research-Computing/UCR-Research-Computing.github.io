---
title: "Getting started on Chameleon: sign in, join a project and launch your first bare-metal node"
kb_id: KB052
topic: National
description: "Sign in to the Chameleon testbed with your UCR login, request PI eligibility or join a project, reserve a bare-metal node, launch an instance and connect with SSH."
audience: "UCR faculty, research staff and students doing computer-systems, cloud, networking or hardware research, and instructors planning hands-on systems classes"
reviewed: 2026-11-12
owner: Research Computing
review_notes:
  - "Written 2026-11-05 from Chameleon's documentation (Getting Started; PI Eligibility; Project Management; Reservations) and FAQ (allocation size, SU rates, lease limits, lease stacking policy), all fetched 2026-11-05."
  - "Checked 2026-11-05 by RC with an existing UCR Chameleon account: sign-in with the UCR identity, the site terms page on first sign-in, the empty Projects page message, and the profile Edit form for requesting PI eligibility (fields listed in section 3, including the department directory link that appears when the box is ticked). The request then showed 'PI Eligibility: Requested'."
  - "Tested 2026-11-05 by RC: the PI eligibility request was approved the same day, then the Create a Project form (title, nickname, research-area tag, public abstract, private resource justification, funding question, acceptable use box) created a project at once, with its allocation shown as Pending until Chameleon reviews it."
  - "Tested 2026-11-12 by RC: allocation approved; reserved a bare-metal node (compute_cascadelake_r, dual-socket Intel Xeon Gold 6240R, 96 vCPUs, 187 GiB RAM) with a floating IP at CHI@UC. Lease transition to ACTIVE took 15 seconds."
  - "Tested 2026-11-12 by RC: launched instance with CC-Ubuntu22.04 and baremetal flavor. Bare-metal provisioning took 8 minutes 46 seconds (526s) to reach ACTIVE. Associated floating IP, opened security group ingress for port 22 and ICMP, and connected over SSH as user cc (total launch to SSH ready: 13.5 minutes). Ran hardware verification (96 cores, 187 GiB RAM) and 30-second benchmark (2,439 iterations, 81.3 it/s). Verified full teardown (instance, floating IP, lease, keypair, application credential)."
  - 'Tested 2026-11-12 by RC: signed in to Chameleon JupyterHub (https://jupyter.chameleoncloud.org) via federated UCR login. Server spawn took 38.7s. Confirmed python-chi 1.2.11 is preinstalled (Python 3.12, conda). Default working directory is /work, with HOME set to user home directory. Verified read-only python-chi API calls against CHI@UC (chi.image.list_images found 99 Ubuntu images; chi.lease.list_leases returned 0 active leases). Located Trovi sharing links in Welcome.ipynb and the Share menu. Deleted test notebook and stopped user server via Hub Control Panel.'
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

![Chameleon project overview showing active project allocation and members](../../assets/images/chameleon/project-overview.png)

---

## 4. Reserve a node

Physical machines must be reserved (leased) before you can use them.

1. Find hardware on [Hardware Discovery](https://chameleoncloud.org/hardware/). Note which **site** has it (CHI@UC, CHI@TACC or CHI@NCAR); hardware is per site.
2. From the portal's **Experiment** menu, choose that site. Check that your project is selected in the menu at the top left.
3. Go to **Reservations > Leases** and click **Create Lease** (or use the **Host Calendar** to check when specific node types are available).
4. In the **Create Lease** wizard:
   - **General:** Name the lease. For an on-demand lease starting immediately, leave Start Date and Start Time as default ("Today" and "Now"). For leases shorter than 24 hours, set Lease Length to 0 days and choose an End Time today (or set 1 day for a standard 24-hour test lease).
   - **Hosts:** Tick **Reserve Hosts**. Set minimum and maximum hosts to 1, and select your target node type (for example `compute_cascadelake_r` or `compute_skylake`).
   - **Networks:** Tick **Reserve Floating IPs** and set the count to 1 so you will have a public address for SSH.
5. Click **Create**. The lease shows PENDING, then transitions to **ACTIVE** within about 15 seconds when resources are immediately available.

![Create Lease form showing lease name, duration, and reservation tabs](../../assets/images/chameleon/create-lease.png)

Chameleon charges the reserved time in service units whether you use it or not, so cancel a lease you no longer need before it ends. Do not stack back-to-back leases to get around the 7-day limit; save your work with a snapshot and make a new lease instead.

---

## 5. Launch an instance and connect

Once your lease is ACTIVE, launch an instance on your reservation:

1. On the site dashboard, go to **Compute > Instances** and click **Launch Instance**.
2. In the launch wizard:
   - **Details:** Name your instance and select your active lease from the **Reservation** dropdown.
   - **Source:** Select an appliance image, such as **CC-Ubuntu22.04** or **CC-Ubuntu24.04**.
   - **Flavor:** Select the **baremetal** flavor.
   - **Networks:** Select **sharednet1**.
   - **Key Pair:** Select your SSH public key.
3. Click **Launch Instance**. Building and provisioning a bare-metal server involves remote hardware setup and disk imaging; in testing, provisioning reached ACTIVE in **8 minutes 46 seconds**.
4. Check network security: Go to **Network > Security Groups** and ensure your project's default security group allows inbound SSH (TCP port 22) and ICMP from your client IP address.
5. Associate your public IP: Under **Compute > Instances**, open the instance menu and choose **Associate Floating IP**, or go to **Network > Floating IPs** and map your reserved floating IP to your instance's internal port.
6. Connect over SSH using the default Chameleon account `cc`:

```bash
ssh -i ~/.ssh/id_ed25519 cc@<FLOATING_IP>
```

In testing, the full flow from clicking Launch Instance to an active SSH prompt took approximately **13.5 minutes**.

![Launch Instance dialog with instance name and active lease reservation selected](../../assets/images/chameleon/launch-instance.png)

![Instances list showing the bare-metal instance running and active](../../assets/images/chameleon/instances-running.png)

![Floating IPs table showing the public IP mapped to the running instance](../../assets/images/chameleon/floating-ips.png)

---

## 6. From the command line

You can also manage leases, instances and floating IPs with the OpenStack and Blazar command-line tools.

### 1. Create an application credential

1. Sign in to your target Chameleon site (for example `https://chi.uc.chameleoncloud.org`).
2. Go to **Identity > Application Credentials** and click **Create Application Credential**.
3. Name the credential (for example `my-cli-credential`), set an expiration date, and submit.
4. Click **Download openrc file** and save the file locally in a secure folder:

```bash
mkdir -p ~/.config/openstack
chmod 700 ~/.config/openstack
mv ~/Downloads/app-cred-*-openrc.sh ~/.config/openstack/chameleon-openrc.sh
chmod 600 ~/.config/openstack/chameleon-openrc.sh
```

### 2. Install command-line tools

Install the OpenStack client and Blazar reservation plugin:

```bash
pip install python-openstackclient python-blazarclient python-chi
```

Or run them on demand with `uv`:

```bash
source ~/.config/openstack/chameleon-openrc.sh
uv run --with python-openstackclient --with python-blazarclient openstack reservation lease list
```

### 3. Check available hardware and leases

```bash
source ~/.config/openstack/chameleon-openrc.sh

# List available images
openstack image list | grep -i CC-Ubuntu

# List current leases
openstack reservation lease list

# Upload an SSH public key
openstack keypair create --public-key ~/.ssh/id_ed25519.pub KEYPAIR_NAME
```

### 4. Create a lease and launch via CLI

You can create a lease and launch your node using either python-chi scripts or the OpenStack CLI:

```python
import chi, chi.lease, chi.server, datetime

# Set reservation parameters
reservations = []
chi.lease.add_node_reservation(reservations, count=1, node_type="compute_cascadelake_r")
chi.lease.add_fip_reservation(reservations, count=1)

# Create a 2-hour lease starting now
now = datetime.datetime.now(datetime.timezone.utc)
start = now.strftime("%Y-%m-%d %H:%M")
end = (now + datetime.timedelta(hours=2)).strftime("%Y-%m-%d %H:%M")
lease = chi.lease.create_lease("my-test-lease", reservations, start_date=start, end_date=end)

# Wait for lease activation (typically 15-30s)
chi.lease.wait_for_active(lease["id"])

# Launch server on the host reservation
host_reservation_id = [r["id"] for r in lease["reservations"] if r["resource_type"] == "physical:host"][0]
server = chi.server.create_server(
    "my-baremetal-node",
    reservation_id=host_reservation_id,
    key_name="KEYPAIR_NAME",
    image_name="CC-Ubuntu22.04",
    flavor_name="baremetal"
)
chi.server.wait_for_active(server.id)

# Associate floating IP
floating_ip = chi.lease.get_reserved_floating_ips(lease["id"])[0]
chi.server.associate_floating_ip(server.id, floating_ip)
```

Connect once the node finishes booting:

```bash
ssh -i ~/.ssh/id_ed25519 cc@FLOATING_IP
```

### 5. Clean up resources

When your workload is complete, delete the instance and lease to release resources back to the pool:

```bash
openstack server delete my-baremetal-node
openstack reservation lease delete my-test-lease
```

---

## 7. Next steps

- **Save your work.** Before a lease ends, save the machine's state as an image with Chameleon's `cc-snapshot` tool, and copy data you need elsewhere.
- **Script experiments in JupyterHub.** Chameleon's [JupyterHub](https://jupyter.chameleoncloud.org/) provides a browser-based JupyterLab environment preconfigured with `python-chi` (Python 3.12) and testbed credentials. You can set your site (`chi.use_site("CHI@UC")`) and project, inspect hardware and images, or orchestrate leases and instances programmatically. In RC testing, user server launch completed in approximately 39 seconds. See the [Jupyter and python-chi guide](https://chameleoncloud.readthedocs.io/en/latest/getting-started/jupyter-python-chi.html).
- **Start from a template.** [Trovi](https://trovi.chameleoncloud.org/) has shared experiment patterns you can launch directly in JupyterHub or adapt for your work.
- **Get help.** Chameleon's [documentation](https://chameleoncloud.readthedocs.io/en/latest/), [forum](https://forum.chameleoncloud.org/) and [help desk](https://chameleoncloud.org/user/help/) cover the testbed itself; questions about whether it fits your research go to Research Computing: [contact us](../../help/).
- **Acknowledge Chameleon** in publications, as described in its [FAQ](https://chameleoncloud.org/learn/frequently-asked-questions/).
