import Head from 'next/head'
import Link from 'next/link'

export default function Layout({ children, title = 'All Notices' }) {
  return (
    <>
      <Head>
        <title>{title} | Reno Notice Board</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Reno Platforms Notice Board" />
      </Head>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
            <Link href="/" className="font-bold text-gray-900 text-lg tracking-tight hover:text-blue-600 transition-colors">
              Reno Notice Board
            </Link>
            <Link
              href="/add"
              className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors"
            >
              <span className="text-base leading-none">+</span>
              <span>Add Notice</span>
            </Link>
          </div>
        </header>
        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          {children}
        </main>
      </div>
    </>
  )
}
