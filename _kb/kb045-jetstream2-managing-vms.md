---
title: "Managing Jetstream2 VMs and SUs: shelve, resize, image, volumes, delete"
kb_id: KB045
topic: Compute
description: "Keep Jetstream2 service units from running out: shelve and unshelve, suspend, lock, resize, save an image, add a volume for data, delete what you no longer need, and use the command line."
audience: "UCR researchers running VMs on Jetstream2"
reviewed: 2026-10-30
owner: Research Computing
series: jetstream2
series_order: 4
review_notes:
  - "Written 2026-10-30 from the Jetstream2 documentation (Instance Management Actions, Instance Flavors, CLI: Installing OpenStack Clients and Authenticating; docs.jetstream-cloud.org, fetched 2026-10-30)."
  - "Tested 2026-10-30 in Exosphere: the Actions menu (Lock, Suspend, Shelve, Resize, Image, Reboot, Delete), Shelve with its confirmation, the allocation page's SUs remaining and burn rate. Resize and Image were not run."
  - "Volumes tested 2026-10-30 on an m3.tiny Ubuntu 24.04 VM: Create > Volume (1 GB), Attach from the volume list; Exosphere showed Device /dev/sdb and Mount point /media/volume/<volume-name>; on the VM the volume was already ext4, mounted there and writable by exouser; Detach showed a data-loss warning, then the volume went to Available and was unmounted."
  - "CLI tested 2026-10-30: Horizon sign-in with ACCESS CILogon (identity provider ACCESS CI (XSEDE)), Identity > Application Credentials > Create (name, optional expiration; leave Unrestricted unchecked), Download openrc file (saved as app-cred-<name>-openrc.sh); python-openstackclient 8.0.0 in a venv; openstack server list, flavor list, volume list, server shelve, server delete and volume delete all worked."
---

## 1. Where your SUs go

Open your allocation in [Exosphere](https://jetstream2.exosphere.app/). The top of the page shows **SUs remaining** for CPU, GPU and large-memory time, and the **Burn rate** shows how many SUs per hour your running VMs use right now. Each VM's page shows its own burn rate.

![Allocation page: SUs remaining per resource, instance list with burn rate, volumes, public IP addresses and SSH keys](../../assets/images/jetstream2/allocation-overview.png)

A VM uses SUs for every hour it is running, whether or not anything is happening on it. The rules of thumb:

- **Shelve** VMs at the end of the day or week.
- **Resize down** a VM that sits mostly idle.
- **Delete** VMs, volumes and images you no longer need. Volumes and images count against your storage quota.

## 2. The Actions menu

On a VM's page, **Actions** offers:

| Action | What it does | SUs |
| --- | --- | --- |
| **Shelve** / Unshelve | Shuts the VM down and frees its hardware; the disk is kept. Takes a few minutes each way. | None while shelved |
| **Suspend** / Resume | Like sleep: running programs are frozen and come back as they were. For a few days at most. | Charged at a reduced rate |
| **Lock** / Unlock | Prevents accidental changes or deletion. Unlock before shelving or resizing. | No effect |
| **Resize** | Restarts the VM on a different flavor (more or fewer cores, RAM or GPU). | New flavor's rate |
| **Image** | Saves the whole root disk as an image you can launch copies from. | Storage quota |
| **Reboot** | Restarts the VM. | No change |
| **Delete** | Destroys the VM and its root disk. Cannot be undone. | Stops all use |

### Shelve and unshelve

**Actions**, then **Shelve**, then **Yes** at "Are you sure you want to shelve?". The VM shows **Shelving**, then **Shelved**. To bring it back, choose **Unshelve**. A shelved VM accepts no connections, so a server that others need to reach has to stay running; make it the smallest flavor that works.

### Resize

When a VM runs out of memory, choose a larger flavor. When it sits idle most of the time, choose a smaller one. The VM restarts during a resize, so save your work first. Jetstream2 advises against resizing full-card GPU VMs (g3.xl).

### Image (snapshot and clone)

**Image** captures the VM's root disk. Use it before a risky change, or to launch several identical VMs for a class. An image takes several minutes to become active, and it counts against your storage quota.

## 3. Volumes for your data

A **volume** is a separate disk you attach to a VM. It survives when the VM is deleted, and it can be moved to another VM. Use one for data and results you want to keep apart from the operating system.

1. **Create**, then **Volume**: give it a name and a size in GB. It shows **Creating**, then **Available**.
2. On the volume (or on the VM's page under **Attach volume**), choose **Attach**, pick the VM and the volume, and click **Attach**.
3. Exosphere shows the device and the mount point. On Ubuntu VMs the volume is formatted and mounted for you at `/media/volume/<volume-name>`, and you can write to it as `exouser`. Check on the VM:

   ```bash
   df -h /media/volume/<volume-name>
   ```

4. To move a volume, stop anything using it, then open the volume and choose **Detach**. Exosphere warns that detaching a volume in use can lose data; confirm, and the volume goes back to **Available**.

Volumes use your allocation's storage quota (the **Volumes** card shows how many you have). Detach and delete volumes you no longer need. They keep counting against your quota until you delete them, even when no VM uses them.

Back up anything important somewhere off Jetstream2, for example [CephRDS](../../services/cephrds/) or an [OSN](../../services/osn/) bucket. Allocations end.

## 4. Delete what you are finished with

**Actions**, then **Delete** removes a VM and its root disk for good. Before deleting:

- copy off any results;
- detach any volume you want to keep;
- make an **Image** if you might want the same setup again.

Also check the **Volumes** card and the **Images** list for leftovers from earlier projects.

## 5. Command line (OpenStack CLI)

For scripting, or for managing many VMs, use the OpenStack command-line client.

1. Sign in to Horizon at [js2.jetstream-cloud.org](https://js2.jetstream-cloud.org/): under **Authenticate using** choose **ACCESS CILogon**, click **Sign In**, then pick **ACCESS CI (XSEDE)** as the identity provider. Check the allocation name at the top left, then go to **Identity**, **Application Credentials**, **Create Application Credential**. Give it a name and, if you like, an expiration date; leave **Unrestricted** unchecked. Click **Download openrc file** before closing the window, because the secret is shown only once. The file is named `app-cred-<name>-openrc.sh`. Each allocation needs its own credential.
2. Install the client:

   ```bash
   python3 -m venv ~/os-cli
   source ~/os-cli/bin/activate
   pip install python-openstackclient
   ```

3. In a fresh terminal, load the credential and try a command:

   ```bash
   source ~/os-cli/bin/activate
   source ~/Downloads/app-cred-<name>-openrc.sh
   openstack server list
   openstack flavor list
   ```

4. Common actions:

   ```bash
   openstack server shelve <name>
   openstack server unshelve <name>
   openstack server resize --flavor m3.small <name>
   openstack server delete <name>
   openstack volume list
   openstack volume delete <volume-name>
   ```

Treat the `openrc` file like a password. Do not share it or commit it to Git, and give each person and each computer its own application credential. When you no longer need a credential, delete it under **Identity**, **Application Credentials**. See [Authenticating against the OpenStack CLI](https://docs.jetstream-cloud.org/ui/cli/auth/).

## 6. When an allocation is running low

- Shelve or resize VMs first.
- Exchange more ACCESS credits for Jetstream2 in the [ACCESS allocations portal](https://allocations.access-ci.org/), or move to a larger ACCESS project type ([KB009](../kb009-using-nsf-access/)).
- Renew before your ACCESS project's end date. Unused SUs do not carry over.
- Questions about sizing: help@jetstream-cloud.org, or [contact Research Computing](../../help/).
