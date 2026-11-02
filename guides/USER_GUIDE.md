# Outlinedesk user guide

Outlinedesk is an offline planner for studio pre-production. You build a plan as a graph of nodes (assets, sequences, shots, tasks), connect what depends on what, and watch progress roll up. Everything stays on your computer.

## 1. Getting started

- First launch: pick *Explore a sample project*, *Take the 60-second tour*, or a blank canvas. You can reopen the tour any time from the command palette (`Ctrl/⌘+K` → *Take the tour*).
- Trial: Outlinedesk is fully functional for 27 days. After that Outlinedesk becomes read-only: every project still opens and exports in every format, and editing resumes when you enter a licence key (Settings ▸ License). Your projects are never locked away or deleted.
- Files: a project is one `.desk` file. Outlinedesk autosaves continuously to a private recovery copy, so a crash or power cut never loses work; *Save* (`Ctrl/⌘+S`) writes your file and keeps the previous one as `name.desk.bak`. When you close with unsaved changes Outlinedesk asks gently: *Save / Don't save / Cancel*.

## 2. The canvas

| Do this | To get this |
|---|---|
| Right-click the canvas (or double-click) | Add a node here; type to search the node types |
| `Tab` / `Enter` | Add a child / a sibling of the selected node |
| Drag a node | Move it anywhere (mouse, touch or pen). `Alt` while dragging moves the whole branch; `Shift` locks to an axis |
| Drag from the dot on a node's edge | Link a dependency. Hold `Alt` for a *relates* link, `Shift` for a *flow* link |
| Wheel / pinch | Zoom. Right-drag, middle-drag or `Space`+drag to pan |
| `Shift+1` / `F` | Fit everything / frame the selection |
| `G` | Toggle snap-to-grid (hold `Ctrl/⌘` while dragging to flip it once) |
| `1` `2` `3` `4` | Set status: to do / in progress / blocked / done |
| `L` | Lock or unlock nodes so layouts and drags never move them |
| `Ctrl/⌘+Z` / `Ctrl/⌘+Shift+Z` | Undo / redo (shared with any AI agent) |

Node kinds: cards (the plan: group, asset, sequence, shot, task, milestone), plus notes, text, frames, links and images (PNG, JPEG, WebP, GIF, BMP, AVIF, TIFF, ICO, SVG, drop, paste or use the file browser). Only cards count toward progress. Link kinds: *depends* (must finish first), *relates* (a labelled association), *flow* (an ordered path for presenting).

## 3. Five ways to look at the same plan

- Graph, the canvas.
- Table, sortable, filterable rows with inline editing of type, status, owner and due date. *Columns* adds Actual start, Actual finish, Percent (editable) and Variance against the baseline.
- Board, one column per status of your project; drag a card to another column to change its status.
- Timeline, a Gantt chart of the same plan (see below).
- Grid, the status grid: one row per shot or asset, one column per task (Animation, Lighting, …), each cell coloured by the task's status. See "The status grid" below.

Switch with the control above the canvas, `Alt+1` to `Alt+5` (or `Ctrl`/`⌘` + `1` to `5`), or the single keys `T` (Table), `B` (Board) and `M` (Timeline), press the same key again to return to the Graph.

### The Timeline

Give a card a duration (whole working days) and optionally a start no earlier than date in the inspector's *Schedule* section. Outlinedesk then plans every card: a card starts when everything it depends on has finished, skipping weekends and holidays. Groups span their children; a milestone has duration 0.

- Bars: drag a bar to set its start, drag its right edge to change its duration, `Alt+←/→` nudges a day, `Alt+Shift+←/→` changes the duration. A bar cannot start before its dependencies finish; Outlinedesk says so. Every change can be undone.
- Critical bars (outlined) have no float: any slip delays the finish. Late bars finish after their due date. The flag marks the due date.
- Calendar… sets the working week and holidays. Project start is where the plan begins (until you set it, the plan starts today).
- Baseline: *Save baseline* stores the current dates; later changes show a thin ghost bar so you can see what slipped.
- Actual line: once a card has an actual start, a thin dark line runs over its bar from that day to the actual finish, or to today while the card is open. Hover the bar to read how it stands against the baseline ("Finishes 2 working days late against the baseline").
- Zoom with Day / Week / Month, `Ctrl`/`⌘` + wheel, Fit and Today. The CSV, JSON and Markdown exports and the agent tool `getSchedule` carry the same dates.

