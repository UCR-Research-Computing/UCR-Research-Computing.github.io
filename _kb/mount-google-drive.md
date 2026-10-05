---
title: "How to Mount Google Drive on Linux using Rclone"
topic: Storage
owner: Research Computing
reviewed: 2026-10-04
review_notes:
  - "Fixed broken list formatting; replaced the pipe-to-sudo-bash install with the distribution package or the rclone.org install page."
  - "Added Shared Drive steps, --daemon with a log file, unmounting, a full-path crontab entry, and the data-classification and quota pointers (Google Drive service page and ITS)."
  - "CHECK: whether UCR's Google Workspace allows rclone's default OAuth client; if not, users need their own client ID (rclone.org/drive/#making-your-own-client-id)."
redirect_from:
  - /Knowledge_Base/how_to_mount_google_drive.html
---

This article shows how to mount your UCR Google Drive as a folder on a Linux machine with rclone. rclone is a command-line tool that copies, syncs and mounts files from many cloud storage services, including Google Drive.

Google Drive at UCR is managed by ITS. Quotas, and the kinds of data you may store there, are set by ITS; see [Google Drive and OneDrive](../../services/google-drive/) and the [ITS storage page](https://its.ucr.edu/storage). Google Drive suits documents and smaller files; for large research datasets, see [Storage](../../storage/).

## Prerequisites

* A UCR Google account with access to Google Drive
* A Linux machine where you can install software and use FUSE
* A web browser (on the same machine or another one) to authorize rclone

## Step 1: Install rclone

Install rclone from your distribution's package manager (for example, `sudo apt install rclone` on Ubuntu or Debian), or follow the instructions on the [rclone install page](https://rclone.org/install/) for the latest version. Packaged versions can be old; if a step below does not match what you see, install the latest release from rclone.org.

## Step 2: Configure rclone

Start the configuration wizard:

```bash
rclone config
```

1. Choose `n` for a new remote.
2. Enter a name for the remote, for example `gdrive`.
3. Choose **Google Drive** (`drive`) from the list of storage types.
4. Leave `client_id` and `client_secret` blank unless you have your own (see the note below).
5. For `scope`, choose full access (`drive`) if you want to read and write all your files.
6. Accept the default for the remaining options until rclone asks to open a browser. Sign in with your UCR Google account and allow access. On a machine without a browser, choose `n` for auto config and follow the instructions to authorize from another machine.
7. When asked whether to configure it as a Shared Drive, choose `n` for your own My Drive, or `y` and pick the Shared Drive you want.
8. Confirm the settings and choose `q` to quit.

Note: if Google refuses the sign-in or says the app is blocked, UCR's Google Workspace may not allow rclone's built-in client. You can create your own client ID as described in the [rclone Google Drive documentation](https://rclone.org/drive/#making-your-own-client-id), or contact research-computing@ucr.edu.

Check that the remote works:

```bash
rclone lsd gdrive:
```

## Step 3: Create a mount point

A mount point is an empty folder where your Google Drive files appear:

```bash
mkdir -p ~/gdrive
```

## Step 4: Mount Google Drive

```bash
rclone mount gdrive: ~/gdrive --vfs-cache-mode writes --daemon --log-file ~/gdrive-rclone.log
```

Your Google Drive files now appear in `~/gdrive`. `--vfs-cache-mode writes` lets applications save files normally, and `--daemon` runs the mount in the background, with messages going to the log file.

To unmount:

```bash
fusermount3 -u ~/gdrive
```

(On older systems use `fusermount -u`.)

## Step 5: Mount automatically at startup (optional)

Add an `@reboot` entry to your crontab. Use the full path to rclone, because cron does not load your usual `PATH`:

```bash
(crontab -l 2>/dev/null; echo "@reboot $(command -v rclone) mount gdrive: $HOME/gdrive --vfs-cache-mode writes --daemon --log-file $HOME/gdrive-rclone.log") | crontab -
```

## Things to know

- Google Docs, Sheets and Slides are not ordinary files. In a mount they appear as exported copies (for example `.docx`); edit them in the browser.
- A mount is slower than a local disk and Google limits how fast files can be read and written. For copying many files, `rclone copy` is faster and more reliable.
- For other options, see the [rclone Google Drive documentation](https://rclone.org/drive/).

Questions: research-computing@ucr.edu.
