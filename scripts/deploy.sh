#!/usr/bin/env bash
# Publish the built site to the gh-pages branch.
#
# Uses a throwaway git worktree rather than switching branches in place, so a
# deploy can never leave build output sitting in the source tree.
set -euo pipefail

BRANCH=gh-pages
WORKTREE=.deploy

npm run build

rm -rf "$WORKTREE"
git worktree prune
git worktree add -f "$WORKTREE" "$BRANCH"

# Replace the published tree wholesale, so removed files actually disappear.
find "$WORKTREE" -mindepth 1 -maxdepth 1 ! -name '.git' -exec rm -rf {} +
cp -R dist/. "$WORKTREE"/
# Stop Pages running the output through Jekyll, which eats files like _redirects.
touch "$WORKTREE/.nojekyll"

git -C "$WORKTREE" add -A
if git -C "$WORKTREE" diff --cached --quiet; then
  echo "No change to publish."
else
  git -C "$WORKTREE" commit -q -m "Deploy build"
  git -C "$WORKTREE" push -q origin "$BRANCH"
  echo "Published."
fi

git worktree remove --force "$WORKTREE"
