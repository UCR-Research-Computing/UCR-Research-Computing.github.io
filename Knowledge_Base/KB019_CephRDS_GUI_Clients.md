---
layout: default
title: "Accessing CephRDS via Graphical S3 Clients"
parent: Knowledge Base
---

# Accessing CephRDS via Graphical S3 Clients

![CephRDS S3 Architecture](/assets/images/cephrds_architecture.png)

While command-line tools like `rclone` offer maximum performance, many researchers prefer the ease of a visual, drag-and-drop interface for managing their data.

Since CephRDS uses the S3 protocol, you must use an S3-compatible graphical client. 

## Mac & Windows: Cyberduck
[Cyberduck](https://cyberduck.io/) is our officially recommended graphical client for macOS and Windows. It is free, open-source, and extremely reliable for managing S3 connections.

### Connection Settings for Cyberduck:
1. Open Cyberduck and click **Open Connection**.
2. From the dropdown at the top, select **Amazon S3**.
3. **Server:** `rds.ucr.edu`
4. **Port:** `443` (Ensure the URL shows `https://`)
5. **Access Key ID:** *Enter your provisioned Ceph Access Key*
6. **Secret Access Key:** *Enter your provisioned Ceph Secret Key*
7. Click **Connect**.

## Linux: Universal S3 UI (us3ui)
For Linux users, we recommend **Universal S3 UI (us3ui)**. It is a lightweight, native, and fast open-source client that handles large bucket listings effortlessly.

### Installation
You can download the pre-compiled binary for Linux from the [official GitHub repository](https://github.com/pteich/us3ui/releases).

### Connection Settings for us3ui:
1. Launch the application and click the **+** button to add a new connection.
2. **Name:** CephRDS (or your preference)
3. **Endpoint:** `rds.ucr.edu`
4. **Access Key:** *Enter your provisioned Ceph Access Key*
5. **Secret Key:** *Enter your provisioned Ceph Secret Key*
6. **Bucket Name:** *Enter your specific bucket name (e.g., your_netid-hdd-bucket)*
7. **Region:** *(Leave blank)*
8. **Prefix:** *(Leave blank)*
9. **Use SSL (HTTPS):** **MUST BE CHECKED**
10. Click **Connect**.
