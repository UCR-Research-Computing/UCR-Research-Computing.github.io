#!/usr/bin/env python3
"""One-time migration of the prod Knowledge_Base into the _kb collection.

Mechanical only: front matter, header cleanup, emoji removal, link rewriting,
renumbering of duplicate KB IDs, redirect_from for the old URL. Wording fixes are
done by hand afterwards (see docs/SPEC.md section 6) and checked by tools/claims_check.py.
Re-running skips any _kb/ file whose front matter has a `reviewed:` date (hand-edited).
"""
import os, re, sys, datetime

SRC = os.path.expanduser(sys.argv[1] if len(sys.argv) > 1 else "~/Projects/UCR-Research-Computing.github.io")
DST = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "_kb")
KB = os.path.join(SRC, "Knowledge_Base")

# old file -> (new slug, kb_id or None, topic, renumbered_from or None)
MAP = {
    "KB001_Research_Data_Storage_Strategy.md": ("kb001-research-data-storage-strategy", "KB001", "Storage", None),
    "KB001_AI_Cloud_Access_Request.md": ("kb021-ursa-major-project-request", "KB021", "Cloud", "KB001 (AI/Cloud Access Request)"),
    "KB002_Project_Activation_Welcome.md": ("kb002-project-activation-welcome", "KB002", "Cloud", None),
    "KB003_Overleaf_Account_Error.md": ("kb003-overleaf-account-error", "KB003", "Software", None),
    "KB004_HPCC_Account_Creation.md": ("kb004-hpcc-account-creation", "KB004", "HPCC", None),
    "KB005_Ursa_Major_Service_Tiers.md": ("kb005-ursa-major-service-tiers", "KB005", "Cloud", None),
    "KB006_SOM_Clinical_Apps.md": ("kb006-som-clinical-apps", "KB006", "Security", None),
    "KB006_Migrating_Compute_to_HPCC.md": ("kb022-migrating-compute-to-hpcc", "KB022", "HPCC", "KB006 (Migrating Compute to HPCC)"),
    "KB007_Tier2_Recharge_Workflow.md": ("kb007-tier2-recharge-workflow", "KB007", "Cloud", None),
    "KB007_Migrating_Data_to_Archive.md": ("kb012-migrating-data-to-archive", "KB012", "Storage", "KB007 (Migrating Data to Archive)"),
    "KB008_Using_NAIRR_Pilot.md": ("kb008-using-nairr-pilot", "KB008", "National", None),
    "KB009_Using_NSF_ACCESS.md": ("kb009-using-nsf-access", "KB009", "National", None),
    "KB010_Resource_Catalog.md": ("kb010-resource-catalog", "KB010", "General", None),
    "KB011_Access_Identity.md": ("kb011-access-identity", "KB011", "General", None),
    "KB013_CephRDS_Onboarding.md": ("kb013-cephrds-onboarding", "KB013", "Storage", None),
    "KB014_Secure_Enclave_Guide.md": ("kb014-secure-enclave-guide", "KB014", "Security", None),
    "KB015_Secure_Enclave_Onboarding_Checklist.md": ("kb015-secure-enclave-onboarding-checklist", "KB015", "Security", None),
    "KB016_Secure_Enclave_Data_Ingress.md": ("kb016-secure-enclave-data-ingress", "KB016", "Security", None),
    "KB017_Overleaf_Troubleshooting.md": ("kb017-overleaf-troubleshooting", "KB017", "Software", None),
    "KB018_CephRDS_Python_boto3.md": ("kb018-cephrds-python-boto3", "KB018", "Storage", None),
    "KB019_CephRDS_GUI_Clients.md": ("kb019-cephrds-gui-clients", "KB019", "Storage", None),
    "KB020_CephRDS_Mounting_Folders.md": ("kb020-cephrds-mounting-folders", "KB020", "Storage", None),
    "What_is_HPC.md": ("what-is-hpc", None, "HPCC", None),
    "how_to_connect_to_hpc_cluster_run_sample_job.md": ("how-to-connect-to-hpc-cluster-run-sample-job", None, "HPCC", None),
    "Globus_Transfer.md": ("globus-transfer", None, "Storage", None),
    "blast.md": ("blast", None, "HPCC", None),
    "gnextnext5.md": ("nextflow-genomics", None, "HPCC", None),
    "submit-job-to-osg.md": ("submit-job-to-osg", None, "National", None),
    "ollama-how-to.md": ("ollama-how-to", None, "Cloud", None),
    "llm-inference-settings.md": ("llm-inference-settings", None, "Cloud", None),
    "how-to-distributed-pytorch-training-with-kubeflow-trainer.md": ("distributed-pytorch-kubeflow", None, "Cloud", None),
    "AlphaFold_Slurm_Filestore_Guide.md": ("alphafold-slurm-filestore", None, "Cloud", None),
    "UCR_Data_Security_Plans.md": ("ucr-data-security-plans", None, "Security", None),
    "Ursa_Major_Guideline.md": ("ursa-major-guidelines", None, "Cloud", None),
    "Ursa_Major_Research_Storage.md": ("ursa-major-research-storage", None, "Storage", None),
    "Ursa_Major_Research_Storage_How_to_Create_Bucket.md": ("ursa-major-storage-create-bucket", None, "Storage", None),
    "Ursa_Major_Research_Storage_How_to_Access_Bucket.md": ("ursa-major-storage-access-bucket", None, "Storage", None),
    "Ursa_Major_Research_Workstations.md": ("ursa-major-research-workstations", None, "Cloud", None),
    "Ursa_Major_Research_Workstations_How_to_Launch.md": ("ursa-major-workstation-launch", None, "Cloud", None),
    "Ursa_Major_Research_Workstations_How_to_Connect.md": ("ursa-major-workstation-connect", None, "Cloud", None),
    "Ursa_Major_HPC_Clusters.md": ("ursa-major-hpc-clusters", None, "Cloud", None),
    "How_To_Launch_a_Ursa_Major_Cluster.md": ("ursa-major-cluster-launch", None, "Cloud", None),
    "Ursa_Major_Project_Budget_Creation.md": ("ursa-major-project-budget", None, "Cloud", None),
    "Ursa_Major_Research_Services.md": ("ursa-major-research-services", None, "Cloud", None),
    "how_to_mount_google_cloud_storage.md": ("mount-google-cloud-storage", None, "Storage", None),
    "how_to_mount_google_drive.md": ("mount-google-drive", None, "Storage", None),
    "how-to-s3-auto-migrate-delete.md": ("s3-lifecycle-deletion", None, "Storage", None),
}
# extra old URLs that should land on a migrated article
EXTRA_REDIRECTS = {
    "nextflow-genomics": ["/Knowledge_Base/nextflow-genomics.html"],
    "ursa-major-cluster-launch": ["/Knowledge_Base/Launch_Custom_Ursa_Major_Cluster.html"],
    "ursa-major-research-services": ["/Knowledge_Base/Ursa_Major.html"],
}
# old page/file basenames (no ext) -> new site path, for link rewriting
PAGE_MAP = {
    "HPCC": "/services/hpcc/", "ursa_major": "/services/ursa-major/", "ceph_secure_research_storage": "/services/cephrds/",
    "hpcc_gpfs": "/services/hpcc-storage/", "ursa_major_data": "/services/cloud-archive/", "Google_Drive": "/services/google-drive/",
    "computing-resources-overview": "/compute/", "storage-overview": "/storage/", "cost_models": "/costs/", "faq": "/faq/",
    "research_security": "/services/secure-enclave/", "guidelines": "/security/", "nsf_access": "/services/nsf-access/",
    "Nautilus": "/services/nautilus/", "open_science_grid": "/services/osg/", "gcp_aws_edp": "/services/cloud-accounts/",
    "ai-ml": "/compute/cloud-and-ai/", "about": "/about/", "grant_colab": "/grants/",
    "ucr_research_records_retention_guide": "/security/records-retention/", "workshops_and_webinars": "/get-started/",
    "knowledge-base": "/kb/", "README": "/kb/",
}

