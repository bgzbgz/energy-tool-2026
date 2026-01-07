import { cn } from '@/lib/utils';
import type { PillarName } from '@/lib/constants';

interface FastTrackRulesProps {
  pillar: PillarName;
}

const pillarRules: Record<PillarName, string[]> = {
  sleep: [
    'Sleep 7-9 hours per night consistently',
    'Maintain consistent sleep schedule (same bedtime/wake time)',
    'No screens 1 hour before bed',
    'Bedroom temperature: 65-68°F',
    'Dark, quiet sleeping environment',
    'No caffeine after 2 PM',
  ],
  food: [
    'Eat 3 balanced meals per day',
    '30g+ protein per meal',
    'No snacking after 8 PM',
    'Drink 2-3 liters of water daily',
    'Limit processed foods',
    'Eat within 1 hour of waking',
  ],
  movement: [
    '30+ minutes of movement daily',
    'Mix cardio and strength training',
    'Stand every hour during work',
    '10-minute walk after meals',
    'Stretch daily',
    'Track daily steps (aim for 10,000)',
  ],
  brain: [
    '90-minute focus blocks for deep work',
    'No email/social media before 11 AM',
    'Morning planning session (20 minutes)',
    'Single-tasking (no multitasking)',
    'Take breaks every 90 minutes',
    'Weekly review and reflection',
  ],
};

export function FastTrackRules({ pillar }: FastTrackRulesProps) {
  const rules = pillarRules[pillar];

  return (
    <div className="bg-gray-50 border border-ft-border rounded-sm p-6">
      <h3 className="font-plaak font-bold text-lg mb-4">Fast Track Research-Backed Rules</h3>
      <ul className="space-y-2">
        {rules.map((rule, index) => (
          <li key={index} className="flex items-start gap-2 font-riforma text-sm">
            <span className="text-ft-yellow font-bold mt-1">•</span>
            <span>{rule}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

