---
title: "Host a web app or study server on Jetstream2, with HTTPS"
kb_id: KB046
topic: Compute
description: "Run an always-on web app (for example a Node.js or jsPsych study server) on a Jetstream2 VM: free DNS name, automatic Let's Encrypt certificate, systemd service, firewall, a second admin, data downloads and backups."
audience: "UCR researchers who need a small always-on server for a study, lab tool or web app, with a valid HTTPS address"
reviewed: 2026-11-04
owner: Research Computing
series: jetstream2
series_order: 5
review_notes:
  - "Every command on this page was run on 2026-11-04 on the Research Computing Campus Champion allocation: an m3.tiny VM from the Featured-Ubuntu24 image (Ubuntu 24.04.5), exosphere security group, public IP. The automatic DNS name instance-name.allocation.projects.jetstream-cloud.org resolved about 90 seconds after the public IP was attached. Node.js 22.23.4 from NodeSource, Express 4, Caddy 2.11.9 from the Caddy apt repository. Caddy obtained a Let's Encrypt certificate (issuer YE1, 90 days) on first start; HTTP redirected to HTTPS (308); port 3000 was not reachable from outside; the data folder was not reachable through the website (404)."
  - "Tested 2026-11-04: the counter file and response files survived a service restart and a full reboot, and the service and Caddy came back on their own. A second sudo user with key-only login worked. tar plus scp download of the data folder worked. Password and keyboard-interactive SSH logins are off on the image; unattended security upgrades are on and do not reboot."
  - "Tested 2026-11-04: VMs created with the OpenStack CLI log in as ubuntu; VMs created in Exosphere log in as exouser (KB043). The test VM was deleted afterwards."
  - "Not tested: volume snapshots for backups (the volume steps are in KB045), and opening the site from a UCR teaching lab. Lab networks on campus may filter outside addresses; check from one lab PC before a study starts."
---

This guide sets up a small, always-on server for a research study or lab web app on [Jetstream2](../../services/jetstream2/): your code runs as a service that restarts itself, the site has a free `projects.jetstream-cloud.org` address with a real HTTPS certificate, and only the ports you need are open. The example is a Node.js (Express) study server like those used for jsPsych experiments, but the same steps fit Python, R Shiny or any app that listens on a local port.

You need an ACCESS project with **Jetstream2 (CPU)** time. If you do not have one, start with the [researcher guide](../kb042-jetstream2-researcher-guide/) and [KB009](../kb009-using-nsf-access/). A server that runs all the time uses SUs every hour, so size the request with Section 1.

