## How to Launch a Ursa Major Research Workstation with and without GPUs

* Go to the Google Cloud Console: To start, go to the Google Cloud Console, which is the web-based portal for managing your Google Cloud resources. You will need a Google account to access the console.

* On the “Select a Project” drop-down in the top navigation bar select the project you want to launch in. 

* Navigate to Compute Engine: From the console home page, click on the hamburger menu in the top left corner and select “Compute Engine” from the list of services.

* Launch a New Instance: To launch a new instance, click the “Create an instance” button on the Compute Engine dashboard.

* Choose a Name and Zone: Give your instance a name and choose the zone in which you want it to be deployed.

* Select a Machine Type: The next step is to choose a machine type. If you want to launch a VM with GPUs, select a machine type that includes one or more GPUs. If you do not need GPUs, select a machine type without them.

* Choose a Boot Disk: You can choose the boot disk for your instance by clicking on the “Change” button under “Boot disk.”

* Select an Operating System: You can choose from a variety of operating systems, including Windows and Linux. Some popular Linux distributions include Ubuntu, Debian, and CentOS.

* Configure Additional Disk Space: If you need additional disk space for your instance, you can add one or more persistent disks by clicking on the “Add New” button under “Disks.”

* Configure Networking: You can configure the network settings for your instance, such as firewall rules and network tags, by clicking on the “Edit” button under “Networking.”

* Launch the Instance: When you have finished configuring your instance, click the “Create” button to launch it.

* Connect to the Instance: Once the instance is launched, you can connect to it by clicking on the “SSH” button in the Compute Engine dashboard.

## Using gcloud to Launch a Ursa Major Research Workstation:

Open a terminal or command line window.

* Type in the following command to log in to your Google Cloud account:
```bash
gcloud auth login
```
* Type in the following command to set the project you want to launch the instance in:
```bash
gcloud config set project [PROJECT_ID]
```
* Type in the following command to launch the instance:
```bash
gcloud compute instances create [INSTANCE_NAME] --zone [ZONE] --machine-type [CPU_MEMORY] --image-family [OS] --image-project [OS_PROJECT]
```
* (Optional) If you want to use a GPU, add the following flag to the command:
```bash
--accelerator type=[GPU_TYPE],count=[GPU_COUNT]
```
* (Optional) If you want to add storage to your instance, add the following flag to the command:
```bash
--boot-disk-size=[STORAGE_SIZE] --boot-disk-type=[STORAGE_TYPE]
```
* Wait for the instance to launch, which should take a few minutes.

#### Pointers:

* When choosing the number of vCPUs and amount of memory for your instance, consider the workload you will be running on the instance. If you need more power, choose a larger instance size. If you don’t need as much power, choose a smaller instance size.

* If you are using a GPU, consider the type of GPU you need based on your workload.

* When choosing the operating system, consider the type of applications and services you will be running on the instance.

* When choosing the storage options, consider the amount of data you will be storing and the performance requirements for your instance.

* Make sure to choose a zone that is closest to your users or customers to ensure fast and low-latency access to your instance
