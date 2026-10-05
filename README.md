# UCR Research Computing website (dev rebuild)

A full rebuild of [ucr-research-computing.github.io](https://ucr-research-computing.github.io/), built as a separate site so the live site is untouched until we switch.

- **Preview:** https://ucr-research-computing.github.io/rc-dev/
- **Status:** preview. Pages carry `noindex`, so search engines skip them, and the header has a small PREVIEW tag.
- **Spec:** [docs/SPEC.md](docs/SPEC.md) explains how the site works, the wording rules, and how to add or change things.

## Quick start

```bash
bundle install
bundle exec jekyll serve      # http://127.0.0.1:4000/rc-dev/
python3 tools/claims_check.py # wording check
```

## Rules in one breath

Every figure lives in `_data/facts.yml` with its source and date. Pages show figures with `{% raw %}{% include fact.html id="..." %}{% endraw %}`, never typed by hand. Wording describes process, not outcomes. No guarantees, no "free", no response times. CI blocks those words. Costs, security and policy pages need Chuck's review (CODEOWNERS).
