Slack School Approval AppA Slack app built with Bolt for JavaScript that enables lightweight approval workflows directly in Slack. Built as part of the Slack School tutorial series — Episode 31: Deploying with GitHub Actions.


What It DoesThe Approval App lets any Slack user request approval from a colleague without leaving Slack. The full flow:


User runs /approve-request in any channel
A modal appears asking who needs to approve and what they're requesting
The approver receives a DM with Approve and Reject buttons
The approver clicks a button — the message updates to reflect the decision
The requester gets a DM with the outcome



Tools & Technologies
Slack Bolt for JavaScript - The official Slack framework for building Slack apps with Node.js. Handles slash commands, modals, button interactions, and messaging — all through a single /slack/events endpoint.


Node.js - The JavaScript runtime that powers the app. Required to run Bolt apps locally or in production.


Docker - Packages the app and its dependencies (including Node.js) into a portable container. This means the app runs consistently regardless of what machine or server it's deployed to.


Railway - The hosting platform where the containerized app lives. Railway runs the Docker container and provides a public URL that Slack uses to send events to the app.


GitHub Actions - Automates deployment. Every time code is merged to main, a GitHub Actions workflow automatically builds and deploys the updated app to Railway — no manual steps required.


ngrok - Used during local development to expose your locally running app to the internet so Slack can reach it. Not needed in production.


SetupPrerequisites
Node.js installed
A Slack workspace where you can install apps
A Railway account
A GitHub account
ngrok for local testing



1. Clone the repogit clone https://github.com/sfdcMike/slackSchoolApprovalApp.git
cd slackSchoolApprovalApp


2. Install dependencies - npm install


3. Create your Slack app
Go to api.slack.com/apps and create a new app from scratch
Add the following bot scopes under OAuth & Permissions:
chat:write
commands
im:write

Create a slash command /approve-request
Enable Interactivity & Shortcuts
Install the app to your workspace
Copy your Bot Token and Signing Secret



4. Configure environment variables - Create a .env file in the root:
SLACK_BOT_TOKEN=xoxb-your-token-here
SLACK_SIGNING_SECRET=your-signing-secret-here
PORT=3000


5. Run locally - npm start

In a separate terminal, start ngrok:
ngrok http 3000

Update your Slash Command and Interactivity URLs in api.slack.com to:
https://your-ngrok-url.ngrok-free.app/slack/events


6. Deploy with GitHub Actions
Create a Railway project and generate a project-scoped API token
Add the following secrets to your GitHub repo (Settings → Secrets and variables → Actions):
RAILWAY_TOKEN
SLACK_BOT_TOKEN
SLACK_SIGNING_SECRET

Push to main — GitHub Actions will handle the rest



Using the App
In any Slack channel, type /approve-request
In the modal, select the person who needs to approve your request
Describe what you're requesting in the text field
Hit Submit
Your approver will receive a DM — once they approve or reject, you'll get notified automatically



Part of Slack SchoolThis app is built as a teaching tool. You're using this app as-is. This is not covered by Slack or Salesforce's terms and conditions. 