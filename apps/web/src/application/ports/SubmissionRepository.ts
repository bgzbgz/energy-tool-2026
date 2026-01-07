import type { EnergySubmission } from '@/domain/entities/EnergySubmission';
import type { EnergyToolData } from '@/lib/validation-schemas';

export interface SubmissionRepository {
  save(submission: EnergySubmission): Promise<EnergySubmission>;
  findByCompany(companyId: string, status?: string, limit?: number): Promise<EnergySubmission[]>;
  findById(id: string): Promise<EnergySubmission | null>;
}

