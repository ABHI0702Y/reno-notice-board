import { useRouter } from 'next/router'

const CATEGORY_STYLES = {
  Exam:    'bg-purple-100 text-purple-700',
  Event:   'bg-green-100  text-green-700',
  General: 'bg-gray-100   text-gray-600',
}

export default function NoticeCard({ notice, onDelete }) {
  const router = useRouter()

  const publishDate = new Date(notice.publishDate).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  function handleDelete() {
    if (window.confirm(`Delete "${notice.title}"?\n\nThis action cannot be undone.`)) {
      onDelete(notice.id)
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
      {notice.imageUrl && (
        <div className="aspect-video w-full overflow-hidden bg-gray-100">
          <img
            src={notice.imageUrl}
            alt={notice.title}
            className="w-full h-full object-cover"
            onError={e => { e.currentTarget.parentElement.style.display = 'none' }}
          />
        </div>
      )}

      <div className="p-4 flex flex-col flex-1">
        <div className="flex flex-wrap gap-1.5 mb-3">
          {notice.priority === 'Urgent' && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200">
              Urgent
            </span>
          )}
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${CATEGORY_STYLES[notice.category]}`}>
            {notice.category}
          </span>
        </div>

        <h3 className="font-semibold text-gray-900 mb-1.5 line-clamp-2 leading-snug">
          {notice.title}
        </h3>

        <p className="text-sm text-gray-600 line-clamp-3 flex-1 leading-relaxed">
          {notice.body}
        </p>

        <p className="text-xs text-gray-400 mt-3 flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {publishDate}
        </p>

        <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
          <button
            onClick={() => router.push(`/edit/${notice.id}`)}
            className="flex-1 text-center border border-blue-200 text-blue-600 hover:bg-blue-50 text-sm py-1.5 rounded-md transition-colors font-medium"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="flex-1 text-center border border-red-200 text-red-600 hover:bg-red-50 text-sm py-1.5 rounded-md transition-colors font-medium"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
