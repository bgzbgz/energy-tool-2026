import type { EnergySubmission } from '@/domain/entities/EnergySubmission';
import type { SubmissionRepository } from '../ports/SubmissionRepository';

export class GetSubmissions {
  constructor(private repository: SubmissionRepository) {}

  async execute(companyId: string, status: string = 'completed', limit: number = 100): Promise<EnergySubmission[]> {
    return await this.repository.findByCompany(companyId, status, limit);
  }
}

