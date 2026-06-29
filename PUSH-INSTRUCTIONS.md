# Push to GitHub — exact commands

The package is built, committed locally, and ready to push. Three steps total.

## 1. Create the repo on GitHub

In a browser, open https://github.com/new and fill in:

- **Repository name**: `make-kit-comet`
- **Owner**: `slowbot` (your personal account)
- **Visibility**: **Public** (required so jsDelivr-GH can serve files + `npm install github:...` can clone)
- **DO NOT** initialize with README, .gitignore, or LICENSE — we already have those committed locally

Click **Create repository**.

## 2. Push the local repo

In a terminal on this machine (in `/Users/jessejames/Sites/sandbox/make-kit-comet`):

```bash
cd /Users/jessejames/Sites/sandbox/make-kit-comet

# Fix the committer identity to use YOUR git config (the agent committed with a placeholder)
git -c user.name="$(git config --global user.name)" \
    -c user.email="$(git config --global user.email)" \
    commit --amend --no-edit --reset-author

# Add the remote
git remote add origin https://github.com/slowbot/make-kit-comet.git

# Push main
git push -u origin main

# Tag and push v0.1.0
git tag v0.1.0
git push origin v0.1.0
```

## 3. Verify jsDelivr-GH sees the tag

jsDelivr's GitHub mirror picks up new tags within seconds. After pushing, run:

```bash
curl -sI https://cdn.jsdelivr.net/gh/slowbot/make-kit-comet@v0.1.0/templates/vite.config.ts | head -3
curl -sI https://cdn.jsdelivr.net/gh/slowbot/make-kit-comet@v0.1.0/templates/src-styles-index.css | head -3
curl -sI https://cdn.jsdelivr.net/gh/slowbot/make-kit-comet@v0.1.0/templates/App.tsx | head -3
```

All three should return `HTTP/2 200`. If any return 403 / 404, wait ~30s and retry — jsDelivr's first-tag fetch can lag briefly.

## Then tell me

Once the push is done and the three curls all return 200, let me know. I'll:

1. Run a smoke test against the live URL (`npm install github:slowbot/make-kit-comet#v0.1.0` in a fresh test project, confirm the `prepare` script works end-to-end).
2. Confirm the skill `.md` is ready for you to upload to Figma Make.
3. Mark the project complete.

## If something goes wrong

| Problem | Cause | Fix |
|---|---|---|
| `git push` rejected — branch `main` already exists on remote | You initialized the repo with a README on GitHub | Delete the GitHub repo and recreate without any initial files |
| `git push` asks for username/password | You don't have a credential helper / SSH key set up for github.com | Set up a [personal access token](https://github.com/settings/tokens) and paste it as the password, or run `gh auth login` after installing the gh CLI |
| jsDelivr returns 404 after 1+ min | Tag didn't push, OR repo is private | `git push origin v0.1.0` again; verify the repo's visibility is Public on GitHub |
| `prepare` script fails when a consumer runs `npm install github:...` | A devDependency is missing from `package.json` | Open an issue; the package will need a patch release |

## What this push gets you

- Public `https://github.com/slowbot/make-kit-comet` browseable on GitHub
- Tagged release `v0.1.0` that consumers can pin: `npm install github:slowbot/make-kit-comet#v0.1.0`
- jsDelivr-GH URLs that the `/install-simpler-runtime` skill fetches
- A future migration path: when you get npm publish approval, run `npm publish` from the same checkout (the package.json is already set up for it) and update the skill to point at npm registry URLs
