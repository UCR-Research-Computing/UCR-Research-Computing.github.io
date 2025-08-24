---
layout: default
title: Blog
---

# Research Computing Blog

<div class="home">

  <ul class="post-list">
    {% for post in site.posts %}
      <li>
        <h2>
          <a class="post-link" href="{{ post.url | prepend: site.baseurl }}">{{ post.title }}</a>
        </h2>
        <span class="post-meta">{{ post.date | date: "%b %-d, %Y" }}</span>
        <p>{{ post.excerpt | strip_html | truncatewords: 50 }}</p>
      </li>
    {% endfor %}
  </ul>

</div>
