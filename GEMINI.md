# GEMINI Project Context: UCR Research Computing Website

## Directory Overview

This directory contains the source code for the UCR Research Computing website, a Jekyll-based static site hosted on GitHub Pages. The website serves as a central information hub for researchers at the University of California, Riverside, providing comprehensive details on available computing resources, data storage options, support services, and training opportunities.

The site is structured to be a primary resource for both new and experienced researchers, offering everything from introductory guides on High-Performance Computing (HPC) to detailed documentation on specific platforms like the Ursa Major Google Cloud environment.

## Key Files and Directories

*   **`_config.yml`**: The main Jekyll configuration file. It defines the site's title, description, theme (`zendesk/jekyll-theme-zendesk-garden`), and navigation structure for the sidebar. It also enables plugins for SEO, sitemaps, and feeds.

*   **`README.md`**: The landing page of the repository, which also serves as the main content for the website's homepage. It provides a high-level overview of the compute, storage, and support options available, with JavaScript used to dynamically render resource cards.

*   **`pages/`**: This directory contains the primary informational pages of the website as Markdown files. Each file corresponds to a major section of the site, such as "About Us" (`about.md`), "Computing Resources Overview" (`computing-resources-overview.md`), and "Research Security" (`research_security.md`).

*   **`Knowledge_Base/`**: A collection of articles, guides, and tutorials in Markdown format. These files provide detailed "how-to" instructions and explanations on specific topics, such as connecting to an HPC cluster, using Globus for data transfer, or understanding what HPC is.

*   **`_posts/`**: This directory contains blog posts for the website. The posts are written in Markdown and follow the standard Jekyll naming convention (`YYYY-MM-DD-title.md`). They cover topics relevant to research computing, such as AI and software development trends.

*   **`assets/`**: Contains static assets for the site, including CSS (`style.scss`), images, and documents. The `style.scss` file includes custom styling that overrides the base theme.

## Usage

This is a non-code, content-focused project. The primary workflow involves creating and editing Markdown files to update the website's content.

*   **To add or update a main page:** Modify or create a `.md` file in the `pages/` directory.
*   **To add a new knowledge base article:** Create a new `.md` file in the `Knowledge_Base/` directory.
*   **To write a new blog post:** Create a new `.md` file in the `_posts/` directory with the appropriate date and title format.

The site is built and deployed automatically by GitHub Pages whenever changes are pushed to the main branch. Local development can be done using the standard Jekyll toolchain (`bundle exec jekyll serve`) to preview changes before publishing.
