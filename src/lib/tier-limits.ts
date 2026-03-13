export const TIER_LIMITS = {
  free:    { analyses: 3,      improvements: 1,      comparisons: 0,      spy: 0,      urlGenerations: 0,      swipeFileGenerate: false, performanceTracker: false, performanceExport: false },
  starter: { analyses: 50,     improvements: 10,     comparisons: 5,      spy: 0,      urlGenerations: 0,      swipeFileGenerate: true,  performanceTracker: true,  performanceExport: false },
  pro:     { analyses: 200,    improvements: 40,     comparisons: 20,     spy: 10,     urlGenerations: 5,      swipeFileGenerate: true,  performanceTracker: true,  performanceExport: true  },
  agency:  { analyses: 999999, improvements: 999999, comparisons: 999999, spy: 999999, urlGenerations: 999999, swipeFileGenerate: true,  performanceTracker: true,  performanceExport: true  },
};

export function getTierLimits(tier: string) {
  return TIER_LIMITS[tier as keyof typeof TIER_LIMITS] ?? TIER_LIMITS.free;
}
