import { VAGUE_WORDS } from '@/lib/constants';

export interface SpecificityResult {
  isSpecific: boolean;
  feedback?: string;
}

export class SpecificityValidator {
  static validate(commitment: string): SpecificityResult {
    const hasVagueWords = VAGUE_WORDS.some(word => 
      commitment.toLowerCase().includes(word)
    );
    
    // Check for specific indicators (times, amounts, rituals)
    const specificPatterns = [
      /\d{1,2}:\d{2}/,                      // Times: "10:30 PM"
      /\d+\s*(hours?|minutes?|times?)/,     // Quantities: "30 minutes"
      /\d+\s*(mg|g|ml|L|oz)/,               // Amounts: "250mg"
      /(every|each)\s+\w+/,                 // Frequency: "every day"
    ];

    const hasSpecificIndicators = specificPatterns.some(pattern => 
      pattern.test(commitment)
    );
    
    if (hasVagueWords && !hasSpecificIndicators) {
      return {
        isSpecific: false,
        feedback: 'Include exact times, amounts, or rituals—Example: "Lights out by 10:30 PM, no screens after 10 PM"'
      };
    }
    
    if (commitment.length < 100) {
      return {
        isSpecific: false,
        feedback: 'Add more details to make this commitment actionable'
      };
    }
    
    return { isSpecific: true };
  }
}

