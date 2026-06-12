'use client';
import { useState } from 'react';
import { useTheme } from '@/app/providers';

export default function ColorPicker() {
  const { themeColor, setThemeColor } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  
  // Real Estate Industry-Standard palettes
  const premiumRealEstatePalettes = [
    { name: "Homestead (Original)", hex: "#059669", desc: "Suburban Harmony" },
    { name: "Zillow Blue", hex: "#006aff", desc: "Corporate Trust" },
    { name: "Realtor Red", hex: "#d9222a", desc: "Urgency & Action" },
    { name: "Redfin Crimson", hex: "#a6192e", desc: "Deep Professional" },
    { name: "Compass Charcoal", hex: "#1e293b", desc: "Modern Luxury" },
    { name: "Luxury Estate Gold", hex: "#b45309", desc: "High-Tier Agency" },
    { name: "Premium Plum", hex: "#581c87", desc: "Distinctive Spaces" },
    { name: "Sunbelt Orange", hex: "#ea580c", desc: "Bright Climates" }
  ];

  return (
    <>
      {/* 1. MOBILE ONLY: Floating Toggle Button (Hidden on Desktop) */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-full shadow-2xl font-semibold text-xs tracking-wide border border-slate-800 active:scale-95 transition-transform"
      >
        <span className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: themeColor }} />
        {isOpen ? 'Close Branding' : 'Test Branding'}
      </button>

      {/* 2. MAIN CONTAINER: Bottom sheet on Mobile, Floating Card on Desktop */}
      <div className={`
        fixed transition-all duration-300 ease-in-out z-50
        /* Mobile styles (Bottom sheet sliding up) */
        bottom-0 left-0 right-0 bg-white border-t border-slate-200 rounded-t-3xl p-6 shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.1)]
        md:relative md:bottom-auto md:left-auto md:right-auto md:bg-white md:border md:rounded-2xl md:p-4 md:shadow-xl
        ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-full md:translate-y-0 opacity-0 md:opacity-100 hidden md:flex'}
        flex flex-col gap-4 min-w-full md:min-w-[280px]
      `}>
        
        {/* Mobile-only pull indicator bar */}
        <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-1 md:hidden" onClick={() => setIsOpen(false)} />

        <div className="flex justify-between items-start">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Test App Branding</span>
            <p className="text-[11px] text-slate-400 mt-0.5">Simulate competitive brand themes live</p>
          </div>
          {/* Close button for mobile screen space optimization */}
          <button 
            type="button"
            onClick={() => setIsOpen(false)} 
            className="md:hidden text-xs text-slate-400 font-medium px-2 py-1 bg-slate-100 rounded-lg"
          >
            Done
          </button>
        </div>

        {/* Dynamic Responsive Grid: Big buttons on mobile for easy thumb tapping */}
        <div className="grid grid-cols-4 gap-3 my-1">
          {premiumRealEstatePalettes.map((item) => (
            <button
              key={item.hex}
              type="button"
              onClick={() => {
                setThemeColor(item.hex);
                // Optional: uncomment next line if you want drawer to auto-close upon selection on mobile
                // if (window.innerWidth < 768) setIsOpen(false); 
              }}
              className={`w-full aspect-square rounded-2xl md:rounded-xl border relative transition-all duration-200 active:scale-95 group ${
                themeColor.toLowerCase() === item.hex.toLowerCase() 
                  ? 'border-slate-900 ring-4 ring-slate-100 shadow-sm scale-105' 
                  : 'border-slate-200'
              }`}
              style={{ backgroundColor: item.hex }}
              title={item.name}
            >
              {/* Tooltip hidden on mobile touch screens, active on desktop hover */}
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden md:group-hover:block bg-slate-900 text-white text-[10px] py-1 px-2 rounded whitespace-nowrap z-50 shadow-md">
                <strong>{item.name}</strong>: {item.desc}
              </span>

              {/* Selection Indicator dot */}
              {themeColor.toLowerCase() === item.hex.toLowerCase() && (
                <span className="absolute inset-0 m-auto w-2.5 h-2.5 bg-white rounded-full shadow-sm" />
              )}
            </button>
          ))}
        </div>

        {/* Custom Fine-Tuning Color Wheel (Enlarged target space on mobile) */}
        <div className="flex items-center gap-4 pt-3 border-t border-slate-100">
          <input 
            type="color" 
            value={themeColor} 
            onChange={(e) => setThemeColor(e.target.value)}
            className="w-10 h-10 md:w-7 md:h-7 rounded-xl md:rounded-lg cursor-pointer border border-slate-300 overflow-hidden shrink-0"
            id="custom-picker-wheel"
          />
          <label htmlFor="custom-picker-wheel" className="flex flex-col cursor-pointer flex-1">
            <span className="text-sm md:text-xs font-semibold text-slate-700">Custom Brand Wheel</span>
            <span className="text-xs md:text-[10px] text-slate-400 font-mono uppercase">{themeColor}</span>
          </label>
        </div>
      </div>
    </>
  );
}
