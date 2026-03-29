type Props = {
    name: string;
    title: string;
    image: string;
};

export default function TeamCard({ name, title, image }: Props) {
    return (
        <div className="shrink-0 w-full">
            <div className="overflow-hidden mb-4">
                <img
                    src={image}
                    alt={name}
                    className="w-full aspect-3/4 object-cover object-top"
                />
            </div>
            <h3 className="text-2xl font-bold uppercase tracking-wide text-black">
                {name}
            </h3>
            <p className="text-xs font-bold text-black mt-1">
                {title}
            </p>
        </div>
    );
}
