import type { CollectionAfterChangeHook, CollectionConfig, Field } from 'payload'
import { editors } from '../access'

const status: Field = {
  name: 'status',
  type: 'select',
  defaultValue: 'new',
  admin: { position: 'sidebar' },
  options: [
    { label: 'New', value: 'new' },
    { label: 'In progress', value: 'in-progress' },
    { label: 'Resolved', value: 'resolved' },
    { label: 'Spam', value: 'spam' },
  ],
}
const notes: Field = { name: 'internalNotes', type: 'textarea', admin: { position: 'sidebar' } }

const inboxAccess = { read: editors, create: () => false, update: editors, delete: editors }

const esc = (s: unknown) => String(s ?? '').replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' })[c]!)

/** Email the responsible office (or the default inbox) when a new submission arrives */
const notify =
  (label: string, fieldsToShow: string[]): CollectionAfterChangeHook =>
  async ({ doc, operation, req, collection }) => {
    if (operation !== 'create') return doc
    try {
      const settings = await req.payload.findGlobal({ slug: 'site-settings', req, depth: 0 })
      let to: string[] = []
      if (doc.office) {
        const office = await req.payload.findByID({ collection: 'offices', id: doc.office, req, depth: 0 })
        to = (office?.notifyEmails as unknown as string[]) || []
      }
      if (!to.length && settings?.formNotifyEmails) to = settings.formNotifyEmails as unknown as string[]
      const rows = fieldsToShow.map((f) => `<tr><td style="padding:4px 12px 4px 0"><b>${f}</b></td><td>${esc(doc[f])}</td></tr>`).join('')
      const adminUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/admin/collections/${collection.slug}/${doc.id}`
      if (to.length) {
        await req.payload.sendEmail({
          to,
          subject: `[Website] New ${label}: ${doc.name ?? ''}`,
          html: `<h2>New ${label}</h2><table>${rows}</table><p><a href="${adminUrl}">Open in admin panel</a></p>`,
        })
      }
      if (doc.email && doc.referenceNo) {
        await req.payload.sendEmail({
          to: doc.email,
          subject: `आपला अर्ज मिळाला — संदर्भ क्र. ${doc.referenceNo}`,
          html: `<p>नमस्कार ${esc(doc.name)},</p><p>आपली तक्रार / सूचना आम्हाला मिळाली आहे. आपला संदर्भ क्रमांक <b>${doc.referenceNo}</b> आहे. आमची टीम लवकरच आपल्याशी संपर्क साधेल.</p><p>Thank you, we have received your submission. Your reference number is <b>${doc.referenceNo}</b>.</p><p>— रोहन सुभाष देशमुख कार्यालय</p>`,
        })
      }
    } catch (err) {
      req.payload.logger.error({ err, msg: 'Form notification email failed' })
    }
    return doc
  }

export const ContactMessages: CollectionConfig = {
  slug: 'contact-messages',
  labels: { singular: 'Contact message', plural: 'Contact messages' },
  admin: { useAsTitle: 'name', group: 'Inbox', defaultColumns: ['name', 'mobile', 'subject', 'office', 'status', 'createdAt'] },
  access: inboxAccess,
  hooks: { afterChange: [notify('contact message', ['name', 'mobile', 'email', 'subject', 'message'])] },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'mobile', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'subject', type: 'text', required: true },
    { name: 'office', type: 'relationship', relationTo: 'offices' },
    { name: 'message', type: 'textarea' },
    { name: 'attachment', type: 'upload', relationTo: 'form-uploads' },
    status,
    notes,
  ],
}

export const Grievances: CollectionConfig = {
  slug: 'grievances',
  labels: { singular: 'Grievance / Suggestion', plural: 'Grievances / Suggestions' },
  admin: { useAsTitle: 'name', group: 'Inbox', defaultColumns: ['referenceNo', 'name', 'mobile', 'type', 'status', 'createdAt'] },
  access: inboxAccess,
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        if (operation === 'create' && !data.referenceNo) {
          data.referenceNo = `RD-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`
        }
        return data
      },
    ],
    afterChange: [notify('grievance / suggestion', ['referenceNo', 'type', 'name', 'mobile', 'email', 'address', 'issue'])],
  },
  fields: [
    { name: 'referenceNo', type: 'text', admin: { readOnly: true, position: 'sidebar' } },
    { name: 'type', type: 'select', defaultValue: 'grievance', options: [{ label: 'Grievance', value: 'grievance' }, { label: 'Suggestion', value: 'suggestion' }] },
    { name: 'name', type: 'text', required: true },
    { name: 'mobile', type: 'text', required: true },
    { name: 'email', type: 'email' },
    { name: 'address', type: 'textarea', required: true },
    { name: 'issue', type: 'textarea', required: true },
    { name: 'attachment', type: 'upload', relationTo: 'form-uploads' },
    status,
    notes,
  ],
}

export const JobApplications: CollectionConfig = {
  slug: 'job-applications',
  labels: { singular: 'Job application', plural: 'Job applications' },
  admin: { useAsTitle: 'name', group: 'Inbox', defaultColumns: ['name', 'mobile', 'job', 'status', 'createdAt'] },
  access: inboxAccess,
  hooks: { afterChange: [notify('job application', ['name', 'mobile', 'email', 'message'])] },
  fields: [
    { name: 'job', type: 'relationship', relationTo: 'jobs' },
    { name: 'name', type: 'text', required: true },
    { name: 'mobile', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'message', type: 'textarea' },
    { name: 'cv', type: 'upload', relationTo: 'form-uploads' },
    status,
    notes,
  ],
}