## 4. Panels

- Outline (left, `Ctrl/⌘+B`), the tree. Drag rows to reparent.
- Inspector (right, `Ctrl/⌘+J`) with four tabs:
  - Properties, edit the selection; project overview, *Check project* and *Critical path*.
  - Layout, align, distribute, tidy tree, dependency flow layers, grid, radial, swim-lanes, de-overlap. Preview first, then *Apply*; each layout is one undo step.
  - History, every change by name; click a step to jump there. *Versions* keeps named restore points inside your project file (each Save also keeps an automatic one). Restoring saves your current state first, so it is always reversible.
  - Agent, everything an AI agent does, live, with *Undo all agent changes*.

## 5. Getting data in and out

- Import an outline (palette → *Import outline…*): paste indented lists, `-` bullets, numbered lists, `#` headings or `[x]` checklists.
- Import table (CSV): paste rows from Excel or Google Sheets. Needs a `title` column; optional `wbs` (1, 1.1, 1.2.1 builds the hierarchy), `type`, `status`, `owner`, `due`, `tags`, `depends_on`, `notes`. Imports are one undo step and report any rows Outlinedesk had to adjust.
- Export (File menu or palette) has two groups:
  - *For AI & spreadsheets*, CSV (one row per card: outline number, path, status and roll-up status, progress, owner, due, tags, dependencies, what is blocking it, ids; opens in Excel and re-imports; a small column-guide `.md` is saved beside it), JSON (carries its own schema, stats, critical path and validation notes) and Markdown (front-matter, how-to-read note, summary, outline with ids, ready / blocked / overdue lists, critical path, dependencies). Paste any of them into an AI assistant or load them in a script.
  - *Visual*, PNG, SVG, PDF of the whole canvas or just the selection, and interactive HTML: a single offline file you can email, with pan, zoom, search, click-for-details, and open / close of any group (chevron, double-click, ← →, or Collapse / Expand all). Groups you collapsed in Outlinedesk start collapsed.
  *Copy canvas as image* puts a PNG on the clipboard.
- Start from a template: animated short, game feature, motion-graphics spot.

### Files & scenes and the DCC add-ons

Select a card and use Files & scenes in the inspector to attach the files its work lives in (a `.blend`, `.ma`, `.nk`, `.psd`…). Each file can be shown in your file manager, its path copied, or detached. Attached files appear in the CSV, JSON and Markdown exports.

The add-ons in the `integrations` folder bring Outlinedesk into your DCC: they show the task for the open scene and the tasks ready to start, set Start / Blocked / Done, link the open file, add notes, and jump to the card in Outlinedesk. Everything happens over Outlinedesk's local pipe on your computer; Live MCP must be on. Install steps and honest test status: `integrations/README.md`.

## 6. Present mode

Press `P` to step through your *flow* links (or reading order if there are none) one stop at a time: arrows or `Space` to move, `Esc` to leave.

## 7. Live MCP, working with an AI agent

Outlinedesk includes a local-only MCP server (a named pipe or Unix socket, never a network port) protected by a per-session token. Turn it on with the Live MCP button; it shows the config snippet to paste into your MCP client (Claude Desktop, Claude Code, Cursor, …).

An agent can read the plan, create and edit nodes and dependencies, import outlines and tables, arrange layouts, see your current selection, focus a node, take a screenshot of the canvas, and run several edits as one all-or-nothing, single-undo operation. Outlinedesk also exposes `outlinedesk://outline` and `outlinedesk://summary` resources and two ready-made prompts (*plan-breakdown*, *status-report*). Errors come with a code and a hint the agent can act on. Watch it work in the Agent tab and roll everything back with one click if you don't like the result.

## 8. Settings (`Ctrl/⌘+,`)

