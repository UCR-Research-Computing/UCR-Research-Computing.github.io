## Accessing SDSC Comet and Running a Test Job

**Introduction:**

This article provides a step-by-step guide on how to access the San Diego Supercomputer Center (SDSC) Comet cluster and run a simple test job. Comet is a powerful resource available to researchers, and this guide will help you get started with accessing the system and running your first job to ensure your environment is set up correctly. By following these instructions, you will be able to connect to Comet, create a basic Slurm submission script, submit a test job, and monitor its progress.

**Table of Contents:**

1.  **Accessing SDSC Comet via SSH**
2.  **Preparing a Test Job Script (Slurm)**
3.  **Submitting Your Test Job**
4.  **Monitoring Your Job Status**
5.  **Checking Job Output**
6.  **Conclusion and Further Resources**

---

**1. Accessing SDSC Comet via SSH**

To access SDSC Comet, you will use the Secure Shell (SSH) protocol.  This method allows you to securely connect to the Comet cluster from your local computer.

**Steps:**

*   **Open a Terminal:** On macOS or Linux, open the Terminal application. On Windows, you can use software like PuTTY or the Windows Subsystem for Linux (WSL) terminal.

*   **Use the SSH Command:**  Type the following command into your terminal, replacing `[your_username]` with your actual SDSC Comet username.

    ```bash
    ssh [your_username]@comet.sdsc.edu
    ```

    *   **Note:**  You will need an active SDSC Comet account to log in. If you do not have an account, you will need to apply for one through the SDSC allocations process. Refer to the SDSC Comet website for information on obtaining an account.

*   **Password or SSH Key Authentication:**
    *   **Password:** If you are using password authentication, you will be prompted to enter your SDSC Comet password. Type your password carefully and press Enter. Note that as you type your password in the terminal, you may not see any characters appearing – this is normal for security reasons.
    *   **SSH Key:**  For enhanced security and convenience, it is highly recommended to use SSH key-based authentication. If you have set up SSH keys for your Comet account, you will not be prompted for a password. Your SSH client will automatically use your private key to authenticate you.

*   **Successful Login:** If your username and password (or SSH key) are correct, you will be logged into the Comet cluster. You should see a command prompt that looks something like `[your_username]@comet-ln[number]:~$`, indicating you are on a Comet login node.

    *(Visual Aid: Screenshot of a terminal window showing a successful SSH login to Comet, displaying the command prompt)*

**2. Preparing a Test Job Script (Slurm)**

Comet uses Slurm Workload Manager to manage and schedule jobs. To run a job, you need to create a Slurm submission script. This script is a text file that contains instructions for Slurm on how to run your job, including resource requests and the commands to execute.

**Steps:**

*   **Create a Script File:**  Using a text editor on Comet (like `nano`, `vim`, or `emacs`, which are command-line based editors available on the login node), create a new file named `test_job.slurm`.

    ```bash
    nano test_job.slurm
    ```

*   **Add Slurm Directives and Commands:**  Paste the following content into your `test_job.slurm` file. This is a basic example script that will run a simple command to print the hostname and current date.

    ```slurm
    #!/bin/bash
    #SBATCH --job-name=test_job         # Job name
    #SBATCH --partition=compute          # Partition to submit to (e.g., compute, debug)
    #SBATCH --nodes=1                    # Number of nodes to request
    #SBATCH --ntasks-per-node=1          # Number of tasks per node
    #SBATCH --cpus-per-task=1            # Number of CPUs per task
    #SBATCH --time=00:05:00              # Time limit for the job (HH:MM:SS)
    #SBATCH --output=test_job.out        # Output file for stdout
    #SBATCH --error=test_job.err         # Output file for stderr

    # Load any necessary modules (if needed, not needed for this simple test)
    # module load ...

    # --- Your job commands begin below this line ---

    echo "Job ID: $SLURM_JOB_ID"
    echo "Hostname: $(hostname)"
    date

    echo "--- Job finished ---"
    ```

    **Explanation of Slurm Directives:**

    *   `#!/bin/bash`:  Specifies the script interpreter as Bash.
    *   `#SBATCH --job-name=test_job`:  Assigns the name "test\_job" to your job. This name will be used to identify your job in the queue.
    *   `#SBATCH --partition=compute`:  Specifies the partition (queue) where you want to run your job.  `compute` is a common partition for general compute jobs. You can also use `debug` for shorter test jobs. Check the Comet documentation for available partitions and their properties.
    *   `#SBATCH --nodes=1`:  Requests 1 compute node.
    *   `#SBATCH --ntasks-per-node=1`:  Requests 1 task per node. For this simple test, we only need one task.
    *   `#SBATCH --cpus-per-task=1`: Requests 1 CPU core per task.
    *   `#SBATCH --time=00:05:00`:  Sets a time limit of 5 minutes for the job.  If the job runs longer than this, it will be terminated.  It's good practice to estimate your job's runtime and set an appropriate time limit.
    *   `#SBATCH --output=test_job.out`:  Specifies the file where the standard output (stdout) of your job will be written.
    *   `#SBATCH --error=test_job.err`:  Specifies the file where the standard error (stderr) of your job will be written.

    **Job Commands:**

    *   `echo "Job ID: $SLURM_JOB_ID"`:  Prints the Slurm job ID to the output file.
    *   `echo "Hostname: $(hostname)"`: Prints the hostname of the compute node where the job is running.
    *   `date`:  Prints the current date and time.
    *   `echo "--- Job finished ---"`:  A simple message to indicate the job completion in the output.

