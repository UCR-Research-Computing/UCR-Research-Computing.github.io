---
title: "Using OSN from compute systems: HPCC, Nautilus, OSPool and notebooks"
kb_id: KB041
topic: Storage
description: "Read inputs from and write results to an OSN bucket from the HPCC, NRP Nautilus, OSPool jobs and Jupyter notebooks, and view results."
audience: "UCR researchers with an OSN bucket who compute on campus or national systems"
reviewed: 2026-10-29
owner: Research Computing
series: osn
series_order: 4
review_notes:
  - "Written 2026-10-29 from the OSN documentation, the OSDF service page (osg-htc.org/services/osdf.html: OSN buckets can be connected to the OSDF on request) and the existing Nautilus and HPCC guides on this site."
  - "CHECK: none of the per-platform patterns have been run against an OSN bucket yet (RC bucket pending 2026-10-29). Test from the HPCC, a Nautilus pod and an OSPool job, then record what was seen."
  - "CHECK: whether rclone is available as an HPCC module; the page tells readers to check with module avail."
---

OSN is reachable over HTTPS from anywhere, so the same bucket can serve every system you use. The pattern is the same everywhere: **pull inputs at the start, push results at the end**, and keep keys out of shared files.

## 1. From the HPCC

Check for rclone with `module avail rclone`, or install a personal copy from [rclone.org](https://rclone.org/downloads/). Put your rclone config in your home directory (`chmod 600` it). In a Slurm job:

```bash
#!/bin/bash
#SBATCH --job-name=osn-example
#SBATCH --time=01:00:00
rclone copy osn:your-bucket/inputs/sample1.csv ./
python analyze.py sample1.csv > sample1_results.csv
rclone copy sample1_results.csv osn:your-bucket/results/
```

For large datasets used repeatedly, copy them once to [HPCC storage](../../services/hpcc-storage/) instead of pulling them in every job.

## 2. From NRP Nautilus

Store the keys as a Kubernetes **Secret** in your namespace, never in the pod spec, and read them as environment variables:

```bash
kubectl create secret generic osn-keys \
  --from-literal=AWS_ACCESS_KEY_ID=YOUR_ACCESS_KEY \
  --from-literal=AWS_SECRET_ACCESS_KEY=YOUR_SECRET_KEY
```

Then use `envFrom: [{secretRef: {name: osn-keys}}]` in the container and the AWS CLI, boto3 or rclone with your endpoint. See [Nautilus storage and data](../kb027-nautilus-storage-and-data/) for how this fits with Nautilus's own storage.

## 3. From OSPool jobs

Two options:

- **Through the OSDF (preferred for data read by many jobs).** Ask the OSG to connect your bucket to the OSDF (see the [OSDF service page](../../services/osdf/)). Jobs then read it with `osdf:///` paths in `transfer_input_files`, and the caches serve it near the jobs.
- **Directly.** For a public bucket, jobs can fetch `https://YOUR_ENDPOINT/your-bucket/file` with `curl` or HTCondor's URL transfer. Avoid sending read-write keys to OSPool machines; they run at many sites.

See [Moving data on the OSPool](../kb036-ospool-moving-data/).

## 4. From Jupyter notebooks

Anywhere you run Python (Nautilus JupyterHub, the HPCC's Open OnDemand, a laptop), use boto3 as in [Moving data in and out of OSN](../kb040-osn-moving-data/). Data libraries such as pandas, xarray and DuckDB can read S3 paths directly once the endpoint and keys are set.

## 5. Viewing results

- **Small results:** download with rclone or Cyberduck and open them locally.
- **Shared results:** a publicly readable bucket gives every file an HTTPS address, which collaborators can open in a browser or load in a notebook.
- **Large results:** analyze them where they are, from a notebook or a job, rather than downloading everything.

## 6. Keeping it tidy

- Delete test and intermediate files. Quota is shared across the project.
- Rotate keys if they may have been exposed (ask [help@osn.mghpcc.org](mailto:help@osn.mghpcc.org)).
- Complete the annual project review and renew before the allocation ends (see [Getting OSN storage](../kb039-osn-getting-storage/)).
