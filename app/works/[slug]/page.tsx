import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getAllWorks } from "@/lib/vimeo";
import { CATEGORY_LABELS } from "@/lib/types";
import FitTitle from "@/components/FitTitle";
import MarkdownRenderer from "@/components/MarkdownRenderer";

export const dynamic = 'force-dynamic';

interface Props {
  params: { slug: string };
}

/** 단일 getAllWorks() 캐시에서 slug로 찾기 + 관련 작품까지 한 번에 반환 */
async function getPageData(slug: string) {
  const allWorks = await getAllWorks();
  const work = allWorks.find(
    (w) => w.slug === slug || w.vimeoId === slug || w.id === slug
  ) ?? null;
  const related = work
    ? allWorks.filter((w) => w.category === work.category && w.id !== work.id).slice(0, 3)
    : [];
  return { work, related };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { work } = await getPageData(params.slug);
  if (!work) return { title: "Work Not Found" };

  return {
    title: `${work.title} | ${work.client}`,
    description:
      work.description ||
      `${work.client}와 함께한 ${
        CATEGORY_LABELS[work.category]
      } 영상 제작 - BORAMEDIA`,
    openGraph: {
      title: `${work.title} | BORAMEDIA`,
      description:
        work.description || `${work.client} ${CATEGORY_LABELS[work.category]}`,
      images: [
        { url: work.thumbnail, width: 1280, height: 720, alt: work.title },
      ],
      type: "video.other",
    },
    alternates: { canonical: `https://boramedia.co.kr/works/${work.slug}` },
  };
}

export default async function WorkDetailPage({ params }: Props) {
  const { work, related } = await getPageData(params.slug);
  if (!work) notFound();

  // VideoObject JSON-LD
  const videoSchema = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: work.title,
    description:
      work.description ||
      `${work.client} ${CATEGORY_LABELS[work.category]} 영상`,
    thumbnailUrl: work.thumbnail,
    uploadDate: new Date(
      parseInt(work.id) > 1000 ? Date.now() : Date.now()
    ).toISOString(),
    duration: `PT${Math.floor(work.duration / 60)}M${work.duration % 60}S`,
    embedUrl: work.vimeoEmbedUrl,
    contentUrl: `https://vimeo.com/${work.vimeoId}`,
    producer: {
      "@type": "Organization",
      name: "BORAMEDIA",
      url: "https://boramedia.co.kr",
    },
  };

  return (
    <div className="min-h-screen pt-20 overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(videoSchema) }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-[#888899] mb-6 sm:mb-8 min-w-0">
          <Link
            href="/"
            className="hover:text-white transition-colors shrink-0"
          >
            Home
          </Link>
          <span className="shrink-0">/</span>
          <Link
            href="/works"
            className="hover:text-white transition-colors shrink-0"
          >
            Works
          </Link>
          <span className="shrink-0">/</span>
          <span className="text-white truncate min-w-0">{work.title}</span>
        </nav>

        {/* Video player */}
        <div className="glass rounded-xl sm:rounded-2xl overflow-hidden mb-6 sm:mb-8 border border-white/5">
          {work.vimeoEmbedUrl ? (
            <div className="video-wrapper">
              <iframe
                src={work.vimeoEmbedUrl}
                allow="autoplay; fullscreen; picture-in-picture"
                title={work.title}
                style={{ border: 0 }}
              />
            </div>
          ) : (
            <div className="aspect-video bg-[#10101A] flex items-center justify-center relative">
              <Image
                src={work.thumbnail}
                alt={work.title}
                fill
                priority
                className="object-cover opacity-60"
              />
              <div className="relative z-10 text-center">
                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-3">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <a
                  href={`https://vimeo.com/${work.vimeoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white/70 hover:text-white"
                >
                  Vimeo에서 보기 →
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Work info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
          <div className="lg:col-span-2 min-w-0">
            <FitTitle
              maxFontSize={36}
              minFontSize={20}
              className="font-black text-white mb-4"
            >
              {work.title}
            </FitTitle>
            {work.description && (
              <div className="text-xs sm:text-sm text-[#888899] leading-relaxed break-words overflow-hidden">
                <MarkdownRenderer content={work.description} />
              </div>
            )}
          </div>

          <div className="glass rounded-xl p-5 sm:p-6 border border-white/5 space-y-4 h-fit">
            {[
              { label: "클라이언트", value: work.client },
              { label: "연도", value: String(work.year) },
              {
                label: "해상도",
                value:
                  work.width && work.height
                    ? `${work.width} × ${work.height}`
                    : "-",
              },
              { label: "카테고리", value: CATEGORY_LABELS[work.category] },
              ...(work.duration > 0
                ? [
                    {
                      label: "러닝타임",
                      value: `${Math.floor(work.duration / 60)}분 ${
                        work.duration % 60
                      }초`,
                    },
                  ]
                : []),
            ].map(({ label, value }) => (
              <div
                key={label}
                className="flex justify-between items-center text-sm gap-4"
              >
                <span className="text-[#888899] shrink-0">{label}</span>
                <span className="text-white font-semibold text-right truncate min-w-0">
                  {value}
                </span>
              </div>
            ))}
            <a
              href={`https://vimeo.com/${work.vimeoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary w-full justify-center text-sm mt-2"
            >
              Vimeo에서 보기
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
              </svg>
            </a>
          </div>
        </div>

        {/* Related works */}
        {related.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-white mb-6">관련 작품</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {related.map((w) => (
                <Link
                  key={w.id}
                  href={`/works/${w.slug}`}
                  className="block glass rounded-xl overflow-hidden border border-white/5 hover:border-[#7B5EA7]/30 transition-all duration-300 group"
                >
                  <div className="relative aspect-video">
                    <Image
                      src={w.thumbnail}
                      alt={w.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      loading="lazy"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-[#7B5EA7] mb-1">{w.client}</p>
                    <p className="text-sm font-semibold text-white line-clamp-2">
                      {w.title}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-12 pt-8 border-t border-[#22223A]">
          <Link
            href="/works"
            className="btn-secondary text-sm w-full sm:w-auto justify-center"
          >
            ← 전체 작품
          </Link>
          <Link
            href="/contact"
            className="btn-primary text-sm w-full sm:w-auto justify-center"
          >
            프로젝트 문의
          </Link>
        </div>
      </div>
    </div>
  );
}
