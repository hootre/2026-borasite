'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith('/admin')) return null;

  return (
    <footer className="border-t border-[#22223A] bg-[#08080F]">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <img
                src="/logo.png"
                alt="BORAMEDIA"
                width={28}
                height={18}
                className="block"
              />
              <span className="font-bold tracking-widest text-white">
                BORAMEDIA
              </span>
            </div>
            <p className="text-sm text-[#888899] leading-relaxed">
              생동감 넘치게
              <br />
              당신의 이야기를 기록해드립니다.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-semibold text-[#888899] tracking-widest uppercase mb-4">
              Contact
            </h4>
            <div className="flex flex-col gap-2 text-sm text-[#888899]">
              <p className="hover:text-white transition-colors">
                PHONE : 01080071895
              </p>
              <a
                href="mailto:artinsky@boramedia.co.kr"
                className="hover:text-white transition-colors"
              >
                EMAIL : artinsky@boramedia.co.kr
              </a>
              <a
                href="https://boramedia.co.kr"
                className="hover:text-white transition-colors"
              >
                SITE : boramedia.co.kr
              </a>
              <div className="mt-2 flex gap-3">
                <a
                  href="https://vimeo.com/boramedia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#888899] hover:text-[#7B5EA7] transition-colors"
                  aria-label="Vimeo"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M23.977 6.416c-.105 2.338-1.739 5.543-4.894 9.609-3.268 4.247-6.026 6.37-8.29 6.37-1.409 0-2.578-1.294-3.553-3.881L5.322 11.4C4.603 8.816 3.834 7.522 3.01 7.522c-.179 0-.806.378-1.881 1.132L0 7.197c1.185-1.044 2.351-2.084 3.501-3.128C5.08 2.701 6.266 1.984 7.055 1.91c1.867-.18 3.016 1.1 3.447 3.838.465 2.953.789 4.789.971 5.507.539 2.45 1.131 3.674 1.776 3.674.502 0 1.256-.796 2.265-2.385 1.004-1.589 1.54-2.797 1.612-3.628.144-1.371-.395-2.061-1.614-2.061-.574 0-1.167.121-1.777.391 1.186-3.868 3.434-5.757 6.762-5.637 2.473.06 3.628 1.664 3.48 4.807l-.001.008z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[#22223A] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#888899]">
          <span>
            © {new Date().getFullYear()} BORAMEDIA. All rights reserved.
          </span>
          <span>영상 프로덕션 전문 기업</span>
        </div>
      </div>
    </footer>
  );
}
