# Working with Outlinedesk in a git shared folder

One page for artists and leads. The same steps work with your git client, with any git client that can fetch and commit a chosen folder, and with a git server such as Gitea. Outlinedesk never runs git, never talks to a git server and never reads your git login. It reads and writes one folder of small text files; your git tool moves them.

## What lives where

- The studio repository holds a planner folder, for example `Planner/`, created from the studio folder's `team/` skeleton (ask by email for the studio kit).
- Inside it, Outlinedesk makes one `<Project>.team` folder per shared project: `team.json`, `base.log`, one `<id>.log` per person, a `presence/` folder and a few helper files.
- Heavy files (images, video, scenes) belong in git LFS. The planner folder does not: it is plain text and stays out of LFS. The `.gitattributes` and `.gitignore` in the skeleton already say so.

## One-time setup (lead)

1. Create the repository (or use the studio's existing one) and make sure everyone has access to the planner path.
2. In your git client, include the `Planner/` folder in the set of folders you keep up to date, and pin it if the client can: it must always be fetched, and a refresh or revert of other files must never remove it.
3. In Outlinedesk, open the project, choose File, Share with team, pick `Planner/`, give the project a name and press Share.
4. Commit that folder with the one-step "submit everything under this folder" action your client offers, with a short saved message such as "planner update".

## One-time setup (everyone else)

1. Get the latest of `Planner/` and make sure the `<Project>.team` folder is on your disk.
2. In Outlinedesk, choose File, Join team project, pick that folder and type your name.

## Every day

1. Start of day: get the latest of `Planner/` first, then open Outlinedesk. New files from teammates (new log files, new projects) must arrive too; if your client only updates files it already knows, use its "get latest for this folder" action.
2. During the day: work normally. Changes appear in the shared files as you go. Teammates see them after your next submit and their next fetch.
3. Often (every hour, and before you leave): submit everything under `Planner/`. Two people submitting different files at the same time is normal and safe: each person writes only their own log file, so git never has to merge a file two people changed. If the push is rejected because a teammate was first, fetch, then submit again; nothing is lost.
4. Offline or VPN down: keep working. Outlinedesk keeps its own copy of everything you wrote. When the connection is back, fetch, then submit.

## Rules that keep it safe

- Do not edit, rename or delete files inside a `.team` folder by hand, and do not revert a teammate's file. Revert only your own, and only when you mean to.
- Do not let your client convert line endings or put these files under LFS.
- Do not copy a `.team` folder to make a "backup" and open both. Use File, Export a normal file in Outlinedesk instead.
- If your own log looks lost after a revert or a failed pull, Outlinedesk's "Re-publish my log" puts it back from your computer.

## What the git tool must be able to do

These are the points a studio should confirm with its git client or server before relying on the workflow:

1. Fetch a folder including files that teammates created later.
2. Keep a pinned folder from being removed by refresh, revert or other actions.
3. Submit a whole folder in one action with a saved message.
4. Fetch, integrate and push again automatically when a push is rejected, without touching anyone's local files, and say plainly when it cannot.
5. Leave plain text files alone: no locking, no LFS conversion, no line-ending rewriting, no automatic `.gitattributes` edits.
6. Accept the names Outlinedesk uses: `.team` folders, `base.log`, `team.json`, hex-named `<id>.log` files, `.gitattributes`, `.gitignore`.
7. Stay quick with a small, frequently changing folder.
8. Report network failures honestly and keep local files.

If one of these is missing in your tool, keep the planner folder on a plain shared drive instead ([TEAM_FOLDERS](TEAM_FOLDERS.md)), and use git for the heavy files only.

## Check it works (15 minutes, two computers)

Share a project, join it from the second computer, make 20 edits on each within the same minute, submit on both, fetch on both, and compare the plans: they must be identical. Then close Outlinedesk in the middle of an edit and reopen it, and cut the connection for a few minutes and reconnect. No change may be lost.
