import Layout from '../components/Layout'
import NoticeForm from '../components/NoticeForm'

export default function AddPage() {
  return (
    <Layout title="Add Notice">
      <div className="max-w-xl mx-auto">
        <h1 className="text-xl font-semibold text-gray-900 mb-6">Add New Notice</h1>
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <NoticeForm />
        </div>
      </div>
    </Layout>
  )
}
