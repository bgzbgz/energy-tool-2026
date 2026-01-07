export interface EnergyDrains {
  biggest_drain: string;
  impact: string;
  peak_times: string;
  crash_times: string;
}

export class EnergyDrain {
  constructor(
    public readonly biggestDrain: string,
    public readonly impact: string,
    public readonly peakTimes: string,
    public readonly crashTimes: string
  ) {
    this.validate();
  }

  private validate(): void {
    if (this.biggestDrain.length < 100) {
      throw new Error('Biggest drain must be at least 100 characters');
    }
  }

  isSpecific(): boolean {
    const vaguePhrases = ['better', 'more', 'less', 'improve'];
    return !vaguePhrases.some(phrase => 
      this.biggestDrain.toLowerCase().includes(phrase)
    );
  }
}

