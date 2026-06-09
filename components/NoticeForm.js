import { useState } from 'react'
import { useRouter } from 'next/router'

export default function NoticeForm({ initial = {} }) {
  const router = useRouter()
  const isEditing = !!initial.id

  const [form, setForm] = useState({
    title:       initial.title       ?? '',
    body:        initial.body        ?? '',
    category:    initial.category    ?? 'General',
    priority:    initial.priority    ?? 'Normal',
    publishDate: initial.publishDate
      ? new Date(initial.publishDate).toISOString().split('T')[0]
      : '',
    imageUrl: initial.imageUrl ?? '',
  })
  const [errors,     setErrors]     = useState({})
  const [submitting, setSubmitting] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: undefined }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setErrors({})

    try {
      const url    = isEditing ? `/api/notices/${initial.id}` : '/api/notices'
      const method = isEditing ? 'PUT' : 'POST'

      const res  = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(form),
      })
      const data = await res.json()

      if (!res.ok) {
        setErrors(data.errors ?? { general: data.error ?? 'Something went wrong' })
        return
      }

      router.push('/')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {errors.general && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
          {errors.general}
        </div>
      )}

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="e.g. Mid-semester exam schedule"
          className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.title ? 'border-red-400 bg-red-50' : 'border-gray-300'
          }`}
        />
        {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
      </div>

      {/* Body */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Body <span className="text-red-500">*</span>
        </label>
        <textarea
          name="body"
          value={form.body}
          onChange={handleChange}
          rows={5}
          placeholder="Full notice content..."
          className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
            errors.body ? 'border-red-400 bg-red-50' : 'border-gray-300'
          }`}
        />
        {errors.body && <p className="mt-1 text-xs text-red-500">{errors.body}</p>}
      </div>

      {/* Category + Priority */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="General">General</option>
            <option value="Exam">Exam</option>
            <option value="Event">Event</option>
          </select>
          {errors.category && <p className="mt-1 text-xs text-red-500">{errors.category}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
          <select
            name="priority"
            value={form.priority}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="Normal">Normal</option>
            <option value="Urgent">Urgent</option>
          </select>
          {errors.priority && <p className="mt-1 text-xs text-red-500">{errors.priority}</p>}
        </div>
      </div>

      {/* Publish Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Publish Date <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          name="publishDate"
          value={form.publishDate}
          onChange={handleChange}
          className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.publishDate ? 'border-red-400 bg-red-50' : 'border-gray-300'
          }`}
        />
        {errors.publishDate && <p className="mt-1 text-xs text-red-500">{errors.publishDate}</p>}
      </div>

      {/* Image URL (bonus) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Image URL{' '}
          <span className="text-gray-400 text-xs font-normal">(optional)</span>
        </label>
        <input
          type="url"
          name="imageUrl"
          value={form.imageUrl}
          onChange={handleChange}
          placeholder="https://example.com/image.jpg"
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white px-5 py-2 rounded-md text-sm font-medium transition-colors"
        >
          {submitting ? 'Saving...' : isEditing ? 'Update Notice' : 'Create Notice'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/')}
          disabled={submitting}
          className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-5 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
