import { useState, useEffect, useRef } from "react";

const NAV_LINKS = [
    { href: "#proyectos", label: "Proyectos" },
    { href: "#servicios", label: "Servicios" },
    { href: "#contacto", label: "Contacto" },
];

export default function HeaderNav() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [linksVisible, setLinksVisible] = useState(true);
    const prevScrolled = useRef(false);

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 60;
            if (isScrolled !== prevScrolled.current) {
                prevScrolled.current = isScrolled;
                setLinksVisible(false);
                setTimeout(() => {
                    setScrolled(isScrolled);
                    setTimeout(() => setLinksVisible(true), 80);
                }, 150);
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (scrolled) setMobileOpen(false);
    }, [scrolled]);

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        setMobileOpen(false);
        const target = document.querySelector(href);
        if (target) target.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <>
            <header className="fixed top-0 w-full z-50">
                {/* Nav pill */}
                <nav
                    className={[
                        "container max-w-6xl mx-auto flex items-center justify-between px-8 transition-transform duration-400 ease-in-out",
                        scrolled
                            ? "mt-4 py-2.5 rounded-full bg-black/85 backdrop-blur-md outline-1 outline-white/8"
                            : "mt-0 py-6 rounded-none bg-transparent outline-1 outline-transparent",
                    ].join(" ")}
                >
                    {/* Logo */}
                    <a
                        href="/"
                        className={[
                            "relative block shrink-0 transition-[width] duration-450",
                            scrolled ? "w-15" : "w-35",
                        ].join(" ")}
                        style={{ transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)" }}
                    >
                        {/* Logo icono (logo-blanco.svg) — visible sin scroll */}
                        <img
                            src="/images/logos/logo-blanco.svg"
                            alt="Tres Veces Tres"
                            className={[
                                "block w-full transition-[opacity,transform] duration-400",
                                scrolled ? "opacity-0 scale-75" : "opacity-100 scale-100",
                            ].join(" ")}
                            style={{ transitionTimingFunction: scrolled ? "ease" : "cubic-bezier(0.34, 1.56, 0.64, 1)" }}
                        />
                        {/* Logo con letras (logo-blanco-letras.svg) — visible con scroll */}
                        <img
                            src="/images/logos/logo-blanco-letras.svg"
                            alt=""
                            aria-hidden="true"
                            className={[
                                "absolute inset-0 block w-full transition-[opacity,transform] duration-400",
                                scrolled ? "opacity-100 scale-100 translate-y-1" : "opacity-0 scale-10",
                            ].join(" ")}
                        />
                    </a>

                    {/* Nav links — desktop */}
                    <ul className="hidden md:flex gap-10 text-white text-sm font-semibold tracking-widest uppercase">
                        {NAV_LINKS.map((link, i) => (
                            <li
                                key={link.href}
                                className="transition-[opacity,transform]"
                                style={{
                                    opacity: linksVisible ? 1 : 0,
                                    transform: linksVisible ? "translateY(0)" : "translateY(-10px)",
                                    transitionDuration: linksVisible ? "0.4s, 0.5s" : "0.15s, 0.15s",
                                    transitionDelay: linksVisible ? `${i * 60}ms` : "0ms",
                                    transitionTimingFunction: linksVisible
                                        ? `ease, cubic-bezier(0.34, 1.56, 0.64, 1)`
                                        : "ease, ease",
                                }}
                            >
                                <a
                                    href={link.href}
                                    onClick={(e) => handleNavClick(e, link.href)}
                                    className="hover:opacity-70 transition-opacity"
                                >
                                    {link.label}
                                </a>
                            </li>
                        ))}
                    </ul>

                    {/* Hamburger — mobile */}
                    <button
                        onClick={() => setMobileOpen((o) => !o)}
                        className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5 focus:outline-none"
                        aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
                        aria-expanded={mobileOpen}
                    >
                        <span
                            className="block w-6 h-0.5 bg-white rounded-full transition-transform duration-300"
                            style={{
                                transform: mobileOpen ? "rotate(45deg) translate(6px, 6px)" : "none",
                                transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)",
                            }}
                        />
                        <span
                            className="block w-6 h-0.5 bg-white rounded-full transition-[opacity,transform] duration-300"
                            style={{
                                opacity: mobileOpen ? 0 : 1,
                                transform: mobileOpen ? "scaleX(0)" : "scaleX(1)",
                            }}
                        />
                        <span
                            className="block w-6 h-0.5 bg-white rounded-full transition-transform duration-300"
                            style={{
                                transform: mobileOpen ? "rotate(-45deg) translate(6px, -6px)" : "none",
                                transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)",
                            }}
                        />
                    </button>
                </nav>

                {/* Mobile menu dropdown */}
                <div
                    className={[
                        "md:hidden overflow-hidden transition-[max-height,opacity] bg-black/95 backdrop-blur-xl mt-4 rounded-xl mx-2",
                        mobileOpen ? "max-h-72 opacity-100 border-t border-white/8" : "max-h-0 opacity-0 border-t border-transparent",
                    ].join(" ")}
                    style={{ transitionDuration: "0.4s, 0.3s", transitionTimingFunction: "cubic-bezier(0.77, 0, 0.175, 1), ease" }}
                >
                    <ul className="flex flex-col items-center justify-center px-8 py-6 gap-6">
                        {NAV_LINKS.map((link, i) => (
                            <li
                                key={link.href}
                                className="transition-[opacity,transform]"
                                style={{
                                    opacity: mobileOpen ? 1 : 0,
                                    transform: mobileOpen ? "translateX(0)" : "translateX(-16px)",
                                    transitionDuration: "0.35s, 0.4s",
                                    transitionDelay: mobileOpen ? `${120 + i * 80}ms` : "0ms",
                                    transitionTimingFunction: `ease, cubic-bezier(0.34, 1.56, 0.64, 1)`,
                                }}
                            >
                                <a
                                    href={link.href}
                                    onClick={(e) => handleNavClick(e, link.href)}
                                    className="text-white text-base font-semibold tracking-widest uppercase hover:opacity-70 transition-opacity"
                                >
                                    {link.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </header>

            {/* Backdrop blur para mobile */}
            <div
                onClick={() => setMobileOpen(false)}
                aria-hidden="true"
                className={[
                    "fixed inset-0 z-40 transition-[opacity,backdrop-filter] duration-350",
                    mobileOpen ? "opacity-100 backdrop-blur-md bg-black/35 pointer-events-auto" : "opacity-0 backdrop-blur-none bg-transparent pointer-events-none",
                ].join(" ")}
            />
        </>
    );
}