Jetstream2 is for open research data. A study that stores only study codes and responses (no names, NetIDs, emails or other identifiers) fits; anything more sensitive needs a conversation first, see the [data protection levels](../../security/#data-protection-levels).

## 1. Size it and request time

A study server rarely needs more than **m3.tiny** (1 core, 3 GB RAM, 20 GB disk, 1 SU per hour) or **m3.small** (2 cores, 6 GB, 2 SUs per hour). A server that others reach cannot be shelved while in use, so plan for it to run all the time:

| Flavor | SUs per hour | One month (730 h) | One year (8,760 h) |
| --- | --- | --- | --- |
| m3.tiny | 1 | 730 | 8,760 |
| m3.small | 2 | 1,460 | 17,520 |

One ACCESS credit buys one Jetstream2 SU, so an Explore project (400,000 credits on the ACCESS [project types page](https://allocations.access-ci.org/project-types) as of November 2026, up to half awarded with the first request) covers either size for a full year with room to spare. When you exchange credits, choose **Jetstream2 (CPU)**.

Plan for the wait: ACCESS usually decides an Explore request by the next business day, and the credit exchange is then reviewed by Jetstream2, which ACCESS says can take up to a week ([Get your first project](https://allocations.access-ci.org/get-your-first-project)). Start at least two weeks before your first session. Jetstream2 gives each allocation a default storage quota, so a small data volume needs no separate request.

In the Explore abstract, say what the server is for, for example: "A small always-on Jetstream2 VM (m3.small) hosts a Node.js web experiment for in-person lab sessions; participants are identified only by study codes."

## 2. Create the VM

Follow [Your first Jetstream2 VM](../kb043-jetstream2-first-vm/), with these choices:

- **Image:** Ubuntu 24.04 (latest).
- **Name:** short and lowercase, with only letters, digits and dashes (for example `study`). The name becomes part of the web address in Section 3.
- **Flavor:** m3.tiny or m3.small.
- **SSH public key:** upload yours (KB043, Section 2). Key-only login is how you and your co-investigators will manage the server.
- **Advanced Options:** leave **Install operating system updates** on and **Assign a public IP address** on. The web address and HTTPS both need the public IP.

When the VM is **Ready**, note its public IP address and username on the instance page. VMs made in Exosphere log in as `exouser`.

```bash
ssh -i ~/.ssh/jetstream2 exouser@<public-ip>
```

## 3. Your free web address

Jetstream2 gives every VM with a public IP a DNS name of the form:

```
<instance-name>.<allocation>.projects.jetstream-cloud.org
```

where `<allocation>` is your ACCESS project code in lowercase (for example `bio123456`). For a VM named `study` on project BIO123456 the address is `study.bio123456.projects.jetstream-cloud.org`. Check that it points at your VM (it can take a minute or two after the IP is attached):

```bash
dig +short study.bio123456.projects.jetstream-cloud.org
```

It should print your public IP. The name stays the same as long as the VM keeps its public IP. Jetstream2's own notes are in its [General FAQ](https://docs.jetstream-cloud.org/faq/general-faq/). You do not need a `ucr.edu` name; if you later want one, ask your department's IT group about a DNS record that points at the VM.

## 4. Install Node.js

On the VM:

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x -o nodesource_setup.sh
sudo -E bash nodesource_setup.sh
sudo apt-get install -y nodejs
node --version     # v22.x
```

This installs Node.js 22 (LTS) from NodeSource. For Python apps, use the `python3` that ships with the image and a virtual environment instead.

## 5. Keep code and data apart, and run the app as its own user

Create a service account with no login shell, and separate folders for the code and the data, so that deploying new code never touches responses and the website can never serve them:

```bash
sudo useradd --system --create-home --home-dir /opt/study --shell /usr/sbin/nologin study
sudo mkdir -p /opt/study/app /opt/study/data
sudo chown -R study:study /opt/study
sudo chmod 750 /opt/study/data
```

Copy your code into `/opt/study/app` (with `scp`, or `git clone` from a private repository) and install its packages as that user:

```bash
sudo -u study bash -c 'cd /opt/study/app && npm ci --omit=dev'
```

Make the app listen on **127.0.0.1** (not 0.0.0.0) on a local port, for example 3000, and read its data folder from an environment variable. This tested Express example writes each response to its own file and keeps a condition counter on disk that survives restarts:

```javascript
const express = require('express');
const fs = require('fs');
const path = require('path');
const DATA = process.env.DATA_DIR || '/opt/study/data';
const COUNTER = path.join(DATA, 'counter.json');
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));   // the jsPsych front end

function nextCondition() {
  let n = 0;
  try { n = JSON.parse(fs.readFileSync(COUNTER)).n; } catch (e) {}
  const tmp = COUNTER + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify({ n: n + 1 }));
  fs.renameSync(tmp, COUNTER);        // write-then-rename, so a crash never leaves a half-written counter
  return n % 2;
}
app.get('/assign', (req, res) => res.json({ condition: nextCondition() }));
app.post('/save', (req, res) => {
  fs.writeFileSync(path.join(DATA, `resp-${Date.now()}.json`), JSON.stringify(req.body));
  res.json({ ok: true });
});
app.listen(3000, '127.0.0.1');
```

## 6. Run it as a service that restarts itself

Create `/etc/systemd/system/study.service`:

```ini
[Unit]
Description=Study web app (Node.js)
After=network-online.target
Wants=network-online.target

[Service]
User=study
Group=study
WorkingDirectory=/opt/study/app
Environment=NODE_ENV=production
Environment=DATA_DIR=/opt/study/data
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
```

Start it, and turn it on at boot:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now study
systemctl status study --no-pager
curl -s localhost:3000/assign
```

Useful afterwards:

```bash
journalctl -u study -f             # live log
sudo systemctl restart study       # after deploying new code
```

In our test the counter and the saved responses were intact after `systemctl restart` and after a full `sudo reboot`, and the app came back on its own.

## 7. HTTPS with a free certificate (Caddy)

[Caddy](https://caddyserver.com/docs/install#debian-ubuntu-raspbian) is a web server that gets and renews a Let's Encrypt certificate for you. It sits in front of your app on ports 80 and 443 and passes requests to port 3000. Install it from Caddy's own package repository:

```bash
sudo apt-get install -y debian-keyring debian-archive-keyring apt-transport-https curl
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt-get update
sudo apt-get install -y caddy
```

Replace the contents of `/etc/caddy/Caddyfile` with your address from Section 3:

```
study.bio123456.projects.jetstream-cloud.org {
    reverse_proxy 127.0.0.1:3000
}
```

Then:

```bash
sudo systemctl reload caddy
```

Within a minute Caddy has a certificate. From your own computer:

```bash
curl -I https://study.bio123456.projects.jetstream-cloud.org/
```

should return `HTTP/2 200`, and the browser shows a padlock with no warning. Plain `http://` addresses redirect to `https://`. Certificates last 90 days, and Caddy renews them automatically; port 80 must stay open for that.

## 8. Firewall: open only SSH, HTTP and HTTPS

The Exosphere security group allows all inbound traffic, so turn on Ubuntu's firewall. **Allow SSH first**, or you will lock yourself out:

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
sudo ufw status verbose
```

Your app's own port (3000) stays closed to the outside, because the app listens only on 127.0.0.1 and the firewall does not allow it. The Exosphere Web Shell and Web Desktop use other ports; if you rely on them, see Jetstream2's [firewall notes](https://docs.jetstream-cloud.org/general/firewalls/) for the extra rules.

## 9. Add a co-investigator as an administrator

Each admin gets their own login with their own SSH key; never share a key. Ask your colleague for their **public** key (the one line starting with `ssh-ed25519`), then:

```bash
sudo adduser --disabled-password --gecos "" alex
sudo usermod -aG sudo alex
sudo mkdir -p /home/alex/.ssh
echo 'ssh-ed25519 AAAA...their key... alex@laptop' | sudo tee /home/alex/.ssh/authorized_keys
sudo chown -R alex:alex /home/alex/.ssh
sudo chmod 700 /home/alex/.ssh && sudo chmod 600 /home/alex/.ssh/authorized_keys
echo "alex ALL=(ALL) NOPASSWD:ALL" | sudo tee /etc/sudoers.d/90-alex
sudo chmod 440 /etc/sudoers.d/90-alex
```

They log in with `ssh alex@<public-ip>`. Password logins are already off on Jetstream2 images, so a key is the only way in. A colleague at another university does not need an ACCESS account to log in to the VM this way; if they also need to manage the VM in Exosphere, add them to the ACCESS project (KB009, Step 4).

## 10. Download the data after each session, and keep backups

Jetstream2 does not back up VMs or volumes; keeping a copy is your job. The simplest routine is to pull a dated archive to your own computer after each lab day:

```bash
# on the VM
sudo tar -C /opt/study -czf /tmp/data-$(date +%F).tar.gz data

# on your computer
scp exouser@<public-ip>:/tmp/data-*.tar.gz ~/study-backups/
```

Then store those archives somewhere UCR backs up, such as your UCR Google Drive or [CephRDS](../../services/cephrds/).

For a second layer, keep the data folder on a separate **volume** rather than the VM's root disk (create, attach and mount it as in [KB045, Section 3](../kb045-jetstream2-managing-vms/), then point `DATA_DIR` at a folder on it). A volume survives if the VM has to be rebuilt, and Exosphere can take snapshots of it.

## 11. Keep it patched and running

- Jetstream2 images install **security updates automatically** but do not reboot. About once a month, outside session hours: `sudo apt-get update && sudo apt-get upgrade`, then `sudo reboot` if a kernel or libc update was installed. The app and Caddy come back on their own.
- Do not shelve the VM during the study: a shelved VM is off. Shelve or delete it when data collection ends ([KB045](../kb045-jetstream2-managing-vms/)), after you have the final download.
- Check your SUs on the allocation page in Exosphere every month or so.
- Jetstream2 has warned that public IPv4 addresses are scarce. Do not release the VM's public IP while you need the site; the DNS name and certificate depend on it.

## 12. Before the first real session

1. From one of the actual lab computers, open `https://<your address>/` and run through the experiment once. Some campus teaching labs filter outside addresses; if the page does not load there but loads elsewhere, ask the lab's IT support to allow the address.
2. Restart the service (`sudo systemctl restart study`) and confirm the counter continues where it left off.
3. Do a test download and open the archive.
4. Make sure every admin can log in with their own key.

## Help

- Jetstream2 documentation: [docs.jetstream-cloud.org](https://docs.jetstream-cloud.org/); help desk help@jetstream-cloud.org
- ACCESS questions: [ACCESS support](https://support.access-ci.org/)
- Choosing a platform, or an ACCESS request: [contact Research Computing](../../help/)
