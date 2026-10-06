---
title: "Storage and moving data on Nautilus"
kb_id: KB027
topic: National
audience: "UCR researchers and students who run notebooks, jobs or services on Nautilus and need to get data in, keep it while they work, share it and get results out"
reviewed: 2026-10-06
owner: Research Computing
series: nautilus
series_order: 5
review_notes:
  - "Written 2026-10-06 from the NRP documentation (nrp.ai/documentation, fetched 2026-10-06) and tests run in a UCR namespace the same day."
  - "The CephFS shared-volume figures (rook-cephfs-central, about 86 MiB/s per writer, files visible across pods and a notebook) and the block-volume figures (rook-ceph-block-central, about 5 MB/s write and 15 MB/s read) come from same-day and earlier tests in a UCR namespace. The ceph-rbd class exists in the cluster but never provisioned in testing, so it is left out. The storage-class list was compared with kubectl get storageclass on 2026-10-06."
  - "Every manifest in this article passed kubectl apply --dry-run=server against Nautilus on 2026-10-06. None was left running. The outside S3 endpoints (west, central, east) answered HTTPS on 2026-10-06; no S3 upload was tested for this article."
  - "CHECK: the rclone S3 settings (provider Ceph) and the s3cmd config are copied from the NRP Ceph S3 page; they were not run with real keys for this article."
  - "CHECK: the globus-connect GitLab repository the NRP links was not reviewed; the article only says it exists."
  - "CHECK: Nextcloud quota and URL are not stated in the NRP docs fetched; the article gives neither."
---

Every Nautilus pod starts with an empty, temporary disk. Anything you want to keep, share between pods or bring back to UCR has to live somewhere else. This guide explains the options the National Research Platform (NRP) offers, when to use each one, and how to move data in and out without slowing the cluster down for everyone.

It assumes you have a namespace and a working `kubectl` (see [Getting access to Nautilus](../kb024-nautilus-getting-access/)). If you only use JupyterHub, sections 1, 2 and 8 still apply.

---

## 1. Before you put anything on Nautilus

**Non-sensitive data only.** The NRP states that its systems have no storage suitable for HIPAA, PII, FISMA, FERPA or other protected data, and that such data must not be stored there. That also rules out CUI and anything under a data use agreement that restricts where it may be stored. At UCR this means **P1 data only**. If your data is P2 or higher, use the [HPCC](../../services/hpcc/) with [HPCC storage](../../services/hpcc-storage/), [Ursa Major](../../services/ursa-major/), or the [Secure Enclave](../../services/secure-enclave/) for regulated data. If you are unsure how your data is classified, ask research-computing@ucr.edu before you upload.

