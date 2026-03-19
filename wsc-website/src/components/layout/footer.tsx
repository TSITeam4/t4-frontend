"use client";

import Link from "next/link";
import Image from "next/image";

const NAV_LINKS = [
  { label: "About", href: "/about" },
  { label: "Executive Team", href: "/executive-team" },
  { label: "Events", href: "/events" },
  { label: "Partners", href: "/sponsors" },
  { label: "Contact", href: "/contact-us" },
] as const;

const SOCIAL_LINKS = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/westernsalesclub/",
    icon: "/Instagram.svg",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/western-sales-club/",
    icon: "/Linkedin.svg",
  },
] as const;

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="w-full"
      style={{
        borderTop: "1px solid var(--color-border-gold)",
        padding: "clamp(2rem, 4vw, 3.5rem) clamp(1.5rem, 5vw, 6rem)",
      }}
    >
      {/* Three-column row */}
      <div
        className="mx-auto flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:justify-between"
        style={{ maxWidth: "1400px" }}
      >
        {/* Left — Logo + Wordmark */}
        <Link
          href="/"
          className="flex items-center gap-2 shrink-0"
          data-cursor="hover"
        >
          <Image
            src="/shark.avif"
            alt="Western Sales Club logo"
            width={20}
            height={20}
            className="object-contain"
          />
          <span
            className="font-body"
            style={{
              fontSize: "var(--text-small)",
              color: "var(--color-text-muted)",
              fontWeight: 400,
            }}
          >
            Western Sales Club
          </span>
        </Link>

        {/* Center — Nav links with dot separators */}
        <nav className="flex flex-wrap items-center justify-center gap-y-1">
          {NAV_LINKS.map((link, i) => (
            <span key={link.href} className="flex items-center">
              {i > 0 && (
                <span
                  className="mx-2 select-none"
                  style={{
                    color: "var(--color-text-subtle)",
                    fontSize: "var(--text-small)",
                  }}
                  aria-hidden="true"
                >
                  &middot;
                </span>
              )}
              <Link
                href={link.href}
                data-cursor="hover"
                className="inline-flex min-h-[2.75rem] items-center font-body text-[var(--color-text-muted)] transition-colors duration-250 hover:text-[var(--color-text-primary)] active:text-[var(--color-text-primary)]"
                style={{
                  fontSize: "var(--text-small)",
                  fontWeight: 400,
                }}
              >
                {link.label}
              </Link>
            </span>
          ))}
        </nav>

        {/* Right — Social icons */}
        <div className="flex items-center gap-1 shrink-0">
          {SOCIAL_LINKS.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              data-cursor="hover"
              className="social-icon-link flex h-11 w-11 items-center justify-center"
            >
              <Image
                src={social.icon}
                alt={social.label}
                width={18}
                height={18}
                className="social-icon"
              />
            </a>
          ))}
        </div>
      </div>

      {/* Copyright line */}
      <p
        className="font-mono text-center"
        style={{
          fontSize: "var(--text-mono-sm)",
          color: "var(--color-text-subtle)",
          marginTop: "var(--space-3)",
        }}
      >
        &copy; {year} Western Sales Club &middot; A TSI Initiative
      </p>
    </footer>
  );
}
