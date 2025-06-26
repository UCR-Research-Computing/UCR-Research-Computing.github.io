
# Welcome to UCR Research Computing

At the University of California, Riverside (UCR), we're committed to empowering our researchers with the most advanced computational resources and support services.

Explore a wide array of computational tools and platforms tailored to support your research endeavors. Through our sidebar navigation, the cards below and the **search bar** in the upper right you can explore our offerings:

<div class="container mx-auto px-4 py-8">
  <div class="mb-8">
    <input type="text" id="fuzzy-search-bar" placeholder="Search resources by name or description..." class="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
  </div>

  <h2 class="text-2xl font-bold text-center text-gray-800 mb-10">Explore Our Resources</h2>

  <div class="mb-12">
    <h3 class="text-xl font-semibold text-gray-700 mb-6 border-b-2 border-blue-500 pb-2">Compute Options</h3>
    <div id="compute-cards" class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      <!-- Compute cards will be injected here by JavaScript -->
    </div>
  </div>

  <div>
    <h3 class="text-xl font-semibold text-gray-700 mb-6 border-b-2 border-green-500 pb-2">Storage Options</h3>
    <div id="storage-cards" class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      <!-- Storage cards will be injected here by JavaScript -->
    </div>
  </div>

  <div class="mt-12">
    <h3 class="text-xl font-semibold text-gray-700 mb-6 border-b-2 border-purple-500 pb-2">Support Options</h3>
    <div id="support-cards" class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      <!-- Support cards will be injected here by JavaScript -->
    </div>
  </div>
</div>

<script>
  let allComputeOptions = [
    {
      name: "Campus HPC Cluster (HPCC)",
      link: "./pages/HPCC.html",
      description: "UCR's shared High-Performance Computing Cluster, offering resources for computationally intensive research."
    },
    {
      name: "Ursa Major - Cloud Computing",
      link: "./pages/ursa_major.html",
      description: "A Kubernetes-based cloud computing platform providing scalable and flexible computing environments."
    },
    {
      name: "NSF - Nautilus Cluster",
      link: "./pages/Nautilus.html",
      description: "A distributed Kubernetes-based cluster for high-throughput computing, part of the Pacific Research Platform."
    },
    {
      name: "NSF - HPC Clusters - ACCESS",
      link: "./pages/nsf_access.html",
      description: "Provides access to national high-performance computing resources through the NSF ACCESS program."
    }
  ];

  const storageOptions = [
    {
      name: "Campus HPC Cluster Storage",
      link: "./pages/hpcc_gpfs.html",
      description: "High-performance GPFS storage integrated with the HPCC, suitable for large datasets and fast I/O."
    },
    {
      name: "Ursa Major Cloud Storage",
      link: "./pages/ursa_major_data.html",
      description: "Persistent storage options for applications and data within the Ursa Major cloud environment."
    },
    {
      name: "Ceph Research Data Storage (coming soon)",
      link: "./pages/ceph_secure_research_storage.html",
      description: "A future scalable and secure storage solution for research data, offering various access protocols."
    },
    {
      name: "Google Drive",
      link: "./pages/Google_Drive.html",
      description: "UCR-provided Google Drive for cloud storage, collaboration, and file sharing."
    }
  ];

  let allSupportOptions = [
    {
      name: "Research Infrastructure Support",
      link: "./pages/research_infrastructure_support.html",
      description: "Dedicated support for on-premises research clusters and major computing systems, focusing on design, construction, and administration to enhance security and reliability."
    },
    {
      name: "Ursa Major Support",
      link: "./pages/ursa_major.html",
      description: "Comprehensive support for UCR's Google Cloud Platform (GCP) resources, including help with workstations, HPC clusters, AI/ML services, and secure storage."
    },
    {
      name: "Research Computing Facilitation",
      link: "./pages/research_facilitation.html",
      description: "Expert consultation, training, and technical assistance to help researchers effectively access, utilize, and optimize advanced computing resources for their projects."
    },
    {
      name: "Knowledge Base",
      link: "./Knowledge_Base/README.html",
      description: "A comprehensive resource hub with practical guides, how-to articles, and technical information for UCR's research computing tools and services."
    }
  ];

  // Basic fuzzy search function: checks if all characters of searchTerm appear in order in text
  function fuzzyMatch(searchTerm, text) {
    if (!searchTerm) return true; // Empty search term matches everything
    searchTerm = searchTerm.toLowerCase();
    text = text.toLowerCase();
    let searchIndex = 0;
    for (let i = 0; i < text.length && searchIndex < searchTerm.length; i++) {
      if (searchTerm[searchIndex] === text[i]) {
        searchIndex++;
      }
    }
    return searchIndex === searchTerm.length;
  }

  function createCard(item) {
    return `
      <div class="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col">
        <div class="p-6 flex-grow">
          <h3 class="text-xl font-semibold text-gray-800 mb-2">${item.name}</h3>
          <p class="text-gray-600 text-sm">
            ${item.description}
          </p>
        </div>
        <div class="p-6 bg-gray-50">
          <a href="${item.link}" class="text-blue-500 hover:text-blue-700 font-semibold text-sm">
            Learn More &rarr;
          </a>
        </div>
      </div>
    `;
  }

  function renderCards(options, containerId) {
    const container = document.getElementById(containerId);
    const sectionContainer = container ? container.closest('.mb-12, .mt-12') : null;

    if (container) {
      let cardsHTML = "";
      if (options.length > 0) {
        options.forEach(option => {
          cardsHTML += createCard(option);
        });
        container.innerHTML = cardsHTML;
        if (sectionContainer) sectionContainer.style.display = ''; // Show section
      } else {
        container.innerHTML = '<p class="text-gray-500 text-center col-span-full">No matching resources found.</p>';
        // Optionally hide the section if no cards match, or keep it to show "No matching resources"
        // For now, we'll keep the section visible to show the message.
        // If you want to hide the section title as well:
        if (sectionContainer) sectionContainer.style.display = ''; // Or 'none' to hide completely
      }
    } else {
      // console.error("Card container not found:", containerId);
    }
  }

  function filterAndRenderAllCards() {
    const searchTerm = document.getElementById('fuzzy-search-bar').value;

    const filterOptions = (options) =>
      options.filter(option =>
        fuzzyMatch(searchTerm, option.name) || fuzzyMatch(searchTerm, option.description)
      );

    renderCards(filterOptions(allComputeOptions), 'compute-cards');
    renderCards(filterOptions(allStorageOptions), 'storage-cards');
    renderCards(filterOptions(allSupportOptions), 'support-cards');
  }

  // Initial render and event listener setup
  function initializeSearchAndCards() {
    filterAndRenderAllCards(); // Initial render based on empty search (shows all)

    const searchBar = document.getElementById('fuzzy-search-bar');
    if (searchBar) {
      searchBar.addEventListener('input', filterAndRenderAllCards);
    }
  }

  // Defer script execution until the DOM is fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSearchAndCards);
  } else {
    // DOMContentLoaded has already fired
    initializeSearchAndCards();
  }
</script>

## Researcher Resources

* [Research Data Security Plans](./pages/research_security.md) for secure research projects.
* [UCR Facilites Documents](./pages/on-prem-facilities.md) for grant proposals.



## Contact Us

For more information, please contact us at:

[research-computing@ucr.edu](./pages/mailto:research-computing@ucr.edu) - [UCR Research Computing Slack](./pages/https://ucr-research-compute.slack.com/)


