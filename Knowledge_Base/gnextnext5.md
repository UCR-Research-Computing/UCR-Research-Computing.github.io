# Creating Genomics Nextflow Pipelines on UCR's HPCC (Ursa Major)

## Introduction

This article will guide you through the process of creating and running genomics pipelines using Nextflow on UCR's High-Performance Computing Cluster (HPCC), also known as Ursa Major. Nextflow is a powerful workflow management system that simplifies the creation of complex, data-intensive pipelines, especially in bioinformatics. By leveraging Ursa Major, you can access the computational resources necessary to execute these pipelines efficiently. This guide will cover everything from setting up your environment to running and monitoring your Nextflow pipelines.

## Table of Contents

1. [Introduction to Nextflow and Genomics Pipelines](#introduction-to-nextflow-and-genomics-pipelines)
2. [Setting up Your Environment on Ursa Major](#setting-up-your-environment-on-ursa-major)
    - 2.1 [Accessing Ursa Major via Web Console SSH](#accessing-ursa-major-via-web-console-ssh)
    - 2.2 [Loading Necessary Modules](#loading-necessary-modules)
    - 2.3 [Setting up your Nextflow Project](#setting-up-your-nextflow-project)
3. [Writing Your Nextflow Pipeline](#writing-your-nextflow-pipeline)
    - 3.1 [Basic Nextflow Pipeline Structure](#basic-nextflow-pipeline-structure)
    - 3.2 [Defining Processes](#defining-processes)
    - 3.3 [Workflow Logic](#workflow-logic)
    - 3.4 [Example: Simple Genomics Pipeline](#example-simple-genomics-pipeline)
4. [Running Your Nextflow Pipeline on Ursa Major](#running-your-nextflow-pipeline-on-ursa-major)
    - 4.1 [Creating a Nextflow Configuration File](#creating-a-nextflow-configuration-file)
    - 4.2 [Submitting Your Pipeline with Slurm](#submitting-your-pipeline-with-slurm)
    - 4.3 [Monitoring Pipeline Execution](#monitoring-pipeline-execution)
5. [Monitoring and Troubleshooting](#monitoring-and-troubleshooting)
    - 5.1 [Checking Slurm Job Status](#checking-slurm-job-status)
    - 5.2 [Nextflow Error Logs](#nextflow-error-logs)
    - 5.3 [Common Issues and Solutions](#common-issues-and-solutions)
6. [Conclusion](#conclusion)
7. [Additional Resources](#additional-resources)

## 1. Introduction to Nextflow and Genomics Pipelines

**Nextflow** is a domain-specific language (DSL) based on Groovy that simplifies the development of scalable and portable workflows. It is particularly well-suited for bioinformatics pipelines that often involve complex data manipulations and the use of various software tools. Nextflow pipelines are defined as a series of processes connected by channels, enabling data-driven parallelization and efficient resource utilization.

**Genomics pipelines** are computational workflows designed to analyze genomic data, such as DNA sequencing data (FASTQ files). These pipelines can include steps like quality control, read alignment, variant calling, and annotation.  Running these pipelines often requires significant computational resources due to the large datasets involved and the intensity of the computations.

**UCR's HPCC (Ursa Major)** is an on-premise high-performance computing cluster ideal for running computationally demanding tasks like genomics pipelines. Ursa Major utilizes the **Slurm** workload manager, which is the default scheduler for managing and allocating cluster resources. Using Nextflow on Ursa Major allows you to efficiently manage and execute your genomics pipelines using the cluster's resources.

## 2. Setting up Your Environment on Ursa Major

Before you can run Nextflow pipelines, you need to set up your environment on Ursa Major. This involves accessing the cluster, loading necessary software modules, and organizing your project files.

### 2.1 Accessing Ursa Major via Web Console SSH

The preferred method to access Ursa Major is through the **web console SSH**. This provides a convenient and secure way to interact with the cluster from your web browser.

**Steps to access Ursa Major via Web Console SSH:**

1.  Open your web browser and navigate to the UCR Research Computing web console (consult UCR Research Computing documentation for the exact URL).
2.  Log in using your UCR NetID and password.
3.  Locate and click on the "Web Console SSH" option. This will open a terminal interface directly in your browser, providing you with access to Ursa Major's login nodes.

*(Visual Aid Suggestion: Screenshot of the UCR Research Computing web console login page and the Web Console SSH option)*

### 2.2 Loading Necessary Modules

Ursa Major uses a module system to manage software installations. You need to load the `nextflow` and `java` modules to make these tools available in your environment.

**Steps to load modules:**

1.  Once you are logged into Ursa Major via the web console SSH, use the `module avail` command to see a list of available modules.
2.  To load Nextflow and Java, use the following commands:

    ```bash
    module load nextflow
    module load java
    ```

    You can verify that the modules are loaded using `module list`. This will show you the currently loaded modules.

### 2.3 Setting up your Nextflow Project

It's good practice to organize your Nextflow pipelines within a dedicated project directory. You can also use Git for version control, and UCR Research Computing prefers using **Gitlab**.

**Steps to set up your project:**

1.  **Create a project directory:**

    ```bash
    mkdir my_genomics_pipeline
    cd my_genomics_pipeline
    ```

2.  **Initialize a Git repository (optional but recommended):**

    ```bash
    git init
    ```

    If you are using UCR Gitlab, you can create a new project on Gitlab and then clone it to Ursa Major:

    ```bash
    git clone <your_gitlab_repository_url> .
    ```

3.  **Create your Nextflow pipeline file:**  You can start with a simple file named `main.nf`.

    ```bash
    touch main.nf
    ```

You are now ready to start writing your Nextflow pipeline.

## 3. Writing Your Nextflow Pipeline

Nextflow pipelines are written in a DSL that combines Groovy syntax with pipeline-specific constructs. A basic Nextflow pipeline consists of processes and workflows connected by channels.

### 3.1 Basic Nextflow Pipeline Structure

A Nextflow pipeline typically includes the following components:

*   **Processes:**  Define individual computational steps, such as running a specific software tool. Processes specify inputs, outputs, and the script to be executed.
*   **Channels:**  Act as queues that connect processes, allowing data to flow from one process to another. Channels enable parallel processing and data management.
*   **Workflows:** Define the overall structure of the pipeline, orchestrating the execution of processes and the flow of data through channels.

A minimal Nextflow script has this basic structure:

```nextflow
// Define a process
process my_process {
    input:
    // Input declarations

    output:
    // Output declarations

    script:
    """
    // Shell script to execute
    """
}

// Define a workflow
workflow {
    // Call processes and connect channels
    my_process()
}
```

### 3.2 Defining Processes

Processes are the building blocks of Nextflow pipelines. They encapsulate the execution of commands or scripts.

**Key elements of a process definition:**

*   **`process process_name { ... }`**:  Defines a process block with a unique name.
*   **`input:`**:  Specifies the inputs to the process. Inputs can be values, files, or channels.
*   **`output:`**:  Defines the outputs generated by the process. Outputs can also be values, files, or channels.
*   **`script:`**:  Contains the shell script or commands to be executed within the process. This is where you would typically run bioinformatics tools.

**Example Process:** Let's define a simple process that runs `fastqc` on a FASTQ file.

```nextflow
process fastqc_process {
    input:
    path(fastq_file)

    output:
    path("${fastq_file.baseDir}/${fastq_file.name}_fastqc.zip")

    script:
    """
    fastqc ${fastq_file}
    """
}
```

In this example:

*   `input: path(fastq_file)` declares that the process expects a file path as input and names it `fastq_file`.
*   `output: path("${fastq_file.baseDir}/${fastq_file.name}_fastqc.zip")` defines the output file path based on the input FASTQ file name.
*   `script: """ fastqc ${fastq_file} """` contains the command to run `fastqc` on the input FASTQ file.

### 3.3 Workflow Logic

The `workflow` block defines the execution flow of your pipeline. It specifies how processes are connected and the order in which they are executed. Channels are used to pass data between processes.

**Basic Workflow Example:** To use the `fastqc_process` defined above in a workflow:

```nextflow
workflow {
    fastq_channel = Channel.fromPath('data/*.fastq.gz') // Create a channel from FASTQ files in the 'data' directory
    fastqc_process(fastq_channel) // Run fastqc_process on the files in the channel
}
```

In this workflow:

*   `Channel.fromPath('data/*.fastq.gz')` creates a channel named `fastq_channel` that emits the paths to all FASTQ files in the `data` directory.  *(Visual Aid Suggestion: Diagram showing data flow from Channel to Process)*
*   `fastqc_process(fastq_channel)` calls the `fastqc_process` and uses the `fastq_channel` as input. Nextflow will automatically execute `fastqc_process` for each FASTQ file in the channel, in parallel if resources are available.

### 3.4 Example: Simple Genomics Pipeline

Let's create a slightly more complex example that includes FASTQC followed by Fastp for quality trimming.

```nextflow
process fastqc_process {
    input:
    path(fastq_file)

    output:
    path("${fastq_file.baseDir}/${fastq_file.name}_fastqc.zip")

    script:
    """
    fastqc ${fastq_file}
    """
}

process fastp_process {
    input:
    path(fastq_file)

    output:
    tuple path("${fastq_file.baseDir}/${fastq_file.name}_trimmed_R1.fastq.gz"), path("${fastq_file.baseDir}/${fastq_file.name}_trimmed_R2.fastq.gz")

    script:
    """
    fastp -i ${fastq_file} -o ${fastq_file.baseDir}/${fastq_file.name}_trimmed_R1.fastq.gz -o2 ${fastq_file.baseDir}/${fastq_file.name}_trimmed_R2.fastq.gz
    """
}


workflow {
    fastq_channel = Channel.fromPath('data/*.fastq.gz')

    fastqc_output = fastqc_process(fastq_channel) // Run FASTQC
    trimmed_reads = fastp_process(fastq_channel)  // Run Fastp

    // You can further process 'trimmed_reads' or 'fastqc_output' if needed
}
```

This example defines two processes: `fastqc_process` and `fastp_process`. The workflow reads FASTQ files from the `data` directory, runs FASTQC and Fastp on them in parallel. Note that this example assumes paired-end reads for `fastp`, you might need to adjust it based on your actual data.  *(Visual Aid Suggestion: Diagram showing FASTQ files -> fastqc_process -> fastqc_output, and FASTQ files -> fastp_process -> trimmed_reads, all orchestrated by workflow)*

## 4. Running Your Nextflow Pipeline on Ursa Major

To run your Nextflow pipeline on Ursa Major, you need to create a configuration file and submit the pipeline using Slurm.

### 4.1 Creating a Nextflow Configuration File

A Nextflow configuration file (`nextflow.config`) allows you to specify execution parameters, such as the executor (Slurm in this case), resource requirements, and work directory. Create a file named `nextflow.config` in your project directory with the following basic configuration for running on Ursa Major:

```config
executor {
    name = 'slurm'
}

process {
    executor = 'slurm'
    queue = 'batch' // Or specify a different Slurm queue if needed
    withLabel: {
        cpus_high: { cpus = 8 }
        mem_high:  { memory = '32.GB' }
    }
}

params {
    // Define any pipeline parameters here if needed
}

workDir = './work' // Specify a work directory
```

**Explanation of configuration options:**

*   **`executor.name = 'slurm'`**:  Sets the default executor to Slurm.
*   **`process.executor = 'slurm'`**:  Ensures that processes are executed using Slurm.
*   **`process.queue = 'batch'`**:  Specifies the Slurm queue to use (you can change this to other available queues like `standard` or specific research group queues if applicable).
*   **`process.withLabel`**: Allows you to define resource requirements for processes based on labels. For example, processes with the label `cpus_high` will request 8 CPUs, and processes with the label `mem_high` will request 32GB of memory. You can apply labels within your Nextflow script to processes that need specific resources (e.g., `process(label: 'cpus_high') { ... }`).
*   **`params { ... }`**:  Used to define pipeline parameters that can be passed via the command line.
*   **`workDir = './work'`**:  Sets the work directory where Nextflow stores intermediate files and execution logs.  It's good practice to keep the work directory within your project directory.

*(Visual Aid Suggestion: Code block showing an example nextflow.config file with comments explaining each section)*

### 4.2 Submitting Your Pipeline with Slurm

To run your Nextflow pipeline on Ursa Major, you will use the `nextflow run` command and submit it as a Slurm job.  **Important**: When submitting jobs to Ursa Major via Slurm, do not include resource requests (like time, memory, number of nodes, or email notifications) in your SBATCH script. These should be managed by Nextflow configurations or default Slurm settings.

**Steps to submit your pipeline:**

1.  **Create a Slurm submission script (e.g., `run_pipeline.sh`):**

    ```bash
    #!/bin/bash
    #SBATCH --job-name=nextflow_genomics_pipeline

    module load nextflow
    module load java

    nextflow run main.nf -c nextflow.config
    ```

    *   `#SBATCH --job-name=nextflow_genomics_pipeline`: Sets the job name for easy identification in Slurm queue.
    *   `module load nextflow` and `module load java`: Loads the necessary modules.
    *   `nextflow run main.nf -c nextflow.config`: Executes the Nextflow pipeline `main.nf` using the configuration file `nextflow.config`.

2.  **Submit the Slurm script:**

    ```bash
    sbatch run_pipeline.sh
    ```

    This command submits your Nextflow pipeline to the Slurm scheduler. Slurm will manage the job execution on Ursa Major's compute nodes.

### 4.3 Monitoring Pipeline Execution

Once you have submitted your pipeline, you can monitor its execution in several ways.

**Monitoring methods:**

*   **Slurm job status:** Use Slurm commands like `squeue` and `sacct` to check the status of your job (see section 5.1).
*   **Nextflow execution logs:** Nextflow generates detailed execution logs in the `.nextflow` directory within your project directory. The main log file is usually named `.nextflow.log`. You can monitor this log file for progress and errors.
*   **Nextflow work directory:**  The `work` directory (or the `workDir` you specified in `nextflow.config`) contains directories for each process execution, including process-specific logs, input, and output files. You can check these directories for details on individual process executions.
*   **Nextflow web UI (optional):** Nextflow can optionally provide a web-based user interface to monitor pipeline execution in real-time. You would need to configure this separately and it may require additional setup on Ursa Major depending on its accessibility. For basic monitoring, Slurm commands and log files are usually sufficient.

## 5. Monitoring and Troubleshooting

Monitoring your pipeline and troubleshooting issues are essential parts of running successful workflows.

### 5.1 Checking Slurm Job Status

You can use Slurm commands to monitor your job's status and resource usage.

*   **`squeue -u <your_username>`**:  Lists all jobs currently in the Slurm queue for your user. This will show you if your job is running (`R`), pending (`PD`), or completed (it will disappear from the queue when completed or terminated).
*   **`sacct -j <job_id>`**:  Provides accounting information for a specific job ID (replace `<job_id>` with the job ID reported by `sbatch`). This command can show you job start and end times, resource usage (CPU time, memory), and job status.
*   **`scancel <job_id>`**:  Cancels a running or pending job with the specified job ID. Use this if you need to stop your pipeline execution.

### 5.2 Nextflow Error Logs

Nextflow provides detailed logs that are crucial for troubleshooting pipeline errors.

*   **`.nextflow.log`**:  The main Nextflow log file in your project directory. It contains a comprehensive record of pipeline execution, including process starts, completions, errors, and warnings. Examine this file for error messages, stack traces, and general pipeline progress.
*   **Process-specific logs:** Within the `work` directory, each process execution has its own directory (e.g., `work/process/<process_hash>/`). Inside these directories, you will find `.command.log` and `.command.err` files, which contain the standard output and standard error of the shell commands executed within the process, respectively. These are very helpful for debugging issues within specific processes.

### 5.3 Common Issues and Solutions

Here are some common issues you might encounter and potential solutions:

*   **Module loading errors:**  If your pipeline fails because a software tool is not found, double-check that you have loaded the necessary modules in your Slurm submission script and that the module names are correct (`module load <module_name>`).
*   **Resource request errors:** If your job fails to start or gets terminated due to resource limits, review your `nextflow.config` file and adjust resource requests (CPUs, memory) for your processes. Ensure that your requests are within the limits of the Slurm queue you are using. You might need to use process labels to assign different resource requirements to different processes.
*   **Syntax errors in Nextflow script:**  Carefully review your `main.nf` file for syntax errors in the Nextflow DSL. Nextflow error messages in `.nextflow.log` can often point to the location of syntax errors.
*   **Data path issues:**  Ensure that file paths specified in your Nextflow script and configuration are correct and accessible on Ursa Major. Use absolute paths or paths relative to your project directory if necessary.
*   **Process execution errors:**  If a specific process fails, check the process-specific logs in the `work` directory (`.command.log`, `.command.err`) for error messages from the executed tools.

If you encounter persistent issues, consult the Nextflow documentation, UCR Research Computing resources (see "Additional Resources" below), or seek help from experts.

## 6. Conclusion

Creating and running genomics Nextflow pipelines on UCR's HPCC (Ursa Major) provides a powerful and efficient way to analyze large-scale genomic data. By following the steps outlined in this guide, you should be able to:

*   Set up your environment on Ursa Major using the web console SSH and module system.
*   Write Nextflow pipelines using processes, channels, and workflows.
*   Configure Nextflow for Slurm execution using `nextflow.config`.
*   Submit and monitor your pipelines on Ursa Major.
*   Troubleshoot common issues using Slurm commands and Nextflow logs.

Remember to leverage the resources available through UCR Research Computing and explore the Nextflow documentation for more advanced features and customization options. With practice, you can build sophisticated and scalable genomics pipelines to advance your research.

## 7. Additional Resources

For further assistance and more in-depth information, please refer to the following resources:

*   **UCR Research Computing Website:**  [Insert Link to UCR Research Computing Website Here] -  For documentation, FAQs, and updates related to Ursa Major and other research computing services at UCR.
*   **UCR Research Computing Slack Channel:** [Insert Link to UCR Research Computing Slack Here - e.g., `ucr-research-compute.slack.com/`] -  For real-time support, discussions, and community help from UCR Research Computing staff and other users.
*   **UCR Research Computing GitHub:** [Insert Link to UCR Research Computing GitHub Here] -  Check for useful example notebooks, scripts, and pipeline templates.
*   **Nextflow Documentation:** [https://www.nextflow.io/docs/](https://www.nextflow.io/docs/) -  The official Nextflow documentation provides comprehensive information on all aspects of Nextflow, including DSL syntax, configuration options, and best practices.
*   **Contact UCR Research Computing:**
    *   Email: research-computing@ucr.edu

We encourage you to reach out to UCR Research Computing for any questions or assistance you may need while developing and running your Nextflow genomics pipelines on Ursa Major!