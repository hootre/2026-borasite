const KEYWORDS = ['생동감', '기록', '공연', '고퀄리티', '고해상도', '올인원 워크플로우'];

export default function KeywordsStrip() {
  // Triple the keywords for a smooth seamless marquee
  const items = [...KEYWORDS, ...KEYWORDS, ...KEYWORDS];

  return (
    <div className="py-4 overflow-hidden border-y" style={{
      background: 'rgba(123,94,167,0.06)',
      borderColor: 'rgba(123,94,167,0.15)',
    }}>
      <div
        className="flex whitespace-nowrap"
        style={{ animation: 'marquee 28s linear infinite' }}
      >
        {items.map((kw, i) => (
          <span key={i} className="inline-flex items-center">
            <span
              className="inline-block text-xs font-black tracking-widest uppercase px-5"
              style={{ color: 'rgba(192,168,255,0.75)' }}
            >
              {kw}
            </span>
            <span
              className="inline-block px-1 text-[10px]"
              style={{ color: 'rgba(123,94,167,0.6)' }}
            >
              ✦
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
