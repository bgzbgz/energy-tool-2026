import { cn } from '@/lib/utils';
import type { PillarName } from '@/lib/constants';

interface CommitmentExamplesProps {
  pillar: PillarName;
}

const examples: Record<PillarName, { good: string; bad: string }> = {
  sleep: {
    good: 'Lights out by 10:30 PM every night, no screens after 10 PM, bedroom temperature at 67°F, blackout curtains closed, white noise machine on. Wake at 6:00 AM with sunrise alarm clock. No snoozing.',
    bad: 'Sleep better and earlier',
  },
  food: {
    good: 'Eat breakfast at 7 AM (2 eggs, oatmeal, berries). Lunch at 12:30 PM (protein + vegetables). Dinner at 6:30 PM (home-cooked, no processed food). No snacking after 8 PM. Drink 2 liters of water throughout the day. Limit coffee to 2 cups before 12 PM.',
    bad: 'Eat healthier and drink more water',
  },
  movement: {
    good: '30-minute walk at 6:30 AM daily before work. 10 pushups and 10 squats every hour from 9 AM to 5 PM (set phone timer). 20-minute stretching routine at 7 PM. Stand during all phone calls.',
    bad: 'Exercise more regularly',
  },
  brain: {
    good: 'Email and Slack turned off from 9-11 AM and 2-4 PM for deep work blocks. Check messages only at 8 AM, 11 AM, 1 PM, 4 PM, 5 PM. Morning planning session at 8 AM (20 minutes). Weekly review every Friday at 4 PM. No phone in bedroom.',
    bad: 'Focus better and be more productive',
  },
};

export function CommitmentExamples({ pillar }: CommitmentExamplesProps) {
  const { good, bad } = examples[pillar];

  return (
    <div className="space-y-4">
      {/* Good Example */}
      <div className="bg-green-50 border border-green-200 rounded-sm p-4">
        <div className="flex items-start gap-2 mb-2">
          <span className="text-green-600 font-bold">✓</span>
          <h4 className="font-monument text-sm font-medium text-green-800 uppercase">Good Example</h4>
        </div>
        <p className="font-riforma text-sm text-green-900">{good}</p>
      </div>

      {/* Bad Example */}
      <div className="bg-red-50 border border-red-200 rounded-sm p-4">
        <div className="flex items-start gap-2 mb-2">
          <span className="text-red-600 font-bold">✗</span>
          <h4 className="font-monument text-sm font-medium text-red-800 uppercase">Bad Example (Too Vague)</h4>
        </div>
        <p className="font-riforma text-sm text-red-900">{bad}</p>
      </div>
    </div>
  );
}

