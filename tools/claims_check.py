#!/usr/bin/env python3
"""Claims check: blocks wording a reader could hold us to.

Scans site content (pages, _services, _kb, _includes, _layouts, index.html) and fails
on any match below that is not allowed in tools/claims_allow.txt. Figures belong in
_data/facts.yml (not scanned); prose must render them with {% include fact.html %}.

Allow-list format (one per line): <path glob> | <exact substring of the matched line>
Every allow entry should have a reason in a trailing '# ...' comment.

Usage: python3 tools/claims_check.py [--list]
"""
import fnmatch, glob, os, re, sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
SCAN = ["*.md", "*.html", "_services/*.md", "_kb/*.md", "_includes/*.html", "_layouts/*.html", "_data/services.yml", "_data/terms.yml"]

RULES = [
    ("promise", r"\bguarantee[ds]?\b|\bguaranteeing\b"),
    ("promise", r"\bunlimited\b|\bvirtually unlimited\b|\bno limits?\b"),
    ("promise", r"\b(fully )?subsidi[sz]ed\b|\bsubsidy\b"),
    ("promise", r"\bzero[- ]cost\b|\bno[- ]cost\b|\bfree of charge\b|\bat no charge\b|\bcost-free\b"),
    ("promise", r"\bfor free\b|\bis free\b|\bare free\b|\bfree (access|time|storage|compute|for)\b"),
    ("promise", r"\bcertified\b|\bcertifies\b|\bfully compliant\b|\bHIPAA[- ]compliant\b"),
    ("promise", r"\b(we|will|to) ensure\b|\bensures (your|that your|compliance)\b|\bensuring (your|compliance)\b"),
    ("promise", r"\bwill (provide|deliver|be provided)\b|\bwe provide\b"),
    ("service-level", r"\bwithin \d+\s*(minutes?|hours?|business days?|days?)\b|\b\d+(\.\d+)?\s*%\s*(uptime|availability)\b|\b24/7\b|\bSLA\b|\bservice level agreement\b"),
    ("vague-limit", r"\breasonable limits?\b|\bwithin reason\b"),
    ("internal", r"\bPolaris\b|\bPSSA\b|\bBearHelp\b|ucr-ursa-major-|\bNexus\b|forsythc@"),
    ("hand-typed-figure", r"\$\s?\d"),
]

def load_allow():
    p = os.path.join(ROOT, "tools", "claims_allow.txt")
    out = []
    if os.path.exists(p):
        for line in open(p, encoding="utf-8"):
            line = line.split("  #")[0].rstrip("\n")
            if not line.strip() or line.lstrip().startswith("#") or "|" not in line:
                continue
            g, s = line.split("|", 1)
            out.append((g.strip(), s.strip()))
    return out

def files():
    seen = set()
    for pat in SCAN:
        for f in glob.glob(os.path.join(ROOT, pat)):
            rel = os.path.relpath(f, ROOT)
            if rel.startswith(("_site", "vendor", "docs", "tools")) or rel in seen or rel == "README.md":
                continue
            seen.add(rel)
            yield rel

def main():
    allow = load_allow()
    used = set()
    hits = []
    for rel in sorted(files()):
        in_code = False
        for n, line in enumerate(open(os.path.join(ROOT, rel), encoding="utf-8"), 1):
            if line.lstrip().startswith("```"):
                in_code = not in_code
                continue
            if in_code:
                continue
            for kind, rx in RULES:
                for m in re.finditer(rx, line, re.I):
                    ok = False
                    for i, (g, s) in enumerate(allow):
                        if fnmatch.fnmatch(rel, g) and s in line:
                            ok = True
                            used.add(i)
                            break
                    if not ok:
                        hits.append((rel, n, kind, m.group(0), line.strip()[:160]))
    for rel, n, kind, word, text in hits:
        print("%s:%d [%s] '%s'  %s" % (rel, n, kind, word, text))
    stale = [allow[i] for i in range(len(allow)) if i not in used]
    for g, s in stale:
        print("note: unused allow entry: %s | %s" % (g, s))
    print("claims check: %d finding(s)" % len(hits))
    sys.exit(1 if hits else 0)

if __name__ == "__main__":
    main()