EMOJI = re.compile("[\U0001F000-\U0001FFFF\u2600-\u27BF\u2B00-\u2BFF\uFE0F\u200D\u20E3]")
SMART = {"\u2018": "'", "\u2019": "'", "\u201c": '"', "\u201d": '"', "\u2013": "-", "\u2014": " - ", "\u2026": "...", "\u00a0": " "}

def slug_for_old(base):
    for k, v in MAP.items():
        if os.path.splitext(k)[0] == base:
            return v[0]
    return None

def rel_from_kb(path):
    # KB pages live at /kb/<slug>/, so the site root is ../../
    return "../.." + path

def rewrite_links(text):
    def fix(m):
        label, target = m.group(1), m.group(2)
        if re.match(r"^(https?:|mailto:|#)", target):
            return m.group(0)
        t = target.split("#")[0]
        anchor = target[len(t):]
        base = os.path.splitext(os.path.basename(t))[0]
        s = slug_for_old(base)
        if s:
            return "[%s](../%s/%s)" % (label, s, anchor)
        if base in PAGE_MAP:
            return "[%s](%s%s)" % (label, rel_from_kb(PAGE_MAP[base]), anchor)
        return m.group(0)
    return re.sub(r"\[([^\]]*)\]\(([^)\s]+)\)", fix, text)

