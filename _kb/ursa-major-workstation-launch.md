---
title: "Launching an Ursa Major research workstation"
topic: Cloud
owner: Research Computing
reviewed: 2026-10-04
review_notes:
  - "Chuck 2026-10-04: us-central1 is the Ursa Major default region."
  - "Added Tier 2 recharge note (workstations and GPUs), the pre-October 2026 workstation note, the TPU/Arm Tier 1 pointer and a set-a-budget step."
  - "Updated console steps and the gcloud example: CentOS is end of life, so examples use Debian/Ubuntu; GPU example adds --maintenance-policy=TERMINATE (required for GPU VMs); fixed the disk flag text (boot disk size, not added storage)."
redirect_from:
  - /Knowledge_Base/Ursa_Major_Research_Workstations_How_to_Launch.html
---

This guide shows how to create a research workstation (a Compute Engine VM) in your Ursa Major project. For what a workstation is good for, see [Ursa Major research workstations](../ursa-major-research-workstations/).

## Before you start

- **Costs:** research workstations are Tier 2. The VM, its disks and any GPUs are recharged to a lab funding source under an MOU. See [KB005: Ursa Major service tiers](../kb005-ursa-major-service-tiers/) and [KB007: Ursa Major recharge workflow](../kb007-tier2-recharge-workflow/).
- **Workstations set up before October 2026:** some were set up under the earlier tiers, when workstations were not recharged. If your lab has one, contact [research-computing@ucr.edu](mailto:research-computing@ucr.edu). Nothing changes without that conversation.
- **Exotic hardware:** if you need hardware the HPCC does not have, such as TPUs or Arm processors, ask about Tier 1 exotic hardware instead. It runs through a Research Computing cluster rather than a workstation.
- **GPU work:** for GPU work at lower cost to the lab, consider the [HPCC](../../services/hpcc/).
- **Ask for a budget** on the project before you start, so the lab sees spending early and has a cap. Research Computing sets budgets on request. See [Ursa Major project budgets](../ursa-major-project-budget/).
- **Sensitive data:** P3, P4 or regulated data needs a review before it is used on a VM. See [Security and Data](../../security/).

## Web console

1. Go to the [Google Cloud console](https://console.cloud.google.com/) and sign in with your UCR account.
2. Select your project in the project picker at the top of the page.
3. Open the navigation menu and select **Compute Engine**, then **VM instances**.
4. Click **Create instance**.
5. **Name, region and zone:** give the VM a name and choose a region and zone. Use `us-central1` (Iowa), the Ursa Major default, unless your work needs another region.
6. **Machine configuration:** choose a machine family and type (CPU count and memory). For GPUs, choose the **GPUs** machine family and pick a GPU type and count. Not every GPU is offered in every zone.
7. **OS and storage:** click **Change** to pick the operating system (for example Debian, Ubuntu, Rocky Linux or Windows Server) and the boot disk size and type.
8. **Additional disks (optional):** under storage, add a new persistent disk if you want data kept separate from the boot disk. Disks are charged while they exist, even when the VM is stopped.
9. **Networking:** review firewall and network settings. A public IP address is available by request to research-computing@ucr.edu. Do not open SSH or RDP to the whole internet. See [Connecting to an Ursa Major research workstation](../ursa-major-workstation-connect/).
10. Review the monthly estimate shown on the page, then click **Create**.

## Command line (gcloud)

1. Install the [Google Cloud CLI](https://cloud.google.com/sdk/docs/install), or use Cloud Shell in the console.
2. Sign in and set your project:

   ```bash
   gcloud auth login
   gcloud config set project my-lab-project
   ```

3. Create a VM. This example makes a Debian VM with 4 vCPUs and 16 GB of memory:

   ```bash
   gcloud compute instances create my-workstation \
       --zone=us-central1-a \
       --machine-type=e2-standard-4 \
       --image-family=debian-12 \
       --image-project=debian-cloud \
       --boot-disk-size=100GB \
       --boot-disk-type=pd-balanced
   ```

   Replace the name, zone, machine type, image and disk size with what you need. For Ubuntu, use for example `--image-family=ubuntu-2404-lts-amd64 --image-project=ubuntu-os-cloud`.

4. (Optional) To attach a GPU to an N1 machine type, add these flags. GPU VMs cannot live-migrate, so the maintenance policy must be `TERMINATE`:

   ```bash
   --accelerator=type=GPU_TYPE,count=GPU_COUNT --maintenance-policy=TERMINATE
   ```

   Some GPU types (such as A100, L4 and H100) come with their own machine types (A2, G2, A3) instead. See Google's [Create a VM with attached GPUs](https://cloud.google.com/compute/docs/gpus/create-gpu-vm-general-purpose).

5. The VM is usually ready within a few minutes. See [Connecting to an Ursa Major research workstation](../ursa-major-workstation-connect/).

Google's guide: [Create and start a VM instance](https://cloud.google.com/compute/docs/instances/create-start-instance).

## Tips

- **Size to the work.** Start small; you can change the machine type later while the VM is stopped.
- **Stop VMs you are not using.** A running VM is charged whether or not you are working on it. Disks are charged until deleted.
- **Choose the operating system for your software,** and check that it is still supported.
- **Choose storage for your data:** boot disk for the system and software, a persistent disk for working data, and a [storage bucket](../ursa-major-storage-create-bucket/) for data you want to share or keep after the VM is gone.
- For long batch runs, the [HPCC cluster](../../services/hpcc/) is usually a better fit. [Ask us](../../help/) if you are not sure.
