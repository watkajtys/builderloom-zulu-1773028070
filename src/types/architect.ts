export interface StaticViolation {
  tool: string;
  type: string;
  line?: number;
  symbol: string;
  message: string;
}

export interface ArchitectFinding {
  id: string;
  filepath: string;
  score: number;
  issues: StaticViolation[];
  static_violations: StaticViolation[];
  created?: string;
  updated?: string;
}
