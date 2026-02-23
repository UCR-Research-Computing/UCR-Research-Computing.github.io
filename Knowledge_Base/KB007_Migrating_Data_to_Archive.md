# KB007: Using Ursa Major Archive (Coldline Strategy)

**Scope:** Long-Term Data Retention
**Audience:** Researchers needing compliance archiving or migrating "Zombie" storage.
**Last Updated:** Feb 9, 2026

---

## 1. Overview
The **Ursa Major Archive Tier** utilizes Google Cloud **Coldline Storage**. It is designed for data that you need to keep (for grant compliance, reproducibility, or backup) but do not access frequently.

**Key Rule:** Accessing (reading) Coldline data incurs a **Retrieval Fee**. Do not use this for active analysis data. Use it for data you access less than once per quarter.

---

## 2. Cost Advantage
*   **Standard Storage:** ~$0.020 per GB/month ($20/TB).
*   **Coldline Archive:** ~$0.004 per GB/month ($4/TB).
*   **Savings:** Moving 10 TB from Standard to Coldline saves **~$160/month** ($1,920/year).

---

## 3. How to Archive Data

### Method A: Converting an Existing Bucket (The "In-Place" Archive)
If you have a Standard bucket (`gs://my-lab-data`) and want to convert it to Archive:

1.  **Go to GCP Console:** Storage Browser.
2.  **Select Bucket:** Click the bucket name.
3.  **Configuration:** Go to the "Configuration" tab.
4.  **Edit Storage Class:** Change Default Storage Class to **Coldline**.
    *   *Note:* This applies to *new* objects. To change *existing* objects, use a Lifecycle Rule (Method B).

### Method B: Lifecycle Rule (Automatic Transition)
Best for moving data that hasn't been touched in 30 days.

**CLI Command:**
Create a JSON file `lifecycle.json`:
```json
{
  "rule": [
    {
      "action": {
        "type": "SetStorageClass",
        "storageClass": "COLDLINE"
      },
      "condition": {
        "age": 30,
        "matchesStorageClass": ["STANDARD"]
      }
    }
  ]
}
```

**Apply it:**
```bash
gsutil lifecycle set lifecycle.json gs://my-bucket-name
```

### Method C: Direct Upload to Archive
When uploading new backups, tag them immediately.

```bash
# Upload folder
gsutil -m cp -r -c COLDLINE ./my_local_data/ gs://my-archive-bucket/
```

---

## 4. Recovering from "Administrative Lock" (Zombie Storage)
If your project was Locked/Suspended due to orphaned disks:

1.  **Snapshot:** We will create a snapshot of your disk.
2.  **Export:** We (or you) can export that snapshot to a Coldline Bucket.
3.  **Delete Disk:** The expensive compute disk is deleted.
4.  **Result:** You pay for cheap Archive storage ($4/TB) instead of expensive Provisioned Disk ($100/TB).

**To Request Recovery:**
File a ticket with Research Computing requesting "Snapshot Export to Coldline" for your locked project.