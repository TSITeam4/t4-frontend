"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  motion,
  AnimatePresence,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { easing } from "@/lib/motion";

/* ────────────────────────────────────────────
   Nav items — shared between desktop & mobile
   ──────────────────────────────────────────── */
const NAV_ITEMS = [
  { href: "/about", label: "About" },
  { href: "/executive-team", label: "Executive Team" },
  { href: "/events", label: "Events" },
  { href: "/sponsors", label: "Partners" },
  { href: "/contact-us", label: "Contact" },
] as const;

/* ────────────────────────────────────────────
   Animation variants
   ──────────────────────────────────────────── */
const drawerVariants = {
  closed: {
    x: "100%",
    transition: { duration: 0.4, ease: easing.easeInOutQuart },
  },
  open: {
    x: 0,
    transition: { duration: 0.45, ease: easing.easeInOutQuart },
  },
};

const backdropVariants = {
  closed: { opacity: 0 },
  open: { opacity: 1 },
};

const mobileNavContainerVariants = {
  closed: {},
  open: {
    transition: {
      staggerChildren: easing.staggerNav,
      delayChildren: 0.15,
    },
  },
};

const mobileNavItemVariants = {
  closed: {
    opacity: 0,
    x: 40,
    transition: { duration: 0.25, ease: easing.easeOutQuart },
  },
  open: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: easing.easeOutExpo },
  },
};

const mobileSocialVariants = {
  closed: { opacity: 0, y: 16 },
  open: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: easing.easeOutExpo, delay: 0.35 },
  },
};

/* ────────────────────────────────────────────
   Active link underline (gold, animates in)
   ──────────────────────────────────────────── */
function ActiveUnderline() {
  return (
    <motion.span
      layoutId="nav-underline"
      className="absolute -bottom-1 left-0 right-0 h-[2px] bg-gold"
      initial={{ scaleX: 0, transformOrigin: "left" }}
      animate={{ scaleX: 1 }}
      transition={{ duration: 0.4, delay: 0.4, ease: easing.easeOutExpo }}
    />
  );
}

/* ────────────────────────────────────────────
   Nav component
   ──────────────────────────────────────────── */
