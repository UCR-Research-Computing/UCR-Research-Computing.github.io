---
title: "Transferring Data from UCR HPCC to External Centers using Globus Connect Personal"
topic: Storage
owner: Research Computing
reviewed: 2026-10-04
review_notes:
  - "Fixed the product name (Globus Connect Personal, not Personal Connect) in the title and text."
  - "Aligned setup with the HPCC Globus page: module load globusconnect, -setup, -start -restrict-paths, -stop. Removed the manual download, the head node names and the worker-node advice."
  - "Added the Globus subscription note from the HPCC page; replaced the dead personal-connect link and the 'document you were provided' line with the HPCC and Globus docs."
  - "CHECK: the globusconnect module and the -restrict-paths rw/rhome,rw/bigdata example still match HPCC practice (HPCC page last updated Dec 2023)."
redirect_from:
 - /Knowledge_Base/Globus_Transfer.html
---

## Overview

This article explains how to move data from the UCR HPCC cluster to an external center, such as TACC (Texas Advanced Computing Center) or SDSC (San Diego Supercomputer Center), using Globus. You run the Globus Connect Personal client on the HPCC cluster, which makes your HPCC storage a Globus endpoint. You then start and watch transfers from the Globus web app in a browser on any computer.

The HPCC's own [Globus Connect Personal page](https://hpcc.ucr.edu/manuals/hpc_cluster/data/globus/) is the authority for the HPCC side of these steps. If it differs from this article, follow the HPCC page.

## Before you start

- **HPCC account.** You need an active HPCC account. See the HPCC [Access page](https://hpcc.ucr.edu/about/overview/access/) for how to request one.
- **Globus login.** Sign in at [app.globus.org](https://app.globus.org) with your UCR credentials (choose University of California, Riverside as the organization).
- **Destination endpoint.** Find out the Globus endpoint (collection) name at the destination center. Most national centers publish this in their documentation; otherwise ask their support team.
- **Subscription.** The HPCC page notes that a transfer between two sites needs at least one of the two endpoints to be covered by a paid Globus subscription. Endpoints run by national centers are often subscribed, but confirm this with the destination. See [Globus subscriptions](https://www.globus.org/subscriptions).

## Set up Globus Connect Personal on the HPCC

### 1. Log in to the HPCC

Connect over SSH to `cluster.hpcc.ucr.edu`, as described in the HPCC [login instructions](https://hpcc.ucr.edu/manuals/access/login/). A terminal in the HPCC's web-based OnDemand service also works.

### 2. Load the module

The HPCC provides Globus Connect Personal as a module:

```bash
module load globusconnect
```

### 3. Create your HPCC endpoint (one time)

```bash
globusconnect -setup --no-gui
```

The command prints a long login URL and then waits for an auth code.

1. Copy the URL into the web browser on your own computer (not a browser on the cluster).
2. Choose University of California, Riverside as the organization and complete the UCR login and Duo.
3. Review and accept the requested permissions.
4. Copy the auth code that Globus shows you and paste it at the prompt on the cluster.
5. Enter a name for the endpoint, for example `ucr-hpcc-yournetid`.

When setup reports success, Globus recognizes your HPCC storage as an endpoint. You do not need to repeat this step.

### 4. Start the client

The client must be running for transfers to or from the HPCC. To make your bigdata folders visible as well as your home directory, use `-restrict-paths`:

```bash
globusconnect -start -restrict-paths rw/rhome,rw/bigdata &
```

Without `-restrict-paths`, only your home directory is available.

The client stops if your SSH session ends. For long transfers, start it inside a `tmux` or `screen` session and detach, so it keeps running after you disconnect.

### 5. Stop the client when you are done

```bash
globusconnect -stop
```

## Transfer the data

1. Go to [app.globus.org](https://app.globus.org) and open **File Manager**.
2. In the first **Collection** box, search for your HPCC endpoint. It is listed under **Your Collections**.
3. In the second **Collection** box, search for the destination center's collection (for example, search for "TACC" or "SDSC"), and authenticate to it if asked.
4. Browse to the source folder on the HPCC side and the destination folder on the remote side.
5. Select the files and folders to send.
6. Check **Transfer & Sync Options** if you need them (for example, verifying file integrity after transfer), then click **Start** on the side you are sending from.
7. Follow progress under **Activity**. Globus can email you when a transfer finishes or fails.

## Good practice

- **Keep the client running** for the whole transfer. If it stops, Globus pauses the transfer and resumes when the endpoint comes back.
- **Check space at the destination** before you start, so the transfer does not fail partway through.
- **Share only what you need.** `-restrict-paths` controls which HPCC folders the endpoint exposes. Expose only the folders you are transferring.
- **Many small files transfer slowly.** For a dataset with very many small files, consider bundling them with `tar` first.
- **Follow the destination's policies** on data types and allowed use.

## Troubleshooting

- **Endpoint shows as offline:** the client is not running. Log in, run `module load globusconnect`, and start it again.
- **Bigdata folders are missing:** restart the client with the `-restrict-paths` option shown above.
- **Permission errors:** check that you can read the source files on the HPCC and write to the destination folder.
- **Login or setup problems on the HPCC:** contact support@hpcc.ucr.edu.
- **Problems at the destination:** contact the destination center's support team.

## More information

- [HPCC: Globus Connect Personal](https://hpcc.ucr.edu/manuals/hpc_cluster/data/globus/)
- [Globus documentation](https://docs.globus.org/)
- [Globus Connect Personal documentation](https://docs.globus.org/globus-connect-personal/)
- For other questions, contact Research Computing at research-computing@ucr.edu or on the [Research Computing Slack](https://ucr-research-compute.slack.com/).
