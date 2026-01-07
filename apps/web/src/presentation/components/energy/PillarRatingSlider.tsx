import * as Slider from '@radix-ui/react-slider';
import { cn } from '@/lib/utils';
import type { PillarName } from '@/lib/constants';

interface PillarRatingSliderProps {
  pillar: PillarName;
  value: number;
  onChange: (value: number) => void;
  label: string;
}

const pillarIcons: Record<PillarName, string> = {
  sleep: '😴',
  food: '🍎',
  movement: '🏃',
  brain: '🧠',
};

export function PillarRatingSlider({ pillar, value, onChange, label }: PillarRatingSliderProps) {
  const getColorClass = (rating: number) => {
    if (rating <= 3) return 'bg-red-500';
    if (rating <= 7) return 'bg-ft-yellow';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="font-plaak font-bold text-lg flex items-center gap-2">
          <span>{pillarIcons[pillar]}</span>
          {label}
        </label>
        <div className={cn('font-plaak font-bold text-3xl', getColorClass(value))}>
          {value}
        </div>
      </div>
      
      <Slider.Root
        className="relative flex items-center select-none touch-none w-full h-5"
        value={[value]}
        onValueChange={(values) => {
          const newValue = values[0];
          if (newValue !== undefined) {
            onChange(newValue);
          }
        }}
        min={1}
        max={10}
        step={1}
      >
        <Slider.Track className="bg-ft-border relative grow rounded-full h-2">
          <Slider.Range className={cn('absolute h-full rounded-full', getColorClass(value))} />
        </Slider.Track>
        <Slider.Thumb
          className={cn(
            'block w-5 h-5 bg-ft-black rounded-full shadow-sm',
            'focus:outline-none focus:ring-2 focus:ring-ft-yellow focus:ring-offset-2',
            'hover:bg-ft-grey transition-colors'
          )}
          aria-label={`${label} rating`}
        />
      </Slider.Root>
      
      <div className="flex justify-between text-xs font-monument text-ft-grey">
        <span>1 (Low)</span>
        <span>10 (High)</span>
      </div>
    </div>
  );
}

