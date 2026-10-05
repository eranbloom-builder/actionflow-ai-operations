# Rebuilding the Microsoft workflow

This is an implementation blueprint reconstructed from Eran Bloom's description. It is not an exported Power Automate package. Tenant access, licensing, policies, identities, and connection references must be configured in a real environment.

## 0. PM prepares the site and list

Create a SharePoint site and an **Action Register** list. Enable list version history before configuring status-change detection. Create appropriate member/visitor groups and test whether owners can update only the records they should be allowed to edit; a filtered "My actions" view is not an access-control mechanism.

| Display field | Suggested internal name | Type | Rule |
|---|---|---|---|
| Action | Title | Single line of text | Required; enforce SharePoint field length limit before import |
| Owner | ActionOwner | Single line of text | Named owner or missing information |
| Start date | StartDate | Date only | Capture date default; missing maps to null |
| End date | DueDate | Date only | Explicit due date; missing maps to null |
| Owner's email address | OwnerEmail | Single line of text | Validated address or missing information |
| Status | ActionStatus | Choice | Not started, In progress, Blocked, Completed, Cancelled |

The first five fields plus Status match the original workflow. Native date fields cannot store the literal `missing information`: translate that token to null on import and show "missing information" in the PM view. Never substitute an arbitrary date. A text-field implementation can retain the literal token but needs explicit date validation before reminders.

Recommended additions for a new production rebuild: `ImportKey` (unique), `SourceMessageId`, `SourceRecordIds`, `PMEmail`, `ReviewTimestamp`, and an exception/delivery log. These are improvements proposed for the reconstruction, not claims about the original implementation. If Title can exceed the platform limit, use a multiline ActionDescription field and keep Title as a short summary.

## 1. Daily Copilot candidate collection and PM review

Configure the daily scheduled prompt only where the tenant enables it. Use `prompts/action-extraction.md`. The scheduled output is for the PM, not a direct write to SharePoint. Source coverage depends on the user's permissions, indexing, transcript availability, and tenant configuration. A daily prompt does not guarantee an exhaustive tenant-wide read.

The PM checks evidence, removes unsupported candidates, resolves missing details where possible, and sends the reviewed five-field list to the team. Use one plain-text action per line and consistent labels. Keep introductory prose and signatures outside the machine-readable block. Suggested markers for a new rebuild: `BEGIN_ACTION_ITEMS` and `END_ACTION_ITEMS`; these are not part of the original described format.

## 2. Approved email → SharePoint

**Original behavior described:** an outgoing email with action/action items in its subject initiated the flow. The exact sent-mail capture configuration was not retained.

**Rebuild recommendation:** explicitly choose and test a capture design. Microsoft's email-trigger guide documents incoming-mail triggers. Do not assume an incoming trigger reliably detects outgoing mail merely by selecting a folder.

Two options:
1. The PM includes a dedicated intake mailbox in the team email. Use **When a new email arrives (V3)** on that mailbox, with sender allowlist and subject filter. This deliberately changes the capture mechanism while preserving the PM-approved email handoff.
2. Retain outgoing-mail semantics using a scheduled, permissioned Sent Items collector with a durable high-water mark. Connector/API, permissions, latency, and behavior must be validated in the tenant. Process only authorized PM senders and preserve message IDs.

Then:
- Normalize HTML to text when needed. Extract only the action block; do not split signatures or quoted replies as tasks.
- Check the authorized PM sender, approved process, subject, and unique message ID. Keywords alone do not establish approval.
- Split rows on newlines; split each row on `|`; require exactly five ordered labels. Split each field at its label prefix, not at every colon.
- Validate the entire email before creating rows. Missing tokens are allowed where specified. Reject malformed dates, invalid email addresses, reversed dates, and field values that exceed list limits.
- Use a stable import key based on message ID plus canonical row identity. Enforce uniqueness in durable storage. Set Status to Not started.
- In SharePoint, multi-row writes are not a database transaction. Handle partial failure with per-row import keys and retry unfinished rows; mark the message complete only after all rows succeed. The browser demo's all-or-nothing parse validation does not make a cloud flow transactionally atomic.
- Route parse failures and incomplete routing information to the PM; record the original email ID and reason.

Do not create a fresh task on every reminder run. When the same commitment appears in another day's extraction, stable source/action identity and a review-controlled update/merge policy are needed. The demo only deduplicates identical lines inside an email and retries of the same email ID.

## 3. Daily 08:30 → personal Teams reminders

Configure a Recurrence trigger for every day at **08:30**, with the team's local timezone. For a Toronto team select the supported timezone corresponding to Toronto/Eastern time and verify daylight-saving behavior. Compare date-only values in that timezone; do not mix raw UTC timestamps with local dates.

- Get open actions, accounting for pagination and list size.
- Exclude Completed and Cancelled.
- Overdue: DueDate before today.
- To do today: DueDate equals today.
- Upcoming: DueDate after today and on or before today +7 calendar days.
- Do not include later tasks in the next-week reminder.
- Missing DueDate or missing/invalid owner email goes to the PM exception view.
- Group by normalized owner email. Build one message per owner with three urgency sections, action, due date, and status.
- Use Teams **Post a message in a chat or channel**, configured for Flow bot and a direct chat with the owner, where supported in the tenant. Resolve and validate identities before delivery.
- Link to the actual SharePoint list or an owner-filtered view. Verify that the link's permissions match the audience. Request a status update.
- Save a delivery key per date and owner to prevent duplicate successful sends on retry; retry only failures. Teams delivery and storage acknowledgements are not atomic, so plan for ambiguous delivery outcomes.

In the demo, the trigger is a button and the message is a preview. No background scheduler or Teams delivery is running.

## 4. Status change → PM note

Use SharePoint **When an item or a file is modified** and **Get changes for an item or a file (properties only)** with the trigger-window tokens. Version history must be enabled. Continue only if Status changed; editing a due date should not send a status note.

Send the responsible PM a note containing the action, owner, current status, timestamp, and item link. To include the previous status, retrieve the prior version or maintain durable previous-state data; the changed-column flag alone is not the previous value. Use an event key such as item ID + version to avoid repeated notifications. Do not update Status from the notification flow itself, which could cause a loop.

## Suggested acceptance tests in a tenant

PM approval is required; unauthorized sender rejected; delayed/duplicate source handled; malformed row rejected; missing dates preserved; owner identity correct; day+7 included and day+8 excluded; closed tasks suppressed; DST schedule correct; same-message retry safe; partial import recoverable; due-date-only edit causes no status note; actual status change causes one note; Teams delivery failures surface to PM.

## Official references checked October 5, 2026

- [Scheduled Copilot prompts](https://learn.microsoft.com/en-us/microsoft-365/copilot/scheduled-prompts)
- [Email property triggers](https://learn.microsoft.com/en-us/power-automate/email-triggers)
- [Office 365 Outlook connector](https://learn.microsoft.com/en-us/connectors/office365/)
- [SharePoint triggers and change detection](https://learn.microsoft.com/en-us/sharepoint/dev/business-apps/power-automate/sharepoint-connector-actions-triggers)
- [Teams message sender and destination options](https://learn.microsoft.com/en-us/power-automate/teams/send-a-message-in-teams)
