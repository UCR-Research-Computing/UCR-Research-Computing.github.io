
# Welcome to UCR Research Computing

At the University of California, Riverside (UCR), we're committed to empowering our researchers with the most advanced computational resources and support services.

Explore a wide array of computational tools and platforms tailored to support your research endeavors. Through our sidebar navigation, the table below and the **search bar** in the upper right you can explore our offerings: 


| Compute                                          | Storage                                  | Support                                                 |
|--------------------------------------------------|------------------------------------------|---------------------------------------------------------|
| [Campus HPC Cluster (HPCC)](./pages/HPCC.md)        | [Campus HPC Cluster Storage](./pages/hpcc_gpfs.md)        | [Research Infrastructure Support](./pages/research_infrastructure_support.md) |
| [Ursa Major - Cloud Computing](./pages/ursa_major.md) | [Ursa Major Cloud Storage](./pages/ursa_major_data.md) | [Ursa Major Support](./pages/ursa_major.md)             |
| [NSF - Nautilus Cluster](./pages/Nautilus.md)      | [Ceph Research Data Storage (coming soon)](./pages/ceph_secure_research_storage.md) | [Research Computing Facilitation](./pages/research_facilitation.md) |
| [NSF - HPC Clusters - ACCESS](./pages/nsf_access.md)  | [Google Drive](./pages/Google_Drive.md)  | [Knowledge Base](./Knowledge_Base/README.md)  |

<div id="resource-cards-container" class="container mx-auto px-4 py-8">
  <h2 class="text-2xl font-bold text-center text-gray-800 mb-10">Explore Our Resources Visually</h2>

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
</div>

<script>
  const computeOptions = [
    {
      name: "Campus HPC Cluster (HPCC)",
      link: "./pages/HPCC.md",
      description: "UCR's shared High-Performance Computing Cluster, offering resources for computationally intensive research."
    },
    {
      name: "Ursa Major - Cloud Computing",
      link: "./pages/ursa_major.md",
      description: "A Kubernetes-based cloud computing platform providing scalable and flexible computing environments."
    },
    {
      name: "NSF - Nautilus Cluster",
      link: "./pages/Nautilus.md",
      description: "A distributed Kubernetes-based cluster for high-throughput computing, part of the Pacific Research Platform."
    },
    {
      name: "NSF - HPC Clusters - ACCESS",
      link: "./pages/nsf_access.md",
      description: "Provides access to national high-performance computing resources through the NSF ACCESS program."
    }
  ];

  const storageOptions = [
    {
      name: "Campus HPC Cluster Storage",
      link: "./pages/hpcc_gpfs.md",
      description: "High-performance GPFS storage integrated with the HPCC, suitable for large datasets and fast I/O."
    },
    {
      name: "Ursa Major Cloud Storage",
      link: "./pages/ursa_major_data.md",
      description: "Persistent storage options for applications and data within the Ursa Major cloud environment."
    },
    {
      name: "Ceph Research Data Storage (coming soon)",
      link: "./pages/ceph_secure_research_storage.md",
      description: "A future scalable and secure storage solution for research data, offering various access protocols."
    },
    {
      name: "Google Drive",
      link: "./pages/Google_Drive.md",
      description: "UCR-provided Google Drive for cloud storage, collaboration, and file sharing."
    }
  ];

  function createCard(item) {
    return `
      <div class="bg-white shadow-lg rounded-lg overflow-hidden m-4 flex flex-col">
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
    if (container) {
      let cardsHTML = "";
      options.forEach(option => {
        cardsHTML += createCard(option);
      });
      container.innerHTML = cardsHTML;
    } else {
      // It's possible this script runs before the elements are in the DOM in some README rendering contexts.
      // console.error("Card container not found:", containerId);
    }
  }

  // Defer script execution until the DOM is fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      renderCards(computeOptions, 'compute-cards');
      renderCards(storageOptions, 'storage-cards');
    });
  } else {
    // DOMContentLoaded has already fired
    renderCards(computeOptions, 'compute-cards');
    renderCards(storageOptions, 'storage-cards');
  }
</script>

## Researcher Resources

* [Research Data Security Plans](./pages/research_security.md) for secure research projects.
* [UCR Facilites Documents](./pages/on-prem-facilities.md) for grant proposals.



## Contact Us

For more information, please contact us at:

[research-computing@ucr.edu](./pages/mailto:research-computing@ucr.edu) - [UCR Research Computing Slack](./pages/https://ucr-research-compute.slack.com/)


