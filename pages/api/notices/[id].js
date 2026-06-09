import { prisma } from '../../../lib/prisma'

const VALID_CATEGORIES = ['Exam', 'Event', 'General']
const VALID_PRIORITIES = ['Normal', 'Urgent']

function validate({ title, body, category, priority, publishDate }) {
  const errors = {}

  if (!title || !title.trim()) {
    errors.title = 'Title is required'
  } else if (title.trim().length > 255) {
    errors.title = 'Title must be 255 characters or fewer'
  }

  if (!body || !body.trim()) {
    errors.body = 'Body is required'
  }

  if (!publishDate) {
    errors.publishDate = 'Publish date is required'
  } else {
    const d = new Date(publishDate)
    if (isNaN(d.getTime())) errors.publishDate = 'Publish date must be a valid date'
  }

  if (category && !VALID_CATEGORIES.includes(category)) {
    errors.category = `Category must be one of: ${VALID_CATEGORIES.join(', ')}`
  }

  if (priority && !VALID_PRIORITIES.includes(priority)) {
    errors.priority = `Priority must be one of: ${VALID_PRIORITIES.join(', ')}`
  }

  return errors
}

export default async function handler(req, res) {
  const id = parseInt(req.query.id)
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid notice ID' })
  }

  if (req.method === 'GET') {
    try {
      const notice = await prisma.notice.findUnique({ where: { id } })
      if (!notice) return res.status(404).json({ error: 'Notice not found' })
      return res.status(200).json(notice)
    } catch {
      return res.status(500).json({ error: 'Failed to fetch notice' })
    }
  }

  if (req.method === 'PUT') {
    const {
      title,
      body,
      category = 'General',
      priority = 'Normal',
      publishDate,
      imageUrl,
    } = req.body ?? {}

    const errors = validate({ title, body, category, priority, publishDate })
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors })
    }

    try {
      const notice = await prisma.notice.update({
        where: { id },
        data: {
          title: title.trim(),
          body: body.trim(),
          category,
          priority,
          publishDate: new Date(publishDate),
          imageUrl: imageUrl?.trim() || null,
        },
      })
      return res.status(200).json(notice)
    } catch (err) {
      if (err.code === 'P2025') return res.status(404).json({ error: 'Notice not found' })
      return res.status(500).json({ error: 'Failed to update notice' })
    }
  }

  if (req.method === 'DELETE') {
    try {
      await prisma.notice.delete({ where: { id } })
      return res.status(200).json({ message: 'Notice deleted' })
    } catch (err) {
      if (err.code === 'P2025') return res.status(404).json({ error: 'Notice not found' })
      return res.status(500).json({ error: 'Failed to delete notice' })
    }
  }

  res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
  return res.status(405).json({ error: `Method ${req.method} not allowed` })
}
