import Link from 'next/link';
import { ArrowRight, Shield, Zap, Smartphone, Heart, Globe, Sparkles, FileText, Image as ImageIcon } from 'lucide-react';
import { TOOLS, getPopularTools, getTrendingTools, getToolsByGroup, CATEGORIES } from '@/lib/tools';
import { ToolCard } from '@/components/tool-card';
import { SearchTools } from '@/components/search-tools';
import { AdSlot } from '@/components/ad-slot';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const revalidate = 3600;

export default function HomePage() {
  const popular = getPopularTools(8);
  const trending = getTrendingTools(6);
  const imageTools = getToolsByGroup('image').slice(0, 12);
  const pdfTools = getToolsByGroup('pdf').slice(0, 12);
  const totalCount = TOOLS.length;
  const workingCount = TOOLS.filter((t) => t.status === 'working').length;

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-x-0 top-0 h-[600px] bg-gradient-to-b from-blue-500/10 via-violet-500/5 to-transparent" />
          <div className="absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-blue-500/20 blur-3xl opacity-40" />
        </div>

        <div className="container-wide pt-12 pb-10 md:pt-20 md:pb-16 text-center">
          <Badge variant="secondary" className="mx-auto mb-5">
            <Sparkles className="mr-1 h-3 w-3" /> {totalCount}+ free tools, no signup, no watermark
          </Badge>
          <h1 className="text-balance text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
            All-in-one <span className="gradient-text">Image &amp; PDF tools</span><br className="hidden sm:block" />
            that just work.
          </h1>
          <p className="mt-5 mx-auto max-w-2xl text-base md:text-lg text-muted-foreground text-balance">
            Compress, resize, convert, merge, split, and edit — everything runs in your browser.
            Your files never leave your device. Free forever.
          </p>

          <div className="mt-7 mx-auto max-w-2xl">
            <SearchTools size="lg" />
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            <Link href="/tools/image-compressor">
              <Button variant="gradient" size="lg">
                Compress Image <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/tools/pdf-compressor">
              <Button variant="outline" size="lg">Compress PDF</Button>
            </Link>
            <Link href="/tools/merge-pdf">
              <Button variant="outline" size="lg">Merge PDF</Button>
            </Link>
            <Link href="/tools/jpg-to-pdf">
              <Button variant="outline" size="lg">JPG to PDF</Button>
            </Link>
          </div>

          <ul className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <li className="inline-flex items-center gap-1.5"><Shield className="h-4 w-4 text-emerald-500" /> 100% private</li>
            <li className="inline-flex items-center gap-1.5"><Zap className="h-4 w-4 text-amber-500" /> Lightning fast</li>
            <li className="inline-flex items-center gap-1.5"><Smartphone className="h-4 w-4 text-blue-500" /> Mobile-first</li>
            <li className="inline-flex items-center gap-1.5"><Heart className="h-4 w-4 text-rose-500" /> Free forever</li>
          </ul>
        </div>
      </section>

      <div className="container-wide">
        <AdSlot className="mx-auto max-w-3xl my-2" minHeight={90} label="Top banner ad" />
      </div>

      {/* POPULAR */}
      <section className="container-wide py-10 md:py-14">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">Most popular tools</h2>
            <p className="mt-1 text-muted-foreground">Used millions of times every month.</p>
          </div>
          <Link href="/tools" className="hidden sm:inline-flex">
            <Button variant="ghost" size="sm">View all <ArrowRight className="h-4 w-4" /></Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {popular.map((t) => <ToolCard key={t.slug} tool={t} />)}
        </div>
      </section>

      {/* WHY US */}
      <section className="container-wide py-8 md:py-12">
        <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-blue-500/5 via-violet-500/5 to-transparent p-6 md:p-10">
          <h2 className="text-2xl md:text-3xl font-bold text-center">Built for speed. Designed for everyone.</h2>
          <p className="mt-2 text-center text-muted-foreground max-w-2xl mx-auto">
            GOLUSOFT runs entirely in your browser. No uploads, no waiting in queues, no subscriptions.
          </p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Shield, title: 'Privacy by design', text: 'Files are processed locally. Nothing is uploaded to a server.' },
              { icon: Zap, title: 'Instant results', text: 'No queue, no upload time. Most tools finish in under 2 seconds.' },
              { icon: Smartphone, title: 'Works everywhere', text: 'Tested on low-end Android, iPhone, iPad, tablets and desktops.' },
              { icon: Globe, title: 'Always free', text: 'No signup. No watermark. No daily limits. No paywall.' },
            ].map((f) => (
              <div key={f.title} className="rounded-xl bg-background/60 backdrop-blur p-5 border border-border/40">
                <f.icon className="h-6 w-6 text-primary mb-3" />
                <h3 className="font-semibold">{f.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* IMAGE TOOLS */}
      <section className="container-wide py-10 md:py-14">
        <div className="flex items-end justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600">
              <ImageIcon className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">Image Tools</h2>
              <p className="mt-1 text-sm text-muted-foreground">{getToolsByGroup('image').length} tools — compress, resize, convert, edit, generate</p>
            </div>
          </div>
          <Link href="/tools?group=image" className="hidden sm:inline-flex">
            <Button variant="ghost" size="sm">All image tools <ArrowRight className="h-4 w-4" /></Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
          {imageTools.map((t) => <ToolCard key={t.slug} tool={t} variant="compact" />)}
        </div>
      </section>

      {/* In-content ad */}
      <div className="container-wide">
        <AdSlot className="mx-auto max-w-3xl" minHeight={250} label="Mid-content ad" />
      </div>

      {/* PDF TOOLS */}
      <section className="container-wide py-10 md:py-14">
        <div className="flex items-end justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-500/10 text-rose-600">
              <FileText className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">PDF Tools</h2>
              <p className="mt-1 text-sm text-muted-foreground">{getToolsByGroup('pdf').length} tools — compress, merge, split, convert, edit, secure</p>
            </div>
          </div>
          <Link href="/tools?group=pdf" className="hidden sm:inline-flex">
            <Button variant="ghost" size="sm">All PDF tools <ArrowRight className="h-4 w-4" /></Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
          {pdfTools.map((t) => <ToolCard key={t.slug} tool={t} variant="compact" />)}
        </div>
      </section>

      {/* TRENDING */}
      {trending.length > 0 && (
        <section className="container-wide py-10 md:py-14">
          <h2 className="text-2xl md:text-3xl font-bold">Trending now</h2>
          <p className="mt-1 text-muted-foreground">What people are using this week.</p>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {trending.map((t) => <ToolCard key={t.slug} tool={t} />)}
          </div>
        </section>
      )}

      {/* CATEGORIES */}
      <section className="container-wide py-10 md:py-14">
        <h2 className="text-2xl md:text-3xl font-bold">Browse by category</h2>
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {CATEGORIES.map((c) => {
            const count = TOOLS.filter((t) => t.category === c.id).length;
            return (
              <Link
                key={c.id}
                href={`/tools?category=${c.id}`}
                className="rounded-lg border border-border/60 bg-card px-4 py-3 text-sm hover:border-primary/40 hover:shadow-sm transition-all"
              >
                <div className="font-medium">{c.label}</div>
                <div className="text-xs text-muted-foreground">{count} tools</div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* SEO BLOCK */}
      <section className="container-wide py-10 md:py-14">
        <div className="prose prose-neutral dark:prose-invert max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold">Free online Image &amp; PDF tools — no signup, no watermark</h2>
          <p className="text-muted-foreground">
            GOLUSOFT is a fast, modern toolbox for everyday image and PDF tasks. Whether you need to{' '}
            <Link href="/tools/image-compressor" className="text-primary underline-offset-4 hover:underline">compress an image to a specific KB</Link>,{' '}
            <Link href="/tools/pdf-compressor" className="text-primary underline-offset-4 hover:underline">compress a PDF for email</Link>,{' '}
            <Link href="/tools/merge-pdf" className="text-primary underline-offset-4 hover:underline">merge multiple PDFs</Link>, or{' '}
            <Link href="/tools/jpg-to-pdf" className="text-primary underline-offset-4 hover:underline">turn photos into a PDF</Link>,
            you can do it here in a few seconds — without uploading your files anywhere.
          </p>
          <h3 className="text-xl font-semibold mt-6">Why people choose GOLUSOFT</h3>
          <ul className="text-muted-foreground space-y-1.5">
            <li>Files never leave your device — your data stays private.</li>
            <li>Most tools finish processing in under two seconds.</li>
            <li>Built mobile-first; works on low-end Android and iOS.</li>
            <li>Tools are designed in depth — one powerful page instead of dozens of duplicates.</li>
            <li>No registration, no watermarks, no premium tier.</li>
          </ul>
          <h3 className="text-xl font-semibold mt-6">Smart tools, not noise</h3>
          <p className="text-muted-foreground">
            We deliberately built fewer, better tools. Our{' '}
            <Link href="/tools/image-compressor" className="text-primary underline-offset-4 hover:underline">Smart Image Compressor</Link>{' '}
            replaces dozens of "compress to X KB" pages with a single tool that hits any target size you ask for, supports quality and resolution
            controls, batch upload, and ZIP download. The same philosophy applies across the suite — every tool is meant to be the last one you need.
          </p>
        </div>
      </section>

      {/* Stats footer */}
      <section className="container-wide pb-14">
        <div className="rounded-2xl border border-border/60 p-6 md:p-8 text-center bg-card">
          <p className="text-muted-foreground text-sm">Live catalog</p>
          <p className="mt-2 text-3xl md:text-4xl font-extrabold gradient-text">
            {totalCount} tools • {workingCount} live • Free forever
          </p>
          <Link href="/tools" className="inline-block mt-4">
            <Button variant="gradient" size="lg">Explore all tools <ArrowRight className="h-4 w-4" /></Button>
          </Link>
        </div>
      </section>
    </>
  );
}
