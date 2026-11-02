# Outlinedesk

Outlinedesk is a desktop production planner for animation, VFX and game studios. You lay out sequences, shots and tasks, set which work depends on which, and the app works out dates, progress, the critical path and risks for you. The project is one file on your own computer or shared drive. The app never uploads it.

This repository is where you download Outlinedesk, read the guides and follow releases. The source code is private.

Current version: 1.6.0, a release candidate for Windows and Linux. A Mac version is planned but does not exist yet.

## Download

Get the files from the [Releases page](../../releases).

| System | File | Notes |
|---|---|---|
| Windows 10 and 11, 64-bit | `Outlinedesk-Setup-1.6.0.exe` | Installs for your user only, no administrator rights needed |
| Linux, x86-64 | `Outlinedesk-1.6.0.AppImage` | Make it executable, then run it |

Each release lists a SHA-256 checksum for every file. Compare it with your download before you run it. On Windows, `Get-FileHash .\Outlinedesk-Setup-1.6.0.exe` prints the value.

The installers are not code-signed yet. Windows SmartScreen may say the publisher is unknown. Choose "More info", then "Run anyway". We plan to sign the installers when the project can pay for a certificate.

## What it does

- Four ways to see one plan: a graph, a table, a board and a timeline, plus a status grid with one row per shot and one column per task.
- Dependencies, a working calendar with holiday packs, a critical path, baselines, and dates that move when a duration or dependency changes.
- Custom columns and formulas, paste from Excel, and Excel and CSV import and export.
- Local automation rules such as "when Layout is approved, mark Animation ready", plus checklists and handoffs between departments.
- A Home page with progress, late cards, risks, a forecast and workload per person, and one-click reports.
- Sharing through a folder. Each person writes their own log and the app merges them. It works on a network drive or inside a git or Perforce style sync. Conflicts are listed and nothing is silently overwritten.
- Autosave, versions, backups and a recovery area.
- A Blender add-on. Other tools do not have plugins yet.

Outlinedesk does not store assets, play review video or track time. It links to files and notices when they change.

## Price

Prices are in Indian rupees and stay fixed for the first 12 months after launch. Every plan starts with a free 27-day trial of everything, and the first payment has a 14-day refund.

| Plan | Seats | Per month | Per year |
|---|---|---|---|
| Solo | 1 | 149 | 1,599 |
| Team | up to 8 | 1,999 | 21,999 |
| Studio | up to 25 | 3,999 | 43,999 |
| Large | up to 50 | 7,999 | 87,999 |
| School or lab | up to 100 students | 1,999 | 21,999 |
| Student | 1 | not offered | 299 in the launch year, 649 after |
| Custom | more than 50 | 150 per seat, minimum 9,999 | quote |

Extra seats cost 250 a month on any plan. Email support is free for your first year. After that it is an optional add-on. Customers who start in the first year keep their price for 24 months. Setup help and custom work are priced separately, so ask.

When a plan ends, Outlinedesk becomes read-only. Your projects still open and export, and nothing is deleted. See [how licences work](guides/LICENSING.md).

To buy, email atharva.patil.cg@gmail.com with the plan you want. You pay by UPI and the licence key arrives by email.

## Privacy

Project data stays on your computer. There is no telemetry and no account. The only network use is the optional update check, and you can turn it off in Settings. Your licence key is checked on your own computer, so activation needs no internet.

## Guides

- [Quick start](guides/QUICK_START.md)
- [User guide](guides/USER_GUIDE.md)
- [How licences work](guides/LICENSING.md)
- [Sharing a project with a team](guides/TEAM_FOLDERS.md)
- [Using a git shared folder](guides/GIT_SHARED_FOLDER_WORKFLOW.md)
- [Backups and recovery](guides/RECOVERY.md)
- [Questions and answers](guides/FAQ.md)
- [What works today and what does not](guides/WHAT_IS_REAL_TODAY.md)
- [Release notes](CHANGELOG.md)

The studio deployment kit (a settings policy file, an offline installer bundle, an internal update folder and an IT guide) is not published here. Ask by email and it will be sent.

## Help

Email atharva.patil.cg@gmail.com. Settings, Licence has a "Copy support info" button that prepares a short summary for the message. It contains no project content and never the licence key. To report a security problem, read [SECURITY.md](SECURITY.md).

Website: https://atharvapatil.tech

Outlinedesk is made by Atharva Patil at P4inz Interactive Labs. Copyright P4inz Interactive Labs. All rights reserved.
