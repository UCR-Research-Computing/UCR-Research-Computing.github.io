---
title: "How to Automate Data Deletion in AWS S3 with Lifecycle Policies"
topic: Storage
owner: Research Computing
reviewed: 2026-10-04
review_notes:
  - "Chuck 2026-10-04: CephRDS does not support auto-delete rules."
  - "Removed the duplicate H1 and marketing intro; updated the console steps to current S3 labels (rule scope, 'Expire current versions of objects', Create rule)."
  - "Added versioned-bucket handling, a CLI example, a warning that expiration is permanent, and links to AWS docs and the Cloud accounts service page."
redirect_from:
  - /Knowledge_Base/how-to-s3-auto-migrate-delete.html
---

An Amazon S3 lifecycle rule can delete objects automatically after a set number of days, or move them to a cheaper storage class. This helps you follow a data retention plan and avoid paying to store data you no longer need. This article covers the deletion (expiration) rule.

UCR researchers get AWS accounts through ITS under the University of California agreements; see [Cloud accounts](../../services/cloud-accounts/). This article is for Amazon S3. [CephRDS](../../services/cephrds/), the on-campus S3 storage, does not support automatic deletion (lifecycle) rules; delete data there yourself when your retention period ends.

**Expiration is permanent.** Once a rule deletes an object, it cannot be recovered unless you keep another copy. Check the rule's scope carefully, and check your data retention obligations (funder, journal, and UC records rules; see [Records retention](../../security/records-retention/)) before you set one.

## Step 1: Create a bucket (if you need one)

1. Sign in to the AWS Management Console and open the **S3** console.
2. Click **Create bucket**.
3. Enter a bucket name and choose the AWS Region.
4. Review the other settings, then click **Create bucket**.

## Step 2: Add a lifecycle rule

1. In the S3 console, open your bucket and select the **Management** tab.
2. Under **Lifecycle rules**, click **Create lifecycle rule**.
3. Enter a **Lifecycle rule name**.
4. Choose the **rule scope**:
   - **Limit the scope of this rule using one or more filters**, and enter a **prefix** (for example `scratch/`) to apply it to one folder; or
   - **Apply to all objects in the bucket**, and tick the acknowledgement.
5. Under **Lifecycle rule actions**, select **Expire current versions of objects**.
6. Enter the number of **Days after object creation** (for example, `90`).
7. Review the summary and click **Create rule**.

S3 runs lifecycle rules in the background. Objects are usually removed within a day or two of reaching the set age, not at an exact time.

### If versioning is turned on

In a versioned bucket, expiring the current version only adds a delete marker; the older versions remain and are still billed. To remove them too, also select **Permanently delete noncurrent versions of objects** and set the number of days.

## Command-line alternative

The same rule with the AWS CLI. Save this as `lifecycle.json` (replace the prefix and days as needed):

```json
{
  "Rules": [
    {
      "ID": "expire-scratch-after-90-days",
      "Filter": { "Prefix": "scratch/" },
      "Status": "Enabled",
      "Expiration": { "Days": 90 }
    }
  ]
}
```

Then apply it to your bucket:

```bash
aws s3api put-bucket-lifecycle-configuration --bucket my-lab-bucket --lifecycle-configuration file://lifecycle.json
```

This replaces any existing lifecycle configuration on the bucket. To see what is already set, run `aws s3api get-bucket-lifecycle-configuration --bucket my-lab-bucket` first.

## More information

- [Managing the lifecycle of objects (AWS)](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lifecycle-mgmt.html)
- [Setting a lifecycle configuration on a bucket (AWS)](https://docs.aws.amazon.com/AmazonS3/latest/userguide/how-to-set-lifecycle-configuration-intro.html)
- For Google Cloud Storage, see [Object Lifecycle Management](https://cloud.google.com/storage/docs/lifecycle) and [KB012: Using Ursa Major archive storage](../kb012-migrating-data-to-archive/).
