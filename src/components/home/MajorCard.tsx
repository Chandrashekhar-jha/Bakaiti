import Link from "next/link";
import { ArrowRight, LucideIcon } from "lucide-react";

interface MajorCardProps {
  title: string;
  subtitle: string;
  description: string;
  image?: string;
  icon?: LucideIcon;
  href: string;
  label?: string;
  className?: string;
}

export default function MajorCard({
  title,
  subtitle,
  description,
  image,
  icon: Icon,
  href,
  label,
  className = ""
}: MajorCardProps) {
  return (
    <Link href={href} className={`group block h-full ${className}`}>
      <div className="bg-card border border-border rounded-[3rem] overflow-hidden hover:shadow-2xl transition-all duration-500 h-full flex flex-col">
        {image ? (
          <div className="relative aspect-video overflow-hidden">
             <img 
               src={image} 
               alt={title} 
               className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" 
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
             {label && (
               <div className="absolute top-6 left-6 px-4 py-1.5 bg-muted-saffron text-white text-[9px] font-bold uppercase tracking-widest rounded-full">
                 {label}
               </div>
             )}
          </div>
        ) : (
          Icon && (
            <div className="p-8 pb-0">
               <div className="w-16 h-16 rounded-2xl bg-muted-saffron/10 flex items-center justify-center text-muted-saffron mb-6">
                 <Icon className="w-8 h-8" />
               </div>
            </div>
          )
        )}
        
        <div className="p-10 flex flex-col flex-grow">
          <h4 className="text-muted-saffron font-serif italic text-xl mb-2">{subtitle}</h4>
          <h3 className="font-serif text-3xl md:text-4xl font-bold mb-6 group-hover:text-muted-saffron transition-colors leading-tight">
            {title}
          </h3>
          <p className="text-muted text-sm md:text-base leading-relaxed mb-10 flex-grow">
            {description}
          </p>
          
          <div className="flex items-center justify-between pt-8 border-t border-border group">
             <span className="text-[10px] font-bold uppercase tracking-widest text-muted group-hover:text-muted-saffron transition-colors">
               Explore Records
             </span>
             <ArrowRight className="w-5 h-5 text-muted group-hover:text-muted-saffron group-hover:translate-x-2 transition-all" />
          </div>
        </div>
      </div>
    </Link>
  );
}
