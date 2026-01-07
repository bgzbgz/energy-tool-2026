import { useState } from 'react';
import { useGetSubmissions } from '../hooks/useSubmissions';
import { AggregateCalculator } from '@/domain/services/AggregateCalculator';
import { EnergySubmission } from '@/domain/entities/EnergySubmission';
import type { PillarName } from '@/lib/constants';
import type { Submission } from '../hooks/useSubmissions';

const pillarLabels: Record<PillarName, string> = {
  sleep: 'Sleep',
  food: 'Food',
  movement: 'Movement',
  brain: 'Brain Use',
};

const pillarIcons: Record<PillarName, string> = {
  sleep: '😴',
  food: '🍎',
  movement: '🏃',
  brain: '🧠',
};

export function GuruDashboard() {
  const [companyId, setCompanyId] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState<string | null>(null);

  const { data, isLoading, error, refetch } = useGetSubmissions(companyId, companyId.length > 0);

  const handleSearch = () => {
    if (companyId.trim()) {
      refetch();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Convert API submissions to EnergySubmission entities
  const submissions: EnergySubmission[] = data?.submissions?.map((sub: Submission) => {
    // Map brain routines/habits correctly
    const brainHabits = sub.tool_data.audit.brain.routines || sub.tool_data.audit.brain.habits || '';
    
    return new EnergySubmission(
      sub.id,
      sub.tool_name,
      sub.user_id,
      sub.user_name,
      sub.company_id,
      new Date(sub.submitted_at),
      sub.status as 'completed' | 'draft' | 'deleted',
      {
        audit: {
          sleep: { rating: sub.tool_data.audit.sleep.rating, habits: sub.tool_data.audit.sleep.habits },
          food: { rating: sub.tool_data.audit.food.rating, habits: sub.tool_data.audit.food.habits },
          movement: { rating: sub.tool_data.audit.movement.rating, habits: sub.tool_data.audit.movement.habits },
          brain: { rating: sub.tool_data.audit.brain.rating, habits: brainHabits, routines: brainHabits },
        },
        drains: sub.tool_data.drains,
        protocols: sub.tool_data.protocols,
        first_win: sub.tool_data.first_win,
      },
      sub.company_name,
      undefined, // sprintNumber
      sub.completion_percentage
    );
  }) || [];

  const pillarAverages = AggregateCalculator.calculatePillarAverages(submissions);
  const commonDrains = AggregateCalculator.findCommonDrains(submissions);
  const completionRate = AggregateCalculator.calculateCompletionRate(submissions);

  const getRatingColor = (rating: number) => {
    if (rating <= 3) return 'text-red-500';
    if (rating <= 7) return 'text-ft-yellow';
    return 'text-green-500';
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-ft-white">
      {/* Header */}
      <div className="bg-ft-black text-ft-white py-6 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-plaak font-bold text-3xl uppercase mb-2">Guru Dashboard</h1>
          <p className="font-riforma text-ft-grey">View aggregated energy protocols by company</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Company Filter */}
        <div className="bg-gray-50 border border-ft-border rounded-sm p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="company-id" className="block font-monument text-xs uppercase mb-2">
                Company ID
              </label>
              <input
                id="company-id"
                type="text"
                value={companyId}
                onChange={(e) => setCompanyId(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full p-3 border border-ft-border rounded-sm font-riforma focus:outline-none focus:ring-2 focus:ring-ft-yellow"
                placeholder="Enter company ID (e.g., acme-corp)"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleSearch}
                disabled={!companyId.trim() || isLoading}
                className={`px-8 py-3 font-plaak font-bold uppercase rounded-sm transition-colors ${
                  !companyId.trim() || isLoading
                    ? 'bg-ft-grey text-ft-black cursor-not-allowed'
                    : 'bg-ft-yellow text-ft-black hover:bg-ft-yellow-dark transition-colors duration-fast'
                }`}
              >
                {isLoading ? 'Loading...' : 'Search'}
              </button>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-sm p-4 mb-8">
            <p className="text-red-700 font-riforma">
              {error.message || 'Failed to load submissions. Please try again.'}
            </p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && companyId && data && data.count === 0 && (
          <div className="text-center py-12">
            <p className="font-riforma text-lg text-ft-grey">
              No submissions found for company ID: <strong>{companyId}</strong>
            </p>
          </div>
        )}

        {/* Results */}
        {!isLoading && !error && submissions.length > 0 && (
          <>
            {/* Aggregated Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Pillar Averages */}
              <div className="bg-white border border-ft-border rounded-sm p-6">
                <h2 className="font-plaak font-bold text-xl mb-4 uppercase">Average Pillar Ratings</h2>
                <div className="grid grid-cols-2 gap-4">
                  {(['sleep', 'food', 'movement', 'brain'] as PillarName[]).map((pillar) => (
                    <div key={pillar} className="text-center">
                      <div className="text-2xl mb-1">{pillarIcons[pillar]}</div>
                      <div className="font-monument text-xs text-ft-grey uppercase mb-1">
                        {pillarLabels[pillar]}
                      </div>
                      <div className={`font-plaak font-bold text-2xl ${getRatingColor(pillarAverages[pillar])}`}>
                        {pillarAverages[pillar].toFixed(1)}/10
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Common Drains */}
              <div className="bg-white border border-ft-border rounded-sm p-6">
                <h2 className="font-plaak font-bold text-xl mb-4 uppercase">Top Energy Drains</h2>
                {commonDrains.length > 0 ? (
                  <div className="space-y-3">
                    {commonDrains.map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="bg-red-100 text-red-700 font-plaak font-bold text-sm px-2 py-1 rounded-sm min-w-[2rem] text-center">
                          {item.count}
                        </div>
                        <p className="font-riforma text-sm flex-1">{item.drain}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="font-riforma text-sm text-ft-grey">No common drains identified</p>
                )}
              </div>
            </div>

            {/* Completion Rate */}
            <div className="bg-white border border-ft-border rounded-sm p-6 mb-8">
              <h2 className="font-plaak font-bold text-xl mb-2 uppercase">Completion Rate</h2>
              <div className="flex items-center gap-4">
                <div className="flex-1 bg-gray-100 h-4 rounded-full overflow-hidden">
                  <div
                    className="bg-ft-yellow h-full transition-all duration-300"
                    style={{ width: `${completionRate}%` }}
                  />
                </div>
                <span className="font-plaak font-bold text-lg">{completionRate}%</span>
              </div>
            </div>

            {/* Individual Submissions */}
            <div className="bg-white border border-ft-border rounded-sm p-6">
              <h2 className="font-plaak font-bold text-xl mb-4 uppercase">
                Individual Protocols ({submissions.length})
              </h2>
              <div className="space-y-4">
                {submissions.map((sub) => (
                  <div
                    key={sub.id}
                    className={`border rounded-sm p-4 cursor-pointer transition-colors ${
                      selectedSubmission === sub.id
                        ? 'border-ft-black bg-gray-50'
                        : 'border-ft-border hover:border-ft-grey'
                    }`}
                    onClick={() => setSelectedSubmission(selectedSubmission === sub.id ? null : sub.id)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-plaak font-bold text-lg">{sub.userName}</h3>
                        <p className="font-riforma text-sm text-ft-grey">
                          {sub.companyName && `${sub.companyName} • `}
                          {formatDate(sub.submittedAt)}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-monument text-xs text-ft-grey uppercase mb-1">Ratings</div>
                        <div className="flex gap-2">
                          {(['sleep', 'food', 'movement', 'brain'] as PillarName[]).map((pillar) => (
                            <div key={pillar} className="text-center">
                              <div className="text-xs">{pillarIcons[pillar]}</div>
                              <div className={`font-plaak font-bold text-sm ${getRatingColor(sub.toolData.audit[pillar].rating)}`}>
                                {sub.toolData.audit[pillar].rating}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {selectedSubmission === sub.id && (
                      <div className="mt-4 pt-4 border-t border-ft-border space-y-4">
                        {/* Biggest Drain */}
                        <div>
                          <h4 className="font-monument text-xs uppercase text-ft-grey mb-1">Biggest Energy Drain</h4>
                          <p className="font-riforma text-sm">{sub.toolData.drains.biggest_drain}</p>
                        </div>

                        {/* Protocol Commitments */}
                        <div>
                          <h4 className="font-monument text-xs uppercase text-ft-grey mb-2">Protocol Commitments</h4>
                          <div className="space-y-2">
                            {(['sleep', 'food', 'movement', 'brain'] as PillarName[]).map((pillar) => {
                              const commitment = sub.toolData.protocols[`${pillar}_commitment` as keyof typeof sub.toolData.protocols];
                              return (
                                <div key={pillar} className="bg-gray-50 p-3 rounded-sm">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span>{pillarIcons[pillar]}</span>
                                    <span className="font-monument text-xs uppercase">{pillarLabels[pillar]}</span>
                                  </div>
                                  <p className="font-riforma text-sm">{commitment}</p>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* First Win */}
                        <div className="bg-ft-yellow p-4 rounded-sm">
                          <h4 className="font-plaak font-bold text-sm uppercase mb-2">First 24-Hour Win</h4>
                          <p className="font-riforma text-sm mb-2">{sub.toolData.first_win.action}</p>
                          <div className="text-xs font-monument uppercase text-ft-grey">
                            <p>Timeframe: {sub.toolData.first_win.timeframe}</p>
                            <p>Accountability Partner: {sub.toolData.first_win.accountability_partner}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

