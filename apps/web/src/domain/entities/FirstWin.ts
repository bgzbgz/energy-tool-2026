export interface FirstWin {
  action: string;
  timeframe: string;
  accountability_partner: string;
}

export class FirstWinAction {
  constructor(
    public readonly action: string,
    public readonly timeframe: string,
    public readonly accountabilityPartner: string
  ) {
    this.validate();
  }

  private validate(): void {
    if (this.action.length < 50) {
      throw new Error('First Win action must be at least 50 characters');
    }
    if (!this.timeframe || this.timeframe.trim().length === 0) {
      throw new Error('Timeframe is required');
    }
    if (!this.accountabilityPartner || this.accountabilityPartner.trim().length === 0) {
      throw new Error('Accountability partner is required');
    }
  }

  isWithin24Hours(): boolean {
    // Optional: parse timeframe and check if within 24 hours
    // For MVP, assume user enters valid 24-hour timeframe
    return true;
  }
}

