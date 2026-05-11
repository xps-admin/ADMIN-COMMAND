# Admin Command Runner Queue Policy

Codex/local runner jobs must use this folder standard:

```text
RUNNER_QUEUE/
├── pending/
├── approved/
├── running/
├── completed/
├── failed/
├── quarantine/
└── logs/
```

## Execution rules

A job may run only when all conditions are true:

- `approved: true`
- `zone: sandbox`
- `audit_log_required: true`
- `rollback_required: true`
- `repo: Strategic-Minds/ADMIN-COMMAND`
- `command_id` exists
- `success_criteria` is clear
- operator is Jeremy or approved agent

## Default behavior

- Draft and test in sandbox.
- Log all actions.
- Create rollback references for production-impacting changes.
- Route uncertain file/folder actions to quarantine.
- Do not place secrets inside queue files.
