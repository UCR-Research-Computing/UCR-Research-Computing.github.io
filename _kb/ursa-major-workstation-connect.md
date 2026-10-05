---
title: "Connecting to an Ursa Major research workstation"
topic: Cloud
owner: Research Computing
reviewed: 2026-10-04
review_notes:
  - "Chuck 2026-10-04: public IPs and SSH are allowed by request."
  - "Rewrote the console SSH steps (SSH button in VM instances), the RDP section (Windows password reset, IAP tunnel instead of opening port 3389 to the internet) and the gcloud section (added --tunnel-through-iap for VMs without an external IP). Removed padding text."
  - "Added Tier 2 recharge note, the pre-October 2026 workstation note, and a reminder to stop idle VMs."
redirect_from:
  - /Knowledge_Base/Ursa_Major_Research_Workstations_How_to_Connect.html
---

This guide shows how to connect to a research workstation (a Compute Engine VM) in your Ursa Major project. To create one, see [Launching an Ursa Major research workstation](../ursa-major-workstation-launch/).

**Costs:** research workstations are Tier 2. They are recharged to a lab funding source under an MOU. A running VM is charged whether or not you are connected, so stop it when you are done. See [Ursa Major research workstations](../ursa-major-research-workstations/) and [KB005: Ursa Major service tiers](../kb005-ursa-major-service-tiers/).

**Workstations set up before October 2026:** some were set up under the earlier tiers, when workstations were not recharged. If your lab has one, contact [research-computing@ucr.edu](mailto:research-computing@ucr.edu). Nothing changes without that conversation.

**External IP addresses:** a public IP address and direct SSH or RDP access are available by request to [research-computing@ucr.edu](mailto:research-computing@ucr.edu). Without one, connect through the console or an Identity-Aware Proxy (IAP) tunnel as shown below.

## SSH from the web console (Linux VMs)

1. Go to the [Google Cloud console](https://console.cloud.google.com/) and select your project.
2. Open the navigation menu and select **Compute Engine**, then **VM instances**.
3. If the VM is stopped, select it and click **Start / Resume**.
4. In the VM's row, click **SSH** in the **Connect** column.
5. An SSH-in-browser window opens and connects you to the VM. Allow it a moment to transfer keys the first time.

## SSH with the gcloud command line (Linux VMs)

1. Install the [Google Cloud CLI](https://cloud.google.com/sdk/docs/install), or use Cloud Shell in the console.
2. Sign in and set your project:

   ```bash
   gcloud auth login
   gcloud config set project my-lab-project
   ```

3. Connect:

   ```bash
   gcloud compute ssh INSTANCE_NAME --zone=ZONE
   ```

   Replace `INSTANCE_NAME` with the VM name and `ZONE` with its zone (for example `us-central1-a`). The first time, gcloud creates an SSH key for you.

4. If the VM has no external IP address, connect through Identity-Aware Proxy (IAP):

   ```bash
   gcloud compute ssh INSTANCE_NAME --zone=ZONE --tunnel-through-iap
   ```

   This needs a firewall rule that allows SSH from Google's IAP range. See [Google's IAP TCP forwarding guide](https://cloud.google.com/iap/docs/using-tcp-forwarding).

Google's guide: [Connect to Linux VMs](https://cloud.google.com/compute/docs/connect/standard-ssh).

## Remote desktop (Windows VMs)

1. **Set a Windows password.** In **VM instances**, click the VM name, then **Set Windows password**. Or run:

   ```bash
   gcloud compute reset-windows-password INSTANCE_NAME --zone=ZONE
   ```

   Store the password somewhere safe, such as a password manager.

2. **Install an RDP client.** Windows includes Remote Desktop Connection. On macOS, use Microsoft's Windows App. On Linux, use a client such as Remmina.

3. **Connect.** The safer option is an IAP tunnel, which does not open the RDP port to the internet:

   ```bash
   gcloud compute start-iap-tunnel INSTANCE_NAME 3389 \
       --local-host-port=localhost:3389 --zone=ZONE
   ```

   Leave that running, then point your RDP client at `localhost:3389` and sign in with the username and password from step 1. If you use a different local port, connect to that port instead.

   If your VM has an external IP and a firewall rule that allows RDP from your network only, you can connect to that IP directly. Do not open port 3389 to the whole internet.

4. Your session ends when you disconnect, but the VM keeps running (and being charged) until you stop it.

Google's guide: [Connect to Windows VMs](https://cloud.google.com/compute/docs/instances/connecting-to-windows).

## Troubleshooting

- **Connection times out:** check that the VM is running and that a firewall rule allows SSH (port 22) or RDP (port 3389) from your source, or from the IAP range if you use IAP.
- **Permission denied:** you need a role on the project that allows connecting to VMs. Ask your project owner or [research-computing@ucr.edu](mailto:research-computing@ucr.edu).
