---
title: Welcome to UCR Research Computing
layout: default
---

# Welcome to UCR Research Computing

<div class="text-center">
At the University of California, Riverside (UCR), we are committed to accelerating your path from hypothesis to publication. We provide the advanced computational resources, secure data storage, and expert consultation necessary to propel your research forward.

<strong>New to UCR Research Computing?</strong> Start with our <a href="./Knowledge_Base/intro-research-computing-guide.html">Introductory Guide</a> or browse the <a href="./Knowledge_Base/KB010_Resource_Catalog.html">Resource Catalog</a>.
</div>

<div class="container mx-auto px-4 py-8">
  <h2 class="text-2xl font-bold text-center text-gray-800 mb-10">How Can We Help You Today?</h2>

  <div class="mb-12">
    <h3 class="text-xl font-semibold text-gray-700 mb-6 border-b-2 border-blue-500 pb-2">I Need to Accelerate My Analysis</h3>
    <div id="compute-cards" class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      <!-- Compute cards will be injected here by JavaScript -->
    </div>
  </div>

  <div>
    <h3 class="text-xl font-semibold text-gray-700 mb-6 border-b-2 border-green-500 pb-2">I Need to Store & Share My Data</h3>
    <div id="storage-cards" class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      <!-- Storage cards will be injected here by JavaScript -->
    </div>
  </div>

  <div class="mt-12">
    <h3 class="text-xl font-semibold text-gray-700 mb-6 border-b-2 border-purple-500 pb-2">I Need Expert Assistance</h3>
    <div id="support-cards" class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      <!-- Support cards will be injected here by JavaScript -->
    </div>
  </div>
</div>

<script>
  let allComputeOptions = [
    {
      name: "Run Batch Simulations (HPCC)",
      link: "./pages/HPCC.html",
      description: "Run complex simulations, process massive genomic pipelines, and train models locally on our flagship High-Performance Computing Cluster."
    },
    {
      name: "Train AI Models (Ursa Major Cloud)",
      link: "./pages/ursa_major.html",
      description: "Leverage Google Cloud's AI platforms, including Vertex AI and Gemini, for scalable model training and next-generation data science."
    },
    {
      name: "Scale Beyond the Campus (NAIRR / Nautilus)",
      link: "./Knowledge_Base/KB010_Resource_Catalog.html",
      description: "When local resources aren't enough, we facilitate access to massive national computing grids like the Nautilus Cluster, NSF ACCESS, and the NAIRR Pilot."
    }
  ];

  const storageOptions = [
    {
      name: "Secure My Working Data (CephRDS)",
      link: "./pages/ceph_secure_research_storage.html",
      description: "Secure, multi-petabyte active storage designed to hold your lab's critical working data, imaging, and sequencing libraries. (Currently in Pilot)"
    },
    {
      name: "Archive for Grant Compliance (Coldline)",
      link: "./pages/storage-overview.html",
      description: "Meet your 10-year NSF/NIH data retention requirements with fully subsidized, long-term cloud archiving."
    },
    {
      name: "Process Data at High Speed (GPFS)",
      link: "./pages/hpcc_gpfs.html",
      description: "Ultra-fast parallel file storage directly attached to the HPCC, built for data currently undergoing active computational analysis."
    }
  ];

  let allSupportOptions = [
    {
      name: "Grant Collaboration & Funding",
      link: "./pages/grant_colab.html",
      description: "Partner with us to architect the computing infrastructure for your next proposal. We provide boilerplate text, budget estimates, and letters of support."
    },
    {
      name: "Secure Regulated Data (NIST/HIPAA)",
      link: "./pages/research_security.html",
      description: "Working with P4 Critical data? We design and build certified Secure Enclaves to ensure your research complies with strict federal guidelines."
    },
    {
      name: "One-on-One Consultation",
      link: "./pages/research_facilitation.html",
      description: "Not sure where to start? Schedule a consultation or drop into our weekly office hours for personalized advice on optimizing your workflows."
    }
  ];

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
        if (sectionContainer) sectionContainer.style.display = ''; 
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      renderCards(allComputeOptions, 'compute-cards');
      renderCards(storageOptions, 'storage-cards');
      renderCards(allSupportOptions, 'support-cards');
    });
  } else {
    renderCards(allComputeOptions, 'compute-cards');
    renderCards(storageOptions, 'storage-cards');
    renderCards(allSupportOptions, 'support-cards');
  }
</script>

## Additional Resources

* [Official Knowledge Base (KB Series)](./Knowledge_Base/README.md) - Deep dive into our technical documentation and service tiers.
* [UCR Facilites Documents](./pages/on-prem-facilities.md) - Standardized descriptions of our data centers for your grant proposals.
* [UCR Researcher AI Prompt Gallery](https://ucr-ai-prompt-gallery-492106370716.us-west1.run.app) - A gallery of AI prompts to inspire and assist with research tasks.

## Contact Us

For more information, please contact us at:

[research-computing@ucr.edu](mailto:research-computing@ucr.edu) - [UCR Research Computing Slack](https://ucr-research-compute.slack.com/)
