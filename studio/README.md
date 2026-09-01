# Brioso Studio

The admin for properties and journal posts. It is a separate app from the
marketing site so the Studio never ships in the visitor bundle.

## First-time setup

1. Create a project at https://sanity.io/manage (free plan is fine).
2. Copy the project ID it gives you.
3. In the repo root, copy `.env.example` to `.env` and fill in the ID.
4. In this folder, create `.env` with the same ID:

   ```
   SANITY_STUDIO_PROJECT_ID=your-id-here
   SANITY_STUDIO_DATASET=production
   ```

5. Install and run:

   ```
   cd studio
   npm install
   npm run dev          # http://localhost:3333
   ```

6. Under **API → CORS origins** in sanity.io/manage, add the site's URL so the
   published site is allowed to read. Leave "allow credentials" off.

## Publishing the Studio

`npm run deploy` puts it at `https://<name>.sanity.studio` so properties can be
added from any browser, phone included. No hosting to set up.

## Adding a property

New → Property → name, deal type, photo, up to three stats, then Publish.
It appears on the site's board on the next page load. Drafts stay private.
