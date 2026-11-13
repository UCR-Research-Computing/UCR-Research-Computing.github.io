---
title: "Research Computing cluster portal: running and porting workloads on Cloud TPUs"
topic: Cloud
description: "Run JAX, PyTorch/XLA, Keras 3, vLLM, and ColabFold workloads on the cluster's Google Cloud TPU v5e and v6e Trillium partitions, or let your connected AI assistant port and submit GPU code for you. Part 7 of the portal guide series."
audience: "Members of labs that Research Computing has set up with Cloud TPU access on its HPC cluster in Google Cloud"
reviewed: 2026-11-13
owner: Research Computing
unlisted: true
sitemap: false
series: ursa-portal
series_order: 7
review_notes:
  - "Unlisted on purpose (2026-11-13): shared by link with labs Research Computing has onboarded to Tier 1 Cloud TPU partitions on its HPC cluster in Google Cloud. Kept out of the KB index, search, related guides, and sitemap with noindex."
  - "Scope and wording rules: covers Cloud TPUs only (hardware the HPCC does not have), includes no dollar prices, uses SERVER_URL and PROJECT_ID placeholders, and points general GPU/CPU work to the HPCC."
  - "Verified 2026-11-13 against the live cluster: partitions tpu, tpuspot, and tpu6spot (multi-zone us-central1-b/a/c fallback), partition-scoped module tree /apps/modulefiles-tpu, and ursa-bifrost v0.10.10 static checks."
---

This is part 7 of the portal series. If you have not connected to the cluster yet, start with [Getting connected](../ursa-portal-getting-started/). For general framework conversion patterns (CUDA PyTorch to `torch_xla`, Hugging Face, JAX, Keras 3, and XLA static-shape rules), see [KB053: Porting PyTorch and GPU research code to Google Cloud TPUs](../kb053-porting-gpu-code-to-tpus/).

This page covers the cluster-specific details: which TPU partitions and software modules are installed, the Slurm batch script rules required on TPU nodes, and how to have a connected AI assistant port, check, submit, and monitor a TPU job end to end.

---

## 1. TPU partitions on the cluster

TPU partitions are restricted to approved Tier 1 exotic-hardware projects (`AllowAccounts` in Slurm) and allocate **one whole single-chip TPU VM per job** (`OverSubscribe=EXCLUSIVE`, 24-hour maximum walltime). Work runs within the per-project budget limit Research Computing sets with your lab.

| Partition | Accelerator & HBM | Host CPUs & RAM | Provisioning & zones | Best for |
| :--- | :--- | :--- | :--- | :--- |
| **`tpu6spot`** | 1x **TPU v6e (Trillium)**, **32 GiB HBM** (bf16, native fp8, int8) | 44 CPUs, 170 GiB RAM | Spot (requeued on preemption); auto-tries `us-central1-b`, `a`, `c` | Larger models (up to ~14B bf16 or 27B-32B fp8), large-complex ColabFold (~2,500-3,000 residues), ESM-2 15B, high-batch training |
| **`tpuspot`** | 1x **TPU v5e**, **16 GiB HBM** (bf16, int8) | 24 CPUs, 46 GiB RAM | Spot (requeued on preemption); `us-central1-a` | Everyday JAX / PyTorch-XLA training, LoRA fine-tuning, parameter sweeps, time-series and scientific JAX |
| **`tpu`** | 1x **TPU v5e**, **16 GiB HBM** (bf16, int8) | 24 CPUs, 46 GiB RAM | On-demand; `us-central1-a` (often capacity-constrained at Google) | Uninterrupted runs up to 24 h when on-demand v5e capacity is open |

### Partition-list tip: start on whichever has capacity first

Slurm accepts a comma-separated partition list and starts your job on whichever partition provisions a node first:

```bash
#SBATCH --partition=tpu6spot,tpuspot,tpu
#SBATCH --requeue
```

