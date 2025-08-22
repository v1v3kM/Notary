Large release assets (advice)

This project contains large binary files that should not be tracked in the main git history.
Files found in repository root:
- `Vy 0.4.0.dmg`
- `Notary Doc.pdf`

Recommended actions
1. Move these files to the repository Releases page on GitHub or to external storage (S3/GCS) and remove them from the repo.
2. If you must remove them from git history, use `git filter-repo` or `git rev-filter` to purge them and then coordinate with all contributors to re-clone.

Quick commands (do not run unless you understand history rewrite):

# Install git-filter-repo (if not installed)
# pip install git-filter-repo

# Example to remove a file from history
# git filter-repo --invert-paths --path "Vy 0.4.0.dmg" --path "Notary Doc.pdf"

After rewrite, force push to origin (coordination required):
# git push --force --all

If you prefer, I can prepare a branch that removes the files (non-destructive: moves them to `releases/` and commits) and then you can choose to rewrite history later.
