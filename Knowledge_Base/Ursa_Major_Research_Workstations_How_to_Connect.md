## Connecting to a Ursa Major Research Workstation using the Web Console:

* Open the Google Cloud Platform Console and select your project.
* In the navigation menu, click on the "Compute Engine" option.
* In the "Compute Engine" section, click on the "VM instances" option.
* Find the instance that you want to connect to and click on the instance name to view its details.
* In the "Connect" section, click on the "SSH" button. This will open the "Connect to instance" dialog box.
* In the "Connect to instance" dialog box, choose the "Web-based SSH" option and then click the "Connect" button.
* This will launch a new tab in your web browser and connect you to the instance.

### To use RDP to access Ursa Major Research Workstation, follow these steps:

* Ensure that the virtual machine is set up to allow RDP connections. This will typically involve opening a port on the firewall for RDP traffic and configuring the virtual machine to listen for RDP connections.

* On the local machine, install a RDP client. This can be the built-in RDP client on Windows, or a third-party client such as Remmina.

* Open the RDP client and enter the IP address or hostname of the virtual machine. The user will also need to enter their credentials, such as their username and password, to authenticate to the remote machine.

* If the RDP connection is successful, the user will be able to access the desktop environment of the virtual machine and use it as if they were physically sitting in front of it.

It is important to note that the user's RDP session will only be active while they have an active RDP connection. If they close the connection, they will no longer be able to access the virtual machine. Additionally, the performance of the RDP connection will be dependent on the network connectivity between the local machine and the virtual machine.

### Connecting to a Ursa Major Research Workstation using the gcloud command line:

* Open the command line terminal.
* Make sure you have the gcloud CLI installed and configured for your Google Cloud Platform project.
* Run the following command to connect to your instance:
```bash
gcloud compute ssh [INSTANCE_NAME] --zone [ZONE_NAME]
```
*  Replace `[INSTANCE_NAME]` with the name of your instance and `[ZONE_NAME]` with the zone the instance is in.
* You will be prompted to authenticate to your Google account if you haven't already.
* Once authentication is complete, you will be connected to the instance.

Note: If you have a firewall rule in place, you may need to configure it to allow access to your instance before you can connect.
