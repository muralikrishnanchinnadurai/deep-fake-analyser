export enum MediaCategory {
  NEWS_ARTICLE = "news_article",
  SOCIAL_MEDIA = "social_media",
  BLOG_POST = "blog_post",
  PRESS_RELEASE = "press_release",
  IMAGE_MEDIA = "image_media"
}

export interface ForensicBreakdown {
  linguisticAuthenticity: number; // 0-100, where higher is more authentic (human-like)
  semanticConsistency: number;    // 0-100, consistency of reasoning/concepts
  factualGrounding: number;       // 0-100, matches known facts/real-world context
  technicalCoherence: number;     // 0-100, pixel alignment, grammar structure, noise patterns
}

export interface FactCheckClaim {
  claim: string;
  verdict: "Verified" | "Disputed" | "Unverifiable" | "Misleading";
  source?: string;
  explanation: string;
}

export interface VerificationReport {
  id: string;
  title: string;
  sourceType: "url" | "text" | "image";
  sourceValue: string; // The URL analyzed, text snippet, or filename
  category: MediaCategory;
  scannedAt: string; // ISO String style
  isAIGenerated: boolean;
  confidenceScore: number; // 0-100 (probability of being AI generated)
  forensicBreakdown: ForensicBreakdown;
  methodology: string[];
  detailedFindings: string[];
  factCheckingClaims: FactCheckClaim[];
  recommendedAction: string;
  extractedText?: string;
}

export interface TimeframeStats {
  totalScans: number;
  aiDetectedCount: number;
  averageConfidence: number;
  safeRatio: number; // 0-100
  scansByDay: { day: string; count: number; aiCount: number }[];
  scansByCategory: { category: MediaCategory; total: number; aiCount: number }[];
}

export interface DashboardAnalytics {
  daily: TimeframeStats;
  weekly: TimeframeStats;
  monthly: TimeframeStats;
}
