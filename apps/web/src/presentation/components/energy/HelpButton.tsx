import React, { useState } from 'react';

interface HelpButtonProps {
  content: {
    why: string;
    what: string;
    how: string[];
  };
}

export function HelpButton({ content }: HelpButtonProps) {
  const [showHelp, setShowHelp] = useState(false);

  const handleReset = () => {
    if (
      window.confirm(
        '⚠️ This will delete all saved protocol data and start fresh. Are you sure?'
      )
    ) {
      localStorage.removeItem('energy_audit');
      localStorage.removeItem('energy_drains');
      localStorage.removeItem('energy_protocols');
      localStorage.removeItem('energy_first_win');
      localStorage.removeItem('energy_protocol');
      window.location.href = '/';
    }
  };

  return (
    <>
      {/* Help Button */}
      <button
        onClick={() => setShowHelp(true)}
        className="fixed top-6 right-24 w-14 h-14 rounded-full bg-ft-black text-white border-2 border-ft-black font-plaak text-3xl hover:bg-ft-yellow hover:text-ft-black transition-all duration-200 z-50 no-print flex items-center justify-center"
        title="Help"
        aria-label="Show help information"
      >
        ?
      </button>

      {/* Reset Button */}
      <button
        onClick={handleReset}
        className="fixed top-6 right-96 w-14 h-14 rounded-full bg-ft-black text-white border-2 border-ft-black font-plaak text-3xl hover:bg-ft-yellow hover:text-ft-black transition-all duration-200 z-50 no-print flex items-center justify-center"
        title="Reset & Start Over"
        aria-label="Clear all data and reset"
      >
        ⟲
      </button>

      {/* Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[100] animate-fade-in">
          <div className="bg-white max-w-3xl p-8 md:p-12 border-8 border-ft-black max-h-[80vh] overflow-y-auto m-4">
            <div className="flex justify-between items-start mb-6">
              <h2 className="font-plaak text-4xl md:text-5xl">INSTRUCTIONS</h2>
              <button
                onClick={() => setShowHelp(false)}
                className="text-4xl font-bold hover:text-gray-600 transition-colors"
                aria-label="Close help"
              >
                ×
              </button>
            </div>

            {/* WHY */}
            <div className="mb-6">
              <h3 className="font-plaak text-3xl mb-3">WHY</h3>
              <p className="text-lg font-riforma leading-relaxed">{content.why}</p>
            </div>

            {/* WHAT */}
            <div className="mb-6">
              <h3 className="font-plaak text-3xl mb-3">WHAT</h3>
              <p className="text-lg font-riforma leading-relaxed">{content.what}</p>
            </div>

            {/* HOW */}
            <div className="mb-8">
              <h3 className="font-plaak text-3xl mb-3">HOW</h3>
              <ol className="text-lg space-y-2 font-riforma">
                {content.how.map((step, i) => (
                  <li key={i}>
                    {i + 1}. {step}
                  </li>
                ))}
              </ol>
            </div>

            <button
              className="bg-ft-black text-white w-full text-xl py-4 hover:bg-ft-yellow hover:text-ft-black transition-colors font-riforma"
              onClick={() => setShowHelp(false)}
            >
              GOT IT
            </button>
          </div>
        </div>
      )}

      {/* Animation CSS */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
}

// Export pre-configured help content for each section
export const HELP_CONTENT = {
  audit: {
    why: 'Understanding your current energy state is the foundation for improvement. Without knowing where you stand, you can\'t design an effective protocol.',
    what: 'A quick assessment of your energy across 4 pillars: Sleep, Food, Movement, and Brain. Rate each 1-10 and describe your current habits.',
    how: [
      'Rate each pillar honestly (1 = terrible, 10 = perfect)',
      'Describe your current habits in detail',
      'Be specific about times, quantities, and patterns',
      'Click Continue when all 4 pillars are complete',
    ],
  },
  drains: {
    why: 'Energy drains are the hidden forces sabotaging your performance. Identifying them is the first step to eliminating them.',
    what: 'The top 3 things actively draining your energy right now. These are specific situations, habits, or people.',
    how: [
      'Think: What makes you feel exhausted?',
      'Be specific (not "work stress" but "3pm client calls")',
      'Describe exactly when and where it happens',
      'Rank your top 3 drains',
    ],
  },
  protocol: {
    why: 'Generic goals fail. Specific protocols succeed. This is where you design your actionable energy system.',
    what: 'One specific commitment for each pillar. Not "sleep more" but "in bed by 10pm, phone off at 9:30pm".',
    how: [
      'Read the Fast Track research-backed rules',
      'Review good vs bad examples',
      'Write your protocol with exact times/quantities',
      'Validate: Could someone else execute this without asking questions?',
    ],
  },
  firstWin: {
    why: 'Momentum starts with one action. Your first win creates the habit loop that drives long-term change.',
    what: 'One specific action you\'ll take in the next 24 hours to implement your protocol.',
    how: [
      'Pick the easiest pillar to start',
      'Choose an action you can complete today',
      'Make it ridiculously specific',
      'Commit publicly (share with your team)',
    ],
  },
};

