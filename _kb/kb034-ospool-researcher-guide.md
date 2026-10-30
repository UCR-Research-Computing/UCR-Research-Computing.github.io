---
title: "Researcher guide to the OSPool and OSDF"
kb_id: KB034
topic: National
description: "What the OSG's Open Science Pool and Open Science Data Federation are, which work fits, how they compare with the HPCC, Nautilus and ACCESS, and the path from first contact to results."
audience: "UCR faculty, postdocs, staff and students with work that splits into many independent jobs"
reviewed: 2026-10-29
owner: Research Computing
series: ospool
series_order: 1
review_notes:
  - "Written 2026-10-29 from the OSPool documentation (portal.osg-htc.org/documentation, fetched 2026-10-29), the OSDF service page and the Pelican client docs."
  - "Tested 2026-10-29 from a UCR laptop: pelican 7.26.3 object get, ls, stat and get -r against osdf:///ospool/uc-shared/public/OSG-Staff/validation/ (works without an account)."
  - "OSG accounting (GRACC) checked 2026-10-29: the UCR-HPCC site contributes capacity to the OSPool. Figure deliberately not quoted on the page."
  - "CHECK: the OSPool account steps were not yet completed end to end by RC; an application was submitted 2026-10-29. Re-read sections 4 and 5 after the first access point login."
---

## 1. What they are

The **OSG** (originally the Open Science Grid) is a national consortium that supports distributed high-throughput computing. Two of its services matter most to UCR researchers:

- The **Open Science Pool (OSPool)** runs large numbers of small, independent jobs on spare capacity contributed by institutions across the country. Jobs are described and scheduled with **HTCondor**. You log in to an **access point**, put your files there and submit jobs; HTCondor runs them wherever capacity is idle and brings the results back. UCR's HPCC is one of the contributing sites.
- The **Open Science Data Federation (OSDF)** is a network of data origins and caches that delivers larger files to those jobs, and to anyone reading public datasets. See the [OSDF service page](../../services/osdf/).

UCR does not recharge for either. See the [OSG / OSPool service page](../../services/osg/) for the short version.

## 2. Does my work fit?

The OSPool suits work that can be cut into many pieces that do not talk to each other:

- parameter sweeps, Monte Carlo runs and simulations repeated with different seeds;
- per-sample or per-file pipelines (genomes, images, documents);
- model training or inference runs that each fit on one machine.

Each job should be **short and restartable**. The OSPool documentation asks for jobs under 20 hours, or jobs that save checkpoints. It is a poor fit for MPI jobs that span machines, for jobs that need a large shared file system, and for any protected data.

## 3. How it compares

| If you need | Consider |
| --- | --- |
| Thousands of small, independent jobs, no allocation paperwork | OSPool |
| MPI, long runs, a shared file system, software modules | [HPCC cluster](../../services/hpcc/) |
| Containers, GPUs, JupyterHub or web services | [NRP Nautilus](../../services/nautilus/) |
| Large runs on national supercomputers or Jetstream2 | [NSF ACCESS](../../services/nsf-access/) |
| A place to share datasets across institutions | [Open Storage Network](../../services/osn/) |

Many projects use more than one: develop on the HPCC, then send the many-small-jobs part to the OSPool.

## 4. The path from first contact to results

This series follows that path:

1. **[Getting access to the OSPool](../kb035-ospool-getting-access/):** the application, the orientation meeting, access point registration and your first SSH login.
2. **[Moving data on the OSPool](../kb036-ospool-moving-data/):** getting files onto the access point, the OSDF for larger files and containers, quotas, and bringing results home.
3. **[Submitting jobs and getting results](../kb037-ospool-jobs-and-results/):** submit files, test jobs, scaling up, monitoring, held jobs and reading output.

## 5. Try the OSDF now, without an account

You can read public OSDF data from any laptop. Download the Pelican client for your system from the [Pelican releases page](https://github.com/PelicanPlatform/pelican/releases) (macOS, Linux and Windows builds are published), unpack it, then:

```bash
pelican object ls osdf:///ospool/uc-shared/public/OSG-Staff/validation/
pelican object get osdf:///ospool/uc-shared/public/OSG-Staff/validation/test.txt ./test.txt
cat test.txt
```

The last command prints `Hello, World!`. Add `-r` to `object get` to download a whole directory.

## 6. Getting help

- OSG facilitators: [support@osg-htc.org](mailto:support@osg-htc.org), plus office hours listed in the [OSPool documentation](https://portal.osg-htc.org/documentation/).
- Research Computing can help you decide whether your work fits and look over your first submit file. [Contact us](../../help/).
