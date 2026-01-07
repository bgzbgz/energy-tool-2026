import { useState, useEffect } from 'react';
import { FastTrackCanvas } from '../../components/energy/FastTrackCanvas';
import { useSubmitProtocol } from '../../hooks/useSubmissions';
import { localStorageService } from '@/infrastructure/storage/local-storage-service';

interface AuditFormData {
  sleep: { rating: number; habits: string };
  food: { rating: number; habits: string };
  movement: { rating: number; habits: string };
  brain: { rating: number; routines: string };
}

interface DrainsFormData {
  biggest_drain: string;
  impact: string;
  peak_times: string;
  crash_times: string;
}

interface ProtocolFormData {
  sleep_commitment: string;
  food_commitment: string;
  movement_commitment: string;
  brain_commitment: string;
}

interface FirstWinFormData {
  action: string;
  timeframe: string;
  accountability_partner: string;
}

interface CompleteProtocol {
  audit: {
    sleep: { rating: number; habits: string };
    food: { rating: number; habits: string };
    movement: { rating: number; habits: string };
    brain: { rating: number; routines: string };
  };
  drains: {
    biggest_drain: string;
    impact: string;
    peak_times: string;
    crash_times: string;
  };
  protocols: {
    sleep_commitment: string;
    food_commitment: string;
    movement_commitment: string;
    brain_commitment: string;
  };
  first_win: {
    action: string;
    timeframe: string;
    accountability_partner: string;
  };
}

