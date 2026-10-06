---
title: "Getting access to Nautilus: accounts, namespaces and kubectl"
kb_id: KB024
topic: National
audience: "UCR faculty, postdocs, staff and students starting on the NRP Nautilus cluster, and PIs setting up a group"
reviewed: 2026-10-06
owner: Research Computing
series: nautilus
series_order: 2
review_notes:
  - "Written 2026-10-06 from the NRP documentation (nrp.ai/documentation, fetched 2026-10-06) and tests run in a UCR namespace the same day."
  - "Tested 2026-10-06: kubeconfig from nrp.ai/config, kubelogin browser sign-in, kubectl auth whoami, kubectl auth can-i, kubectl get resourcequota and kubectl describe limitrange in a UCR namespace. The CPU and memory LimitRange defaults (100m CPU, 1Gi memory) were seen in that one namespace; other namespaces may differ."
  - "CHECK: the Windows install route (rename the release binary to kubectl-oidc_login.exe and put it on PATH) follows the kubelogin README and the NRP VS Code note; it was not tested on Windows."
  - "CHECK: the exact link for registering for the Nautilus Support Matrix chat; the article points to the NRP Getting access page and nrp.ai/contact rather than a direct invite."
  - "CHECK: the WSL --browser-command line is written without inner quotes (the NRP page shows it with double quotes inside the YAML item); not tested on WSL."
  - "CHECK: the Homebrew, krew and Chocolatey install options are mentioned only by pointing to the kubelogin README; they were not tested."
---

## 1. What "getting access" means on Nautilus

Getting onto the National Research Platform (NRP) Nautilus cluster has three layers. People often finish the first and wonder why nothing works, so it helps to see all three up front:

| Layer | What it gives you | Who does it |
| :--- | :--- | :--- |
| **1. An NRP account** | You can sign in to nrp.ai. No compute yet. | You, by signing in once and accepting the Acceptable Use Policy (AUP) |
| **2. Membership of a namespace** | Compute: you can start notebooks, jobs and services in that namespace | A namespace admin (your PI, a supervisor, or you if you request your own group) |
| **3. Tools on your computer** (optional) | Command-line control of the cluster with `kubectl` | You, by installing `kubectl`, the kubelogin plugin and the NRP config file |

What you need depends on how you plan to work. The [researcher guide](../kb023-nautilus-researcher-guide/) compares the options in detail.

| If you want to | You need | Guide |
| :--- | :--- | :--- |
| Run Jupyter notebooks in a browser | Layers 1 and 2 | [KB025](../kb025-nautilus-jupyter-and-coder/) |
| Use Coder (VS Code, RStudio or a desktop in the browser) | Layers 1 and 2, plus approval from the NRP admins | [KB025](../kb025-nautilus-jupyter-and-coder/) |
| Run batch jobs, GPU work or services | All three layers | [KB026](../kb026-nautilus-batch-jobs-and-gpus/), [KB029](../kb029-nautilus-hosting-web-tools/) |
| Call the NRP's hosted language models | Layers 1 and 2, in a group that has the LLM capability turned on | [KB028](../kb028-nautilus-llm-api/) |
| Bring a class or workshop onto the cluster | You as namespace admin, plus a training join link | [KB030](../kb030-nautilus-teaching-and-workshops/) |

The rest of this article walks through each layer, then covers checking what your namespace is allowed to use, keeping membership current, and fixing the common sign-in problems.

---

## 2. Before you start: data and acceptable use

Two rules apply to everything on Nautilus, so read them before you sign up.

* **Non-sensitive data only (UCR P1).** The NRP states that its systems have no storage suitable for HIPAA, PII, FISMA, FERPA or other protected data, and that such data must not be stored there. Controlled Unclassified Information (CUI) does not belong there either. If your project uses P2 or higher data, use the [HPCC](../../services/hpcc/), [Ursa Major](../../services/ursa-major/) or the [Secure Enclave](../../services/secure-enclave/) instead, or [ask Research Computing](../../help/) which fits.
* **Non-profit, non-commercial use.** The NRP describes itself as non-profit and non-commercial, and its AUP applies that to all use of the cluster. Research and teaching fit; consulting work or a commercial product does not.

