# Transferring Data from UCR HPCC to External Centers using Globus Personal Connect

## Introduction

This article explains how to transfer data from the University of California, Riverside (UCR) High-Performance Computing Center (HPCC) cluster, also known as Ursa Major, to external national labs or supercomputing centers like TACC (Texas Advanced Computing Center) or SDSC (San Diego Supercomputer Center) using Globus Personal Connect. Globus Personal Connect is a tool that allows you to create a Globus endpoint on your own computer or, in this case, on the HPCC cluster, enabling secure and efficient high-speed data transfers. This method is particularly useful for transferring large datasets between different institutions.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Setting up Globus Personal Connect on HPCC](#setting-up-globus-personal-connect-on-hpcc)
    - [Step 1: Accessing HPCC](#step-1-accessing-hpcc)
    - [Step 2: Downloading Globus Personal Connect](#step-2-downloading-globus-personal-connect)
    - [Step 3: Installing and Configuring Globus Personal Connect](#step-3-installing-and-configuring-globus-personal-connect)
    - [Step 4: Starting the Globus Personal Connect Endpoint](#step-4-starting-the-globus-personal-connect-endpoint)
3. [Transferring Data using Globus](#transferring-data-using-globus)
    - [Step 1: Identifying or Setting up the Destination Endpoint](#step-1-identifying-or-setting-up-the-destination-endpoint)
    - [Step 2: Initiating the Data Transfer](#step-2-initiating-the-data-transfer)
    - [Step 3: Monitoring the Transfer](#step-3-monitoring-the-transfer)
4. [Best Practices and Considerations](#best-practices-and-considerations)
5. [Troubleshooting](#troubleshooting)
6. [Conclusion and Additional Resources](#conclusion-and-additional-resources)

## 1. Prerequisites <a name="prerequisites"></a>

Before you begin, ensure you have the following:

*   **HPCC Account:** You need an active account on the UCR HPCC cluster. If you don't have one, request an account by emailing support@hpcc.ucr.edu.
*   **Globus Account:** You need a Globus account. You can sign up for free at [globus.org](https://www.globus.org/).
*   **Globus Personal Connect Software:** You will need to download and install Globus Personal Connect on the HPCC cluster (or potentially on a local machine as an intermediary, though direct transfer from HPCC is more efficient).
*   **Endpoint at Destination Center:** You need to know the Globus endpoint details for the destination supercomputing center (TACC, SDSC, or other).  Often, these centers have designated Globus endpoints for data transfer. Check the documentation of the destination center or contact their support to find their Globus endpoint.
*   **Web Console Access to HPCC (Recommended):** While SSH access is possible, using the web console SSH for HPCC is often preferred for initial setup and management.

## 2. Setting up Globus Personal Connect on HPCC <a name="setting-up-globus-personal-connect-on-hpcc"></a>

These steps outline how to set up Globus Personal Connect directly on the HPCC cluster.

### Step 1: Accessing HPCC <a name="step-1-accessing-hpcc"></a>

Access the HPCC cluster using your preferred method. The recommended way is through the web console SSH:

1.  Open your web browser and go to the HPCC web console (if available, otherwise use a standard SSH client).
2.  Log in using your HPCC username and password. You will be directed to one of the head nodes (Jay or Lark).

### Step 2: Downloading Globus Personal Connect <a name="step-2-downloading-globus-personal-connect"></a>

1.  **Navigate to your home directory** on the HPCC head node.
2.  **Download Globus Personal Connect.**  Visit the Globus Personal Connect download page ([https://www.globus.org/personal-connect](https://www.globus.org/personal-connect)) and get the Linux 64-bit version download link.  Use `wget` or `curl` on the HPCC head node to download the software. For example:

    ```bash
    wget [PASTE_DOWNLOAD_LINK_HERE]
    ```
    *(Note: Replace `[PASTE_DOWNLOAD_LINK_HERE]` with the actual download link from the Globus website.  The link is dynamic and you should get the latest one from the Globus site.)*

### Step 3: Installing and Configuring Globus Personal Connect <a name="step-3-installing-and-configuring-globus-personal-connect"></a>

1.  **Extract the downloaded archive.**  Typically, the downloaded file will be a `.tar.gz` file. Extract it using `tar`:

    ```bash
    tar -xzf globusconnectpersonal-latest.tgz
    ```
    This will create a directory named `globusconnectpersonal-latest`.

2.  **Navigate into the extracted directory:**

    ```bash
    cd globusconnectpersonal-latest
    ```

3.  **Run the setup script:**

    ```bash
    ./globusconnectpersonal -setup
    ```

4.  **Follow the prompts.** The setup script will guide you through the configuration process. You will be asked to:
    *   **Log in with your Globus account** using a web browser that will open automatically on your local machine (if you are using web console with browser forwarding) or provide a URL and code to authenticate manually if browser forwarding is not available or desired.
    *   **Choose an endpoint display name.** This is the name that will identify your HPCC Personal Connect endpoint in Globus. Choose a descriptive name, for example, `UCR HPCC Personal Connect - [Your Username]`.
    *   **Select a directory for your endpoint to share.** By default, it will likely suggest your home directory. You can choose to share your entire home directory or a specific subdirectory where your data is located (e.g., `/rhome/[your username]/bigdata`). Be mindful of the data you are sharing and security policies.

### Step 4: Starting the Globus Personal Connect Endpoint <a name="step-4-starting-the-globus-personal-connect-endpoint"></a>

1.  **Start Globus Personal Connect:**

    ```bash
    ./globusconnectpersonal &
    ```
    The `&` symbol runs the process in the background.

2.  **Verify the endpoint is running.** Check the output for any errors.  You can also check if the process is running using `ps -ef | grep globusconnectpersonal`.

3.  **Keep the endpoint running.**  For data transfers to continue, the `globusconnectpersonal` process must remain running. If you close your SSH session or the process is killed, the endpoint will become unavailable.  Consider using `nohup` or `screen`/`tmux` to keep the process running even if you disconnect from the SSH session. For example:

    ```bash
    nohup ./globusconnectpersonal &
    ```
    or start a `screen` or `tmux` session, run `./globusconnectpersonal`, and detach from the session.

## 3. Transferring Data using Globus <a name="transferring-data-using-globus"></a>

Once your Globus Personal Connect endpoint is set up and running on HPCC, you can use the Globus web interface or command-line interface (CLI) to transfer data.

### Step 1: Identifying or Setting up the Destination Endpoint <a name="step-1-identifying-or-setting-up-the-destination-endpoint"></a>

*   **Search for Institutional Endpoints:** In the Globus web interface ([app.globus.org](https://app.globus.org)), go to "Transfer Files" and in the "Endpoint" field, search for the name of the destination center (e.g., "TACC" or "SDSC").  Many supercomputing centers have official Globus endpoints.
*   **Destination Personal Connect:** If the destination center instructs you to use a Personal Connect endpoint, they should provide you with the endpoint name or instructions on how to connect.
*   **Contact Destination Support:** If you cannot find the endpoint or are unsure, contact the support team of the destination supercomputing center for their Globus endpoint details and instructions.

### Step 2: Initiating the Data Transfer <a name="step-2-initiating-the-data-transfer"></a>

1.  **Open the Globus Web Interface:** Go to [app.globus.org](https://app.globus.org) and log in with your Globus account.
2.  **Select Endpoints:**
    *   In the "Endpoint" field on the left panel, search for and select your HPCC Personal Connect endpoint (the name you gave it during setup). Activate the endpoint if prompted.
    *   In the "Endpoint" field on the right panel, search for and select the destination endpoint (e.g., the TACC or SDSC endpoint). Activate it as well.
3.  **Navigate Directories:** Use the directory panels to navigate to the source directory on your HPCC endpoint and the destination directory on the remote endpoint.
4.  **Select Data to Transfer:** Select the files and folders you want to transfer by clicking the checkboxes.
5.  **Start Transfer:** Click the "Start" button (the blue arrow pointing to the right to transfer to the right endpoint, or the left arrow to transfer to your HPCC endpoint).
6.  **Transfer Settings (Optional):** Before starting, you can configure transfer settings like verifying file integrity, encrypting data in transit (which is default for Globus), and scheduling transfers. These options are available in the Globus web interface.

### Step 3: Monitoring the Transfer <a name="step-3-monitoring-the-transfer"></a>

1.  **View Transfer Status:**  In the Globus web interface, go to the "Activity" tab to monitor the progress of your transfer. You can see details like transfer speed, files transferred, and estimated time remaining.
2.  **Notifications:** Globus can send email notifications upon transfer completion or failure. Ensure your Globus account notification settings are configured as desired.

## 4. Best Practices and Considerations <a name="best-practices-and-considerations"></a>

*   **Network Speed:** Data transfer speeds are limited by the network bandwidth between UCR HPCC and the destination center, as well as network congestion. Globus optimizes transfers, but physical limitations apply.
*   **Large Datasets:** Globus is designed for large datasets and is generally efficient. For extremely large transfers, consider initiating the transfer from a worker node within HPCC if you anticipate network bottlenecks from the head node, but for most cases, head node initiation is sufficient for control.
*   **Data Organization:** Organize your data logically before transferring to make management easier at both ends.
*   **Security:** Globus uses secure protocols for data transfer. Ensure you are using strong passwords for your accounts and follow security best practices. Be mindful of the data you are sharing through your Personal Connect endpoint and configure shared directories appropriately.
*   **Storage Quotas:** Be aware of storage quotas on both HPCC and the destination center to avoid transfer failures due to insufficient space.
*   **Endpoint Availability:** Ensure your Globus Personal Connect endpoint on HPCC remains running throughout the transfer process. Use `nohup` or `screen`/`tmux` for long transfers.
*   **Destination Endpoint Policies:** Be aware of any usage policies or restrictions on the destination endpoint. Some institutional endpoints may have specific access controls or usage guidelines.

## 5. Troubleshooting <a name="troubleshooting"></a>

*   **Endpoint Not Active:** If your Globus Personal Connect endpoint shows as inactive, check if the `globusconnectpersonal` process is still running on HPCC. Restart it if necessary.
*   **Firewall Issues:** In rare cases, firewalls might interfere with Globus transfers.  HPCC's network is configured to support Globus, but if you encounter issues, contact support@hpcc.ucr.edu or the destination center's support to check for any firewall restrictions.
*   **Permission Errors:** Ensure you have appropriate read permissions on the source files on HPCC and write permissions on the destination directory at the remote center.
*   **Slow Transfers:** Network speeds can vary. If transfers are slower than expected, check network status and consider transferring during off-peak hours. For very large datasets, consider data compression before transfer if applicable and efficient for your data type.
*   **Endpoint Configuration Issues:** If you encounter issues during Personal Connect setup, review the Globus Personal Connect documentation or contact research-computing@ucr.edu for assistance.

## 6. Conclusion and Additional Resources <a name="conclusion-and-additional-resources"></a>

Globus Personal Connect provides a robust and efficient way to transfer data from UCR HPCC to external supercomputing centers. By following these steps, you can set up your endpoint on HPCC and manage your data transfers effectively.

**Additional Resources:**

*   **Globus Documentation:** [https://docs.globus.org/](https://docs.globus.org/)
*   **UCR Research Computing Support:** research-computing@ucr.edu
*   **UCR Research Computing Slack:** [https://ucr-research-compute.slack.com/](https://ucr-research-compute.slack.com/) (Contact research-computing@ucr.edu for Slack invite if needed).
*   **HPCC Cluster Documentation:** (Refer to the document you were provided which contains detailed information about HPCC).

For further assistance or questions, please do not hesitate to contact UCR Research Computing at research-computing@ucr.edu or join us on Slack. We are here to help you make the most of the HPCC resources.