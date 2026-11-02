# Recovery and backup

What Outlinedesk keeps for you, where it is, and how to bring it back. Everything is on this computer; nothing is sent anywhere. The page is in Settings, under Recovery and backup.

## What is protected

- While you work: every change goes to a private recovery copy in the data folder. After a crash or power cut, Outlinedesk offers to restore it at the next start.
- When you save: the new file is written beside the old one, read back and checked against your project, and only then swapped in. The previous version stays next to the file as `name.desk.bak` (then `.bak.1`, `.bak.2`; Settings > Advanced sets how many).
- Before risky changes: Outlinedesk keeps the earlier state before a large change by an AI agent (25 cards or more), before an import of a table or an outline, before a merge, a reload of someone else's version, a review import, and before a file made by an older version is upgraded (the original stays beside the file as `name.desk.pre-v2` or `.pre-m1`). The first group are saved versions inside the project: look for names starting with "Before" in the version list.
- Second backup folder (optional): a copy of each saved file in a folder you choose, for example on an external drive.

Not protected: files you delete yourself, a drive that fails, a project you never saved. Keep a full archive somewhere other than this computer.

## Look inside a backup and restore it

The list shows backups next to your file, copies in the second folder, and unsaved work from earlier sessions, each with its date, size and card count, and whether it passes its integrity check. Preview shows what is inside. Restore as new file asks for a folder and writes a new file there. It never replaces your project or any other file: if the name is taken, a number is added. Open the new file with File > Open.

## Check this file, repair from backup

Check this file now reads the saved file from start to finish and compares every card, link, image and saved version with the checksum written when it was saved. If it finds damage, Repair from backup opens the newest intact backup as an unsaved project. Your damaged file is not touched until you save; then it is kept beside the project as `name.desk.corrupt-<time>`. Repair is refused while you have unsaved changes (they would be replaced); save first. If the project in the window is fine and only the file on disk is damaged, a normal save writes a fresh, verified file.

## Second backup folder

After every successful save the file is copied into the folder, read back and compared by SHA-256, and a small `.sha256` file is written beside it. Only the newest 3, 5, 10 or 20 copies are kept (your choice); only files Outlinedesk made there are ever removed. A slow, missing or full drive never delays your save: the problem shows as a status on the page, with no dialogs. Notes:

- Outlinedesk never creates the folder, so an unplugged drive cannot turn into an ordinary folder on your system disk.
- Network paths like `\\server\share` are not supported (they could trigger a network sign-in). Use a mapped drive letter or a mounted folder.
- It must be a different folder from the one your project is in.

## Full archive

Save a full archive writes one `.zip` with the project file, every image as the original file, every saved version as JSON, a README and `manifest.json` listing each file with its SHA-256. It is verified before it gets its name, never replaces an existing file, and opens in any unzip tool. Check an archive verifies one later (missing, extra or changed files, damaged data, or an edited manifest are reported). It does not include the older backups next to your file.

## Remove recovery copies

Recovery copies can hold your titles and notes. Remove recovery copies overwrites each of Outlinedesk's own recovery files with random data and then deletes it. It never touches your projects, their backups, the second folder, or the project you have open. The overwrite is best effort: on solid-state drives, journaling or cloud-synced folders, and in disk snapshots, old data can survive elsewhere, so this lowers the risk but is not a guarantee. For a firm guarantee, use full-disk encryption.

## For developers

