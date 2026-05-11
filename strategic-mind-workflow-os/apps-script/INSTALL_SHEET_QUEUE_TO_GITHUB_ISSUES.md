# Strategic Mind Workflow OS Apps Script Install: Sheet Queue to GitHub Issues

## Purpose

Connect a Google Sheet queue to GitHub issues without storing secrets in the workbook.

## Required sheet

Default queue tab: `12_GITHUB_CODEX_WORK_ORDERS`

Required columns:

- Work Order ID
- Task
- Type
- Mode
- Status
- Priority
- Source Link
- GitHub Issue
- Approval Required
- Blocked Reason
- Last Updated

## Required Script Properties

Set these in Apps Script Project Settings → Script Properties:

- `GITHUB_TOKEN`
- `GITHUB_REPO=Strategic-Minds/shopify-workflow-benchmark-and-refactor-template`
- `QUEUE_SHEET=12_GITHUB_CODEX_WORK_ORDERS`

Never store the token in a Sheet, Doc, GitHub file, prompt, or visible dashboard.

## Safe behavior

The script may create GitHub work-order issues only for rows where:

- `Mode` is `SANDBOX_ONLY`
- `Status` is `PENDING`
- `Approval Required` is not bypassed

## Blocked actions

- Production deploy
- Shopify live publish
- Main merge
- Secret write
- Email send
- Social post
- Paid action

## Operator setup

1. Open the Strategic Mind Workflow OS command workbook.
2. Open Extensions → Apps Script.
3. Add the guarded issue writer code only after review.
4. Add `GITHUB_TOKEN` in Script Properties.
5. Run once manually.
6. Verify issue URLs are written back to the sheet.
7. Add a time trigger only after the manual dry run passes.