Read the [NRP Acceptable Use Policy and Cluster Policies](https://nrp.ai/documentation/userdocs/start/policies/) before you run anything. The cluster policies cover job runtimes, GPU use and data purging, and breaking them can get a user or a whole namespace banned.

---

## 3. Step 1: Create your NRP account (about 5 minutes)

1. Go to [nrp.ai](https://nrp.ai) and click **Log In** at the top right.
2. You are sent to **CILogon**, the federated sign-in service many research institutions share. Under **Select an Identity Provider**, choose **University of California, Riverside** and click **Log On**.
3. Sign in with your UCR NetID and password (and Duo, as usual).
4. The first time you sign in, you are asked to read and accept the **NRP Acceptable Use Policy**. Accepting it creates your account.

That is all this step does. Accepting the AUP registers you, but it does not give you any compute. You get compute in Step 2, when a namespace admin adds you.

**Collaborators from other institutions** follow the same steps with their own institution. If their institution is not in the CILogon list, the NRP suggests trying the **Microsoft** entry (for campuses that use Microsoft 365 accounts), then Google or GitHub. ORCID users must make their ORCID email address visible, or the sign-in fails. See [Getting access](https://nrp.ai/documentation/userdocs/start/getting-started/) for details.

---

## 4. Step 2: Get into a namespace

### How the NRP organizes people and resources

The NRP manages access through a hierarchy, described on its [hierarchy page](https://nrp.ai/documentation/userdocs/start/hierarchy/):

* **Organization**: the top level, such as a university or consortium.
* **Lab**: a group inside an organization, usually led by a faculty member.
* **Project**: a specific piece of work inside a lab. **Each Project is a Kubernetes namespace** on the cluster.

A **namespace** is your group's isolated space on the cluster. Everything you run (notebooks, jobs, storage volumes, web services) lives in a namespace, and you can only see what is running in namespaces you belong to. You can belong to several.

Every namespace has at least one **namespace admin**. The admin adds and removes members, can create more namespaces, and **is personally responsible for everything that runs in the namespace** and for keeping the member list up to date. Take that seriously before you add people.

### If you are a student

Ask your PI or research supervisor to add you to their namespace. They can do this from the [Namespaces page](https://nrp.ai/namespaces) once you have signed in at least once (Step 1), because they can only add people who already have an NRP account.

If your supervisor does not have a namespace yet, they can request one (next section). A PhD or master's student can be the admin of a namespace if their supervisor submits the request on their behalf.

### If you are faculty, staff or a postdoc

You can request your own group, which makes you its admin:

1. Sign in at [nrp.ai](https://nrp.ai) first, so the request is tied to your account.
2. Fill out the **namespace request form**, linked from the NRP [Getting access](https://nrp.ai/documentation/userdocs/start/getting-started/) page. It asks for your name, institution, current affiliation and a name for your group.
3. Pick a clear, descriptive name: **lowercase letters, numbers and dashes only**. The NRP asks people to avoid generic names such as `testing-group` or `llm-access`. Something like `ucr-smithlab-ecology` tells everyone (including the NRP admins) whose work it is.
4. Once approved, open the [Namespaces page](https://nrp.ai/namespaces) to create namespaces and add members. Members must have signed in once before you can add them.

Questions about the form can go to the Nautilus Support chat (Section 5).

### Planning your namespaces: a few patterns

An admin can create several namespaces, and the namespace is the unit of membership: members share edit access to everything in it. A little planning saves cleanup later.

* **A small lab.** One namespace for the group's research is usually enough. Add each student and postdoc as a member.
* **A lab with separate projects.** One namespace per project keeps storage, jobs and members apart, so a rotation student on one project cannot delete another project's volumes.
* **A multi-campus collaboration.** Create a namespace for the collaboration and add partners after they sign in with their own institution. Each person keeps their own NRP account; the namespace is the shared space.
* **A class or workshop.** Make a separate namespace for the training, so attendees do not see your research work, and use a **training join link** instead of adding people one by one. [KB030](../kb030-nautilus-teaching-and-workshops/) covers this.
* **A public web tool.** Consider a namespace just for the service, so its lifetime and members are separate from day-to-day research. See [KB029](../kb029-nautilus-hosting-web-tools/).

### Checking that you are in

Sign in at [nrp.ai/namespaces](https://nrp.ai/namespaces). The namespaces you are a member of are shown in **bold**.

Membership changes take a moment to reach the cluster. The portal refreshes group information about once a minute, and in our tests a new member could use the namespace within about a minute. If you use `kubectl`, see Section 8 for refreshing your token.

---

## 5. Step 3: Join the Nautilus Support chat

The NRP expects every user to join **Nautilus Support**, its chat on Matrix. That is where the NRP team answers questions, announces maintenance and outages, and handles requests such as Coder approval or exceptions for long-running services. Registration instructions are linked from the NRP [Getting access](https://nrp.ai/documentation/userdocs/start/getting-started/) page.

When you ask for help there, include your namespace and pod name, or a short example that reproduces the problem. The NRP's [support guidelines](https://nrp.ai/documentation/userdocs/start/support/) show what a good question looks like.

---

## 6. Step 4: Install kubectl and the kubelogin plugin

Skip this section if you only plan to use JupyterHub or Coder in the browser. You need it for batch jobs, GPU jobs, storage volumes and web services.

Two programs are needed, and **both** must be installed or the NRP config file will not work:

1. **`kubectl`**, the Kubernetes command-line tool. Install it with the official instructions for your system: [kubernetes.io/docs/tasks/tools](https://kubernetes.io/docs/tasks/tools/).
2. **kubelogin**, a plugin that signs you in through CILogon. `kubectl` looks for it under the name `kubectl-oidc_login`.

### Linux or macOS

This is the NRP's install script. It needs `curl`, `jq` and `unzip`. On macOS, set `OS_NAME="darwin"` and set `OS_ARCHITECTURE` to `arm64` (Apple silicon) or `amd64` (Intel) by hand, because `dpkg` does not exist there.

```bash
# amd64 or arm64; dpkg works on Debian/Ubuntu. On macOS or RHEL, set it by hand.
OS_ARCHITECTURE="$(dpkg --print-architecture)"
# Use "darwin" on macOS
OS_NAME="linux"

KUBELOGIN_VERSION="$(curl -fsSL "https://api.github.com/repos/int128/kubelogin/releases/latest" | jq -r '.tag_name')"
curl -o kubelogin.zip -fSL "https://github.com/int128/kubelogin/releases/download/${KUBELOGIN_VERSION}/kubelogin_${OS_NAME}_${OS_ARCHITECTURE}.zip"
unzip kubelogin.zip kubelogin
chmod +x ./kubelogin
sudo mv ./kubelogin /usr/local/bin/kubectl-oidc_login
rm -f kubelogin.zip
```

No `sudo` (for example on a shared server)? Replace the `sudo mv` line with these, which put the plugin in your own directory:

```bash
mkdir -p ~/.local/bin
mv ./kubelogin ~/.local/bin/kubectl-oidc_login
export PATH="$HOME/.local/bin:$PATH"   # add this line to ~/.bashrc or ~/.zshrc too
```

The kubelogin project also lists package-manager options (Homebrew, krew, Chocolatey) in its [README](https://github.com/int128/kubelogin).

### Windows

Download the Windows zip for your architecture from the [kubelogin releases page](https://github.com/int128/kubelogin/releases), unzip it, rename `kubelogin.exe` to `kubectl-oidc_login.exe`, and put it in a folder on your `PATH`, next to `kubectl.exe`. If you plan to use VS Code, the NRP notes that copying both `.exe` files into the VS Code `bin` folder (for example `%LOCALAPPDATA%\Programs\Microsoft VS Code\bin`) is an easy way to get them on the `PATH`.

On Windows you can also work inside **WSL** (Windows Subsystem for Linux) and follow the Linux steps. See Section 10 if the browser does not open from WSL.

### Check both programs

```bash
kubectl version --client
kubectl oidc-login --help | head -5
```

If the second command says the plugin is unknown, `kubectl-oidc_login` is not on your `PATH`.

---

## 7. Step 5: Get the config file and sign in

### Download the NRP config

The config file tells `kubectl` where the cluster is and how to sign you in. Save it as `~/.kube/config` (no file extension):

```bash
mkdir -p ~/.kube
curl -o ~/.kube/config -fSL "https://nrp.ai/config"
```

You can also download it in a browser from [nrp.ai/config](https://nrp.ai/config). On Windows it goes in `%USERPROFILE%\.kube\config`.

**Already use other Kubernetes clusters?** The command above overwrites your existing `~/.kube/config`. Back that file up first, or save the NRP file under another name and merge them. If you have several clusters, select Nautilus with:

```bash
kubectl config get-contexts
kubectl config use-context nautilus
```

### First sign-in

Run any `kubectl` command. The first one opens a browser window at CILogon. Choose University of California, Riverside, sign in, and the window tells you that you can close it.

```bash
kubectl get nodes
```

Then confirm who the cluster thinks you are, and that you can work in your namespace. Replace `ucr-example` with your namespace name:

```bash
kubectl auth whoami
kubectl get pods -n ucr-example
kubectl auth can-i create pods -n ucr-example
```

* `kubectl auth whoami` lists your groups. Each namespace you belong to appears as `oidcgroup:<namespace>:...`. If your namespace is missing, the admin has not added you yet, or your token is older than the change (Section 8).
* `No resources found in ucr-example namespace.` is **success**: you have access, there is simply nothing running yet.
* `can-i create pods` should answer `yes`.

### Set your default namespace

So you do not have to type `-n` every time:

```bash
kubectl config set contexts.nautilus.namespace ucr-example
```

Later examples in this series leave out `-n` and assume you have done this.

---

## 8. Membership changes and token refresh

`kubectl` signs in with a token that lasts **half an hour** and renews itself after that. Your group memberships are read when the token is issued. So if you were just added to a namespace (or removed from one), `kubectl` may not notice until the token renews.

To pick up a change right away, clear the cached token. The next command signs you in again:

```bash
kubectl oidc-login clean
kubectl auth whoami
```

---

## 9. What is my namespace allowed to use?

Every namespace has quotas and defaults. Look before you plan a big run:

```bash
kubectl get resourcequota
kubectl describe limitrange
```

What we saw in a UCR namespace on 2026-10-06:

* **Special GPUs start at zero.** The quotas for NVIDIA **A100, H100, H200 and GH200** were all 0. A100 access can be requested with the A100 access request form (linked from the [GPU pods page](https://nrp.ai/documentation/userdocs/running/gpu-pods/)); H100, H200 and GH200 are not open to requests. A pod can set `priorityClassName: opportunistic` to bypass the GPU quota, but such a pod **can be preempted at any time**. Regular GPUs (the `nvidia.com/gpu` resource) are not under these quotas. [KB026](../kb026-nautilus-batch-jobs-and-gpus/) explains GPU choices.
* **Scratch disk defaults to 50Gi per container.** The default limit on `ephemeral-storage` (the container's local scratch disk) was 50Gi. Pods that write more than that can be evicted unless they request more.
* **Defaults if you leave out requests.** In the namespace we tested, a container with no requests got 100m CPU (a tenth of a core) and 1Gi of memory. That is too small for most real work, so always set requests in your specs. Your namespace's defaults may differ; `kubectl describe limitrange` shows them.

The NRP portal also has a **Violations** page that lists pods using far less (or more) than they requested. Check it now and then; the [Cluster Policies](https://nrp.ai/documentation/userdocs/start/policies/) explain the limits.

---

## 10. Troubleshooting sign-in and access

| Symptom | Likely cause | What to do |
| :--- | :--- | :--- |
| I signed in at nrp.ai but cannot start anything | You have an account but no namespace | Ask your PI to add you, or request a group (Section 4) |
| `kubectl` says `unknown command "oidc-login"` | kubelogin is missing or not on `PATH` | Repeat Section 6; the file must be named `kubectl-oidc_login` |
| `Forbidden` errors in a namespace you just joined | Your token predates the change | `kubectl oidc-login clean`, then try again |
| `Forbidden` in a namespace you are not in | Wrong namespace name or default | Check `kubectl config get-contexts` and spelling |
| The browser never opens (SSH session, remote server, container) | No local browser | Use the device-code flow (below) |
| From WSL, the browser does not open or opens wrongly | WSL cannot find a browser | Point kubelogin at Windows Chrome (below) |
| `address already in use` on port 8000 | Something else uses that port | Change `--listen-address` (below) |
| ORCID sign-in fails | ORCID email not visible | Make your ORCID email visible to everyone, or sign in with UCR |
| VS Code Kubernetes extension cannot connect | Config not in the default place, or tools not on `PATH` | Keep the config at `~/.kube/config`; put `kubectl` and `kubectl-oidc_login` on `PATH` |

### Fixing kubelogin options

kubelogin's options live in the `args:` list near the bottom of `~/.kube/config`, under `users:`, then `oidc`. Open the file in a text editor and change that list. These fixes come from the NRP [Getting access](https://nrp.ai/documentation/userdocs/start/getting-started/) page.

**No browser on this machine** (for example, you are logged in to a remote server over SSH). Add these two lines to the end of the `args:` list. `kubectl` then prints a URL and a code; open the URL on any device, sign in, and the command continues:

```yaml
      - --grant-type=device-code
      - --skip-open-browser
```

**WSL cannot open a browser.** Add a line that points to Windows Chrome:

```yaml
      - --browser-command=/mnt/c/Program Files/Google/Chrome/Application/chrome.exe
```

**Port 8000 is taken.** The NRP config already contains a `--listen-address=0.0.0.0:8000` line. Change the port to any unused one:

```yaml
      - --listen-address=0.0.0.0:18000
```

**Prefer the system keyring to a token file on disk.** Add:

```yaml
      - --token-cache-storage=keyring
```

Keep the indentation the same as the other lines in the list; YAML is strict about spaces.

---

## 11. Optional: graphical tools

If you would rather not live in the terminal, these tools use the same `~/.kube/config` and sign-in:

* **[K9s](https://k9scli.io/)**: a full-screen terminal interface for browsing pods, logs and events.
* **[Lens](https://k8slens.dev/)**: a desktop application.
* **Visual Studio Code** with the Kubernetes and Remote Development extensions. After you set your namespace in the Kubernetes panel, you can right-click a pod or Deployment and attach VS Code to it. The NRP notes that this only works when the config is at the default location and `kubectl` and `kubectl-oidc_login` are on your `PATH`; the extension's own offer to install `kubectl` does not work for Nautilus.

---

## 12. For namespace admins: keeping things tidy

As admin you answer for your namespace, so a few habits help:

* **Review the member list each term.** Remove students and visitors who have left. The NRP asks admins to keep the list current.
* **Read the policies with your group.** A student who runs a Job that only sleeps, or leaves GPUs idle, puts the whole namespace at risk. The [Cluster Policies](https://nrp.ai/documentation/userdocs/start/policies/) are short.
* **Clean up storage.** Volumes not accessed for 6 months can be purged without notice, and Nautilus is not archival storage. Keep a copy of anything that matters elsewhere. [KB027](../kb027-nautilus-storage-and-data/) covers storage.
* **Never put passwords or keys in specs.** Job specs are visible to other cluster users. Use Kubernetes Secrets instead.
* **Acknowledge the NRP in papers.** The [NRP FAQ](https://nrp.ai/documentation/userdocs/start/faq/) gives the grant acknowledgment format and a paper to cite.

---

## Getting help

* **NRP documentation:** [nrp.ai/documentation](https://nrp.ai/documentation/), starting with [Getting access](https://nrp.ai/documentation/userdocs/start/getting-started/) and [Cluster Policies](https://nrp.ai/documentation/userdocs/start/policies/).
* **NRP support:** the Nautilus Support chat on Matrix (Section 5), or the [NRP contact page](https://nrp.ai/contact). The NRP team runs the cluster and handles account, namespace and quota requests.
* **UCR Research Computing:** research-computing@ucr.edu or the [Get help](../../help/) page. We can help you decide whether Nautilus fits your project, plan namespaces for a group, or get `kubectl` working. We do not run the NRP and cannot change NRP quotas or approvals.

## Related guides

* [KB023: Researcher guide to NRP Nautilus](../kb023-nautilus-researcher-guide/)
* KB024: Getting access to Nautilus (this article)
* [KB025: Notebooks, desktops and VS Code in the browser (JupyterHub, Coder)](../kb025-nautilus-jupyter-and-coder/)
* [KB026: Running batch jobs and GPU work with Kubernetes](../kb026-nautilus-batch-jobs-and-gpus/)
* [KB027: Storage and moving data on Nautilus](../kb027-nautilus-storage-and-data/)
* [KB028: Using the NRP's hosted large language models](../kb028-nautilus-llm-api/)
* [KB029: Hosting a lab web tool or service on Nautilus](../kb029-nautilus-hosting-web-tools/)
* [KB030: Teaching a class or workshop on Nautilus](../kb030-nautilus-teaching-and-workshops/)
* [NRP Nautilus service page](../../services/nautilus/)
