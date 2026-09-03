---
id: research-security
title: Security
sidebar_label: Security
---

<img src="../assets/research-security.png" alt="Banner Image" style="width: 100%; object-fit: scale-down; height: auto; max-height: 400px;">

## Research Security

At the University of California, Riverside (UCR), ensuring the security of research data is a priority. We work closely with UCR's Information Security Team to provide comprehensive consulting services on securing your research projects. Our goal is to ensure that all research activities meet the highest standards of data security, complying with relevant regulations and university policies. Understanding and adhering to records retention policies is also a critical component of responsible data management. 

We assist researchers in several key areas:

- **Data Security Plan**: We aid in developing a Data Security Plan for your project. The DSP outlines Roles, Responsibilities, Guidelines, Processes, and Controls essential for safeguarding your data. For full details on the DSP intake process, see our [UCR Data Security Plans](../Knowledge_Base/UCR_Data_Security_Plans.md) page.
- **Implementation**: Our team is here to help implement the plans or controls developed, ensuring your research data is secure within approved environments.

We encourage researchers to connect with the Research Computing Team to explore how we can support your data security needs.

<button id="ai-guide-toggle">A Guide to the Safe and Secure Use of Artificial Intelligence in Research</button>
<div id="ai-guide-content" style="display: none;">


#### Understanding your Research Security

Understanding and adhering to security policies and regulations is critical for safeguarding research data at UCR. All research data falls under a classification of security level ranging from P1 to P4, refer to the detailed descriptions of each level on the UCOP Security Classification page: [UCOP Information Security Classification Standards](https://security.ucop.edu/policies/institutional-information-and-it-resource-classification.html):
- **P1/P2** involving data without Personal Identifiable Information (PII)—P1 being public and P2 internal.
- **P3/P4** categories deal with data containing PII, necessitating a [Data Security Plan](../Knowledge_Base/UCR_Data_Security_Plans.md), where P3 is classified as sensitive and P4 as confidential.

By default, the systems we build and manage at UCR Research Computing are designed to comply with the UC IS-3 policy at the P2 level, ensuring a robust foundation for data security and integrity. While our infrastructure supports projects up to P4 level, accommodating the highest levels of data sensitivity, it is important to note that we do not support the handling of US classified data.

### Meeting Federal Compliance: NIST 800-171, CMMC, & NIH dbGaP

Many federal grant proposals now include strict requirements for data security. If your grant or DUA involves the Department of Defense (DoD), Department of Energy (DOE), NIH dbGaP, or mandates specific federal compliance frameworks like **CMMC** or **NIST 800-171**, this is handled specially.

*   **Our Solution: The UCR Secure Enclave** 
    The UCR Secure Enclave is the official campus environment purpose-built to meet the technical controls required by NIST 800-171 Rev 2 and handle NIH dbGaP data. By using the UCR Secure Enclave, your lab is operating in an environment that provides the necessary technical foundation to meet CMMC Level 2 controls, enabling you to pursue DoD-funded research.

#### **How to Proceed**

Navigating these requirements is complex. If your grant proposal or DUA mentions NIST 800-171 Rev 2, CMMC Level 2, or NIH dbGaP, please contact us immediately. We will work with you and the Information Security Office to develop the required Data Security Plan (DSP).

**Important:** Due to the significant security and monitoring overhead, the UCR Secure Enclave is a premium **Tier 2 (Direct Recharge)** service and requires a grant-funded Chart of Accounts (COA). 

#### Collaboration for Security

Collaborating with UCR's Research Computing Team ensures that your research projects are secure and compliant with the latest data protection standards. Our team is dedicated to supporting UCR researchers in navigating the complexities of research security, offering tailored solutions that meet the unique needs of each project.

<script>
  document.getElementById('ai-guide-toggle').addEventListener('click', function() {
    var content = document.getElementById('ai-guide-content');
    if (content.style.display === 'none') {
      content.style.display = 'block';
    } else {
      content.style.display = 'none';
    }
  });
</script>
