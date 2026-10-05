---
title: "Mounting Google Cloud Storage on Linux with rclone"
topic: Storage
owner: Research Computing
reviewed: 2026-10-04
review_notes:
  - "Fixed the rclone config: project_id is not an rclone gcs option (it is project_number), and the token line was not valid JSON. Setup now uses rclone config, or a service account key or VM credentials."
  - "Replaced the backgrounded crontab mount with --daemon plus a log file, added unmounting, limits of mounts, and Google's Cloud Storage FUSE as an alternative."
  - "Added how Ursa Major storage is charged (Standard is Tier 2 recharge; archive classes are Tier 1) with links to KB005 and KB007."
  - "CHECK: whether Ursa Major buckets use uniform bucket-level access by default (if so, bucket_policy_only = true is the right setting)."
redirect_from:
  - /Knowledge_Base/how_to_mount_google_cloud_storage.html
---

This article shows how to mount a Google Cloud Storage (GCS) bucket as a folder on a Linux machine with rclone, and how to mount it again automatically after a reboot.

**Costs.** GCS charges for storage, operations and network egress, and a mount can generate many operations. In Ursa Major, Standard storage is recharged to a lab funding source (Tier 2), while archive classes such as Coldline fall under Tier 1 within limits. See [KB005: Ursa Major service tiers](../kb005-ursa-major-service-tiers/) and [KB007: Tier 2 recharge workflow](../kb007-tier2-recharge-workflow/). Archive classes carry retrieval charges, so they are a poor fit for a mount you read often.

## Prerequisites

* A Linux machine where you can use FUSE (your workstation, or a VM in your project)
* rclone installed (see [rclone.org/install](https://rclone.org/install/))
* An existing GCS bucket
* An account or service account with access to the bucket

## Step 1: Configure an rclone remote

The simplest way is the interactive wizard:

```bash
rclone config
```

1. Choose `n` for a new remote and name it `gc`.
2. For the storage type, choose **Google Cloud Storage (this is not Google Drive)** (`gcs`).
3. Set credentials in one of these ways:
   - **On a Google Cloud VM:** answer `true` to `env_auth` to use the VM's service account.
   - **With a service account key file:** enter its path at `service_account_file`. Keep the key file private (`chmod 600`).
   - **As yourself:** leave both blank and complete the browser login rclone starts. On a machine without a browser, rclone prints a command to run on a machine that has one.
4. Enter your **project number** if asked (needed only to list or create buckets).
5. If your bucket uses uniform bucket-level access, answer `true` to `bucket_policy_only`.
6. Accept the defaults for the rest, then save.

The result in `~/.config/rclone/rclone.conf` looks similar to this (with a service account key):

```ini
[gc]
type = gcs
project_number = 123456789012
service_account_file = /home/yourname/.config/gcloud/my-lab-sa-key.json
bucket_policy_only = true
```

Check that it works:

```bash
rclone lsd gc:
rclone ls gc:my-lab-bucket
```

## Step 2: Create a mount point

```bash
mkdir -p ~/gc
```

## Step 3: Mount the bucket

```bash
rclone mount gc:my-lab-bucket ~/gc --vfs-cache-mode writes --daemon --log-file ~/gc-rclone.log
```

`--vfs-cache-mode writes` lets applications save files normally. `--daemon` runs the mount in the background and returns you to the prompt; messages go to the log file.

To unmount:

```bash
fusermount3 -u ~/gc
```

(On older systems use `fusermount -u`.)

## Step 4: Mount automatically at startup (optional)

Add an `@reboot` entry to your crontab. Use the full path to rclone, because cron does not load your usual `PATH`:

```bash
(crontab -l 2>/dev/null; echo "@reboot $(command -v rclone) mount gc:my-lab-bucket $HOME/gc --vfs-cache-mode writes --daemon --log-file $HOME/gc-rclone.log") | crontab -
```

A systemd user service is a more robust option if you manage the machine yourself.

## Things to know

- A mounted bucket is slower than a local disk, especially with many small files. For bulk transfers use `rclone copy` or `rclone sync` instead.
- Objects in GCS cannot be edited in place; changing a file uploads the whole file again.
- Google also offers [Cloud Storage FUSE](https://cloud.google.com/storage/docs/cloud-storage-fuse/overview) (`gcsfuse`), which is another way to mount a bucket on Linux.

For rclone's full GCS options, see the [rclone Google Cloud Storage documentation](https://rclone.org/googlecloudstorage/). Questions: research-computing@ucr.edu.
