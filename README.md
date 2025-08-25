🚀 Deployment (Standard Operating Procedure)

This project is deployed automatically to GitHub Pages whenever changes are pushed to the main branch.

✅ How it works

Our build system is Vite + React + TypeScript.

A GitHub Actions workflow (.github/workflows/deploy.yml) builds the project and publishes the contents of the dist/ folder to the gh-pages branch.

GitHub Pages serves the site from gh-pages at:

https://arcjedi.github.io/iLogicCTF/

📄 Workflow file

Located at .github/workflows/deploy.yml:

name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: write
  pages: write
  id-token: write

jobs:
  build-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install dependencies
        run: npm ci

      - name: Build project
        run: npm run build

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist

📝 Commit convention

When adding or updating the workflow, always use one of these commit messages:

First time:

ci: add GitHub Pages deploy workflow


Updates:

ci: update GitHub Pages deploy workflow

🔄 How to trigger a redeploy

Push any commit to main (code change or doc update).

Or add a small static file (e.g., trigger.yml) with a commit message like:

chore: trigger redeploy

🕒 First-time deploys

The very first deploy may take 5–10 minutes to propagate.

After that, redeploys are usually instant.


































# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/37d9e0e6-4607-49a8-b021-29cdf396dfee

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**
Simply visit the [Lovable Project](https://lovable.dev/projects/37d9e0e6-4607-49a8-b021-29cdf396dfee) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.


The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/37d9e0e6-4607-49a8-b021-29cdf396dfee) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
