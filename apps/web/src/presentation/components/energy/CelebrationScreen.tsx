import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface CelebrationScreenProps {
  percentage: number; // 25, 50, 75, or 100
  message: string;
  onContinue: () => void;
}

const messages: Record<number, string> = {
  25: "Great Progress!",
  50: "You're Halfway There!",
  75: "Almost There!",
  100: "Congratulations!",
};

export function CelebrationScreen({ percentage, message, onContinue }: CelebrationScreenProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation
    setIsVisible(true);
  }, []);

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center bg-black/80 transition-all duration-300',
        isVisible ? 'opacity-100' : 'opacity-0'
      )}
      onClick={onContinue}
    >
      <div
        className={cn(
          'bg-ft-white rounded-sm p-12 text-center max-w-md mx-4 transform transition-all duration-300',
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-ft-yellow font-plaak font-bold text-8xl mb-4">
          {percentage}%
        </div>
        <h2 className="text-3xl font-plaak font-bold mb-2">{messages[percentage] || message}</h2>
        <p className="text-lg font-riforma text-ft-grey mb-8">{message}</p>
        <button
          onClick={onContinue}
          className="bg-ft-black text-ft-white font-plaak font-bold px-8 py-3 rounded-sm hover:bg-ft-grey transition-colors uppercase tracking-wide"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

