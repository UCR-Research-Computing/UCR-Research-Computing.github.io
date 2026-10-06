---
title: "Teaching a class or workshop on Nautilus"
kb_id: KB030
topic: National
audience: "UCR instructors, TAs and workshop organizers in any discipline who want students to use notebooks, GPUs, Kubernetes or hosted AI models"
reviewed: 2026-10-06
owner: Research Computing
series: nautilus
series_order: 8
review_notes:
  - "Written 2026-10-06 from the NRP documentation (nrp.ai/documentation, fetched 2026-10-06) and tests run in a UCR namespace the same day."
  - "The data-loader Job, the word-count Job (1 CPU / 2Gi, reading a ReadWriteMany rook-cephfs-central volume mounted read-only) and the 4-task Indexed Job in section 8 were run in a UCR namespace on 2026-10-06. The word count finished in about 17 seconds and the Indexed Job in about 23 seconds. All three were deleted afterwards."
  - "CHECK: the hosted JupyterHub runs in the NRP's own namespace (jupyterlab, per the support page). The article infers from this that student servers there cannot mount a volume in the instructor's namespace; confirm with the NRP."
  - "CHECK: the NRP docs do not say how a group gets the LLM capability (the flag that enables LLM keys on a join link). The article sends instructors to the Nautilus Support chat."
  - "CHECK: the docs do not say what happens to Jobs, pods or volumes an attendee created when a join link ends, or how a second join link interacts with the first. The article tells admins to clean up themselves and to add members directly for courses longer than 90 days."
  - "CHECK: whether a course JupyterHub's Deployments need the 2-week exceptions list (the policies say Deployments older than 2 weeks are removed unless the namespace is on the list). The article tells instructors to ask early."
  - "CHECK: the hosted JupyterHub and Coder per-user approval process for a whole class (bulk approval) is not described in the docs."
  - "CHECK: the CILogon EntityID for University of California, Riverside was not looked up; the article points instructors to cilogon.org/idplist."
---

## 1. Why teach on Nautilus?

The National Research Platform (NRP) Nautilus cluster is a shared Kubernetes cluster with CPUs, GPUs and storage contributed by many institutions. For teaching, it can give every student a browser-based notebook, a GPU for a lab exercise, a real cluster to learn Kubernetes on, or a key to the NRP's hosted large language models, without anyone installing software on a laptop. There is no recharge from UCR for using it. The [researcher guide](../kb023-nautilus-researcher-guide/) introduces the platform as a whole.

The NRP has a feature built for this: the **training join link**. You create one link, share it with the class, and everyone who opens it and signs in is added to your namespace until a date you choose (at most 90 days). Then they are removed again. Section 5 walks through it.

Some courses and events that fit well:

* **A one-day Python or R workshop** for graduate students in the social sciences, run entirely in the hosted JupyterHub.
* **A digital humanities lab section** where students count words and named entities across a shelf of public-domain novels, first in a notebook, then as a batch Job on the cluster.
* **An upper-division machine learning course** where each student trains a small model on a GPU in a notebook, then submits a longer training run as a Job.
* **A cloud or distributed-systems course** that teaches Kubernetes on a production cluster instead of a laptop simulator.
* **A workshop on using AI models in research**, where every attendee gets an LLM API key for the day and classifies a sample of text, or builds a small semantic search with embeddings.
* **A bioinformatics or physics lab** that runs the same containerized tool across many inputs with an Indexed Job.

### Before you plan: three ground rules

