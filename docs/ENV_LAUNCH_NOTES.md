# Admin Command Environment Launch Notes

## Rule

Do not let missing optional environment variables block internal Admin Command build, validation, audit, GitHub issue creation, documentation, UI routing, Supabase command queue scaffolding, or Vercel build tests.

External posting/sending/publishing actions must remain disabled until their provider env values are installed.

## Required for internal system operation

```env
ORCHESTRATOR_SECRET=required_for_bridge_auth
NEXT_PUBLIC_SUPABASE_URL=connected_in_vercel
NEXT_PUBLIC_SUPABASE_ANON_KEY=connected_in_vercel
SUPABASE_SERVICE_ROLE_KEY=connected_in_vercel_server_only
```

## Required for AI/chat responses

```env
OPENAI_API_KEY=optional_server_only
AI_GATEWAY_API_KEY=optional_server_only
```

If missing, chat route should fail gracefully and show setup guidance.

## Required for GitHub/Vercel automation

```env
GITHUB_TOKEN=required_for_deployed_bridge_workflow_dispatch
VERCEL_TOKEN=required_for_cloud_runner_cli_deploy
VERCEL_PROJECT_ID=prj_bnEAqTm6tAopvlpoNR1a8XLF0JYz
VERCEL_TEAM_ID=team_aFdds8lsbHMwe2ip4aQdbQ3d
VERCEL_DEPLOY_HOOK_URL=optional_for_deploy_hook_route
```

GitHub Actions can use `GITHUB_TOKEN` internally without storing it as a repository secret. The deployed bridge still needs a server-side token if it dispatches GitHub workflows directly.

## Required for Shopify publish actions

```env
SHOPIFY_SHOP_DOMAIN=your-store.myshopify.com
SHOPIFY_ADMIN_TOKEN=server_only_admin_api_token
```

Do not publish Shopify products or collections until both values are installed.

## Required for Drive quarantine/delete-request bridge

```env
GOOGLE_CLIENT_ID=oauth_client_id_if_used
GOOGLE_CLIENT_SECRET=server_only_oauth_secret_if_used
APPS_SCRIPT_SHARED_SECRET=shared_secret_for_script_auth
APPS_SCRIPT_WEB_APP_URL=deployed_apps_script_web_app_url
```

Drive delete requests must route through quarantine behavior unless operator explicitly performs manual permanent purge outside Admin Command.

## Required for outside-system posting/sending

```env
SOCIAL_WEBHOOK_URL=Postiz_Buffer_Make_Zapier_n8n_or_custom_relay
EMAIL_WEBHOOK_URL=Resend_Make_Zapier_n8n_or_custom_email_relay
SMS_WEBHOOK_URL=Twilio_Make_Zapier_n8n_or_custom_sms_relay
```

These are the only categories that should hard-block action execution if missing.

## Full env sample

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

OPENAI_API_KEY=
AI_GATEWAY_API_KEY=

VERCEL_TOKEN=
VERCEL_PROJECT_ID=prj_bnEAqTm6tAopvlpoNR1a8XLF0JYz
VERCEL_TEAM_ID=team_aFdds8lsbHMwe2ip4aQdbQ3d
VERCEL_DEPLOY_HOOK_URL=

GITHUB_TOKEN=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
APPS_SCRIPT_SHARED_SECRET=
APPS_SCRIPT_WEB_APP_URL=

SHOPIFY_SHOP_DOMAIN=
SHOPIFY_ADMIN_TOKEN=

SOCIAL_WEBHOOK_URL=
EMAIL_WEBHOOK_URL=
SMS_WEBHOOK_URL=

CRON_SECRET=
ORCHESTRATOR_SECRET=
```

## Pre-launch completion check

- Vercel env values installed for Supabase and Orchestrator.
- GitHub Actions cloud runner has required secrets for Vercel/Supabase deployment operations.
- External posting providers connected only when ready.
- Apps Script Web App deployed and URL stored.
- Shopify Admin token installed only when publish operations are ready.
