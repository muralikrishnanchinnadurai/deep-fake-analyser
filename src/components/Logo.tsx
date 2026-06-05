import React from "react";

export default function Logo() {
  return (
    <div id="media-logo-container" className="flex flex-col items-center select-none font-sans scale-90 sm:scale-100">
      {/* "THE" portion */}
      <div 
        id="logo-top-the" 
        className="bg-[#1E293B] text-slate-100 px-3.5 py-0.5 text-[10px] sm:text-xs tracking-[0.25em] font-black rounded-sm border border-slate-700 font-mono shadow-xs"
      >
        THE
      </div>
      
      {/* "MEDIA" portion with custom styled fingerprint inner D */}
      <div 
        id="logo-mid-media" 
        className="flex items-center text-4xl sm:text-5xl font-black tracking-tighter my-0.5 text-red-600 dark:text-red-500"
      >
        <span className="font-sans leading-none pr-0.5">ME</span>
        
        {/* MAGNIFYING GLASS & RED FINGERPRINT IN 'D' */}
        <span className="relative inline-flex items-center justify-center mx-1">
          {/* The 'D' outer circle with handle */}
          <span 
            className="relative w-11 h-11 sm:w-13 sm:h-13 bg-red-600 dark:bg-red-500 rounded-full flex items-center justify-center p-0.5 shadow-sm"
          >
            {/* White Lens inside */}
            <span 
              className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center overflow-hidden"
            >
              {/* Red Fingerprint Vector */}
              <svg 
                viewBox="0 0 100 100" 
                className="w-18 h-18 text-red-600 dark:text-red-500 fill-current"
              >
                <path d="M50,10 C40,10 32,18 32,28 C32,29.1 32.9,30 34,30 C35.1,30 36,29.1 36,28 C36,20.3 42.3,14 50,14 C57.7,14 64,20.3 64,28 C64,29.1 64.9,30 66,30 C67.1,30 68,29.1 68,28 C68,18 60,10 50,10 Z" />
                <path d="M50,20 C45.6,20 42,23.6 42,28 C42,32.4 45.6,36 50,36 C54.4,36 58,32.4 58,28 C58,23.6 54.4,20 50,20 Z M50,32 C47.8,32 46,30.2 46,28 C46,25.8 47.8,24 50,24 C52.2,24 54,25.8 54,28 C54,30.2 52.2,32 50,32 Z" />
                <path d="M50,0 C34.5,0 22,12.5 22,28 C22,34.1 24,39.7 27.3,44.3 C27.9,45.2 29.1,45.4 30,44.7 C30.9,44.1 31.1,42.9 30.5,42 C27.6,38.1 26,33.2 26,28 C26,14.8 36.8,4 50,4 C63.2,4 74,14.8 74,28 C74,33.2 72.4,38.1 69.5,42 C68.9,42.9 69.1,44.1 70,44.7 C70.9,45.4 72.1,45.2 72.7,44.3 C76,39.7 78,34.1 78,28 C78,12.5 65.5,0 50,0 Z" />
                <circle cx="50" cy="28" r="4" />
                <path d="M46,40 C43.2,40 40,38 38,34 C37.5,33 36.3,32.6 35.3,33.1 C34.3,33.6 33.9,34.8 34.4,35.8 C37,41 41.2,44 46,44 C47.1,44 48,43.1 48,42 C48,40.9 47.1,40 46,40 Z" />
                <path d="M54,40 C52.9,40 52,40.9 52,42 C52,43.1 52.9,44 54,44 C58.8,44 63,41 65.6,35.8 C66.1,34.8 65.7,33.6 64.7,33.1 C63.7,32.6 62.5,33 62,34 C60,38 56.8,40 54,40 Z" />
              </svg>
            </span>
            {/* White Lens glare reflection */}
            <span className="absolute top-1 right-2 w-2.5 h-2.5 bg-white opacity-40 rounded-full"></span>
          </span>
          {/* Magnifying glass handle stick extending bottom-left inside frame */}
          <span 
            className="absolute -bottom-1 -left-2.5 w-4.5 h-2.5 bg-red-600 dark:bg-red-500 border border-slate-100 rotate-45 rounded-sm shadow-xs"
          />
        </span>
        
        <span className="font-sans leading-none pl-0.5">IA</span>
      </div>

      {/* "MONITORING" portion */}
      <div 
        id="logo-bottom-monitoring" 
        className="bg-[#1E293B] text-slate-100 px-5 py-0.5 text-[9px] sm:text-[10px] tracking-[0.380em] font-extrabold rounded-sm border border-slate-700 font-sans shadow-sm"
      >
        MONITORING
      </div>
    </div>
  );
}
