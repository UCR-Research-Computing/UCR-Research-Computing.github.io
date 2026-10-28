---
title: "Using CephRDS from the command line with rds-cli"
kb_id: KB032
topic: Storage
description: "Install rds-cli, save your CephRDS keys once, then list, upload, download, check your quota, share files and copy to Google Cloud Storage."
audience: "UCR Faculty, Postdocs, Researchers & Students with a CephRDS bucket"
reviewed: 2026-10-28
owner: Research Computing
review_notes:
  - "2026-10-28: new article. Written from the rds-cli 0.1.13 source (src/rds_cli/main.py, config.py, client.py) and its README; the unit tests pass (20). Not yet run against rds.ucr.edu."
  - "CHECK: run every command on this page against a real bucket over the VPN and from HPCC before relying on it."
  - "CHECK: bucket-info reads the x-rgw-quota-bucket-size header from a HEAD request; confirm the CephRDS gateway returns it (the quota line is skipped when it does not)."
---

[rds-cli](https://github.com/UCR-Research-Computing/rds-cli) is a small open-source command-line tool from UCR Research Computing for CephRDS. It already knows the CephRDS endpoint and its settings, so after a one-time setup you can move data with short commands instead of configuring a general S3 tool.

Use it when you want to:

- list your buckets and files, and check how much of your quota you have used;
- upload or download whole folders (it transfers up to 10 files at a time);
- make a temporary download link to share one file;
- copy files between CephRDS and Google Cloud Storage.

For drag-and-drop transfers, see [KB019](../kb019-cephrds-gui-clients/). To make a bucket look like a folder, see [KB020](../kb020-cephrds-mounting-folders/). For your own scripts, see [KB018 (Python)](../kb018-cephrds-python-boto3/) and [KB033 (other languages and tools)](../kb033-cephrds-other-languages-and-tools/).

## Before you start

- **Your keys.** You need a CephRDS Access Key ID and Secret Access Key, and your bucket name. [KB013](../kb013-cephrds-onboarding/) explains how to request them.
- **The network.** CephRDS is reachable from the campus network only. Off campus, connect to the UCR VPN first. On the HPCC cluster you are already on campus.
- **Python tooling.** rds-cli needs Python 3.12 or newer. The easiest install uses [uv](https://docs.astral.sh/uv/), which fetches a suitable Python for you.

## 1. Install

Install uv if you don't have it ([uv install guide](https://docs.astral.sh/uv/getting-started/installation/)), then:

```bash
uv tool install git+https://github.com/UCR-Research-Computing/rds-cli.git
```

This puts the `rds-cli` command on your PATH. To update later:

```bash
uv tool upgrade rds-cli
```

Check it works with `rds-cli --help`.

## 2. Save your keys (once)

```bash
rds-cli auth
```

It asks for your Access Key, your Secret Key (hidden as you type) and the endpoint. Press Enter at the endpoint prompt to accept `https://rds.ucr.edu`.

Your keys are saved to `~/.config/rds-cli/.env`, readable only by you. Keep that file private, and never put it in a shared folder or a Git repository.

**On a shared system or in a job script**, you can skip `auth` and set environment variables instead:

```bash
export AWS_ACCESS_KEY_ID="your-access-key"
export AWS_SECRET_ACCESS_KEY="your-secret-key"
```

rds-cli uses these when no saved keys are found. The endpoint defaults to `https://rds.ucr.edu`.

## 3. Everyday commands

Replace `my-lab-bucket` with your bucket name.

**See what's there**

```bash
rds-cli ls                                   # your buckets
rds-cli ls -b my-lab-bucket                  # first 1,000 files
rds-cli ls -b my-lab-bucket -p results/      # only files under results/
rds-cli ls -b my-lab-bucket -l -1            # every file (can be slow on big buckets)
```

**Check your space**

```bash
rds-cli bucket-info -b my-lab-bucket
```

This shows the number of files and the space used, and your quota and percent used when the bucket has a quota.

**Upload**

```bash
rds-cli upload data.csv -b my-lab-bucket                    # one file
rds-cli upload ./raw_images/ -b my-lab-bucket -k study1/    # a whole folder, into study1/
rds-cli upload big_archive.tar.gz -b my-lab-bucket --multipart
```

Use `--multipart` for very large single files; it sends the file in pieces. Add labels with `-m key=value` (for example `-m owner=netid -m type=raw`).

**Download**

```bash
rds-cli download study1/data.csv -b my-lab-bucket -d ./              # one file
rds-cli download study1/ -b my-lab-bucket -r -d ./study1_local/      # a whole folder
```

**Copy, move and delete**

`cp` and `mv` take a local path or an `s3://bucket/path` address on either side:

```bash
rds-cli cp results.h5 s3://my-lab-bucket/results/results.h5
rds-cli cp s3://my-lab-bucket/results/ ./results/ -r
rds-cli mv s3://my-lab-bucket/tmp/run1/ s3://my-lab-bucket/archive/run1/ -r
rds-cli rm study1/old.csv -b my-lab-bucket
rds-cli rm scratch/ -b my-lab-bucket -r
```

Deleting is permanent. CephRDS has no recycle bin, and it is not backed up for you, so keep your own copy of anything irreplaceable.

**File details**

```bash
rds-cli file-info study1/data.csv -b my-lab-bucket
```

Shows size, last-modified time and any labels added at upload.

## 4. Share one file with a temporary link

```bash
rds-cli share study1/figure.png -b my-lab-bucket            # link valid 1 day
rds-cli share study1/figure.png -b my-lab-bucket -e 3600    # valid 1 hour
```

Anyone with the link can download that one file until it expires. The person opening it must also be on the campus network or VPN, because the link points at CephRDS. Only share data that is allowed to leave your lab (CephRDS holds P1 and P2 data only).

## 5. Copy between CephRDS and Google Cloud Storage

If your lab also has a Google Cloud bucket (for example an Ursa Major project), `cp` can copy in either direction:

```bash
rds-cli cp s3://my-lab-bucket/run1/data.h5 gs://my-gcs-bucket/run1/data.h5
rds-cli cp gs://my-gcs-bucket/run1/ s3://my-lab-bucket/run1/ -r
```

The Google side uses your normal Google Cloud sign-in. Run `gcloud auth application-default login` once with your @ucr.edu account first. Files pass through the computer running rds-cli, so for large copies run it on a machine with a fast connection, such as an HPCC node, not a laptop on home Wi-Fi. Google Cloud may charge for data leaving a bucket.

## 6. On the HPCC cluster

The HPCC is on the campus network, so rds-cli reaches CephRDS there with no VPN. Install it in your home directory with the same `uv tool install` command and use environment variables for your keys. See [KB033](../kb033-cephrds-other-languages-and-tools/#reaching-cephrds-from-the-hpcc-cluster); for running work on the cluster itself, follow the HPCC's own documentation.

## Troubleshooting

- **"AWS credentials not found"**: run `rds-cli auth`, or set the two environment variables.
- **Commands hang for a few seconds and then fail**: you are probably off the campus network. Connect to the UCR VPN and try again.
- **AccessDenied**: check the bucket name, and that your key has access to that bucket. Ask Research Computing if it should.
- **A folder transfer reports some failures**: rds-cli keeps going when one file fails and lists the failures at the end. Rerun the same command for the files that failed.

## Getting help

rds-cli is maintained by Research Computing; problems and ideas can go to the [rds-cli issue tracker](https://github.com/UCR-Research-Computing/rds-cli/issues) or to [research-computing@ucr.edu](mailto:research-computing@ucr.edu).