General (autosave, MCP), Updates (check for a newer version, download it, install it when you choose; it sends only the version and your operating system name), Appearance (light / dark / system, high contrast, reduce motion, panels), Canvas (minimap, grid, smart guides, snapping, drag behaviour, wheel), License, Developer (performance HUD), Shortcuts (rebind lock, snap, frame and present), About (version, what's new, diagnostics, open-source licences).

## 9. Accessibility

Outlinedesk is keyboard-operable end to end, announces selection changes to screen readers, respects your system's reduced-motion setting, and offers a high-contrast mode. Text meets WCAG AA contrast in both themes, and interactive targets are at least 24 px.

## 10. Who makes Outlinedesk, and support

Outlinedesk is made by Atharva Patil, a solo software engineer and founder (P4inz Interactive Labs, Navi Mumbai, India). Settings ▸ About shows the maker, links to the website (atharvapatil.tech), GitHub (github.com/p4inz-code) and LinkedIn (linkedin.com/in/p4inz), and the support address: atharva.patil.cg@gmail.com. Press `S` to open Settings.

### The status grid

Choose Grid in the view switch (`Alt+5`, or "Go to Status grid view" in the command palette). Rows are shots and assets (the *Rows* box also offers shots only, assets only or sequences; the second box limits it to one sequence or group). Columns are the task cards inside them; tasks with the same name line up in one column. Each cell shows the task's status as a tinted cell with the kind glyph and the status name. The row header and the column header show how many tasks are done and the percentage; the line above the grid gives the total. Hover a header for the full count by kind.

Move with the arrow keys, `Home` and `End` (`Ctrl`/`⌘` + `Home` for the first cell); `Enter` or a click opens the card in the graph. A cell with a dash means that shot has no such task.

## 10a. Planning settings for your studio

These are per project and the same for every studio. Open them from Settings (`Ctrl/⌘+,`): Project and Statuses sit right after General, and Working calendar… is in the Timeline, in Settings > Project and in the command palette. AI agents can read and change the same settings.

- Working week and holidays. Monday to Friday by default. In the *Working calendar* dialog choose Monday to Friday, Monday to Saturday, Sunday to Thursday or switch single weekdays on and off. Add a holiday pack by country and years (India, United States, United Kingdom, Germany, France, Canada, Australia). Packs hold national days only, from public rules; the dialog reminds you to check them against your own calendar. For festivals and company closures choose a calendar (.ics) file: Outlinedesk shows how many dates it found (repeating events are skipped) before you add them. Every holiday is listed with a remove button. Nothing changes until you press Save, and Save is one undo step. Dates and the critical path follow the week you choose.
- Statuses. Settings > Statuses. Keep the four built-in ones, choose a preset (Default, Animation, VFX, Game) or build your own list: add, rename, pick a colour from the fixed set, choose the kind and drag the handle (or focus it and press the Up or Down arrow) to reorder. Each status has a kind (not started, in progress, blocked, done); the kind decides progress, what is ready, the critical path and late checks, and gives the glyph its shape. The colour is yours. The list needs at least one status of each kind. Keys `1` to `4` set the first status of each kind. When a status goes away, its cards move to the first status of the same kind; a plain dialog says how many cards move before anything changes, and you can undo it. The Board, Table, graph, outline, timeline, status bar legend, exports and the command palette all follow the list.
- Actual dates and percent. The first time a card goes in progress it gets an actual start; when it becomes done, an actual finish. A date you type is never replaced. The inspector's *Progress and actuals* section shows both dates (pick a date to replace an automatic one, clear it to start again) and an optional percent complete. In Settings > Project, *Roll-up* chooses whether a group's progress counts cards (default) or weighs them by estimated days and typed percent.
- Naming patterns. Settings > Project > Naming. For example `SQ{SEQ:3}_SH{SHOT:4}`: `{N}` or `{SHOT}` count up, `{SEQ}` is a fixed sequence number, `:3` pads with zeros. A live preview shows the next titles. Right-click the canvas or a card and choose *N cards with a pattern…* (or use the command palette) to create up to 500 cards at once; the preview is exactly what is created, and one Undo removes them all.
- Roles. Settings > Project > People and roles. List display names for Editor, Contributor and Viewer, and choose *My role on this computer*. Roles are a convention to organise the work. They do not lock anything: a determined person can always change a plain file, and real protection comes from your sync tool's permissions (repository permissions, workspace protections, file-share rights). A Contributor who adds, deletes, moves or links cards, or changes project settings, is flagged *outside role* in History and Team activity (nothing is blocked). A computer set to Viewer shows a banner and treats the project as read-only until you change the role.

## 11. Troubleshooting

- App closed unexpectedly: reopen Outlinedesk, it offers to restore your unsaved work.
- A file won't open: a `.desk.bak` next to it is the previous save. A damaged file is never overwritten.
- Support: email atharva.patil.cg@gmail.com. Settings ▸ About ▸ *Copy diagnostics* copies version, system info and recent errors (no project content) to paste into your message.
