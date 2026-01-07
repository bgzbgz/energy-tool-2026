import { RATING } from '@/lib/constants';

export class Rating {
  private constructor(public readonly value: number) {}

  static create(value: number): Rating {
    if (value < RATING.MIN || value > RATING.MAX) {
      throw new Error(`Rating must be between ${RATING.MIN} and ${RATING.MAX}`);
    }
    if (!Number.isInteger(value)) {
      throw new Error('Rating must be an integer (no decimals)');
    }
    return new Rating(value);
  }

  static MIN = RATING.MIN;
  static MAX = RATING.MAX;

  isLow(): boolean {
    return this.value <= 3;
  }

  isMedium(): boolean {
    return this.value >= 4 && this.value <= 7;
  }

  isHigh(): boolean {
    return this.value >= 8;
  }
}

