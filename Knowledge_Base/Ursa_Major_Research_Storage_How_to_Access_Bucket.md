## Step by Step Instruction for Accessing Ursa Major Research Stroage:

### Web Console:
* Go to the [Google Cloud Console](https://console.cloud.google.com/).
* Select the project where your Ursa Major Research Storage is stored.
* Click on the "Storage" section from the left menu.
* Click on the bucket you want to access.
* You will be redirected to the bucket's details page. Here, you can upload, download, and share files.

Uploading Files to a Ursa Major Research Storage using the Web Console:
* From the bucket's details page, click on the "Upload Files" button.
* Select the files you want to upload or drag and drop them into the upload window.
* You can add a label to each file and specify the access control (Public or Private).
* Click on the "Start Upload" button.
* Wait for the upload process to complete.
* To verify the upload, go to the bucket's details page and check the list of files.

Downloading Files from a Ursa Major Research Storage using the Web Console:
* From the bucket's details page, click on the file you want to download.
* Click on the "Download" button.
* Wait for the download process to complete.
* The file will be saved to your device.

Sharing Files from a Ursa Major Research Storage using the Web Console:
* From the bucket's details page, click on the file you want to share.
* Click on the "Share" button.
* Specify the email addresses of the people you want to share the file with.
* Choose the permission level (Viewer, Commenter, or Editor).
* Click on the "Send" button.
* An email will be sent to the people you shared the file with, with a link to access it.

### Step by Step Instruction to access Ursa Major Research Storage using gsutil (Command line):

* Install the Google Cloud SDK on your computer. This will give you access to the gsutil command-line tool.

* Run the following command to verify that the Google Cloud SDK is installed correctly:

```bash
gcloud version
```

* Run the following command to log in to your Google Cloud Account:

```bash
gcloud auth login
```

* Once you are logged in, run the following command to list all the available Ursa Major Research Storages in your Google Cloud account:

```bash
gsutil ls
```

* To upload a file to a Ursa Major Research Storage, run the following command:

```bash
gsutil cp <file-path> gs://<bucket-name>
```

Example:

```bash
gsutil cp myfile.txt gs://mybucket
```
* To download a file from a Ursa Major Research Storage, run the following command:

```bash
gsutil cp gs://<bucket-name>/<file-name> <destination-path>
```

Example:

```bash
gsutil cp gs://mybucket/myfile.txt ~/Downloads
```

* To share a file in a Ursa Major Research Storage with others, you can grant them access using the following command:

```bash
gsutil acl ch -u <email-address>:<role> gs://<bucket-name>/<file-name>
```

Example:

```bash
gsutil acl ch -u friend@example.com:R gs://mybucket/myfile.txt
```

Here, we have granted 'read' access to the user friend@example.com for the file 'myfile.txt' in the bucket 'mybucket'.

Note: Replace the values in <> with the actual values that apply to your setup.
