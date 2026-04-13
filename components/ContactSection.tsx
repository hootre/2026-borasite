import Link from "next/link";

export default function ContactSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* BG gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 80% at 50% 100%, rgba(123,94,167,0.12) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
        <p className="text-[#7B5EA7] text-sm font-semibold tracking-widest uppercase mb-4">
          Let's Work Together
        </p>
        <h2 className="text-4xl lg:text-6xl font-black text-white leading-tight mb-6">
          당신의 이야기
          <br />
          <span className="gradient-text">보라미디어가 기록합니다.</span>
        </h2>
        <p className="text-[#888899] text-lg mb-10">
          생동감 넘치는 영상으로 당신의 순간을 영원히 남겨드립니다.
          <br />
          기획부터 납품까지 올인원 워크플로우로 빠르게 대응합니다.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/contact" className="btn-primary text-base px-8 py-4">
            프로젝트 시작하기
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
          <a
            href="mailto:artinsky@boramedia.co.kr"
            className="btn-secondary text-base px-8 py-4"
          >
            artinsky@boramedia.co.kr
          </a>
        </div>
      </div>
    </section>
  );
}