def clean(text):
    meta = {}
    # leading YAML front matter
    m = re.match(r"^---\n(.*?)\n---\n", text, re.S)
    if m:
        for line in m.group(1).splitlines():
            if ":" in line:
                k, v = line.split(":", 1)
                meta.setdefault(k.strip(), v.strip().strip('"'))
        text = text[m.end():]
    lines = text.splitlines()
    out, title = [], meta.get("title")
    for i, line in enumerate(lines):
        s = line.strip()
        hm = re.match(r"^#{1,3}\s+(.*?)\s*#*$", s)
        if title is None and hm:
            title = hm.group(1)
            continue
        if title and hm and i < 12 and re.sub(r"\W", "", hm.group(1).lower()) == re.sub(r"\W", "", title.lower()):
            continue  # repeated title heading
        mm = re.match(r"^\*\*(Scope|Audience|Target Audience|Last Updated|Category|Service Tier):\*\*\s*(.*)$", s)
        if mm and i < 25:
            meta[mm.group(1)] = re.sub(r"\*", "", mm.group(2)).strip()
            continue
        if i < 25 and re.match(r"^(id|title|sidebar_label):", s):
            continue
        if "{% include ascii.html %}" in s or re.match(r"^\*Published by UCR Research Computing", s):
            continue
        out.append(line)
    body = "\n".join(out)
    body = re.sub(r"^(\s*---\s*\n)+", "", body.lstrip("\n"))
    body = re.sub(r"^(?:(?:layout|parent|nav_order|grand_parent|has_children|permalink): [^\n]*\n)+---\n", "", body)
    body = re.sub(r"(\n---\s*){2,}\n", "\n---\n", body)
    body = re.sub(r"\n+---\s*$", "\n", body.rstrip()) + "\n"
    for a, b in SMART.items():
        body = body.replace(a, b)
        title = (title or "").replace(a, b)
    body = EMOJI.sub("", body)
    # normalise heading spacing outside fenced code only
    parts = re.split(r"(^```.*?^```)", body, flags=re.M | re.S)
    body = "".join(p if p.startswith("```") else re.sub(r"^(#+)\s+", r"\1 ", p, flags=re.M) for p in parts)
    title = EMOJI.sub("", title or "").strip()
    title = re.sub(r"^KB\s?0\d\d\s*[:\-]\s*", "", title).strip()
    return title, meta, body

def yq(s):
    return '"' + str(s).replace("\\", "\\\\").replace('"', '\\"') + '"'

def parse_date(s):
    if not s:
        return None
    s = re.sub(r"\(.*?\)", "", s).strip()
    for fmt in ("%B %d, %Y", "%b %d, %Y", "%Y-%m-%d"):
        try:
            return datetime.datetime.strptime(s, fmt).date().isoformat()
        except ValueError:
            pass
    return None

def main():
    os.makedirs(DST, exist_ok=True)
    n = 0
    for old, (slug, kb_id, topic, renum) in MAP.items():
        dst = os.path.join(DST, slug + ".md")
        if os.path.exists(dst) and "reviewed:" in open(dst, encoding="utf-8").read(2000):
            print("keep (hand-reviewed):", slug)
            continue
        p = os.path.join(KB, old)
        if not os.path.exists(p) or os.path.getsize(p) == 0:
            print("skip (missing/empty):", old)
            continue
        title, meta, body = clean(open(p, encoding="utf-8").read())
        body = rewrite_links(body)
        if "{{" in body or "{%" in body:
            body = "{% raw %}\n" + body + "{% endraw %}\n"
        oldurl = "/Knowledge_Base/" + os.path.splitext(old)[0] + ".html"
        redirs = [oldurl] + EXTRA_REDIRECTS.get(slug, [])
        fm = ["---", "title: " + yq(title or slug)]
        if kb_id:
            fm.append("kb_id: " + kb_id)
        fm.append("topic: " + topic)
        aud = meta.get("Audience") or meta.get("Target Audience")
        if aud and "BearHelp" not in aud:
            fm.append("audience: " + yq(aud))
        upd = parse_date(meta.get("Last Updated"))
        if upd:
            fm.append("updated: " + upd)
        if renum:
            fm.append("renumbered_from: " + yq(renum))
        fm.append("owner: Research Computing")
        fm.append("redirect_from:")
        fm += ["  - " + r for r in redirs]
        fm.append("---")
        open(os.path.join(DST, slug + ".md"), "w", encoding="utf-8").write("\n".join(fm) + "\n\n" + body)
        n += 1
    print("wrote", n, "articles")

if __name__ == "__main__":
    main()
