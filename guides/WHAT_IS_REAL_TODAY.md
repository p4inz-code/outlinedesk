# What is real today (honest limits)

Works now: planning with dependencies, schedule engine, five views, statuses and actual dates, custom and calculated fields, CSV and Excel import and export, paste from Excel, automation rules, handoffs and approvals, notifications, risk list and forecast, workload, Home dashboard, reports, recovery and backups, team folders on shared storage, licence keys, Windows installer and Linux AppImage, Blender add-on.

Limits you should know:
- Not live editing. Team changes arrive when files sync (seconds on a network drive, minutes with git). Conflicts are listed, never silently overwritten.
- Roles and seats are by convention. The app shows who may do what, but real read-only access comes from the folder or repository permissions.
- No asset storage, review video, time tracking or invoicing.
- Plugins: only the Blender add-on exists. Other DCC tools later.
- Platforms: Windows and Linux. macOS later.
- Installers are not code-signed yet, so Windows may show a SmartScreen warning.
- Excel files: tested against files written by Outlinedesk's own code; if a workbook from your tool fails to import, send it to support.
- Billing is manual (UPI) for now; keys are issued by e-mail after payment.
