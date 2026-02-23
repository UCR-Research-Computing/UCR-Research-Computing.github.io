# KB 001: New AI/Cloud Access Request
**Category:** AI & Cloud Computing (Ursa Major)
**Audience:** BearHelp Tier 1 Support

**Trigger:** User asks for "Gemini API Access," "Google Cloud (GCP) Project," or "Ursa Major Access."

**Governance Rule:** **No Individual Accounts.** All cloud resources must be anchored to a Lab/PI Project for billing and security.

**Triage Workflow:**
1.  **Identify User:** Is the requestor a **PI (Faculty)** or a **Student/Researcher**?
2.  **Lookup (Student Request):** Ask "Who is your PI?" and check CRM/Nexus for an existing `ucr-ursa-major-<pi-name>` project.
3.  **Action:**

| Scenario | Action | Template |
| :--- | :--- | :--- |
| **Project Exists** | Email Student + CC PI to request approval. | `template_ursa_verification` |
| **No Project (Student)** | Route ticket to Research Computing (Tier 2). | *Escalate* |
| **New PI Request** | Route ticket to Research Computing (Tier 2) for Strategy Sync. | *Escalate* |

**Template: Lab Verification (For Existing Projects)**
> **Subject:** Action Required: Cloud Access Approval for [Student Name]
>
> Hello [Student],
>
> At UCR, cloud resources and API keys are provisioned at the Lab/PI level.
>
> Your advisor, Professor [PI Name] (cc'd), has an active project: `[Project ID]`.
>
> **@Professor [PI Name]:** Do you approve adding [Student] to your existing GCP project? This will allow them to generate Gemini API keys under your billing account.
>
> **Next Steps:** Once approved, we will provision access immediately.
