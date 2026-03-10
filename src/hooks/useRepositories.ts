import { useState, useEffect } from 'react';
import { Network, Box, Code2, Database, LucideIcon } from 'lucide-react';
import { pb } from '../services/pocketbase';
import { ArchitectFinding } from '../types/architect';
import { mockRepositories } from '../services/mockData';

export interface RepositoryData {
  name: string;
  type: string;
  coverage: number;
  grade: string;
  lastCommit: string;
  author: string;
  icon: LucideIcon;
  coverageColorClass: string;
  coverageShadowClass?: string;
  lintTrendHeights: string[];
  lintTrendColors: string[];
}

export function useRepositories(): { repositories: RepositoryData[]; architectFindings: ArchitectFinding[] } {
  const [architectFindings, setArchitectFindings] = useState<ArchitectFinding[]>([]);

  useEffect(() => {
    const fetchFindings = async () => {
      try {
        const records = await pb.collection('architect_findings').getFullList<ArchitectFinding>();
        setArchitectFindings(records);
      } catch (error) {
        console.error("Failed to fetch architect findings:", error);
      }
    };
    fetchFindings();
  }, []);

  return { repositories: mockRepositories, architectFindings };
}
