import type { PillarName } from '@/lib/constants';

export interface PillarAudit {
  rating: number;
  habits: string;
  hours?: number;
  minutes?: number;
  patterns?: string;
  routines?: string;
}

export class PillarRating {
  constructor(
    public readonly pillar: PillarName,
    public readonly rating: number,
    public readonly habits: string
  ) {
    this.validate();
  }

  private validate(): void {
    if (this.rating < 1 || this.rating > 10) {
      throw new Error('Rating must be between 1 and 10');
    }
    if (!Number.isInteger(this.rating)) {
      throw new Error('Rating must be an integer');
    }
    if (this.habits.length < 50) {
      throw new Error('Habits description must be at least 50 characters');
    }
  }

  getColorCode(): 'red' | 'yellow' | 'green' {
    if (this.rating <= 3) return 'red';
    if (this.rating <= 7) return 'yellow';
    return 'green';
  }
}

