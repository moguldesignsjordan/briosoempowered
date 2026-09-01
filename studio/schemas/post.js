import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'post',
  title: 'Journal post',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      description: 'One or two lines. Shown on cards and previews.',
    }),
    defineField({ name: 'cover', title: 'Cover image', type: 'image', options: { hotspot: true } }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      description: 'Posts stay off the site until this is set.',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [{ type: 'block' }, { type: 'image', options: { hotspot: true } }],
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'publishedAt', media: 'cover' },
  },
})
