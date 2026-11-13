---
title: "Porting PyTorch and GPU research code to Google Cloud TPUs with an AI coding agent"
kb_id: KB053
topic: Software
description: "Convert CUDA PyTorch, Hugging Face, Keras, LLM inference, and scientific Python code to run on Google Cloud TPUs using OpenXLA, either by hand or with an AI coding agent."
audience: "UCR researchers and students whose machine learning or differentiable computing workloads need Google Cloud TPU accelerators"
reviewed: 2026-11-13
owner: Research Computing
review_notes:
  - "Written 2026-11-13 to document GPU-to-TPU code conversion patterns (PyTorch/XLA PJRT, Hugging Face Accelerate, JAX/Flax, Keras 3, vLLM-TPU) and an AI coding agent porting workflow."
  - "Checked against UCR Research Computing TPU environments (Python 3.12, JAX 0.12, Flax 0.12, Keras 3.15, PyTorch 2.9, torch_xla 2.9, vLLM TPU) on single-chip Cloud TPU v5e (16 GiB HBM) and v6e Trillium (32 GiB HBM) nodes."
  - "Scope and claims check: describes Cloud TPUs (hardware the campus HPCC does not offer), directs standard GPU/CPU workloads to the campus HPCC first, includes no dollar figures, and links UCR AI guidance."
  - "CHECK: the multi-framework conversion examples are verified against current OpenXLA PJRT APIs (torch_xla.device(), torch_xla.sync(), jax.jit, KERAS_BACKEND=jax); researchers should run the 20-step smoke check in Section 6 on their own model to confirm zero steady-state XLA recompilations."
---

Most academic machine learning code is written for NVIDIA GPUs using PyTorch and CUDA. Google Cloud Tensor Processing Units (TPUs) offer large high-bandwidth memory (HBM) and dense matrix throughput for training, fine-tuning, protein folding, and batch inference, but they do not execute CUDA kernels. Instead, TPUs compile whole tensor computation graphs through **OpenXLA** and execute them via Google's `libtpu` PJRT runtime.

Porting a standard PyTorch, Hugging Face, Keras, or scientific NumPy codebase to Cloud TPUs rarely requires rewriting your model mathematics from scratch. However, a naive search-and-replace from `"cuda"` to `"xla"` often produces code that runs slowly due to hidden host-device synchronizations or repeated XLA graph recompilations.

This guide explains which research workloads fit Cloud TPUs, how to convert GPU code across the major frameworks, the five XLA performance traps to avoid, and how to use an AI coding agent to port and verify your repository automatically.

---

## 1. Start with the right hardware for the job

At UCR, the campus [HPCC](../../services/hpcc/) is the primary home for CPU, high-memory, and general GPU batch computing. If your code already runs well on NVIDIA GPUs on the HPCC, or on national GPU platforms such as the [OSPool](../kb047-ospool-gpu-jobs/) or [NRP Nautilus](../kb026-nautilus-batch-jobs-and-gpus/), keep running it there.

Cloud TPUs are worth targeting when:

* Your model benefits from dense `bfloat16`, `fp8` (TPU v6e Trillium), or `int8` matrix multiplication and high HBM bandwidth (for example, Vision Transformers, language model fine-tuning, high-throughput sequence embedding, or JAX differentiable physics).
* Your pipeline is already written in JAX, Flax, Keras 3, or standard PyTorch / Hugging Face `transformers` without custom C++/CUDA extensions.
* You have access to Cloud TPUs through [Ursa Major Tier 1](../kb005-ursa-major-service-tiers/) (exotic hardware not offered on the HPCC, arranged after a consultation), a Tier 2 Google Cloud project, or Google's TPU Research Cloud (TRC).

### Workload compatibility matrix

Cloud TPUs do not provide a CUDA, PTX, HIP, OpenCL, SYCL, or Kokkos GPU runtime, and their Matrix Multiply Units (MXUs) do not perform hardware double-precision (`float64`) arithmetic. Check your software category before porting:

