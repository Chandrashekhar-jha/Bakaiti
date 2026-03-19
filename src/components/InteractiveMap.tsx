"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { statesData, INDIA_MAP_VIEWBOX } from "@/data/indiaMapData";

export default function InteractiveMap() {
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleStateClick = (stateName: string) => {
    const slug = stateName.toLowerCase().replace(/\s+/g, '-');
    router.push(`/states/${slug}`);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setTooltipPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const activeState = statesData.find(s => s.id === hoveredState);

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full max-w-3xl mx-auto aspect-[0.9/1] bg-white rounded-[3rem] border border-border shadow-2xl p-8 md:p-12 flex flex-col items-center justify-center group overflow-hidden"
    >
      {/* Decorative Grid Background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

      {/* Map Header */}
      <div className="absolute top-8 left-8 md:top-10 md:left-10 z-10">
        <div className="flex items-center gap-3 bg-background/80 backdrop-blur-md border border-border px-5 py-2.5 rounded-full shadow-sm">
          <div className="w-2 h-2 rounded-full bg-muted-saffron animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted">Interactive Archive Map</span>
        </div>
      </div>

      {/* SVG Container */}
      <div className="relative w-full h-full flex items-center justify-center mt-4">
        <svg
          viewBox={INDIA_MAP_VIEWBOX}
          className="w-full h-full transition-all duration-1000 group-hover:scale-[1.05]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <filter id="state-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
              <feOffset dx="0" dy="4" result="offsetblur" />
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.2" />
              </feComponentTransfer>
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Main Map Elements */}
          <g>
            {statesData.map((state) => (
              <motion.path
                key={state.id}
                id={state.id}
                d={state.d}
                initial={{ fill: "#F8FAFC", stroke: "#E2E8F0" }}
                animate={{ 
                  fill: hoveredState === state.id ? "var(--muted-saffron)" : "#FCFDFE",
                  stroke: hoveredState === state.id ? "var(--muted-saffron)" : "#CBD5E1",
                  strokeWidth: hoveredState === state.id ? 2 : 0.8,
                  filter: hoveredState === state.id ? "url(#state-shadow)" : "none",
                  zIndex: hoveredState === state.id ? 50 : 1
                }}
                className="cursor-pointer outline-none touch-none"
                whileHover={{ 
                  scale: 1.015,
                  transition: { duration: 0.3, ease: [0.23, 1, 0.32, 1] }
                }}
                onHoverStart={() => setHoveredState(state.id)}
                onHoverEnd={() => setHoveredState(null)}
                onClick={() => handleStateClick(state.name)}
              />
            ))}
          </g>
        </svg>

        {/* Dynamic Tooltip */}
        <AnimatePresence>
          {hoveredState && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: -20 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              style={{ 
                left: tooltipPos.x, 
                top: tooltipPos.y,
                position: 'absolute',
                transform: 'translate(-50%, -100%)'
              }}
              className="pointer-events-none z-50 bg-foreground text-background px-6 py-3 rounded-2xl shadow-2xl border border-white/10 min-w-[180px] text-center"
            >
              <span className="font-serif text-xl font-bold block leading-tight">
                {activeState?.name}
              </span>
              <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-muted-saffron mt-2 block opacity-80">
                Explore The Story of Power
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Map Footer Info */}
      <div className="mt-8 text-center z-10">
        <h4 className="font-serif text-3xl md:text-4xl font-bold text-foreground tracking-tight h-10">
          {activeState ? activeState.name : "The Republic"}
        </h4>
        <p className="text-[10px] text-muted mt-2 uppercase tracking-[0.3em] font-bold">
          {activeState ? "Select to enter regional archive" : "Interact with the map of India"}
        </p>
      </div>

      {/* Discovery Prompt */}
      <div className="absolute bottom-6 right-8 opacity-40 group-hover:opacity-100 transition-opacity">
         <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted flex items-center gap-2 italic">
            <span className="w-1.5 h-1.5 rounded-full bg-muted-saffron" />
            Click region to begin
         </span>
      </div>
    </div>
  );
}
