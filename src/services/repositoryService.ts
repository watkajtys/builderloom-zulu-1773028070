import { RepositoryData } from '../hooks/useRepositories';
import { mockRepositories } from './mockRepositoryData';

export const repositoryService = {
  getRepositories: async (): Promise<RepositoryData[]> => {
    // Phase 3: Abstracted service layer. Ready for backend migration
    return Promise.resolve(mockRepositories);
  }
};
