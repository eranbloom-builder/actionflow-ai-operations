# Put this project on GitHub

Suggested repository name: **actionflow-ai-operations**

Suggested description: **Human-reviewed action collection and follow-up: a runnable portfolio reconstruction of a Microsoft 365 AI automation workflow by Eran Bloom.**

Suggested topics: `business-operations`, `revenue-operations`, `ai-automation`, `human-in-the-loop`, `power-automate`, `microsoft-365`, `portfolio`.

## Upload using the website

1. Extract the ZIP. The folder contains the source code, README, prompt, guide, tests, and license.
2. Sign in to your GitHub account and create a repository named `actionflow-ai-operations`. Choose visibility deliberately; Public makes this synthetic portfolio accessible to recruiters, while Private keeps it restricted.
3. Upload the **contents** of `actionflow-portfolio` into the repository root using **Add file → Upload files**. Do not upload only the ZIP or nest everything inside another folder. Ensure `README.md`, `index.html`, and `core.js` are at the root.
4. Commit with: `Add human-reviewed action automation portfolio demo`.
5. Check that `docs`, `prompts`, and `tests` were uploaded. Browser drag-and-drop can omit hidden files: include `.github/workflows/tests.yml` if you want automatic tests, and `.nojekyll` for optional Pages hosting. GitHub Desktop is an alternative that preserves the full folder tree.
6. Add the description and topics in the repository's About panel and pin the repository on your profile.

## Optional: publish the interactive demo

Publishing is separate from creating the repository. Only enable it when ready to make the demo available under your chosen access model; ordinary GitHub Pages is intended here as a public portfolio.

For a repository/plan that supports branch-based Pages publishing:
1. Open repository **Settings → Pages**.
2. Under Build and deployment, select **Deploy from a branch**.
3. Select `main` and `/(root)`, then Save.
4. Wait for the Pages deployment and copy the URL GitHub shows. It generally follows `https://YOUR_USERNAME.github.io/actionflow-ai-operations/`; this is a pattern, not an existing deployment URL.
5. Put that real URL in the repository's About website field and at the top of README. Add the repository URL to your portfolio website and LinkedIn Featured section.

The site uses relative paths, so it works under a GitHub project subpath. It requires no build step, server secrets, or Microsoft connections. The repository remains the source-code evidence; Pages gives visitors the interactive walkthrough. Files are not published automatically by this package.

## Optional command-line upload

Use this only after installing Git and authenticating with GitHub. Create an empty repository first and replace YOUR_USERNAME below. Run these commands in the extracted project folder:

```bash
git init
git add .
git commit -m "Add human-reviewed action automation portfolio demo"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/actionflow-ai-operations.git
git push -u origin main
```

Official instructions: [Upload files](https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository), [Import local code](https://docs.github.com/en/migrations/importing-source-code/using-the-command-line-to-import-source-code/adding-locally-hosted-code-to-github), and [Create a Pages site](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site). Checked October 5, 2026.