*   **Save the Script:**  After pasting and reviewing the script, save and close the file in your text editor.  In `nano`, you can press `Ctrl+X`, then `Y` to save, and then `Enter` to confirm the filename.

**3. Submitting Your Test Job**

Now that you have created your Slurm submission script, you can submit it to the Slurm scheduler.

**Steps:**

*   **Use the `sbatch` Command:**  In your terminal on Comet, navigate to the directory where you saved `test_job.slurm` and use the `sbatch` command to submit the job.

    ```bash
    sbatch test_job.slurm
    ```

*   **Job Submission Confirmation:** If the submission is successful, Slurm will output a message similar to:

    ```
    Submitted batch job 1234567
    ```

    The number `1234567` is the Job ID assigned to your submitted job.  Make note of this Job ID as you will need it to monitor your job's status and check the output.

    *(Visual Aid: Screenshot of a terminal showing the `sbatch` command and the job submission confirmation with a Job ID)*

**4. Monitoring Your Job Status**

You can check the status of your submitted job using the `squeue` command.

**Steps:**

*   **Use the `squeue` Command:** To see the status of your job, use the following command:

    ```bash
    squeue -u [your_username]
    ```

    Replace `[your_username]` with your Comet username. This command will display a list of jobs currently in the queue or running for your user.

*   **Interpreting `squeue` Output:** The `squeue` command will display information about your job in columns. Key columns to look for are:

    *   **JOBID:**  The Job ID of your job.
    *   **PARTITION:** The partition the job is running or waiting in.
    *   **NAME:** The job name you specified in your Slurm script.
    *   **USER:** The username that submitted the job.
    *   **ST:**  Job state. Common states include:
        *   **PD:** Pending (waiting in the queue to be scheduled).
        *   **R:** Running.
        *   **CD:** Completed.
        *   **CF:** Configuring.
        *   **CG:** Completing.
        *   **F:** Failed.
        *   **TO:** Timed Out.
    *   **TIME:**  The elapsed time for running jobs.

    *   **Example `squeue` Output:**

        ```
        JOBID PARTITION     NAME     USER ST       TIME  NODES NODELIST(REASON)
        1234567 compute   test_job  your_u  R      00:00      1 comet-cn123
        ```

        In this example, job `1234567` named `test_job` is running (`ST=R`) on the `compute` partition, and it has been running for a short time.

    *   **Check Job Completion:**  Keep running `squeue -u [your_username]` until your job is no longer listed. Once it disappears from the `squeue` output, it means the job has completed (or finished in some state).

**5. Checking Job Output**

After your job has completed, you can check the output files you specified in your Slurm script (`test_job.out` and `test_job.err`).

**Steps:**

*   **Use `cat` or `less` to View Output Files:**  Use the `cat` command to display the contents of the output file directly in the terminal, or use `less` to view the file page by page.

    ```bash
    cat test_job.out
    ```

    or

    ```bash
    less test_job.out
    ```

*   **Examine `test_job.out`:**  You should see the output from the commands in your script, including the Job ID, hostname, and date.

    ```
    Job ID: 1234567
    Hostname: comet-cn123
    Tue Oct 17 10:30:00 PDT 2023
    --- Job finished ---
    ```

*   **Check `test_job.err`:**  If there were any errors during the job execution, they would be written to the `test_job.err` file. For this simple test job, `test_job.err` should be empty. You can check it using:

    ```bash
    cat test_job.err
    ```

**6. Conclusion and Further Resources**

Congratulations! You have successfully accessed SDSC Comet and run a test job. This article has covered the basic steps of logging in, creating a Slurm script, submitting the job, monitoring its status, and checking the output.

**Key Takeaways:**

*   Use SSH to securely connect to Comet using your username and password or SSH keys.
*   Slurm is the job scheduler on Comet. Use Slurm submission scripts to define your job requirements and commands.
*   The `sbatch` command submits your job script.
*   The `squeue` command allows you to monitor your job's status.
*   Job output and error messages are written to files specified in your Slurm script.

**Further Resources:**

*   **SDSC Comet Documentation:**  For more detailed information about Comet, including user guides, software information, partitions, advanced Slurm options, and more, refer to the official SDSC Comet documentation: [https://www.sdsc.edu/support/user_guides/comet.html](https://www.sdsc.edu/support/user_guides/comet.html)
*   **Slurm Documentation:** For comprehensive information about Slurm Workload Manager: [https://slurm.schedmd.com/documentation.html](https://slurm.schedmd.com/documentation.html)
*   **UCR Research Computing:** For questions specific to UCR users or for further assistance, please contact:
    *   Email: research-computing@ucr.edu
    *   UCR Research Computing Slack: [https://ucr-research-compute.slack.com/](https://ucr-research-compute.slack.com/)

We hope this guide has been helpful in getting you started with SDSC Comet. For more complex jobs and analyses, please consult the resources mentioned above and don't hesitate to reach out for support.