"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { WorkMeta, WorkCategory, CATEGORY_LABELS } from "@/lib/types";

interface Props {
  works: WorkMeta[];
  customCategoryLabels?: Partial<Record<string, string>>;
}

export default function WorksGrid({ works, customCategoryLabels }: Props) {
  const [active, setActive] = useState<WorkCategory>("all");
  const [isMobile, setIsMobile] = useState(false);
  const [visible, setVisible] = useState(8);

  // 기본 라벨과 커스텀 라벨 병합
  const labels: Record<string, string> = { ...CATEGORY_LABELS, ...customCategoryLabels };

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const initialVisible = isMobile ? 4 : 8;

  useEffect(() => {
    setVisible(initialVisible);
  }, [initialVisible]);

  const sectionRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const isWorksPage = pathname === "/works";

  const categories = [
    "all",
    "corporate",
    "music",
    "filming",
    "sketch",
    "youtube",
  ] as WorkCategory[];

  const filtered =
    active === "all" ? works : works.filter((w) => w.category === active);

  const displayed = filtered.slice(0, visible);

  // Reveal on scroll
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        }),
      { threshold: 0.1 }
    );
    sectionRef.current
      ?.querySelectorAll(".reveal")
      .forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section
      id="works"
      ref={sectionRef}
      className="py-24 max-w-7xl mx-auto px-6 min-h-[900px]"
    >
      {/* Header */}
      <div className="reveal flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 text-center md:text-left">
        <div>
          <p className="text-[#7B5EA7] text-sm font-semibold tracking-widest uppercase mb-3">
            Our Works
          </p>
          <h2 className="text-4xl lg:text-5xl font-black tracking-tight text-white">
            최근 프로젝트
          </h2>
        </div>
        {!isWorksPage && (
          <Link href="/works" className="btn-secondary text-sm shrink-0">
            전체 보기
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        )}
      </div>

      {/* Category filter */}
      <div className="reveal flex flex-wrap justify-center md:justify-start gap-2 mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setActive(cat);
              setVisible(initialVisible);
            }}
            className={`cat-btn ${active === cat ? "active" : ""}`}
          >
            {labels[cat] ?? cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {displayed.map((work, i) => (
          <WorkCard key={work.id} work={work} index={i} labels={labels} />
        ))}
      </div>

      {/* Load more */}
      {visible < filtered.length && (
        <div className="flex justify-center mt-12">
          <button
            onClick={() => setVisible((v) => v + 4)}
            className="btn-secondary"
          >
            더 보기 ({filtered.length - visible}개 남음)
          </button>
        </div>
      )}
    </section>
  );
}

// ─── Individual Work Card ────────────────────────────────────────────────────

function getTagYear(tags: string[]): number | null {
  for (const tag of tags) {
    const match = tag.match(/^(\d{6})$/);
    if (match) return 2000 + parseInt(match[1].substring(0, 2), 10);
  }
  return null;
}

function isNew(tags: string[]): boolean {
  for (const tag of tags) {
    const match = tag.match(/^(\d{6})$/);
    if (match) {
      const yy = parseInt(match[1].substring(0, 2), 10);
      const mm = parseInt(match[1].substring(2, 4), 10) - 1;
      const dd = parseInt(match[1].substring(4, 6), 10);
      const tagDate = new Date(2000 + yy, mm, dd);
      const now = new Date();
      const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      return tagDate >= oneMonthAgo;
    }
  }
  return false;
}

function WorkCard({ work, index, labels }: { work: WorkMeta; index: number; labels: Record<string, string> }) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(
            () => cardRef.current?.classList.add("visible"),
            index * 60
          );
          obs.disconnect();
        }
      },
      { threshold: 0.05 }
    );
    if (cardRef.current) obs.observe(cardRef.current);
    return () => obs.disconnect();
  }, [index]);

  return (
    <div ref={cardRef} className="reveal">
      <Link
        href={`/works/${work.slug}`}
        className="block glass glass-hover rounded-xl overflow-hidden transition-all duration-300 cursor-pointer group"
      >
        {/* Thumbnail */}
        <div className="work-thumbnail">
          <Image
            src={work.thumbnail}
            alt={`${work.client} - ${work.title} 영상 제작`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            priority={index < 8}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="work-play-overlay">
            <div className="play-btn w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#1A1A2E">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
          {isNew(work.tags) && (
            <div className="absolute top-3 left-3 bg-white text-[#1A1A2E] text-[10px] font-black tracking-wider px-2 py-0.5 rounded-full shadow-lg">
              NEW
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-xs text-[#7B5EA7] font-semibold mb-1 truncate">
            {work.client}
          </p>
          <h3 className="text-sm font-semibold text-white leading-snug truncate group-hover:text-purple-200 transition-colors">
            {work.title}
          </h3>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[10px] text-[#888899] bg-white/5 px-2 py-0.5 rounded-full">
              {getTagYear(work.tags) ?? work.year}
            </span>
            <span className="text-[10px] text-[#888899] bg-white/5 px-2 py-0.5 rounded-full">
              {labels[work.category] ?? work.category}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
