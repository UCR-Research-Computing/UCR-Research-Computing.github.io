---
title: "Your first Jetstream2 VM: create, connect, work, shelve"
kb_id: KB043
topic: Compute
description: "Sign in to Exosphere, add an SSH key, create an Ubuntu VM, connect by web shell, web desktop or SSH, install software, and shelve the VM when you stop."
audience: "UCR researchers with an ACCESS project that has Jetstream2 (CPU) time"
reviewed: 2026-10-30
owner: Research Computing
series: jetstream2
series_order: 2
review_notes:
  - "Every step and command on this page was run on 2026-10-30 on the Research Computing Campus Champion allocation: Exosphere (jetstream2.exosphere.app), Ubuntu 24.04 (latest) image, flavor m3.quad, web desktop enabled, new ed25519 SSH key uploaded. VM ready about 5 minutes after Create. SSH as exouser, sudo, Docker hello-world, Python 3.12, a JupyterLab venv, module avail, web shell and web desktop all worked. Screenshots are from that session with identifying details covered."
  - "The Exosphere sign-in steps (Add allocation, ACCESS CI at CILogon) were done in an earlier session and not re-shot."
---

You need an ACCESS project with **Jetstream2 (CPU)** time. If you do not have one, start with the [researcher guide](../kb042-jetstream2-researcher-guide/) and [KB009](../kb009-using-nsf-access/).

## 1. Sign in to Exosphere

