type Props = {
    name: string;
    title: string;
    image: string;
    linkedin?: string;
};

export default function TeamCard({ name, title, image, linkedin }: Props) {
    return (
        <div className="shrink-0 w-full">
            <div className="overflow-hidden mb-4">
                <img
                    src={image}
                    alt={name}
                    loading="lazy"
                    className="w-full aspect-3/4 object-cover object-top"
                />
            </div>
            <h3 className="text-2xl font-bold uppercase tracking-wide text-black">
                {name}
            </h3>
            <p className="text-xs font-bold text-black mt-1">
                {title}
            </p>
            {linkedin && (
                <a
                    href={linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`LinkedIn de ${name}`}
                    className="inline-flex mt-2 text-black/40 hover:text-black transition-colors duration-300"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        className="size-5 fill-current"
                        aria-hidden="true"
                    >
                        <path d="M6.94 5a2 2 0 1 1-4-.002a2 2 0 0 1 4 .002M7 8.48H3V21h4zm6.32 0H9.34V21h3.94v-6.57c0-3.66 4.77-4 4.77 0V21H22v-7.93c0-6.17-7.06-5.94-8.72-2.91z" />
                    </svg>
                </a>
            )}
        </div>
    );
}