export function Canvas() {
  const [protocol, setProtocol] = useState<CompleteProtocol | null>(null);
  const [userName, setUserName] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [showPrintView, setShowPrintView] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const submitMutation = useSubmitProtocol();

  // Load all data from localStorage
  useEffect(() => {
    const loadAllData = async () => {
      const audit = await localStorageService.load<AuditFormData>('fasttrack_energy_audit');
      const drains = await localStorageService.load<DrainsFormData>('fasttrack_energy_drains');
      const protocols = await localStorageService.load<ProtocolFormData>('fasttrack_energy_protocol');
      const firstWin = await localStorageService.load<FirstWinFormData>('fasttrack_energy_firstwin');

      if (audit && drains && protocols && firstWin) {
        // Validate required fields exist
        if (
          audit.sleep?.rating && audit.food?.rating && audit.movement?.rating && audit.brain?.rating &&
          audit.sleep.habits && audit.food.habits && audit.movement.habits && audit.brain.routines &&
          drains.biggest_drain && drains.impact && drains.peak_times && drains.crash_times &&
          protocols.sleep_commitment && protocols.food_commitment && protocols.movement_commitment && protocols.brain_commitment &&
          firstWin.action && firstWin.timeframe && firstWin.accountability_partner
        ) {
          setProtocol({
            audit: {
              sleep: { rating: audit.sleep.rating, habits: audit.sleep.habits },
              food: { rating: audit.food.rating, habits: audit.food.habits },
              movement: { rating: audit.movement.rating, habits: audit.movement.habits },
              brain: { rating: audit.brain.rating, routines: audit.brain.routines },
            },
            drains,
            protocols,
            first_win: firstWin,
          });
        }
      }
    };

    loadAllData();
  }, []);

  const handlePrint = () => {
    setShowPrintView(true);
    setTimeout(() => {
      window.print();
      setShowPrintView(false);
    }, 100);
  };

  const handleSubmit = async () => {
    if (!protocol || !userName.trim() || !companyId.trim()) {
      setSubmitError('Please fill in your name and company ID');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Transform protocol to match submission schema (brain.routines -> brain.habits)
      const toolData = {
        ...protocol,
        audit: {
          ...protocol.audit,
          brain: {
            rating: protocol.audit.brain.rating,
            habits: protocol.audit.brain.routines, // Map routines to habits for schema
            routines: protocol.audit.brain.routines,
          },
        },
      };

      const result = await submitMutation.mutateAsync({
        userId: `${userName.toLowerCase().replace(/\s+/g, '.')}@${companyId}.com`, // Generate email
        userName: userName.trim(),
        companyId: companyId.trim(),
        companyName: companyName.trim() || undefined,
        toolData,
      });

      if (result.success) {
        setSubmitSuccess(true);
        // Clear all localStorage
        await Promise.all([
          localStorageService.clear('fasttrack_energy_audit'),
          localStorageService.clear('fasttrack_energy_drains'),
          localStorageService.clear('fasttrack_energy_protocol'),
          localStorageService.clear('fasttrack_energy_firstwin'),
        ]);
      } else {
        setSubmitError(result.error || 'Submission failed. Please try again.');
      }
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!protocol) {
    return (
      <div className="min-h-screen bg-ft-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-plaak font-bold text-2xl mb-4">Loading Protocol...</h1>
          <p className="font-riforma text-ft-grey">Please wait while we load your data.</p>
        </div>
      </div>
    );
  }

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-ft-white flex items-center justify-center p-8">
        <div className="max-w-2xl text-center">
          <div className="text-6xl mb-6">🎉</div>
          <h1 className="font-plaak font-bold text-4xl mb-4">Protocol Submitted!</h1>
          <p className="font-riforma text-lg text-ft-grey mb-8">
            Your energy protocol has been successfully submitted. Your Guru can now review it.
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-ft-black text-ft-white font-plaak font-bold px-8 py-3 rounded-sm hover:bg-ft-grey transition-colors uppercase"
          >
            Start New Protocol
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ft-white">
      {/* Action Bar */}
      <div className="bg-ft-black text-ft-white py-4 px-6 print:hidden">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <h1 className="font-plaak font-bold text-xl uppercase">Your Energy Protocol</h1>
          <div className="flex gap-4">
            <button
              onClick={handlePrint}
              className="bg-ft-white text-ft-black font-plaak font-bold px-6 py-2 rounded-sm hover:bg-ft-grey transition-colors uppercase text-sm"
            >
              Print
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !userName.trim() || !companyId.trim()}
              className={`font-plaak font-bold px-6 py-2 rounded-sm transition-colors uppercase text-sm ${
                isSubmitting || !userName.trim() || !companyId.trim()
                  ? 'bg-ft-grey text-ft-black cursor-not-allowed'
                  : 'bg-ft-yellow text-ft-black hover:bg-ft-yellow-dark transition-colors duration-fast'
              }`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Protocol'}
            </button>
          </div>
        </div>
      </div>

      {/* User Info Form */}
      {!submitSuccess && (
        <div className="bg-gray-50 border-b border-ft-border py-4 px-6 print:hidden">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="user-name" className="block font-monument text-xs uppercase mb-1">
                  Your Name
                </label>
                <input
                  id="user-name"
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full p-2 border border-ft-border rounded-sm font-riforma text-sm focus:outline-none focus:ring-2 focus:ring-ft-yellow"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label htmlFor="company-id" className="block font-monument text-xs uppercase mb-1">
                  Company ID *
                </label>
                <input
                  id="company-id"
                  type="text"
                  value={companyId}
                  onChange={(e) => setCompanyId(e.target.value)}
                  className="w-full p-2 border border-ft-border rounded-sm font-riforma text-sm focus:outline-none focus:ring-2 focus:ring-ft-yellow"
                  placeholder="acme-corp"
                  required
                />
              </div>
              <div>
                <label htmlFor="company-name" className="block font-monument text-xs uppercase mb-1">
                  Company Name (Optional)
                </label>
                <input
                  id="company-name"
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full p-2 border border-ft-border rounded-sm font-riforma text-sm focus:outline-none focus:ring-2 focus:ring-ft-yellow"
                  placeholder="Acme Corporation"
                />
              </div>
            </div>
            {submitError && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-sm p-3">
                <p className="text-sm text-red-700 font-riforma">{submitError}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Canvas */}
      <FastTrackCanvas
        protocol={protocol}
        userName={userName || 'Your Name'}
        companyId={companyId || 'your-company'}
        companyName={companyName}
        submittedAt={new Date()}
        isPrintView={showPrintView}
      />
    </div>
  );
}

