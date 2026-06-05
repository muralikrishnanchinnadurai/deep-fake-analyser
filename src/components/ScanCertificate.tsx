import React from "react";
import { VerificationReport, MediaCategory } from "../types.js";
import { 
  ShieldCheck, 
  ShieldAlert, 
  Calendar, 
  ExternalLink, 
  FileText, 
  Download, 
  FileCode, 
  Printer, 
  Sparkles,
  Info
} from "lucide-react";

interface ScanCertificateProps {
  report: VerificationReport;
  onClose?: () => void;
}

export default function ScanCertificate({ report, onClose }: ScanCertificateProps) {
  const isAi = report.isAIGenerated;
  const score = report.confidenceScore;
  
  // Format dates
  const formattedDate = new Date(report.scannedAt).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  // Calculate dynamic colors
  const scoreColor = isAi ? "text-red-500 stroke-red-500 bg-red-50 dark:bg-red-950/20" : "text-emerald-500 stroke-emerald-500 bg-emerald-50 dark:bg-emerald-950/20";
  const scoreBorderColor = isAi ? "border-red-200 dark:border-red-900/50" : "border-emerald-200 dark:border-emerald-900/50";
  const scoreProgressColor = isAi ? "bg-red-500" : "bg-emerald-500";
  
  // Clean category names
  const getCategoryLabel = (cat: MediaCategory) => {
    switch (cat) {
      case MediaCategory.NEWS_ARTICLE: return "News Article Content";
      case MediaCategory.SOCIAL_MEDIA: return "Social Media Thread";
      case MediaCategory.BLOG_POST: return "Blog Content Piece";
      case MediaCategory.PRESS_RELEASE: return "Corporate Press Release";
      case MediaCategory.IMAGE_MEDIA: return "Synthetic Visual Image";
      default: return "General Media Asset";
    }
  };

  // SVG Gauge calculations
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  // Export functions
  const downloadMarkdown = () => {
    const md = `
# THE MEDIA MONITORING - CONTENT VERIFICATION REPORT
=====================================================
REPORT STATE ID: ${report.id}
AUDITED TIMESTAMP: ${formattedDate}
MEDIA CATEGORY: ${getCategoryLabel(report.category)}
-----------------------------------------------------

## 1. SUMMARY VERDICT
- **Synthetic (AI-Generated) Probability**: ${score}%
- **Resolution Verdict**: ${isAi ? "FLAGGED: SYNTHETIC / COGNITIVELY MASS-PRODUCED" : "APPROVED: ORGANIC HUMAN-AUTHORED CONTENT"}
- **Recommended Action**: ${report.recommendedAction}

## 2. SOURCE CONTENT ATTR
- **Method / Channel**: ${report.sourceType.toUpperCase()}
- **Identifier**: ${report.sourceValue}

## 3. FORENSIC INDEX ANALYSIS
- **Linguistic Authenticity**: ${report.forensicBreakdown.linguisticAuthenticity}/100 
  *(High: high vocabulary variation, organic sentence lengths)*
- **Semantic / Narrative Consistency**: ${report.forensicBreakdown.semanticConsistency}/100
  *(High: logical continuity, absence of structural oxymorons)*
- **Real-world Grounding Index**: ${report.forensicBreakdown.factualGrounding}/100
  *(High: corresponds perfectly with external scientific registers)*
- **Technical Coherence / Artifact Scan**: ${report.forensicBreakdown.technicalCoherence}/100
  *(High: consistent grammar parsing or pixel-level camera metadata)*

## 4. APPLIED DETECTION METHODOLOGIES
${report.methodology.map(m => `- ${m}`).join("\n")}

## 5. REPORTERS DETAILED RECORD FINDINGS
${report.detailedFindings.map((f, idx) => `${idx + 1}. ${f}`).join("\n")}

## 6. CLAIMS FACT-CHECK BLOCK
${report.factCheckingClaims.length > 0 ? report.factCheckingClaims.map((c, idx) => `
### Claim #${idx + 1}: "${c.claim}"
- **Verdict**: [${c.verdict.toUpperCase()}]
- **Verification Source Reference**: ${c.source || "General forensic cross-checking"}
- **Forensic Assessment**: ${c.explanation}
`).join("\n") : "- No critical factual assertions compiled in audit."}

-----------------------------------------------------
*This certificate registers verified forensic evaluations via deep neural stylometrics and search engine database grounding under 'The Media Monitoring' guidelines.*
`;

    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `MediaMonitor_Audit_${report.id}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const downloadJSON = () => {
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `MediaMonitor_Audit_${report.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const triggerPrint = () => {
    window.print();
  };

  return (
    <div id={`report-card-${report.id}`} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-lg overflow-hidden transition-all print:border-none print:shadow-none">
      {/* Printable Area Wrapper */}
      <div className="p-6 md:p-8 space-y-6">
        
        {/* Certificate Header Print-Only style */}
        <div className="hidden print:flex flex-col items-center justify-center text-center space-y-2 mb-6 border-b border-slate-200 pb-6">
          <h1 className="text-2xl font-black tracking-tight text-slate-900">THE MEDIA MONITORING</h1>
          <p className="text-xs text-slate-500 font-mono">CONTENT FORENSIC AUDIT RECORD & INTEGRITY BADGE</p>
          <div className="text-[10px] text-slate-400">ID: {report.id} • Scanned: {formattedDate}</div>
        </div>

        {/* Dynamic Interactive Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 print:hidden">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold uppercase px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {getCategoryLabel(report.category)}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                #{report.id}
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
              {report.title}
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mt-2">
              <Calendar className="w-3.5 h-3.5" />
              <span>Scanned {formattedDate}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={downloadMarkdown} 
              id="btn-export-md"
              className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors tooltip"
              title="Download Markdown Report"
            >
              <Download className="w-4.5 h-4.5" />
            </button>
            <button 
              onClick={downloadJSON} 
              id="btn-export-json"
              className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
              title="Download JSON Payload"
            >
              <FileCode className="w-4.5 h-4.5" />
            </button>
            <button 
              onClick={triggerPrint} 
              id="btn-trigger-print"
              className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
              title="Print Certificate"
            >
              <Printer className="w-4.5 h-4.5" />
            </button>
            {onClose && (
              <button 
                onClick={onClose}
                className="ml-2 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800 text-sm font-medium text-slate-600 dark:text-slate-300"
              >
                Close
              </button>
            )}
          </div>
        </div>

        {/* Source metadata indicators */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg flex flex-col md:flex-row md:items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-mono">
            <span className="font-bold">INTEGRITY CHANNEL:</span>
            <span className="bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 px-1.5 py-0.5 rounded-sm uppercase">
              {report.sourceType}
            </span>
          </div>
          <div className="flex-1 truncate font-mono text-slate-600 dark:text-slate-300">
            {report.sourceValue.startsWith("http") ? (
              <a 
                href={report.sourceValue} 
                target="_blank" 
                rel="noreferrer" 
                className="text-red-600 hover:underline inline-flex items-center gap-1 font-semibold"
              >
                {report.sourceValue}
                <ExternalLink className="w-3 h-3" />
              </a>
            ) : (
              <span className="font-mono">{report.sourceValue}</span>
            )}
          </div>
        </div>

        {/* Primary Forensic Dashboard Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Circular Forensic Gauge Dial */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 border border-slate-100 dark:border-slate-800/80 rounded-xl bg-slate-50/50 dark:bg-slate-850/50">
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-ful h-full -rotate-90" viewBox="0 0 120 120">
                {/* Background Ring */}
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  className="stroke-slate-100 dark:stroke-slate-800 fill-none"
                  strokeWidth="10"
                />
                {/* Score Progress Ring */}
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  className={`${scoreColor} fill-none transition-all duration-1000 ease-out`}
                  strokeWidth="10"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                />
              </svg>
              {/* Score text inside Gauge */}
              <div className="absolute text-center space-y-0.5">
                <span className="text-3xl font-black tracking-tight text-slate-800 dark:text-slate-100 font-mono">
                  {score}%
                </span>
                <span className="block text-[9px] uppercase tracking-wider text-slate-400 font-bold font-sans">
                  SYNTHETIC PROB
                </span>
              </div>
            </div>

            <div className="mt-4 text-center">
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase shadow-2xs ${
                isAi 
                  ? "bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border border-red-200/50 dark:border-red-900/50" 
                  : "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-900/50"
              }`}>
                {isAi ? <ShieldAlert className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                {isAi ? "Flagged: Synthetic Media" : "Approved: Organic Human"}
              </span>
            </div>
          </div>

          {/* Forensic breakdown dimension sliders */}
          <div className="lg:col-span-8 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 font-sans flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-red-600 dark:text-red-500" />
              Forensic Spectrum breakdown
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Linguistic Authenticity */}
              <div className="space-y-1 p-3 bg-slate-50/50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800/40 rounded-lg">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">Linguistic Authenticity</span>
                  <span className="font-bold font-mono text-slate-800 dark:text-slate-100">{report.forensicBreakdown.linguisticAuthenticity}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-500 transition-all duration-700" 
                    style={{ width: `${report.forensicBreakdown.linguisticAuthenticity}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-400">Lexical flow, perplexity and custom phrasing variations.</p>
              </div>

              {/* Semantic Consistency */}
              <div className="space-y-1 p-3 bg-slate-50/50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800/40 rounded-lg">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">Semantic Consistency</span>
                  <span className="font-bold font-mono text-slate-800 dark:text-slate-100">{report.forensicBreakdown.semanticConsistency}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-violet-500 transition-all duration-700" 
                    style={{ width: `${report.forensicBreakdown.semanticConsistency}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-400">Absence of automated logical contradictions or shifts.</p>
              </div>

              {/* Factual Grounding */}
              <div className="space-y-1 p-3 bg-slate-50/50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800/40 rounded-lg">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">Real-World Grounding</span>
                  <span className="font-bold font-mono text-slate-800 dark:text-slate-100">{report.forensicBreakdown.factualGrounding}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-fuchsia-500 transition-all duration-700" 
                    style={{ width: `${report.forensicBreakdown.factualGrounding}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-400">Verification concordance with online search engine grounding.</p>
              </div>

              {/* Technical Coherence */}
              <div className="space-y-1 p-3 bg-slate-50/50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800/40 rounded-lg">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">Technical Coherence</span>
                  <span className="font-bold font-mono text-slate-800 dark:text-slate-100">{report.forensicBreakdown.technicalCoherence}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-pink-500 transition-all duration-700" 
                    style={{ width: `${report.forensicBreakdown.technicalCoherence}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-400">Grammar parsings or pixel mapping noise irregularities.</p>
              </div>

            </div>
          </div>

        </div>

        {/* Methodology & Detailed Findings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-slate-100 dark:border-slate-800 pt-6">
          
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 font-sans flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-slate-400" />
              Detailed Analytical Findings
            </h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
              {report.detailedFindings.map((finding, idx) => (
                <li key={idx} className="flex gap-2.5 items-start">
                  <span className="inline-flex w-5 h-5 shrink-0 items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono text-[10px] font-bold rounded-full mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{finding}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 font-sans flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-slate-400" />
              Applied Forensic Methodologies
            </h4>
            <div className="flex flex-wrap gap-2">
              {report.methodology.map((m, idx) => (
                <span 
                  key={idx} 
                  className="text-xs font-mono px-3 py-1 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-700 rounded-lg flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
                  {m}
                </span>
              ))}
            </div>

            <div className="mt-4 p-3 bg-red-500/5 dark:bg-slate-800/30 border border-red-500/20 dark:border-slate-700 rounded-lg text-xs space-y-1.5">
              <span className="font-bold flex items-center gap-1 text-slate-800 dark:text-slate-200 leading-none">
                <Info className="w-3.5 h-3.5 text-red-600" />
                Recommended Response Protocol
              </span>
              <p className="text-slate-500 dark:text-slate-400 leading-normal">
                {report.recommendedAction}
              </p>
            </div>
          </div>

        </div>

        {/* Fact Checking Claims Bureau block */}
        {report.factCheckingClaims && report.factCheckingClaims.length > 0 && (
          <div className="border-t border-slate-100 dark:border-slate-800 pt-6 space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 font-sans flex items-center gap-1.5">
              <span className="font-black text-red-600">FA</span>
              Fact-Checking Validation Bureau
            </h4>

            <div className="grid grid-cols-1 gap-4">
              {report.factCheckingClaims.map((claim, idx) => {
                let badgeStyle = "";
                switch (claim.verdict) {
                  case "Verified":
                    badgeStyle = "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900";
                    break;
                  case "Disputed":
                    badgeStyle = "bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900";
                    break;
                  case "Misleading":
                    badgeStyle = "bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900";
                    break;
                  default:
                    badgeStyle = "bg-slate-50 dark:bg-slate-950/20 text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-slate-900";
                }

                return (
                  <div key={idx} className="border border-slate-150 dark:border-slate-800 rounded-lg overflow-hidden">
                    <div className="bg-slate-50 dark:bg-slate-800/80 px-4 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm">
                      <span className="font-semibold text-slate-800 dark:text-slate-200 flex gap-1.5 items-start">
                        <span className="text-xs text-red-600 font-mono mt-0.5">CLAIM #{idx + 1}</span>
                        <span>"{claim.claim}"</span>
                      </span>
                      <span className={`text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full border shrink-0 ${badgeStyle}`}>
                        {claim.verdict}
                      </span>
                    </div>
                    <div className="p-4 text-xs leading-relaxed text-slate-600 dark:text-slate-400 space-y-1 bg-white dark:bg-slate-905">
                      <p>{claim.explanation}</p>
                      {claim.source && (
                        <p className="text-[10px] text-slate-400 font-mono pt-1">
                          <span className="font-bold">VERIFYING AGENT:</span> {claim.source}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
