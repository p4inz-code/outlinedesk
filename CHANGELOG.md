# Release notes

## 1.6.0, release candidate, 2 November 2026

This is the first build meant for outside testers. It runs on Windows 10 and 11 and on Linux (AppImage).

New in this release:
- Custom fields and formulas. You can add your own columns (text, number, date, list, person, checkbox, link) and calculated ones that work from a card's values or roll up from the cards below it.
- Excel import and export, paste of a range copied from Excel into the Table, and a column chooser with frozen columns.
- Local automation rules, checklists, handoffs and approvals, and notifications inside the app.
- A risk list (late, blocked, overloaded, no owner, no estimate) with one-click fixes, a forecast, workload per person and a Home dashboard.
- Team folders. Several people can work on one project through a shared folder or a git style sync. Each person writes their own log and the app merges them.
- Custom statuses with kinds, a working calendar with holiday packs, a status grid and saved views.
- A recovery area, backups to a second folder, and checks that a saved file is complete.
- Updates from a signed release feed, and a policy file for studios that deploy to many computers.
- A new licence price sheet (see the README), a Tester licence for the admin team, and a custom Windows installer.

Fixed while testing the finished build:
- The Import dialog failed to open.
- A checklist item did not appear until you clicked away from the field.
- Saving a view under an existing name replaced the old view without asking. It now refuses and keeps your input.
- Several dialogs had no inner padding, and the Home dialog ran past the window edge.
- Some controls were smaller than 24 pixels.

Known limits: team changes arrive when files sync, not live. Roles are by convention. The installers are not code-signed. There is no Mac version. See [what works today](guides/WHAT_IS_REAL_TODAY.md).

## Earlier versions

- 1.5.0, 6 October 2026: timeline view, safer shared folders, a hardened file format and offline review.
- 1.4.0, 5 October 2026: folder watching, Houdini support, a verified Blender add-on and the website.
- 1.3.0, 5 October 2026: licence plans, read-only mode and the first key generator.
- 1.2.0, 4 October 2026: design pass and a richer tour.
- 1.1.0, 4 October 2026: export, onboarding and accessibility work.
- 1.0.0, 1 October 2026: the first complete version.
