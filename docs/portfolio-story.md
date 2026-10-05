# How to explain this project

## Project summary

I designed an action-item collection and follow-up workflow using Microsoft Copilot, Power Automate, SharePoint, Outlook, and Teams. A scheduled Copilot prompt consolidated commitments from daily conversations into a strict five-field format. The PM reviewed and corrected the output, then sent an approved email that fed the action register. A daily 08:30 flow sent each owner a personal reminder organized into overdue, due today, and upcoming actions. Status changes notified the PM.

This repository reconstructs that workflow using synthetic data because I no longer have access to the original Microsoft environment. The interactive demo shows the review, structured handoff, reminder rules, and change notifications. The AI collection step is a clearly labeled sample replay, supported by the reconstructed prompt.

## Interview explanation

The key challenge was making an AI-generated list dependable enough to feed automation. I treated the output format as an interface: Action, Owner, Start date, End date, and Owner's email address in a fixed order. Missing details were explicit rather than guessed. The PM remained responsible for reviewing the list before it entered the shared register.

That review step made the workflow practical for business users. Once the approved list was in SharePoint, deterministic flows handled reminders and status-change notifications. The portfolio demo makes those design choices visible without needing access to a former employer's systems.

## Suggested LinkedIn Featured description

ActionFlow: a human-reviewed action collection and follow-up workflow. Explore an interactive reconstruction of my Microsoft 365 automation design, including a structured AI-to-automation handoff, owner-specific reminders, and PM status notifications. Synthetic data; original tenant integrations are documented rather than connected.

## What to claim accurately

- Designed and implemented the original Microsoft workflow, as described by Eran Bloom.
- Used AI-assisted collection with human review before downstream automation.
- Standardized the data contract feeding the action register.
- Coordinated owner follow-up and manager visibility.
- Reconstructed the workflow as a tested, portable portfolio demonstration with AI coding assistance.

Do not describe the fixture replay as a live AI model, the browser register as a live SharePoint connection, or message previews as delivered Teams messages. Add verified impact metrics only if available from your own records; this project does not invent them.
