import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import property from './property'
import post from './post'
import inquiry from './inquiry'

/* The manager lives at /manage on this site. Sanity handles the login, so no
   write token is ever shipped to the browser: whoever is signed in writes as
   themselves, and everyone else just gets the login screen. */
export const studioConfig = defineConfig({
  name: 'brioso',
  title: 'Brioso Empowered',
  basePath: '/manage',

  projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
  dataset: import.meta.env.VITE_SANITY_DATASET || 'production',

  plugins: [structureTool()],
  schema: { types: [property, post, inquiry] },
})
