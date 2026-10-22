# UCR Research Computing website

Source for [ucr-research-computing.github.io](https://ucr-research-computing.github.io/). Staging copy: [rc-dev](https://ucr-research-computing.github.io/rc-dev/) (`noindex`, PREVIEW tag); changes ship here and are copied there.

- **Spec:** [docs/SPEC.md](docs/SPEC.md) explains how the site works, the wording rules, and how to add or change things.

## Quick start

```bash
bundle install
bundle exec jekyll serve      # http://127.0.0.1:4000/
python3 tools/claims_check.py # wording check
```

## Rules in one breath

Every figure lives in `_data/facts.yml` with its source and date. Pages show figures with `{% raw %}{% include fact.html id="..." %}{% endraw %}`, never typed by hand. Wording describes process, not outcomes. No guarantees, no "free", no response times. CI blocks those words. Costs, security and policy pages need Chuck's review (CODEOWNERS).

## Public files and boundaries

Every file in `assets/documents/` must be linked from a current page or listed as an unlisted handout in SPEC 6.2. Nothing on the site may read as competing with the HPCC, set ITS or ISO policy, or gate faculty use of external platforms. SPEC 4.6 lists the rules from the 2026-10-22 wording review.
