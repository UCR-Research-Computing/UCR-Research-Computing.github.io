---
title: "Knowledge Base"
heading: "Knowledge base"
section: kb
permalink: /kb/
kicker: "Step-by-step guides"
kicker_plain: "Knowledge Base"
description: "How-to guides and reference articles for UCR research computing: accounts, the HPCC cluster, Ursa Major, storage, security and national resources."
raw: false
toc: false
---

<div data-kbindex>
  <div class="kbtools">
    <input type="search" placeholder="Filter guides, for example: rclone, enclave, Slurm" aria-label="Filter guides" />
  </div>
  <div class="chips">
    <button type="button" class="chip on" data-topic="all">All</button>
    {%- assign topics = "HPCC,Cloud,Storage,Security,National,General,Software" | split: "," -%}
    {%- for t in topics -%}{%- assign n = site.kb | where: "topic", t | where_exp: "a", "a.archived != true" | where_exp: "a", "a.unlisted != true" | size -%}{%- if n > 0 -%}
    <button type="button" class="chip" data-topic="{{ t }}">{{ t }}<span class="n">{{ n }}</span></button>
    {%- endif -%}{%- endfor -%}
    <span class="kbcount" data-kbcount></span>
  </div>

  <h2 class="kbsec">Numbered articles</h2>
  <div class="kblist">
    {%- assign current = site.kb | where_exp: "a", "a.archived != true" | where_exp: "a", "a.unlisted != true" -%}
    {%- assign numbered = current | where_exp: "a", "a.kb_id" | sort: "kb_id" -%}
    {%- for a in numbered -%}
    <a href="{{ a.url | relative_url }}" data-topic="{{ a.topic }}"><div class="id">{{ a.kb_id }} <span class="sep">|</span> {{ a.topic }}</div><h4>{{ a.title }}</h4>{% if a.renumbered_from %}<p>Previously {{ a.renumbered_from }}</p>{% endif %}<div class="rv">{% if a.reviewed %}Reviewed {{ a.reviewed | date: "%b %Y" }}{% elsif a.updated %}Updated {{ a.updated | date: "%b %Y" }}{% else %}Review pending{% endif %}</div></a>
    {%- endfor -%}
  </div>

  <h2 class="kbsec">How-to guides</h2>
  <div class="kblist">
    {%- assign guides = current | where_exp: "a", "a.kb_id == nil" | sort: "title" -%}
    {%- for a in guides -%}
    <a href="{{ a.url | relative_url }}" data-topic="{{ a.topic }}"><div class="id">{{ a.topic }}</div><h4>{{ a.title }}</h4><div class="rv">{% if a.reviewed %}Reviewed {{ a.reviewed | date: "%b %Y" }}{% else %}Review pending{% endif %}</div></a>
    {%- endfor -%}
  </div>
</div>

<div class="callout"><b>About these guides.</b> Guides describe how to do things with services as they work today. Screens and commands change, and providers update their tools. A guide is not a commitment that a service, feature or price will stay the same. Each guide shows when it was last reviewed. <a href="{{ '/help/' | relative_url }}">Tell us</a> if one is out of date.</div>

<p class="archive-link"><a href="{{ '/kb/archive/' | relative_url }}">Archived reference articles</a> for earlier arrangements, kept for people who still work that way.</p>
