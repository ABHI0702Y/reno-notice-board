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
  if (req.method === 'GET') {
    try {
      const notices = await prisma.notice.findMany({
        orderBy: [{ priority: 'desc' }, { publishDate: 'desc' }],
      })
      return res.status(200).json(notices)
    } catch {
      return res.status(500).json({ error: 'Failed to fetch notices' })
    }
  }

  if (req.method === 'POST') {
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
      const notice = await prisma.notice.create({
        data: {
          title: title.trim(),
          body: body.trim(),
          category,
          priority,
          publishDate: new Date(publishDate),
          imageUrl: imageUrl?.trim() || null,
        },
      })
      return res.status(201).json(notice)
    } catch {
      return res.status(500).json({ error: 'Failed to create notice' })
    }
  }

  res.setHeader('Allow', ['GET', 'POST'])
  return res.status(405).json({ error: `Method ${req.method} not allowed` })
}
