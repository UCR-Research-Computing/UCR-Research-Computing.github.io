---
title: "Hosting a lab web tool or service on Nautilus"
kb_id: KB029
topic: National
audience: "UCR labs, research software developers and students who want to put a dashboard, app, API or project site for public, non-sensitive research on the web"
reviewed: 2026-10-06
owner: Research Computing
series: nautilus
series_order: 7
review_notes:
  - "Written 2026-10-06 from the NRP documentation (nrp.ai/documentation, fetched 2026-10-06) and tests run in a UCR namespace the same day."
  - "Tested 2026-10-06 (earlier in the day, by the series authors): a Deployment, Service and Ingress (ingressClassName haproxy, host under nrp-nautilus.io, tls hosts listed) served a public HTTPS page a couple of minutes after the YAML was applied. CephFS (rook-cephfs-central, ReadWriteMany) and block (rook-ceph-block-central, ReadWriteOnce) volumes were also tested; the block class was slow in that test and ceph-rbd never provisioned."
  - "No new public endpoints were created while writing this article; the Shiny, Streamlit, Postgres, cert-manager and GitLab CI examples follow the NRP pages and upstream image documentation but were not run."
  - "CHECK: the resource advice in section 5 (requests equal to limits at 1 CPU and 2Gi, to fall under the usage-violation exemption) is our reading of Cluster Policies. The NRP Long Idle Pods page shows minimal requests with wider limits, which conflicts with the 20% rule; confirm with the NRP which applies to web Deployments."
  - "CHECK: Shiny and Streamlit use WebSockets; it was not tested whether the haproxy Ingress passes them without extra annotations."
  - "CHECK: the NRP docs describe CILogon sign-in only for JupyterHub and Coder deployments; section 9's advice on putting a sign-in in front of other apps is general, not an NRP-documented feature."
  - "CHECK: the Ingress to Gateway API migration (section 6) was in progress on 2026-10-06; re-read the NRP Ingress and Gateway API pages at each review."
---

## 1. What this guide covers

Nautilus can run more than batch jobs. A lab can run a long-lived web application in its namespace and give it a public HTTPS address under `nrp-nautilus.io`, or under its own domain. Typical examples:

* A **Shiny** or **Streamlit** dashboard that lets collaborators explore a public dataset.
* A small **REST API** (FastAPI, Flask, Plumber) that serves model predictions or lookups.
* A **project or data portal** for a public dataset, with a database behind it.
* A **demo of a model**, or a chat assistant over your public documents that calls the [NRP's hosted LLMs](../kb028-nautilus-llm-api/).
* Your own **JupyterHub** or **Coder** for a group, with your own images and settings.

In our test in a UCR namespace on 2026-10-06, a simple page was live on a public HTTPS address a couple of minutes after the YAML was applied. Getting something online is quick. Keeping it running, secure and within NRP policy is the part this guide spends most time on.

UCR does not recharge for NRP use. You need an NRP account, a namespace and working `kubectl` first; [KB024](../kb024-nautilus-getting-access/) covers all three.

---

## 2. Is Nautilus the right home for your tool?

### Read these first

1. **Non-sensitive data only.** The NRP has no storage suitable for HIPAA, PII, FISMA, FERPA or other protected data ([Cluster Policies](https://nrp.ai/documentation/userdocs/start/policies/)). A web tool on Nautilus must not store, display or collect P2 or higher data, and that includes what visitors type into it. No sign-up forms collecting personal details, no survey instruments, no uploads of participant data. For P2 and higher work, see the [HPCC](../../services/hpcc/), [Ursa Major](../../services/ursa-major/) or the [Secure Enclave](../../services/secure-enclave/).
2. **Non-profit, non-commercial.** The NRP and everything run on it must be non-profit and non-commercial under its Acceptable Use Policy. No paid services, advertising or commercial products.
3. **Deployments are deleted after 2 weeks** unless your namespace is on the NRP's exceptions list for permanent services (Section 10). Plan for this from day one.
4. **No reserved capacity.** Nautilus is a shared research cluster. Nodes are rebooted and pods move. The NRP does not offer, and Research Computing cannot offer, uptime commitments for tools you host there.

### A good fit

* Tools for a research audience: collaborators, a field, workshop participants, readers of a paper.
* Dashboards and demos over public or published data.
* Services that sit next to work you already run on Nautilus (data on Nautilus storage, models trained there, the hosted LLM API).
* Prototypes and time-limited sites (a conference, a course, a review period).

### Not a fit

* Anything with protected data, or that collects personal information from visitors.
* A UCR department or administrative website. Campus web hosting goes through ITS and your unit's web team.
* A service people depend on for clinical, safety or business decisions.
* Non-HTTP services exposed on arbitrary TCP ports. The NRP generally does not allow this; ask in Nautilus Support if you need it ([Exposing HTTP](https://nrp.ai/documentation/userdocs/running/ingress/)).
* Long-lived archives. Nautilus storage is not archival (Section 8).

If you need a VM you fully control with its own public IP, NSF ACCESS Jetstream2 ([KB009](../kb009-using-nsf-access/)) or a recharged Google Cloud project through Ursa Major ([KB005](../kb005-ursa-major-service-tiers/)) may suit you better. Research Computing can help you choose.

### Before you build: is it already hosted?

The NRP runs several services you can use without deploying anything ([Deployed Services](https://nrp.ai/documentation/userdocs/start/resources/)), including GitLab (code and container registry), Overleaf, EtherPad, Nextcloud (file sharing), Jitsi (video), Draw.io, Yopass (one-time secret sharing), JupyterHub and Coder. Most require their own registration. If one of these does the job, use it.

---

## 3. The four pieces of a hosted tool

Every web tool on Nautilus is built from the same parts:

| Piece | What it is | Analogy |
| :--- | :--- | :--- |
| **Container image** | Your app and everything it needs, packaged | The installed program |
| **Deployment** | Tells Kubernetes to keep N copies of the image running, and replace them if they fail | A caretaker that restarts the program |
| **Service** | A stable internal name and port for those copies, inside the cluster | An internal phone extension |
| **Ingress** | Connects a public HTTPS host name to the Service | The street address and front door |

Pods are not reachable from outside the cluster on their own; the Ingress is what exposes the HTTP service ([Exposing HTTP](https://nrp.ai/documentation/userdocs/running/ingress/)). Optional extras are a **Secret** (passwords and keys), a **PersistentVolumeClaim** (files that outlive the pod) and a **database**.

---

## 4. Step 1: Get a container image

### Option A: use an existing public image

Many tools already publish images. The examples in Section 7 use public images (`nginxdemos/hello`, `rocker/shiny`).

### Option B: build your own in NRP GitLab

The NRP runs GitLab at [gitlab.nrp-nautilus.io](https://gitlab.nrp-nautilus.io) with a container registry and CI runners already configured. Keeping images there avoids slow downloads from Docker Hub ([Building in GitLab](https://nrp.ai/documentation/userdocs/development/gitlab/)).

1. Register at gitlab.nrp-nautilus.io and create a project.
2. Add your code and a `Dockerfile`. For a Streamlit app:

```dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8501
CMD ["streamlit", "run", "app.py", "--server.port=8501", "--server.address=0.0.0.0"]
```

3. Add a `.gitlab-ci.yml` that builds and pushes the image. This is the Kaniko template from the NRP GitLab page:

```yaml
image: ghcr.io/osscontainertools/kaniko:debug

stages:
  - build-and-push

build-and-push-job:
  stage: build-and-push
  variables:
    GODEBUG: 'http2client=0'
  script:
    - echo "{\"auths\":{\"$CI_REGISTRY\":{\"username\":\"$CI_REGISTRY_USER\",\"password\":\"$CI_REGISTRY_PASSWORD\"}}}" > /kaniko/.docker/config.json
    - /kaniko/executor --cache=true --push-retry=10 --context $CI_PROJECT_DIR --dockerfile $CI_PROJECT_DIR/Dockerfile --destination $CI_REGISTRY_IMAGE:$CI_COMMIT_SHORT_SHA --destination $CI_REGISTRY_IMAGE:latest
```

4. Each push builds `gitlab-registry.nrp-nautilus.io/<your-group>/<your-project>:<tag>`. Use that as the image in your Deployment.

**Use a specific tag** (the commit SHA) in your Deployment rather than `latest`, so you know exactly which version is running and can roll back.

### Private images

If the GitLab project is private, create a deploy token with the `read_registry` scope (Settings, then Repository, then Deploy Tokens), then store it in your namespace as a pull secret ([Private Repos](https://nrp.ai/documentation/userdocs/development/private-repos/)):

```bash
kubectl create secret docker-registry regcred -n <your-namespace> \
  --docker-server=gitlab-registry.nrp-nautilus.io \
  --docker-username=<deploy-token-username> \
  --docker-password=<deploy-token>
```

and add `imagePullSecrets: [{name: regcred}]` to the pod spec in your Deployment.

Nautilus includes some ARM64 nodes. If your pod fails there with an "exec format error", either build a multi-architecture image (the GitLab page shows how) or keep the pod on amd64 nodes.

---

## 5. Step 2: The Deployment

Save as `app.yaml` (all four objects can live in one file, separated by `---`). Replace `my-tool` with a name for your app and the image with yours.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-tool
  labels:
    app: my-tool
spec:
  replicas: 1
  selector:
    matchLabels:
      app: my-tool
  template:
    metadata:
      labels:
        app: my-tool
    spec:
      containers:
        - name: web
          image: gitlab-registry.nrp-nautilus.io/<your-group>/<your-project>:<tag>
          ports:
            - containerPort: 8501
          resources:
            requests:
              cpu: "1"
              memory: 2Gi
            limits:
              cpu: "1"
              memory: 2Gi
          readinessProbe:
            httpGet:
              path: /
              port: 8501
            initialDelaySeconds: 5
            periodSeconds: 10
```

### Choosing resources

Web tools sit mostly idle between visitors, which runs into the NRP's usage rules ([Cluster Policies](https://nrp.ai/documentation/userdocs/start/policies/)):

* Limits must be within 20% of requests.
* A user cannot run more than 4 pods whose actual use falls outside CPU 20-200% or RAM 20-150% of what they requested. **Pods requesting 1 CPU core and 2 GB of memory are exempt** from this check.

For a small app, requesting and limiting at 1 CPU and 2Gi (as above) is the simplest way to stay clear of violations. If your app needs more memory, size it from what it really uses (the NRP's [Grafana dashboards](https://nrp.ai/documentation/userdocs/running/monitoring/) show this) and check the Violations page on the NRP portal after it has run for a day.

Other notes:

* **No GPUs for idle services.** Deployments that sit idle cannot request GPUs. A GPU you request is held for you alone, and the NRP expects GPU use above 40%. For an LLM-backed tool, call the [hosted LLM API](../kb028-nautilus-llm-api/) rather than running a model on a GPU you keep reserved.
* **Ephemeral storage** (files written inside the container) had a default limit of 50Gi per container in the UCR namespace we tested. Anything you need to keep belongs on a volume (Section 8).
* **Never put passwords or keys in the YAML.** Specs are visible to other cluster users. Use Secrets (Section 9).

---

## 6. Step 3: The Service and the Ingress

### Service

Add to `app.yaml`. The `selector` must match the pod labels, and `targetPort` must match the port the container listens on.

```yaml
---
apiVersion: v1
kind: Service
metadata:
  name: my-tool
spec:
  type: ClusterIP
  selector:
    app: my-tool
  ports:
    - port: 8080
      targetPort: 8501
      protocol: TCP
```

Before making anything public, test it privately with a tunnel from your own computer:

```bash
kubectl apply -n <your-namespace> -f app.yaml
kubectl port-forward -n <your-namespace> service/my-tool 8080:8080
# then open http://localhost:8080 in your browser
```

Many labs stop here: a port-forward is enough for a tool only you and a few colleagues with namespace access use, and nothing is exposed to the internet.

### Ingress (public HTTPS)

Pick a host name under `nrp-nautilus.io` that nobody else is using and that says what the tool is (for example `citrus-leaf-atlas.nrp-nautilus.io`, not `test.nrp-nautilus.io`). Add to `app.yaml`:

```yaml
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: my-tool
spec:
  ingressClassName: haproxy
  rules:
    - host: my-tool-ucr-example.nrp-nautilus.io
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: my-tool
                port:
                  number: 8080
  tls:
    - hosts:
        - my-tool-ucr-example.nrp-nautilus.io
```

Apply it again and check:

```bash
kubectl apply -n <your-namespace> -f app.yaml
kubectl get ingress -n <your-namespace>
curl -I https://my-tool-ucr-example.nrp-nautilus.io
```

Listing the host under `tls` gives you HTTPS on the `nrp-nautilus.io` name. In our test the page answered over HTTPS within a couple of minutes.

Notes from the NRP [Exposing HTTP](https://nrp.ai/documentation/userdocs/running/ingress/) page:

* Extra settings use HAProxy Ingress annotations with the prefix `haproxy-ingress.github.io` or `ingress.kubernetes.io`. **Do not use `haproxy.org` annotations.**
* The NRP is migrating from Ingress to the Kubernetes **Gateway API** (HTTPRoute). During the migration, HTTPRoute services are exposed on ports 50080 and 50443, and Ingress remains the documented route for normal HTTPS on port 443 ([Gateway API](https://nrp.ai/documentation/userdocs/running/gateway/)). The Gateway API page also covers **gRPC** services (GRPCRoute, port 50051).

### Using your own domain name

You can serve the tool at a domain you control (for example a project domain). The NRP page covers two ways to get a certificate:

1. **Let's Encrypt through cert-manager** (renews automatically). Create an Issuer and a Certificate in your namespace:

```yaml
apiVersion: cert-manager.io/v1
kind: Issuer
metadata:
  name: letsencrypt
spec:
  acme:
    email: <your-ucr-email>
    preferredChain: ''
    privateKeySecretRef:
      name: issuer-account-key
    server: https://acme-v02.api.letsencrypt.org/directory
    solvers:
      - http01:
          ingress:
            class: haproxy
            ingressTemplate:
              metadata:
                annotations:
                  ingress.kubernetes.io/ssl-redirect: 'false'
            serviceType: ClusterIP
---
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: my-domain-cert
spec:
  commonName: www.example-project.org
  dnsNames:
    - www.example-project.org
  issuerRef:
    kind: Issuer
    name: letsencrypt
  secretName: my-domain-tls
```

2. **A certificate you already have**, stored as a `kubernetes.io/tls` Secret.

Either way, add your domain as a `host` in the Ingress, add `secretName: my-domain-tls` under its `tls` entry, and create a **CNAME** DNS record for your domain pointing to `nrp-nautilus.io` (geo-balanced) or `east.nrp-nautilus.io`. Check the certificate with `kubectl get certificate -o wide`. A `ucr.edu` subdomain is managed by UCR ITS, so ask ITS about DNS and campus web policy before pointing one at Nautilus.

---

## 7. Worked examples

### 7.1 Hello world (the NRP's own test image)

The fastest end-to-end check. Use the YAML from Sections 5 and 6 with these changes: image `nginxdemos/hello:plain-text`, container port `80`, readiness probe port `80`, Service `targetPort: 80`. The page prints the server name and address, so you can see which pod answered.

### 7.2 A Shiny app (R)

*Scenario: a soil scientist wants collaborators to explore public plot-level data with sliders and maps.*

The [`rocker/shiny`](https://rocker-project.org/images/versioned/shiny.html) image runs Shiny Server on port 3838 and serves apps from `/srv/shiny-server`. Build your own image on top of it:

```dockerfile
FROM rocker/shiny:4.4
RUN install2.r --error leaflet dplyr
COPY app/ /srv/shiny-server/soil-explorer/
```

Then use container port `3838` (and probe port `3838`) in the Deployment, and `targetPort: 3838` in the Service. The app appears at `https://<your-host>/soil-explorer/`.

### 7.3 A Streamlit dashboard (Python)

Use the Dockerfile in Section 4 and the YAML in Sections 5 and 6 exactly as written (port 8501).

### 7.4 An API that calls the hosted LLMs

*Scenario: a digital humanities lab wants a small search page over its public, digitized collection, using NRP embeddings.*

* Store the LLM token as a Secret and read it into the container as an environment variable:

```bash
read -s -p "NRP LLM token: " TOKEN
kubectl create secret generic nrp-llm -n <your-namespace> --from-literal=token="$TOKEN"
unset TOKEN
```

```yaml
          env:
            - name: OPENAI_BASE_URL
              value: https://ellm.nrp-nautilus.io/v1
            - name: OPENAI_API_KEY
              valueFrom:
                secretKeyRef:
                  name: nrp-llm
                  key: token
```

* **Mind whose token it is.** An LLM token is personal. If you put a public page in front of it, every visitor's request counts against your fair-use limits and is your responsibility. Limit how often the page can call the model, cache answers where you can, and consider requiring sign-in. The limits are in [KB028](../kb028-nautilus-llm-api/).
* Precompute embeddings for the collection in a batch Job ([KB026](../kb026-nautilus-batch-jobs-and-gpus/)), so the web app only embeds the visitor's query.

### 7.5 Your own JupyterHub or Coder

For a group or class that needs its own images and settings, the NRP documents deploying **JupyterHub** with Helm ([Deploy JupyterHub](https://nrp.ai/documentation/userdocs/jupyter/jupyterhub/)) and **Coder** ([Deploying Coder](https://nrp.ai/documentation/userdocs/coder/deploy/)). Key rules from those pages:

* You must be the namespace admin.
* JupyterHub sign-in goes through a CILogon application you register, and you must restrict who can sign in (`allowed_idps` or `allowed_users`). An open hub can get the namespace locked.
* Every JupyterHub **must** cull idle servers after 6 hours or less.
* Coder needs exceptions from the NRP for the wildcard ingress rule and for the 2-week runtime.
* The NRP recommends adding its admins as hub admins so they can help debug.

Before running your own, check whether the NRP-hosted [JupyterHub and Coder](../kb025-nautilus-jupyter-and-coder/) already meet your needs.

---

## 8. Keeping data: volumes and databases

A container's own disk is wiped when the pod is replaced. Keep anything that matters on a volume, a database or object storage. [KB027](../kb027-nautilus-storage-and-data/) covers storage in depth.

### A persistent volume

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: my-tool-data
spec:
  storageClassName: rook-cephfs-central
  accessModes:
    - ReadWriteMany
  resources:
    requests:
      storage: 10Gi
```

Mount it in the Deployment with a `volumes` entry (`persistentVolumeClaim: {claimName: my-tool-data}`) and a matching `volumeMounts` entry in the container. In our tests, `rook-cephfs-central` (shared, ReadWriteMany) worked well and could be mounted by several pods at once, which suits apps with more than one replica. The block class `rook-ceph-block-central` (one pod at a time) worked but was slow in one test; the class `ceph-rbd` never provisioned, so do not use it.

Do not install conda or pip packages onto CephFS volumes; the NRP prohibits it ([Ceph FS / RBD](https://nrp.ai/documentation/userdocs/storage/ceph/)). Put software in the image.

### A database

The NRP runs a **PostgreSQL operator** (Zalando), so you can create a Postgres cluster in your namespace from a short YAML file, with credentials generated into Secrets for you ([Postgres Cluster](https://nrp.ai/documentation/userdocs/running/postgres/)). For append-heavy analytics there is an experimental ClickHouse operator. For a small read-only dataset, a SQLite file on a volume or Parquet files in object storage are often enough.

### Object storage

Large static files (images, downloads, tiles) can live in NRP S3 storage and be read by your app ([Ceph S3](https://nrp.ai/documentation/userdocs/storage/ceph-s3/)). Inside the cluster, use the internal endpoints, which are faster.

### Backups are your job

* Volumes not accessed for 6 months can be purged without notice, and Nautilus is not archival storage ([Cluster Policies](https://nrp.ai/documentation/userdocs/start/policies/)).
* Keep your code in Git, your image in a registry, and a copy of your data and database dumps somewhere outside Nautilus. If the namespace disappeared tomorrow, you should be able to redeploy from Git and a backup.

---

## 9. Security and access control

An Ingress makes your tool reachable by **anyone on the internet**, including automated scanners. Plan for that:

* **Secrets, not specs.** Database passwords, API tokens and keys go in Kubernetes Secrets, referenced with `secretKeyRef`. The NRP also lists a **Sealed Secrets** operator, which lets you keep encrypted secrets in Git ([Deployed Services](https://nrp.ai/documentation/userdocs/start/resources/)).
* **Decide who should get in.** Shiny Server, Streamlit and most simple frameworks have no sign-in by default. If the tool is not meant for the public, add authentication in the app or in front of it, or keep it private and use `kubectl port-forward` (Section 6). For JupyterHub and Coder, the NRP pages show CILogon sign-in, which lets people log in with their university accounts.
* **Keep images current.** Rebuild regularly to pick up security fixes in the base image and libraries.
* **Run only what you need.** Remove test Deployments, old Ingresses and unused host names.
* **No protected data**, ever, including what visitors submit (Section 2).
* **Non-HTTP ports.** The NRP's network permits inbound traffic on ports 443 and 22 by default; other ports need an exception. Dedicated public IP addresses (LoadBalancer services) exist, but you should check with the NRP admins before reserving one ([LoadBalancer VIPs](https://nrp.ai/documentation/userdocs/networks/loadbalancer-vips/)).

The namespace admin answers for everything running in the namespace. Tell your admin before you put anything public online.

---

## 10. The 2-week rule and running longer

From the NRP [Cluster Policies](https://nrp.ai/documentation/userdocs/start/policies/) and [Long Idle Pods](https://nrp.ai/documentation/userdocs/running/long-idle/) pages:

* A periodic process **deletes Deployments older than 2 weeks**, unless the namespace is on the exceptions list and runs a permanent service.
* You get **3 notifications** before the workload is deleted. **Data in persistent volumes remains**, so redeploying from your YAML brings the tool back.
* To run a service beyond 2 weeks, **ask in Nautilus Support for an exception**. Include an estimated period the service will run and a short description of what it does.
* **Long idle pods** (for example, a shell kept alive for occasional use) cannot be added to the exceptions list.
* Never run a web tool as a Job, or as a bare pod. Bare pods are treated as interactive and destroyed after 6 hours, and a Job is the wrong controller for a service.

Practical patterns:

* **Short-lived sites** (a workshop, a review period): deploy, run under 2 weeks, delete.
* **Turn it off between uses:** `kubectl scale deployment my-tool --replicas=0` stops the pod but keeps the definition; `--replicas=1` starts it again.
* **Long-running tools:** request the exception when you deploy, not when the deletion notice arrives.

---

## 11. Updating, monitoring and automating

### Everyday commands

```bash
# Roll out a new image version
kubectl set image -n <your-namespace> deployment/my-tool web=gitlab-registry.nrp-nautilus.io/<your-group>/<your-project>:<new-tag>
kubectl rollout status -n <your-namespace> deployment/my-tool

# Go back to the previous version
kubectl rollout undo -n <your-namespace> deployment/my-tool

# Look at what is happening
kubectl get pods -n <your-namespace> -l app=my-tool
kubectl logs -n <your-namespace> deployment/my-tool
kubectl describe pod -n <your-namespace> <pod-name>
```

### Monitoring

* The NRP's [Grafana](https://nrp.ai/documentation/userdocs/running/monitoring/) namespace dashboard shows CPU and memory use against what you requested. Use it to right-size the Deployment.
* The NRP lists **Plausible Analytics** (privacy-first web analytics) and lets users create Prometheus ServiceMonitors ([Deployed Services](https://nrp.ai/documentation/userdocs/start/resources/)).
* Check the Violations page on the NRP portal now and then.

### Deploy automatically from GitLab

You can connect a GitLab project to your namespace so CI builds the image and updates the Deployment on every push ([K8s GitLab Integration](https://nrp.ai/documentation/userdocs/development/k8s-integration/)). This uses a service account with admin rights in the namespace: treat its token like a password and keep it in GitLab's protected CI variables, never in the repository.

### Clean up

```bash
kubectl delete -n <your-namespace> -f app.yaml
```

Delete the PersistentVolumeClaim separately once you have a copy of its data.

---

## 12. Troubleshooting

| Symptom | Likely cause and fix |
| :--- | :--- |
| Pod stuck in `Pending` | Resources not available or over quota. `kubectl describe pod` shows why. Lower requests or check the namespace quota ([KB024](../kb024-nautilus-getting-access/)). |
| `ImagePullBackOff` | Wrong image name or tag, or a private image without a pull secret (Section 4). |
| `CrashLoopBackOff` | The app exits on start. Read `kubectl logs`. Often a missing environment variable or Secret. |
| `OOMKilled` | The app used more memory than its limit. Raise requests and limits together. |
| port-forward works, public URL gives 503 | Service `selector` does not match pod labels, `targetPort` is wrong, or the readiness probe is failing. |
| Public URL does not resolve or shows another site | Host name typo, or the name is already used by someone else. Choose a unique host. |
| Shiny or Streamlit page loads but then disconnects | WebSocket traffic problem. Ask in Nautilus Support with your namespace and Ingress name. |
| Deployment vanished after 2 weeks | The 2-week purge (Section 10). Redeploy from YAML and request an exception. |
| Own domain shows a certificate error | Check `kubectl get certificate -o wide`, then `kubectl describe certificate` and `kubectl describe order`. Confirm the CNAME record. |

When you ask the NRP for help, include your namespace, the Deployment or pod name, and the host name ([support guidelines](https://nrp.ai/documentation/userdocs/start/support/)).

---

## Getting help

* **NRP documentation:** [Exposing HTTP](https://nrp.ai/documentation/userdocs/running/ingress/), [Gateway API](https://nrp.ai/documentation/userdocs/running/gateway/), [Long Idle Pods](https://nrp.ai/documentation/userdocs/running/long-idle/), [Cluster Policies](https://nrp.ai/documentation/userdocs/start/policies/), [Building in GitLab](https://nrp.ai/documentation/userdocs/development/gitlab/).
* **NRP support:** the Nautilus Support chat on Matrix (joining is covered in [KB024](../kb024-nautilus-getting-access/)), or the [NRP contact page](https://nrp.ai/contact). The NRP team handles exceptions for long-running services, network exceptions and questions about the cluster.
* **UCR Research Computing:** research-computing@ucr.edu or the [Get help](../../help/) page. We can help you decide whether Nautilus suits your tool, review your YAML, or point you to campus or cloud options when it does not. We do not run the NRP and cannot grant NRP exceptions.

## Related guides

* [KB023: Researcher guide to NRP Nautilus](../kb023-nautilus-researcher-guide/)
* [KB024: Getting access to Nautilus: accounts, namespaces and kubectl](../kb024-nautilus-getting-access/)
* [KB025: Notebooks, desktops and VS Code in the browser (JupyterHub, Coder)](../kb025-nautilus-jupyter-and-coder/)
* [KB026: Running batch jobs and GPU work with Kubernetes](../kb026-nautilus-batch-jobs-and-gpus/)
* [KB027: Storage and moving data on Nautilus](../kb027-nautilus-storage-and-data/)
* [KB028: Using the NRP's hosted large language models](../kb028-nautilus-llm-api/)
* KB029: Hosting a lab web tool or service on Nautilus (this article)
* [KB030: Teaching a class or workshop on Nautilus](../kb030-nautilus-teaching-and-workshops/)
* [NRP Nautilus service page](../../services/nautilus/)