export default function Nav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const scrollPositionRef = useRef(0);

  const { scrollY } = useScroll();

  // Track scroll position for header style change
  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 50);
  });

  // Close drawer on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Body scroll lock when mobile drawer is open
  useEffect(() => {
    if (isOpen) {
      scrollPositionRef.current = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollPositionRef.current}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      window.scrollTo(0, scrollPositionRef.current);
    }

    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const toggleMenu = useCallback(() => setIsOpen((prev) => !prev), []);
  const closeMenu = useCallback(() => setIsOpen(false), []);
  const isActive = (href: string) => pathname === href;

  return (
    <>
      {/* ── Header bar ── */}
      <motion.header
        className="fixed top-0 left-0 w-full z-50"
        initial={false}
        animate={{
          backgroundColor: scrolled
            ? "rgba(10, 10, 10, 0.85)"
            : "rgba(10, 10, 10, 0)",
          borderBottomColor: scrolled
            ? "rgba(255, 255, 255, 0.08)"
            : "rgba(255, 255, 255, 0)",
          height: scrolled ? 60 : 72,
        }}
        transition={{ duration: 0.3, ease: easing.easeOutQuart }}
        style={{
          backdropFilter: scrolled ? "blur(20px)" : "blur(0px)",
          WebkitBackdropFilter: scrolled ? "blur(20px)" : "blur(0px)",
          borderBottomWidth: 1,
          borderBottomStyle: "solid",
        }}
      >
        <div className="flex h-full items-center justify-between px-[clamp(1.5rem,5vw,6rem)]">
          {/* ── Logo ── */}
          <Link
            href="/"
            className="flex items-center gap-3 no-underline"
            data-cursor="hover"
          >
            <Image
              src="/shark.avif"
              alt="Western Sales Club logo"
              width={28}
              height={28}
              className="h-7 w-7 object-contain"
              priority
            />
            <span className="font-body text-sm font-medium tracking-[0.04em] text-text-primary">
              Western Sales Club
            </span>
          </Link>

          {/* ── Desktop nav (Radix NavigationMenu) ── */}
          <NavigationMenu.Root className="hidden md:block">
            <NavigationMenu.List className="flex items-center gap-8 list-none m-0 p-0">
              {NAV_ITEMS.map(({ href, label }) => (
                <NavigationMenu.Item key={href}>
                  <NavigationMenu.Link asChild>
                    <Link
                      href={href}
                      data-cursor="hover"
                      className={`
                        relative inline-flex items-center min-h-[2.75rem]
                        font-body text-[0.8125rem] font-medium
                        uppercase tracking-[0.08em] no-underline
                        transition-colors duration-250 ease-out
                        ${
                          isActive(href)
                            ? "text-text-primary"
                            : "text-text-muted hover:text-text-primary active:text-text-primary"
                        }
                      `}
                    >
                      {label}
                      {isActive(href) && <ActiveUnderline />}
                    </Link>
                  </NavigationMenu.Link>
                </NavigationMenu.Item>
              ))}
            </NavigationMenu.List>
          </NavigationMenu.Root>

          {/* ── Mobile hamburger ── */}
          <button
            className="relative z-[60] flex md:hidden h-12 w-12 flex-col items-center justify-center gap-[5px] bg-transparent border-none"
            onClick={toggleMenu}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            data-cursor="hover"
          >
            <motion.span
              className="block h-[1.5px] w-[1.4rem] bg-text-primary origin-center"
              animate={
                isOpen
                  ? { rotate: 45, y: 6.5 }
                  : { rotate: 0, y: 0 }
              }
              transition={{ duration: 0.3, ease: easing.easeOutQuart }}
            />
            <motion.span
              className="block h-[1.5px] w-[1.4rem] bg-text-primary origin-center"
              animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
              transition={{ duration: 0.2 }}
            />
            <motion.span
              className="block h-[1.5px] w-[1.4rem] bg-text-primary origin-center"
              animate={
                isOpen
                  ? { rotate: -45, y: -6.5 }
                  : { rotate: 0, y: 0 }
              }
              transition={{ duration: 0.3, ease: easing.easeOutQuart }}
            />
          </button>
        </div>
      </motion.header>

      {/* ── Mobile drawer + backdrop ── */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="nav-backdrop"
              className="fixed inset-0 z-[51] bg-black/40 md:hidden"
              variants={backdropVariants}
              initial="closed"
              animate="open"
              exit="closed"
              transition={{ duration: 0.35 }}
              onClick={closeMenu}
              aria-hidden="true"
            />

            {/* Drawer */}
            <motion.nav
              key="nav-drawer"
              className="fixed top-0 right-0 z-[55] flex h-dvh w-[min(85vw,380px)] flex-col md:hidden"
              style={{
                background: "rgba(10, 10, 10, 0.97)",
                backdropFilter: "blur(30px)",
                WebkitBackdropFilter: "blur(30px)",
              }}
              variants={drawerVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              {/* Links */}
              <motion.ul
                className="flex flex-1 flex-col justify-center gap-6 list-none px-10 m-0"
                variants={mobileNavContainerVariants}
                initial="closed"
                animate="open"
                exit="closed"
              >
                {NAV_ITEMS.map(({ href, label }) => (
                  <motion.li key={href} variants={mobileNavItemVariants}>
                    <Link
                      href={href}
                      onClick={closeMenu}
                      data-cursor="hover"
                      className={`
                        block min-h-[3rem] font-display font-medium no-underline
                        text-[clamp(2.2rem,6vw,3.2rem)] leading-tight
                        transition-colors duration-250
                        ${
                          isActive(href)
                            ? "text-gold"
                            : "text-text-primary hover:text-gold active:text-gold"
                        }
                      `}
                    >
                      {label}
                    </Link>
                  </motion.li>
                ))}
              </motion.ul>

              {/* Gold separator + social icons */}
              <motion.div
                className="px-10 pb-12"
                variants={mobileSocialVariants}
                initial="closed"
                animate="open"
                exit="closed"
              >
                <div className="mb-6 h-px w-full bg-gold/30" />
                <div className="flex items-center gap-3">
                  <a
                    href="https://www.instagram.com/westernsalesclub/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    data-cursor="hover"
                    className="flex h-11 w-11 items-center justify-center text-text-muted transition-colors duration-250 hover:text-gold active:text-gold"
                  >
                    <Image
                      src="/Instagram.svg"
                      alt="Instagram"
                      width={22}
                      height={22}
                      className="opacity-60 hover:opacity-100 active:opacity-100 transition-opacity duration-250"
                    />
                  </a>
                  <a
                    href="https://www.linkedin.com/company/western-sales-club/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    data-cursor="hover"
                    className="flex h-11 w-11 items-center justify-center text-text-muted transition-colors duration-250 hover:text-gold active:text-gold"
                  >
                    <Image
                      src="/Linkedin.svg"
                      alt="LinkedIn"
                      width={22}
                      height={22}
                      className="opacity-60 hover:opacity-100 active:opacity-100 transition-opacity duration-250"
                    />
                  </a>
                </div>
              </motion.div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
