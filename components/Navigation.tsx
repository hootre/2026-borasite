'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
  { href: '/',        label: 'HOME'  },
  { href: '/works',   label: 'WORKS' },
  { href: '/about',   label: 'ABOUT' },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  // admin 페이지에서는 공통 네비게이션 숨김
  if (pathname.startsWith('/admin')) return null;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'nav-blur' : 'bg-transparent'
        }`}
      >
        <nav className="w-full px-6 sm:px-10 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <img src="/logo.png" alt="BORAMEDIA" width={32} height={21} className="block" />
            <span className="font-bold text-base tracking-widest text-white group-hover:text-purple-300 transition-colors">
              BORAMEDIA
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`text-sm font-semibold tracking-widest transition-colors duration-200 ${
                  pathname === href
                    ? 'text-white'
                    : 'text-[#888899] hover:text-white'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* CTA + Hamburger */}
          <div className="flex items-center gap-4">
            {!pathname.startsWith('/admin') && (
              <div className="hidden md:block scale-[0.67] origin-right">
                <Link href="/contact" className="btn-primary text-sm px-5 py-2.5">
                  CONTACT
                </Link>
              </div>
            )}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-8 h-8 flex flex-col justify-center items-center gap-1.5 group"
              aria-label="메뉴 열기"
            >
              <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-500 ${
          mobileOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
      >
        <div
          className={`absolute inset-0 bg-black transition-opacity duration-500 ${
            mobileOpen ? 'opacity-80' : 'opacity-0'
          }`}
          onClick={() => setMobileOpen(false)}
        />
        <div
          className={`absolute top-0 right-0 h-full w-72 glass transition-transform duration-500 ${
            mobileOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex flex-col h-full pt-20 px-8 gap-6">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`text-xl font-bold tracking-widest transition-colors ${
                  pathname === href ? 'text-purple-300' : 'text-[#888899] hover:text-white'
                }`}
              >
                {label}
              </Link>
            ))}
            <Link href="/contact" className="btn-primary mt-4 justify-center">
              CONTACT
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
