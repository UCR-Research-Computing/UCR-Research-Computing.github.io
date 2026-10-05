---
title: "Accessing an Ursa Major storage bucket"
topic: Storage
owner: Research Computing
reviewed: 2026-10-04
review_notes:
  - "Chuck 2026-10-04: bucket sharing is done by Research Computing on request; removed the self-service steps."
  - "Replaced the legacy gsutil commands with gcloud storage (Google now marks gsutil as legacy) and the object ACL sharing example with bucket IAM, which also works with uniform bucket-level access."
  - "Rewrote the console sharing steps: the old Viewer/Commenter/Editor 'Share' dialog and public/private upload options described Google Drive, not Cloud Storage. Added a warning against public access."
  - "Added tier context: Standard storage is Tier 2 recharge, archive classes are Tier 1; data movement out of Google Cloud can carry charges."
redirect_from:
  - /Knowledge_Base/Ursa_Major_Research_Storage_How_to_Access_Bucket.html
---

This guide shows how to upload, download and share files in a Google Cloud Storage bucket in your Ursa Major project, using the web console or the command line. To create a bucket first, see [Creating an Ursa Major storage bucket](../ursa-major-storage-create-bucket/).

**Costs:** Standard-class storage is Tier 2 and is recharged to a lab funding source under an MOU. Archive classes (such as Coldline) are Tier 1 under current terms, within limits. Downloading data out of Google Cloud, and reading data from archive classes, can carry charges. See [KB005: Ursa Major service tiers](../kb005-ursa-major-service-tiers/) and [Ursa Major cloud storage](../ursa-major-research-storage/).

**Sensitive data:** P3, P4 or regulated data needs a review before it is stored. See [Security and Data](../../security/).

## Web console

### Open the bucket

1. Go to the [Google Cloud console](https://console.cloud.google.com/) and select your project (for example `my-lab-project`).
2. Open the navigation menu and select **Cloud Storage**, then **Buckets**.
3. Click the bucket name (for example `my-lab-bucket`). The **Objects** tab lists its files and folders.

### Upload files

1. On the **Objects** tab, click **Upload**, then choose **Upload files** or **Upload folder**. You can also drag files onto the page.
2. Wait for the upload to finish. Progress shows at the bottom of the page.
3. Check that the files appear in the object list.

For large uploads (many files or many gigabytes), the command line is more reliable.

### Download files

1. On the **Objects** tab, click the file name.
2. Click **Download**. The file is saved to your computer.

### Share access

Cloud Storage shares access by granting a role to a person or group, not by sending a link. To give someone access to a bucket, including collaborators outside the project or outside UCR, send a request to [research-computing@ucr.edu](mailto:research-computing@ucr.edu) with the bucket name, the person's email address and whether they need read-only or read and write access. Research Computing grants the smallest role that does the job, and removes it when it is no longer needed. Buckets and objects are not made public.

## Command line (gcloud)

1. Install the [Google Cloud CLI](https://cloud.google.com/sdk/docs/install), or use [Cloud Shell](https://console.cloud.google.com/) in the console, which has it already.
2. Check the installation:

   ```bash
   gcloud version
   ```

3. Sign in and set your project:

   ```bash
   gcloud auth login
   gcloud config set project my-lab-project
   ```

4. List the buckets in the project, and the contents of one bucket:

   ```bash
   gcloud storage ls
   gcloud storage ls gs://my-lab-bucket
   ```

5. Upload a file, or a whole folder:

   ```bash
   gcloud storage cp myfile.txt gs://my-lab-bucket/
   gcloud storage cp --recursive my-folder gs://my-lab-bucket/
   ```

6. Download a file:

   ```bash
   gcloud storage cp gs://my-lab-bucket/myfile.txt ~/Downloads/
   ```


   Replace `my-lab-project`, `my-lab-bucket` and the email address with your own values.

## Other ways to connect

- To mount a bucket as a folder on Linux, see [Mounting Google Cloud Storage on Linux with rclone](../mount-google-cloud-storage/).
- Google's guide: [Discover object storage with the gcloud tool](https://cloud.google.com/storage/docs/discover-object-storage-gcloud).
- Questions: [research-computing@ucr.edu](mailto:research-computing@ucr.edu).
