---
title: "Accessing CephRDS via Graphical S3 Clients"
kb_id: KB019
topic: Storage
audience: "UCR Faculty, Postdocs, Researchers & Students"
reviewed: 2026-10-04
owner: Research Computing
review_notes:
  - "Removed the architecture image: it used Liquid outside a fact include and has garbled AI-generated labels ('Collected anth-rrate', an OSD icon under monitor nodes). The file is still in assets/images."
  - "Replaced 'officially recommended' and 'effortlessly' wording; the bucket example is now a placeholder instead of a NetID-based name."
  - "CHECK: the us3ui field names (Endpoint, Bucket Name, Use SSL) still match the current release (project last updated Jul 2026)."
  - "CHECK: whether the Cyberduck 'Amazon S3' profile works as-is or a generic S3 profile with path-style is needed for rds.ucr.edu."
redirect_from:
  - /Knowledge_Base/KB019_CephRDS_GUI_Clients.html
---

Command-line tools such as `rclone` are the fastest way to move large amounts of data, but a drag-and-drop interface is often easier for day-to-day file management.

CephRDS uses the S3 protocol, so you need an S3-compatible graphical client. You also need your CephRDS Access Key ID and Secret Access Key; see [KB013: Connecting to CephRDS](../kb013-cephrds-onboarding/) for how to request them.

**Network:** CephRDS is reachable from the campus network only. Off campus, connect to the [UCR campus VPN](https://vpn.ucr.edu/) (Cisco Secure Client) first.

## Mac and Windows: Cyberduck

[Cyberduck](https://cyberduck.io/) is an open-source graphical client for macOS and Windows that Research Computing suggests for CephRDS.

### Connection settings for Cyberduck

1. Open Cyberduck and click **Open Connection**.
2. From the drop-down at the top, select **Amazon S3**.
3. **Server:** `rds.ucr.edu`
4. **Port:** `443` (the connection should show `https://`)
5. **Access Key ID:** your CephRDS access key
6. **Secret Access Key:** your CephRDS secret key
7. Click **Connect**.

To reuse the connection, save it as a bookmark (**Bookmark** then **New Bookmark**). Cyberduck can store the secret key in your system keychain.

## Linux: Universal S3 UI (us3ui)

On Linux, **Universal S3 UI (us3ui)** is a lightweight, open-source desktop client that copes well with large bucket listings.

### Installation

Download the precompiled Linux binary from the project's [GitHub releases page](https://github.com/pteich/us3ui/releases).

### Connection settings for us3ui

1. Launch the application and click **+** to add a new connection.
2. **Name:** CephRDS (or any name you like)
3. **Endpoint:** `rds.ucr.edu`
4. **Access Key:** your CephRDS access key
5. **Secret Key:** your CephRDS secret key
6. **Bucket Name:** your bucket name (for example, `my-lab-bucket`)
7. **Region:** leave blank
8. **Prefix:** leave blank
9. **Use SSL (HTTPS):** this must be checked
10. Click **Connect**.

## Other options

- To work with a bucket as if it were a local drive, see [KB020: Mounting CephRDS buckets as local drives](../kb020-cephrds-mounting-folders/).
- To script transfers, see [KB018: Accessing CephRDS with Python (boto3)](../kb018-cephrds-python-boto3/) or the rclone section of [KB013](../kb013-cephrds-onboarding/).

Questions: research-computing@ucr.edu.
