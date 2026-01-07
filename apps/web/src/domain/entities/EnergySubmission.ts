import type { EnergyToolData } from '@/lib/validation-schemas';

export type SubmissionStatus = 'completed' | 'draft' | 'deleted';

export class EnergySubmission {
  constructor(
    public readonly id: string,
    public readonly toolName: string,
    public readonly userId: string,
    public readonly userName: string,
    public readonly companyId: string,
    public readonly submittedAt: Date,
    public readonly status: SubmissionStatus,
    public readonly toolData: EnergyToolData,
    public readonly companyName?: string,
    public readonly sprintNumber?: string,
    public readonly completionPercentage: number = 100,
  ) {}

  static create(props: {
    userId: string;
    userName: string;
    companyId: string;
    toolData: EnergyToolData;
    companyName?: string;
    sprintNumber?: string;
  }): EnergySubmission {
    return new EnergySubmission(
      crypto.randomUUID(),
      'energy_body_mind',
      props.userId,
      props.userName,
      props.companyId,
      new Date(),
      'completed',
      props.toolData,
      props.companyName,
      props.sprintNumber,
      100
    );
  }

  isComplete(): boolean {
    return this.completionPercentage === 100 && this.status === 'completed';
  }

  getAveragePillarRating(): number {
    const ratings = [
      this.toolData.audit.sleep.rating,
      this.toolData.audit.food.rating,
      this.toolData.audit.movement.rating,
      this.toolData.audit.brain.rating,
    ];
    return ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
  }
}

