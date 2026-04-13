'use client';

import ReactMarkdown from 'react-markdown';

export default function MarkdownRenderer({ content }: { content: string }) {
  // Vimeo 설명의 단일 줄바꿈(\n)을 마크다운 줄바꿈(두 칸 + \n)으로 변환
  const processed = content.replace(/\n/g, '  \n');

  return (
    <ReactMarkdown
      components={{
        p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
        strong: ({ children }) => <strong className="text-white font-semibold">{children}</strong>,
        em: ({ children }) => <em className="italic">{children}</em>,
        h1: ({ children }) => <h1 className="text-white text-xl font-bold mt-5 mb-2">{children}</h1>,
        h2: ({ children }) => <h2 className="text-white text-lg font-semibold mt-4 mb-2">{children}</h2>,
        h3: ({ children }) => <h3 className="text-white text-base font-semibold mt-3 mb-1">{children}</h3>,
        ul: ({ children }) => <ul className="list-disc pl-5 my-2 space-y-1">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal pl-5 my-2 space-y-1">{children}</ol>,
        li: ({ children }) => <li>{children}</li>,
        a: ({ href, children }) => (
          <a href={href} target="_blank" rel="noopener noreferrer"
            className="text-[#7B5EA7] underline hover:text-purple-300 break-all">
            {children}
          </a>
        ),
        hr: () => <hr className="border-[#22223A] my-4" />,
        blockquote: ({ children }) => (
          <blockquote className="border-l-2 border-[#7B5EA7] pl-4 italic text-[#888899] my-3">
            {children}
          </blockquote>
        ),
        code: ({ children }) => (
          <code className="bg-white/10 px-1.5 py-0.5 rounded text-xs font-mono">{children}</code>
        ),
      }}
    >
      {processed}
    </ReactMarkdown>
  );
}
