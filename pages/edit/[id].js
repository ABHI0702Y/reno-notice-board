import { prisma } from '../../lib/prisma'
import Layout from '../../components/Layout'
import NoticeForm from '../../components/NoticeForm'

export default function EditPage({ notice }) {
  return (
    <Layout title="Edit Notice">
      <div className="max-w-xl mx-auto">
        <h1 className="text-xl font-semibold text-gray-900 mb-6">Edit Notice</h1>
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <NoticeForm initial={notice} />
        </div>
      </div>
    </Layout>
  )
}

export async function getServerSideProps({ params }) {
  const id = parseInt(params.id)
  if (isNaN(id)) return { notFound: true }

  const notice = await prisma.notice.findUnique({ where: { id } })
  if (!notice) return { notFound: true }

  return {
    props: {
      notice: {
        ...notice,
        publishDate: notice.publishDate.toISOString(),
        createdAt: notice.createdAt.toISOString(),
        updatedAt: notice.updatedAt.toISOString(),
      },
    },
  }
}
