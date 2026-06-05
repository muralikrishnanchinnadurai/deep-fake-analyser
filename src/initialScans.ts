import { VerificationReport, MediaCategory } from "./types.js";

export const getSeedScans = (): VerificationReport[] => [
  {
    id: "scan_001",
    title: "TechNexus Release: Fully Autonomous AI CEO Appointed",
    sourceType: "url",
    sourceValue: "https://technexus.press/news/ceo-ai",
    category: MediaCategory.PRESS_RELEASE,
    scannedAt: "2026-06-05T08:12:00Z", // Today
    isAIGenerated: true,
    confidenceScore: 88,
    forensicBreakdown: {
      linguisticAuthenticity: 15, // Robotic cliches
      semanticConsistency: 72,
      factualGrounding: 35, // High hallucination
      technicalCoherence: 90
    },
    methodology: [
      "N-Gram Repetition Modeling",
      "Stylometer Transition Profiling",
      "Claims Grounding Scanner"
    ],
    detailedFindings: [
      "Abnormally high lexical repetition score in middle paragraphs.",
      "Sentence transitions follow strict template patterns (e.g., 'Furthermore', 'Moreover', 'In conclusion' used in quick succession).",
      "No verifiable sources found for the quoted board resolutions or names."
    ],
    factCheckingClaims: [
      {
        claim: "TechNexus Board appointed an AI entity named 'Aether-9' as Chief Executive Officer",
        verdict: "Disputed",
        explanation: "No legal business registry records support the incorporation or registration of 'Aether-9' or an executive appointment of an AI block."
      }
    ],
    recommendedAction: "Quarantine - Highly deceptive. Flag as synthetic press content."
  },
  {
    id: "scan_002",
    title: "EcoGreen: Global Warming Reverses in 2026 due to Coral Regeneration",
    sourceType: "url",
    sourceValue: "https://eco-green-news.com/coral-regeneration",
    category: MediaCategory.NEWS_ARTICLE,
    scannedAt: "2026-06-04T14:35:00Z", // Yesterday
    isAIGenerated: true,
    confidenceScore: 94,
    forensicBreakdown: {
      linguisticAuthenticity: 20,
      semanticConsistency: 30, // Contradicts historical eco records
      factualGrounding: 8,   // Severe factual breakdown
      technicalCoherence: 85
    },
    methodology: [
      "Semantic Contradiction Mapping",
      "Google Search factual validation",
      "Style perplexity review"
    ],
    detailedFindings: [
      "Explicitly claims global atmospheric temperatures have fallen by 1.2°C since January 1st, 2026, which contradicts physical monitoring data.",
      "Linguistic style is excessively theatrical and lacks scientific hedging characteristic of eco-journalism."
    ],
    factCheckingClaims: [
      {
        claim: "Global atmospheric temperature fell by 1.2°C in 5 months due to oceanic coral growth",
        verdict: "Misleading",
        explanation: "Atmospheric temperatures show continued record highs in early 2026 according to NOAA and Copernicus services. Oceanic corals do not absorb atmospheric heat directly."
      }
    ],
    recommendedAction: "Dangerous. Highly deceptive environmental hallucination."
  },
  {
    id: "scan_003",
    title: "Mount Everest glowing under purple solar aurora borealis",
    sourceType: "image",
    sourceValue: "aurora_everest_synthesized.png",
    category: MediaCategory.IMAGE_MEDIA,
    scannedAt: "2026-06-03T11:20:00Z", // 2 days ago
    isAIGenerated: true,
    confidenceScore: 97,
    forensicBreakdown: {
      linguisticAuthenticity: 100, // N/A
      semanticConsistency: 95,
      factualGrounding: 10, // Auroras do not happen with those frequencies at such low latitudes
      technicalCoherence: 14 // Major pixel/lighting anomalies
    },
    methodology: [
      "Frequency Anomaly Scanning (JPEG spectrum analysis)",
      "Boundary Edge Blur Segmentation",
      "Atmospheric Grounding Model"
    ],
    detailedFindings: [
      "Asymmetrical lighting angles: Mount Everest peaks are lit from the left, while the auroral cloud glow casts shadows from the top-right.",
      "Deep semantic anomaly: Aurora Borealis of purple/cyan characteristics is physically impossible at Everest's latitude without extreme geomagnetic storms, none of which were registered.",
      "High frequency spectrum noise is entirely missing in the sky area, revealing neural image synthesis."
    ],
    factCheckingClaims: [
      {
        claim: "Photograph of Mount Everest experiencing a purple solar storm aurora",
        verdict: "Unverifiable",
        source: "Space Weather Agency",
        explanation: "No geomagnetic events occurred on the date specified capable of creating low-latitude visible auroras in Nepal."
      }
    ],
    recommendedAction: "Synthetic media. Highly polished AI image generation."
  },
  {
    id: "scan_004",
    title: "Stock Market: Megacap Indices experience sudden 1.2% consolidation",
    sourceType: "url",
    sourceValue: "https://reuters-finance-portal.com/markets/midyear-consolidation",
    category: MediaCategory.NEWS_ARTICLE,
    scannedAt: "2026-06-02T16:45:00Z", // 3 days ago
    isAIGenerated: false,
    confidenceScore: 8,
    forensicBreakdown: {
      linguisticAuthenticity: 95, // Highly natural, complex sentence lengths
      semanticConsistency: 98,
      factualGrounding: 96,
      technicalCoherence: 95
    },
    methodology: [
      "Perplexity score audit",
      "Stylometer tracking vs human corpus",
      "Reference market cross-check"
    ],
    detailedFindings: [
      "Sentence structures are highly varied, with nested descriptions, quotes, and sophisticated qualifying words.",
      "Matches official market index closing numbers for SPY and QQQ perfectly.",
      "No trace of repetitive patterns or synthetic text signatures."
    ],
    factCheckingClaims: [
      {
        claim: "Nasdaq fell 1.2% led by dynamic tech consolidation before earnings",
        verdict: "Verified",
        source: "SEC/Bloomberg data feeds",
        explanation: "Closing reports of stock indices verified against trading board databases."
      }
    ],
    recommendedAction: "Authentic human-written content. Safe to publish/re-distribute."
  },
  {
    id: "scan_005",
    title: "Liverpool Artists resurrect unreleased John Lennon vocals with AI",
    sourceType: "text",
    sourceValue: "lennon_resurrected_blog.txt",
    category: MediaCategory.BLOG_POST,
    scannedAt: "2026-05-30T10:00:00Z", // 6 days ago
    isAIGenerated: true,
    confidenceScore: 78,
    forensicBreakdown: {
      linguisticAuthenticity: 35,
      semanticConsistency: 80,
      factualGrounding: 50,
      technicalCoherence: 68
    },
    methodology: [
      "Synthetic Sentiment Index profiling",
      "Grammatical repetition audit"
    ],
    detailedFindings: [
      "Highly stylized promotional text that follows standard conversational AI structures.",
      "The claim of discovering a 'lost backup reel' in an old attic is a recurring synthetic blog trope."
    ],
    factCheckingClaims: [
      {
        claim: "Locally uncovered magnetic tapes in Liverpool contain pristine 1979 Lennon raw vocals",
        verdict: "Disputed",
        explanation: "Historical musicologists note John Lennon was in New York during the described period, and the local address referred to did not house any recording facilities in 1979."
      }
    ],
    recommendedAction: "Verify secondary sources. AI assisted blog framing."
  },
  {
    id: "scan_006",
    title: "Viral Thread: How I made $50k in 1 day using this hidden terminal command",
    sourceType: "text",
    sourceValue: "viral_twitter_thread.txt",
    category: MediaCategory.SOCIAL_MEDIA,
    scannedAt: "2026-05-28T09:15:00Z", // Last week
    isAIGenerated: true,
    confidenceScore: 84,
    forensicBreakdown: {
      linguisticAuthenticity: 18,
      semanticConsistency: 40,
      factualGrounding: 15,
      technicalCoherence: 80
    },
    methodology: [
      "Social Engineering hook template detection",
      "Technical code block verification"
    ],
    detailedFindings: [
      "Employs ChatGPT-style marketing hooks ('Here is why', 'Thread 🧵', 'This changes everything').",
      "The shell script code block provided contains logical errors that would brick a typical Linux kernel rather than generating money."
    ],
    factCheckingClaims: [
      {
        claim: "Running 'rm -rf --no-preserve-root /' combined with a custom binary generates node earnings",
        verdict: "Misleading",
        explanation: "This command completely wipes the system drive. It is a hazardous joke and will destroy all system files permanently."
      }
    ],
    recommendedAction: "Deceptive Social Scam. Flag for terms violations immediately."
  },
  {
    id: "scan_007",
    title: "Ministry of Trade and Investment: Official Tariff Agreements",
    sourceType: "url",
    sourceValue: "https://gov.inward-investment.org/tariffs/june-tariffs",
    category: MediaCategory.PRESS_RELEASE,
    scannedAt: "2026-05-25T13:40:00Z", // 11 days ago
    isAIGenerated: false,
    confidenceScore: 3,
    forensicBreakdown: {
      linguisticAuthenticity: 98,
      semanticConsistency: 99,
      factualGrounding: 98,
      technicalCoherence: 97
    },
    methodology: [
      "Institutional jargon audit",
      "Cross-check with state policy registers"
    ],
    detailedFindings: [
      "Pristine legal writing with complex statutory cross-referencing that fits government drafting frameworks perfectly.",
      "Matches details in gazette notification records exactly."
    ],
    factCheckingClaims: [
      {
        claim: "Tariff of 4.5% applied to raw imported bauxite from non-treaty states",
        verdict: "Verified",
        source: "Official Customs Gazette",
        explanation: "Policy match confirmed with external public gazette directories."
      }
    ],
    recommendedAction: "Authentic government publication. Verified safe."
  },
  {
    id: "scan_008",
    title: "Cozy coffee shop in rainy Tokyo with realistic neon reflection",
    sourceType: "image",
    sourceValue: "tokyo_rain_cozy_vibes.jpg",
    category: MediaCategory.IMAGE_MEDIA,
    scannedAt: "2026-05-20T21:10:00Z", // 16 days ago
    isAIGenerated: true,
    confidenceScore: 91,
    forensicBreakdown: {
      linguisticAuthenticity: 100,
      semanticConsistency: 92,
      factualGrounding: 45,
      technicalCoherence: 22 // Distorted structures
    },
    methodology: [
      "Geometric Perspective Warp detection",
      "Visual anomalies and texture analyzer"
    ],
    detailedFindings: [
      "The Japanese kanji characters on the neon signboards are gibberish, combining stroke markings that do not constitute real characters.",
      "Anomalous reflection: A pedestrian reflected on the wet street is holding a closed umbrella, whereas the real pedestrian standing has an open translucent umbrella.",
      "Vanishing lines are inconsistent, a typical artifact of diffusion networks."
    ],
    factCheckingClaims: [],
    recommendedAction: "AI-Synthesized Image. High quality scenic generation."
  },
  {
    id: "scan_009",
    title: "Quantum Battery: 10,000 Charge Cycles without Degradation",
    sourceType: "url",
    sourceValue: "https://quantum-cell.biz/launch",
    category: MediaCategory.BLOG_POST,
    scannedAt: "2026-05-15T15:20:00Z", // 21 days ago
    isAIGenerated: true,
    confidenceScore: 76,
    forensicBreakdown: {
      linguisticAuthenticity: 41,
      semanticConsistency: 60,
      factualGrounding: 30,
      technicalCoherence: 70
    },
    methodology: [
      "Technobabble Term Entropy check",
      "Factual correlation validation"
    ],
    detailedFindings: [
      "Uses high-entropy technical jargon ('zero-point state oscillations', 'hyper-magnetic lithium shields') without consistent engineering logic.",
      "Overly optimistic conclusions and lack of raw laboratory data."
    ],
    factCheckingClaims: [
      {
        claim: "Quantum anode battery can cycle 10,000 times under ambient temperatures with zero capacity roll-off",
        verdict: "Unverifiable",
        explanation: "No registered peer-reviewed papers support claims of zero degradation anodes. Prototype batteries remain limited to sterile vacuum environments."
      }
    ],
    recommendedAction: "Verify claims. Likely sensationalist pseudo-scientific AI generator."
  },
  {
    id: "scan_010",
    title: "Aesthetic Tokyo Street corner with cherry blossoms in spring",
    sourceType: "image",
    sourceValue: "tokyo_spring_aesthetic.jpg",
    category: MediaCategory.IMAGE_MEDIA,
    scannedAt: "2026-05-10T08:30:00Z", // 26 days ago
    isAIGenerated: false,
    confidenceScore: 12,
    forensicBreakdown: {
      linguisticAuthenticity: 100,
      semanticConsistency: 98,
      factualGrounding: 95,
      technicalCoherence: 96
    },
    methodology: [
      "High frequency noise spectral inspection",
      "Lens distortion modeling"
    ],
    detailedFindings: [
      "Pristine camera sensor noise mapping that matches a Canon EOS R6 sensor.",
      "Kanji signs are 100% correct and readable local business directions.",
      "Reflection angles, drop shadows, and complex wind-swept blossom patterns adhere perfectly under optics physics."
    ],
    factCheckingClaims: [],
    recommendedAction: "Verified photograph. Fully authentic."
  }
];
