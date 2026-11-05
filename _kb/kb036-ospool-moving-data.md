---
title: "Moving data on the OSPool: home, OSDF, quotas and results"
kb_id: KB036
topic: National
description: "Where files go on an OSPool access point, when to use the OSDF, how jobs read and write osdf:/// paths, quotas, and copying results back to UCR."
audience: "UCR researchers with an OSPool account"
reviewed: 2026-11-05
owner: Research Computing
series: ospool
series_order: 3
review_notes:
  - "Written 2026-10-29 from 'Overview: Data Staging and Transfer to Jobs' and 'Use the OSDF for Larger Inputs and Outputs' (portal.osg-htc.org/documentation/htc_workloads/managing_data/, fetched 2026-10-29) and the Pelican client docs (docs.pelicanplatform.org)."
  - "Tested 2026-10-29: pelican 7.26.3 object ls / get / get -r of public OSDF data from a UCR laptop. A 365 MB public object did not finish within 240 seconds over a home connection; no transfer speeds are quoted."
  - "Tested 2026-11-05 on ap40 by RC: scp file transfers to /home, staging .sif image to /ospool/ap40/data/YOUR_OSG_USERNAME, and jobs reading container images via osdf:/// URLs."
  - "CHECK: transfer_output_remaps syntax for writing outputs directly to OSDF storage is from the OSPool data documentation and was not run directly by RC on ap40."
---

Jobs on the Open Science Pool (OSPool) run across hundreds of independent worker machines distributed across the country. Because these remote compute nodes cannot see your access point file system, every job must bring its inputs with it and send its outputs back. HTCondor handles this file movement automatically, but where you place your data determines how efficiently jobs transfer files.

The OSPool and its data services are strictly for **Non-sensitive only (P1; no protected data)**. Protected data (P2 to P4) must not be stored on the access point or sent to OSPool jobs. [Ask Research Computing](../../help/) where protected data can go.

There is no recharge from UCR for storage or file transfer on OSPool access points and data origins.

---

## 1. Where to put files on the access point

Your access point provides distinct storage locations designed for different file sizes and workflows:

| Location on the access point | Purpose | Default quota |
| :--- | :--- | :--- |
| `/home/YOUR_OSG_USERNAME` | Submit files, executables, scripts, job event logs, and inputs or outputs under 1 GB per job. Always submit jobs from here. | 50 GB |
| `/ospool/apNN/data/YOUR_OSG_USERNAME` | Inputs or outputs exceeding 1 GB, datasets shared across many jobs, and custom container images (`.sif`). Acts as an OSDF origin. | 100 GB |
| `/ospool/uw-shared/projects/PROJECT` | Shared project storage for collaborative groups on OSG access points. | Varies by project |

In these paths, `apNN` represents your assigned access point (for example, `ap40` on `ap40.uw.osg-htc.org`).

