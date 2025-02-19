# Running Example Nextflow Genomics Workflows on HPCC

## Introduction

This article will guide you through running an example genomics workflow using Nextflow on UCR's High Performance Computing Cluster (HPCC), also known as Ursa Major. Nextflow is a powerful workflow management system that simplifies the creation and execution of complex computational pipelines, particularly in bioinformatics. This guide will help you get started with a basic Nextflow workflow on HPCC, leveraging Slurm for job scheduling.

## Table of Contents

1.  [Prerequisites](#prerequisites)
2.  [Accessing HPCC (Ursa Major)](#accessing-hpcc-ursa-major)
3.  [Setting up Nextflow](#setting-up-nextflow)
4.  [Example Nextflow Workflow: FastQC](#example-nextflow-workflow-fastqc)
5.  [Running the Workflow on HPCC using Slurm](#running-the-workflow-on-hpcc-using-slurm)
    *   [Step 1: Create a Nextflow Script](#step-1-create-a-nextflow-script)
    *   [Step 2: Create a Slurm Submission Script](#step-2-create-a-slurm-submission-script)
    *   [Step 3: Submit the Slurm Job](#step-3-submit-the-slurm-job)
6.  [Monitoring Your Workflow](#monitoring-your-workflow)
7.  [Accessing Output Files](#accessing-output-files)
8.  [Further Resources](#further-resources)
9.  [Contact and Support](#contact-and-support)

## 1. Prerequisites <a name="prerequisites"></a>

Before you begin, ensure you have the following:

*   **An active UCR Research Computing account:** You need an account to access and use HPCC resources. If you don't have one, please contact Research Computing to request access.
*   **Basic understanding of High Performance Computing (HPC) concepts:** Familiarity with concepts like job scheduling, clusters, and file systems will be helpful.
*   **Web Consol SSH Access to HPCC:**  UCR Research Computing recommends using the web console SSH for accessing HPCC services.
*   **Basic familiarity with Linux command line:** You'll be working in a Linux environment on HPCC.

## 2. Accessing HPCC (Ursa Major) <a name="accessing-hpcc-ursa-major"></a>

The preferred method to access HPCC is through the web console SSH.

1.  **Open your web browser** and navigate to the UCR Research Computing web console (consult UCR Research Computing documentation for the exact URL, as it may change).
2.  **Log in** using your UCR NetID and password.
3.  **Launch a web-based SSH terminal session** to one of the HPCC login nodes. This will give you a command-line interface to interact with the cluster.

*Visual Aid: Screenshot of the UCR Research Computing web console login page and the option to launch a web-based SSH terminal.*

## 3. Setting up Nextflow <a name="setting-up-nextflow"></a>

Nextflow needs to be available in your environment on HPCC.  A recommended way to manage software on HPCC is through environment modules.

1.  **Check if Nextflow is available as a module:** In your SSH terminal, run the command:

    ```bash
    module avail nextflow
    ```

2.  **If Nextflow is available as a module:** Load the desired Nextflow version using the `module load` command. For example:

    ```bash
    module load nextflow
    ```

    *Replace `nextflow` with a specific version if needed, e.g., `module load nextflow/23.10.0`.*

3.  **If Nextflow is not available as a module (or if you need a specific version):** You can install Nextflow locally in your home directory.  Here's how to install it using `curl`:

    ```bash
    curl -s get.nextflow.io | bash
    ```

    This command downloads and installs Nextflow in your current directory. To make it easily accessible, you can move the `nextflow` executable to a directory in your `PATH`, such as `~/bin` (create `~/bin` if it doesn't exist and add `export PATH=$PATH:$HOME/bin` to your `~/.bashrc` or `~/.bash_profile` for future sessions).

    ```bash
    mkdir -p ~/bin
    mv nextflow ~/bin/
    echo 'export PATH=$PATH:$HOME/bin' >> ~/.bashrc
    source ~/.bashrc  # Apply changes to the current session
    ```

4.  **Verify Nextflow installation:** After either loading the module or installing it locally, check if Nextflow is correctly installed by running:

    ```bash
    nextflow -version
    ```

    This should display the installed Nextflow version.

## 4. Example Nextflow Workflow: FastQC <a name="example-nextflow-workflow-fastqc"></a>

For this example, we will use a simple Nextflow workflow that runs FastQC, a popular tool for quality control of sequencing data.

**Create a file named `fastqc_workflow.nf`** using a text editor like `nano` or `vim` on HPCC.

```bash
nano fastqc_workflow.nf
```

**Paste the following Nextflow script into `fastqc_workflow.nf`:**

```nextflow
#!/usr/bin/env nextflow

params.reads = './path/to/your/reads/*.fastq.gz' // Replace with your reads path

process fastqc {
    input:
    path(reads)

    output:
    path "fastqc_results"

    container 'quay.io/biocontainers/fastqc:0.12.1--0' // Using biocontainer for reproducibility

    script:
    """
    mkdir fastqc_results
    fastqc ${reads} -o fastqc_results
    """
}

workflow {
    FastQC(params.reads)
}
```

**Explanation of the script:**

*   `#!/usr/bin/env nextflow`:  Shebang line to execute the script with Nextflow.
*   `params.reads = './path/to/your/reads/*.fastq.gz'`: Defines a parameter `reads` that specifies the path to your input FASTQ files. **You need to replace `'./path/to/your/reads/*.fastq.gz'` with the actual path to your FASTQ files on HPCC.**  For testing purposes, you can download example FASTQ files to your HPCC account or use publicly available datasets.
*   `process fastqc { ... }`: Defines a Nextflow process named `fastqc`.
    *   `input: path(reads)`: Declares that the process takes input from the `reads` variable, which is expected to be a path to files.
    *   `output: path "fastqc_results"`: Declares that the process will output a directory named `fastqc_results`.
    *   `container 'quay.io/biocontainers/fastqc:0.12.1--0'`: Specifies a container image from Biocontainers to run FastQC. This ensures reproducibility.
    *   `script: ...`:  Contains the shell script to be executed within the process.
        *   `mkdir fastqc_results`: Creates the output directory.
        *   `fastqc ${reads} -o fastqc_results`: Runs FastQC on the input reads and saves the output to the `fastqc_results` directory.
*   `workflow { FastQC(params.reads) }`: Defines the workflow, which in this simple case just runs the `fastqc` process with the input `reads`.

## 5. Running the Workflow on HPCC using Slurm <a name="running-the-workflow-on-hpcc-using-slurm"></a>

To run this Nextflow workflow on HPCC, you need to submit it as a Slurm job.

### Step 1: Create a Nextflow Script <a name="step-1-create-a-nextflow-script"></a>

You have already created the Nextflow script `fastqc_workflow.nf` in the previous step.  Make sure to **edit the `params.reads` line** in `fastqc_workflow.nf` to point to the correct location of your input FASTQ files on HPCC. If you don't have your own data readily available, you can use a public dataset or create dummy files for testing.

For example, if your FASTQ files are in `/home/<your_username>/data/fastq/`, you would change the line to:

```nextflow
params.reads = '/home/<your_username>/data/fastq/*.fastq.gz'
```

### Step 2: Create a Slurm Submission Script <a name="step-2-create-a-slurm-submission-script"></a>

Create a Slurm submission script, for example, `run_fastqc.sh`, using a text editor:

```bash
nano run_fastqc.sh
```

**Paste the following Slurm script into `run_fastqc.sh`:**

```bash
#!/bin/bash
#SBATCH --job-name=nf_fastqc
#SBATCH --nodes=1
#SBATCH --cpus-per-task=2
#SBATCH --mem=4GB
#SBATCH --output=fastqc_job.out
#SBATCH --error=fastqc_job.err

module load nextflow  # Or ensure nextflow is in your PATH if locally installed

nextflow run fastqc_workflow.nf
```

**Explanation of the Slurm script:**

*   `#!/bin/bash`: Shebang line to execute the script with bash.
*   `#SBATCH --job-name=nf_fastqc`:  Sets the job name to `nf_fastqc` (you can customize this).
*   `#SBATCH --nodes=1`:  Requests 1 node. For this simple workflow, 1 node is sufficient.
*   `#SBATCH --cpus-per-task=2`: Requests 2 CPU cores per task (Nextflow process). Adjust this based on the resource needs of your actual workflow.
*   `#SBATCH --mem=4GB`:  Requests 4GB of memory. Adjust based on your workflow's memory requirements.
*   `#SBATCH --output=fastqc_job.out`:  Specifies the output file for standard output.
*   `#SBATCH --error=fastqc_job.err`: Specifies the error file for standard error.
*   `module load nextflow`:  Loads the Nextflow module. If you installed Nextflow locally, ensure that the directory containing the `nextflow` executable is in your `PATH` instead of using `module load`.
*   `nextflow run fastqc_workflow.nf`:  This is the command that executes your Nextflow workflow script.

**Important Notes for UCR HPCC Slurm scripts:**

*   **Do not include `#SBATCH --time`, `#SBATCH --mail-user`, `#SBATCH --mail-type`, or `#SBATCH --account` in your Slurm submission scripts on UCR HPCC.**  Time limits are managed by the system, and email notifications and allocation names are not required in SBATCH commands as per UCR Research Computing's recommendations.

### Step 3: Submit the Slurm Job <a name="step-3-submit-the-slurm-job"></a>

Submit the Slurm job using the `sbatch` command from the directory where you saved both `fastqc_workflow.nf` and `run_fastqc.sh`:

```bash
sbatch run_fastqc.sh
```

This command submits the `run_fastqc.sh` script to the Slurm scheduler. Slurm will then queue and execute your Nextflow workflow based on the requested resources.

## 6. Monitoring Your Workflow <a name="monitoring-your-workflow"></a>

You can monitor the status of your Slurm job using commands like `squeue`. To see jobs for your user:

```bash
squeue -u <your_username>
```

Replace `<your_username>` with your UCR username.

You can also check the output and error files (`fastqc_job.out` and `fastqc_job.err`) for progress information and any errors that might occur during the workflow execution.

Nextflow also provides its own monitoring capabilities.  It typically outputs a working directory (e.g., `.nextflow/`) where it stores logs and intermediate files. You can examine these logs for more detailed information about the workflow's progress.

## 7. Accessing Output Files <a name="accessing-output-files"></a>

Once the Nextflow workflow completes successfully, the output files will be located in the directory specified by the `output` directive in your Nextflow script. In our example, the FastQC results will be in the `fastqc_results` directory created in the same directory where you ran the workflow.

You can use standard Linux commands like `ls`, `cd`, and `scp` (if you need to transfer files to your local machine) to access and manage your output files.

## 8. Further Resources <a name="further-resources"></a>

*   **Nextflow Documentation:** [https://www.nextflow.io/docs/](https://www.nextflow.io/docs/) - Comprehensive documentation for Nextflow.
*   **UCR Research Computing Website:** [Consult the UCR Research Computing website for specific documentation on HPCC, Slurm, and available software modules.]
*   **UCR Research Computing GitHub:** [Check the UCR Research Computing GitHub repository for example notebooks and potentially example Nextflow workflows.]

## 9. Contact and Support <a name="contact-and-support"></a>

If you encounter issues or have further questions, please don't hesitate to reach out to UCR Research Computing for assistance:

*   **Email:** research-computing@ucr.edu
*   **UCR Research Computing Slack:** [https://ucr-research-compute.slack.com/](https://ucr-research-compute.slack.com/)

We are here to help you make the most of HPCC for your research!