| Workload category | Fits Cloud TPU? | Recommended TPU path or alternative |
| :--- | :--- | :--- |
| **JAX / Flax / Equinox / Diffrax / NumPyro / BlackJAX** | Yes (native) | Runs unchanged on TPU via `jax[tpu]`. |
| **Keras 3 models (Python or R `keras3`)** | Yes (native) | Export `KERAS_BACKEND=jax` before importing `keras`; no model code changes required. |
| **Hugging Face `transformers`, `accelerate`, `peft`** | Yes | Supported via `torch_xla` (`Trainer` / `Accelerator`) with fixed-length padding and `drop_last=True`. |
| **Standard PyTorch (`nn.Module`, `torchvision`, `timm`, `fair-esm`)** | Yes | Port device placement and step barriers to `torch_xla` (Section 3.1) or PyTorch Lightning (`accelerator="tpu"`). |
| **LLM batch inference and serving (`vLLM`)** | Yes | Use the official `vllm-tpu` OpenXLA backend (`--tensor-parallel-size 1` on single-chip v5e/v6e). |
| **AlphaFold2 / ColabFold monomer and multimer folding** | Yes | Native JAX + Haiku (`colabfold`); run Amber relaxation on host CPUs or `--no-amber`. *(Note: AlphaFold3 uses custom GPU kernels and rejects TPU upstream.)* |
| **Julia array PDEs and autodiff** | Yes (via Reactant) | `Reactant.jl` + `Enzyme.jl` + `Lux.jl` lower Julia 1.12+ to StableHLO for Cloud TPU. |
| **PyTorch models with custom C++/CUDA/Triton kernels** | Only with fallback | Custom `.cu` extensions (such as `flash-attn` CUDA wheels or `cuequivariance` CUDA ops) cannot load on TPU. Switch attention to standard `F.scaled_dot_product_attention` or JAX Pallas, or keep on NVIDIA GPUs. |
| **Classical C++/CUDA molecular dynamics (GROMACS, LAMMPS, Amber, NAMD)** | No | Keep on NVIDIA GPUs (HPCC, Nautilus, OSPool). For differentiable or ML interatomic potential MD on TPU, use `jax-md` and `mace-jax`. |
| **FP64 quantum chemistry, CFD, and FEM (CP2K, Quantum ESPRESSO, OpenFOAM, SU2)** | No | Require `float64` eigensolvers, MPI sparse solvers, or CUDA/OpenACC. Keep on CPU/GPU HPC partitions. |
| **Gradient-boosted trees and Numba (`xgboost`, `lightgbm`, `numba.cuda`)** | No | Tree boosters run on host CPUs or NVIDIA GPUs; replace `numba` loops with `@jax.jit` and `jax.vmap` for TPU. |

---

## 2. How TPUs execute code differently from GPUs

Understanding four architectural differences will save hours of debugging:

1. **Lazy graph compilation vs. eager CUDA kernels:** On an NVIDIA GPU, `y = a @ b` immediately queues a CUDA kernel. On a TPU with `torch_xla` or `@jax.jit`, operations record a computation graph (StableHLO) that OpenXLA fuses and compiles for the MXU. Compilation takes seconds to minutes the first time a graph shape is seen, and microseconds to launch thereafter.
2. **Static shapes are mandatory:** Every unique combination of tensor dimensions (batch size, sequence length, image resolution, dynamic boolean mask output length) is a **different XLA program**. If batch 1 has length 512, batch 2 has length 487, and the final batch of an epoch has 19 samples instead of 32, XLA recompiles the entire model again and again, dropping accelerator utilization near zero.
3. **Host-device synchronization breaks the pipeline:** Calling `.item()`, `.cpu()`, `print(tensor)`, or Python `if loss > 10:` inside every training step forces XLA to cut the graph, compile a fragment, and block the CPU until the TPU finishes. Keep metrics on device and read scalars back only every *N* steps.
4. **Native `bfloat16` precision:** TPU MXUs multiply in `bfloat16` (same exponent range as `float32`, so no `GradScaler` is needed) and accumulate in `float32`. TPU v6e (Trillium) also supports native `fp8` quantization for high-throughput inference and training. Avoid `float16` (which overflows without loss scaling) and `float64`.

