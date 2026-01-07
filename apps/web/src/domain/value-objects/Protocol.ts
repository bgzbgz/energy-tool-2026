import type { PillarName } from '@/lib/constants';
import { MIN_CHARS } from '@/lib/constants';

export class Protocol {
  constructor(
    public readonly pillar: PillarName,
    public readonly commitment: string
  ) {
    this.validate();
  }

  private validate(): void {
    if (this.commitment.length < MIN_CHARS.COMMITMENT) {
      throw new Error(`Commitment must be at least ${MIN_CHARS.COMMITMENT} characters`);
    }
  }

  isSpecific(): boolean {
    // Check for specific indicators (times, amounts, rituals)
    const specificPatterns = [
      /\d{1,2}:\d{2}/,                      // Times: "10:30 PM"
      /\d+\s*(hours?|minutes?|times?)/,     // Quantities: "30 minutes"
      /\d+\s*(mg|g|ml|L|oz)/,               // Amounts: "250mg"
      /(every|each)\s+\w+/,                 // Frequency: "every day"
    ];

    return specificPatterns.some(pattern => pattern.test(this.commitment));
  }

  getExamples(): { good: string; bad: string } {
    const examples = {
      sleep: {
        good: 'Lights out by 10:30 PM every night, no screens after 10 PM, bedroom temperature at 67°F, blackout curtains closed',
        bad: 'Sleep better and earlier'
      },
      food: {
        good: '3 meals per day at 8 AM, 1 PM, 7 PM, 30g protein per meal, no snacking after 8 PM, 2L water daily',
        bad: 'Eat healthier and drink more water'
      },
      movement: {
        good: '30-minute walk at 7 AM daily, 10 pushups every hour from 9 AM-5 PM, stretching routine at 6 PM',
        bad: 'Exercise more regularly'
      },
      brain: {
        good: '20-minute morning planning at 6 AM, 90-minute focus blocks from 9-10:30 AM and 2-3:30 PM, no email before 11 AM',
        bad: 'Focus better and be more productive'
      }
    };

    return examples[this.pillar] || { good: '', bad: '' };
  }
}

