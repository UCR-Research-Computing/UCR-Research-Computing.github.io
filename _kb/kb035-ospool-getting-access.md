---
title: "Getting access to the OSPool: application, orientation and first login"
kb_id: KB035
topic: National
description: "Apply for OSPool access, meet a facilitator, register for an access point with your UCR NetID, set up SSH and log in."
audience: "UCR researchers and students starting on the OSG's Open Science Pool, and PIs setting up a group project"
reviewed: 2026-11-05
owner: Research Computing
series: ospool
series_order: 2
review_notes:
  - "Written 2026-10-29 from 'Start Here: Overview of Requesting OSPool Access' (portal.osg-htc.org/documentation/overview/account_setup/registration-and-login/, fetched 2026-10-29)."
  - "Tested 2026-10-29: the application form at portal.osg-htc.org/application was filled in and submitted by RC staff signed in with a UCR identity. The form fields listed in section 2 are from that form."
  - "Tested 2026-11-05 on ap40 by RC: enrollment petition, email confirmation, account approval, SSH key upload in COmanage, SSH config alias, and two-step publickey plus CILogon device code authentication."
  - "CHECK: Windows file dialog path (C:\\Users\\you\\.ssh and View > Show hidden items) was derived from standard Windows paths and was not tested on a Windows PC."
---

Getting onto the OSPool is a short, people-first process: you submit an application on the OSG Portal, meet with an OSG facilitator for about 20 to 30 minutes, and register for an account on an **access point**. There is no formal allocation proposal and no recharge from UCR.

---

## 1. Before you apply

Have ready:

- A sentence or two describing your research and what an individual job computes.
- A rough estimate of your workload scale: how many jobs you plan to run, how long one job runs, and its required memory, disk space, and input file sizes.
- The software tools you plan to run (scripts, compiled binaries, or container images).
- Whether your code requires GPUs.
- Data sensitivity confirmation: your data must be **Non-sensitive only (P1; no protected data)**.

If you are not sure whether your work fits high-throughput computing, read the [researcher guide](../kb034-ospool-researcher-guide/) or [ask Research Computing](../../help/) first.

---

## 2. Apply for OSPool access

