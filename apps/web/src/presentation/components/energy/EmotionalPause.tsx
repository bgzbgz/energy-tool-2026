import React from 'react';

interface EmotionalPauseProps {
  title: string;
  message: string;
  ctaText: string;
  onContinue: () => void;
}

export function EmotionalPause({ title, message, ctaText, onContinue }: EmotionalPauseProps) {
  return (
    <div className="min-h-screen bg-ft-black text-white flex items-center justify-center p-16">
      <div className="max-w-4xl text-center">
        <h1
          className="font-plaak text-6xl md:text-7xl mb-8 text-ft-yellow animate-fade-in leading-tight"
        >
          {title}
        </h1>
        <p
          className="text-2xl md:text-3xl mb-12 font-riforma animate-fade-in"
          style={{ animationDelay: '0.2s' }}
        >
          {message}
        </p>
        <button
          onClick={onContinue}
          className="bg-white text-ft-black font-riforma text-xl py-6 px-16 hover:bg-ft-yellow hover:text-ft-black transition-all duration-200 animate-fade-in"
          style={{ animationDelay: '0.4s' }}
        >
          {ctaText}
        </button>
      </div>

      {/* Animation CSS */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out backwards;
        }
      `}</style>
    </div>
  );
}

// Pre-configured Emotional Pause screens
export function AuditCompleteScreen({ onContinue }: { onContinue: () => void }) {
  return (
    <EmotionalPause
      title="YOU'VE ASSESSED YOUR ENERGY"
      message="You've identified where you stand. Now let's find what's holding you back."
      ctaText="Continue to Energy Drains →"
      onContinue={onContinue}
    />
  );
}

export function DrainsCompleteScreen({ onContinue }: { onContinue: () => void }) {
  return (
    <EmotionalPause
      title="NOW DESIGN YOUR PROTOCOL"
      message="You know the problem. Time to create the solution."
      ctaText="Continue to Protocol Design →"
      onContinue={onContinue}
    />
  );
}

export function ProtocolCompleteScreen({ onContinue }: { onContinue: () => void }) {
  return (
    <EmotionalPause
      title="ONE LAST STEP"
      message="Your protocol is ready. Now commit to your first win in the next 24 hours."
      ctaText="Set Your First Win →"
      onContinue={onContinue}
    />
  );
}

