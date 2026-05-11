# GPT Automation Bridge

Route:

```text
POST /api/gpt-automation-bridge
GET /api/gpt-automation-bridge
```

## Purpose

The GPT Automation Bridge is a cloud endpoint for high-impact provider actions from Admin Command.

It supports:

- Shopify publish actions
- Drive delete requests routed through Apps Script quarantine
- Social posting through a social webhook provider
- Email sending through an email webhook provider
- SMS sending through an SMS webhook provider
- GitHub workflow dispatch
- Vercel deploy hook / deployment workflow dispatch

## Security model

- Requires `Authorization: Bearer ORCHESTRATOR_SECRET`.
- Requires `approved: true` for execution.
- Defaults to `dryRun: true`, even when approved.
- To actually execute, request must include `approved: true` and `dryRun: false`.
- Logs command/audit records to Supabase when Supabase env vars are configured.
- Secrets stay server-side in Vercel environment variables.
- Drive deletion is not direct permanent deletion. It calls Apps Script for delete request/quarantine behavior.

## Required environment variables

```env
ORCHESTRATOR_SECRET=
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
SHOPIFY_SHOP_DOMAIN=
SHOPIFY_ADMIN_TOKEN=
APPS_SCRIPT_WEB_APP_URL=
SOCIAL_WEBHOOK_URL=
EMAIL_WEBHOOK_URL=
SMS_WEBHOOK_URL=
GITHUB_TOKEN=
VERCEL_DEPLOY_HOOK_URL=
```

## Supported actions

```text
shopify.publish_product
shopify.publish_collection
drive.delete_request
drive.quarantine
social.post
email.send
sms.send
github.workflow_dispatch
vercel.deploy_hook
vercel.workflow_dispatch
```

## Request envelope

```json
{
  "action": "github.workflow_dispatch",
  "approved": true,
  "dryRun": false,
  "actor": "Jeremy",
  "systemCode": "SYS-006",
  "commandText": "Run Admin Command production deployment workflow",
  "targetRef": "Strategic-Minds/ADMIN-COMMAND",
  "payload": {}
}
```

## Shopify publish product

```json
{
  "action": "shopify.publish_product",
  "approved": true,
  "dryRun": false,
  "actor": "Jeremy",
  "targetRef": "gid://shopify/Product/1234567890",
  "payload": {
    "productId": "gid://shopify/Product/1234567890"
  }
}
```

## Shopify publish collection

```json
{
  "action": "shopify.publish_collection",
  "approved": true,
  "dryRun": false,
  "actor": "Jeremy",
  "targetRef": "gid://shopify/Collection/1234567890",
  "payload": {
    "collectionId": "gid://shopify/Collection/1234567890"
  }
}
```

## Drive delete request / quarantine

```json
{
  "action": "drive.delete_request",
  "approved": true,
  "dryRun": false,
  "actor": "Jeremy",
  "targetRef": "GOOGLE_FILE_OR_FOLDER_ID",
  "payload": {
    "fileOrFolderId": "GOOGLE_FILE_OR_FOLDER_ID",
    "reason": "Set aside from active Admin Command workflow"
  }
}
```

## Social post

`SOCIAL_WEBHOOK_URL` should point to Postiz, Buffer, Make, Zapier, n8n, or another social posting relay.

```json
{
  "action": "social.post",
  "approved": true,
  "dryRun": false,
  "actor": "Jeremy",
  "payload": {
    "platform": "linkedin",
    "text": "Post body here",
    "mediaUrls": [],
    "scheduleAt": null
  }
}
```

## Email send

`EMAIL_WEBHOOK_URL` should point to Resend, Make, Zapier, n8n, or a secured email relay. Gmail direct send should stay human-reviewed unless explicitly wired through a provider.

```json
{
  "action": "email.send",
  "approved": true,
  "dryRun": false,
  "actor": "Jeremy",
  "payload": {
    "to": "person@example.com",
    "subject": "Subject",
    "html": "<p>Email body</p>"
  }
}
```

## SMS send

`SMS_WEBHOOK_URL` should point to Twilio, Make, Zapier, n8n, or another compliant SMS provider. SMS must respect consent, opt-out, and carrier compliance rules.

```json
{
  "action": "sms.send",
  "approved": true,
  "dryRun": false,
  "actor": "Jeremy",
  "payload": {
    "to": "+15555555555",
    "body": "Message body"
  }
}
```

## GitHub workflow dispatch

```json
{
  "action": "github.workflow_dispatch",
  "approved": true,
  "dryRun": false,
  "actor": "Jeremy",
  "payload": {
    "owner": "Strategic-Minds",
    "repo": "ADMIN-COMMAND",
    "workflowId": "cloud-command-runner.yml",
    "ref": "main",
    "inputs": {
      "mode": "test-build",
      "command_note": "Triggered from GPT Automation Bridge"
    }
  }
}
```

## Vercel deploy hook

Create a Vercel Deploy Hook and store it as `VERCEL_DEPLOY_HOOK_URL`.

```json
{
  "action": "vercel.deploy_hook",
  "approved": true,
  "dryRun": false,
  "actor": "Jeremy",
  "payload": {}
}
```

## Vercel workflow dispatch

This triggers the GitHub Actions cloud runner with `deploy-production`.

```json
{
  "action": "vercel.workflow_dispatch",
  "approved": true,
  "dryRun": false,
  "actor": "Jeremy",
  "commandText": "Deploy Admin Command production through cloud runner",
  "payload": {}
}
```

## cURL pattern

```bash
curl -X POST "https://YOUR_DOMAIN/api/gpt-automation-bridge" \
  -H "Authorization: Bearer $ORCHESTRATOR_SECRET" \
  -H "Content-Type: application/json" \
  -d '{
    "action":"github.workflow_dispatch",
    "approved":true,
    "dryRun":false,
    "actor":"Jeremy",
    "payload":{"owner":"Strategic-Minds","repo":"ADMIN-COMMAND","workflowId":"cloud-command-runner.yml","ref":"main","inputs":{"mode":"test-build"}}
  }'
```
