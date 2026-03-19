import Link from "next/link";

interface StoryCardProps {
  category: string;
  title: string;
  excerpt: string;
  thumbnail: string;
  slug: string;
  className?: string;
}

export default function StoryCard({
  category,
  title,
  excerpt,
  thumbnail,
  slug,
  className = ""
}: StoryCardProps) {
  return (
    <Link href={`/stories/${slug}`} className={`group block h-full ${className}`}>
      <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] border border-border group-hover:shadow-2xl transition-all duration-500">
        <img 
          src={thumbnail} 
          alt={title} 
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent p-8 flex flex-col justify-end">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-saffron mb-4">
            {category}
          </span>
          <h3 className="font-serif text-2xl md:text-3xl font-bold text-white mb-4 group-hover:text-muted-saffron transition-colors leading-tight">
            {title}
          </h3>
          <p className="text-white/60 text-xs md:text-sm line-clamp-2 italic leading-relaxed">
            &quot;{excerpt}&quot;
          </p>
        </div>
      </div>
    </Link>
  );
}
