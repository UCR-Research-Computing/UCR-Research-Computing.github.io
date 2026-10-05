---
title: "Mounting CephRDS Buckets as Local Drives"
kb_id: KB020
topic: Storage
audience: "All Users"
reviewed: 2026-10-04
owner: Research Computing
review_notes:
  - "Fixed the macFUSE link (macfuse.github.io), noted that Homebrew rclone cannot mount on macOS, and added unmount commands and --log-file for --daemon."
  - "Toned down claims ('exactly like a local drive', 'maximum performance'); added limits of S3 mounts; used a placeholder bucket name."
  - "Corrected the remote setup: provider Ceph, and pointed to KB013 for the full prompts. Added a link and a third-party caveat for RcloneView."
redirect_from:
  - /Knowledge_Base/KB020_CephRDS_Mounting_Folders.html
---

Graphical clients such as Cyberduck ([KB019](../kb019-cephrds-gui-clients/)) are good for moving files. Sometimes you want your CephRDS bucket to appear as a folder or drive instead, so applications (Word, Python, R) can open and save files in it directly.

This article explains how to mount a CephRDS bucket as a local drive on Linux, macOS and Windows with **rclone**.

**Network:** CephRDS is reachable from the campus network only. Off campus, connect to the [UCR campus VPN](https://vpn.ucr.edu/) (Cisco Secure Client) first.

## Before you start: what a mount can and cannot do

A mounted bucket looks like a folder, but it is still object storage reached over the network:

- Opening and saving files is slower than on a local disk, especially for many small files.
- Some operations behave differently: renaming a large folder copies every object, and file locking is not supported.
- Two people editing the same file through separate mounts can overwrite each other's changes.

For bulk transfers, `rclone copy` or `rclone sync` (see [KB013](../kb013-cephrds-onboarding/)) is faster and more reliable than copying into a mount.

## 1. Prerequisites (all operating systems)

1. **Get your keys.** You need your CephRDS S3 Access Key ID and Secret Access Key (see [KB013](../kb013-cephrds-onboarding/)).
2. **Install rclone.** Download it from [rclone.org](https://rclone.org/downloads/).
3. **Configure a remote.** Run `rclone config` and create a remote named `cephrds`, following the steps in [KB013](../kb013-cephrds-onboarding/). Choose storage type **s3** and provider **Ceph** (not "Amazon S3"), and set the endpoint to `https://rds.ucr.edu`.

In the commands below, replace `my-lab-bucket` with your bucket name.

## 2. Mounting on Linux

Linux supports user-space file systems (FUSE), which rclone uses to mount.

1.  **Make sure FUSE is installed.** It usually is on current distributions. On Ubuntu or Debian, if it is missing, run `sudo apt install fuse3`.
2.  **Create a mount point.** This is an empty folder where your files appear:
    ```bash
    mkdir -p ~/ceph-drive
    ```
3.  **Mount the bucket:**
    ```bash
    rclone mount cephrds:my-lab-bucket ~/ceph-drive --vfs-cache-mode writes --daemon --log-file ~/ceph-drive-rclone.log
    ```
    `--vfs-cache-mode writes` caches files locally while you write them and then uploads them, which most applications need to save files correctly. `--daemon` runs the mount in the background; its messages go to the log file.

Your files now appear in `~/ceph-drive`. To unmount:

```bash
fusermount3 -u ~/ceph-drive
```

(On older systems the command is `fusermount -u`.)

## 3. Mounting on macOS

On macOS, rclone needs the open-source **macFUSE** extension.

1.  **Install macFUSE** from [macfuse.github.io](https://macfuse.github.io/). You may need to allow the system extension in **System Settings** under **Privacy & Security** during installation.
2.  **Use the rclone binary from rclone.org.** The Homebrew build of rclone does not support `mount`.
3.  **Create a mount point** in Terminal:
    ```bash
    mkdir -p ~/CephRDS
    ```
4.  **Mount the bucket:**
    ```bash
    rclone mount cephrds:my-lab-bucket ~/CephRDS --vfs-cache-mode writes --daemon --log-file ~/CephRDS-rclone.log
    ```

The bucket appears as a volume you can browse in Finder. To unmount:

```bash
umount ~/CephRDS
```

## 4. Mounting on Windows

On Windows, rclone needs a file system driver to create a drive letter (such as `Z:`).

1.  **Install WinFsp**, the open-source Windows File System Proxy, from [winfsp.dev](https://winfsp.dev/).
2.  **Mount the bucket.** Open Command Prompt or PowerShell. You do not need to create a folder first; rclone creates the drive letter:
    ```powershell
    rclone mount cephrds:my-lab-bucket Z: --vfs-cache-mode writes
    ```
    Leave the window open while you use the drive. Press Ctrl+C in that window to unmount.

Open File Explorer to find the new `Z:` drive with your CephRDS data.

## 5. Graphical alternative (RcloneView)

If you prefer not to use the command line, [RcloneView](https://rcloneview.com/) is a third-party graphical interface for rclone on Windows and macOS. You can use it to set up the `rds.ucr.edu` endpoint and mount a bucket with a button. It is not run or supported by Research Computing; check its licensing and terms before you rely on it.

Questions: research-computing@ucr.edu.
