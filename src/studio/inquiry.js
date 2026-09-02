import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'inquiry',
  title: 'Consultation inquiry',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Full name', type: 'string', readOnly: true }),
    defineField({ name: 'email', title: 'Email', type: 'string', readOnly: true }),
    defineField({ name: 'phone', title: 'Phone', type: 'string', readOnly: true }),
    defineField({
      name: 'interest',
      title: 'Area of interest',
      type: 'string',
      options: {
        list: ['talent', 'realty', 'both', 'other'],
        layout: 'radio',
      },
      readOnly: true,
    }),
    defineField({ name: 'message', title: 'Message', type: 'text', rows: 4, readOnly: true }),
    defineField({ name: 'submittedAt', title: 'Submitted at', type: 'datetime', readOnly: true }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'interest' },
  },
})
