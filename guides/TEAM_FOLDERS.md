# Team folders: several people on one project

Team folders let a studio work on one Outlinedesk project together. Everyone opens the same project, changes show up on teammates' screens within a few seconds, and nobody needs a server, an account or an internet connection to Outlinedesk. The only thing everyone needs is a folder they can all open.

This page is for the person who sets it up and for the IT person who has to say yes.

## In one minute

1. The lead opens the project and chooses File, Share with team, then picks a folder on the shared drive.
2. Everyone else installs Outlinedesk and chooses File, Join team project, then picks the same folder and types a name.
3. Work as usual. The status line at the bottom says Saved to the team folder after each change. Small round faces at the top show who is here and which card they are on. Click a face to jump to that card.

Your original project file is never changed by sharing. A copy of it is kept (see "What is in the folder").

## Set up (the lead)

1. Open the project you want to share. Save it first if you want a copy of the file kept with the team folder.
2. Choose File, Share with team. A folder browser opens. Choose the folder on your file server, a mapped drive, or a synced folder your studio already uses.
3. If the folder you choose already holds files, Outlinedesk makes a new folder inside it, named after the project with `.team` at the end. If it is empty, it is used as it is.
4. A dialog says in plain words what will be created and that your original file stays untouched. Type the name teammates should see and press Share.
5. Tell your team which folder to join.

You can see who has joined, remove computers you no longer use from the seat count, change how often Outlinedesk looks for changes, and export a normal file at any time in Settings, Team.

## Join (everyone else)

1. Choose File, Join team project and pick the team folder (or the folder that contains it).
2. Type your name, as teammates should see it. The default is "Someone".
3. The project opens. Your changes are saved to the team folder as you work and this computer keeps its own copy. The project appears in File, Open recent with the word team, and opens again without asking.

Outlinedesk never shows your Windows, macOS or Linux user name or the name of your computer to teammates. A teammate sees only the name you typed.

## Day to day

- Who is here. Round faces with initials. Hover for the name and card. Click to select that card on your canvas.
- Status line (bottom left). It says one of:
  - Saved to the team folder
  - Saved on this computer, waiting for the team folder
  - Team folder not reachable (retrying)
  - Waiting for your sync tool (see the sync tool section)
  - and, for a few seconds, how many changes from teammates were applied.
  Click it for details: the folder, the time of the last sync, how long the last check took, how often it checks, and any problems in plain language.
- Undo undoes your own last change. It never undoes a teammate's work.
- History (inspector) shows a Team activity list with the name of the person who made each change.
- Dragging and typing. Changes from teammates wait while you drag a card or type in a field, and arrive when you let go.

## What a conflict looks like

Two people changed the same thing at the same moment, for example both set a different due date on one card. Outlinedesk shows one value to everyone, the same on every computer, and keeps the other. The status line says "1 conflict", and File, Team conflicts (or the status line) opens a list:

> Alice also changed the due date of "Shot 12". Showing yours: 2026-10-20. The other: 2026-10-22.
> Keep yours, or take Alice's.

One click settles it. Your choice is saved as a new change that every computer sees, and the conflict disappears for everyone. Nothing is ever lost silently: both values stay visible until someone chooses.

Other cases are handled the same way every time and listed so nobody is surprised: a card edited after a teammate deleted it is kept, a card moved into its own children goes to the top level, and a link that would close a circle is left out.

## When the folder is not there

If the network drops, the laptop sleeps or the drive is unmounted, keep working. Changes are saved on this computer first. The status line says "Team folder not reachable (retrying)" and, once the folder is back, your changes are sent and teammates' changes arrive. Nothing needs to be done.

Opening a team project while the folder is away is not possible yet: Outlinedesk needs the folder to build the project the first time it is opened in a session.

## Requirements (for IT)

