---
title: "Launching an Ursa Major HPC cluster"
topic: Cloud
owner: Research Computing
reviewed: 2026-10-04
review_notes:
  - "Added tier context: a lab's own cluster is Tier 2 recharge; Research Computing's shared cluster for TPUs and Arm is Tier 1 after a consultation. Pointed to the HPCC first."
  - "Renamed Cloud HPC Toolkit to Cluster Toolkit and updated every step link to the current quickstart page and its section anchors (checked 2026-10-04)."
  - "Removed the tracking-laden console walkthrough link and the embedded YouTube image; kept the video as a plain link."
redirect_from:
  - /Knowledge_Base/How_To_Launch_a_Ursa_Major_Cluster.html
  - /Knowledge_Base/Launch_Custom_Ursa_Major_Cluster.html
---

This guide is for a lab that wants to build **its own** Slurm cluster in its Ursa Major project with Google's Cluster Toolkit.

## Before you build

- **Costs:** a lab's own cluster is Tier 2. Its compute nodes, GPUs, disks and file systems are recharged to a lab funding source under an MOU. See [KB005: Ursa Major service tiers](../kb005-ursa-major-service-tiers/) and [KB007: Ursa Major recharge workflow](../kb007-tier2-recharge-workflow/).
- **Exotic hardware:** if you need hardware the HPCC does not have, such as TPUs or Arm processors, ask about Research Computing's shared cluster in Google Cloud instead. That is Tier 1, within limits set per project, and starts with a consultation.
- **The HPCC first:** for most batch and GPU work, the campus [HPCC cluster](../../services/hpcc/) is a better fit and usually costs the lab less.
- **Set a budget** on the project before you start. See [Creating GCP budgets](../ursa-major-project-budget/).

[Talk to Research Computing](../../help/) before you build. We can help you compare options and estimate costs. For background, see [Ursa Major HPC clusters](../ursa-major-hpc-clusters/).

## Steps

Google's [Cluster Toolkit quickstart: deploy a Slurm cluster](https://cloud.google.com/cluster-toolkit/docs/quickstarts/slurm-cluster) walks through each step. Read its [Costs](https://cloud.google.com/cluster-toolkit/docs/quickstarts/slurm-cluster#costs) section first.

1. Select your lab's Ursa Major project in the [Google Cloud console](https://console.cloud.google.com/). If you do not have a project yet, see [KB021: Requesting an Ursa Major (Google Cloud) project](../kb021-ursa-major-project-request/).
2. [Launch Cloud Shell](https://cloud.google.com/cluster-toolkit/docs/quickstarts/slurm-cluster#launch).
3. [Make sure the default Compute Engine service account is enabled](https://cloud.google.com/cluster-toolkit/docs/quickstarts/slurm-cluster#ensure_that_the_default_service_account_is_enabled).
4. [Install Cluster Toolkit](https://cloud.google.com/cluster-toolkit/docs/quickstarts/slurm-cluster#install-cluster-toolkit).
5. [Create the cluster deployment folder](https://cloud.google.com/cluster-toolkit/docs/quickstarts/slurm-cluster#create_the_cluster_deployment_folder).
6. [Deploy the cluster with Terraform](https://cloud.google.com/cluster-toolkit/docs/quickstarts/slurm-cluster#deploy-hpc-cluster).
7. [Run a job on the cluster](https://cloud.google.com/cluster-toolkit/docs/quickstarts/slurm-cluster#run_a_job_on_the_hpc_cluster). For basic Slurm commands, see [Connecting to the HPC cluster](../how-to-connect-to-hpc-cluster-run-sample-job/).
8. [Clean up](https://cloud.google.com/cluster-toolkit/docs/quickstarts/slurm-cluster#clean-up) and [destroy the cluster](https://cloud.google.com/cluster-toolkit/docs/quickstarts/slurm-cluster#destroy_the_hpc_cluster) when you no longer need it. Resources left running continue to be charged.

## Video

- [Cluster Toolkit tutorial: Simple cluster](https://www.youtube.com/watch?v=acRzY4mnkAc) (Google Cloud Tech, YouTube)