**Working storage, not an archive.** The [cluster policies](https://nrp.ai/documentation/userdocs/start/policies/) say:

- Store only data you are actively computing on, and clean up regularly.
- **Any volume that has not been accessed for 6 months can be purged without notification.**
- NRP storage must not be used as archival storage.

Keep the master copy of anything important somewhere else: your lab's UCR storage ([CephRDS](../../services/cephrds/) or [HPCC storage](../../services/hpcc-storage/)), or [cloud archive](../../services/cloud-archive/) for data you must keep but rarely read. Treat Nautilus copies as working copies you could lose. The NRP is also a non-profit, non-commercial platform under its Acceptable Use Policy, so its storage is for research and education work only.

---

## 2. The options at a glance

| Option | What it is | Shared by many pods? | Lasts after the pod? | Good for |
| :--- | :--- | :--- | :--- | :--- |
| **Container disk and `emptyDir`** | Scratch space on the node's local disk | Only containers in the same pod | No | Temporary files, unpacked archives, fast scratch during a job |
| **CephFS volume** (`rook-cephfs-*`) | Shared network file system | Yes (`ReadWriteMany`) | Yes | Job inputs and outputs, checkpoints, files a notebook and jobs both need |
| **Ceph block volume** (`rook-ceph-block-*`) | A network disk attached to one pod at a time | No (`ReadWriteOnce`) | Yes | Small databases, conda environments, code builds, many small files |
| **Linstor volume** (`linstor-*`) | Fast replicated block storage | No (`ReadWriteOnce`) | Yes | Databases and services that need low latency |
| **Ceph S3** (object storage) | Buckets reached over HTTP with an access key | Yes, from inside and outside the cluster | Yes | Large datasets, moving data in and out, sharing with collaborators |
| **CVMFS** | Read-only software and data repositories (OSG/OSDF) | Yes | n/a (read-only) | Physics software stacks, published datasets |
| **Nextcloud** | Dropbox-style file sharing run by the NRP | n/a | Yes | Small amounts of data from your laptop, sharing results |

Everything except S3, Nextcloud and the container disk is a **PersistentVolumeClaim** (PVC): you ask for a size and a storage class, the cluster creates the volume, and you mount it into pods by name. PVCs belong to a namespace; other namespaces cannot see them.

### Which one should I use?

- **"I have a few GB of input files and my jobs write results."** One CephFS volume, mounted by every job and by your notebook.
- **"I have hundreds of GB or more, or want to download it on my laptop later."** Ceph S3. Pull what each job needs to local scratch, and push results back.
- **"I need a conda environment or pip packages that persist."** A block volume, or better, build them into a container image. Never on CephFS (section 4).
- **"I run a small database or web service."** A block volume (Ceph block or Linstor). See [Hosting a lab web tool or service on Nautilus](../kb029-nautilus-hosting-web-tools/).
- **"I need the fastest possible reads during training."** Copy the data to local NVMe scratch at the start of the job (section 3).

---

## 3. Scratch space inside a pod

Every container has some local disk, and you can add an `emptyDir` volume as explicit scratch. Most nodes have local NVMe drives, which the NRP describes as far faster than the shared network storage. Scratch is deleted when the pod ends.

Two rules from the [local scratch page](https://nrp.ai/documentation/userdocs/storage/local/):

- Pods that write more than **50Gi of scratch per container** can be evicted. In the UCR namespace we checked, the default ephemeral-storage limit was 50Gi per container.
- If you need more, **request** `ephemeral-storage` at the size you will actually use, with the limit close to it. If a node runs out of disk, every pod on it is evicted, so a small request with a large limit puts other people's work at risk.

A job with 100Gi of fast scratch:

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: scratch-example
spec:
  backoffLimit: 2
  template:
    spec:
      restartPolicy: Never
      containers:
        - name: work
          image: python:3.12-slim
          command: ["bash", "-c", "df -h /scratch && python -c 'print(\"working\")'"]
          resources:
            requests:
              cpu: "1"
              memory: 2Gi
              ephemeral-storage: 100Gi
            limits:
              cpu: "1"
              memory: 2Gi
              ephemeral-storage: 100Gi
          volumeMounts:
            - name: scratch
              mountPath: /scratch
      volumes:
        - name: scratch
          emptyDir: {}
```

For a RAM disk, use `emptyDir` with `medium: Memory`. That is the same trick used for `/dev/shm` in GPU data loaders (see [Running batch jobs and GPU work](../kb026-nautilus-batch-jobs-and-gpus/)).

---

## 4. Persistent volumes: CephFS and block

### Storage classes you can use

The storage class decides the type of volume and the region where the data lives. The NRP's [Ceph page](https://nrp.ai/documentation/userdocs/storage/ceph/) lists them. The general ones:

| Region | Shared file system (CephFS, `ReadWriteMany`) | Block (RBD, `ReadWriteOnce`) |
| :--- | :--- | :--- |
| US West | `rook-cephfs` | `rook-ceph-block` (the default if you name no class) |
| US Central | `rook-cephfs-central` | `rook-ceph-block-central` |
| US East | `rook-cephfs-east` | `rook-ceph-block-east` |
| US South East | `rook-cephfs-south-east` | `rook-ceph-block-south-east` |
| Hawaii and Guam | `rook-cephfs-pacific` | `rook-ceph-block-pacific` |

Other classes belong to particular groups or carry special rules, such as `rook-cephfs-ucsd`, a small NVMe file system whose data may be purged at the admins' discretion. Read the Ceph page before using any class not in this table. Do not use the class named `ceph-rbd`: it exists in the cluster, but it never provisioned a volume in our tests.

### Create a shared volume

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: lab-data
spec:
  storageClassName: rook-cephfs-central
  accessModes:
    - ReadWriteMany
  resources:
    requests:
      storage: 50Gi
```

```bash
kubectl apply -f lab-data.yaml
kubectl get pvc lab-data        # wait until STATUS is Bound
```

Mount it in a pod or job by name:

```yaml
          volumeMounts:
            - name: data
              mountPath: /data
      volumes:
        - name: data
          persistentVolumeClaim:
            claimName: lab-data
```

You can grow a volume later by editing the `storage` field (`kubectl edit pvc lab-data`). The NRP's [storage introduction](https://nrp.ai/documentation/userdocs/storage/intro/) says volumes created since December 2020 can be expanded this way. Ask for what you need now and grow it later.

In our tests, two job workers each wrote 256 MiB to a `rook-cephfs-central` volume at about 86 MiB/s, saw each other's files, and a GPU notebook that mounted the same volume saw them as well. That makes CephFS the natural meeting point between jobs and notebooks.

### CephFS rules

The [Ceph page](https://nrp.ai/documentation/userdocs/storage/ceph/) is firm about these:

- **No conda or pip installs on CephFS.** Installing packages on any shared CephFS file system is prohibited. Package managers create huge numbers of small files, which CephFS handles badly. Build environments into your container image, or put them on a block volume.
- **Never write the same file from several pods at once.** It can lock the file or corrupt data. Give each task its own output file and combine them afterwards.
- **Avoid many small files.** CephFS tracks every file on metadata servers. Pack small files into a few large archives (tar, zip, HDF5, Parquet, TFRecord) where you can.
- **Close files when you are done** and avoid keeping files open for a long time.
- There is a per-file size limit of 16 TB.

### Block volumes

A block volume behaves like a disk attached to one pod at a time. The NRP describes it as better than CephFS for small files and package installs, but with lower overall throughput. Our test of `rook-ceph-block-central` measured only about 5 MB/s write and 15 MB/s read, so do not use block storage for big datasets. It suits small databases, environments and code builds.

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: my-env
spec:
  storageClassName: rook-ceph-block-central
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 20Gi
```

A Ceph block volume stays stuck if the node using it goes offline, until the node returns. **Linstor** classes (`linstor-*`) are the NRP's fastest block storage and can move to another node if one fails, which is why the NRP suggests them for services that need to stay up. Linstor reserves the full requested size immediately and cannot hold volumes over 10 TB, so request only what you need. See the [Linstor page](https://nrp.ai/documentation/userdocs/storage/linstor/).

### Keep compute near the data

Nautilus spans many sites, and distance slows storage down. If your volume is in US Central, run the pods that use it in US Central. Add this to the pod `spec`, changing the region to match your storage class (`us-west`, `us-central`, `us-east` and so on):

```yaml
      affinity:
        nodeAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
            nodeSelectorTerms:
              - matchExpressions:
                  - key: topology.kubernetes.io/region
                    operator: In
                    values:
                      - us-central
```

List node regions with `kubectl get nodes -L topology.kubernetes.io/region`. Pinning a region means waiting for nodes in that region, so it is a trade-off.

---

## 5. Ceph S3 object storage

S3 is the NRP's most scalable storage, and the one to use for large datasets and for moving data in and out of the cluster. It runs on the NRP's own Ceph storage, not a commercial cloud. Any tool that speaks the S3 protocol works: rclone, s3cmd, boto3 in Python, the `aws.s3` and `paws` packages in R, and GUI clients such as Cyberduck. There is a per-object size limit of 5 TiB.

### Get keys

1. Log in at https://nrp.ai.
2. Open **User**, then **S3 Tokens**, and create a key and secret for the public pools.

Namespace users cannot create buckets through Kubernetes (ObjectBucketClaims are forbidden in our tests). Use the portal keys and create buckets with an S3 client.

Treat the key and secret like a password. Do not commit them to Git, paste them into notebooks you share, or put them in a job spec (section 7).

### Endpoints

Use the outside endpoints from your laptop or a UCR server, and the inside endpoints from pods on Nautilus. Inside endpoints use plain http but are faster, because requests go straight to the storage servers instead of through a load balancer. The values are from the NRP's [Ceph S3 page](https://nrp.ai/documentation/userdocs/storage/ceph-s3/).

| Pool | Outside the cluster | Inside the cluster |
| :--- | :--- | :--- |
| West (default) | https://s3-west.nrp-nautilus.io | http://rook-ceph-rgw-nautiluss3.rook |
| Central | https://s3-central.nrp-nautilus.io | http://rook-ceph-rgw-centrals3.rook-central |
| East | https://s3-east.nrp-nautilus.io | http://rook-ceph-rgw-easts3.rook-east |

Pick the pool nearest your compute and stay with it. A bucket lives in one pool.

### rclone (recommended)

The NRP calls rclone the easiest way to use S3. Configure it once on your computer:

```bash
rclone config create nrp-s3 s3 provider Ceph \
  endpoint https://s3-west.nrp-nautilus.io \
  access_key_id <your-key> secret_access_key <your-secret>

rclone mkdir nrp-s3:ucr-example-survey-2026
rclone copy ./survey-data nrp-s3:ucr-example-survey-2026/raw --progress
rclone ls nrp-s3:ucr-example-survey-2026
```

Choose a distinctive bucket name that includes your lab or project.

### Python (boto3)

```python
import boto3

s3 = boto3.client(
    "s3",
    endpoint_url="http://rook-ceph-rgw-nautiluss3.rook",  # inside a pod; use https://s3-west.nrp-nautilus.io outside
    aws_access_key_id="<your-key>",
    aws_secret_access_key="<your-secret>",
)
s3.download_file("ucr-example-survey-2026", "raw/responses.csv", "/scratch/responses.csv")
s3.upload_file("/scratch/summary.csv", "ucr-example-survey-2026", "results/summary.csv")
```

In a real job, read the key and secret from environment variables filled from a Kubernetes Secret, not from the script.

### AWS CLI

The AWS CLI works with `--endpoint-url https://s3-west.nrp-nautilus.io`, but the NRP reports that uploads larger than about 80 MB can fail partway with this CLI. Use rclone, s3cmd or boto3 for large files, or the multipart settings on the Ceph S3 page.

### Sharing a bucket and publishing files

- **Collaborators with their own NRP accounts:** give them access with a bucket policy. The Ceph S3 page has a template that lists users by name.
- **Anyone on the web:** you can make a single object, or a whole bucket, public. The file is then at a URL such as `https://s3-west.nrp-nautilus.io/<bucket>/<file>`. This suits a public dataset that goes with a paper. Never do it with anything you would not post on a public website.

### Fast bulk deletes

When a project ends, delete its bucket contents quickly with rclone, then remove the bucket:

```bash
rclone delete nrp-s3:ucr-example-survey-2026 --transfers 1000 --checkers 2000 --disable ListR --progress
rclone rmdir nrp-s3:ucr-example-survey-2026
```

---

## 6. Moving data in and out

How you move data depends on how much you have, how many files, and where it lives now. The NRP's [moving data page](https://nrp.ai/documentation/userdocs/storage/move-data/) covers each route.

| Situation | Route |
| :--- | :--- |
| A config file or a small script | `kubectl cp` |
| Data on your laptop or a UCR server, any size | Upload to S3 with rclone, then read it from pods |
| Data already on the web, a cloud bucket or a server you can reach | Pull it from inside a job (wget, curl, rclone, scp) |
| Data on another Nautilus volume | A copy job inside the cluster |
| Results going back to UCR | Write to S3 from the job, then download with rclone |
| A few files to or from a collaborator's desktop | Nextcloud |

### kubectl cp: small files only

```bash
kubectl cp ./params.json <pod-name>:/data/params.json
kubectl cp <pod-name>:/data/summary.csv ./summary.csv
```

Everything sent this way passes through the cluster's management server, which does not have a fast connection. The NRP asks you not to send more than a couple of megabytes this way, because it slows the cluster for everyone.

### Pull public data with a job

If your data is downloadable (a public archive, a government portal, a lab web server), let a job fetch it straight onto your volume. This example downloads and unpacks a public archive to the `lab-data` CephFS volume. It ends on its own, keeps no shell open, and restarts if the node fails.

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: fetch-dataset
spec:
  backoffLimit: 3
  ttlSecondsAfterFinished: 86400
  template:
    spec:
      restartPolicy: Never
      containers:
        - name: fetch
          image: python:3.12-slim
          command: ["bash", "-c"]
          args:
            - |
              set -euo pipefail
              mkdir -p /data/raw
              cd /data/raw
              python -c "import urllib.request; urllib.request.urlretrieve('https://example.org/dataset.tar.gz', 'dataset.tar.gz')"
              tar -xzf dataset.tar.gz
              rm dataset.tar.gz
              ls -la /data/raw | head
          resources:
            requests:
              cpu: "1"
              memory: 2Gi
            limits:
              cpu: "1"
              memory: 2Gi
          volumeMounts:
            - name: data
              mountPath: /data
      volumes:
        - name: data
          persistentVolumeClaim:
            claimName: lab-data
```

Replace the URL with your source. For data on Google Drive, Box, Dropbox, OneDrive or another cloud store, use the `rclone/rclone` image with an rclone config stored as a Secret. rclone supports dozens of storage services.

### Stage data from S3 to local scratch

For training or analysis that reads the same data many times, copy it from S3 to fast local scratch when the job starts, work there, then write results back to S3. The NRP's [high I/O jobs page](https://nrp.ai/documentation/userdocs/running/io-jobs/) recommends this approach, and a rolling download window for datasets too large to fit on scratch.

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: stage-and-run
spec:
  backoffLimit: 2
  ttlSecondsAfterFinished: 86400
  template:
    spec:
      restartPolicy: Never
      initContainers:
        - name: stage-in
          image: rclone/rclone:latest
          args:
            - copy
            - nrp-s3:ucr-example-survey-2026/raw
            - /scratch/raw
            - --transfers=16
          resources:
            requests:
              cpu: "2"
              memory: 2Gi
            limits:
              cpu: "2"
              memory: 2Gi
          volumeMounts:
            - name: scratch
              mountPath: /scratch
            - name: rclone-config
              mountPath: /config/rclone
      containers:
        - name: analyze
          image: python:3.12-slim
          command: ["bash", "-c", "ls -la /scratch/raw && echo analysis goes here > /scratch/summary.txt"]
          resources:
            requests:
              cpu: "2"
              memory: 4Gi
              ephemeral-storage: 80Gi
            limits:
              cpu: "2"
              memory: 4Gi
              ephemeral-storage: 80Gi
          volumeMounts:
            - name: scratch
              mountPath: /scratch
      volumes:
        - name: scratch
          emptyDir: {}
        - name: rclone-config
          secret:
            secretName: rclone-config
```

The `rclone-config` Secret holds an rclone config file that uses the **inside** endpoint. Create it once (section 7). Add a final step that copies results back to S3 the same way, or write them to a CephFS volume.

### Copy between volumes inside the cluster

To move data from one PVC to another, for example from a West volume to a Central one, run a copy job with both mounted. The NRP's [moving data page](https://nrp.ai/documentation/userdocs/storage/move-data/) has a ready example using its `gsutil` image for parallel copies, and mentions the `pv-migrate` tool.

### Globus, Nextcloud and Syncthing

- **Globus:** UCR researchers often move data with Globus (see [Globus transfer](../globus-transfer/)). The NRP keeps a `globus-connect` repository in its GitLab with instructions for running a personal Globus endpoint in a container. See [Globus Connect](https://nrp.ai/documentation/userdocs/running/globus-connect/).
- **Nextcloud:** the NRP runs a Nextcloud instance, similar to Dropbox or Google Drive, backed by its CephFS storage. New accounts start disabled; ask in Nautilus Support to activate yours. The NRP asks you to use S3 instead for many or large files, and to contact them first before using Nextcloud for large datasets. rclone (already installed in JupyterHub) can reach it over WebDAV. See [Nextcloud](https://nrp.ai/documentation/userdocs/storage/nextcloud/).
- **Syncthing:** available on request. See [Syncthing](https://nrp.ai/documentation/userdocs/storage/syncthing/).

---

## 7. Credentials: keep them in Secrets

Storage keys, tokens and passwords belong in Kubernetes Secrets, never in a manifest, a ConfigMap, a container image or a Git repository. Job specs can be visible to other cluster users (for example through the Armada scheduler), and images and repositories get shared.

Create an rclone config file for use inside the cluster, then store it as a Secret:

```bash
cat > rclone.conf <<'EOF'
[nrp-s3]
type = s3
provider = Ceph
endpoint = http://rook-ceph-rgw-nautiluss3.rook
access_key_id = <your-key>
secret_access_key = <your-secret>
EOF
kubectl create secret generic rclone-config --from-file=rclone.conf
rm rclone.conf
```

Or store keys as separate values and pass them as environment variables (boto3 and the AWS tools read these names automatically):

```bash
kubectl create secret generic s3-keys \
  --from-literal=AWS_ACCESS_KEY_ID=<your-key> \
  --from-literal=AWS_SECRET_ACCESS_KEY=<your-secret>
```

```yaml
          envFrom:
            - secretRef:
                name: s3-keys
```

Members of your namespace can usually read its Secrets, so rotate keys in the NRP portal when someone leaves the group.

---

## 8. Storage in JupyterHub and Coder

- **JupyterHub** home directories start at 5 GB and can be extended on request. Use home for notebooks and code, not datasets. For data, use S3 from the notebook; rclone is preinstalled.
- **Coder** workspaces have their own volumes. **Deleting a workspace deletes its volume**, so push code to Git and data to S3 before you delete one.

See [Notebooks, desktops and VS Code in the browser](../kb025-nautilus-jupyter-and-coder/) for details.

---

## 9. Read-only software and datasets: CVMFS

CVMFS gives read-only access to software repositories and datasets distributed through the Open Science Data Federation (OSDF), widely used in high-energy physics and gravitational-wave research. Repositories available include `atlas.cern.ch`, `cms.cern.ch`, `icecube.opensciencegrid.org`, `gwosc.osgstorage.org` and `singularity.opensciencegrid.org`. Create one PVC with storage class `cvmfs` and mount the repository you need. The [CVMFS page](https://nrp.ai/documentation/userdocs/storage/cvmfs/) has the full list and manifests. The NRP can also host read-only data on its own OSDF origins on request.

---

## 10. Cleaning up

Cleaning up is part of using shared storage, and it keeps your data from being purged by surprise.

- **Delete volumes you no longer need:** `kubectl get pvc`, then `kubectl delete pvc <name>`. Deleting a PVC deletes its data. There is no undo.
- **Deleting many files on CephFS or block volumes:** do not run `rm -rf` on a folder with more than about 10,000 files. The NRP's [purging page](https://nrp.ai/documentation/userdocs/storage/purging/) warns it can crash the metadata server. Use `find` instead:

```bash
find /data/old-run -type f -delete
find /data/old-run -depth -type d -delete
```

- **S3:** use `rclone delete` and `rclone rmdir` (section 5).
- **Six-month rule:** anything not accessed for 6 months can be purged without notice. Copy results home when a project phase ends.

### A data plan for a typical project

1. Keep the master dataset at UCR (CephRDS or HPCC storage). Confirm it is P1.
2. Upload a working copy to an NRP S3 bucket with rclone.
3. Create one CephFS volume in the same region for job outputs and notebook access.
4. Jobs stage their input from S3 to local scratch, compute, and write one result file per task to CephFS.
5. Combine results in a notebook, then copy the final outputs back to UCR with rclone.
6. When the project ends, delete the bucket contents, the bucket and the PVC.

---

## Getting help

- **NRP documentation:** [Storage introduction](https://nrp.ai/documentation/userdocs/storage/intro/), [Ceph S3](https://nrp.ai/documentation/userdocs/storage/ceph-s3/), [Moving data](https://nrp.ai/documentation/userdocs/storage/move-data/) and [cluster policies](https://nrp.ai/documentation/userdocs/start/policies/).
- **NRP support:** the Nautilus Support chat on Matrix, linked from [nrp.ai/contact](https://nrp.ai/contact). Include your namespace, the PVC or bucket name, and the output of `kubectl describe pvc <name>` or `kubectl describe pod <name>`.
- **UCR Research Computing:** research-computing@ucr.edu or the [Get help](../../help/) page, for help planning where your data should live, checking whether it may go on Nautilus at all, or moving it between UCR storage and the NRP.

## Related guides

- [Researcher guide to NRP Nautilus](../kb023-nautilus-researcher-guide/)
- [Getting access to Nautilus: accounts, namespaces and kubectl](../kb024-nautilus-getting-access/)
- [Notebooks, desktops and VS Code in the browser (JupyterHub, Coder)](../kb025-nautilus-jupyter-and-coder/)
- [Running batch jobs and GPU work on Nautilus](../kb026-nautilus-batch-jobs-and-gpus/)
- [Using the NRP's hosted large language models](../kb028-nautilus-llm-api/)
- [Hosting a lab web tool or service on Nautilus](../kb029-nautilus-hosting-web-tools/)
- [Teaching a class or workshop on Nautilus](../kb030-nautilus-teaching-and-workshops/)
- [Research data storage at UCR: choosing by stage](../kb001-research-data-storage-strategy/)