---

## 3. Framework conversion patterns

Keep a single codebase that runs on CUDA GPUs, Cloud TPUs, and CPUs by isolating device setup behind a small helper rather than hardcoding `"cuda"` throughout your scripts.

### 3.1 PyTorch CUDA to PyTorch/XLA (`torch_xla` 2.6+)

Modern `torch_xla` uses the PJRT runtime (`torch_xla.device()` and `torch_xla.sync()`). Do **not** copy deprecated pre-2.3 boilerplate (`xm.xrt_world_size()` or `XRT_TPU_CONFIG`).

**Before (CUDA-only PyTorch):**

```python
import torch
import torch.nn as nn
from torch.utils.data import DataLoader

device = torch.device("cuda")
scaler = torch.amp.GradScaler("cuda")
model = MyTransformer().to(device)
optimizer = torch.optim.AdamW(model.parameters(), lr=3e-4)
loader = DataLoader(dataset, batch_size=32, shuffle=True)  # Trap 1: partial last batch!

for step, (x, y) in enumerate(loader):
    x = x.to(device, non_blocking=True)
    y = y.to(device, non_blocking=True)
    optimizer.zero_grad(set_to_none=True)
    with torch.amp.autocast("cuda", dtype=torch.float16):
        logits = model(x)
        loss = nn.functional.cross_entropy(logits, y)
    scaler.scale(loss).backward()
    scaler.step(optimizer)
    scaler.update()
    if step % 1 == 0:
        print(f"step={step} loss={loss.item():.4f}")  # Trap 2: syncs TPU every step!
```

**After (portable across TPU, CUDA, and CPU):**

```python
import os
import torch
import torch.nn as nn
from torch.utils.data import DataLoader

def get_accelerator(prefer: str = "auto"):
    if prefer in ("auto", "tpu"):
        try:
            import torch_xla
            import torch_xla.core.xla_model as xm
            import torch_xla.distributed.parallel_loader as pl
            # Persist compiled XLA graphs across runs so restarts skip cold compile
            os.environ.setdefault("XLA_PERSISTENT_CACHE_PATH", "./xla_cache")
            return "tpu", torch_xla.device(), torch_xla, xm, pl
        except ImportError:
            if prefer == "tpu":
                raise
    if prefer in ("auto", "cuda") and torch.cuda.is_available():
        return "cuda", torch.device("cuda"), None, None, None
    return "cpu", torch.device("cpu"), None, None, None

kind, device, torch_xla, xm, pl = get_accelerator()
amp_device = "xla" if kind == "tpu" else ("cuda" if kind == "cuda" else "cpu")

model = MyTransformer().to(device)
optimizer = torch.optim.AdamW(model.parameters(), lr=3e-4)

# Fix 1: drop_last=True keeps batch shape constant; pad sequences to fixed bucket lengths in dataset
raw_loader = DataLoader(dataset, batch_size=32, shuffle=True, drop_last=True, num_workers=4)
# MpDeviceLoader overlaps host->TPU transfers and calls torch_xla.sync() automatically per batch
loader = pl.MpDeviceLoader(raw_loader, device) if kind == "tpu" else raw_loader

for step, (x, y) in enumerate(loader):
    if kind != "tpu":
        x, y = x.to(device), y.to(device)
    optimizer.zero_grad(set_to_none=True)

    # Fix 2: bfloat16 needs no GradScaler on TPU (or Ampere+ GPUs)
    with torch.autocast(device_type=amp_device, dtype=torch.bfloat16):
        logits = model(x)
        loss = nn.functional.cross_entropy(logits, y)

    loss.backward()
    optimizer.step()
    if kind == "tpu":
        # If not using MpDeviceLoader, you MUST call torch_xla.sync() here so the step executes
        torch_xla.sync()

    # Fix 3: log via add_step_closure every N steps, never .item() on every batch
    if step % 50 == 0:
        if kind == "tpu":
            xm.add_step_closure(
                lambda s=step, l=loss.detach(): print(f"step={s} loss={l.item():.4f}")
            )
        else:
            print(f"step={step} loss={loss.item():.4f}")
```