Default quotas follow the [OSPool data overview](https://portal.osg-htc.org/documentation/htc_workloads/managing_data/overview/). On access point ap40, running `quota -s` shows a 40 GB soft quota and a 50 GB hard quota for `/home`. Your login message displays your active quota usage. If your work needs more space, contact OSG facilitators at [support@osg-htc.org](mailto:support@osg-htc.org) to request a quota increase.

---

## 2. Transfer files to the access point

You can copy files from your laptop or the [HPCC](../../services/hpcc/) to your access point using standard secure transfer tools such as `scp` or `rsync`.

If you created an SSH configuration alias in `~/.ssh/config` as described in [Getting access to the OSPool](../kb035-ospool-getting-access/), you can use the short alias `ap40`:

```bash
# Copy a project directory with scripts and small inputs to your home directory
scp -r my_project ap40:

# Copy a large reference file or container image to your OSDF data directory
scp reference_v1.tar.gz ap40:/ospool/ap40/data/YOUR_OSG_USERNAME/
```

To sync directories without re-transferring unchanged files, use `rsync`:

```bash
# Sync local input files to a project directory in home
rsync -av my_inputs/ ap40:~/my_project/inputs/

# Sync a large reference dataset to OSDF storage
rsync -av big_reference_v1.tar.gz ap40:/ospool/ap40/data/YOUR_OSG_USERNAME/
```

If you do not use an SSH alias, provide your full OSG username and host:

```bash
scp -r my_project YOUR_OSG_USERNAME@ap40.uw.osg-htc.org:
```

Windows researchers can use PowerShell OpenSSH, WinSCP, or Cyberduck.

For very large datasets, [ask Research Computing](../../help/) about other options, such as sharing them through the [Open Storage Network](../kb038-osn-researcher-guide/).

---

## 3. Small files: let HTCondor move them (the 1 GB rule)

When individual input files and total inputs per job are smaller than 1 GB, let HTCondor move them directly between `/home` and the execute nodes.

In your submit file, declare inputs with `transfer_input_files`:

```text
executable             = analyze.py
arguments              = sample_$(Process).csv
transfer_input_files   = data/sample_$(Process).csv
+JobDurationCategory   = "Medium"
```

Files produced by your job in its remote working directory return automatically to the submission directory in `/home` upon job completion.

Two submit rules apply on OSG access points:

1. Always submit jobs from `/home/YOUR_OSG_USERNAME`. Do not run `condor_submit` from `/ospool/apNN/data/`.
2. Keep your job event log (`log =`) inside `/home`. Access point submit requirements reject jobs whose log path points outside home.

---

## 4. Large files and shared inputs: use OSDF URLs

The Open Science Data Federation (OSDF) is a national network of data origins and regional caches designed for high-throughput data delivery. Files placed in `/ospool/apNN/data/YOUR_OSG_USERNAME` are served through the OSDF origin on your access point.

Use OSDF when:

- An individual input file is larger than 1 GB.
- An input file (of any size) is shared across dozens or hundreds of jobs.
- An output file produced by an individual job exceeds 1 GB.
- You are using a custom Apptainer container image (`.sif`).

Jobs access these files through an `osdf:///` URL in the submit file:

```text
OSDF_LOCATION        = osdf:///ospool/ap40/data/YOUR_OSG_USERNAME
transfer_input_files = $(OSDF_LOCATION)/reference_v1.tar.gz, analyze.py
+JobDurationCategory = "Medium"
```

When the job runs, HTCondor downloads the file through the nearest regional OSDF cache rather than pulling repeatedly from your access point.

### Important: Version your filenames

OSDF caches files across the country by exact URL and filename. If you update a dataset on the access point using the same filename, remote caches may continue serving the older cached copy to executing jobs.

Always include a version number or timestamp in files staged to OSDF:

- Use `reference_v1.tar.gz` and `reference_v2.tar.gz` rather than `reference.tar.gz`.
- Use `weights_2026-11-05.pt` rather than `weights_latest.pt`.

### Staging large outputs to OSDF

Outputs under 1 GB return to `/home` automatically. If a single job generates an output file larger than 1 GB, do not return it to home. Direct HTCondor to deliver it to your OSDF storage space using `transfer_output_remaps`:

```text
OSDF_LOCATION          = osdf:///ospool/ap40/data/YOUR_OSG_USERNAME
transfer_output_remaps = "large_result.tar.gz = $(OSDF_LOCATION)/results/result_$(Cluster)_$(Process).tar.gz"
+JobDurationCategory   = "Medium"
```

The destination directory (in this example, `/ospool/ap40/data/YOUR_OSG_USERNAME/results`) must exist on the access point before jobs finish.

---

## 5. Containers

Containers allow your code to run inside a curated or customized software stack. On the OSPool, container images must come from one of three supported sources:

1. An OSDF URL pointing to an Apptainer `.sif` file in `/ospool/apNN/data/YOUR_OSG_USERNAME/`.
2. A shared CVMFS path maintained by OSG facilitators (`/cvmfs/singularity.opensciencegrid.org/...`).
3. A public container registry image such as Docker Hub (`docker://...`).

### Submit requirement: no container images via file transfer

Access point ap40 enforces a submit requirement rule: container images must not be sent with HTCondor file transfer from local disk. A `container_image` that points at a `.sif` file in your home directory is refused when you submit, with a message pointing you to OSDF.

Stage your custom `.sif` image in your OSDF data directory instead:

```bash
cp analyze-v1.sif /ospool/ap40/data/YOUR_OSG_USERNAME/analyze-v1.sif
```

Then specify the image in your submit file using its OSDF URL:

```text
container_image      = osdf:///ospool/ap40/data/YOUR_OSG_USERNAME/analyze-v1.sif
executable           = /opt/analyze.py
transfer_executable  = false
+JobDurationCategory = "Medium"
```

For curated environments (such as PyTorch or TensorFlow), use the pre-staged CVMFS images:

```text
container_image      = /cvmfs/singularity.opensciencegrid.org/htc/pytorch:2.3.1-cuda11.8
+JobDurationCategory = "Medium"
```

### Apptainer cache tip on the access point

If you build an Apptainer image directly on the access point with `apptainer build`, the tool may fail with the error:

```text
FATAL:   Unable to create build: failed to create build parent dir: stat /home/YOUR_OSG_USERNAME/.apptainer_cache: no such file or directory
```

Fix this by creating the cache directory before running the build:

```bash
mkdir -p ~/.apptainer_cache
```

For guidance on building portable containers for the OSPool and other platforms, see [Containerize your research software with an AI coding agent](../kb049-containerize-your-research/).

---

## 6. Copy results back to UCR

Access point storage is a working and staging scratch environment. It is not backed up storage and is not an archive. Once your jobs finish, transfer your results back to UCR storage systems such as your group storage on the [HPCC](../../services/hpcc/) or [CephRDS](../../services/cephrds/).

Copy results from `/home`:

```bash
# Copy output directory from ap40 to local machine or HPCC
scp -r ap40:~/my_project/out/ ./results/

# Or sync using rsync
rsync -av ap40:~/my_project/out/ ./results/
```

Copy results from your OSDF directory:

```bash
rsync -av ap40:/ospool/ap40/data/YOUR_OSG_USERNAME/results/ ./results/
```

After verifying that your local copies are complete, remove finished output files from the access point to stay well within your quota.

---

## 7. Reading public OSDF data from anywhere with Pelican

The Open Science Data Federation hosts public research datasets that can be read from any machine without an OSG account. The OSG Pelican client command line tool downloads public objects over HTTPS through local cache nodes.

You can inspect or download public validation datasets from your laptop or an HPCC node:

```bash
# List files in a public OSDF path
pelican object ls osdf:///ospool/uc-shared/public/OSG-Staff/validation/

# Download a public folder recursively
pelican object get -r osdf:///ospool/uc-shared/public/OSG-Staff/validation/ ./validation
```

Public reads through Pelican are read-only and require no authentication credentials. For details on sharing your lab's public datasets through OSDF, see the [OSDF service page](../../services/osdf/).

---

## 8. Next steps

- [Submitting OSPool jobs and getting results](../kb037-ospool-jobs-and-results/)
- [GPU jobs on the OSPool](../kb047-ospool-gpu-jobs/)
- [Common OSPool job types: sweeps, Monte Carlo, per-file pipelines and workflows](../kb048-ospool-common-job-types/)
- [Containerize your research software with an AI coding agent](../kb049-containerize-your-research/)
- Need help? OSG facilitators provide assistance at [support@osg-htc.org](mailto:support@osg-htc.org) and host weekly office hours on Tuesdays ([Zoom link](https://osg-htc.org/OfficeHoursZoom)). You can also contact [Research Computing](../../help/) for guidance on submit files and data placement.
