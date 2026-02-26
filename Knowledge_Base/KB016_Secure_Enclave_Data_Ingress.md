---
id: kb016-secure-enclave-data-ingress
title: KB016 - Secure Enclave Data Ingress & Decryption Protocol
sidebar_label: KB016 - Data Ingress Protocol
---

# KB016: Secure Enclave Data Ingress & Decryption Protocol

**Scope:** UCR Secure Research Enclave, NIST 800-171 Rev 2, CMMC Level 2, NIH dbGaP, High-Compliance Data Transfers
**Audience:** Principal Investigators (PIs), Technical Leads, Research Staff
**Last Updated:** February 26, 2026

---

## 1. The Golden Rule of Data Ingress

High-compliance data (such as NIH dbGaP genomic data or CUI) must **NEVER** be downloaded to a local laptop, office workstation, external hard drive, or standard UCR campus server. Doing so constitutes a severe security breach and an immediate violation of the institutional Data Security Plan (DSP) and federal NIST 800-171 boundaries.

All data must flow directly from the external agency (e.g., NIH, DoD) into the isolated UCR Secure Research Enclave.

## 2. Who is Authorized to Download the Data?

Only an **"Approved User"** who is explicitly named and authorized in the Data Use Agreement (DUA) or Data Use Certification (DUC) is permitted to initiate the data transfer. 
*   This is typically the Principal Investigator (PI) or their designated Primary Technical Contact.
*   *Note: UCR Research Computing staff and systems engineers cannot download the data on your behalf unless they have been formally named as IT Collaborators on your federal application.*

## 3. Step-by-Step Ingress Protocol

To securely transfer the data from the provider into your project's storage bucket, authorized researchers must follow this exact pipeline:

1.  **The Bastion Jump:** The Approved User logs into the UCR Secure Enclave via the secure Bastion Host (Jump Box) using their UCR Single Sign-On (SSO) and mandatory Duo Multi-Factor Authentication (MFA).
2.  **The Transfer Node:** From the Bastion Host, the user connects to the dedicated, heavily monitored "Transfer Node" (`sys-stellar-tl01`) located *inside* the isolated Virtual Private Cloud (VPC) Service Perimeter.
3.  **Direct Ingress:** From the Transfer Node, the user initiates the download directly from the external agency's repository (e.g., dbGaP) using an approved, encrypted channel (sFTP or HTTPS).
4.  **The Landing Zone:** The data flows directly into the enclave's encrypted Google Cloud Storage (GCS) bucket. The data never touches the public UCR network or any physical endpoint devices.

## 4. Decryption Passphrase Handling (Out-of-Band)

High-compliance datasets are typically heavily encrypted by the provider before transmission. 

*   **Out-of-Band Transmission:** The external agency (like the NIH) will not email the decryption password. They will transmit the unique decryption passphrase **out-of-band via telephone** directly to the designated Unit Information Security Lead (UISL) listed on your DSP (often the Director of Research Computing or the CISO).
*   **Escrow:** The UISL will securely escrow that passphrase in a UCR-approved enterprise password management system.
*   **Decryption Execution:** Once the encrypted data payload has safely landed inside the Secure Enclave storage bucket, the PI or Tech Lead will coordinate a live session with the UISL to decrypt the data within the secure boundary.

---

**Questions?**
If you need assistance configuring your SFTP client on the Transfer Node, or need to schedule a decryption session, please contact the Research Computing team.