import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'property',
  title: 'Property',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Property name',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'tag',
      title: 'Deal type',
      type: 'string',
      options: {
        list: ['Acquisition', 'Disposition', 'Development', 'Advisory', 'Rental'],
        layout: 'radio',
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'photo',
      title: 'Photo',
      type: 'image',
      options: { hotspot: true },
      description: 'Landscape shots read best. Cards crop to fill.',
    }),
    defineField({
      name: 'size',
      title: 'Card size',
      type: 'string',
      description: 'How much room the card takes on the board.',
      options: {
        list: [
          { title: 'Standard', value: '' },
          { title: 'Wide (two columns)', value: 'wide' },
          { title: 'Tall (two rows)', value: 'tall' },
        ],
        layout: 'radio',
      },
      initialValue: '',
    }),
    defineField({
      name: 'meta',
      title: 'Stats',
      description: 'Up to three. Shown along the bottom of the card.',
      type: 'array',
      validation: (r) => r.max(3),
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', title: 'Label', type: 'string' },
            { name: 'value', title: 'Value', type: 'string' },
          ],
          preview: {
            select: { title: 'label', subtitle: 'value' },
          },
        },
      ],
    }),
    defineField({
      name: 'order',
      title: 'Sort order',
      type: 'number',
      description: 'Lower numbers come first. Leave blank to fall back to newest.',
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'tag', media: 'photo' },
  },
})