**Key rules for `torch_xla`:**

* **Separate environments from JAX:** `torch_xla` and `jax[tpu]` each ship their own pinned `libtpu.so`. Do not install or load both inside the same virtual environment.
* **Use CPU `torch` wheels underneath `torch_xla`:** Install `torch` from `https://download.pytorch.org/whl/cpu` before installing `torch_xla[tpu]`. Default PyPI `torch` pulls several gigabytes of unused `nvidia-*-cu12` libraries.
* **Avoid FlashAttention CUDA packages:** If your GPU code imports `flash_attn`, guard that import with `try / except ImportError` and fall back to PyTorch's built-in `torch.nn.functional.scaled_dot_product_attention`, which `torch_xla` lowers natively.

---

### 3.2 Hugging Face `transformers`, `accelerate`, and `peft` (LoRA)

Hugging Face `Trainer` and `Accelerate` detect `torch_xla` automatically. Three settings prevent XLA recompilation storms during fine-tuning:

1. Tokenize or collate with **fixed padding** (`padding="max_length"`, or `pad_to_multiple_of=128` with a small set of bucket lengths), never unconstrained dynamic per-batch lengths.
2. Set `dataloader_drop_last=True` so the final batch of each epoch has the same batch size.
3. Enable `bf16=True` (not `fp16=True`).

```python
from transformers import AutoModelForSequenceClassification, AutoTokenizer, Trainer, TrainingArguments
from peft import LoraConfig, get_peft_model

model_id = "FacebookAI/roberta-large"
tok = AutoTokenizer.from_pretrained(model_id)
base = AutoModelForSequenceClassification.from_pretrained(model_id, num_labels=2)
model = get_peft_model(base, LoraConfig(r=16, lora_alpha=32, target_modules=["query", "value"]))

def tokenize_fixed(batch):
    # Static sequence length prevents a new XLA compile per batch
    return tok(batch["text"], truncation=True, padding="max_length", max_length=512)

args = TrainingArguments(
    output_dir="./checkpoints",
    per_device_train_batch_size=32,
    per_device_eval_batch_size=32,
    dataloader_drop_last=True,   # Critical on TPU: keeps batch tensor shape static
    bf16=True,                   # Native TPU MXU dtype
    logging_steps=50,
    save_steps=250,
    save_total_limit=2,
)

trainer = Trainer(model=model, args=args, train_dataset=train_ds, eval_dataset=eval_ds)
trainer.train()
```

---

### 3.3 Native JAX + Flax + Optax (fastest path on TPU)

JAX is the native programming model for Cloud TPUs. Enable the persistent compilation cache at startup so cold XLA compilation happens once per model shape across job restarts:

```python
import os
import jax
import jax.numpy as jnp
import optax
from flax import nnx

jax.config.update("jax_compilation_cache_dir", os.environ.get("JAX_COMPILATION_CACHE_DIR", "./jax_cache"))
jax.config.update("jax_persistent_cache_min_entry_size_bytes", -1)
jax.config.update("jax_persistent_cache_min_compile_time_secs", 0)

print("Devices:", jax.devices())  # Expect [TpuDevice(id=0, process_index=0, coords=(0,0,0), core_on_chip=0)]

class MLP(nnx.Module):
    def __init__(self, din: int, dhid: int, dout: int, *, rngs: nnx.Rngs):
        self.l1 = nnx.Linear(din, dhid, param_dtype=jnp.float32, dtype=jnp.bfloat16, rngs=rngs)
        self.l2 = nnx.Linear(dhid, dout, param_dtype=jnp.float32, dtype=jnp.bfloat16, rngs=rngs)

    def __call__(self, x: jax.Array) -> jax.Array:
        return self.l2(nnx.gelu(self.l1(x)))

model = MLP(1024, 4096, 10, rngs=nnx.Rngs(0))
optimizer = nnx.Optimizer(model, optax.adamw(3e-4))

@nnx.jit
def train_step(model: MLP, optimizer: nnx.Optimizer, x: jax.Array, y: jax.Array) -> jax.Array:
    def loss_fn(m: MLP):
        logits = m(x).astype(jnp.float32)
        return optax.softmax_cross_entropy_with_integer_labels(logits, y).mean()
    loss, grads = nnx.value_and_grad(loss_fn)(model)
    optimizer.update(grads)
    return loss
```

