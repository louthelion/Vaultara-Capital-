# Vaultara intake integration acceptance — release gate

Status: **blocked until a separately configured, nonproduction environment exists.**

## Isolation prerequisites
- Use distinct, nonproduction Netlify sites and Blob namespaces/sites for the website outbox and dashboard inquiry/task stores. A deploy preview of a production site is **not** proof of Blob isolation.
- Configure a separate signing secret for test website → test dashboard communication. Never copy the production intake sync key into a test environment.
- Use an allowlisted **test dashboard URL**. The currently hard-coded production dashboard URL in `_shared/deliver.mts` is not acceptable for integration tests.
- Verify that test writes and deletes are confined to nonproduction Blob stores using synthetic submissions only.
- Keep the existing `CONTEXT !== 'production'` intake guards in effect until an independently verified test-only configuration is implemented. Do not temporarily remove them to test previews.
- Do not send real email/SMS, make live Vapi calls, send funding applications, or assign real employees during testing.

## Acceptance scenarios
1. Valid signed synthetic submission creates exactly one inquiry and its linked task.
2. Repeat submission with the same ID yields the same receipt and does not modify existing records.
3. Concurrent submission with the same ID preserves correct inquiry/task relationships; inspect actual Blob conditional-write behavior.
4. Simulated task-store failure after inquiry persistence produces a retryable error. A later retry creates only the missing task.
5. Incorrect signature, stale timestamp, malformed payload, non-POST request and oversized request are rejected without record writes.
6. Invalid or mismatched dashboard receipt leaves the website item pending.
7. One poison item does not block later valid pending submissions; observe bounded retry behavior.
8. Only authorized users can see CRM inquiry and task records; unauthorized requests are denied.
9. Confirm the test environment cannot read production stores, and production cannot accidentally target test services.

## Evidence to retain
- Test-site identifiers and non-secret configuration names; independent verification of site/store separation.
- CI commit SHAs, sanitized request IDs, response codes, record counts, retry outcomes and cleanup confirmation.
- Security review covering authentication, data access, concurrency, retention and secrets.
- Owner sign-off before merging either PR or changing production Netlify configuration.

**Current disposition:** Automated tests are useful but do not satisfy these integration gates. Production release is on hold.