Always include `#SBATCH --requeue` and periodic checkpointing to `/scratch/$USER/...` when listing `tpu6spot` or `tpuspot`. If Google Cloud reclaims a Spot TPU VM, Slurm automatically requeues your job onto the next available zone or partition.

---

## 2. Preinstalled TPU modules (`/apps/modulefiles-tpu`)

TPU nodes boot Ubuntu 22.04 with `/dev/vfio/0` exposed to OpenXLA's `libtpu` runtime and automatically prepend `/apps/modulefiles-tpu` to `MODULEPATH` (in addition to the cluster's x86 CPU tools).

| Module | What it provides | Notes |
| :--- | :--- | :--- |
| **`python-tpu`** (`2026.10`) | Python 3.12, `jax` 0.12 + `libtpu`, `flax` (Linen & NNX), `optax`, `orbax-checkpoint`, `keras` 3.15 (`KERAS_BACKEND=jax`), `keras-hub`, `equinox`, `diffrax`, `numpyro`, `blackjax`, `grain`, `tensorflow-datasets`, `scikit-learn`, `polars`, `xarray`, `biopython`, `tpu-info`, `jupyterlab` | Primary stack for JAX, Flax, Keras 3, Bayesian HMC/NUTS, and differentiable differential equations. |
| **`pytorch-tpu`** (`2026.10`) | Python 3.12, `torch` 2.9 + `torch_xla` 2.9 + `libtpu`, `torchvision`, `transformers`, `datasets`, `accelerate`, `peft`, `pytorch-lightning`, `fair-esm`, `timm`, `torchmetrics`, `scikit-learn`, `tpu-info`, `jupyterlab` | Primary stack for PyTorch, Hugging Face, LoRA, Lightning (`accelerator="tpu"`), and ESM-2 protein embeddings. Auto-sets `TPU_ACCELERATOR_TYPE` (`v6e-1` on `tpu6spot`, `v5litepod-1` on `tpu`/`tpuspot`). |
| **`vllm-tpu`** (`2026.11`) | Official `vllm-tpu` OpenXLA container + `vllm-tpu` CLI wrapper | High-throughput batch inference or local OpenAI-compatible serving inside a batch job (`--tensor-parallel-size 1`). |
| **`colabfold-tpu`** (`1.5.5`) | `colabfold` 1.5.5 (AlphaFold2 JAX + Haiku) + `jax[tpu]` + `mmseqs2`, `hhsuite`, `kalign2`, CPU `openmm` | High-speed monomer and multimer structure prediction on TPU MXUs with optional host-CPU Amber relaxation. |
| **`python-ts-tpu`** (`2026.11`) | `torch_xla` 2.9 + `pytorch-lightning` + `chronos-forecasting`, `neuralforecast`, `darts`, `statsforecast`, `mlforecast`, `optuna` | Foundation-model and deep time-series forecasting on TPU. |
| **`jax-sci`** (`2026.11`) | `jax[tpu]` + `jax-md`, `e3nn-jax`, `mace-jax`, `pyscfad`, `jax-cfd` | Differentiable molecular dynamics, ML interatomic potentials, spectral CFD, and auto-differentiable quantum chemistry. |
| **`r-keras-tpu`** (`2026.11`) | `R` 4.5 + CRAN `keras3` + `reticulate` backed by `python-tpu` (`KERAS_BACKEND=jax`) | Train and evaluate Keras 3 neural networks on Cloud TPU directly from R scripts. |

---

## 3. Four rules every TPU batch script must follow

1. **Use `#!/bin/bash`, NEVER `#!/bin/bash -l`:**
   A login shell (`-l`) sources `/etc/profile.d` after Slurm's `TaskProlog` runs and resets `MODULEPATH` to the Rocky Linux login defaults, hiding `/apps/modulefiles-tpu`. Always start TPU job scripts with plain `#!/bin/bash`.
2. **Never load `python-tpu` and `pytorch-tpu` in the same shell:**
   `jax` and `torch_xla` each bundle their own version-locked `libtpu.so` PJRT library. Load one or the other per job.