---

### 3.4 Keras 3 (Python and R) with zero model edits

Keras 3 (`keras >= 3.0`) is multi-backend and runs on JAX, PyTorch, or TensorFlow. Setting `KERAS_BACKEND=jax` **before** importing `keras` compiles `model.fit()` directly onto the TPU via JAX:

```bash
export KERAS_BACKEND=jax
python train_keras.py
```

```python
import os
os.environ.setdefault("KERAS_BACKEND", "jax")
import keras

keras.mixed_precision.set_global_policy("mixed_bfloat16")
# Build and call model.compile(...) and model.fit(...) with fixed-size batches as usual.
```

In R (`keras3`), point `reticulate` at a Python environment with `jax[tpu]` and `keras` installed, set `Sys.setenv(KERAS_BACKEND = "jax")`, and call `library(keras3)` as usual.

---

### 3.5 High-throughput LLM inference (`vLLM` CUDA to `vllm-tpu`)

If your pipeline runs offline batch annotation or serves an OpenAI-compatible endpoint with `vLLM`, switch from the CUDA `vllm-openai` container to `vllm/vllm-tpu` (`vllm-tpu`). On a single TPU chip:

* **TPU v5e (16 GiB HBM):** Fits 1B to 8B parameter models in `bfloat16` (or up to ~14B with INT8 weight quantization).
* **TPU v6e Trillium (32 GiB HBM):** Fits 7B to 14B parameter models in `bfloat16`, or 27B to 32B models (such as Gemma-3-27B or Qwen2.5-32B) using native `--dtype fp8` / FP8 weights.

Always set `VLLM_XLA_CACHE_PATH` to persistent fast storage and bound `--max-model-len` and `--max-num-seqs` so XLA precompiles a small, fixed set of bucket shapes at startup:

```bash
export VLLM_XLA_CACHE_PATH=/path/to/persistent/vllm_xla_cache
vllm serve google/gemma-2-9b-it \
  --tensor-parallel-size 1 \
  --dtype bfloat16 \
  --max-model-len 4096 \
  --max-num-seqs 32
```

---

## 4. Five XLA performance traps to check before scaling up

| Symptom | Root cause on TPU | Fix |
| :--- | :--- | :--- |
| Step 1 takes 60 s, and **every later step also takes 30-60 s** | Dynamic tensor shapes: variable sequence lengths, variable image sizes, boolean indexing (`x[x > 0]`), or a partial final batch | Pad inputs to fixed bucket lengths, replace dynamic boolean indexing with `torch.where` / `jnp.where` masks, and pass `drop_last=True` to `DataLoader`. |
| Model compiles once, but **MXU utilization is under 10%** | Host-device sync inside the batch loop (`loss.item()`, `tensor.cpu()`, `tqdm.set_postfix(loss=float(loss))` every step) | Log only every 50-100 steps using `xm.add_step_closure` (PyTorch/XLA) or outside `@jax.jit` every *N* steps. |
| Every job restart spends **5-15 minutes recompiling** the same model | XLA cache is unset or pointing to ephemeral `/tmp` | Point `JAX_COMPILATION_CACHE_DIR`, `XLA_PERSISTENT_CACHE_PATH`, or `VLLM_XLA_CACHE_PATH` to persistent scratch storage. |
| Out-of-memory (HBM OOM) despite model fitting on a 24 GiB GPU | XLA keeps intermediate fused buffers or compiles multiple shape specializations into HBM simultaneously | Use `bfloat16` activations, keep shapes static (one compiled executable in HBM), reduce batch size with gradient accumulation, or use a 32 GiB TPU v6e chip. |
| Preempted Spot TPU job loses hours of training | Spot/preemptible TPUs can be reclaimed by Google Cloud at short notice | Save rolling checkpoints (Orbax or `torch.save` via `xm.save`) every 10-15 minutes to persistent storage and auto-resume from the latest checkpoint on startup. |

