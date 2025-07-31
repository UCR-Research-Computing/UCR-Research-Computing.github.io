---
layout: default
title: Blog
---

<style>
    .blog-card {
        border: 1px solid #ddd;
        border-radius: 8px;
        padding: 20px;
        margin-bottom: 20px;
        transition: box-shadow 0.3s ease;
    }
    .blog-card:hover {
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    .blog-card h2 {
        margin-top: 0;
    }
    .blog-card .meta {
        color: #666;
        font-size: 0.9em;
        margin-bottom: 10px;
    }
    .blog-card .preview-area {
        margin-top: 20px;
        border-top: 1px solid #eee;
        padding-top: 20px;
    }
    .blog-card iframe {
        width: 100%;
        height: 600px;
        border: 1px solid #ccc;
        border-radius: 4px;
    }
</style>

# Research Computing Blog

<div id="blog-posts"></div>

<script>
    document.addEventListener("DOMContentLoaded", function() {
        fetch('/_data/blog_posts.json')
            .then(response => response.json())
            .then(posts => {
                const postsContainer = document.getElementById('blog-posts');
                posts.sort((a, b) => new Date(b.date) - new Date(a.date));

                posts.forEach(post => {
                    const postElement = document.createElement('div');
                    postElement.className = 'blog-card';

                    const gdoc_url_embed = post.gdoc_url.replace("/edit?usp=sharing", "/pub?embedded=true");

                    postElement.innerHTML = `
                        <h2>${post.title}</h2>
                        <div class="meta">By ${post.author} on ${post.date}</div>
                        <p>${post.description}</p>
                        <a href="${post.gdoc_url}" target="_blank" class="btn btn-primary">Open in New Tab</a>
                        <button class="btn btn-secondary preview-btn" data-gdoc-url="${gdoc_url_embed}">Preview Here</button>
                        <div class="preview-area" style="display: none;"></div>
                    `;
                    postsContainer.appendChild(postElement);
                });

                document.querySelectorAll('.preview-btn').forEach(button => {
                    button.addEventListener('click', function() {
                        const previewArea = this.nextElementSibling;
                        if (previewArea.style.display === 'none') {
                            const iframe = document.createElement('iframe');
                            iframe.src = this.dataset.gdocUrl;
                            previewArea.innerHTML = '';
                            previewArea.appendChild(iframe);
                            previewArea.style.display = 'block';
                            this.textContent = 'Close Preview';
                        } else {
                            previewArea.style.display = 'none';
                            previewArea.innerHTML = '';
                            this.textContent = 'Preview Here';
                        }
                    });
                });
            });
    });
</script>