* **Non-sensitive data only (UCR P1).** The NRP states that its systems have no storage suitable for HIPAA, PII, FISMA, FERPA or other protected data, and that such data must not be stored there. Controlled Unclassified Information (CUI) does not belong there either. For a class this has a specific meaning: **do not put grades, rosters with student IDs, graded submissions or other student records on Nautilus.** Collect and grade work in the campus learning management system. Use public, synthetic or otherwise non-sensitive teaching data. If a course needs P2 or higher data, use the [HPCC](../../services/hpcc/), [Ursa Major](../../services/ursa-major/) or the [Secure Enclave](../../services/secure-enclave/) instead, or [ask Research Computing](../../help/).
* **Non-profit, non-commercial.** The NRP is non-profit and non-commercial, and its Acceptable Use Policy (AUP) applies that to all use, including the hosted models ([fair use page](https://nrp.ai/documentation/userdocs/ai/llm-managed/fair-use/)). University courses and research workshops fit. A paid training product for a company does not.
* **Capacity is shared, not reserved.** Nothing on Nautilus is set aside for your class hour. A popular GPU type may be busy when 30 students ask for it at once. Plan a fallback (Section 10).

---

## 2. Pick a teaching setup

Choose the simplest setup that teaches what you need. Students who only need notebooks should not have to install `kubectl`.

| Setup | Students need | Best for | Effort for you |
| :--- | :--- | :--- | :--- |
| **A. Hosted JupyterHub** | A browser and a UCR (or other institutional) sign-in | Notebook-based labs and workshops in Python, R or Julia; GPU exercises | Low: a training namespace and a join link |
| **B. Coder workspaces** | A browser, plus approval from the NRP admins | VS Code, RStudio or a full Linux desktop in the browser | Medium: each student's Coder account must be approved |
| **C. Hands-on Kubernetes** | `kubectl`, the kubelogin plugin and the NRP config on their own computer | Teaching containers, Jobs, storage and clusters | Medium: setup support before the first session |
| **D. Hosted AI models** | A browser or a few lines of Python, and an LLM key | Prompting, classification, embeddings and AI-in-research workshops | Low, if your namespace has LLM access |
| **E. Your own JupyterHub** | A browser | A full course with a custom image, a shared class folder and your own sign-in rules | High: Helm, Kubernetes and ongoing upkeep |

You can combine them. A common pattern for a short workshop is A plus D: notebooks in the hosted JupyterHub, with each attendee's LLM key handed out by the same join link.

---

## 3. Timeline: what to do when

Several steps depend on approvals by the NRP team, and how long those take varies. Start early.

**Several weeks before**

1. Sign in at [nrp.ai](https://nrp.ai) once, accept the AUP, and make sure you are (or can become) a namespace admin. See Section 4.
2. Create a namespace just for the class.
3. If you want LLM keys for attendees, check whether the namespace has LLM access (Section 5). If not, ask about it in the Nautilus Support chat.
4. If you plan to use Coder (setup B) or run your own JupyterHub (setup E), ask in the Nautilus Support chat now. Coder accounts need admin approval, and a long-running hub may need an exception (Section 9).
5. Build and test your materials on the cluster yourself, using the same hardware choices students will make.

**One to two weeks before**

1. Create the join link (Section 5) and send it with a short "before the first session" note: sign in, accept the AUP, and (for setup C) install `kubectl` following [KB024](../kb024-nautilus-getting-access/).
2. Ask a TA or a colleague who is *not* already a member of the namespace to try the link from start to finish. You cannot test it fully yourself, because admins are never added or removed by a join link.
3. Put class data where students can reach it (Section 6 or 8).

**On the day**

1. Open the NRP Grafana namespace dashboard and the portal's **Violations** page in a browser tab.
2. Have a CPU-only version of any GPU exercise ready.
3. Start with ten minutes on the rules in Section 10.

**Afterwards**

1. End the link, or let it expire.
2. Delete the class's Jobs, pods, volumes and buckets (Section 11).

---

## 4. Set up a namespace for the class

On Nautilus, a **namespace** is your group's isolated space on the cluster. Every member of a namespace has the same edit access to everything in it. Students added to your research namespace could see, and delete, your lab's jobs and data. So the NRP's own advice is to **use a namespace set up for the training** if attendees should not see your other work ([Training join links](https://nrp.ai/documentation/userdocs/start/training-join-links/)).

1. **Become an admin.** Faculty, staff and postdocs can request their own group with the namespace request form, linked from the NRP [Getting access](https://nrp.ai/documentation/userdocs/start/getting-started/) page. Sign in at nrp.ai first. A PhD or master's student (for example, the course TA) can be a namespace admin if their supervisor submits the form for them. [KB024](../kb024-nautilus-getting-access/) has the details.
2. **Create a namespace for the course** on the [Namespaces page](https://nrp.ai/namespaces). Use lowercase letters, numbers and dashes, and a name that says whose it is and what it is for, such as `ucr-smithlab-ling100`. The NRP asks people to avoid generic names.
3. **Add your TAs directly** as members (they must have signed in once). People you add yourself are never removed by a join link, so TAs keep access after the class ends until you remove them.
4. **Look at the namespace's limits** if you will use `kubectl`:

```bash
kubectl get resourcequota -n ucr-example
kubectl describe limitrange -n ucr-example
```

In the UCR namespace we tested, the quotas for NVIDIA A100, H100, H200 and GH200 GPUs were all 0, and the default scratch-disk limit was 50Gi per container. Regular GPUs (the `nvidia.com/gpu` resource) were not under those quotas. That is fine for teaching; plan exercises around regular GPUs. [KB026](../kb026-nautilus-batch-jobs-and-gpus/) explains GPU types.

Remember that the namespace admin **is personally responsible for everything that runs in the namespace** ([hierarchy page](https://nrp.ai/documentation/userdocs/start/hierarchy/)). During a course, that includes every student's work.

---

## 5. Create a training join link

A training join link adds attendees to your namespace without you adding them one by one. This section follows the NRP's [Training join links](https://nrp.ai/documentation/userdocs/start/training-join-links/) page.

### What attendees get

* **Membership of the namespace** until access ends. With membership they can use the hosted JupyterHub and run work in the namespace.
* **Kubernetes edit access**, if the namespace has Kubernetes enabled. This is the same access any member has.
* **An LLM API key**, if you turn on *Also give each attendee an LLM API key*. This option appears only on namespaces with LLM access.

### Create the link

1. Open the [Namespaces page](https://nrp.ai/namespaces) and select the class namespace.
2. Under **Training join links**, fill in:
   * **Training name**, for example `LING 100 Fall 2026` or `AI for Social Science workshop`.
   * **Maximum number of attendees.** Set it a little above your roster so late adds can join.
   * **When joins stop being accepted**, for example the end of the add/drop period, or the end of a one-day workshop.
   * **When access ends.** At most 90 days after you create it. For a quarter-long course, pick a date after finals week; a ten-week quarter plus finals week fits inside 90 days if you create the link close to the start of term.
   * **Also give each attendee an LLM API key** (only shown if the namespace has LLM access).
3. Select **Create join link**, then copy the link from the table and share it, for example on the course site.

### What attendees see

The link opens a **Join a Training** page. Attendees sign in to the NRP with their institution (UCR students choose University of California, Riverside at CILogon), or another provider offered on the login page, which helps for visitors from other campuses. A first sign-in creates their NRP account. They are then added to the namespace and told when their access ends.

* If the link gives LLM keys, the page shows the attendee's key and the base URL to use. **If someone loses their key, they open the link again.** That replaces their training key and does not use up another seat.
* If the namespace has Kubernetes enabled, the page points them to the `kubectl` setup instructions.

In our tests, membership changes reached the cluster in about a minute. A student who set up `kubectl` *before* joining may need to refresh their sign-in with `kubectl oidc-login clean`, because the Kubernetes token lasts half an hour.

### When the training ends

| If you want to | Do this | Effect |
| :--- | :--- | :--- |
| Stop new sign-ups (for example after add/drop) | **Revoke** | No new joins. People who already joined keep access until it ends. |
| End access early | **End now** | No new joins, and attendees are removed up to 15 minutes later. |
| Let it run its course | Nothing | At the access end date, everyone the link added is removed up to 15 minutes later and you get an email summary. Their LLM keys in the namespace are revoked a few minutes after that. A `kubectl` login they already had can keep working for up to 30 more minutes, until its token expires. |

People who were already members, people you added yourself and namespace admins are never removed. Attendees keep their NRP accounts afterwards.

**Courses longer than 90 days.** A join link cannot run past 90 days. For a longer course, add students directly as members on the Namespaces page instead, and remove them yourself at the end of term.

---

## 6. Setup A: a notebook lab on the hosted JupyterHub

The NRP runs a JupyterHub at [jupyterhub-west.nrp-nautilus.io](https://jupyterhub-west.nrp-nautilus.io). It is the easiest way to put a class on the cluster: students sign in, pick hardware and a software image, and get JupyterLab in the browser. [KB025](../kb025-nautilus-jupyter-and-coder/) covers it in depth. What matters for teaching:

* **Students must be in a namespace** before the hub will start a server for them. The join link takes care of that.
* **Each student has a 5 GB home folder** to start (larger on request). Design exercises to fit; 30 students each asking for more space is not a good plan.
* **A server shuts down 1 hour after the browser disconnects** ([JupyterHub service](https://nrp.ai/documentation/userdocs/jupyter/jupyterhub-service/)). Files in the home folder persist, but a running cell does not. Tell students to save often and not to leave long computations running in a closed tab.
* **Images.** The hub offers the NRP's scientific images, built on the Jupyter Docker Stacks and B-Data projects, including Python images with TensorFlow and PyTorch and a desktop image ([Scientific images](https://nrp.ai/documentation/userdocs/running/sci-img/)). Tell students exactly which image to pick, and test your notebooks on that image. Missing libraries can be installed with `pip install --user` in a notebook cell, or you can ask in the Nautilus Support chat for a library to be added to the NRP image.
* **Hardware.** Tell students exactly what to choose at spawn. Ask for a GPU only in the sessions that need one.

### Getting notebooks and data to students

The hosted hub runs in the NRP's own namespace, not yours, so students' servers there cannot simply mount a volume from your class namespace. Two simple ways to hand out materials:

* **Notebooks and small files: a Git repository.** Put the course notebooks in a repository (on GitHub, or on the NRP's own [GitLab](https://nrp.ai/documentation/userdocs/development/gitlab/)). Students run `git clone` in a JupyterLab terminal at the start of the session and `git pull` for updates.
* **Larger data files: a public object in NRP S3.** Get S3 keys from the NRP portal (**User**, then **S3 Tokens**), create a bucket, and upload with public-read access. Anyone with the URL can then download the file ([Ceph S3](https://nrp.ai/documentation/userdocs/storage/ceph-s3/)). Only do this for data you are allowed to share publicly, and check the license.

```bash
# On your own computer, with s3cmd configured for https://s3-west.nrp-nautilus.io
s3cmd mb s3://ucr-example-ling100
s3cmd put -P novels.zip s3://ucr-example-ling100/
```

Students then download it in a notebook cell or terminal:

```bash
curl -O https://s3-west.nrp-nautilus.io/ucr-example-ling100/novels.zip
unzip novels.zip
```

[KB027](../kb027-nautilus-storage-and-data/) explains S3 keys, endpoints and tools.

### A sample lesson outline (two hours)

1. Ten minutes: sign in, open the hub, start the image you specified on CPU only.
2. Five minutes: `git clone` the course repository and download the data.
3. An hour of exercises in the notebook.
4. Twenty minutes: stop the server, restart it with one GPU, and rerun one cell to compare timing. (In our test, a single-GPU pod landed on an NVIDIA RTX A4000 and measured about 40 TFLOPS on a PyTorch half-precision matrix multiply; your students may land on other GPU types.)
5. Shut down: stop the server from the hub's control panel, so the GPU goes back to the pool.

---

## 7. Setup B: Coder workspaces

The NRP's [Coder](https://coder.nrp-nautilus.io) gives each user up to 5 workspaces from templates: a general template with JupyterLab, VS Code and a noVNC desktop; a KDE desktop streamed to the browser (Selkies) with PyCharm, LibreOffice and Firefox; CUDA, PyTorch and TensorFlow; RStudio; and FPGA development ([Using Coder](https://nrp.ai/documentation/userdocs/coder/coder/)). Each workspace has a persistent home folder that starts at 5 GB.

Coder suits courses that need an IDE or a graphical Linux desktop rather than notebooks: a software engineering course, a GIS or visualization course that needs a desktop app, or an FPGA lab. Two things to plan for:

* **Every student's Coder account must be approved** by the NRP admins, after the student is in a namespace. Ask in the Nautilus Support chat well before the course and explain the class size and dates.
* **Deleting a workspace deletes its storage.** Tell students to keep their code in Git (each workspace comes with an SSH key for the NRP GitLab) before they delete or rebuild a workspace.

---

## 8. Setup C: a hands-on Kubernetes workshop

If the point of the class is to learn how clusters work, students run `kubectl` themselves. The NRP's own [tutorials](https://nrp.ai/documentation/userdocs/tutorial/introduction/) (basic Kubernetes, storage, Docker, Jobs) make good assigned reading. The NRP notes that comfort with the Unix command line is the biggest predictor of success, so say so in the course description.

### Get setup out of the way first

Installing `kubectl`, the kubelogin plugin and the NRP config file is the step that eats workshop time. Send [KB024](../kb024-nautilus-getting-access/) with the join link a week ahead, and ask students to run this before the first session:

```bash
kubectl config set-context nautilus --namespace=ucr-example
kubectl get pods
```

A successful sign-in followed by `No resources found in ucr-example namespace.` means they are ready. Hold a short drop-in session for anyone who is stuck. Students on Windows may need the WSL notes on the NRP [Getting access](https://nrp.ai/documentation/userdocs/start/getting-started/) page.

### Shared class data on a volume

A CephFS volume (`ReadWriteMany`) can be mounted by many pods at once, so every student's Job can read the same class data. Create it once, as the admin:

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: class-data
spec:
  storageClassName: rook-cephfs-central
  accessModes:
    - ReadWriteMany
  resources:
    requests:
      storage: 20Gi
```

Then load it with a one-off Job. This one downloads a public-domain novel from Project Gutenberg:

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: load-class-data
spec:
  backoffLimit: 1
  template:
    spec:
      restartPolicy: Never
      containers:
      - name: load
        image: python:3.12-slim
        command: ["sh", "-c"]
        args:
          - mkdir -p /data/texts && python -c "import urllib.request as u; u.urlretrieve('https://www.gutenberg.org/cache/epub/1342/pg1342.txt', '/data/texts/pride.txt')" && ls -l /data/texts
        resources:
          requests:
            cpu: "1"
            memory: 2Gi
          limits:
            cpu: "1"
            memory: 2Gi
        volumeMounts:
        - name: class-data
          mountPath: /data
      volumes:
      - name: class-data
        persistentVolumeClaim:
          claimName: class-data
```

```bash
kubectl apply -n ucr-example -f class-data-pvc.yaml
kubectl apply -n ucr-example -f load-class-data.yaml
kubectl logs -n ucr-example job/load-class-data
```

Two cautions from the NRP's [Ceph page](https://nrp.ai/documentation/userdocs/storage/ceph/): do not install conda or pip packages on any CephFS volume (it is prohibited), and do not have many pods write to the same file at once. Every member of the namespace can delete the volume, so keep a master copy of the data somewhere else (for example in S3), and have students mount it read-only.

### A first student exercise: a word-count Job

Each student copies this file, replaces `STUDENT` with their own UCR NetID (lowercase), and submits it. It reads the shared texts and prints the ten most common words.

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: wordcount-STUDENT
  labels:
    course: workshop
    student: STUDENT
spec:
  backoffLimit: 2
  ttlSecondsAfterFinished: 86400
  template:
    metadata:
      labels:
        course: workshop
        student: STUDENT
    spec:
      restartPolicy: Never
      containers:
      - name: count
        image: python:3.12-slim
        command: ["python", "-c"]
        args:
          - |
            import collections, glob
            words = collections.Counter()
            for path in glob.glob("/data/texts/*.txt"):
                with open(path, encoding="utf-8") as f:
                    words.update(f.read().lower().split())
            for word, n in words.most_common(10):
                print(n, word)
        resources:
          requests:
            cpu: "1"
            memory: 2Gi
          limits:
            cpu: "1"
            memory: 2Gi
        volumeMounts:
        - name: class-data
          mountPath: /data
          readOnly: true
      volumes:
      - name: class-data
        persistentVolumeClaim:
          claimName: class-data
```

```bash
kubectl apply -n ucr-example -f wordcount.yaml
kubectl get pods -n ucr-example -l student=jdoe
kubectl logs -n ucr-example job/wordcount-jdoe
```

In our test it finished in about 17 seconds and printed counts for "the", "to", "of" and so on. That opens a good discussion about stop words. A few design choices are worth pointing out to students:

* **The student's name is in the Job name and labels.** Everyone in the namespace shares one space, so unique names stop students from overwriting each other's Jobs, and `-l student=jdoe` filters to their own pods.
* **1 CPU and 2Gi, with limits equal to requests.** The NRP requires limits within 20% of requests, and pods at 1 CPU and 2 GB are exempt from the usage-violation rules ([Cluster Policies](https://nrp.ai/documentation/userdocs/start/policies/)). That makes it a safe size for beginners.
* **`ttlSecondsAfterFinished: 86400`** is standard Kubernetes: the finished Job and its pods are deleted a day later, so the namespace does not fill up with old pods.

### A second exercise: a parallel sweep with an Indexed Job

An Indexed Job runs the same container several times, each with a different `JOB_COMPLETION_INDEX`. It is the Kubernetes version of a job array, and it maps neatly onto parameter sweeps, per-sample pipelines and simulations. This one estimates pi four times with different random seeds, two at a time:

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: sweep-STUDENT
  labels:
    course: workshop
    student: STUDENT
spec:
  completionMode: Indexed
  completions: 4
  parallelism: 2
  backoffLimit: 2
  ttlSecondsAfterFinished: 86400
  template:
    metadata:
      labels:
        course: workshop
        student: STUDENT
    spec:
      restartPolicy: Never
      containers:
      - name: worker
        image: python:3.12-slim
        command: ["python", "-c"]
        args:
          - |
            import os, random
            i = int(os.environ["JOB_COMPLETION_INDEX"])
            random.seed(i)
            inside = sum(1 for _ in range(2_000_000)
                         if random.random() ** 2 + random.random() ** 2 <= 1)
            print(f"worker {i}: pi is about {4 * inside / 2_000_000:.4f}")
        resources:
          requests:
            cpu: "1"
            memory: 2Gi
          limits:
            cpu: "1"
            memory: 2Gi
```

```bash
kubectl apply -n ucr-example -f sweep.yaml
kubectl wait -n ucr-example --for=condition=complete job/sweep-jdoe --timeout=300s
kubectl logs -n ucr-example -l job-name=sweep-jdoe
```

In our test all four workers finished in about 23 seconds, each printing an estimate between 3.139 and 3.143. Ask students to change `parallelism` and watch how the pods are scheduled with `kubectl get pods -w`.

Keep the class total modest. The NRP asks users not to submit more than 400 Jobs at once ([Using Nautilus](https://nrp.ai/documentation/userdocs/start/using-nautilus/)), and with 30 students each submitting a few Jobs you are well under that. [KB026](../kb026-nautilus-batch-jobs-and-gpus/) goes further, into GPUs, building your own images and longer runs.

---

## 9. Setups D and E: hosted AI models, and your own JupyterHub

### D: a workshop on the hosted language models

The NRP hosts a rotating catalog of open-weights language and embedding models behind an OpenAI-compatible API at `https://ellm.nrp-nautilus.io/v1`. [KB028](../kb028-nautilus-llm-api/) covers the API in detail. For a workshop, the join link can hand each attendee their own key, shown on the join page with the base URL, if your namespace has LLM access.

Exercises that work across disciplines:

* **No code:** chat with several models in the NRP's browser chat interface and compare their answers to the same prompt ([Chat interfaces](https://nrp.ai/documentation/userdocs/ai/llm-managed/chat-interfaces/)).
* **Text classification:** label a sample of open-ended survey answers, tweets or abstracts as positive, negative or neutral. In our test, a sentiment-classification prompt to `gpt-oss` answered in 2.3 seconds.
* **Semantic search:** embed short texts with `qwen3-embedding`, then rank them by cosine similarity. In our test "drought tolerance in citrus" scored 0.70 against "water stress in orange trees" and 0.29 against "quantum error correction", which makes the idea concrete in one slide.

A minimal notebook cell, with the attendee's key in an environment variable rather than typed into the notebook:

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["OPENAI_API_KEY"],
    base_url="https://ellm.nrp-nautilus.io/v1",
)
reply = client.chat.completions.create(
    model="gpt-oss",
    messages=[{"role": "user", "content": "Classify the sentiment of: 'The new bus route saves me an hour a day.'"}],
)
print(reply.choices[0].message.content)
```

Things to tell attendees, from the NRP's [fair use](https://nrp.ai/documentation/userdocs/ai/llm-managed/fair-use/) and [API access](https://nrp.ai/documentation/userdocs/ai/llm-managed/api-access/) pages:

* **Rate limits apply per key and per model.** The gateway allows 200,000 output tokens per minute per API token and model, then returns HTTP 429. Concurrency limits per user also apply (for example, 16 parallel requests for `gpt-oss`, fewer for the largest models). Because each attendee has their own key, one person's loop does not use up another's allowance, but a whole room hammering one large model can still slow it down. Teach a retry with back-off.
* **Models change.** Models are added and retired over time. Have students list the current ones with a request to `/v1/models` instead of hard-coding a name you checked months ago.
* **Prompts can be cached across users** unless a request sets a private `cache_salt`. That matters if attendees paste anything they would not want to share.
* **The data rules still apply.** Non-sensitive material only. No student records, no interview transcripts with identifiable people, nothing under a data use agreement.

Training LLM keys in the namespace are revoked a few minutes after the join link's access ends.

### E: your own JupyterHub for a course

For a full course that needs a custom image, a shared class folder and your own sign-in rules, a namespace admin can deploy JupyterHub with Helm, following the NRP's [Deploy JupyterHub](https://nrp.ai/documentation/userdocs/jupyter/jupyterhub/) guide and its [values template](https://nrp.ai/documentation/userdocs/jupyter/values/). This needs Kubernetes and Helm experience and someone to look after it all term. The main steps are: choose a host name (`<name>.nrp-nautilus.io`), register a CILogon application, configure the Helm values, and install the chart.

The NRP sets firm conditions:

* **Culling is mandatory.** Idle servers must be shut down after no more than 6 hours. The NRP's example uses 1 hour:

```yaml
cull:
  enabled: true
  users: false
  removeNamedServers: false
  timeout: 3600
  every: 600
  concurrency: 10
  maxAge: 0
```

* **Do not leave the hub open to anyone.** Restrict sign-in with `allowed_idps` (UCR, plus any partner institutions; look up each EntityID at [cilogon.org/idplist](https://cilogon.org/idplist/)) or with an `allowed_users` list of student emails. The NRP recommends a list of individuals for small classes, and warns that an open hub can get the namespace locked.
* **Add the NRP admins as hub admins**, as the guide recommends, so they can help when something breaks.
* **Long-running services need an exception.** Deployments older than 2 weeks are removed unless the namespace is on the exceptions list ([Cluster Policies](https://nrp.ai/documentation/userdocs/start/policies/)), and pods without a controller are removed after 6 hours unless the namespace has an exception for running JupyterHub. Ask in the Nautilus Support chat before term starts, with the dates and a short description of the course.

Features that help teaching, all described in the guide:

* **A course image.** Add your own image to `profileList` so every student gets the same packages. Build it from a Jupyter base image and push it to the NRP GitLab registry; GitLab CI can build it for you.
* **A shared class folder.** Mount a `ReadWriteMany` volume (CephFS) at a path such as `/home/shared` for read-only course data. Do not install conda or pip packages there.
* **Per-student conda environments** that persist across sessions, using `nb_conda_kernels` and a `.condarc` that points into the student's home folder.

If you are considering this for a course, [contact Research Computing](../../help/) early. Section 2's setup A is often enough.

---

## 10. Rules to teach on day one

Students act inside your namespace, so their mistakes land on you. Ten minutes on these, taken from the NRP [Cluster Policies](https://nrp.ai/documentation/userdocs/start/policies/), prevents most problems:

* **Never run a Job whose command is `sleep`**, or a script that ends with `sleep`. Users who do are banned from the cluster. A Job must do real work and then exit.
* **Bare pods are for short interactive use only.** A pod without a controller is destroyed after 6 hours and is limited to 2 GPUs, 32 GB RAM and 16 CPU cores. Use a Job for real runs.
* **Ask only for what you use, and set limits within 20% of requests.** Each user may run no more than 4 pods that miss the usage targets (GPU use above 40% of what was requested, CPU 20 to 200%, memory 20 to 150%). Pods at 1 CPU and 2 GB are exempt. Admins ban namespaces that keep requesting resources they do not use.
* **Give GPUs back.** A requested GPU is unavailable to anyone else until the pod stops. Stop notebook servers and delete finished pods.
* **No secrets in specs.** Job specs are visible to other cluster users. Never paste a password, token or LLM key into a YAML file; use a Kubernetes Secret.
* **Do not force-delete stuck pods** with `--grace-period=0 --force`. The [FAQ](https://nrp.ai/documentation/userdocs/start/faq/) explains why; tell the instructor instead.
* **Nautilus is not storage for keeps.** Volumes not accessed for 6 months can be purged without notice. Students should keep their own copies of anything they want.
* **Non-sensitive data only**, and non-commercial use only.

### Plan for busy hardware

Because capacity is shared, a class-wide GPU request can leave some students waiting in `Pending`. Ways to soften it:

* Have a CPU-only path through every GPU exercise, with smaller data.
* Ask for one regular GPU (`nvidia.com/gpu: 1`), not a specific model, unless the exercise depends on it.
* Do not plan around A100, H100, H200 or GH200 GPUs. Their quotas start at 0. A pod can set `priorityClassName: opportunistic` to bypass the GPU quota, but it can be preempted at any time ([Opportunistic use](https://nrp.ai/documentation/userdocs/running/priority-classes/)), which is a poor basis for a timed lab.
* Stagger GPU sections, or have students pair up on one GPU server.

### Watch the class while it runs

The NRP's Grafana namespace dashboard shows how much CPU, memory and GPU your namespace requested and used ([Monitoring](https://nrp.ai/documentation/userdocs/running/monitoring/)). The portal's **Violations** page lists pods that miss the usage targets. With `kubectl`, the course labels make it easy to see everything at once:

```bash
kubectl get pods -n ucr-example -l course=workshop -L student
```

---

## 11. After the class: clean up

The join link removes attendees from the namespace, but you are still the admin of whatever they left behind. Within a day or two of the last session:

1. **End or revoke the join link** if it has not expired. Remove any TAs or visitors you added yourself who no longer need access.
2. **Delete leftover workloads**, using the course label if you used one:

```bash
kubectl get jobs,pods,deployments -n ucr-example
kubectl delete jobs -n ucr-example -l course=workshop
```

3. **Delete volumes you no longer need.** Deleting a volume deletes its data, so copy out anything you want to reuse next term first.

```bash
kubectl get pvc -n ucr-example
kubectl delete pvc -n ucr-example class-data
```

4. **Empty and remove class S3 buckets**, or at least remove public access from anything that should not stay public. The [Ceph S3](https://nrp.ai/documentation/userdocs/storage/ceph-s3/) page shows how to delete buckets with rclone.
5. **Shut down a course JupyterHub** (setup E) with `helm uninstall`, and tell the NRP in the Nautilus Support chat if you had asked for an exception.
6. **Keep notes** on what worked, what students tripped on and how long setup took. The NRP's JupyterHub guide recommends keeping a running document of how a hub is set up; the same habit helps any course you will teach again.

---

## 12. Troubleshooting

| Symptom | Likely cause | What to do |
| :--- | :--- | :--- |
| A student opened the link but the hub will not start a server | They signed in but did not finish joining, or the link's join window closed | Have them open the link again and check [nrp.ai/namespaces](https://nrp.ai/namespaces), where namespaces they belong to are shown in bold |
| A late add cannot join | The maximum number of attendees is reached, or joins have stopped | Add the student directly on the Namespaces page |
| `kubectl` says `Forbidden` right after joining | Their token predates the membership | `kubectl oidc-login clean`, then try again |
| A student lost their LLM key | Keys are shown on the join page | Open the link again; it issues a replacement and does not use a seat |
| No LLM key option when creating the link | The namespace does not have LLM access | Ask in the Nautilus Support chat |
| Many pods stuck in `Pending` | The requested GPU type is busy, or requests are too large | Switch to the CPU path, ask for a regular GPU, or reduce requests; `kubectl describe pod <name>` shows the reason |
| A student's Job was overwritten or deleted | Two students used the same Job name | Use the NetID in every name and label |
| Student servers vanished overnight | The hosted hub stops a server 1 hour after the browser disconnects | Work in the home folder persists; move long runs to Jobs |
| Coder says the account is not approved | Coder accounts need NRP admin approval | Ask in the Nautilus Support chat, ideally before the course starts |

---

## Getting help

* **NRP documentation:** [nrp.ai/documentation](https://nrp.ai/documentation/), especially [Training join links](https://nrp.ai/documentation/userdocs/start/training-join-links/) and the [Cluster Policies](https://nrp.ai/documentation/userdocs/start/policies/).
* **NRP support:** the Nautilus Support chat on Matrix (joining steps are on the [Getting access](https://nrp.ai/documentation/userdocs/start/getting-started/) page) and the [NRP contact page](https://nrp.ai/contact). Ask there about Coder approvals, LLM access, exceptions for a course JupyterHub and larger home folders. Include your namespace, and the pod name if something failed ([Asking for support](https://nrp.ai/documentation/userdocs/start/support/)). Students should normally ask you or the TA first.
* **UCR Research Computing:** research-computing@ucr.edu or the [Get help](../../help/) page. We can help you choose a teaching setup, plan a namespace for a course, or decide whether Nautilus, the HPCC or another service fits the class. We do not run the NRP and cannot approve NRP accounts or change NRP quotas.

## Related guides

1. [Researcher guide to NRP Nautilus](../kb023-nautilus-researcher-guide/)
2. [Getting access to Nautilus: accounts, namespaces and kubectl](../kb024-nautilus-getting-access/)
3. [Notebooks, desktops and VS Code in the browser (JupyterHub, Coder)](../kb025-nautilus-jupyter-and-coder/)
4. [Running batch jobs and GPU work with Kubernetes](../kb026-nautilus-batch-jobs-and-gpus/)
5. [Storage and moving data on Nautilus](../kb027-nautilus-storage-and-data/)
6. [Using the NRP's hosted large language models](../kb028-nautilus-llm-api/)
7. [Hosting a lab web tool or service on Nautilus](../kb029-nautilus-hosting-web-tools/)
8. Teaching a class or workshop on Nautilus (this article)
