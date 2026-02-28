import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="max-w-3xl mx-auto bg-white p-10 rounded shadow text-center">
        <h1 className="text-4xl font-bold mb-4">Task Manager</h1>
        <p className="text-gray-600 mb-6">
          Simple task management with secure authentication (access + refresh tokens, httpOnly cookies).
        </p>

        <div className="flex justify-center gap-4">
          <Link href="/login" className="px-6 py-3 bg-green-600 text-white rounded">Login</Link>
          <Link href="/register" className="px-6 py-3 border rounded">Create account</Link>
        </div>

        <p className="text-sm text-gray-500 mt-6">
          Built with Next.js, TypeScript, Tailwind, Express, Prisma & PostgreSQL.
        </p>
      </div>
    </div>
  );
}