#!/usr/bin/env python3
"""Check a built site (_site) for problems the source checks cannot see.

- internal links and assets that point at missing files (respecting baseurl)
- '[missing fact:' placeholders, raw Liquid ({{ or {%) leaking into HTML
- non-ASCII punctuation in visible text (house style: plain ASCII)
- search.json parses
- every page carries the noindex tag while preview mode is on

Usage: python3 tools/check_build.py <site_dir> [baseurl]
"""
import html, json, os, re, sys, urllib.parse

def main():
    site = sys.argv[1]
    import os as _os
    _cfg = open(_os.path.join(_os.path.dirname(__file__), "..", "_config.yml"), encoding="utf-8").read()
    PREVIEW = bool(re.search(r"^preview:\s*true", _cfg, re.M))
    base = sys.argv[2] if len(sys.argv) > 2 else "/rc-dev"
    problems = []
    pages = []
    for dp, _, fs in os.walk(site):
        for f in fs:
            if f.endswith(".html"):
                pages.append(os.path.join(dp, f))
    for p in pages:
        rel = os.path.relpath(p, site)
        s = open(p, encoding="utf-8", errors="replace").read()
        is_redirect = "http-equiv=\"refresh\"" in s and len(s) < 2000
        if rel.startswith("google") and len(s) < 200:
            continue  # search-console verification file
        if "[missing fact:" in s:
            problems.append((rel, "missing fact placeholder"))
        body = re.sub(r"<(script|style|pre|code)[^>]*>.*?</\1>", "", s, flags=re.S | re.I)
        if re.search(r"\{\{|\{%", body):
            m = re.search(r".{0,40}(\{\{|\{%).{0,40}", body)
            problems.append((rel, "raw Liquid in output: " + (m.group(0) if m else "")))
        if PREVIEW and not is_redirect and 'name="robots" content="noindex' not in s:
            problems.append((rel, "no noindex tag"))
        text = html.unescape(re.sub(r"<[^>]+>", " ", body))
        bad = sorted(set(c for c in text if ord(c) > 127 and c != "\u00a0"))
        if bad and not is_redirect:
            problems.append((rel, "non-ASCII text: " + " ".join("U+%04X" % ord(c) for c in bad[:8])))
        if is_redirect:
            continue
        for attr, url in re.findall(r'(href|src)="([^"]+)"', s):
            if url.startswith(("http:", "https:", "mailto:", "#", "data:", "tel:", "//")):
                continue
            u = urllib.parse.urlparse(url)
            path = urllib.parse.unquote(u.path)
            if not path:
                continue
            if path.startswith("/"):
                if not path.startswith(base + "/") and path != base:
                    problems.append((rel, "link outside baseurl: " + url))
                    continue
                path = path[len(base):]
                target = os.path.join(site, path.lstrip("/"))
            else:
                target = os.path.normpath(os.path.join(os.path.dirname(p), path))
            if os.path.isdir(target):
                target = os.path.join(target, "index.html")
            if not os.path.exists(target):
                problems.append((rel, "broken %s: %s" % (attr, url)))
    try:
        idx = json.load(open(os.path.join(site, "assets/js/search.json"), encoding="utf-8"))
        print("search index: %d entries" % len(idx))
    except Exception as e:
        problems.append(("assets/js/search.json", "does not parse: %s" % e))
    for rel, msg in problems:
        print("%s: %s" % (rel, msg))
    print("build check: %d page(s), %d problem(s)" % (len(pages), len(problems)))
    sys.exit(1 if problems else 0)

if __name__ == "__main__":
    main()
