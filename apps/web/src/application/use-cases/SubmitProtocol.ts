import { EnergySubmission } from '@/domain/entities/EnergySubmission';
import type { SubmissionRepository } from '../ports/SubmissionRepository';
import type { EnergyToolData } from '@/lib/validation-schemas';

export class SubmitProtocol {
  constructor(private repository: SubmissionRepository) {}

  async execute(props: {
    userId: string;
    userName: string;
    companyId: string;
    toolData: EnergyToolData;
    companyName?: string;
    sprintNumber?: string;
  }): Promise<EnergySubmission> {
    const submission = EnergySubmission.create(props);
    return await this.repository.save(submission);
  }
}