1. Open the [OSPool application](https://portal.osg-htc.org/application) on the OSG Portal.
2. Enter your name, select **University of California, Riverside** as your institution, and provide your `ucr.edu` email address.
3. Choose your academic role, describe your research and computing needs, and note whether you need GPUs, larger storage staging, or a high volume of jobs.
4. Complete the verification check and submit the form.

The OSG Research Facilitation team will email you to schedule an orientation consultation and confirm whether you are joining an existing OSPool project (for example, your lab's project) or creating a new project.

---

## 3. The orientation meeting

The orientation meeting typically takes 20 to 30 minutes over Zoom with an OSG facilitator. You discuss your computational workflow, review how tasks map onto the OSPool, and establish practical next steps for running test jobs. Bring an example script or description of a single task if possible.

---

## 4. Register for an access point

Wait until an OSG facilitator instructs you to register. When prompted:

1. Visit the [OSPool registration petition](https://registry.cilogon.org/registry/co_petitions/start/coef:211).
2. CILogon prompts for your identity provider. Select **University of California, Riverside** and authenticate with your UCR NetID and Duo Multi-Factor Authentication. Remember this institutional identity; you must select the same identity for subsequent logins.
3. On the User Enrollment page, select **Begin**, verify your name and email address, and select **Submit**.
4. Check your inbox for an email from `registry@cilogon.org` to verify your address. Follow the verification link in the email and select **Accept** to complete the petition.

Following the orientation meeting, the facilitator approves your account, links your profile to your OSPool project, and sends a welcome email naming your assigned access point (for example, `ap40.uw.osg-htc.org`).

---

## 5. Find your assigned OSG username

Your OSG username is assigned automatically during registration and is **not your UCR NetID and not your email address**. It often looks like `firstname.lastname`. Attempting to log in with your NetID will fail.

To find your assigned username:

1. Log in to the [COmanage registry dashboard](https://registry.cilogon.org/registry/co_dashboards/dashboard/co:7) using your UCR credentials.
2. Select your name in the upper-right corner. From the dropdown menu, select **My Profile (OSG)**.
3. Scroll down to the **Identifiers** table. Find the row labelled **OSG Username**. Note this exact string; this is the username you must use for all SSH connections and file transfers. Your assigned numeric UID is also displayed here.

**Multi-collaboration pitfall:** The COmanage registry at `registry.cilogon.org` hosts several research collaborations (FABRIC is one). If you belong to other collaborations, your profile page might default to a different group. Confirm that the top page header reads **OSG/PATh Services** and that the dropdown menu specifically opens **My Profile (OSG)**. An SSH key uploaded under another collaboration's profile will not allow access to your OSPool access point.

---

## 6. Generate and upload an SSH key

Access points authenticate connections using SSH keys. Generate a dedicated key pair on your local computer using a terminal (macOS, Linux, or Windows PowerShell):

```bash
ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519_osg
```

Press Enter to accept default prompts or specify an optional passphrase. This command creates two files in your `~/.ssh` directory:

- `~/.ssh/id_ed25519_osg`: Your private key. Keep this file private and never share or upload it.
- `~/.ssh/id_ed25519_osg.pub`: Your public key. This is the file you upload to COmanage.

To upload your public key:

1. In COmanage, open **My Profile (OSG)**.
2. In the right-hand menu, select **Authenticators**.
3. Under the Authenticators list, find SSH Keys and select **Manage**.
4. Select **Add SSH Key**. This interface requires a **file upload** of your `.pub` file rather than pasting key text.
5. Browse to select your `~/.ssh/id_ed25519_osg.pub` file and upload it.

**Tips for locating your public key file in the upload dialog:**

- **macOS:** In Finder open dialogs, the `~/.ssh` directory is hidden by default. In the file picker dialog, press `Cmd+Shift+.` (Command + Shift + Period) to toggle hidden files and folders, or press `Cmd+Shift+G` and type `~/.ssh` to jump directly into the directory. Alternatively, copy the public key file to your Desktop before opening the browser dialog:
  ```bash
  cp ~/.ssh/id_ed25519_osg.pub ~/Desktop/
  ```
  Upload it from your Desktop, and then remove the Desktop copy:
  ```bash
  rm ~/Desktop/id_ed25519_osg.pub
  ```
- **Windows (not tested by Research Computing):** Your `.ssh` directory is located in your user profile folder at `C:\Users\YOUR_USERNAME\.ssh`. If the folder is hidden in the file dialog, open File Explorer, select the **View** menu, and check **Hidden items**.

---

## 7. Configure SSH and log in

Add a host configuration entry to your local `~/.ssh/config` file so you do not have to type the full hostname, key path, and username each time:

```text
Host ap40
    HostName ap40.uw.osg-htc.org
    User YOUR_OSG_USERNAME
    IdentityFile ~/.ssh/id_ed25519_osg
    IdentitiesOnly yes
```

Replace `YOUR_OSG_USERNAME` with your assigned OSG username from COmanage, and replace `ap40.uw.osg-htc.org` with the specific access point host named in your facilitator welcome email (such as `ap40`, `ap41`, or `ap43`).

Now connect to your access point:

```bash
ssh ap40
```

### Two-step login authentication

When you connect, the access point verifies your SSH key and may prompt for browser-based verification via CILogon:

1. Your SSH client offers your key. In our test on ap40, the server accepted the key (`ssh -v` reports "partial success") and then showed a sign-in link:

```text
Authenticate at
-----------------
https://cilogon.org/device/?user_code=XXX-XXX-XXX
-----------------
Type 'Enter' when you authenticate.
```

2. Open the URL in your web browser. Sign in using **University of California, Riverside** credentials with your NetID and Duo.
3. The browser confirms that you approved the user code and instructs you to return to your device.
4. Return to your terminal and press **Enter** to complete the login.

Two operational details observed in testing:

- **Later logins:** For a while after you approve a browser sign-in, logins from the same computer went straight through with the key alone. When the link appears again, repeat the steps above.
- **Batch mode:** Running `ssh -o BatchMode=yes` will always fail if the server requires this second verification step, because batch mode disables the interactive terminal prompt required to complete the CILogon device code flow.

### Access point welcome message (MOTD)

Once logged in, the access point displays a message of the day containing essential operational links and notices:

- An acknowledgment notice for the [OSG End-User Acceptable Use Policy](https://osg-htc.org/end-user-aup).
- Instructions on how to [cite the OSPool](https://osg-htc.org/acknowledging) in papers resulting from these computations.
- Schedule and link for weekly facilitator office hours, held Tuesdays from 4:00 to 5:30 PM Eastern Time ([OSG Office Hours Zoom](https://osg-htc.org/OfficeHoursZoom)).
- Your active disk usage and storage quotas on `/home` and `/ospool/*/data`.

---

## 8. Troubleshooting login problems

- **"Permission denied (publickey)":**
  - Your account registration may still be pending facilitator approval.
  - Your SSH key may have been uploaded under a different collaboration profile in COmanage (such as FABRIC). Return to COmanage and verify that the page header shows OSG/PATh Services and that you selected "My Profile (OSG)".
  - Your local SSH client is not using the correct key file. Verify that `IdentityFile` in `~/.ssh/config` points to `~/.ssh/id_ed25519_osg`.
- **"Partial success" followed by "Permission denied (keyboard-interactive)":**
  - Your SSH key was accepted, but the second-step CILogon device verification was not completed. You must visit the `https://cilogon.org/device/` link in your browser, approve the code, and press Enter in your terminal before the session times out.
- **Wrong username:**
  - Verify that you are connecting with your assigned OSG username (found under My Profile (OSG) > Identifiers > OSG Username), and not your UCR NetID or email address.
- **Signed in with the wrong CILogon identity:**
  - If you previously authenticated to CILogon with an identity other than University of California, Riverside, visit [cilogon.org/me](https://cilogon.org/me/) to clear your active CILogon cookies. Return to the access point link and sign in using your UCR institutional credentials.
- **Further help:**
  - For account and access point issues, contact OSG facilitators at [support@osg-htc.org](mailto:support@osg-htc.org) or attend Tuesday office hours.
  - For local SSH setup or workflow planning, [contact Research Computing](../../help/).

---

Next: [Moving data on the OSPool](../kb036-ospool-moving-data/).
