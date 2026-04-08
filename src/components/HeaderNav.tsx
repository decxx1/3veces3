import { useState, useEffect, useRef } from "react";

const NAV_LINKS = [
    { href: "/proyectos", label: "Proyectos" },
    { href: "/servicios", label: "Servicios" },
    { href: "/contacto", label: "Contacto" },
];

//esto está deshabilitado, es para poner las letras y logo de color negro al inicio por si tenemos un hero blanco
const LIGHT_BG_PATHS = ["/proyectos2@"]; 
const normalizePath = (p: string) => p.replace(/\/$/, "") || "/";

interface Props {
    pathname: string;
}

export default function HeaderNav({ pathname: initialPathname }: Props) {
    const [scrolled, setScrolled] = useState(false);
    const prevScrolled = useRef(false);
    const firstTime = useRef(true);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [linksVisible, setLinksVisible] = useState(false);
    const [pathname, setPathname] = useState(normalizePath(initialPathname));
    const [animateUnderline, setAnimateUnderline] = useState(true);
    const lightBg = LIGHT_BG_PATHS.includes(pathname);
    const [isHeaderVisible, setIsHeaderVisible] = useState(true);
    const mobileOpenRef = useRef(mobileOpen);

    useEffect(() => {
        mobileOpenRef.current = mobileOpen;
    }, [mobileOpen]);

    useEffect(() => {
        let timeoutId: number | undefined;

        const handleActivity = () => {
            setIsHeaderVisible(true);
            clearTimeout(timeoutId);
            
            timeoutId = setTimeout(() => {
                // Solo ocultar si se ha scrolleado y no está el menú móvil abierto
                if (window.scrollY > 60 && !mobileOpenRef.current) {
                    setIsHeaderVisible(false);
                }
            }, 2000); // 2 segundos de inactividad para desaparecer
        };

        handleActivity();

        window.addEventListener("scroll", handleActivity, { passive: true });
        
        // También mostrar el header si el usuario acerca el mouse arriba
        const handleMouseMove = (e: MouseEvent) => {
            if (e.clientY < 120) {
                handleActivity();
            }
        };
        window.addEventListener("mousemove", handleMouseMove, { passive: true });

        return () => {
            window.removeEventListener("scroll", handleActivity);
            window.removeEventListener("mousemove", handleMouseMove);
            clearTimeout(timeoutId);
        };
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 60;
            
            if(!isScrolled && firstTime.current) {
                firstTime.current = false;
                setLinksVisible(true);

                return;
            }

            if(isScrolled && firstTime.current) {
                setScrolled(isScrolled);
                prevScrolled.current = isScrolled;
                firstTime.current = false;
                setLinksVisible(true);

                return;
            }

            firstTime.current = false;

            if (isScrolled !== prevScrolled.current) {
                prevScrolled.current = isScrolled;
                setLinksVisible(false);
                setTimeout(() => {
                    setScrolled(isScrolled);
                    setTimeout(() => setLinksVisible(true), 80);
                }, 150);

                return;
            }

            return;
        };

        handleScroll();

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (scrolled) setMobileOpen(false);
    }, [scrolled]);

    useEffect(() => {
        const onBeforeSwap = () => {
            setAnimateUnderline(false);
            setPathname("");
        };
        const onPageLoad = () => {
            // pathname se setea sin animación (animateUnderline sigue false)
            setPathname(normalizePath(window.location.pathname));
        };
        document.addEventListener("astro:before-swap", onBeforeSwap);
        document.addEventListener("astro:page-load", onPageLoad);
        return () => {
            document.removeEventListener("astro:before-swap", onBeforeSwap);
            document.removeEventListener("astro:page-load", onPageLoad);
        };
    }, []);

    // Una vez que pathname tiene el valor nuevo y animateUnderline=false,
    // activamos la animación en el siguiente frame para que CSS la vea
    useEffect(() => {
        if (!animateUnderline && pathname !== "") {
            const id = requestAnimationFrame(() => setAnimateUnderline(true));
            return () => cancelAnimationFrame(id);
        }
    }, [animateUnderline, pathname]);

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        setMobileOpen(false);
        if (href.startsWith("#")) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) target.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <>
            <header 
                className={[
                    "fixed top-0 w-full z-50",
                    isHeaderVisible || mobileOpen
                        ? "opacity-100 translate-y-0 transition-all duration-200 ease-out"
                        : "opacity-0 -translate-y-4 pointer-events-none transition-all duration-1000 ease-in"
                ].join(" ")}
            >
                {/* Nav pill */}
                <nav
                    className={[
                        "container max-w-6xl mx-auto flex items-center justify-between px-8 transition-transform duration-400 ease-in-out",
                        scrolled
                            ? "mt-4 py-2.5 rounded-full bg-black/60 backdrop-blur-3xl outline-1 outline-white/8"
                            : "mt-0 py-6 rounded-none bg-transparent outline-1 outline-transparent",
                    ].join(" ")}
                >
                    {/* Logo */}
                    <a
                        href="/"
                        className={[
                            "relative block shrink-0 transition-[width] duration-450",
                            scrolled ? "w-15" : "w-28",
                        ].join(" ")}
                        style={{ transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)" }}
                    >
                        {/* Logo icono — visible sin scroll */}
                        <img
                            src="/images/logos/tresvecestres/logo-blanco-letras.svg"
                            alt="Tres Veces Tres logo con letras"
                            loading="lazy"
                            className={[
                                "block w-full transition-[opacity,transform]",
                                !scrolled && linksVisible ? "opacity-100 duration-400" : "opacity-0 duration-100",
                                !scrolled && lightBg ? "invert" : "",
                            ].join(" ")}
                            style={{ transitionTimingFunction: scrolled ? "ease" : "cubic-bezier(0.34, 1.56, 0.64, 1)" }}
                        />
                        {/* Logo con letras — visible con scroll */}
                        <img
                            src="/images/logos/tresvecestres/logo-blanco-letras.svg"
                            loading="lazy"
                            alt="Tres Veces Tres logo con letras"
                            aria-hidden="true"
                            className={[
                                "absolute inset-0 block w-full transition-[opacity,transform]",
                                scrolled && linksVisible ? "opacity-100 duration-400" : "opacity-0 duration-100",
                            ].join(" ")}
                        />
                    </a>

                    {/* Nav links — desktop */}
                    <ul className={`hidden md:flex gap-10 text-sm font-semibold tracking-widest uppercase ${scrolled ? "text-white" : lightBg ? "text-black" : "text-white"}`}>
                        {NAV_LINKS.map((link, i) => {
                            const isActive = pathname === link.href;
                            return (
                                <li
                                    key={link.href}
                                    className={`
                                        ${linksVisible 
                                            ? "transition-[opacity,transform] opacity-100 translate-y-0 duration-400 delay-100" 
                                            : "transition-opacity opacity-0 -translate-y-2.5 duration-0 delay-0"
                                        }
                                    `}
                                >
                                    <a
                                        href={link.href}
                                        onClick={(e) => handleNavClick(e, link.href)}
                                        className="group relative pb-0.5"
                                    >
                                        {link.label}
                                        <span
                                            className={[
                                                "absolute bottom-0 left-0 h-0.5 w-full origin-center rounded-full group-hover:scale-x-50",
                                                isActive ? "scale-x-50" : "scale-x-0",
                                                animateUnderline ? "transition-transform duration-300 ease-out" : "transition-none",
                                            ].join(" ")}
                                            style={{ backgroundColor: "currentColor" }}
                                            aria-hidden="true"
                                        />
                                    </a>
                                </li>
                            );
                        })}
                    </ul>

                    {/* Hamburger — mobile */}
                    <button
                        onClick={() => setMobileOpen((o) => !o)}
                        className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5 focus:outline-none"
                        aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
                        aria-expanded={mobileOpen}
                    >
                        <span
                            className={`block w-6 h-0.5 rounded-full transition-transform duration-300 ${scrolled || !lightBg ? "bg-white" : "bg-black"}`}
                            style={{
                                transform: mobileOpen ? "rotate(45deg) translate(6px, 6px)" : "none",
                                transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)",
                            }}
                        />
                        <span
                            className={`block w-6 h-0.5 rounded-full transition-[opacity,transform] duration-300 ${scrolled || !lightBg ? "bg-white" : "bg-black"}`}
                            style={{
                                opacity: mobileOpen ? 0 : 1,
                                transform: mobileOpen ? "scaleX(0)" : "scaleX(1)",
                            }}
                        />
                        <span
                            className={`block w-6 h-0.5 rounded-full transition-transform duration-300 ${scrolled || !lightBg ? "bg-white" : "bg-black"}`}
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
                                    transitionTimingFunction: "ease, cubic-bezier(0.34, 1.56, 0.64, 1)",
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
