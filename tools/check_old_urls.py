#!/usr/bin/env python3
"""List old prod URLs (from a sitemap dump) that no page on this site redirects from.

Usage: python3 tools/check_old_urls.py old_urls.txt
Each line of old_urls.txt is a site-relative path such as /pages/HPCC.html.
Exit 1 if any path is not covered by a redirect_from entry, a permalink, or a stub.
"""
import glob, os, re, sys, urllib.parse

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

def covered_paths():
    out = set()
    pats = ["*.md", "*.html", "_services/*.md", "_kb/*.md", "_redirects/*.md", "_redirects/*.html"]
    for pat in pats:
        for f in glob.glob(os.path.join(ROOT, pat)):
            text = open(f, encoding="utf-8").read()
            fm = re.match(r"^---\n(.*?)\n---", text, re.S)
            if not fm:
                continue
            block = fm.group(1)
            out.update(m.strip('"') for m in re.findall(r"^\s+-\s+(/\S+)\s*$", block, re.M))
            pm = re.search(r"^permalink:\s*(.+?)\s*$", block, re.M)
            if pm:
                out.add(pm.group(1).strip('"'))
    return out

def main():
    src = sys.argv[1]
    wanted = []
    for line in open(src, encoding="utf-8"):
        p = urllib.parse.unquote(line.strip())
        if p and p not in wanted:
            wanted.append(p)
    have = covered_paths()
    # files copied through unchanged count as covered
    for p in list(wanted):
        if os.path.exists(os.path.join(ROOT, p.lstrip("/"))):
            have.add(p)
    left = [p for p in wanted if p not in have]
    print("old URLs: %d, covered: %d, not covered: %d" % (len(wanted), len(wanted) - len(left), len(left)))
    for p in left:
        print("  " + p)
    sys.exit(1 if left else 0)

if __name__ == "__main__":
    main()
