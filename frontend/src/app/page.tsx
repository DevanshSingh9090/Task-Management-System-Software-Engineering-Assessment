import Link from 'next/link';

const features = [
  {
    icon: '🔐',
    title: 'Secure Auth',
    desc: 'JWT access & refresh tokens stored in httpOnly cookies. Your data, your control.',
  },
  {
    icon: '⚡',
    title: 'Real-time Updates',
    desc: 'Instant task toggling, editing, and deletion with live toast notifications.',
  },
  {
    icon: '🔍',
    title: 'Smart Filtering',
    desc: 'Search by title, filter by status, and paginate through hundreds of tasks.',
  },
  {
    icon: '📱',
    title: 'Fully Responsive',
    desc: 'Beautifully designed for desktop, tablet, and mobile screens.',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-[90vh] flex flex-col">

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center py-20 px-4">
        <div
          className="animate-fade-in stagger-1 inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-8 border"
          style={{ background: 'rgba(99,102,241,0.1)', borderColor: 'rgba(99,102,241,0.3)', color: 'var(--brand)' }}
        >
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse inline-block" />
          Production-ready Task Manager
        </div>

        <h1
          className="animate-slide-up stagger-2 font-display text-5xl md:text-7xl font-extrabold tracking-tight leading-none mb-6"
          style={{ color: 'var(--text-primary)' }}
        >
          Get things
          <br />
          <span style={{ color: 'var(--brand)' }}>done.</span>
        </h1>

        <p
          className="animate-slide-up stagger-3 text-lg md:text-xl max-w-xl mb-10 leading-relaxed"
          style={{ color: 'var(--text-secondary)' }}
        >
          A beautifully crafted task manager with secure authentication, smart filtering,
          and a seamless experience across all your devices.
        </p>

        <div className="animate-slide-up stagger-4 flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/register" className="btn-primary text-base px-8 py-3">
            Get started free →
          </Link>
          <Link
            href="/login"
            className="px-8 py-3 rounded-xl text-base font-semibold transition-all duration-200"
            style={{ color: 'var(--text-primary)', border: '1.5px solid var(--border)', background: 'var(--bg-secondary)' }}
          >
            Sign in
          </Link>
        </div>

        <div className="animate-slide-up stagger-5 flex flex-wrap gap-2 justify-center mt-12">
          {['Next.js 14', 'TypeScript', 'Prisma', 'PostgreSQL', 'JWT', 'Tailwind CSS'].map(t => (
            <span
              key={t}
              className="px-3 py-1 rounded-lg text-xs font-medium"
              style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
            >
              {t}
            </span>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-3xl font-bold text-center mb-3" style={{ color: 'var(--text-primary)' }}>
            Everything you need
          </h2>
          <p className="text-center mb-12 text-sm" style={{ color: 'var(--text-secondary)' }}>
            Built with modern tools, designed for real use.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map(f => (
              <div key={f.title} className="card p-6 flex flex-col gap-3 hover:-translate-y-1 transition-transform duration-200">
                <div className="text-3xl">{f.icon}</div>
                <h3 className="font-display font-bold text-base" style={{ color: 'var(--text-primary)' }}>{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 px-4">
        <div
          className="max-w-2xl mx-auto text-center card p-10"
          style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(129,140,248,0.06))' }}
        >
          <h2 className="font-display text-3xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
            Ready to be productive?
          </h2>
          <p className="mb-6 text-sm" style={{ color: 'var(--text-secondary)' }}>
            Create your account in seconds and start managing tasks right away.
          </p>
          <Link href="/register" className="btn-primary inline-block px-10 py-3 text-base">
            Create free account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center text-xs" style={{ color: 'var(--text-muted)', borderTop: '1px solid var(--border)' }}>
        Built with Next.js · TypeScript · Tailwind · Express · Prisma · PostgreSQL
      </footer>
    </div>
  );
}