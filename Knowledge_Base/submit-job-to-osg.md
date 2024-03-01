---
id: submitt-jobs-to-osg
title: Submitt jobs to OSG
---

## Submitt jobs to OSG

To submit jobs to the Open Science Grid (OSG), you typically follow these steps:

1. **Preparation:**
   - Ensure you have access to an OSG submit host. This might be provided by your institution or a project you're part of.
   - Prepare your computing job, which includes your executable or script and any input files it needs. You should also determine the computational resources your job requires, such as CPU time, memory, and disk space.
2. **Job Description:**
   - Write a job description file using HTCondor's Job Description Language (JDL). This file describes your job's requirements and resources needed. Here's a basic example of what it might look like:
     ```
     Universe = vanilla
     Executable = my_script.sh
     Arguments = argument1 argument2
     Output = job.out
     Error = job.err
     Log = job.log
     should_transfer_files = YES
     when_to_transfer_output = ON_EXIT
     transfer_input_files = input_file1, input_file2
     +ProjectName = "MyProject"
     queue
     ```
     This example specifies the script to run (`my_script.sh`), arguments to pass to the script, files to transfer to the execution host, and where to log the job's output.
3. **Submit the Job:**
   - With the job description file ready, you submit the job to HTCondor using the `condor_submit` command followed by the name of your job description file:
     ```
     condor_submit my_job.jdl
     ```
   - HTCondor processes your job submission, assigns it to a compute resource, and executes it. You can monitor the status of your job with the `condor_q` command.
4. **Retrieve Output:**
   - Once your job completes, HTCondor transfers any output files back to the submit host. You can find these files in the directory from which you submitted the job, named as specified in the job description file.
5. **Analyze Results:**
   - After your job finishes and the output files are transferred back, you can analyze the results.

Remember, while this provides a general overview, specific steps might vary based on the computational requirements of your job, the configuration of the OSG access point you are using, and any special policies or configurations required by your project or the OSG. Always refer to the documentation provided by your institution or the specific OSG resource you are using for detailed instructions tailored to your situation.