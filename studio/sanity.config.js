import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas'

export default defineConfig({
  name: 'brioso',
  title: 'Brioso Empowered',

  // Same values as VITE_SANITY_PROJECT_ID / VITE_SANITY_DATASET in the site's .env
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || '',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',

  plugins: [structureTool(), visionTool()],
  schema: { types: schemaTypes },
})
