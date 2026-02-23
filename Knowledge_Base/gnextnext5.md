## Running Genomics Nextflow Pipelines on the UCR HPCC Cluster

### Introduction

This article provides a guide to creating and running genomics pipelines using Nextflow on the University of California, Riverside High-Performance Computing Cluster (HPCC), also known as Ursa Major. Nextflow is a powerful workflow management system that simplifies the creation of complex, scalable, and reproducible pipelines, especially in bioinformatics.  The UCR HPCC cluster utilizes Slurm as its default scheduler, and this guide will focus on leveraging Slurm to execute your Nextflow pipelines efficiently.

In this article, you will learn how to:

*   Set up Nextflow on the HPCC cluster.
*   Design a basic genomics pipeline using Nextflow.
*   Configure Nextflow to run jobs using Slurm on the HPCC partitions.
*   Submit and monitor your Nextflow pipelines.
*   Optimize your pipeline execution on the HPCC resources.

Let's get started!

### Table of Contents

1.  [Prerequisites](#prerequisites)
2.  [Setting up Nextflow on the HPCC](#setting-up-nextflow-on-the-hpcc)
3.  [Designing a Basic Genomics Nextflow Pipeline](#designing-a-basic-genomics-nextflow-pipeline)
4.  [Configuring Nextflow for Slurm on HPCC](#configuring-nextflow-for-slurm-on-hpcc)
5.  [Running Your Nextflow Pipeline](#running-your-nextflow-pipeline)
6.  [Monitoring Your Pipeline](#monitoring-your-pipeline)
7.  [Optimizing Your Pipeline for HPCC](#optimizing-your-pipeline-for-hpcc)
8.  [Getting Help and Resources](#getting-help-and-resources)

### 1. Prerequisites <a name="prerequisites"></a>

Before you begin, ensure you have the following:

*   **HPCC Account:** You need an active account on the UCR HPCC cluster. If you don't have one, request an account by emailing support@hpcc.ucr.edu.  Accounts are available to researchers from all departments and colleges at UC Riverside for a minimal recharge fee.
*   **Basic HPC Knowledge:** Familiarity with using the command line in a Linux environment and basic HPC concepts like schedulers (Slurm) and job submission is helpful.
*   **Genomics Workflow Understanding:**  A general understanding of the genomics workflow you intend to implement in Nextflow is essential.
*   **Data Access:** Ensure your genomics data is accessible on the HPCC storage. The HPCC offers approximately 6 PB of network storage via GPFS.

### 2. Setting up Nextflow on the HPCC <a name="setting-up-nextflow-on-the-hpcc"></a>

The recommended way to access the HPCC cluster is through the web console SSH.  Once you have SSH access to the cluster, follow these steps to set up Nextflow:

**Step 2.1: Connect to the HPCC**

Use the web console SSH or your preferred SSH client to connect to the HPCC head node:

```bash
ssh username@cluster.hpcc.ucr.edu
```
Replace `username` with your HPCC username. You will be automatically directed to one of the head nodes (Jay or Lark).

**Step 2.2: Install Nextflow**

You can install Nextflow in your home directory. A convenient location is within a dedicated `apps` directory. If you don't have one, create it:

```bash
mkdir $HOME/apps
cd $HOME/apps
```

Download the Nextflow binary using `wget`:

```bash
wget -qO- get.nextflow.io | bash
```

This command downloads the Nextflow installation script and executes it, placing the `nextflow` executable in your `$HOME/apps` directory.

**Step 2.3: Add Nextflow to your PATH (Optional but Recommended)**

To run Nextflow commands from anywhere in the terminal, add the Nextflow directory to your `PATH` environment variable.  You can do this by adding the following line to your `~/.bashrc` file:

```bash
echo 'export PATH=$PATH:$HOME/apps' >> ~/.bashrc
source ~/.bashrc
```

Now you should be able to run `nextflow` commands directly. Verify the installation by checking the Nextflow version:

```bash
nextflow -v
```

You should see the installed Nextflow version printed in the output.

### 3. Designing a Basic Genomics Nextflow Pipeline <a name="designing-a-basic-genomics-nextflow-pipeline"></a>

Let's create a simple example Nextflow pipeline to demonstrate the basic concepts. This pipeline will use FastQC to perform quality control on a set of FASTQ files.

**Step 3.1: Create a Pipeline Directory**

Create a directory for your Nextflow pipeline:

```bash
mkdir nf-genomics-pipeline
cd nf-genomics-pipeline
```

**Step 3.2: Create the Nextflow Script (`main.nf`)**

Create a file named `main.nf` using your preferred text editor (e.g., `vim`, `nano`).  Paste the following Nextflow script into the file:

```nextflow
#!/usr/bin/env nextflow

params.input_dir = "${baseDir}/data/fastq" // Default input directory
params.output_dir = "${baseDir}/results"  // Default output directory

Channel
    .fromPath( params.input_dir + "/*.fastq.gz" )
    .ifEmpty { exit "Input directory '${params.input_dir}' contains no FASTQ files" }
    .set { reads_ch }

process fastqc {
    tag { sample_id }
    publishDir "${params.output_dir}/${sample_id}/fastqc", mode: 'copy'

    input:
    tuple val(sample_id), path(reads) from reads_ch

    output:
    path "fastqc_report.html" into fastqc_reports_ch

    script:
    """
    module load fastqc  # Load FastQC module on HPCC
    fastqc ${reads} -o .
    mv ${sample_id}* fastqc_report.html
    """
}

workflow {
    reads_ch
        .map { file -> tuple(file.name.replace('.fastq.gz',''), file) }
        .view() // Optional: Print input files to console
        .groupTuple()
        .fastqc()
}
```

**Explanation of the Script:**

*   **`params.input_dir` and `params.output_dir`:**  Define input and output directories as parameters, allowing for easy customization.
*   **`Channel.fromPath(...)`:** Creates a Nextflow channel named `reads_ch` that emits FASTQ files found in the input directory.
*   **`process fastqc { ... }`:** Defines a process named `fastqc` that will execute the FastQC software.
    *   **`tag { sample_id }`:**  Tags each process execution with the `sample_id` for better tracking.
    *   **`publishDir ...`:** Defines where to publish the output files after the process completes. In this case, it copies the `fastqc_report.html` to the specified output directory under a sample-specific folder.
    *   **`input: tuple val(sample_id), path(reads) from reads_ch`:**  Declares the input to the process, receiving tuples of `(sample_id, reads_path)` from the `reads_ch` channel.
    *   **`output: path "fastqc_report.html" into fastqc_reports_ch`:** Declares the output of the process, emitting the `fastqc_report.html` file into the `fastqc_reports_ch` channel (though this channel is not used further in this simple example).
    *   **`script: ...`:** Contains the shell script to be executed within the process.
        *   **`module load fastqc`:**  Crucially, this line loads the FastQC module available on the HPCC, ensuring the software is available in the execution environment. You can find available modules using `module avail`.
        *   **`fastqc ${reads} -o .`:**  Executes FastQC on the input reads, outputting results to the current directory (`.`).
        *   **`mv ...`:** Renames the FastQC output HTML file to `fastqc_report.html` for consistent output naming.
*   **`workflow { ... }`:** Defines the main workflow logic.
    *   **`reads_ch.map { ... }.groupTuple().fastqc()`:**  Chains together operations on the `reads_ch` channel:
        *   **`.map { ... }`:**  Transforms each input file path into a tuple of `(sample_id, file_path)`.
        *   **`.view()`:**  (Optional) Prints the emitted tuples to the console for debugging.
        *   **`.groupTuple()`:** Groups tuples (though not strictly necessary here as we expect single FASTQ files per sample in this basic example, it's good practice for paired-end reads or more complex scenarios).
        *   **`.fastqc()`:**  Executes the `fastqc` process for each item in the channel.

**Step 3.3: Create Input Data (Optional for Testing)**

For testing purposes, you can create a dummy FASTQ file in a `data/fastq` directory relative to your pipeline script:

```bash
mkdir -p data/fastq
touch data/fastq/sample1.fastq.gz
touch data/fastq/sample2.fastq.gz
```

In a real scenario, you would replace these dummy files with your actual genomics FASTQ data.

### 4. Configuring Nextflow for Slurm on HPCC <a name="configuring-nextflow-for-slurm-on-hpcc"></a>

To run your Nextflow pipeline on the HPCC using Slurm, you need to create a Nextflow configuration file.

**Step 4.1: Create `nextflow.config`**

In the same directory as your `main.nf` script, create a file named `nextflow.config` and add the following configuration:

```groovy
profiles {
    slurm {
        executor = 'slurm'
        queue = 'epyc'  // Default partition, consider changing based on needs (intel, batch, highmem, gpu)
        // account = 'your_allocation_name' // Uncomment and replace if you need to specify an allocation
        submitOptions = {
            "-J nextflow_pipeline" // Job name in Slurm queue
        }
        // Optional resource requests (can also be defined within processes)
        // beforeScript = 'module load java' // Uncomment if your Nextflow version requires a specific Java module
        // cpus = 1
        // memory = '4.gb'
        // time = '1h'
    }
}
```

**Explanation of `nextflow.config`:**

*   **`profiles { slurm { ... } }`:** Defines a configuration profile named `slurm`. You will use this profile when running your pipeline on HPCC.
*   **`executor = 'slurm'`:** Specifies that Nextflow should use the Slurm executor.
*   **`queue = 'epyc'`:** Sets the default Slurm partition to `epyc`.  You can change this to `intel`, `batch`, `highmem`, `gpu`, or a lab-specific partition if applicable, based on your pipeline's requirements. The `epyc` partition uses AMD EPYC cores and is a good general-purpose option.
*   **`account = 'your_allocation_name'`:**  If your lab uses a specific allocation name, uncomment this line and replace `'your_allocation_name'` with your allocation name.  **Note:**  In Slurm submission scripts on UCR HPCC, allocation names are generally not required in SBATCH commands.
*   **`submitOptions = { "-J nextflow_pipeline" }`:**  Allows you to pass additional options to the `sbatch` command. Here, we set the Slurm job name to `nextflow_pipeline`.
*   **`beforeScript = 'module load java'`:** If you encounter issues with Java versions (though Nextflow typically bundles its own), you might need to uncomment this and load a Java module.
*   **`cpus`, `memory`, `time`:** These are commented out in the global profile. It's generally better to define resource requests **within each `process`** in your Nextflow script for more granular control and optimization.

**Choosing the Right Partition:**

*   **`epyc`**: AMD EPYC cores, good for general compute, default RAM 1GB, default time 168 hours.
*   **`intel`**: Intel Broadwell cores, good for general compute, default RAM 1GB, default time 168 hours.
*   **`batch`**: AMD cores, good for general compute, default RAM 1GB, default time 168 hours.
*   **`highmem`**: Intel cores, for memory-intensive jobs, RAM from 100GB to 1000GB, default time 48 hours. **Requires explicit memory request >= 100GB.**
*   **`gpu`**:  AMD/Intel cores with NVIDIA GPUs (K80, P100, A100), for GPU-accelerated tasks, default RAM 1GB, default time 48 hours. **Requires explicit GPU resource request.**
*   **`short`**: Mixed nodes, for short jobs (max 2 hours), default RAM 1GB.

Select the partition that best matches your pipeline's CPU, memory, time, and software (CPU architecture, GPU) requirements. For this basic FastQC example, `epyc` or `intel` are suitable.

### 5. Running Your Nextflow Pipeline <a name="running-your-nextflow-pipeline"></a>

Now you are ready to run your Nextflow pipeline on the HPCC.

**Step 5.1: Submit the Pipeline**

From the directory containing your `main.nf` and `nextflow.config` files, execute the following command to submit your pipeline to Slurm using the `slurm` profile:

```bash
nextflow run main.nf -profile slurm
```

**Explanation:**

*   **`nextflow run main.nf`:**  This is the basic command to run a Nextflow pipeline, specifying `main.nf` as the script.
*   **`-profile slurm`:**  This tells Nextflow to use the `slurm` configuration profile you defined in `nextflow.config`, which sets up the Slurm executor and other HPCC-specific settings.

Nextflow will parse your script, configure the Slurm jobs, and submit them to the HPCC scheduler. You will see output in your terminal indicating the pipeline execution.

**Step 5.2: Check Output**

Once the pipeline completes successfully, you will find the FastQC output reports in the `results` directory (as defined by `params.output_dir` and `publishDir` in your script):

```bash
ls results/sample1/fastqc/
ls results/sample2/fastqc/
```

You should see `fastqc_report.html` files and other FastQC output files in these directories.

### 6. Monitoring Your Pipeline <a name="monitoring-your-pipeline"></a>

You can monitor your Nextflow pipeline execution in several ways:

**Step 6.1: Nextflow Execution Log**

Nextflow provides a detailed execution log in the `.nextflow/` directory within your pipeline directory.  You can view the log file (e.g., `.nextflow/runs/XXXXXXXXX/pipeline.log`) to see real-time progress, errors, and resource usage.

**Step 6.2: Slurm Job Status**

Use Slurm commands to monitor the jobs submitted by Nextflow.

*   **`squeue -u $USER`**:  Shows the status of your currently running and queued Slurm jobs.
*   **`squeue --start -u $USER`**:  Shows the estimated start time for your queued jobs.
*   **`scontrol show job <JOBID>`**:  Provides detailed information about a specific Slurm job (replace `<JOBID>` with the actual job ID). You can find the Slurm Job ID in the Nextflow execution output or by using `squeue`.
*   **`sacct -u $USER -l`**:  Shows information about past Slurm jobs.

**Step 6.3: Slurm Job Output Files**

By default, Slurm writes the standard output and standard error of each job to files named `slurm-<JOBID>.out`. These files are usually located in the directory where you submitted the Nextflow pipeline. Check these files for any error messages or output from your processes.

**Step 6.4: `jobMonitor` or `qstatMonitor`**

The HPCC provides custom commands `jobMonitor` or `qstatMonitor` to summarize the activity of all users on the cluster.  These can be helpful for getting an overview of cluster usage.

### 7. Optimizing Your Pipeline for HPCC <a name="optimizing-your-pipeline-for-hpcc"></a>

To run your genomics pipelines efficiently on the HPCC, consider these optimization strategies:

**Step 7.1: Resource Requests in Processes**

Define resource requests (CPU cores, memory, time) **within each `process`** in your Nextflow script. This allows for process-specific resource allocation and better utilization of cluster resources.

**Example Process with Resource Requests:**

```nextflow
process my_process {
    cpus 4          // Request 4 CPU cores
    memory '8.GB'    // Request 8GB of memory
    time '2h'        // Request 2 hours of wall time
    queue 'intel'   // Optionally specify a queue (partition)

    input:
    // ...

    output:
    // ...

    script:
    // ...
}
```

If resource requests are not defined within a process, Nextflow will use default values, which might not be optimal for your specific tasks.

**Step 7.2: Use `seff` for Efficiency Analysis**

After a job completes, use the `seff <JOBID>` command (replace `<JOBID>` with your Slurm Job ID) to analyze resource utilization. `seff` provides information about CPU efficiency, memory efficiency, and job wall-clock time.

```bash
seff <JOBID>
```

Analyze the `seff` output to identify processes that are underutilizing resources (e.g., low CPU or memory efficiency). Adjust your resource requests accordingly in your Nextflow script for future runs. It's recommended to request slightly more memory than actually used to account for variations in input data.

**Step 7.3: Choose the Right Partition**

Select the most appropriate HPCC partition for each process based on its resource requirements and software compatibility. For example:

*   For memory-intensive processes, use the `highmem` partition and request sufficient memory (>= 100GB).
*   For GPU-accelerated tools, use the `gpu` partition and request the necessary number and type of GPUs using `--gres=gpu:<type>:<count>` in your process configuration (or in `nextflow.config` profile if applicable).
*   For MPI-based applications, ensure you use a homogeneous partition like `batch` or `intel` and use the `--ntasks` option in your process configuration to request physical cores for MPI ranks.

**Step 7.4: Parallelization Strategies**

Nextflow inherently facilitates parallelization by processing data in parallel across available resources. Ensure your pipeline design leverages this:

*   **Channel Operations:** Use Nextflow channels effectively to split and distribute data to processes for parallel execution.
*   **Software Parallelization:** If your genomics tools support multi-threading or MPI, configure your processes to utilize these parallelization methods. Request the appropriate number of CPUs (`cpus` directive) for multi-threaded tools or use MPI execution within your scripts for MPI-enabled tools, requesting cores with `--ntasks` and using `mpirun` or `srun`.

**Step 7.5: Caching and Resuming**

Nextflow's caching mechanism can significantly speed up pipeline re-runs. By default, Nextflow caches process execution results. If you re-run a pipeline with the same input and code, Nextflow will reuse cached results, skipping re-execution of processes.

Use the `-resume` option when re-running pipelines to leverage caching and resume from where a previous run left off.

```bash
nextflow run main.nf -profile slurm -resume
```

### 8. Getting Help and Resources <a name="getting-help-and-resources"></a>

If you encounter issues or have further questions, here are valuable resources:

*   **UCR Research Computing Support:**
    *   **Email:** research-computing@ucr.edu
    *   **Slack:** [https://ucr-research-compute.slack.com/](https://ucr-research-compute.slack.com/) (Request access if you are not already a member).

*   **UCR HPCC Documentation:** Refer to this knowledge base article and other documentation provided by UCR Research Computing for information about the HPCC cluster, Slurm, available software modules, and usage guidelines.
*   **Nextflow Documentation:** The official Nextflow documentation is comprehensive and a great resource for learning Nextflow concepts, DSL, and features: [https://www.nextflow.io/docs/](https://www.nextflow.io/docs/)
*   **UCR Research Computing GitHub:** Explore the UCR Research Computing GitHub repository for useful notebooks and examples related to HPC and Nextflow (as mentioned in the provided facts).

By following this guide and utilizing the available resources, you should be well-equipped to create and run your genomics Nextflow pipelines efficiently on the UCR HPCC cluster. Happy computing!

**Contact us for help or to learn more!**

*   Email: research-computing@ucr.edu
*   UCR Research Computing Slack: [https://ucr-research-compute.slack.com/](https://ucr-research-compute.slack.com/)