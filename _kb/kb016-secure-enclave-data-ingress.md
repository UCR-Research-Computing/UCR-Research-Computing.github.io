---
title: "Secure enclave: data transfer rules"
kb_id: KB016
topic: Security
audience: "Principal Investigators (PIs), Technical Leads, Research Staff"
reviewed: 2026-10-04
owner: Research Computing
redirect_from:
  - /Knowledge_Base/KB016_Secure_Enclave_Data_Ingress.html
review_notes:
  - "Chuck 2026-10-04: access path and key escrow confirmed."
  - "Removed an internal host name and the claim that data never touches any network; described the transfer path in general terms and pointed to the project's DSP and training for the exact steps, consistent with KB014 and KB015."
  - "Rewrote the decryption section generically: the earlier text said providers such as NIH phone a passphrase to a named role, which may not match how dbGaP issues decryption keys."
---

These rules apply to projects in the [secure research enclave](../../services/secure-enclave/). The project's data security plan (DSP) and the mandatory enclave training set the exact steps for each project. Where they differ from this summary, the DSP applies. See [KB014](../kb014-secure-enclave-guide/) for an overview of the enclave and [KB015](../kb015-secure-enclave-onboarding-checklist/) for onboarding.

## 1. The basic rule

Controlled data, such as NIH dbGaP controlled-access data or Controlled Unclassified Information (CUI), must **never** be downloaded to a laptop, office workstation, external drive or ordinary campus server. Doing so is a security incident and a violation of the project's DSP and of the NIST SP 800-171 controls the project has agreed to.

Data goes directly from the provider (for example, NIH or a Department of Defense sponsor) into the project's workspace in the enclave.

## 2. Who may download the data

Only an **Approved User** who is named and authorized in the data use agreement (DUA) or data use certification (DUC) may start the transfer.

*   This is usually the Principal Investigator (PI) or a designated technical contact.
*   Research Computing staff cannot download the data on your behalf unless they are formally named, for example as IT collaborators, on the project's approved application.

## 3. How data is brought into the enclave

The training covers the details. In outline:

1.  **Sign in through the enclave's controlled access point.** The Approved User signs in through the enclave's bastion (jump) host with UCR Single Sign-On and Duo multi-factor authentication.
2.  **Connect to the transfer node.** From the bastion host, the user connects to the project's designated transfer node inside the enclave's network perimeter. Activity on this node is logged and monitored.
3.  **Download from the provider.** From the transfer node, the user downloads the data from the provider's repository over an encrypted channel the provider supports (for example, SFTP or HTTPS, or the provider's own download tool).
4.  **Store in the project's storage.** The data lands in the project's encrypted cloud storage inside the enclave. It is not copied to any device or system outside the enclave.

## 4. Decryption keys and passphrases

Providers often encrypt controlled datasets before release and issue a decryption key or passphrase separately.

*   **Receive keys only as the provider and the DSP direct.** Never send or store a key or passphrase by email, chat, or in a file outside the enclave.
*   **Escrow.** Keys and passphrases are held in a UCR-approved password management system by the person the DSP names for this role, such as the project's Unit Information Security Lead (UISL).
*   **Decrypt inside the enclave.** Once the encrypted data is in the project's enclave storage, it is decrypted there, following the DSP. Decrypted data stays inside the enclave.

## Questions

For help setting up a transfer client on the transfer node, or to arrange a decryption session, contact Research Computing at research-computing@ucr.edu.
