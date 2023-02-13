## Steps to create a new GCP Cloud Bucket using the Web Console:

* Log in to the Google Cloud Console.

* From the navigation menu, select “Storage” and then “Browser”.

* Click on the “Create Bucket” button.

* Enter a unique name for your bucket and select the region you want to store your data in.

* Choose the storage class that best fits your needs.

* Set the access control options to determine who can access the bucket.

* Click on the “Create” button to create the bucket.

Steps to create a new GCP Cloud Bucket using gsutil:

* Install gsutil and configure your Google Cloud SDK.

* Open the command line and navigate to the folder where you want to store your Google Cloud SDK.

* Run the following command to create a new bucket:

```bash
gsutil mb gs://[BUCKET_NAME]
```
Replace `[BUCKET_NAME]` with the name you want to give to your new bucket.

Verify that the bucket has been created by running the following command:
```bash
gsutil ls
```
The list of your buckets will be displayed, including the new one you just created.
