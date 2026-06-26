import { useEffect, useRef, useState } from "react";
import TeamCard from "./TeamCard";

const members = [
    {
        name: "Fausto Manrique",
        title: "Co - Fundador | Director de Marketing",
        image: "/images/equipo/fausto.webp",
    },
    {
        name: "Martina Bustos",
        title: "Co - Fundadora | Directora de Comunicación",
        image: "/images/equipo/martina.webp",
    },
    {
        name: "Yasmina Muñoz",
        title: "Diseñadora Gráfica Senior",
        image: "/images/equipo/yasmina.webp",
    },
    {
        name: "Natalia Baro",
        title: "Gestora de Proyectos de Triple Impacto",
        image: "/images/equipo/natalia.webp",
    },
    {
        name: "Agostina Cardenas",
        title: "Comunicadora Social",
        image: "/images/equipo/agostina.webp",
    },
];

export default function TeamCarousel() {
    const [page, setPage] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const [started, setStarted] = useState(false);
    const [transitioning, setTransitioning] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // desktop: ventana de 2, páginas = members.length - 1
    // mobile:  ventana de 1, páginas = members.length
    const perPage = isMobile ? 1 : 2;
    const totalPages = members.length - perPage + 1;

    useEffect(() => {
        const mq = window.matchMedia("(max-width: 639px)");
        setIsMobile(mq.matches);
        const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
        mq.addEventListener("change", handler);
        return () => mq.removeEventListener("change", handler);
    }, []);

    // Clamp page cuando cambia perPage
    useEffect(() => {
        setPage((p) => Math.min(p, totalPages - 1));
    }, [totalPages]);

    // IntersectionObserver
    useEffect(() => {
        const el = sectionRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
            { threshold: 0.4 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [started]);

    // Auto-play: avanza y vuelve al inicio al llegar al final
    useEffect(() => {
        if (!started) return;
        timerRef.current = setTimeout(() => {
            setPage((p) => (p + 1) % totalPages);
        }, 5000);
        return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    }, [started, page, totalPages]);

    function goTo(p: number) {
        if (transitioning || p === page) return;
        if (timerRef.current) clearTimeout(timerRef.current);
        setTransitioning(true);
        setPage(p);
        setTimeout(() => setTransitioning(false), 500);
    }

    // El track se desplaza: cada "slide" ocupa 100%/perPage del viewport del track
    // El offset es page * (100% / perPage)
    const offsetPct = page * (100 / perPage);

    return (
        <div ref={sectionRef} className="flex flex-col items-end gap-6">

            {/* Viewport: oculta lo que se sale */}
            <div className="w-full overflow-hidden">
                {/*
                    Track: contiene TODAS las cards en fila.
                    Ancho total = members.length * (100% / perPage)
                    Cada card ocupa 1 slot = 100% / perPage del viewport
                */}
                <div
                    className="flex"
                    style={{
                        width: `${(members.length / perPage) * 100}%`,
                        transform: `translateX(-${offsetPct / (members.length / perPage)}%)`,
                        transition: started
                            ? "transform 0.55s cubic-bezier(0.77, 0, 0.175, 1)"
                            : "none",
                    }}
                >
                    {members.map((m, i) => (
                        <div
                            key={m.name}
                            style={{ width: `${100 / members.length}%` }}
                            className="px-3"
                        >
                            <TeamCard name={m.name} title={m.title} image={m.image} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Dots */}
            <div className="flex gap-2">
                {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                        key={i}
                        onClick={() => goTo(i)}
                        aria-label={`Página ${i + 1}`}
                        className={`h-2 rounded-full transition-all duration-300 ${i === page
                                ? "w-6 bg-gray-900"
                                : "w-2 bg-gray-300 hover:bg-gray-400"
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}