3. **Do not request `--gres=gpu:1`:**
   TPUs are exposed through `/dev/vfio` on whole-node TPU partitions, not Slurm GPU GRES. Requesting `--gres=gpu:1` on a TPU partition is rejected by `sbatch` (and caught beforehand by the AI assistant's `script_check` tool).
4. **Put your XLA compilation cache and checkpoints on `/scratch/$USER`:**
   Export `JAX_COMPILATION_CACHE_DIR=/scratch/$USER/.cache/jax` (or `XLA_PERSISTENT_CACHE_PATH=/scratch/$USER/.cache/xla`) so compiled XLA graphs survive across jobs and Spot requeues.

---

## 4. Tested Slurm batch script templates

### 4.1 JAX / Flax / Keras 3 (`python-tpu`)

```bash
#!/bin/bash
#SBATCH --job-name=tpu-jax
#SBATCH --partition=tpu6spot,tpuspot
#SBATCH --account=YOUR_SLURM_ACCOUNT
#SBATCH --requeue
#SBATCH --time=04:00:00
#SBATCH --output=/scratch/%u/logs/%x-%j.out

set -eo pipefail
module load python-tpu

export JAX_COMPILATION_CACHE_DIR="/scratch/$USER/.cache/jax"
mkdir -p "$JAX_COMPILATION_CACHE_DIR" "/scratch/$USER/checkpoints/$SLURM_JOB_NAME"

python -c "import jax; print('TPU devices:', jax.devices())"
tpu-info

python train_jax.py \
  --checkpoint-dir "/scratch/$USER/checkpoints/$SLURM_JOB_NAME"
```

### 4.2 PyTorch / XLA or Hugging Face (`pytorch-tpu`)

```bash
#!/bin/bash
#SBATCH --job-name=tpu-pytorch
#SBATCH --partition=tpu6spot,tpuspot
#SBATCH --account=YOUR_SLURM_ACCOUNT
#SBATCH --requeue
#SBATCH --time=04:00:00
#SBATCH --output=/scratch/%u/logs/%x-%j.out

set -eo pipefail
module load pytorch-tpu

export XLA_PERSISTENT_CACHE_PATH="/scratch/$USER/.cache/torch_xla"
export HF_HOME="/scratch/$USER/.cache/huggingface"
mkdir -p "$XLA_PERSISTENT_CACHE_PATH" "$HF_HOME"

python -c "import torch_xla; print('XLA device:', torch_xla.device())"
tpu-info

python train_xla.py \
  --device tpu \
  --checkpoint-dir "/scratch/$USER/checkpoints/$SLURM_JOB_NAME"
```

### 4.3 Batch LLM inference (`vllm-tpu`)

On `tpu6spot` (32 GiB HBM), `vllm-tpu` fits 7B-14B models in `bfloat16` or 27B-32B models in `fp8`:

```bash
#!/bin/bash
#SBATCH --job-name=tpu-vllm
#SBATCH --partition=tpu6spot
#SBATCH --account=YOUR_SLURM_ACCOUNT
#SBATCH --requeue
#SBATCH --time=02:00:00
#SBATCH --output=/scratch/%u/logs/%x-%j.out

set -eo pipefail
module load vllm-tpu

export HF_HOME="/scratch/$USER/.cache/huggingface"
export VLLM_XLA_CACHE_PATH="/scratch/$USER/.cache/vllm_xla"
mkdir -p "$HF_HOME" "$VLLM_XLA_CACHE_PATH"

vllm-tpu serve google/gemma-2-9b-it \
  --port 8000 \
  --tensor-parallel-size 1 \
  --dtype bfloat16 \
  --max-model-len 4096 \
  --max-num-seqs 32 &
SERVER_PID=$!

# Wait for readiness inside the job, run batch client, then exit cleanly
for i in $(seq 1 120); do
  curl -sf http://127.0.0.1:8000/health >/dev/null && break
  sleep 5
done

python run_batch_prompts.py --api-base http://127.0.0.1:8000/v1
kill "$SERVER_PID"
```

### 4.4 Protein folding (`colabfold-tpu`)

```bash
#!/bin/bash
#SBATCH --job-name=tpu-colabfold
#SBATCH --partition=tpu6spot,tpuspot
#SBATCH --account=YOUR_SLURM_ACCOUNT
#SBATCH --requeue
#SBATCH --time=04:00:00
#SBATCH --output=/scratch/%u/logs/%x-%j.out

set -eo pipefail
module load colabfold-tpu

export JAX_COMPILATION_CACHE_DIR="/scratch/$USER/.cache/colabfold_jax"
mkdir -p "$JAX_COMPILATION_CACHE_DIR" "/scratch/$USER/folds_out"

colabfold_batch inputs.fasta "/scratch/$USER/folds_out" \
  --num-recycle 3
```

---

## 5. End-to-end AI assistant workflow (port, check, submit, verify)

If you have connected an AI coding agent (Hermes Agent, Claude Code, Codex CLI, Gemini CLI, or OpenCode) to the cluster's MCP server as shown in [Part 5: Use it from an AI assistant](../ursa-portal-ai-assistant/), the assistant can port your local GPU repository, validate the `.sbatch` script against the live cluster catalog, and run a 15-minute TPU verification job for you.

Paste this prompt into your connected coding agent inside your project folder:

```text
Use the connected `ursa` cluster MCP tools to port this GPU project to the cluster's Cloud TPUs
and run a bounded smoke test:

1. Query the live cluster first:
   - Call `partitions`, `modules_search` (query "tpu"), and `recipes` (query "TPU") to confirm
     which TPU partitions your account can use and which TPU module (`python-tpu`, `pytorch-tpu`,
     `vllm-tpu`, `colabfold-tpu`, `python-ts-tpu`, `jax-sci`, or `r-keras-tpu`) fits this repo.
2. Port the code without breaking GPU/CPU support:
   - Add `--device auto|tpu|cuda|cpu` following OpenXLA best practices: static batch/sequence
     shapes (`drop_last=True` + fixed bucket padding), `bfloat16` autocast, persistent XLA cache
     on `/scratch/$USER/.cache/...`, no per-step `.item()` host syncs, and Spot-safe checkpoint
     resume.
   - Run a 5-step `--device cpu` check locally first to catch syntax or shape bugs before touching
     the cluster.
3. Draft and validate the Slurm script (`run_tpu_smoke.sbatch`):
   - Use plain `#!/bin/bash` (never `-l`), `#SBATCH --partition=tpu6spot,tpuspot`,
     `#SBATCH --requeue`, `#SBATCH --time=00:20:00`, and load ONLY the one matching TPU module.
   - Run `script_check` on `run_tpu_smoke.sbatch` and fix every error or warning until `ok: true`.
4. Stage and smoke-test (with my confirmation):
   - Show me the `job_submit` plan for the 20-minute smoke test and wait for my approval before
     calling `job_submit_confirm`.
   - Once submitted, call `job_wait`, inspect the log with `job_log_tail` (or `job_explain` if it
     fails), and confirm: (a) `TpuDevice` / `xla:0` was used, (b) step latency dropped after
     steps 1-2, and (c) zero new XLA compilations occurred after step 3.
```

Remember the data rules in [Part 5](../ursa-portal-ai-assistant/#limits-and-privacy): keep prompts and files shared with external AI assistants to P1 and P2 information, and read every `job_submit` plan before confirming.

---

## Get help

Email [research-computing@ucr.edu](mailto:research-computing@ucr.edu) with your NetID, the job ID (if one ran), and which framework or model you are porting.

Back to the series: [Getting connected](../ursa-portal-getting-started/), [Files and jobs](../ursa-portal-files-and-jobs/), [Jupyter](../ursa-portal-jupyter/), [Desktop](../ursa-portal-desktop/), [AI assistant](../ursa-portal-ai-assistant/), [Troubleshooting](../ursa-portal-troubleshooting/).
