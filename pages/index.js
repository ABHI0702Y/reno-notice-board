import { useState } from 'react'
import Layout from '../components/Layout'
import NoticeCard from '../components/NoticeCard'
import { prisma } from '../lib/prisma'

export default function HomePage({ notices: initial }) {
  const [notices, setNotices] = useState(initial)

  async function handleDelete(id) {
    const res = await fetch(`/api/notices/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setNotices(prev => prev.filter(n => n.id !== id))
    } else {
      alert('Failed to delete the notice. Please try again.')
    }
  }

  return (
    <Layout>
      {notices.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-gray-400">
          <svg className="w-12 h-12 mb-4 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-lg font-medium text-gray-500">No notices yet</p>
          <p className="text-sm mt-1">Click &ldquo;+ Add Notice&rdquo; to post the first one.</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {notices.map(notice => (
            <NoticeCard key={notice.id} notice={notice} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </Layout>
  )
}

export async function getServerSideProps() {
  const notices = await prisma.notice.findMany({
    orderBy: [{ priority: 'desc' }, { publishDate: 'desc' }],
  })

  return {
    props: {
      notices: notices.map(n => ({
        ...n,
        publishDate: n.publishDate.toISOString(),
        createdAt: n.createdAt.toISOString(),
        updatedAt: n.updatedAt.toISOString(),
      })),
    },
  }
}
