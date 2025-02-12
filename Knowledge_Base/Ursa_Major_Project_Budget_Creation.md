## Creating GCP Budgets with Project Discounts and Credit Alerts

**Introduction:**

Effectively managing your Google Cloud Platform (GCP) spending is crucial for controlling costs and optimizing resource utilization. GCP Budgets provide a powerful tool to monitor your cloud spending and receive alerts when your costs approach or exceed your defined budget. This article will guide you through creating a custom GCP budget that incorporates project-level discounts and credits and ensures budget alerts are sent directly to the project owner, enabling proactive cost management.

**What you will learn:**

* How to navigate to the Budgets & Alerts section in the GCP Console.
* Steps to create a new budget tailored to your project.
* How to configure your budget to account for project discounts and credits.
* How to set up budget alert thresholds and actions.
* How to ensure budget alerts are sent to the project owner for timely notifications.

**Prerequisites:**

* You must have Project Owner or Billing Administrator permissions in your GCP project to create and manage budgets.

**Step-by-Step Guide:**

**1. Navigate to Budgets & Alerts:**

   a. Go to the [GCP Console](https://console.cloud.google.com/) and log in with your Google Cloud account.
   b. Ensure you have selected the correct project from the project dropdown menu at the top of the page.
   c. In the left-hand navigation menu, expand the "Billing" section.
   d. Click on "Budgets & alerts".

   *(Visual Aid: Screenshot of the GCP Console navigation menu highlighting "Billing" and "Budgets & alerts")*

**2. Create a New Budget:**

   a. On the "Budgets & alerts" page, click on the "+ CREATE BUDGET" button. This will open the budget creation wizard.

   *(Visual Aid: Screenshot of the "Budgets & alerts" page with the "+ CREATE BUDGET" button highlighted)*

**3. Configure Budget Scope (Project):**

   a. In the "Scope" section of the budget creation wizard:
      * **Name:** Enter a descriptive name for your budget (e.g., "Project Budget - [Project Name]").
      * **Scope:** Ensure that the "Project" scope is selected. The project should be pre-selected based on your current project context. Verify that the correct project is displayed.
      * **Billing account:** Confirm the correct billing account is associated with your project.

   *(Visual Aid: Screenshot of the "Scope" section in the budget creation wizard with example budget name and project scope selected)*

**4. Set the Budget Amount (Custom Budget):**

   a. In the "Budget amount" section:
      * **Budget type:** Choose "Specified budget".
      * **Target amount:** Select "Set amount".
      * **Amount:** Enter the budget amount you want to set for this project.  This should be the amount you expect to spend within the budget period. Choose a relevant currency from the dropdown.
      * **Time period:** Select the budget time period. "Monthly" is a common choice for recurring budgets.

   *(Visual Aid: Screenshot of the "Budget amount" section showing "Specified budget", "Set amount" and input fields for budget value and time period)*

**5. Include Project Discounts and Credits:**

   a.  **Crucially, in the "Budget amount" section, look for the "Include credits" option.**
   b.  **Expand "Advanced options" if necessary.**
   c.  **Ensure the following checkboxes are checked to accurately reflect your net spending:**
      * **Credits:** Check "Include credits in budget amount". This ensures that any applicable credits (e.g., free tier credits, committed use discounts, promotional credits) are deducted from your spending when calculating budget progress.
      * **Discounts:** Check "Include discounts in budget amount". This ensures that any project-level discounts you receive (e.g., sustained use discounts, committed use discounts) are factored into your budget calculations.

   * **Importance of Including Credits and Discounts:** By including credits and discounts, your budget will reflect your *actual* out-of-pocket expenses. If you don't include them, the budget will be based on your gross spending, which may not accurately represent your financial commitments.

   *(Visual Aid: Screenshot of the "Budget amount" section highlighting "Include credits" and "Include discounts" checkboxes within "Advanced options")*

**6. Set Alert Thresholds:**

   a. Navigate to the "Alert thresholds (Actions)" section.
   b. Click "+ ADD THRESHOLD" to define alert conditions.
   c. Configure your alert thresholds based on percentage of budget spent or a specific spending amount:
      * **Threshold type:** Choose "Percentage" or "Specified spend amount".
      * **Percentage/Amount:** Enter the percentage (e.g., 80%, 90%, 100%, 120%) or the specific amount at which you want to trigger an alert.
      * **Action:** Select the actions to be taken when the threshold is reached. The most common action is "Send email notifications". You can add multiple thresholds to receive alerts at different spending levels.

   *(Visual Aid: Screenshot of the "Alert thresholds (Actions)" section showing how to add and configure alert thresholds with percentage and action options)*

**7. Configure Alert Notifications (Project Owner):**

   a. **Under "Alert thresholds (Actions)", ensure "Email notifications" is configured.**
   b. **To send alerts to the Project Owner(s), ensure the following is enabled:**
      * **"Email project owners and billing administrators"**:  This checkbox is typically enabled by default and will send email alerts to all Project Owners and Billing Administrators associated with the project.  **This is the key setting to ensure project owners receive notifications.**

   c. **Optional: Add additional email recipients:**
      * If you need to notify other individuals or teams beyond project owners, you can add custom email addresses in the "Email recipients" field. Enter email addresses separated by commas.

   d. **Optional: Link a Cloud Pub/Sub topic (for programmatic actions):**
      * For more advanced alerting and automation, you can configure a Cloud Pub/Sub topic. This allows you to receive budget alert notifications programmatically and trigger automated actions (e.g., stopping VMs, scaling down resources). This is beyond the scope of basic budget alerting but is a powerful feature for advanced users.

   *(Visual Aid: Screenshot of the "Alert thresholds (Actions)" section emphasizing the "Email project owners and billing administrators" checkbox and optional email recipients field)*

**8. Review and Save:**

   a. Review all the budget configurations you have set: Budget name, scope (project), budget amount, included credits and discounts, alert thresholds, and notification settings.
   b. Once you are satisfied with the configuration, click the "CREATE BUDGET" button at the bottom of the wizard.

   *(Visual Aid: Screenshot of the "CREATE BUDGET" button at the bottom of the budget creation wizard)*

**Conclusion:**

By following these steps, you have successfully created a custom GCP budget that accurately reflects your project's net spending by including discounts and credits.  You have also configured alerts to be sent to project owners, enabling them to proactively monitor and manage costs. Regularly reviewing your budgets and adjusting thresholds as needed is a best practice for continuous cost optimization in GCP.

**Additional Resources & Support:**

* **GCP Budgets Documentation:** [https://cloud.google.com/billing/docs/how-to/budgets](https://cloud.google.com/billing/docs/how-to/budgets)
* **GCP Billing Concepts:** [https://cloud.google.com/billing/docs/concepts](https://cloud.google.com/billing/docs/concepts)
* **Contact UCR Research Computing for help or to learn more!**
    * **Email:** research-computing@ucr.edu
    * **UCR Research Computing Slack:** [https://ucr-research-compute.slack.com/](https://ucr-research-compute.slack.com/)

This knowledge base article provides a comprehensive guide to creating GCP budgets with project discounts and credit alerts. Remember to adjust the budget amounts and alert thresholds to match your specific project needs and cost management goals.