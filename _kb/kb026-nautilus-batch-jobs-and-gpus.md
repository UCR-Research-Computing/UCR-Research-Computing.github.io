---
title: "Running batch jobs and GPU work on Nautilus with Kubernetes"
kb_id: KB026
topic: National
audience: "UCR researchers and students who are comfortable with a command line and want to run scripts, parameter sweeps or GPU training on Nautilus without babysitting a notebook"
reviewed: 2026-10-06
owner: Research Computing
series: nautilus
series_order: 4
review_notes:
  - "Written 2026-10-06 from the NRP documentation (nrp.ai/documentation, fetched 2026-10-06) and tests run in a UCR namespace the same day."
  - "Every manifest in this article passed kubectl apply --dry-run=server against Nautilus on 2026-10-06. The gpu-check Job (section 5) and the 20-task sweep with its PVC and ConfigMap (section 6) were run for real that day in the UCR namespace and then deleted: gpu-check got an RTX A4000 and reported 61.4 TFLOPS fp16 (an earlier same-day test measured about 40); the sweep completed 20/20 in about 4.5 min after 5 pods stalled on a node with FailedMount (CephFS CSI driver not registered) and were deleted. The opportunistic/CPU-only affinity and podFailurePolicy snippets passed dry-run only."
  - "CHECK: the exact location of the Violations page in the NRP portal (the policy page names it but gives no URL)."
  - "CHECK: the A100 access request form URL (the GPU pods page links it; the link was not in the fetched text). The article links the GPU pods page instead."
  - "CHECK: podFailurePolicy (ignore preemption disruptions) is standard Kubernetes and passed server dry-run, but the NRP docs do not mention it. It is offered as optional."
---

Batch jobs are the way the National Research Platform (NRP) wants most computing done on Nautilus. You describe the work in a short text file, hand it to the cluster, and walk away. The cluster finds a machine with the hardware you asked for, runs your command, restarts it if the machine fails, and keeps the output for you to collect. Nothing depends on your laptop staying awake.

This guide is for people who have a namespace and a working `kubectl` (see [Getting access to Nautilus](../kb024-nautilus-getting-access/)) and want to move past notebooks. It covers the rules that shape every job, a first job, sizing, GPU jobs, sweeps of many tasks, preemptible work, distributed training, troubleshooting and cleanup. Each section has a manifest you can copy.