- A folder that every team member can read and write, reached through a normal path: a mapped drive letter on Windows, a mounted share on macOS or Linux. Outlinedesk does not accept `\\server\share` style paths (a deliberate safety rule that stops Windows from signing in to a server by accident). Map the share to a drive letter instead.
- SMB or NFS file share on a NAS or file server. Read and write for team members. Read only for people who should only look (the app then opens the project read-only).
- Remote people reach the same folder through the studio's VPN or a sync tool. Do not expose a raw SMB share to the internet.
- Latency. Under about 100 ms is comfortable. Changes arrive every 1 to 10 seconds depending on settings. Outlinedesk looks at the folder in the background and never freezes the window if the share is slow.
- Bandwidth. Tiny. The files are plain text, one line per change. A busy day for 20 people is a few megabytes at most.
- Not inside Dropbox, OneDrive or iCloud folders that create "conflicted copy" files, unless the studio accepts that Outlinedesk ignores and reports such copies. Use a sync tool that does not rename files.
- Backups. Include the team folder in the normal NAS backups or snapshots. Every computer also keeps its own copy of every change it made (in Outlinedesk's data folder), and Settings, Team can re-publish a damaged log from that copy.
- Write access of the app. Outlinedesk writes only inside the team folder it creates or joins: its own log file, a small presence file, and (for the lead) a members file. It never deletes or renames a file that someone else wrote.
- Computers. Up to 64 computers per team folder.
- No network code. Outlinedesk only reads and writes files. Moving them between computers is the job of the file server or your sync tool.

### Using an SMB or NFS share

Create a folder for the show, give the team read and write access, map it on each computer, and use Share with team and Join team project as above. Leave "Who is here" on Automatic (small presence files in the folder) and "Check for teammates' changes" on Automatic. Turn on the server's own snapshots for the folder before the first real use.

## Using a git or Perforce-style sync tool

Outlinedesk does not care how the files travel. It never starts git or any other program and never asks one for its state. If your studio moves files with git (with or without git LFS), Perforce, Syncthing or OneDrive, the team folder lives inside the working copy and your tool moves it.

How to work safely:

1. Pull before you start, then open the project in Outlinedesk.
2. Commit and submit your own log file often. Your changes live in one file with your computer's id in the name, under `epoch-0001/logs/`. Outlinedesk counts how many changes you made since you last pressed I submitted my changes (in the connection details or Settings, Team) and reminds you after 20 changes or 30 minutes.
3. Never edit another person's log file. Each person owns exactly one log file, so two people never change the same file and there is nothing to merge.
4. Add the folder to your sync rules. The folder holds a `.gitattributes` that turns off line-ending conversion and sets `merge=union` for logs, and a `.gitignore` that keeps presence files and temporary files out of commits. Outlinedesk also accepts logs whose line ends were converted by git or that start with a byte order mark.
5. Presence in sync-tool mode. When a `.git` folder is found above the team folder, Outlinedesk suggests Sync tool mode: no heartbeat files are written (they would only create commits) and "who is here" means who wrote a change in the last five minutes. You can switch the mode in Settings, Team.
6. How often it looks. Pulls arrive in bursts, so in Settings, Team you can set the check to every 2, 10, 30 or 60 seconds, or only when you press Refresh.
7. The original file. Inside a git working copy the copy of your original project file is saved next to the team folder, in a folder named `<team folder>-original`, so the repository stays small. Commit it only if you want to.
8. Never delete or rename files other people may have pulled. Outlinedesk does not.
9. If nothing from teammates arrives for a long time, the status line says "Waiting for your sync tool".

## Seats (studio plans)

A seat is one computer that worked on the project in the last 30 days. The lead sees a banner when more computers are in use than the key allows ("7 of 5 seats in use"). It is a reminder: nothing is locked and nothing is deleted. A lost or reinstalled computer can be removed from the count in Settings, Team, Remove from seats. That frees the seat; the person's changes stay in the project.

## Backups, repair and leaving

- Export to a single file (File menu, or Settings, Team) writes a normal `.desk` file from the project as it is now. The team project goes on unchanged. This is also a good weekly backup.
- Damaged or missing log. If a teammate's file is damaged, the connection details say so in plain words, and everyone else keeps working. The owner of that log presses Re-publish my changes to rewrite it from the copy on their computer. Check again makes every computer read everything once more.
- Leave team project (File menu or Settings, Team). Everything you did is already in the team folder. This computer keeps a copy as a normal project that you can save as a `.desk` file. You can join again at any time.

## What is in the folder

```
Show.team/
  team.json               name and id of the project (written once)
  .gitattributes          sync tool rules (no conversion, union merge for logs)
  .gitignore              keeps presence and temp files out of commits
  epoch-0001/logs/
    base.log              the project as it was when it was shared
    <computer id>.log     one file per computer, only that computer writes it
  presence/<id>.json      who is here (file presence mode only)
  members.json            computers the lead removed from the seat count
  original/               a copy of the project file that was shared
  recovery/               reserved for repairs
```

Everything is text. Every change is one line with a checksum.

## Limits of this release

- Images added to cards are not shared yet; the card text, links, dates, notes and layout are.
- Roles are by convention. A shared folder cannot stop someone who can write to it from changing things; use the file server's permissions for read-only access.
- Compaction of very long histories comes later. Outlinedesk warns when the history is getting large.
- A team folder reached through a UNC path is not supported (see Requirements).
- Open the team folder at least once while it is reachable before working offline.
