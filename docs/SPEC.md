# UCR Research Computing website: specification

Repo: `UCR-Research-Computing/rc-dev` (preview at https://ucr-research-computing.github.io/rc-dev/).
Replaces: `UCR-Research-Computing/UCR-Research-Computing.github.io` (live site) when Chuck approves the switch.
Written: 2026-10-04. Keep this file current: update the how-to, history or open-items section in the same PR as any change in behaviour.

## 1. Purpose and audience

The site is for UCR researchers: faculty, postdocs, students and lab staff. It answers their questions in their order: what do I need, what can I use, what does it cost, what are the rules, how do I start, who do I ask. Mike's direction: researcher-focused and intuitive. Chuck's direction: accurate, and worded so that nothing on it can be read as a promise of a resource, price, capacity or response time (section 4).

The site is a guide, not a contract. The documents that govern each service (rate sheets, MOUs, policies) are linked from every page and are the authority.

## 2. Architecture

- **Jekyll 3.10 via the `github-pages` gem**, built by GitHub Pages from `main` at `/`. No custom build step and no plugins outside the Pages allow-list.
- **Plugins:** `jekyll-seo-tag`, `jekyll-sitemap`, `jekyll-redirect-from`.
- **Base URL:** `/rc-dev` while in preview. Every internal link uses `relative_url`, so changing `baseurl` is the only edit needed at the switch.
- **No frameworks.** One stylesheet (`assets/css/rc.css`), one script (`assets/js/rc.js`), Fira Sans and Font Awesome from public CDNs. No tracking.

### Layout of the repo

| Path | What it is |
| --- | --- |
| `index.html` | Home: hero search, "I want to..." tasks, resource catalog, "Know before you start", steps, popular guides |
| `compute.md`, `cloud-and-ai.md`, `storage.md`, `security.md`, `costs.md`, `help.md`, `get-started.md`, `grants.md`, `faq.md`, `about.md`, `terms.md`, `records-retention.md`, `kb.md`, `404.md` | Hub and topic pages (layout `page`) |
| `_services/*.md` | One page per service (layout `service`), URL `/services/<name>/` |
| `_kb/*.md` | Knowledge base articles (layout `kb`), URL `/kb/<slug>/` |
| `_redirects/*.md` | Stubs that send old URLs of content not carried over to its closest new home |
| `_data/facts.yml` | Every figure on the site, with source, date and owner (section 4.1) |
| `_data/services.yml` | The service catalog: drives the home catalog, filters and hub grids |
| `_data/nav.yml` | Main navigation |
| `_data/terms.yml` | The site terms notice (footer and `/terms/`) |
| `_layouts/` | `default` (shell), `page`, `service`, `kb` |
| `_includes/` | `header`, `footer`, `search`, `fact`, `provenance`, `service-card` |
| `assets/js/search.json` | Search index built by Liquid at build time |
| `tools/` | `claims_check.py`, `check_old_urls.py`, `check_build.py`, `migrate_kb.py`, `claims_allow.txt`, `data/prod_sitemap_2026-10-04.txt` |
| `.github/workflows/check.yml` | CI: claims check, old-URL check, Pages-gem build, built-site check |
| `.github/CODEOWNERS` | Chuck reviews facts, costs, security and policy files |

## 3. Visual design

Nordhaven's structure (dark hero, catalog cards with filters, sticky table of contents, provenance lines) in the UCR ITS palette. It draws on its.ucr.edu without copying it: no stock photos, sparing use of capitals, no UCR logo yet (Chuck, 2026-10-04: we do not yet know which lockup we may use).

- **Colours (CSS variables in `rc.css`):** `--navy-950 #001a4f`, `--navy #00287a`, `--blue #003da5`, `--blue-mid #1f5fbf`, `--link #1565c0`, `--gold #ffb81c`, plus neutrals. Status colours: ok (green), pilot (amber), restricted (red).
- **Type:** Fira Sans (body), Fira Sans Condensed (headings, buttons), Fira Code (kickers, IDs, labels).
- **Components:** `.hero` with `.ask` box and `.hints`; `.tasks`; catalog `.res` of `.rc` cards with `.chips` filters; `.know` cards on navy; `.steps`; `.kbgrid`/`.kblist`; `.dochero`; three-column `.layout.three` (toc, prose, panel); `.fit` (good fit / not a fit); `.callout`; `.reviewed` provenance line; `.foot` footer. Component classes are namespaced (for example `.rcfoot` inside cards) so they do not inherit page-footer styles.
- **Preview marker:** while `preview: true` in `_config.yml`, every page carries `<meta name="robots" content="noindex, nofollow">`, and the utility bar shows a small gold PREVIEW tag. There is no banner, so the dev site looks exactly like the finished site (Chuck: "don't make the banner mess up the site").
- **Phone:** under 900px the nav collapses to a menu button, grids go single-column, and the hero search stacks. Checked at 400px.

## 4. Careful wording (the core rule)

Researchers read closely. Anything that looks like a promise can be held against us. Every page follows these rules, and CI enforces the mechanical parts.

### 4.1 One source for every figure

- Every price, quota, capacity and hardware figure lives in `_data/facts.yml` with `label`, `value`, `source`, `url`, `as_of` (when we checked the source) and `owner`.
- Pages render a figure with `{% raw %}{% include fact.html id="hpcc_lab_fee" %}{% endraw %}`, which prints the value followed by "(source, as of Mon YYYY)". Use `bare=true` only where the source is shown right next to it (for example in the At a glance panel, which prints its own source line).
- Prose never contains a typed `$` figure. CI blocks it.
- **Source of truth for disputed figures:** the HPCC website for HPCC figures (Chuck, 2026-10-04), the ITS storage page for Drive and OneDrive, Research Computing's own terms for CephRDS and the enclave, and the MOU for cloud accounts. When sources disagree, the owner's page wins and we link to it.
- Where another unit owns a figure, prefer linking to its page over restating it.

### 4.2 House style

| Instead of | Write |
| --- | --- |
| guarantee, ensure, will provide | is designed to, aims to, can, supports |
| free, no cost, fully subsidized | no recharge to the lab under current terms, subject to eligibility and limits |
| unlimited | subject to fair-use limits (name the governing terms) |
| certified, compliant | designed to support projects that require X, after review |
| within N hours, % uptime, SLA | (remove; response depends on the issue and workload) |
| within reasonable limits | within the limits set out in (named document) |

- Describe the process, not the outcome ("requests are reviewed against current resources"), not "you will get".
- Every service page has "A good fit / Not a fit" boxes and says which terms govern it.
- Status labels: Available, Pilot, By review, By application, External (defined on `/terms/`).
- Ursa Major Tier 1 (since 2026-10-04, decided by Chuck and Mike; Mike presents it to the Research Advisory Board) is exactly three things: (1) AI model access for research and programming "through a service Research Computing manages, with a per-lab allowance" (the AI gateway is not public yet, so never name it, and do not state an allowance amount); (2) "exotic hardware" the HPCC lacks, through RC's HPC cluster in Google Cloud, "within limits set per project", starting with a consultation. Name only TPUs and Arm as examples (Chuck: do not list memory, node count, clock speed, NVMe or DPU examples). Do not name bifrost publicly; (3) archive storage. Everything else (VMs, GKE, Cloud SQL, BigQuery, Standard storage, GPUs, marketplace models) is Tier 2 recharge. The enclave is a NIST SP 800-171 environment (CMMC Level 2 and controlled-access data such as dbGaP); HIPAA goes to KB006.
- Tier 1 always carries "depends on continued campus funding". No archive duration or retention commitment is stated anywhere (Chuck: unknown while ITS funding continues).
- AI tools: no contract or data-handling wording of our own. Point to ITS at https://its.ucr.edu/ai, plus RAISE (https://raise.ucr.edu/) for AI research.
- No staff names. Use team names and research-computing@ucr.edu. No internal codenames (Polaris, PSSA), project IDs, billing IDs or CRM names.
- Plain ASCII only (no smart quotes or dashes). Kramdown is set to straight quotes, and `check_build.py` rejects non-ASCII text.

### 4.3 Site terms notice

Approved by Chuck on 2026-10-04 and kept in `_data/terms.yml`. It is shown in every footer and on `/terms/`: "Information on this site is a general guide. Service terms, rates, quotas and eligibility are set by the published rate sheets and agreements linked from each page and may change. Nothing on this site is a commitment to provide a specific resource, capacity, price or response time." A campus counsel review is suggested before launch.

### 4.4 Provenance on every page

Service, policy and KB pages end with a provenance line: Owner, Reviewed (date) and, where relevant, Governed by (a link to the rate sheet, MOU or policy). Set them in front matter: `owner`, `reviewed`, `governed_by`, `governed_url` (absolute) or `governed_url_rel` (site path). KB articles without `reviewed:` show "not yet reviewed" and "Review pending" in the index. That is honest, and it doubles as the review to-do list.

### 4.5 Checks (CI and local)

- `tools/claims_check.py`: blocks promise words, service levels, vague limits, internal names and hand-typed `$` figures in all content (`_data/facts.yml` excluded). Fenced code is skipped. Exceptions go in `tools/claims_allow.txt` with a reason. Prefer rewording.
- `tools/check_old_urls.py`: every URL in the prod sitemap snapshot must be covered by a `redirect_from`, a permalink, or a copied file.
- `tools/check_build.py`: built site has no broken internal links or assets, no `[missing fact:]`, no raw Liquid, no non-ASCII text, a valid search index, and noindex on every page while in preview.
- CODEOWNERS: Chuck reviews facts, terms, costs, security, policy and the claims tooling.

## 5. Information architecture

Navigation: Get Started, Compute, Storage, Security, Costs, Knowledge Base, Help. Footer adds About, Grants, FAQ, Terms and campus links (ITS, HPCC, AI at UCR).

Page types:
1. **Service page** (`_services/`): hero with status and tags; Is it right for you (fit and not-fit); what it is; costs (facts only); limits; how to get access; related; provenance; At a glance panel with call-to-action buttons. Front matter keys: `title, kicker, description, status, tags, data_levels, owner, reviewed, governed_by, governed_url, redirect_from, fit, not_fit, glance (k + v or fact), cta (label + url), parent, parent_url`.
2. **Hub page** (Compute, Storage): a "choose by need" table plus service cards from `services.yml`.
3. **Policy summary** (Security, Costs, Records retention, Terms): plain-language summary with links to the governing documents. The documents win.
4. **KB article** (`_kb/`): kicker with KB ID and topic, audience line, renumbered notice if any, body, provenance, related guides by topic.

Home-page catalog and filters: each entry in `services.yml` has `t:` tags (`compute storage secure national help`, `gpu batch interactive cloudai containers webservice`, `p12 p34`, `lab norecharge grant`). Chips filter on them. The catalog is labelled as suggestions, is deterministic, and is not a chatbot.

Search: `/` or Ctrl+K opens an overlay that searches `search.json` (pages, services, KB) with weighted title, kicker, summary and body matches. The hero box opens the same overlay with the typed words.

## 6. Knowledge base

- **Numbering.** Numbered articles keep their IDs. Duplicates in the old site were renumbered (Chuck, 2026-10-04): KB001 AI/Cloud Access Request became **KB021**, KB006 Migrating Compute to HPCC became **KB022**, and KB007 Migrating Data to Archive became **KB012** (12 was unused). KB001 Storage Strategy, KB006 SOM Clinical Apps and KB007 Tier 2 Recharge kept their numbers. Renumbered articles show a "previously" notice, and their old URLs redirect. The next free number is **KB032** (KB023-KB030 are the NRP Nautilus researcher guide series, `series: nautilus`, added 2026-10-06; KB031 is the nrp-mcp quick start, 2026-10-08).
- **Ledger.** The ServiceNow ledger (`Knowledge_Base/Master_ServiceNow_KB_Ledger.md` in the old repo) must be updated with the new numbers when the switch happens. ServiceNow itself is not changed without Chuck's approval.
- **Migration.** `tools/migrate_kb.py` copied the old KB mechanically (front matter, emoji and smart-quote removal, link rewriting, redirects). It skips any article that has a `reviewed:` date, so hand-edited articles are never overwritten.
- **Reviewed so far (2026-10-04):** KB001, KB002, KB004, KB005, KB006, KB007, KB008, KB010, KB012, KB014, KB015, KB021, Ursa Major guidelines, workstations, cloud storage, HPC clusters and research services. Wording fixes were also made in KB009, KB013, KB019, KB020, KB022, DSPs, Globus, BLAST, Nextflow, Ollama and the budget guide (claims check clean). Everything else shows "Review pending".
- **Factual fixes made in migration:** the HPCC cluster is not "also known as Ursa Major" (removed from BLAST, Nextflow and Globus); the HPCC account process is email to support@hpcc.ucr.edu per the HPCC Access page (the old portal link no longer resolves); Google Drive quotas follow the ITS storage page (the old "500 GB" and "unlimited 1 TB" claims were removed); a broken code block in KB013 was repaired.
- **Not carried over (Chuck: leave out for now):** showcase essays, demos, infographics and interactive HTML (astrophysics101, genomics101, battery and earth models, hpc-sim and so on), empty stub pages, test pages, the internal ServiceNow ledger, the old blog posts, SDSC Comet guides (system retired), R-JAGS and the ChatGPT MD-input note. Their old URLs redirect to the closest hub.

### 6.1 Archived reference articles

When an arrangement changes but some researchers still work the old way, keep the old article instead of deleting it. Set `archived: true`, `archived_note` (what it describes), `superseded_by` (site path) and `superseded_by_title` in its front matter, and give it a new slug (for example `ursa-major-service-tiers-pre-2026-10`). The layout then shows an "Archived reference" notice and a link to the current article. The page gets `noindex` (even after launch), and it is left out of the KB index, topic counts, related guides and site search. It is listed only on `/kb/archive/`, which is linked once at the foot of the KB index. The current article links to it in one sentence. Old URLs and KB IDs stay on the current article.

Archived so far: the pre-October-2026 Ursa Major tiers (old KB005 content).

## 7. How to...

**Add or change a figure.** Edit `_data/facts.yml` (value, source, url, as_of, owner). Every page that uses it updates. Chuck reviews (CODEOWNERS).

**Add a service.** Add an entry to `_data/services.yml` (id, name, url, icon, group, blurb, tags, status, cost, data, terms, t) and create `_services/<name>.md` from an existing service page. Put it in a hub grid on `compute.md` or `storage.md` if it belongs there.

**Add a KB article.** Create `_kb/kb0NN-short-slug.md` with `title, kb_id, topic (HPCC|Cloud|Storage|Security|National|General|Software), audience, reviewed, owner`. Use the next free number (section 6). Run the claims check.

**Retire a page.** Delete it and add its URL to a `_redirects/` stub (`permalink` = old path, `redirect_to` = new home).

**Run the checks locally.**
```bash
python3 tools/claims_check.py
python3 tools/check_old_urls.py tools/data/prod_sitemap_2026-10-04.txt
bundle exec jekyll build -d _site && python3 tools/check_build.py _site /rc-dev
```

**Ship a change.** Branch, PR, CI green, merge, delete the branch. Chuck reviews costs and security changes.

## 8. The switch

**Done 2026-10-04 (Chuck: "go").** The new site went live at https://ucr-research-computing.github.io/ through PR #51 on `UCR-Research-Computing/UCR-Research-Computing.github.io` (merge 3915999), with `preview: false` and `baseurl: ""`. The old site is tagged `pre-cutover-2026-10-04` (096c15a). **Roll back:** Revert PR #51 and merge the revert, or reset main to that tag. This repo stays the staging copy (preview on, `/rc-dev`); changes made here must be copied to the live repo (or the live repo edited directly) until a sync is set up. Still to do: update the ServiceNow KB ledger with renumbered IDs (section 6).

Original plan, for reference:

The dev site was built so the switch is one reversible change. Recommended path:

1. Freeze edits on the old repo. Snapshot its sitemap again and re-run `check_old_urls.py` against the fresh list. Add stubs for anything new.
2. In this repo: set `preview: false` and `baseurl: ""`, then build and check (`check_build.py _site ""`).
3. Replace the contents of `UCR-Research-Computing.github.io` with this repo's tree on a branch (keep its history), PR, and merge. Pages serves the new site at the root URL. Old URLs keep working through the redirects.
4. Roll back if needed by reverting that merge.
5. Update the ServiceNow KB ledger with the renumbered IDs (section 6). Archive this repo or keep it as the staging copy.

## 9. Open items

- Counsel review of the site terms notice (suggested).
- UCR logo lockup: waiting for guidance on which mark may be used.
- Sources not yet linked: CephRDS pilot terms and the ITS cloud admin fees have no public page. Facts cite them by name. Publish a rates page or link the MOU template when one exists.
- KB articles still marked "Review pending" (section 6).
- The HPCC portal URL (portal.hpcc.ucr.edu) did not resolve on 2026-10-04. Re-check, and update KB004 if it returns.
- Showcase content (essays, demos, infographics): decide whether and where it returns.
- Eventually offer this site's content to ITS for https://its.ucr.edu/research, which ITS calls the RC website and which has gaps (Chuck, 2026-10-04: not now).

## 10. History

- 2026-10-08: KB031, the nrp-mcp quick start, added as the web version of the October 2026 workshop handout. The printable PDF is `assets/documents/nrp-mcp-quick-start.pdf`, built from `docs/handouts/nrp-mcp-quick-start.html` (not part of the build) with `google-chrome --headless=new --no-pdf-header-footer --virtual-time-budget=6000 --print-to-pdf=assets/documents/nrp-mcp-quick-start.pdf file://$PWD/docs/handouts/nrp-mcp-quick-start.html`. Edit the article and the HTML together.
- 2026-10-04 (later): Ursa Major Tier 1 redefined as AI model access, exotic hardware (examples: TPUs and Arm only, by consultation) and archive storage; the old baseline list is now Tier 2. KB005 rewritten, old version archived (section 6.1). The change was carried through the Ursa Major service page, guidelines, workstations, storage, research services, HPC clusters, KB002, KB006, KB007, KB010, KB021, Ollama, Costs, FAQ, Compute, Cloud and AI, and the catalog. Enclave wording now reads as a NIST SP 800-171 environment.
- 2026-10-04: dev site built from the approved plan and mockups. 13 service pages (14 catalog entries; consulting points to Help), 14 hub and topic pages plus the home page, 47 KB articles migrated (17 hand-reviewed), 50 redirect stubs, all 143 prod sitemap URLs covered, claims check clean.
