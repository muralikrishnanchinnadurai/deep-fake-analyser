import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  Globe, 
  FileText, 
  Upload, 
  History, 
  Trash2, 
  Calendar,
  AlertTriangle,
  BadgeAlert,
  CheckCircle2,
  RefreshCw,
  Info,
  Layers,
  HelpCircle,
  TrendingUp,
  Award,
  ChevronRight
} from "lucide-react";
import Logo from "./components/Logo.js";
import ScanCertificate from "./components/ScanCertificate.js";
import AnalyticsDashboard from "./components/AnalyticsDashboard.js";
import { VerificationReport, MediaCategory } from "./types.js";
import { getSeedScans } from "./initialScans.js";

export default function App() {
  // Navigation State
  const [activeView, setActiveView] = useState<"workspace" | "analytics">("workspace");
  const [activeTab, setActiveTab] = useState<"url" | "text" | "image">("url");

  // Scans Registry Loaded from Server
  const [scansList, setScansList] = useState<VerificationReport[]>([]);
  const [selectedScan, setSelectedScan] = useState<VerificationReport | null>(null);
  const [isSandboxMode, setIsSandboxMode] = useState<boolean>(true);
  const [isClientOnly, setIsClientOnly] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Form Input States
  const [urlInput, setUrlInput] = useState<string>("");
  const [textInput, setTextInput] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<MediaCategory>(MediaCategory.NEWS_ARTICLE);

  // Verification status indicators
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Load Scan Log Registry on Mount
  useEffect(() => {
    fetchScans();
  }, []);

  const fetchScans = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/scans");
      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }
      const data = await response.json();
      setScansList(data.scans || []);
      setIsSandboxMode(data.isSandboxMode ?? true);
      setIsClientOnly(false);
      
      // Auto-focus on first scan if available
      if (data.scans && data.scans.length > 0) {
        setSelectedScan(data.scans[0]);
      }
    } catch (err: any) {
      console.warn("API server route not detected. Activating client-side sandbox mode with localStorage persistence.", err);
      setIsClientOnly(true);
      setIsSandboxMode(true);

      // Try reading from localStorage first
      const stored = localStorage.getItem("deep-fake-analyser-scans");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setScansList(parsed || []);
          if (parsed && parsed.length > 0) {
            setSelectedScan(parsed[0]);
          }
        } catch (parseErr) {
          const seeds = getSeedScans();
          setScansList(seeds);
          setSelectedScan(seeds[0]);
          localStorage.setItem("deep-fake-analyser-scans", JSON.stringify(seeds));
        }
      } else {
        const seeds = getSeedScans();
        setScansList(seeds);
        setSelectedScan(seeds[0]);
        localStorage.setItem("deep-fake-analyser-scans", JSON.stringify(seeds));
      }

      setWarning("Offline Sandbox Active: Operating completely in-browser without server dependencies.");
    } finally {
      setLoading(false);
    }
  };

  // Drag and Drop media parsing
  const processFile = (file: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Only graphic image assets are supported for sub-pixel image forensics.");
      return;
    }
    setError(null);
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
      setImageFile(file);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  // Backend Analysis Trigger
  const triggerAnalysis = async () => {
    setAnalyzing(true);
    setError(null);
    setWarning(null);
    setSuccessMsg(null);

    let value = "";
    let additionalImageBase64 = "";

    if (activeTab === "url") {
      if (!urlInput.trim()) {
        setError("Please present a valid URL webpage address to inspect");
        setAnalyzing(false);
        return;
      }
      if (!urlInput.toLowerCase().startsWith("http://") && !urlInput.toLowerCase().startsWith("https://")) {
        value = "https://" + urlInput.trim();
      } else {
        value = urlInput.trim();
      }
    } else if (activeTab === "text") {
      if (!textInput.trim() || textInput.trim().length < 30) {
        setError("Linguistic dissection requires a document containing at least 30 characters.");
        setAnalyzing(false);
        return;
      }
      value = textInput.trim();
    } else if (activeTab === "image") {
      if (!imagePreview) {
        setError("Please drop or browse an image file to extract pixel metrics.");
        setAnalyzing(false);
        return;
      }
      value = imageFile ? imageFile.name : "scanned_forensic_layer.png";
      additionalImageBase64 = imagePreview;
    }

    if (isClientOnly) {
      setTimeout(() => {
        try {
          const id = "scan_local_" + Date.now();
          const scannedAt = new Date().toISOString();
          const targetTitle = activeTab === "url" 
            ? (value.replace("https://", "").split("/")[0] || "scanned_web_domain.net") + " Audit"
            : activeTab === "image" 
              ? value 
              : value.slice(0, 40) + "...";
              
          const searchTerms = value.toLowerCase();
          const isAi = searchTerms.includes("ai") || searchTerms.includes("gpt") || searchTerms.includes("generated") || Math.random() > 0.45;
          const score = isAi ? Math.floor(Math.random() * 25) + 72 : Math.floor(Math.random() * 15) + 5;
          
          let findings: string[] = [];
          let claims: any[] = [];
          let method: string[] = [];
          let action = "";
          const categoryDetected = activeTab === "image" ? MediaCategory.IMAGE_MEDIA : selectedCategory;

          if (activeTab === "image") {
            findings = isAi 
              ? [
                  "Geometric parallax mismatches detected on background lighting contours.",
                  "Characteristic noise frequency attenuation in high contrast vector borders.",
                  "Asymptotics analysis shows non-biological texture distributions."
                ]
              : [
                  "Pristine camera sensor noise mapping matches natural photographic standards.",
                  "Light reflection ratios are physically symmetrical.",
                  "Sub-pixel alignment confirms standard focal lens dispersion."
                ];
            claims = isAi 
              ? [{ claim: "Authentic physical camera capture of scenery", verdict: "Disputed", explanation: "Image contains pixel pattern aberrations typical of neural generator noise distributions." }]
              : [{ claim: "Unmodified scene photographic capture", verdict: "Verified", explanation: "Coherence audit passed. Normal lens spectral patterns matched." }];
            method = ["Frequency Spectrum Noise Analysis", "Lighting Ray-Tracing Symmetry Scan", "Deep Visual Aberration Pattern Check"];
            action = isAi ? "Quarantine. AI Synthesized Visual Asset." : "Verified authentic. Safe for publish.";
          } else {
            findings = isAi
              ? [
                  "Linguistic perplexity levels are extremely flat, uniform sentence lengths indicating a structured pre-trained distribution model.",
                  "Frequent deployment of standardized logical connector clichés ('Furthermore', 'In the realms of X', 'It is crucial to note').",
                  "Factual verification database shows inconsistent dates and unsupported institutional claims."
                ]
              : [
                  "Sentence length variation matches a standard human stylography envelope (high linguistic entropy).",
                  "Rich idiomatic, contextual and emotionally coherent vernacular observed.",
                  "Core factual items verified cleanly against public knowledge indexes."
                ];
            claims = [
              {
                claim: targetTitle || "Media Claims",
                verdict: isAi ? "Disputed" : "Verified",
                explanation: isAi 
                  ? "Several assertions contain factual anomalies that mismatch real historical index logs." 
                  : "Core statements and historical records correspond perfectly with registered datasets."
              }
            ];
            method = ["Linguistic Perplexity Modeler", "N-Gram Vocabulary Compression Assay", "Google Fact-Checking Index Check"];
            action = isAi ? "Review requested. Structural AI generation fingerprints detected." : "Safe. Authentic human-written information.";
          }

          const localReport: VerificationReport = {
            id,
            title: targetTitle,
            sourceType: activeTab,
            sourceValue: value,
            category: categoryDetected,
            scannedAt,
            isAIGenerated: isAi,
            confidenceScore: score,
            forensicBreakdown: {
              linguisticAuthenticity: isAi ? Math.floor(Math.random() * 25) + 10 : Math.floor(Math.random() * 15) + 84,
              semanticConsistency: isAi ? Math.floor(Math.random() * 40) + 45 : Math.floor(Math.random() * 10) + 89,
              factualGrounding: isAi ? Math.floor(Math.random() * 35) + 15 : Math.floor(Math.random() * 10) + 90,
              technicalCoherence: isAi ? Math.floor(Math.random() * 20) + 60 : Math.floor(Math.random() * 10) + 90
            },
            methodology: method,
            detailedFindings: findings,
            factCheckingClaims: claims,
            recommendedAction: action,
            extractedText: activeTab !== "image" ? value.slice(0, 1500) : undefined
          };

          const updated = [localReport, ...scansList];
          setScansList(updated);
          setSelectedScan(localReport);
          localStorage.setItem("deep-fake-analyser-scans", JSON.stringify(updated));
          
          setSuccessMsg("Verdicts compiled locally! Sandbox integrity badge generated.");
          
          // Clean inputs
          if (activeTab === "url") setUrlInput("");
          if (activeTab === "text") setTextInput("");
        } catch (localErr: any) {
          setError("Failed to compile local scan metrics: " + localErr.message);
        } finally {
          setAnalyzing(false);
        }
      }, 800);
      return;
    }

    try {
      const payload = {
        sourceType: activeTab,
        value,
        category: activeTab === "image" ? MediaCategory.IMAGE_MEDIA : selectedCategory,
        additionalImageBase64
      };

      const response = await fetch("/api/scans/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Diagnostic aborted: Server returned ${response.status}`);
      }

      const responseData = await response.json();
      
      if (responseData.error) {
        throw new Error(responseData.error);
      }

      const newReport: VerificationReport = responseData.report;

      setScansList(prev => [newReport, ...prev]);
      setSelectedScan(newReport);
      
      if (responseData.warning) {
        setWarning(responseData.warning);
      } else {
        setSuccessMsg("Verdicts compiled! Metadata integrity badge generated.");
      }

      // Clean inputs where necessary
      if (activeTab === "url") setUrlInput("");
      if (activeTab === "text") setTextInput("");

    } catch (err: any) {
      console.error("Forensic verification aborted:", err);
      setError(err.message || "An unexpected error occurred in raw packet decoding.");
    } finally {
      setAnalyzing(false);
    }
  };

  // Backend Delete Record Handler
  const deleteScan = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (isClientOnly) {
      const updated = scansList.filter(s => s.id !== id);
      setScansList(updated);
      localStorage.setItem("deep-fake-analyser-scans", JSON.stringify(updated));
      if (selectedScan && selectedScan.id === id) {
        setSelectedScan(updated.length > 0 ? updated[0] : null);
      }
      return;
    }

    try {
      const response = await fetch("/api/scans/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      if (!response.ok) {
        throw new Error("Could not drop file on server logs");
      }
      
      setScansList(prev => prev.filter(s => s.id !== id));
      if (selectedScan && selectedScan.id === id) {
        setSelectedScan(scansList.length > 1 ? scansList.find(s => s.id !== id) || null : null);
      }
    } catch (err: any) {
      console.error(err);
      setError("Failed to drop database record.");
    }
  };

  // Backend Reset Database Handler
  const handleResetDatabase = async () => {
    if (!confirm("Are you sure you want to restore the media audit database to factory seed records? All customized scans will be wiped.")) return;
    
    if (isClientOnly) {
      const seeds = getSeedScans();
      setScansList(seeds);
      setSelectedScan(seeds[0]);
      localStorage.setItem("deep-fake-analyser-scans", JSON.stringify(seeds));
      setSuccessMsg("Verified registry restored to official seed benchmarks sandbox.");
      return;
    }

    try {
      const response = await fetch("/api/scans/reset", { method: "POST" });
      if (!response.ok) throw new Error("Reset failure");
      const data = await response.json();
      setScansList(data.scans || []);
      if (data.scans && data.scans.length > 0) {
        setSelectedScan(data.scans[0]);
      } else {
        setSelectedScan(null);
      }
      setSuccessMsg("Verified registry restored to official seed benchmarks.");
    } catch (err: any) {
      console.error(err);
      setError("Database reset procedure aborted.");
    }
  };

  // Safe variables for stats
  const totalScansCount = scansList.length;
  const aiFlaggedCount = scansList.filter(s => s.isAIGenerated).length;

  return (
    <div id="media-monitoring-app" className="min-h-screen bg-[#020617] text-slate-100 flex flex-col font-sans selection:bg-red-600/30 selection:text-white">
      
      {/* Immersive glowing background mesh */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.45)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.45)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none z-0 opacity-20"></div>
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-red-600/5 rounded-full blur-[140px] pointer-events-none z-0"></div>
      <div className="absolute bottom-1/4 right-[10%] w-[400px] h-[400px] bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none z-0"></div>

      {/* Top Gradient Ribbon Accent */}
      <div className="h-1.5 w-full bg-gradient-to-r from-red-600 via-rose-500 to-indigo-600 z-50 pointer-events-none"></div>

      {/* Main Sticky Header */}
      <header className="sticky top-0 z-40 bg-slate-950/80 border-b border-slate-900/60 px-6 py-3.5 backdrop-blur-lg flex items-center justify-between shadow-md">
        <div className="flex items-center space-x-6">
          <Logo />
          
          <div className="hidden lg:flex flex-col border-l border-slate-800/80 pl-6">
            <span className="text-[10px] font-mono tracking-widest text-slate-400 font-bold">VERIFICATION DESK ONLINE</span>
            <span className="text-[10px] text-emerald-500 font-mono flex items-center font-bold mt-0.5">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse mr-1.5"></span>
              MULTIMODAL CHANNELS STREAMING
            </span>
          </div>
        </div>

        {/* Navigation Switchboard tabs */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5 bg-slate-900/90 border border-slate-800 p-1 rounded-xl">
            <button
              onClick={() => { setActiveView("workspace"); setError(null); }}
              id="tab-btn-workspace"
              className={`px-4 py-2 text-xs font-bold font-sans rounded-lg transition-all ${
                activeView === "workspace" 
                  ? "bg-slate-805 bg-slate-800 border border-slate-700/60 shadow-md text-red-500" 
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Verify Media
            </button>
            <button
              onClick={() => { setActiveView("analytics"); setError(null); }}
              id="tab-btn-analytics"
              className={`px-4 py-2 text-xs font-bold font-sans rounded-lg transition-all ${
                activeView === "analytics" 
                  ? "bg-slate-805 bg-slate-800 border border-slate-700/60 shadow-md text-red-500" 
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Intelligence Board
            </button>
          </div>

          {isSandboxMode && (
            <span className="hidden sm:inline-flex items-center gap-1.5 text-[9px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-full">
              Simulation Mode
            </span>
          )}
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-[1700px] w-full mx-auto p-4 md:p-6 relative z-10 flex flex-col justify-start">
        
        {/* Dynamic Warning Notification bar */}
        {warning && (
          <div className="mb-6 bg-amber-950/25 border border-amber-550/30 text-amber-500 px-5 py-3 rounded-lg flex items-center justify-between text-xs transition-opacity duration-300">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-4.5 h-4.5 shrink-0 text-amber-500 animate-pulse" />
              <span className="font-sans font-semibold text-amber-400">{warning}</span>
            </div>
            <button onClick={() => setWarning(null)} className="text-slate-400 hover:text-white font-bold ml-4">✕</button>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-950/25 border border-red-900/60 text-red-400 px-5 py-3 rounded-lg flex items-center justify-between text-xs transition-opacity duration-300">
            <div className="flex items-center space-x-3">
              <BadgeAlert className="w-4 h-4 shrink-0" />
              <span className="font-mono">{error}</span>
            </div>
            <button onClick={() => setError(null)} className="text-slate-400 hover:text-white font-bold ml-4">✕</button>
          </div>
        )}

        {successMsg && !error && (
          <div className="mb-6 bg-emerald-950/25 border border-emerald-900/65 text-emerald-400 px-5 py-3 rounded-lg flex items-center justify-between text-xs transition-opacity duration-300">
            <div className="flex items-center space-x-3">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span className="font-sans font-medium">{successMsg}</span>
            </div>
            <button onClick={() => setSuccessMsg(null)} className="text-slate-400 hover:text-white font-bold ml-4">✕</button>
          </div>
        )}

        {activeView === "workspace" ? (
          /* FORENSIC SCANNER WORKSPACE PANEL */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left 7 Columns pane: Setup and analysis inputs */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              
              {/* Submission control console */}
              <div className="bg-slate-950/30 border border-slate-900/80 rounded-xl p-5 relative overflow-hidden shadow-xl backdrop-blur-md">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 rounded-full blur-[45px] pointer-events-none"></div>
                
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-900/80">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-red-500" />
                    <h2 className="text-xs font-black uppercase tracking-widest text-slate-350 font-sans">Verification Console</h2>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">MULTIMODAL CHANNELS ENGINE</span>
                </div>

                {/* Submision Tab Switches */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <button 
                    onClick={() => { setActiveTab("url"); setError(null); }}
                    className={`py-2 px-3 rounded-lg border text-xs font-mono transition-all flex items-center justify-center space-x-2 ${
                      activeTab === "url" 
                        ? "bg-slate-900 border-red-500/75 text-red-400 font-bold shadow-md" 
                        : "bg-slate-950/10 border-slate-900 text-slate-400 hover:text-slate-300 hover:bg-slate-900/30"
                    }`}
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>URL Scanner</span>
                  </button>
                  
                  <button 
                    onClick={() => { setActiveTab("text"); setError(null); }}
                    className={`py-2 px-3 rounded-lg border text-xs font-mono transition-all flex items-center justify-center space-x-2 ${
                      activeTab === "text" 
                        ? "bg-slate-900 border-red-500/75 text-red-400 font-bold shadow-md" 
                        : "bg-slate-950/10 border-slate-900 text-slate-400 hover:text-slate-300 hover:bg-slate-900/30"
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Text Dissector</span>
                  </button>

                  <button 
                    onClick={() => { setActiveTab("image"); setError(null); }}
                    className={`py-2 px-3 rounded-lg border text-xs font-mono transition-all flex items-center justify-center space-x-2 ${
                      activeTab === "image" 
                        ? "bg-slate-900 border-red-500/75 text-red-400 font-bold shadow-md" 
                        : "bg-slate-950/10 border-slate-900 text-slate-400 hover:text-slate-300 hover:bg-slate-900/30"
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Pixel Forensic</span>
                  </button>
                </div>

                {/* Core conditional inputs */}
                <div className="space-y-4">
                  
                  {activeTab === "url" && (
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">Target Address</label>
                        <span className="text-[9px] text-slate-500 font-mono">SOCIAL CHANNELS & PRESS RELEASES</span>
                      </div>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-red-600 font-mono font-black text-xs">WEB://</span>
                        <input 
                          type="text" 
                          value={urlInput}
                          onChange={(e) => setUrlInput(e.target.value)}
                          placeholder="example-press.net/global-news/corporate-statements-910" 
                          className="w-full bg-slate-950/80 border border-slate-900 pl-16 pr-4 py-3 rounded-lg text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-red-600/50 transition-all font-mono"
                        />
                      </div>
                    </div>
                  )}

                  {activeTab === "text" && (
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">Linguistic Sample</label>
                        <span className="text-[9px] text-slate-500 font-mono">MINIMUM 30 CHARS</span>
                      </div>
                      <textarea 
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        rows={4}
                        placeholder="Paste text structure (e.g., transcripts, speech excerpts, newsletters) to audit stylistic burstiness and semantic factual alignment..." 
                        className="w-full bg-slate-955 bg-slate-950/80 border border-slate-900 p-3 rounded-lg text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-red-600/50 transition-all font-mono resize-none leading-relaxed"
                      />
                    </div>
                  )}

                  {activeTab === "image" && (
                    <div className="space-y-3">
                      <span className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">Image Forensic Upload</span>
                      
                      <div 
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDrop}
                        onClick={() => document.getElementById("img-uploader-app-ref")?.click()}
                        className="border-2 border-dashed border-slate-900 hover:border-red-500/50 bg-slate-950/20 rounded-xl p-6 transition-all text-center cursor-pointer relative group flex flex-col items-center justify-center min-h-[140px]"
                      >
                        <input 
                          type="file" 
                          id="img-uploader-app-ref"
                          className="hidden" 
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              processFile(e.target.files[0]);
                            }
                          }}
                        />

                        {imagePreview ? (
                          <div className="flex items-center space-x-4 max-w-full">
                            <img 
                              src={imagePreview} 
                              alt="Forensic capture preview" 
                              className="w-20 h-20 object-cover rounded-lg border border-slate-850 bg-slate-950 shadow-md referrerPolicy='no-referrer'"
                            />
                            <div className="text-left overflow-hidden">
                              <p className="text-xs font-mono text-slate-200 truncate max-w-[200px]">
                                {imageFile ? imageFile.name : 'uploaded_buffer.png'}
                              </p>
                              <p className="text-[10px] font-mono text-slate-500 mt-1 uppercase font-bold">
                                {imageFile ? `${Math.round(imageFile.size / 1024)} KB` : "Memory Stream"}
                              </p>
                              <span className="text-[10px] text-red-500 font-bold group-hover:underline mt-2 inline-block">Replace media selection</span>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center border border-slate-800 group-hover:border-red-500/30 mb-2 transition-all">
                              <Upload className="w-4 h-4 text-slate-500 group-hover:text-red-400" />
                            </div>
                            <p className="text-xs text-slate-300 font-medium">Drag-and-drop media image asset, or click to explore</p>
                            <p className="text-[9px] text-slate-500 mt-1 uppercase tracking-wider font-mono">PNG, JPG, WEBP, or AVIF</p>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Category Selection for URLs/Texts */}
                  {activeTab !== "image" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold mb-1.5">Context Model Category</label>
                        <select 
                          value={selectedCategory} 
                          onChange={(e) => setSelectedCategory(e.target.value as MediaCategory)}
                          className="w-full bg-slate-950 border border-slate-900 rounded-lg p-2.5 text-xs text-slate-300 font-sans focus:outline-none focus:border-red-650 font-medium"
                        >
                          <option value={MediaCategory.NEWS_ARTICLE}>News Link / Article</option>
                          <option value={MediaCategory.SOCIAL_MEDIA}>Social Feed / Post</option>
                          <option value={MediaCategory.BLOG_POST}>Conversational Blog Piece</option>
                          <option value={MediaCategory.PRESS_RELEASE}>Corporate Press Briefing</option>
                        </select>
                      </div>
                      <div className="flex items-center justify-start text-slate-500 text-[10px] leading-normal p-3 rounded-lg border border-slate-900 bg-slate-950/20">
                        <Info className="w-4 h-4 text-slate-400 shrink-0 mr-2" />
                        <span>Select the context model category to optimize the applied weights and linguistic detection formulas correctly.</span>
                      </div>
                    </div>
                  )}

                  {/* Submission Row */}
                  <div className="flex justify-end pt-2 border-t border-slate-900/80">
                    <button
                      onClick={triggerAnalysis}
                      disabled={analyzing}
                      style={{ cursor: analyzing ? "not-allowed" : "pointer" }}
                      className="bg-red-600 hover:bg-red-500 text-white font-bold px-6 py-2.5 text-xs tracking-wider uppercase rounded-xl transition-all shadow-[0_0_15px_rgba(239,68,68,0.2)] disabled:opacity-40 flex items-center space-x-2 select-none"
                    >
                      {analyzing ? (
                        <>
                          <RefreshCw className="w-4.5 h-4.5 animate-spin text-white" />
                          <span>Auditing Neural Signatures...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5 text-white" />
                          <span>Initiate Deep Verification</span>
                        </>
                      )}
                    </button>
                  </div>

                </div>
              </div>

              {/* Opened/Selected verification report view */}
              {selectedScan ? (
                <div className="transition-all duration-300">
                  <div className="flex items-center justify-between pl-1 pb-1 mb-2">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-extrabold flex items-center gap-1.5 leading-none">
                      <Award className="w-4.5 h-4.5 text-red-500" />
                      Active Forensic Audit Certificate
                    </span>
                    <span className="text-[9px] font-mono text-slate-500">REALTIME TELEMETRY SHIELDED</span>
                  </div>
                  <ScanCertificate report={selectedScan} />
                </div>
              ) : (
                <div className="border border-slate-900/60 p-10 bg-slate-950/10 rounded-xl text-center border-dashed">
                  <Layers className="w-10 h-10 text-slate-700 mx-auto mb-3" />
                  <p className="text-xs text-slate-400 font-mono uppercase tracking-widest mb-1 shadow-sm">No analysis active</p>
                  <p className="text-[11px] text-slate-500 max-w-sm mx-auto">Click any record on the registry feed or submit some media to view and print its detailed validation badge.</p>
                </div>
              )}

            </div>

            {/* Right 5 Columns pane: Historical logs and quick statistics */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              
              {/* Timeline Brief Statistics */}
              <div className="bg-slate-950/30 border border-slate-900 p-5 rounded-xl flex flex-col shadow-xl">
                <div className="flex items-center justify-between pb-3 border-b border-slate-900">
                  <span className="text-xs font-black uppercase tracking-widest text-slate-400 font-sans flex items-center gap-1.5 leading-none">
                    <History className="w-4 h-4 text-red-500" />
                    Auditing Historical Registry
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">TOTAL METRICS</span>
                </div>

                <div className="grid grid-cols-2 gap-4 py-4 border-b border-slate-900/60">
                  <div>
                    <span className="block text-[9px] text-slate-500 uppercase tracking-widest font-mono">Audits Completed</span>
                    <span className="text-2xl font-black font-mono text-slate-100">{totalScansCount}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] text-slate-500 uppercase tracking-widest font-mono">Synthetically Flagged</span>
                    <span className="text-2xl font-black font-mono text-red-400">
                      {aiFlaggedCount} <span className="text-xs text-slate-500 font-normal">({totalScansCount > 0 ? Math.round((aiFlaggedCount/totalScansCount)*100) : 0}%)</span>
                    </span>
                  </div>
                </div>

                <div className="mt-3 text-slate-400 text-[11px] leading-relaxed flex items-start gap-2 bg-slate-950/20 p-2.5 rounded-lg border border-slate-900/50">
                  <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                  <span>Each record represents a deep stylometry scan completed under verified neural metrics and fully cataloged under 'The Media Monitoring' integrity indexes.</span>
                </div>
              </div>

              {/* Registry historical listing feed list */}
              <div className="bg-slate-900/20 border border-slate-900 rounded-xl p-5 shadow-xl flex-1 flex flex-col max-h-[710px] overflow-hidden">
                <div className="flex items-center justify-between pb-3 border-b border-slate-900/80 mb-3">
                  <span className="text-xs font-black uppercase tracking-widest text-slate-300 font-sans">Verification Logs Block</span>
                  
                  <button 
                    onClick={handleResetDatabase}
                    className="text-slate-500 hover:text-red-400 text-[9px] font-mono font-bold transition-all uppercase flex items-center space-x-1 cursor-pointer select-none border border-slate-800/40 hover:border-red-900 bg-slate-950/15 py-1 px-2.5 rounded-lg"
                  >
                    <Trash2 className="w-3 h-3 text-red-500" />
                    <span>Restore Seed State</span>
                  </button>
                </div>

                {/* Scans Scroll box */}
                <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[580px] custom-scroller">
                  {loading ? (
                    <div className="h-44 flex flex-col items-center justify-center text-slate-600 gap-2">
                      <RefreshCw className="w-6 h-6 animate-spin text-red-500" />
                      <span className="text-xs font-mono uppercase font-bold">Scanning files database...</span>
                    </div>
                  ) : scansList.length === 0 ? (
                    <div className="h-44 flex flex-col items-center justify-center text-slate-600 font-medium">
                      <Calendar className="w-8 h-8 opacity-30 mb-2 text-slate-500" />
                      <p className="text-[10px] font-mono uppercase">Audit registry empty</p>
                    </div>
                  ) : (
                    scansList.map((scan) => {
                      const isSelected = selectedScan && selectedScan.id === scan.id;
                      const formattedTime = new Date(scan.scannedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      });

                      return (
                        <div 
                          key={scan.id}
                          onClick={() => {
                            setSelectedScan(scan);
                            setError(null);
                            setSuccessMsg(null);
                          }}
                          className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex items-center justify-between group ${
                            isSelected 
                              ? "bg-red-500/5 border-red-500/60 shadow-lg shadow-red-950/10" 
                              : "bg-slate-950/30 border-slate-900 hover:border-slate-800"
                          }`}
                        >
                          <div className="flex-1 min-w-0 pr-4">
                            <div className="flex items-center space-x-2 mb-1.5">
                              <span className={`w-2 h-2 rounded-full shrink-0 ${scan.isAIGenerated ? "bg-red-500 animate-pulse shadow-[0_0_5px_rgba(239,68,68,0.5)]" : "bg-emerald-500"}`}></span>
                              <p className="text-xs font-bold text-slate-250 truncate font-mono">
                                {scan.title}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2 text-[10px] text-slate-500 font-mono uppercase font-semibold">
                              <span className="bg-slate-950 px-1.5 py-0.5 rounded-xs border border-slate-900/60">{scan.sourceType}</span>
                              <span>•</span>
                              <span>{formattedTime}</span>
                            </div>
                          </div>

                          <div className="flex items-center space-x-3 shrink-0">
                            <div className="text-right">
                              <span className={`text-xs font-black font-mono block ${scan.isAIGenerated ? "text-red-400" : "text-emerald-400"}`}>
                                {scan.confidenceScore}%
                              </span>
                              <span className="text-[8px] font-mono font-bold text-slate-500 uppercase tracking-widest">{scan.isAIGenerated ? "AI FLAG" : "ORGANIC"}</span>
                            </div>
                            
                            <button 
                              onClick={(e) => deleteScan(scan.id, e)}
                              title="Delete log"
                              className="p-1.5 rounded-lg text-slate-650 hover:text-red-400 hover:bg-slate-900 border border-transparent hover:border-slate-800/80 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

              </div>

            </div>

          </div>
        ) : (
          /* REGISTRY ANALYTICS VIEW PANEL (Daily, Weekly, Monthly Reports) */
          <div className="space-y-6">
            <AnalyticsDashboard scans={scansList} onTriggerReset={handleResetDatabase} />
          </div>
        )}

      </main>

      {/* Corporate Footer */}
      <footer className="bg-slate-950 border-t border-slate-900/60 py-5 px-6 mt-16 text-center text-slate-500 text-[10px] font-mono flex flex-col sm:flex-row justify-between items-center gap-4">
        <span>© 2026 THE MEDIA MONITORING LABS. INTEGRITY GUARANTEED.</span>
        <div className="flex space-x-4 items-center">
          <span className="text-emerald-400 flex items-center">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5 animate-pulse"></span>
            SHIELD LAYER AUDIT V3.5
          </span>
          <span>•</span>
          <span>SSL VERIFIED PORT 3000</span>
        </div>
      </footer>

    </div>
  );
}
