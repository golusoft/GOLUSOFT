import type { Metadata } from 'next';
import Link from 'next/link';
import { LayoutDashboard, Wrench, FileText, Search, Activity, Settings, Newspaper, AlertTriangle } from 'lucide-react';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Admin Dashboard',
  description: 'Internal admin dashboard.',
  noIndex: true,
  path: '/admin',
});

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/tools', label: 'Tools', icon: Wrench },
  { href: '/admin/blog', label: 'Blog', icon: Newspaper },
  { href: '/admin/seo', label: 'SEO', icon: Search },
  { href: '/admin/analytics', label: 'Analytics', icon: Activity },
  { href: '/admin/sitemap', label: 'Sitemap', icon: FileText },
  { href: '/admin/errors', label: 'Errors', icon: AlertTriangle },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container-wide py-6">
      <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-2.5 text-sm text-amber-700 dark:text-amber-400 mb-4">
        <strong>Admin area</strong> — internal only. This route is excluded from robots and never linked publicly. In production, gate with authentication.
      </div>
      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <nav className="rounded-xl border border-border/60 bg-card p-2 lg:flex lg:flex-col gap-0.5 flex flex-row overflow-x-auto scrollbar-hide">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
              >
                <item.icon className="h-4 w-4" /> {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main>{children}</main>
      </div>
    </div>
  );
}