### Measuring real TPU utilization and recompilations

* **Hardware HBM and duty cycle (`tpu-info`):** Run `tpu-info` inside the job (or in a background monitor every 30 seconds) to inspect real HBM usage and chip duty cycle.
* **PyTorch/XLA compilation counter:** Print `torch_xla._XLAC._xla_metrics_report()` (or `import torch_xla.debug.metrics as met; print(met.short_metrics_report())`) after step 2 and again after step 20. **`CompileTime` count must stop growing after warmup** (steps 1-2). Any `aten::` fallback ops listed in `Metric:aten::...` execute on CPU instead of TPU and should be replaced.

---

## 5. Safety first: AI coding agents and research data

Before pointing an AI coding agent at your codebase, follow the same campus data rules used in [KB049: Containerize your research software with an AI coding agent](../kb049-containerize-your-research/):

> **RESEARCH DATA AND AI SAFETY CHECKLIST**
>
> * **No protected or restricted data:** Never expose P3 or P4 protected data (such as HIPAA health records, FERPA student records, controlled unclassified information, or human-subjects PII) to an external AI assistant.
> * **No credentials or keys:** Verify your repository contains no `.env` files, SSH keys, cloud service-account JSON keys, or API tokens before starting an agent session.
> * **No restricted source code:** Do not upload code covered by non-disclosure agreements or restrictive commercial licenses unless your tool agreement permits it.
> * **Follow UCR AI guidelines:** Review campus AI guidance at [https://its.ucr.edu/ai](https://its.ucr.edu/ai).
> * **Inspect and smoke-test:** Review every diff and run a short bounded verification test before launching multi-hour training jobs.

---

## 6. Automated porting workflow with an AI coding agent

This workflow uses [Hermes Agent](https://hermes-agent.nousresearch.com/) as the worked terminal example. Other coding agents (Claude Code, OpenAI Codex CLI, Gemini CLI, OpenCode, Cursor, or VS Code Copilot) follow the exact same process.

### Step 1. Launch your coding agent in the project repository

```bash
cd ~/my-gpu-project
git checkout -b feat/tpu-support
hermes
```

*(Need to install Hermes Agent first? See Step 1 of [KB049](../kb049-containerize-your-research/) or the [nrp-mcp quick start](../kb031-nrp-mcp-quick-start/).)*

### Step 2. Give the agent the GPU-to-TPU conversion prompt

Copy and paste the prompt below, adjusting the entry script name and target framework (`torch_xla` for existing PyTorch code, or `jax` if you want a full JAX rewrite):

```text
Port this GPU codebase so it runs cleanly at high utilization on a single-chip Google Cloud TPU
(OpenXLA PJRT: TPU v5e 16 GiB HBM or TPU v6e Trillium 32 GiB HBM) while keeping backward
compatibility with CUDA GPUs and CPU via a `--device auto|tpu|cuda|cpu` flag.

Follow these strict OpenXLA engineering rules:
1. Dependency audit first:
   - Scan imports, requirements, and model layers for any custom CUDA/C++/Triton extensions
     (e.g., flash_attn, bitsandbytes, xformers, cupy, numba.cuda, custom .cu ops).
   - List every incompatible package and replace it with an OpenXLA-supported equivalent
     (e.g., torch.nn.functional.scaled_dot_product_attention, bfloat16 instead of bitsandbytes).
2. Modern runtime APIs only:
   - For PyTorch: use PJRT APIs (`torch_xla.device()`, `torch_xla.sync()`,
     `torch_xla.distributed.parallel_loader.MpDeviceLoader`, and
     `torch.autocast("xla", dtype=torch.bfloat16)`). Never use deprecated XRT env vars or GradScaler on TPU.
   - For JAX/Keras: enable persistent XLA compilation caching via `JAX_COMPILATION_CACHE_DIR`
     (or `XLA_PERSISTENT_CACHE_PATH` for PyTorch/XLA).
3. Eliminate all XLA recompilation and host-sync traps:
   - Ensure all DataLoaders use `drop_last=True` during training and pad variable-length inputs
     to fixed bucket sizes so tensor shapes stay static across steps.
   - Remove per-step `.item()`, `.cpu()`, `.numpy()`, Python `if tensor:` branches, and dynamic
     boolean indexing (`x[mask]`) inside the training/inference step; log metrics only every N
     steps (using `xm.add_step_closure` on PyTorch/XLA).
4. Spot/preemptible resilience:
   - Add periodic checkpoint saving (`--checkpoint-dir`, `--save-every-minutes 15`) and automatic
     resume from the latest checkpoint on startup so preempted Spot TPU runs lose minimal progress.
5. Verification harness (`scripts/verify_tpu_smoke.py`):
   - Write a self-contained 20-step synthetic smoke test that runs on CPU locally today and on TPU
     when launched on a TPU node, checks that loss is finite, and on PyTorch/XLA asserts via
     `torch_xla.debug.metrics` that `CompileTime` count does not increase between step 3 and step 20
     (proving zero steady-state recompilations).

Start by printing a short audit of the repository's current CUDA dependencies and dynamic-shape risks,
then implement the changes and run `scripts/verify_tpu_smoke.py --device cpu` locally to confirm no syntax
or shape regressions before we test on a TPU node.
```

### Step 3. Run the 20-step smoke test on CPU locally, then on a TPU

Before submitting a multi-hour run, execute the generated `verify_tpu_smoke.py` locally on CPU (catches broken imports and shape mismatches in seconds), and then run the same 20-step check on a single TPU chip. Confirm three things in the output log:

1. The runtime detects the TPU (`TpuDevice` in JAX, or `xla:0` in `torch_xla`).
2. Step time drops sharply after steps 1-2 (for example, step 1 takes 25 s to compile, steps 3-20 take 40 ms each).
3. `CompileTime` count stays flat from step 3 through step 20, and `tpu-info` shows HBM allocated and non-zero duty cycle.

---

## 7. Getting TPU access at UCR

Depending on your data classification and scale, UCR researchers have three routes to Cloud TPUs:

* **Ursa Major Tier 1 (exotic hardware, by consultation):** For UCR research that needs hardware the campus [HPCC](../../services/hpcc/) does not offer (such as Google Cloud TPUs or Arm processors), Research Computing can arrange access on a Research Computing HPC cluster in Google Cloud, with no recharge to the lab under current terms and within a per-project budget limit (depends on continued campus funding; see [KB005: Ursa Major service tiers](../kb005-ursa-major-service-tiers/)). Tier 1 hardware is for **P1 and P2 data** (public and internal); ask first about P3/P4 or contract-covered data. Email [research-computing@ucr.edu](mailto:research-computing@ucr.edu) with `"Tier 1 hardware"` in the subject line and a short description of your model and why it needs TPUs. *(Labs already onboarded to the cluster receive the cluster's TPU job and AI-assistant guide directly.)*
* **Ursa Major Tier 2 (recharged Google Cloud project):** Labs with grant or departmental funding (COA) that want dedicated Cloud TPU VMs or GKE TPU node pools in their own Google Cloud project can request a [Tier 2 Ursa Major project](../kb021-ursa-major-project-request/) (see [KB007: Tier 2 recharge workflow](../kb007-tier2-recharge-workflow/)).
* **External academic programs (P1 public data only):** Google's [TPU Research Cloud (TRC)](https://sites.research.google/trc/about/) grants short-term no-charge Cloud TPU quotas directly to academic researchers for open science, and Google Colab / Kaggle notebooks provide single-chip TPUs for quick P1 prototyping.

Questions about whether your codebase is a good candidate for TPUs? [Contact Research Computing](../../help/).
