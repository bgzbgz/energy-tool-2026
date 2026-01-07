import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NumberedSection } from '../../components/energy/NumberedSection';
import { ProgressIndicator } from '../../components/energy/ProgressIndicator';
import { WHYWHATHOWBox } from '../../components/energy/WHYWHATHOWBox';
import { AutoSaveIndicator } from '../../components/energy/AutoSaveIndicator';
import { CelebrationScreen } from '../../components/energy/CelebrationScreen';
import { useAutoSave } from '../../hooks/useAutoSave';
import { useFormValidation } from '../../hooks/useFormValidation';
import { MIN_CHARS } from '@/lib/constants';
import { localStorageService } from '@/infrastructure/storage/local-storage-service';

interface FirstWinFormData {
  action: string;
  timeframe: string;
  accountability_partner: string;
}

const STORAGE_KEY = 'fasttrack_energy_firstwin';

export function FirstWin() {
  const navigate = useNavigate();
  const [showCelebration, setShowCelebration] = useState(false);
  const [formData, setFormData] = useState<FirstWinFormData>({
    action: '',
    timeframe: '',
    accountability_partner: '',
  });

  // Load saved data on mount
  useEffect(() => {
    const loadSavedData = async () => {
      const saved = await localStorageService.load<FirstWinFormData>(STORAGE_KEY);
      if (saved) {
        setFormData(saved);
      }
    };
    loadSavedData();
  }, []);

  // Auto-save
  const { status: saveStatus, lastSaved } = useAutoSave(formData, {
    storageKey: STORAGE_KEY,
  });

  // Form validation
  const { errors, validateAll } = useFormValidation({
    'action': { required: true, minLength: MIN_CHARS.FIRST_WIN },
    'timeframe': { required: true, minLength: MIN_CHARS.TIMES },
    'accountability_partner': { required: true, minLength: MIN_CHARS.PARTNER },
  });

  const handleFieldChange = (field: keyof FirstWinFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleContinue = () => {
    const values = {
      'action': formData.action,
      'timeframe': formData.timeframe,
      'accountability_partner': formData.accountability_partner,
    };

    if (validateAll(values)) {
      setShowCelebration(true);
    }
  };

  const handleCelebrationContinue = () => {
    setShowCelebration(false);
    navigate('/strength-analyzer');
  };

  const isFormValid = () => {
    return (
      formData.action.length >= MIN_CHARS.FIRST_WIN &&
      formData.timeframe.length >= MIN_CHARS.TIMES &&
      formData.accountability_partner.length >= MIN_CHARS.PARTNER
    );
  };

  return (
    <div className="min-h-screen bg-ft-white">
      <ProgressIndicator current={4} total={4} percentage={100} />

      {showCelebration && (
        <CelebrationScreen
          percentage={100}
          message="Congratulations! You've completed your energy protocol."
          onContinue={handleCelebrationContinue}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            <NumberedSection number="04" title="FIRST 24-HOUR WIN">
              <div className="space-y-8">
                {/* Action */}
                <div>
                  <label htmlFor="action" className="block font-monument text-sm font-medium mb-2">
                    What is ONE specific action you'll take in the next 24 hours?
                  </label>
                  <textarea
                    id="action"
                    value={formData.action}
                    onChange={(e) => handleFieldChange('action', e.target.value)}
                    className={`w-full min-h-[100px] p-4 border rounded-sm font-riforma ${
                      errors['action']
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-ft-border focus:border-ft-black'
                    } focus:outline-none focus:ring-2 focus:ring-ft-yellow`}
                    placeholder="Example: Tomorrow morning at 9 AM, I will turn off all notifications (email, Slack, phone) and complete one focused 90-minute work block on my quarterly strategy document without interruptions."
                  />
                  {errors['action'] && (
                    <p className="mt-1 text-sm text-red-500 font-riforma">{errors['action']}</p>
                  )}
                  <p className="mt-1 text-xs font-monument text-ft-grey">
                    {formData.action.length}/{MIN_CHARS.FIRST_WIN} characters minimum
                  </p>
                </div>

                {/* Timeframe */}
                <div>
                  <label htmlFor="timeframe" className="block font-monument text-sm font-medium mb-2">
                    What is the exact timeframe for this action?
                  </label>
                  <input
                    id="timeframe"
                    type="text"
                    value={formData.timeframe}
                    onChange={(e) => handleFieldChange('timeframe', e.target.value)}
                    className={`w-full p-4 border rounded-sm font-riforma ${
                      errors['timeframe']
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-ft-border focus:border-ft-black'
                    } focus:outline-none focus:ring-2 focus:ring-ft-yellow`}
                    placeholder="Example: Tomorrow (Wednesday) 9:00 AM - 10:30 AM"
                  />
                  {errors['timeframe'] && (
                    <p className="mt-1 text-sm text-red-500 font-riforma">{errors['timeframe']}</p>
                  )}
                  <p className="mt-1 text-xs font-monument text-ft-grey">
                    {formData.timeframe.length}/{MIN_CHARS.TIMES} characters minimum
                  </p>
                </div>

                {/* Accountability Partner */}
                <div>
                  <label htmlFor="accountability-partner" className="block font-monument text-sm font-medium mb-2">
                    Who is your accountability partner? (Name or email)
                  </label>
                  <input
                    id="accountability-partner"
                    type="text"
                    value={formData.accountability_partner}
                    onChange={(e) => handleFieldChange('accountability_partner', e.target.value)}
                    className={`w-full p-4 border rounded-sm font-riforma ${
                      errors['accountability_partner']
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-ft-border focus:border-ft-black'
                    } focus:outline-none focus:ring-2 focus:ring-ft-yellow`}
                    placeholder="Example: Sarah Chen (my manager)"
                  />
                  {errors['accountability_partner'] && (
                    <p className="mt-1 text-sm text-red-500 font-riforma">{errors['accountability_partner']}</p>
                  )}
                  <p className="mt-1 text-xs font-monument text-ft-grey">
                    {formData.accountability_partner.length}/{MIN_CHARS.PARTNER} characters minimum
                  </p>
                </div>

                {/* Continue Button */}
                <div className="pt-6">
                  <button
                    onClick={handleContinue}
                    disabled={!isFormValid()}
                    className={`w-full py-4 px-8 font-plaak font-bold text-lg uppercase tracking-wide rounded-sm transition-colors ${
                      isFormValid()
                        ? 'bg-ft-black text-ft-white hover:bg-ft-grey'
                        : 'bg-ft-border text-ft-grey cursor-not-allowed'
                    }`}
                  >
                    Continue to Canvas
                  </button>
                </div>
              </div>
            </NumberedSection>
          </div>

          {/* WHY/WHAT/HOW Sidebar */}
          <div className="lg:w-80">
            <WHYWHATHOWBox
              why="Small wins create momentum; immediate action prevents procrastination. Without a first 24-hour action, protocols remain theoretical. This bridges the gap between planning and doing."
              what="You'll commit to ONE specific action you'll take in the next 24 hours, set an exact timeframe, and name an accountability partner who will check in with you."
              how="1. Define one specific action (50+ characters, be very specific) 2. Set the exact timeframe (when exactly will you do this?) 3. Name your accountability partner (someone who will hold you accountable)"
            />
          </div>
        </div>
      </div>

      <AutoSaveIndicator status={saveStatus} lastSaved={lastSaved} />
    </div>
  );
}

