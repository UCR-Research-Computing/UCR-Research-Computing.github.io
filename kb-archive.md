---
title: "Archived reference articles"
heading: "Archived reference articles"
section: kb
permalink: /kb/archive/
parent: Knowledge Base
parent_url: /kb/
kicker: "Earlier arrangements"
kicker_plain: "Knowledge Base"
description: "Articles that describe earlier ways of working, kept for people who still rely on them. They are not current guidance."
search: false
sitemap: false
---

These articles describe arrangements that have since changed. They stay online for people and projects still set up the earlier way, and so that old links keep working. For current guidance, start from the [knowledge base]({{ '/kb/' | relative_url }}).

<div class="kblist">
{%- assign old = site.kb | where: "archived", true | sort: "title" -%}
{%- for a in old -%}
<a href="{{ a.url | relative_url }}"><div class="id">Archived{% if a.kb_id %} <span class="sep">|</span> {{ a.kb_id }}{% endif %}</div><h4>{{ a.title }}</h4><p>{{ a.archived_note }}</p>{% if a.superseded_by_title %}<div class="rv">Current: {{ a.superseded_by_title }}</div>{% endif %}</a>
{%- endfor -%}
</div>