1. Go to [jetstream2.exosphere.app](https://jetstream2.exosphere.app/).
2. Click **Add allocation**, then **Add ACCESS Account**.
3. At the CILogon page choose **ACCESS CI (XSEDE)** and sign in with your ACCESS username and Duo.
4. Your ACCESS projects that have Jetstream2 time appear on the home page. Click one.

The allocation page shows how many SUs you have left for each resource, your instances, volumes, public IP addresses and SSH keys:

![Exosphere allocation overview: SUs remaining for CPU, GPU and large-memory instances, and cards for instances, volumes, shares, public IP addresses, SSH keys and images](../../assets/images/jetstream2/allocation-overview.png)

## 2. Make an SSH key (once per computer)

The web shell and web desktop work without a key, but SSH from your own computer needs one. On macOS or Linux (or Windows PowerShell):

```bash
ssh-keygen -t ed25519 -C "my-laptop-jetstream2" -f ~/.ssh/jetstream2
cat ~/.ssh/jetstream2.pub
```

Copy the single line that starts with `ssh-ed25519`. That is the **public** key, and it is safe to paste into Exosphere. Never share the file without `.pub`.

## 3. Create the VM

1. Click **Create**, then **Instance**.

   ![The Create menu open, listing Instance, Volume, Share, SSH Public Key and Public IP Address](../../assets/images/jetstream2/create-menu.png)

2. Choose an image. **Ubuntu 24.04 (latest)** is a good default.

   ![Choose an Instance Source: Ubuntu 24.04 and 22.04, Rocky Linux 10 and 9](../../assets/images/jetstream2/choose-image.png)

3. Give it a **name** and pick a **flavor**. **m3.quad** (4 cores, 15 GB RAM, 4 SUs per hour) is roughly a mid-range laptop. The bars show how much of your allocation's quota is in use.

   ![The Create Instance form: name, image, quota bars and the list of general-purpose flavors](../../assets/images/jetstream2/create-form-flavors.png)

4. Scroll down:
   - **Enable web desktop?** Choose **Yes** if you want a graphical desktop in the browser.
   - **Choose an SSH public key.** Pick yours, or click **Upload a new SSH public key**, give it a name, paste the `ssh-ed25519 ...` line and click **Create**.

   ![Upload SSH Public Key: a name field and the public key text](../../assets/images/jetstream2/upload-ssh-key.png)

   ![Bottom of the Create Instance form: root disk size, number of instances, web desktop, SSH public key and Advanced Options](../../assets/images/jetstream2/create-form-options.png)

5. Leave **Advanced Options** as they are (operating system updates on, automatic public IP address), and click **Create**.

The VM shows **Building**, then **Running Setup**, then **Ready**. In our test this took about five minutes.

![The instance list with two Ready instances, their flavors, and Connect to and web desktop buttons](../../assets/images/jetstream2/instance-list.png)

## 4. Connect

Click the VM's name to open its page. **Interactions** lists the ways in, and **Credentials** gives the hostname, public IP address and username (`exouser`).

![Instance page: Interactions (web shell, web desktop, native SSH, console) and Credentials (hostname, public IP, username exouser, SSH key name)](../../assets/images/jetstream2/instance-connect-credentials.png)

### Web shell (no setup)

Click **Web Shell**. A terminal opens in a new browser tab, already logged in as `exouser`.

### Web desktop

Click **Web Desktop** for a full Ubuntu desktop in the browser, with Firefox, a terminal, RStudio and MATLAB in the dock:

![Ubuntu desktop in the browser, showing an 'upgrade available' prompt](../../assets/images/jetstream2/web-desktop.png)

If Ubuntu offers to upgrade to a new release, click **Don't Upgrade**. Release upgrades on a VM can break the Jetstream2 setup; make a new VM from a newer image instead.

### SSH from your computer

Copy the **Native SSH** line from the instance page, adding your key:

```bash
ssh -i ~/.ssh/jetstream2 exouser@<public-ip>
```

To save typing, add an entry to `~/.ssh/config`:

```
Host my-js2
  HostName <public-ip>
  User exouser
  IdentityFile ~/.ssh/jetstream2
```

Then `ssh my-js2`, and `scp results.csv my-js2:` to copy a file across.

## 5. Look around and install software

These are the commands we ran on a fresh m3.quad, with what they returned:

```bash
cat /etc/os-release | head -1   # PRETTY_NAME="Ubuntu 24.04.5 LTS"
nproc                           # 4
free -h                         # about 14 GiB total
df -h /                         # 19 GB root disk
sudo -n true && echo ok         # ok: you have sudo
```

**Ubuntu packages:**

```bash
sudo apt update
sudo apt install -y htop tmux
```

**Docker** is already installed:

```bash
sudo docker run --rm hello-world
```

**Python** (3.12) with a virtual environment, for example JupyterLab:

```bash
python3 -m venv ~/jl
~/jl/bin/pip install jupyterlab
~/jl/bin/jupyter lab --version
```

**The Jetstream2 software collection** is loaded with modules:

```bash
module avail                 # R, apptainer, intel-oneapi, matlab, miniforge, nvhpc, rstudio ...
module load miniforge        # gives you conda
module load apptainer        # Singularity/Apptainer containers
```

Keep long jobs running after you disconnect with `tmux`: start `tmux`, run your work, press `Ctrl-b` then `d` to detach, and later `tmux attach` to return.

## 6. Shelve it when you stop

A running VM uses SUs every hour, even when idle. When you finish for the day or the week, open the VM's page, choose **Actions**, then **Shelve**, and confirm. Shelving shuts the VM down and keeps its disk. **Unshelve** brings it back; check the instance page for its address afterwards.

More on shelving, sizes, volumes and deleting: [Managing Jetstream2 VMs and SUs](../kb045-jetstream2-managing-vms/).

## 7. If something goes wrong

- **Permission denied (publickey)**: the key you pass with `-i` is not the one chosen when the VM was created. Use the web shell instead, and add your key to `~/.ssh/authorized_keys` on the VM.
- **Host key changed** warning after a VM was rebuilt or given a new address: remove the old entry with `ssh-keygen -R <public-ip>`.
- **No public IP address**: Jetstream2 has warned that public IPv4 addresses are scarce. The web shell and web desktop still work without one.
- Anything else: help@jetstream-cloud.org, or [contact Research Computing](../../help/).
