require('dotenv').config();
const { App } = require('@slack/bolt');

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

// Slash command - opens the modal
app.command('/approve-request', async ({ command, ack, client }) => {
  await ack();

  await client.views.open({
    trigger_id: command.trigger_id,
    view: {
      type: 'modal',
      callback_id: 'approval_modal',
      private_metadata: command.user_id,
      title: { type: 'plain_text', text: 'Request Approval' },
      submit: { type: 'plain_text', text: 'Submit' },
      close: { type: 'plain_text', text: 'Cancel' },
      blocks: [
        {
          type: 'input',
          block_id: 'approver_block',
          label: { type: 'plain_text', text: 'Who needs to approve this?' },
          element: {
            type: 'users_select',
            action_id: 'approver_select',
            placeholder: { type: 'plain_text', text: 'Select a person' }
          }
        },
        {
          type: 'input',
          block_id: 'request_block',
          label: { type: 'plain_text', text: 'What are you requesting?' },
          element: {
            type: 'plain_text_input',
            action_id: 'request_input',
            multiline: true,
            placeholder: { type: 'plain_text', text: 'Describe what you need approved...' }
          }
        }
      ]
    }
  });
});

// Modal submission - DM the approver
app.view('approval_modal', async ({ ack, view, client }) => {
  await ack();

  const requesterId = view.private_metadata;
  const approverId = view.state.values.approver_block.approver_select.selected_user;
  const requestText = view.state.values.request_block.request_input.value;

  const dm = await client.conversations.open({ users: approverId });
  await client.chat.postMessage({
    channel: dm.channel.id,
    text: `New approval request from <@${requesterId}>`,
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*New Approval Request*\n*From:* <@${requesterId}>\n*Request:* ${requestText}`
        }
      },
      {
        type: 'actions',
        block_id: 'approval_actions',
        elements: [
          {
            type: 'button',
            text: { type: 'plain_text', text: '✅ Approve' },
            style: 'primary',
            action_id: 'approve_request',
            value: requesterId
          },
          {
            type: 'button',
            text: { type: 'plain_text', text: '❌ Reject' },
            style: 'danger',
            action_id: 'reject_request',
            value: requesterId
          }
        ]
      }
    ]
  });
});

// Approve button
app.action('approve_request', async ({ ack, body, client }) => {
  await ack();

  const requesterId = body.actions[0].value;
  const approverId = body.user.id;

  await client.chat.update({
    channel: body.channel.id,
    ts: body.message.ts,
    text: `Request approved by <@${approverId}>`,
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `${body.message.blocks[0].text.text}\n\n*Status:* ✅ Approved by <@${approverId}>`
        }
      }
    ]
  });

  const dm = await client.conversations.open({ users: requesterId });
  await client.chat.postMessage({
    channel: dm.channel.id,
    text: `Your request was approved by <@${approverId}>! ✅`
  });
});

// Reject button
app.action('reject_request', async ({ ack, body, client }) => {
  await ack();

  const requesterId = body.actions[0].value;
  const approverId = body.user.id;

  await client.chat.update({
    channel: body.channel.id,
    ts: body.message.ts,
    text: `Request rejected by <@${approverId}>`,
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `${body.message.blocks[0].text.text}\n\n*Status:* ❌ Rejected by <@${approverId}>`
        }
      }
    ]
  });

  const dm = await client.conversations.open({ users: requesterId });
  await client.chat.postMessage({
    channel: dm.channel.id,
    text: `Your request was rejected by <@${approverId}>. ❌`
  });
});

(async () => {
  await app.start(process.env.PORT || 3000);
  console.log('⚡️ Approval bot is running!');
})();