Two ground rules apply to everything here. Nautilus is for **non-sensitive data only** (P1): no HIPAA, FERPA, PII, FISMA, CUI or other protected data. And the NRP is a non-profit, non-commercial platform under its [Acceptable Use Policy](https://nrp.ai/documentation/userdocs/start/policies/). If your work needs protected data, use the [HPCC](../../services/hpcc/), [Ursa Major](../../services/ursa-major/) or the [Secure Enclave](../../services/secure-enclave/) instead.

---

## 1. Is a batch job what you need?

A batch job fits when the work has a beginning and an end, and you can write down the command that does it. Some examples from different fields:

| If you are | The job |
| :--- | :--- |
| A historian with 40,000 scanned newspaper pages | Run OCR over the scans in 200 independent chunks and write text files to shared storage |
| A social scientist with a public corpus of posts | Classify sentiment for each post with a GPU model, one shard of the corpus per task |
| A plant biologist | Align public sequencing reads against a reference genome, one sample per task |
| A mechanical engineer | Sweep 500 combinations of geometry and load through a simulation, one combination per task |
| A physicist | Run a Monte Carlo study with 1,000 random seeds and gather the histograms afterwards |
| A computer scientist | Train or fine-tune a model on one or more GPUs for many hours, saving checkpoints as it goes |

Use something else when:

- **You are still exploring interactively.** Start in JupyterHub or Coder ([Notebooks, desktops and VS Code in the browser](../kb025-nautilus-jupyter-and-coder/)), get the code working on a small sample, then come back here.
- **You need a service that stays up** (a web app, an API, a database). That is a Deployment; see [Hosting a lab web tool or service on Nautilus](../kb029-nautilus-hosting-web-tools/).
- **You prefer Slurm, or need reserved capacity or protected data.** The campus [HPCC](../../services/hpcc/) runs Slurm. For very large numbers of small independent jobs, [OSG / OSPool](../../services/osg/) is another option.

---

## 2. The rules that shape every job

Kubernetes has three ways to run a container. Nautilus treats them very differently, and the [cluster policies](https://nrp.ai/documentation/userdocs/start/policies/) are enforced. Read this table before anything else.

| Kind | What Nautilus uses it for | Rules |
| :--- | :--- | :--- |
| **Job** | Batch work that runs to completion | The recommended way to compute. The command must do real work and end on its own. A Job whose command is `sleep` (or a script that ends with `sleep`) gets the user banned. Up to 8 GPUs per node. |
| **Pod** (bare, no controller) | Short interactive testing and debugging | Destroyed after 6 hours. Limited to 2 GPUs, 32 GB RAM and 16 CPU cores. Running `sleep` in an interactive pod is allowed. |
| **Deployment** | Long-running services | Deleted after 2 weeks unless the namespace is on the NRP exceptions list. A Deployment that sits idle cannot request GPUs. |

Other rules that apply to every job:

- **Limits must be within 20% of requests.** If you request 4 CPU cores, the limit can be at most about 4.8. When you run more than about 100 pods, set limit equal to request.
- **Use what you request.** A single user cannot run more than 4 pods that are outside these bounds: GPU use below 40% of the GPUs requested, CPU use outside 20-200% of the request, or memory use outside 20-150% of the request. Pods that request 1 CPU core and 2 GB of memory are exempt. Watch the **Violations** page in the NRP portal.
- **Namespaces with under-used requests risk being banned.** The namespace admin answers for everything that runs in the namespace.
- **There is no fair-share queue.** The [batch jobs page](https://nrp.ai/documentation/userdocs/running/jobs/) says it plainly: if you submit 1,000 jobs at once, you can block everyone else. Section 6 shows how to cap how many run at a time.
- **More than 50 GPUs at once?** Present a plan in Nautilus Support first.

---

## 3. Your first Job

Set your namespace as the default so you do not have to type it on every command (the context name `nautilus` comes from the NRP kubeconfig):

```bash
kubectl config set-context nautilus --namespace=<your-namespace>
```

Save this as `first-job.yaml`. It computes 2,000 digits of pi, which is enough to see the whole life cycle of a Job.

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: first-job
spec:
  backoffLimit: 2
  ttlSecondsAfterFinished: 86400
  template:
    spec:
      restartPolicy: Never
      containers:
        - name: pi
          image: perl
          command: ["perl", "-Mbignum=bpi", "-wle", "print bpi(2000)"]
          resources:
            requests:
              cpu: "1"
              memory: 2Gi
            limits:
              cpu: "1"
              memory: 2Gi
```

Submit it and watch it run:

```bash
kubectl apply -f first-job.yaml
kubectl get jobs
kubectl get pods -l job-name=first-job
kubectl logs job/first-job
```

What the fields mean:

- `restartPolicy: Never` with `backoffLimit: 2`: if the command exits with an error, or the node is rebooted, the Job starts a fresh pod, up to 2 more times. The NRP recommends a backoff above 0 so a node failure does not lose your run.
- `ttlSecondsAfterFinished: 86400`: delete the finished Job and its pod after one day. The [NRP tutorial](https://nrp.ai/documentation/userdocs/tutorial/jobs/) says finished jobs otherwise stay for one week by default.
- `resources`: 1 CPU and 2 GB, with limit equal to request. That size is exempt from the usage-violation rules, which makes it a safe default for small tasks.

When `kubectl get jobs` shows `COMPLETIONS 1/1`, the job is done. Clean up:

```bash
kubectl delete job first-job
```

Deleting a Job deletes its pods and their logs. Copy anything you need out of the logs first, or better, have the job write results to storage (section 6 and [Storage and moving data on Nautilus](../kb027-nautilus-storage-and-data/)).

---

## 4. Sizing requests and limits

Getting the size right is the main skill on Nautilus. The scheduler places your pod using the **request**; the **limit** is the ceiling.

- **Memory:** if a pod goes over its memory limit it is killed (`OOMKilled`). Set the request close to your typical use and the limit a little above your peak, within the 20% rule.
- **CPU:** if your program can be told how many threads to use, set that number as the request. Requesting whole cores with request equal to limit tends to avoid throttling, according to the [CPU throttling page](https://nrp.ai/documentation/userdocs/running/cpu-throttling/).
- **Ephemeral storage:** scratch space inside the container is limited by default. In the UCR namespace we tested, the default was 50Gi per container, and the NRP warns that pods writing more than 50Gi of scratch can be evicted. If you need more, request `ephemeral-storage` explicitly (see [Storage and moving data on Nautilus](../kb027-nautilus-storage-and-data/)).

How do you know what your program uses? Run one representative task first and measure:

1. Watch the namespace and GPU dashboards in Grafana, linked from the NRP [monitoring page](https://nrp.ai/documentation/userdocs/running/monitoring/). For memory, use the **Memory Usage (RSS)** column; plain Memory Usage includes disk cache.
2. Or wrap your command in `/usr/bin/time -v`, which prints the maximum memory used at the end of the log. The image needs the `time` package installed.

```yaml
          command: ["/usr/bin/time", "-v", "bash", "-c"]
          args:
            - python -u analyze.py --input /data/sample.csv
```

Then size the full run from the measurement, not from a guess.

---

## 5. GPU jobs

### A first GPU job

This job asks for one GPU, prints which card it received, and measures half-precision matrix-multiply speed with PyTorch. It is a useful smoke test before you commit hours to a training run.

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: gpu-check
spec:
  backoffLimit: 1
  ttlSecondsAfterFinished: 86400
  template:
    spec:
      restartPolicy: Never
      containers:
        - name: bench
          image: pytorch/pytorch:2.4.1-cuda12.1-cudnn9-runtime
          command: ["python", "-c"]
          args:
            - |
              import time, torch
              print("GPU:", torch.cuda.get_device_name(0))
              n = 8192
              a = torch.randn(n, n, device="cuda", dtype=torch.float16)
              b = torch.randn(n, n, device="cuda", dtype=torch.float16)
              for _ in range(5):
                  a @ b
              torch.cuda.synchronize()
              reps = 50
              t = time.time()
              for _ in range(reps):
                  a @ b
              torch.cuda.synchronize()
              dt = time.time() - t
              print("fp16 TFLOPS: %.1f" % (2 * n**3 * reps / dt / 1e12))
          resources:
            requests:
              cpu: "2"
              memory: 8Gi
              nvidia.com/gpu: "1"
            limits:
              cpu: "2"
              memory: 8Gi
              nvidia.com/gpu: "1"
```

```bash
kubectl apply -f gpu-check.yaml
kubectl logs -f job/gpu-check
```

In our tests from a UCR namespace, 1-GPU pods landed on an NVIDIA RTX A4000 at SDSC. An earlier PyTorch fp16 matrix-multiply test measured about 40 TFLOPS; this exact job reported about 61. Treat such numbers as a rough check that the GPU works, not a benchmark. You may get a different card: unless you say otherwise, Kubernetes picks any free node with a GPU. The first run on a node can take a few minutes while the image downloads.

A GPU stays reserved for as long as your pod exists, even if your code is not using it. The NRP expects GPU utilization above 40% and ideally near 100%. Only ask for a second GPU once one GPU is close to fully busy.

### Choosing a GPU type

List the GPU models currently in the cluster:

```bash
kubectl get nodes -L nvidia.com/gpu.product -l nvidia.com/gpu.product
```

To require a model, add a node affinity to the pod `spec` (alongside `containers:`). This example asks for an RTX 3090 or an A10, both 24 GB cards in the NRP's [GPU memory table](https://nrp.ai/documentation/userdocs/running/gpu-pods/):

```yaml
      affinity:
        nodeAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
            nodeSelectorTerms:
              - matchExpressions:
                  - key: nvidia.com/gpu.product
                    operator: In
                    values:
                      - NVIDIA-GeForce-RTX-3090
                      - NVIDIA-A10
```

The narrower your choice, the longer you may wait. Ask for the GPU memory you need, not the fastest card you can name.

If your image needs a recent CUDA, check the driver versions on the nodes and filter on them the same way:

```bash
kubectl get nodes -l nvidia.com/gpu.product \
  -L nvidia.com/cuda.driver.major,nvidia.com/cuda.runtime.major,nvidia.com/cuda.runtime.minor
```

### Special and high-memory GPUs

Some GPUs are not requested as `nvidia.com/gpu` but as their own resource: `nvidia.com/a100`, `nvidia.com/a40`, `nvidia.com/rtxa6000`, `nvidia.com/rtx8000`, `nvidia.com/h100`, `nvidia.com/h200`, `nvidia.com/gh200` and `nvidia.com/mig-small` (an A100 slice). The [GPU pods page](https://nrp.ai/documentation/userdocs/running/gpu-pods/) has the current list.

Four of these are behind a per-namespace quota that starts at zero. In the UCR namespace we checked, A100, H100, H200 and GH200 quotas were all 0.

| GPU | How to get it |
| :--- | :--- |
| A100 | The namespace admin can submit the A100 access request (linked from the [GPU pods page](https://nrp.ai/documentation/userdocs/running/gpu-pods/)) describing the workflow. An NRP admin may raise the quota. |
| H100, H200, GH200 | Not requestable. Reserved for the groups that contributed the hardware, plus LLM workloads using spare cycles. |
| Any of the four, without a quota | Run at the `opportunistic` priority (below). Your pod can be preempted at any time. |

To use A40, RTX A6000 or RTX 8000 cards, replace `nvidia.com/gpu` with the special resource name in both requests and limits:

```yaml
          resources:
            requests:
              nvidia.com/a40: "1"
            limits:
              nvidia.com/a40: "1"
```

The GH200 nodes are Arm machines; they need an Arm-capable image and a toleration for `nautilus.io/arm64`, as the GPU pods page shows.

### Shared memory for data loaders

PyTorch data loaders with several workers use `/dev/shm`, which is only 64 MB by default in a container. If you see errors about shared memory, add a memory-backed volume:

```yaml
          volumeMounts:
            - name: dshm
              mountPath: /dev/shm
      volumes:
        - name: dshm
          emptyDir:
            medium: Memory
            sizeLimit: 2Gi
```

---

## 6. Many tasks: sweeps and embarrassingly parallel work

Most research batch work is many independent tasks: one per file, sample, seed or parameter set. Kubernetes handles this with an **Indexed Job**. You say how many tasks there are (`completions`) and how many may run at once (`parallelism`). Each pod gets its task number in the environment variable `JOB_COMPLETION_INDEX`, starting at 0.

`parallelism` is your fair-share control. Nautilus has no fair queue, so this number is how you avoid crowding out other users.

### Step 1: a shared volume for results

Tasks need somewhere to write that outlives the pods. A CephFS volume can be mounted by many pods at once (`ReadWriteMany`):

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: sweep-results
spec:
  storageClassName: rook-cephfs-central
  accessModes:
    - ReadWriteMany
  resources:
    requests:
      storage: 20Gi
```

```bash
kubectl apply -f sweep-results.yaml
kubectl get pvc sweep-results     # wait for STATUS Bound
```

### Step 2: the script, as a ConfigMap

You do not need to build a container image to run your own script. Put the script in a ConfigMap and mount it. Here, `sweep.py` runs a small random-walk simulation for one parameter value chosen by the task number:

```python
import json, os, random

i = int(os.environ["JOB_COMPLETION_INDEX"])
p_values = [round(0.05 * (k + 1), 2) for k in range(20)]
p = p_values[i]

rng = random.Random(i)
finals = []
for walk in range(2000):
    x = 0
    for step in range(1000):
        x += 1 if rng.random() < p else -1
    finals.append(x)

result = {"task": i, "p": p, "mean_final": sum(finals) / len(finals)}
with open("/results/task-%03d.json" % i, "w") as f:
    json.dump(result, f)
print(result)
```

```bash
kubectl create configmap sweep-script --from-file=sweep.py
```

### Step 3: the Indexed Job

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: sweep
spec:
  completions: 20
  parallelism: 5
  completionMode: Indexed
  backoffLimit: 10
  ttlSecondsAfterFinished: 86400
  template:
    spec:
      restartPolicy: Never
      containers:
        - name: worker
          image: python:3.12-slim
          command: ["python", "/scripts/sweep.py"]
          resources:
            requests:
              cpu: "1"
              memory: 2Gi
            limits:
              cpu: "1"
              memory: 2Gi
          volumeMounts:
            - name: script
              mountPath: /scripts
            - name: results
              mountPath: /results
      volumes:
        - name: script
          configMap:
            name: sweep-script
        - name: results
          persistentVolumeClaim:
            claimName: sweep-results
```

```bash
kubectl apply -f sweep-job.yaml
kubectl get job sweep -w              # COMPLETIONS climbs to 20/20
kubectl logs job/sweep                # logs from one of the pods
```

Every task writes its own file. That matters on CephFS: never have several pods write to the same file at once, because it can lock or corrupt the file. Combine the per-task files afterwards, in a notebook or a small follow-up job.

In our test, a 2-worker Indexed Job (completions 2, parallelism 2) finished in 28 seconds. Each worker wrote 256 MiB to a shared `rook-cephfs-central` volume at about 86 MiB/s, both workers saw each other's files, and a GPU notebook pod that mounted the same volume saw them too. That last point is the useful pattern: run the heavy work as jobs, then look at the results from JupyterHub.

We also ran the 20-task sweep above, 5 at a time. Fifteen tasks finished within about a minute on nodes across several states. Five landed on a node that could not mount the CephFS volume and sat in `ContainerCreating`; after we deleted those pods, the Job recreated them elsewhere and all 20 tasks completed in about four and a half minutes. The deleted pods counted as 5 failures, which the `backoffLimit: 10` absorbed. Set the backoff with that kind of event in mind (section 10).

### Mapping task numbers to files

For "one task per input file" work, such as the OCR or sequencing examples, let each task pick its own file from a sorted list on the shared volume:

```bash
FILE=$(ls /data/inputs | sort | sed -n "$((JOB_COMPLETION_INDEX + 1))p")
echo "Task $JOB_COMPLETION_INDEX processing $FILE"
```

If you have thousands of small inputs, give each task a batch of them rather than one file each. Pod start-up has a cost, and CephFS is slow with many small files.

---

## 7. Large CPU-only work and preemptible jobs

Nautilus is used mostly for GPU work. The [CPU-only jobs page](https://nrp.ai/documentation/userdocs/running/cpu-only/) asks two things of large CPU runs, and you can use either or both:

1. **Run at low priority** so other work can preempt yours. Then you do not have to worry as much about the size of your run.
2. **Stay off GPU nodes**, so your CPU work does not block someone's GPU job.

Both go in the pod `spec`:

```yaml
      priorityClassName: opportunistic
      affinity:
        nodeAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
            nodeSelectorTerms:
              - matchExpressions:
                  - key: feature.node.kubernetes.io/pci-10de.present
                    operator: NotIn
                    values:
                      - "true"
```

The same `priorityClassName: opportunistic` line is what lets any namespace use A100, H100, H200 or GH200 cards without a quota. Rules from the [opportunistic use page](https://nrp.ai/documentation/userdocs/running/priority-classes/):

- In most cases, leave `priorityClassName` unset. That is the normal default.
- The classes users may set are `opportunistic`, `opportunistic2`, `owner-no-preempt` and `armada-default`. Anything else (for example `default`, `nice`, `batch-low` or any `*-critical` class) is rejected with an error mentioning `high-priority-ban` or `low-priority-ban`. If a tool sets one for you, remove that line.
- Opportunistic pods can be stopped at any moment. **Write checkpoints** to a persistent volume often, and make your code resume from the latest checkpoint when it starts.

Run preemptible work as a Job so the controller restarts it. By default, each preemption counts against `backoffLimit`. If you expect many preemptions, standard Kubernetes lets you tell the Job not to count them (optional; this goes under the Job `spec`, next to `backoffLimit`):

```yaml
  podFailurePolicy:
    rules:
      - action: Ignore
        onPodConditions:
          - type: DisruptionTarget
```

---

## 8. Getting your code and software into the job

A job runs a container image. You have four common options, from least to most effort:

1. **Use a public image as is**, such as `python:3.12-slim`, `rocker/r-ver`, or `pytorch/pytorch`. The NRP also publishes scientific images in its GitLab registry, including `gitlab-registry.nrp-nautilus.io/nrp/scientific-images/python` (see [scientific images](https://nrp.ai/documentation/userdocs/running/sci-img/)).
2. **Mount your script from a ConfigMap**, as in section 6. Good for single scripts and small configuration files.
3. **Clone your code at start-up** with an init container. The NRP's [batch jobs page](https://nrp.ai/documentation/userdocs/running/jobs/) has a complete example that clones a Git repository into a shared `emptyDir` before the main container runs. For a private repository, store a read-only token in a Kubernetes Secret and reference it from the pod.
4. **Build your own image.** Register at the NRP GitLab (https://gitlab.nrp-nautilus.io), push a repository with a `Dockerfile`, and let GitLab CI build it into the NRP container registry. The [GitLab build page](https://nrp.ai/documentation/userdocs/development/gitlab/) has a ready `.gitlab-ci.yml`. This is the right choice once your dependencies take more than a minute to install, because every task would otherwise reinstall them.

Do not install conda or pip packages onto shared CephFS volumes. The NRP prohibits it. Put environments in the image instead.

**Keep secrets out of job specs.** Put passwords, tokens and storage keys in a Kubernetes Secret and reference it. If you submit through the Armada scheduler (section 9), job specs are visible to every user of the cluster.

```bash
kubectl create secret generic my-token --from-file=token.txt
```

```yaml
          env:
            - name: API_TOKEN
              valueFrom:
                secretKeyRef:
                  name: my-token
                  key: token.txt
```

---

## 9. Bigger patterns: distributed training, frameworks and queues

When one pod is not enough, Nautilus runs several operators that handle multi-pod work for you. The NRP lists them as stable on its [deployed services page](https://nrp.ai/documentation/userdocs/start/resources/):

- **Kubeflow Training Operator** for distributed PyTorch (`PyTorchJob`) and TensorFlow (`TFJob`) training across several pods. See [Kubeflow training](https://nrp.ai/documentation/userdocs/running/kubeflow/).
- **Ray** for scaling Python and machine learning work across a cluster you start in your namespace. See [Ray cluster](https://nrp.ai/documentation/userdocs/running/ray-cluster/).
- **Dask** for parallel pandas-style and array computing. See [Dask cluster](https://nrp.ai/documentation/userdocs/running/dask-cluster/).

Before you go distributed, get one GPU busy. The NRP's advice on [high I/O jobs](https://nrp.ai/documentation/userdocs/running/io-jobs/) is to start with one GPU and a representative subset of the data, and only add GPUs once you are sure the GPU, not data loading, is the bottleneck. Jobs that ask for 4 or 8 GPUs are steered automatically to nodes kept for large requests.

For very high job counts, the NRP is testing **Armada**, a batch meta-scheduler with its own queue per namespace and the `armadactl` client. It is marked experimental and may change. Remember the visibility warning: Armada job specs can be read by every cluster user. See [Scheduling](https://nrp.ai/documentation/userdocs/running/scheduling/).

If your scripts submit jobs from your own computer, the NRP suggests a namespace service account rather than your personal kubeconfig, because personal token refresh does not work well in concurrent runs. A namespace admin creates it; see [client scripts](https://nrp.ai/documentation/userdocs/running/scripts/).

---

## 10. When things go wrong

Start with these three commands. They answer most questions, and NRP support will ask for their output anyway.

```bash
kubectl get pods -l job-name=<job-name>
kubectl describe pod <pod-name>
kubectl logs <pod-name>
```

| What you see | Likely cause | What to do |
| :--- | :--- | :--- |
| `Pending` for a long time | No free node matches your request (GPU type, memory, quota) | Read the Events at the bottom of `kubectl describe pod`. Loosen the GPU affinity or reduce the request. |
| `ContainerCreating` for minutes, with `FailedMount` in the Events | The node cannot mount your volume (we saw a node missing the CephFS driver) | Delete that pod; the Job creates a replacement, usually on another node. If it keeps happening, report the node name in Nautilus Support. |
| `exceeded quota` on a special GPU | The namespace quota for that GPU is 0 | Use `nvidia.com/gpu`, request A100 access, or use `opportunistic`. |
| `forbidden ... high-priority-ban` | A banned `priorityClassName` | Remove the line or use an allowed class. |
| `OOMKilled` | The program used more memory than its limit | Measure peak memory (section 4) and raise request and limit together. |
| `Evicted` | Often scratch space over the ephemeral-storage limit | Request `ephemeral-storage` or write to a volume. |
| `ImagePullBackOff` | Image name or tag is wrong, or the registry is private | Check the name; test with `docker pull` on your computer. |
| `Error`, then a new pod | Your command exited non-zero and the Job is retrying | Read `kubectl logs`; fix and resubmit. |
| Stuck in `Terminating` | Node offline or storage cannot unmount | Wait, or ask in Nautilus Support. Do not force-delete. |

Do not run `kubectl delete --grace-period=0 --force` on a stuck pod. The [NRP FAQ](https://nrp.ai/documentation/userdocs/start/faq/) explains that it can leave resources stuck on the node until it is rebooted.

Python output can look frozen in the logs because it is buffered. Run with `python -u`, or set the environment variable `PYTHONUNBUFFERED=1`.

---

## 11. A checklist before you submit at scale

- [ ] One representative task ran to completion, and you measured its CPU, memory and GPU use.
- [ ] Requests match the measurement; limits are within 20% of requests (equal, if you will run more than about 100 pods).
- [ ] The command does real work and ends on its own. No `sleep`.
- [ ] `parallelism` is set to a number that leaves room for other users. More than 50 GPUs means a plan in Nautilus Support first.
- [ ] Results go to a persistent volume or S3, one file per task, never one shared file.
- [ ] Long or preemptible runs write checkpoints and can resume.
- [ ] No secrets in the spec. Data is non-sensitive (P1).
- [ ] `ttlSecondsAfterFinished` is set, and you will delete finished Jobs and unused volumes.

---

## Getting help

- **NRP documentation:** [Running batch jobs](https://nrp.ai/documentation/userdocs/running/jobs/), [GPU pods](https://nrp.ai/documentation/userdocs/running/gpu-pods/) and [cluster policies](https://nrp.ai/documentation/userdocs/start/policies/).
- **NRP support:** the Nautilus Support chat on Matrix, linked from [nrp.ai/contact](https://nrp.ai/contact). Include your namespace, the pod name, and the output of `kubectl describe pod` and `kubectl logs`, as the NRP's [support guidelines](https://nrp.ai/documentation/userdocs/start/support/) ask.
- **UCR Research Computing:** research-computing@ucr.edu or the [Get help](../../help/) page, for help translating a Slurm workflow to Kubernetes, choosing between Nautilus and the HPCC, or reviewing a manifest.

## Related guides

- [Researcher guide to NRP Nautilus](../kb023-nautilus-researcher-guide/)
- [Getting access to Nautilus: accounts, namespaces and kubectl](../kb024-nautilus-getting-access/)
- [Notebooks, desktops and VS Code in the browser (JupyterHub, Coder)](../kb025-nautilus-jupyter-and-coder/)
- [Storage and moving data on Nautilus](../kb027-nautilus-storage-and-data/)
- [Using the NRP's hosted large language models](../kb028-nautilus-llm-api/)
- [Hosting a lab web tool or service on Nautilus](../kb029-nautilus-hosting-web-tools/)
- [Teaching a class or workshop on Nautilus](../kb030-nautilus-teaching-and-workshops/)
