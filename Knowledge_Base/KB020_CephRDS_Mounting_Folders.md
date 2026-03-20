---
id: kb020-cephrds-mounting-folders
title: KB020 - Mounting CephRDS Buckets as Local Drives
sidebar_label: KB020 - CephRDS Mounting
---

# KB020: Mounting CephRDS Buckets as Local Drives

**Scope:** UCR Researchers, External Collaborators
**Audience:** All Users
**Last Updated:** March 20, 2026

While graphical clients like Cyberduck (KB019) are great for transferring files, you may want to interact with your CephRDS storage exactly like a USB drive or a local hard drive. This allows you to open, edit, and save files directly from your applications (like Word, Python, or R) into the cloud.

This guide explains how to mount your CephRDS buckets as a local drive for free across all major operating systems using **Rclone**.

---

## 1. Prerequisites (All Operating Systems)

Before mounting, you must have `rclone` installed and configured with your CephRDS credentials.

1. **Get your Keys:** You need your provisioned S3 Access Key and Secret Key for CephRDS (`rds.ucr.edu`).
2. **Install Rclone:** Download and install the core `rclone` engine from [rclone.org](https://rclone.org/downloads/).
3. **Configure the Remote:** Run `rclone config` in your terminal to set up a remote named `cephrds`. Follow the steps in [KB013](KB013_CephRDS_Onboarding.md) to complete this.

---

## 2. Mounting on Linux

Linux natively supports user-space file systems (FUSE), making mounting extremely simple and robust.

### Steps:
1.  **Ensure FUSE is installed:** (Usually pre-installed on modern distros like Ubuntu). If missing, run `sudo apt install fuse3`.
2.  **Create a mount point:** This is an empty folder where your files will appear.
    ```bash
    mkdir ~/ceph-drive
    ```
3.  **Run the mount command:** 
    ```bash
    rclone mount cephrds:your_bucket_name ~/ceph-drive --vfs-cache-mode writes --daemon
    ```
    *Note: The `--vfs-cache-mode writes` flag ensures files are cached locally and uploaded in the background, providing maximum performance.*

Your files are now available in the `~/ceph-drive` directory!

---

## 3. Mounting on macOS

To mount drives on macOS, Rclone requires an additional open-source extension called **macFUSE**.

### Steps:
1.  **Install macFUSE:** Download and install it from [macfuse.github.io](https://osxfuse.github.io/). 
    *(Note: You may need to allow system extensions in your Mac's Security & Privacy settings during installation).*
2.  **Create a mount point:** Open your Terminal and create an empty folder.
    ```bash
    mkdir ~/Desktop/CephRDS
    ```
3.  **Run the mount command:**
    ```bash
    rclone mount cephrds:your_bucket_name ~/Desktop/CephRDS --vfs-cache-mode writes --daemon
    ```

You will now see a new volume appear on your Desktop named "CephRDS" that you can browse in Finder.

---

## 4. Mounting on Windows

Windows requires a proxy file system driver to allow Rclone to create a virtual drive letter (like `Z:\`).

### Steps:
1.  **Install WinFsp:** Download and install the open-source **Windows File System Proxy (WinFsp)** from [winfsp.dev](https://winfsp.dev/).
2.  **Run the mount command:** Open Command Prompt or PowerShell. You do not need to create a folder first; Rclone will create a new drive letter automatically.
    ```powershell
    rclone mount cephrds:your_bucket_name Z: --vfs-cache-mode writes
    ```
    *(Leave the command prompt window open, or run it via a background script).*

Open File Explorer, and you will see a new `Z:` drive containing your CephRDS data!

---

## 5. Alternative GUI Wrapper (RcloneView)

If you find configuring the command line intimidating, the community has built a free, graphical interface for Rclone called **RcloneView**. 

It allows you to configure your `rds.ucr.edu` endpoint and click a visual "Mount" button to connect your drives automatically on startup for both Windows and Mac.