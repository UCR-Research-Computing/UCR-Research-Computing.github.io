---
title: "Moving data on the OSPool: home, OSDF, quotas and results"
kb_id: KB036
topic: National
description: "Where files go on an OSPool access point, when to use the OSDF, how jobs read and write osdf:/// paths, quotas, and copying results back to UCR."
audience: "UCR researchers with an OSPool account"
reviewed: 2026-10-29
owner: Research Computing
series: ospool
series_order: 3
review_notes:
  - "Written 2026-10-29 from 'Overview: Data Staging and Transfer to Jobs' and 'Use the OSDF for Larger Inputs and Outputs' (portal.osg-htc.org/documentation/htc_workloads/managing_data/, fetched 2026-10-29) and the Pelican client docs (docs.pelicanplatform.org)."
  - "Tested 2026-10-29: pelican 7.26.3 object ls / get / get -r of public OSDF data from a UCR laptop. A 365 MB public object did not finish within 240 seconds over a home connection; no transfer speeds are quoted."
  - "CHECK: the access point commands (scp/rsync to /home and /ospool/apNN/data, transfer_output_remaps) are from the OSPool docs and were not yet run by RC. Run them after the first RC access point login."
  - "Quotas (home 50GB, /ospool/*/data 100GB) are from the OSPool data overview page, fetched 2026-10-29; OSG may change them."
---

Jobs on the OSPool run on machines all over the country that cannot see your access point's files. Each job has to bring its inputs along and send its outputs back. HTCondor does that for you once you say which files to move.

## 1. Where to put files

| Location on the access point | Use it for | Default quota |
| --- | --- | --- |
| `/home/your_username` | Scripts, submit files, inputs and outputs under 1 GB per job. Always submit jobs from here. | 50 GB |
| `/ospool/apNN/data/your_username` | Inputs or outputs over 1 GB, inputs shared by many jobs, and container images (`.sif`) | 100 GB |
| `/ospool/uw-shared/projects/PROJECT` | Files shared with your OSPool project group | varies |

`apNN` is your access point (for example `ap40`). Quotas are from the [OSPool data overview](https://portal.osg-htc.org/documentation/htc_workloads/managing_data/overview/); your login message shows the current ones, and the OSG takes requests for more.

## 2. Get files onto the access point

From your laptop or the HPCC, use `scp` or `rsync` (WinSCP works on Windows):

```bash
rsync -av my_inputs/ your_username@apNN.uw.osg-htc.org:~/project1/
rsync -av big_reference.tar.gz your_username@apNN.uw.osg-htc.org:/ospool/apNN/data/your_username/
```

For very large datasets, talk to Research Computing about [Globus](../globus-transfer/) or about publishing the data through the [Open Storage Network](../kb038-osn-researcher-guide/).

## 3. Small files: let HTCondor move them

List inputs in the submit file. Outputs the job writes in its working directory come back to the submit directory automatically:

```
transfer_input_files = data/sample_$(Process).csv, analysis.py
```

## 4. Larger files: use OSDF paths

Files under `/ospool/apNN/data/your_username` are reachable from jobs as `osdf:///ospool/apNN/data/your_username/...`. Use that path in the submit file and HTCondor fetches the file through the OSDF caches:

```
OSDF_LOCATION = osdf:///ospool/apNN/data/your_username
transfer_input_files = $(OSDF_LOCATION)/reference_v2.tar.gz, analysis.py
```

Send a large output straight to OSDF storage instead of your home directory:

```
transfer_output_remaps = "results.tar.gz = $(OSDF_LOCATION)/results_$(Cluster)_$(Process).tar.gz"
```

**Caches keep old copies.** Never overwrite a file under the same name. Put a version or date in the name (`reference_v2.tar.gz`, `container_2026-10-29.sif`).

## 5. Containers

Put Apptainer images (`.sif`) in your OSDF space and point the submit file at them, as in the OSPool [containers guide](https://portal.osg-htc.org/documentation/htc_workloads/using_software/containers/).

## 6. Bring results home

Copy results from the access point back to UCR storage, for example to the HPCC or [CephRDS](../../services/cephrds/):

```bash
rsync -av your_username@apNN.uw.osg-htc.org:~/project1/results/ ./results/
```

Access point storage is working space, not backed up storage. Keep your own copy of anything you need.

## 7. Reading public OSDF data from anywhere

The `pelican` client reads public OSDF data from a laptop, the HPCC or a notebook, with no account:

```bash
pelican object ls osdf:///ospool/uc-shared/public/OSG-Staff/validation/
pelican object get -r osdf:///ospool/uc-shared/public/OSG-Staff/validation/ ./validation
```

Next: [Submitting jobs and getting results](../kb037-ospool-jobs-and-results/).
