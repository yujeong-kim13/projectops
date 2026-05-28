# ProjectOps Agent Rules

## Completion Gate

For every ProjectOps issue that requests a code change, bug fix, UI change, configuration change, or deployment-impacting change, the issue is not complete until all of the following are done:

1. The change is committed to git.
2. The change is pushed to `origin/main` or merged into `origin/main` from the issue branch.
3. The local deployment at `http://10.200.41.240:8089/` serves the updated files.
4. The deployed URL is verified with a no-cache request or equivalent browser/runtime check.
5. The completion comment includes the commit hash, push target, deployment URL, and verification result.

Do not mark the issue `done` while the fix exists only in an isolated worktree, local branch, uncommitted diff, or unpushed commit.

## Deployment Check

The current ProjectOps preview is served by `projectops.service` from:

`/paperclip/repos/projectops`

After merging to `main`, verify the running service serves the change. For static assets, use a cache-busting URL, for example:

```bash
curl -fsS -H "Cache-Control: no-cache" "http://127.0.0.1:8089/app.js?bust=<commit>"
```

If the browser may have cached old assets, mention a hard refresh or cache-busting URL in the completion comment.

## Ownership

- 기술이사 owns decomposition, review, and final acceptance.
- 백엔드 개발자 owns backend/data/API implementation.
- 프런트엔드개발자 owns UI/frontend implementation.
- 대표이사 does not implement code or deploy; 대표이사 only approves, prioritizes, hires, or delegates.
