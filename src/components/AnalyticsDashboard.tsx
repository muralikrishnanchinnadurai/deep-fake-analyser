import React, { useState, useMemo } from "react";
import { VerificationReport, MediaCategory } from "../types.js";
import { 
  TrendingUp, 
  TrendingDown, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  BarChart3, 
  PieChart as PieIcon, 
  CalendarClock,
  Sparkles,
  RefreshCw
} from "lucide-react";

interface AnalyticsDashboardProps {
  scans: VerificationReport[];
  onTriggerReset?: () => void;
}

export default function AnalyticsDashboard({ scans, onTriggerReset }: AnalyticsDashboardProps) {
  const [timeframe, setTimeframe] = useState<"daily" | "weekly" | "monthly">("monthly");
  const [hoveredSlice, setHoveredSlice] = useState<number | null>(null);

  // Constants mapping representing our fixed timeline limit: June 5, 2026
  const CURRENT_DATE_STR = "2026-06-05T09:31:51Z";
  const currentDate = new Date(CURRENT_DATE_STR);

  // 1. Filter scans based on timeframe
  const filteredScans = useMemo(() => {
    return scans.filter(scan => {
      const scanDate = new Date(scan.scannedAt);
      const diffTime = Math.abs(currentDate.getTime() - scanDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (timeframe === "daily") {
        // Last 24 hours
        return diffDays <= 1;
      } else if (timeframe === "weekly") {
        // Last 7 days
        return diffDays <= 7;
      } else {
        // Last 30 days
        return diffDays <= 30;
      }
    });
  }, [scans, timeframe]);

  // 2. Compute Aggregated Metrics
  const metrics = useMemo(() => {
    const total = filteredScans.length;
    if (total === 0) {
      return { total: 0, aiPercent: 0, avgConfidence: 0, humanPercent: 0 };
    }

    const aiCount = filteredScans.filter(s => s.isAIGenerated).length;
    const aiPercent = Math.round((aiCount / total) * 100);
    const totalConfidence = filteredScans.reduce((acc, current) => acc + current.confidenceScore, 0);
    const avgConfidence = Math.round(totalConfidence / total);
    const humanPercent = 100 - aiPercent;

    return { total, aiPercent, avgConfidence, humanPercent };
  }, [filteredScans]);

  // 3. Category distribution
  const categoriesData = useMemo(() => {
    const total = filteredScans.length;
    
    const countMap: Record<MediaCategory, { total: number; aiCount: number }> = {
      [MediaCategory.NEWS_ARTICLE]: { total: 0, aiCount: 0 },
      [MediaCategory.SOCIAL_MEDIA]: { total: 0, aiCount: 0 },
      [MediaCategory.BLOG_POST]: { total: 0, aiCount: 0 },
      [MediaCategory.PRESS_RELEASE]: { total: 0, aiCount: 0 },
      [MediaCategory.IMAGE_MEDIA]: { total: 0, aiCount: 0 }
    };

    filteredScans.forEach(s => {
      if (countMap[s.category]) {
        countMap[s.category].total += 1;
        if (s.isAIGenerated) {
          countMap[s.category].aiCount += 1;
        }
      }
    });

    const labels: Record<MediaCategory, string> = {
      [MediaCategory.NEWS_ARTICLE]: "News Links",
      [MediaCategory.SOCIAL_MEDIA]: "Social Media",
      [MediaCategory.BLOG_POST]: "Blogs / Threads",
      [MediaCategory.PRESS_RELEASE]: "Press Briefs",
      [MediaCategory.IMAGE_MEDIA]: "Media Images"
    };

    const colors: Record<MediaCategory, string> = {
      [MediaCategory.NEWS_ARTICLE]: "#4F46E5", // Indigo
      [MediaCategory.SOCIAL_MEDIA]: "#0ea5e9", // Sky
      [MediaCategory.BLOG_POST]: "#F43F5E", // Rose
      [MediaCategory.PRESS_RELEASE]: "#10B981", // Emerald
      [MediaCategory.IMAGE_MEDIA]: "#A855F7"  // Purple
    };

    return Object.entries(countMap).map(([cat, stats]) => {
      const percentage = total > 0 ? Math.round((stats.total / total) * 100) : 0;
      return {
        category: cat as MediaCategory,
        label: labels[cat as MediaCategory],
        percentage,
        total: stats.total,
        aiCount: stats.aiCount,
        color: colors[cat as MediaCategory]
      };
    }).filter(d => d.total > 0);
  }, [filteredScans]);

  // 4. Score distribution bands
  const scoreBands = useMemo(() => {
    let band1 = 0; // 0-20%
    let band2 = 0; // 21-50%
    let band3 = 0; // 51-80%
    let band4 = 0; // 81-100%

    filteredScans.forEach(s => {
      if (s.confidenceScore <= 20) band1 += 1;
      else if (s.confidenceScore <= 50) band2 += 1;
      else if (s.confidenceScore <= 80) band3 += 1;
      else band4 += 1;
    });

    const maxCount = Math.max(band1, band2, band3, band4, 1);

    return [
      { label: "0-20% (Human Standard)", count: band1, percent: Math.round((band1 / maxCount) * 100), color: "bg-emerald-500" },
      { label: "21-50% (Assisted Content)", count: band2, percent: Math.round((band2 / maxCount) * 100), color: "bg-teal-500" },
      { label: "51-80% (Likely Generated)", count: band3, percent: Math.round((band3 / maxCount) * 100), color: "bg-orange-500" },
      { label: "81-100% (High AI Flag)", count: band4, percent: Math.round((band4 / maxCount) * 100), color: "bg-red-500" }
    ];
  }, [filteredScans]);

  // 5. Timeline data points (dynamic calculations over timeframe)
  const timelinePoints = useMemo(() => {
    const datesMap: Record<string, { total: number; aiCount: number }> = {};
    
    // Sort scans chronologically
    const sorted = [...filteredScans].sort((a, b) => new Date(a.scannedAt).getTime() - new Date(b.scannedAt).getTime());
    
    sorted.forEach(s => {
      const d = new Date(s.scannedAt);
      let dayName = "";
      if (timeframe === "daily") {
        dayName = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
      } else {
        dayName = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      }
      
      if (!datesMap[dayName]) {
        datesMap[dayName] = { total: 0, aiCount: 0 };
      }
      datesMap[dayName].total += 1;
      if (s.isAIGenerated) {
        datesMap[dayName].aiCount += 1;
      }
    });

    return Object.entries(datesMap).map(([day, stats]) => ({
      day,
      total: stats.total,
      aiCount: stats.aiCount,
      humanCount: stats.total - stats.aiCount
    }));
  }, [filteredScans, timeframe]);

  // Custom Category Donut calculations
  const donutElements = useMemo(() => {
    let accumAngle = 0;
    return categoriesData.map((d, index) => {
      const angle = (d.percentage / 100) * 360;
      const startAngle = accumAngle;
      accumAngle += angle;
      
      // Calculate SVG stroke coordinates
      const x1 = 50 + 40 * Math.cos((startAngle - 90) * Math.PI / 180);
      const y1 = 50 + 40 * Math.sin((startAngle - 90) * Math.PI / 180);
      const x2 = 50 + 40 * Math.cos((accumAngle - 90) * Math.PI / 180);
      const y2 = 50 + 40 * Math.sin((accumAngle - 90) * Math.PI / 180);
      
      const largeArc = angle > 180 ? 1 : 0;
      
      return {
        ...d,
        id: index,
        path: `M ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2}`,
        centerAngle: startAngle + angle / 2
      };
    });
  }, [categoriesData]);

  return (
    <div className="space-y-6">
      
      {/* Selector & Period Metadata */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-slate-800 dark:text-zinc-100 flex items-center gap-1.5 font-sans leading-none">
            <CalendarClock className="w-5 h-5 text-slate-500" />
            Verification Intelligence Report
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Forensic metrics computed over our verified monitoring registry.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-1">
            <button
              onClick={() => setTimeframe("daily")}
              className={`px-3 py-1 text-xs font-bold font-sans rounded-md transition-all ${
                timeframe === "daily" 
                  ? "bg-white dark:bg-slate-850 shadow-xs text-red-600 dark:text-red-400" 
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              Daily
            </button>
            <button
              onClick={() => setTimeframe("weekly")}
              className={`px-3 py-1 text-xs font-bold font-sans rounded-md transition-all ${
                timeframe === "weekly" 
                  ? "bg-white dark:bg-slate-850 shadow-xs text-red-600 dark:text-red-400" 
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              Weekly
            </button>
            <button
              onClick={() => setTimeframe("monthly")}
              className={`px-3 py-1 text-xs font-bold font-sans rounded-md transition-all ${
                timeframe === "monthly" 
                  ? "bg-white dark:bg-slate-850 shadow-xs text-red-600 dark:text-red-400" 
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              Monthly
            </button>
          </div>
          
          {onTriggerReset && (
            <button 
              onClick={onTriggerReset}
              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 hover:text-slate-800 transition-colors"
              title="Reset Database to Seed State"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Grid of counter elements */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Audits Completed */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs relative overflow-hidden">
          <div className="flex justify-between items-start text-slate-400">
            <span className="text-[10px] uppercase font-bold tracking-wider font-sans">Total Content Audited</span>
            <FileText className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black font-mono text-slate-950 dark:text-white leading-none">
              {metrics.total}
            </span>
            <span className="text-xs text-slate-500 font-mono">files/URLs</span>
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-sm w-fit">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>2.4% vs prev week</span>
          </div>
        </div>

        {/* AI Detected Flag Index */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs relative overflow-hidden">
          <div className="flex justify-between items-start text-slate-400">
            <span className="text-[10px] uppercase font-bold tracking-wider font-sans">AI Content Detected</span>
            <AlertTriangle className="w-4 h-4 text-red-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black font-mono text-red-650 dark:text-red-400 leading-none">
              {metrics.aiPercent}%
            </span>
            <span className="text-xs text-slate-500 font-mono">density</span>
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-red-600 bg-red-40/10 px-2 py-0.5 rounded-sm w-fit">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+0.8% inflation</span>
          </div>
        </div>

        {/* Average Verification Confidence */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs relative overflow-hidden">
          <div className="flex justify-between items-start text-slate-400">
            <span className="text-[10px] uppercase font-bold tracking-wider font-sans">Avg Confidence Score</span>
            <Sparkles className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black font-mono text-slate-950 dark:text-white leading-none">
              {metrics.avgConfidence}%
            </span>
            <span className="text-xs text-slate-500 font-mono">avg</span>
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-sm w-fit">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>High audit fidelity</span>
          </div>
        </div>

        {/* Organic Safe Content index */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs relative overflow-hidden">
          <div className="flex justify-between items-start text-slate-400">
            <span className="text-[10px] uppercase font-bold tracking-wider font-sans">Organic Safety Ratio</span>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black font-mono text-emerald-600 dark:text-emerald-450 leading-none">
              {metrics.humanPercent}%
            </span>
            <span className="text-xs text-slate-500 font-mono">safe</span>
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded-sm w-fit">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>-1.2% reduction</span>
          </div>
        </div>

      </div>

      {filteredScans.length === 0 ? (
        <div className="text-center p-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
          <AlertTriangle className="w-8 h-8 text-slate-400 mx-auto mb-3" />
          <p className="text-sm text-slate-600">No scanned historical entries recorded in this timeline window.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main timeline Line Chart panel */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col justify-between">
            <div className="space-y-1 pb-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300 font-sans flex items-center gap-1">
                <BarChart3 className="w-4 h-4 text-red-600" />
                Audit activity and threat velocity history
              </h3>
              <p className="text-xs text-slate-400">Volume tracking comparison of human-authentic versus model-synthesized detections.</p>
            </div>

            {/* Custom SVG Line Chart */}
            <div id="timeline-svg-holder" className="relative w-full h-56 flex items-end">
              {timelinePoints.length > 1 ? (
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  {/* Grid Lines */}
                  <line x1="0" y1="20" x2="100" y2="20" stroke="#E2E8F0" strokeWidth="0.5" strokeDasharray="3,3" className="dark:stroke-slate-800" />
                  <line x1="0" y1="50" x2="100" y2="50" stroke="#E2E8F0" strokeWidth="0.5" strokeDasharray="3,3" className="dark:stroke-slate-800" />
                  <line x1="0" y1="80" x2="100" y2="80" stroke="#E2E8F0" strokeWidth="0.5" strokeDasharray="3,3" className="dark:stroke-slate-800" />
                  
                  {/* Points calculations */}
                  {(() => {
                    const maxCount = Math.max(...timelinePoints.map(p => Math.max(p.total, 4)));
                    const xInterval = 100 / (timelinePoints.length - 1);
                    
                    // Human line points
                    const humanPointsStr = timelinePoints.map((p, i) => {
                      const x = i * xInterval;
                      const y = 90 - (p.humanCount / maxCount) * 80;
                      return `${x},${y}`;
                    }).join(" ");

                    // AI line points
                    const aiPointsStr = timelinePoints.map((p, i) => {
                      const x = i * xInterval;
                      const y = 90 - (p.aiCount / maxCount) * 80;
                      return `${x},${y}`;
                    }).join(" ");

                    return (
                      <>
                        {/* Human Path */}
                        <polyline
                          fill="none"
                          stroke="#10B981"
                          strokeWidth="2.5"
                          points={humanPointsStr}
                        />
                        {/* AI Path */}
                        <polyline
                          fill="none"
                          stroke="#EF4444"
                          strokeWidth="2.5"
                          points={aiPointsStr}
                        />

                        {/* Interactive dots representing nodes */}
                        {timelinePoints.map((p, i) => {
                          const x = i * xInterval;
                          const yHuman = 90 - (p.humanCount / maxCount) * 80;
                          const yAi = 90 - (p.aiCount / maxCount) * 80;
                          return (
                            <g key={i} className="hover:opacity-100">
                              <circle cx={x} cy={yHuman} r="2.5" fill="#10B981" stroke="#fff" strokeWidth="0.5" />
                              <circle cx={x} cy={yAi} r="2.5" fill="#EF4444" stroke="#fff" strokeWidth="0.5" />
                            </g>
                          );
                        })}
                      </>
                    );
                  })()}
                </svg>
              ) : (
                <div className="m-auto text-xs text-slate-400">Plotting timeline vectors require more data nodes (Run scans to populate).</div>
              )}
            </div>

            {/* Custom SVG Line X Legend */}
            <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono mt-2 border-t border-slate-100 dark:border-slate-800 pt-2 px-1">
              {timelinePoints.map((p, idx) => (
                <span key={idx} className="truncate max-w-[55px]">{p.day}</span>
              ))}
            </div>

            {/* Legend indicators */}
            <div className="flex gap-4 items-center justify-center text-xs mt-3 pt-2">
              <span className="inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                Verified Organic (Human)
              </span>
              <span className="inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
                Detected Generative (AI)
              </span>
            </div>
          </div>

          {/* Category Donut chart panel */}
          <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col justify-between">
            <div className="space-y-1 pb-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300 font-sans flex items-center gap-1">
                <PieIcon className="w-4 h-4 text-red-600" />
                Threat Vectors by Categories
              </h3>
              <p className="text-xs text-slate-400">Channel percentage breakdown of verification cases completed.</p>
            </div>

            {/* Custom SVG Donut Component */}
            <div className="flex items-center justify-center relative py-2">
              <div className="relative w-40 h-40">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  {categoriesData.length > 0 ? (
                    donutElements.map((slice, idx) => (
                      <path
                        key={idx}
                        d={slice.path}
                        fill="none"
                        stroke={slice.color}
                        strokeWidth={hoveredSlice === idx ? "12" : "8"}
                        className="transition-all duration-300 cursor-pointer"
                        onMouseEnter={() => setHoveredSlice(idx)}
                        onMouseLeave={() => setHoveredSlice(null)}
                      />
                    ))
                  ) : (
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#E2E8F0" strokeWidth="6" />
                  )}
                </svg>

                {/* Information centered inside Donut hole */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  {hoveredSlice !== null && categoriesData[hoveredSlice] ? (
                    <>
                      <span className="text-xs font-bold font-mono text-slate-600 dark:text-slate-300 truncate max-w-[90px]">
                        {categoriesData[hoveredSlice].label}
                      </span>
                      <span className="text-lg font-black font-sans text-slate-850 dark:text-white leading-none mt-0.5">
                        {categoriesData[hoveredSlice].percentage}%
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-lg font-black font-sans text-slate-850 dark:text-white leading-none">
                        {categoriesData.length}
                      </span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase mt-0.5 leading-none">
                        Active Segments
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Micro Legenda elements */}
            <div className="space-y-1.5 pt-3">
              {categoriesData.map((d, idx) => (
                <div 
                  key={idx} 
                  className={`flex items-center justify-between text-xs p-1 rounded-md transition-colors ${
                    hoveredSlice === idx ? "bg-slate-50 dark:bg-slate-800" : ""
                  }`}
                  onMouseEnter={() => setHoveredSlice(idx)}
                  onMouseLeave={() => setHoveredSlice(null)}
                >
                  <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                    <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: d.color }} />
                    {d.label}
                  </span>
                  <span className="font-mono text-slate-800 dark:text-slate-200">
                    <span className="font-bold">{d.total}</span>
                    <span className="text-[10px] text-slate-400 ml-1">({d.percentage}%)</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Forensic Score Band groupings rating tiers */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
        <div className="space-y-1 pb-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300 font-sans">
            Score Distribution Banding Statistics
          </h3>
          <p className="text-xs text-slate-400">Quantity breakdown mapping the scan samples along structural forensic reliability groups.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-1">
          {scoreBands.map((band, idx) => (
            <div key={idx} className="space-y-2 border border-slate-100 dark:border-slate-800 p-3 bg-slate-50/40 dark:bg-slate-900/40 rounded-lg">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-400">{band.label}</span>
                <span className="font-mono font-bold font-sans text-slate-805 dark:text-slate-100">x{band.count}</span>
              </div>
              
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${band.color}`} 
                  style={{ width: `${band.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
