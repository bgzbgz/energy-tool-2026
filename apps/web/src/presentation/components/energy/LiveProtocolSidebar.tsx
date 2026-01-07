import React from 'react';

interface LiveProtocolSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  progress: number; // 0-100
  audit?: {
    sleep: number;
    food: number;
    movement: number;
    brain: number;
  };
  drainsCompleted: boolean;
  protocolsCompleted: boolean;
  firstWinCompleted: boolean;
  currentSection: string;
}

export function LiveProtocolSidebar({
  isCollapsed,
  onToggle,
  progress,
  audit,
  drainsCompleted,
  protocolsCompleted,
  firstWinCompleted,
  currentSection,
}: LiveProtocolSidebarProps) {
  const getSectionIcon = (completed: boolean, active: boolean) => {
    if (completed) return '✓';
    if (active) return '→';
    return '○';
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="fixed top-6 right-6 z-50 w-12 h-12 bg-ft-black text-ft-yellow border-2 border-ft-black rounded-full hover:bg-ft-yellow hover:text-ft-black transition-all duration-200 no-print flex items-center justify-center text-xl font-bold"
        title={isCollapsed ? 'Show Progress' : 'Hide Progress'}
        aria-label={isCollapsed ? 'Show Progress Sidebar' : 'Hide Progress Sidebar'}
      >
        {isCollapsed ? '◀' : '▶'}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-24 right-6 w-80 bg-ft-black text-white p-6 border-4 border-ft-black z-40 max-h-[calc(100vh-150px)] overflow-y-auto no-print transition-transform duration-300 ease-in-out ${
          isCollapsed ? 'translate-x-[calc(100%+24px)]' : 'translate-x-0'
        }`}
        role="complementary"
        aria-label="Protocol Progress"
      >
        <h3 className="font-plaak text-2xl text-ft-yellow mb-4">YOUR PROTOCOL</h3>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-riforma">Overall Progress</span>
            <span className="text-sm font-bold font-monument">{progress}%</span>
          </div>
          <div className="h-2 bg-gray-700 rounded">
            <div
              className="h-full bg-ft-yellow transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Section Status */}
        <div className="space-y-3 mb-6 pb-6 border-b border-gray-600">
          <div className={`flex items-center gap-2 ${currentSection === 'audit' ? 'text-ft-yellow' : ''}`}>
            <span className="font-bold text-lg">{getSectionIcon(progress >= 25, currentSection === 'audit')}</span>
            <span className="font-riforma">Energy Audit</span>
          </div>
          <div className={`flex items-center gap-2 ${currentSection === 'drains' ? 'text-ft-yellow' : ''}`}>
            <span className="font-bold text-lg">{getSectionIcon(drainsCompleted, currentSection === 'drains')}</span>
            <span className="font-riforma">Energy Drains</span>
          </div>
          <div className={`flex items-center gap-2 ${currentSection === 'protocol' ? 'text-ft-yellow' : ''}`}>
            <span className="font-bold text-lg">{getSectionIcon(protocolsCompleted, currentSection === 'protocol')}</span>
            <span className="font-riforma">Protocol Design</span>
          </div>
          <div className={`flex items-center gap-2 ${currentSection === 'first-win' ? 'text-ft-yellow' : ''}`}>
            <span className="font-bold text-lg">{getSectionIcon(firstWinCompleted, currentSection === 'first-win')}</span>
            <span className="font-riforma">First Win</span>
          </div>
        </div>

        {/* Pillar Ratings */}
        {audit && (
          <div className="mb-6">
            <div className="text-xs text-gray-400 mb-3 font-monument uppercase">Pillar Ratings</div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">😴 Sleep</span>
                <span className="font-bold text-ft-yellow">{audit.sleep}/10</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">🍎 Food</span>
                <span className="font-bold text-ft-yellow">{audit.food}/10</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">🏃 Movement</span>
                <span className="font-bold text-ft-yellow">{audit.movement}/10</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">🧠 Brain</span>
                <span className="font-bold text-ft-yellow">{audit.brain}/10</span>
              </div>
            </div>
          </div>
        )}

        {/* Completion Status */}
        <div className="bg-gray-900 p-4 rounded">
          <div className="text-xs text-gray-400 mb-2 font-monument uppercase">Status</div>
          <div className="text-sm font-riforma">
            {progress < 25 && 'Complete your energy audit'}
            {progress >= 25 && progress < 50 && 'Identify your energy drains'}
            {progress >= 50 && progress < 75 && 'Design your protocols'}
            {progress >= 75 && progress < 100 && 'Set your first win'}
            {progress === 100 && '🎉 Protocol complete!'}
          </div>
        </div>
      </div>

      {/* Mobile: Hide sidebar by default */}
      <style>{`
        @media (max-width: 1400px) {
          .translate-x-0 {
            transform: translateX(calc(100% + 24px));
          }
        }
      `}</style>
    </>
  );
}

