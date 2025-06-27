# How to Log into SDSC Comet and Run a Test Job

## Introduction
This article provides a step-by-step guide on how to log into the SDSC Comet supercomputer and run a test job. By the end of this guide, you will understand the process of accessing Comet and executing a basic job to ensure your setup is correct.

## Table of Contents
1. [Access Requirements](#access-requirements)
2. [Logging Into SDSC Comet](#logging-into-sdsc-comet)
3. [Creating a Test Job Script](#creating-a-test-job-script)
4. [Submitting the Test Job](#submitting-the-test-job)
5. [Checking Job Status](#checking-job-status)
6. [Conclusion & Additional Resources](#conclusion--additional-resources)

## Access Requirements
Before logging into SDSC Comet, ensure you have:  
- An active SDSC account.  
- SSH client installed on your local machine.  
- Familiarity with basic terminal commands.

## Logging Into SDSC Comet
1. **Open Terminal:**  
   Launch your terminal (Linux/Mac) or Command Prompt (Windows with SSH client installed).

2. **Use SSH Command:**  
   Enter the following command, replacing `your_username` with your actual SDSC username:
   ```
   ssh your_username@comet.sdsc.edu
   ```  
   If prompted, enter your password.

3. **Access Confirmation:**  
   Once logged in, you should see a welcome message from SDSC Comet, confirming your access.

## Creating a Test Job Script
1. **Navigate to Your Home Directory:**  
   You can navigate using the following command:
   ```
   cd ~
   ```

2. **Create a New Job Script File:**  
   Use a text editor (like `nano`, `vim`, or `vi`) to create a new job script. For example:
   ```
   nano test_job.sh
   ```

3. **Job Script Content:**  
   Insert the following content into your script:
   ```bash
   #!/bin/bash
   #SBATCH --job-name=test_job      # Job name
   #SBATCH --output=test_job.out     # Output file
   #SBATCH --time=00:01:00           # Time limit hrs:min:sec
   #SBATCH --partition=compute       # Partition name

   echo "Hello World from Comet!"
   ```
   Save and exit the editor.  

## Submitting the Test Job
1. **Submit the Job:**  
   Use the `sbatch` command to submit your job script:
   ```
   sbatch test_job.sh
   ```

2. **Note the Job ID:**  
   Upon submission, note the Job ID provided in the output. You will need this to check the job status.

## Checking Job Status
1. **Check Job Queue:**  
   Use the `squeue` command to see your job in the queue:
   ```
   squeue -u your_username
   ```

2. **Monitoring Output Files:**  
   Once the job is complete, check the output file `test_job.out` to see the results of your job execution:
   ```
   cat test_job.out
   ```

## Conclusion & Additional Resources
In this guide, you have learned how to log into SDSC Comet, create a test job script, submit the job, and check the job's status.  For further assistance or inquiries, visit the following resources:
- [SDSC User Guide](https://www.sdsc.edu/support/user_guides.html)
- [SDSC Slack](https://sdsc.org/slack)
  
For any additional questions, you can contact UCR Research Computing at research-computing@ucr.edu.

---