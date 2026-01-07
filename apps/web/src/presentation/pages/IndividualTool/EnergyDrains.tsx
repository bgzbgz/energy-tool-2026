import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NumberedSection } from '../../components/energy/NumberedSection';
import { ProgressIndicator } from '../../components/energy/ProgressIndicator';
import { WHYWHATHOWBox } from '../../components/energy/WHYWHATHOWBox';
import { CommitmentInput } from '../../components/energy/CommitmentInput';
import { AutoSaveIndicator } from '../../components/energy/AutoSaveIndicator';
import { CelebrationScreen } from '../../components/energy/CelebrationScreen';
import { useAutoSave } from '../../hooks/useAutoSave';
import { useFormValidation } from '../../hooks/useFormValidation';
import { MIN_CHARS } from '@/lib/constants';
import { localStorageService } from '@/infrastructure/storage/local-storage-service';

interface DrainsFormData {
  biggest_drain: string;
  impact: string;
  peak_times: string;
  crash_times: string;
}

const STORAGE_KEY = 'fasttrack_energy_drains';

export function EnergyDrains() {
  const navigate = useNavigate();
  const [showCelebration, setShowCelebration] = useState(false);
  const [formData, setFormData] = useState<DrainsFormData>({
    biggest_drain: '',
    impact: '',
    peak_times: '',
    crash_times: '',
  });

  // Load saved data on mount
  useEffect(() => {
    const loadSavedData = async () => {
      const saved = await localStorageService.load<DrainsFormData>(STORAGE_KEY);
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
    'biggest_drain': { required: true, minLength: MIN_CHARS.DRAIN },
    'impact': { required: true, minLength: MIN_CHARS.IMPACT },
    'peak_times': { required: true, minLength: MIN_CHARS.TIMES },
    'crash_times': { required: true, minLength: MIN_CHARS.TIMES },
  });

  const handleFieldChange = (field: keyof DrainsFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleContinue = () => {
    const values = {
      'biggest_drain': formData.biggest_drain,
      'impact': formData.impact,
      'peak_times': formData.peak_times,
      'crash_times': formData.crash_times,
    };

    if (validateAll(values)) {
      // Show celebration screen at 50%
      setShowCelebration(true);
    }
  };

  const handleCelebrationContinue = () => {
    setShowCelebration(false);
    navigate('/protocol');
  };

  const isFormValid = () => {
    return (
      formData.biggest_drain.length >= MIN_CHARS.DRAIN &&
      formData.impact.length >= MIN_CHARS.IMPACT &&
      formData.peak_times.length >= MIN_CHARS.TIMES &&
      formData.crash_times.length >= MIN_CHARS.TIMES
    );
  };

  return (
    <div className="min-h-screen bg-ft-white">
      <ProgressIndicator current={2} total={4} percentage={50} />

      {showCelebration && (
        <CelebrationScreen
          percentage={50}
          message="You're Halfway There!"
          onContinue={handleCelebrationContinue}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            <NumberedSection number="02" title="ENERGY DRAINS">
              <div className="space-y-8">
                {/* Biggest Drain */}
                <CommitmentInput
                  value={formData.biggest_drain}
                  onChange={(value) => handleFieldChange('biggest_drain', value)}
                  minLength={MIN_CHARS.DRAIN}
                  label="What is your single biggest energy drain?"
                  id="biggest-drain"
                  placeholder="Be specific: What exactly destroys your performance? Example: Constant email notifications and Slack messages throughout the day destroy my ability to focus. I check email compulsively every 5-10 minutes, which fragments my attention..."
                />
                {errors['biggest_drain'] && (
                  <p className="text-sm text-red-500 font-riforma -mt-2">{errors['biggest_drain']}</p>
                )}

                {/* Impact */}
                <div>
                  <label htmlFor="impact" className="block font-monument text-sm font-medium mb-2">
                    Quantify the impact on your performance
                  </label>
                  <textarea
                    id="impact"
                    value={formData.impact}
                    onChange={(e) => handleFieldChange('impact', e.target.value)}
                    className={`w-full min-h-[80px] p-4 border rounded-sm font-riforma ${
                      errors['impact']
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-ft-border focus:border-ft-black'
                    } focus:outline-none focus:ring-2 focus:ring-ft-yellow`}
                    placeholder="Example: Reduces productivity by approximately 50%, increases stress levels, makes it impossible to complete complex tasks in one sitting"
                  />
                  {errors['impact'] && (
                    <p className="mt-1 text-sm text-red-500 font-riforma">{errors['impact']}</p>
                  )}
                  <p className="mt-1 text-xs font-monument text-ft-grey">
                    {formData.impact.length}/{MIN_CHARS.IMPACT} characters minimum
                  </p>
                </div>

                {/* Peak Times */}
                <div>
                  <label htmlFor="peak-times" className="block font-monument text-sm font-medium mb-2">
                    When are your peak energy times? (When you're unstoppable)
                  </label>
                  <textarea
                    id="peak-times"
                    value={formData.peak_times}
                    onChange={(e) => handleFieldChange('peak_times', e.target.value)}
                    className={`w-full min-h-[60px] p-4 border rounded-sm font-riforma ${
                      errors['peak_times']
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-ft-border focus:border-ft-black'
                    } focus:outline-none focus:ring-2 focus:ring-ft-yellow`}
                    placeholder="Example: 8-11 AM when I have uninterrupted time before meetings start"
                  />
                  {errors['peak_times'] && (
                    <p className="mt-1 text-sm text-red-500 font-riforma">{errors['peak_times']}</p>
                  )}
                  <p className="mt-1 text-xs font-monument text-ft-grey">
                    {formData.peak_times.length}/{MIN_CHARS.TIMES} characters minimum
                  </p>
                </div>

                {/* Crash Times */}
                <div>
                  <label htmlFor="crash-times" className="block font-monument text-sm font-medium mb-2">
                    When are your crash times? (When you're useless)
                  </label>
                  <textarea
                    id="crash-times"
                    value={formData.crash_times}
                    onChange={(e) => handleFieldChange('crash_times', e.target.value)}
                    className={`w-full min-h-[60px] p-4 border rounded-sm font-riforma ${
                      errors['crash_times']
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-ft-border focus:border-ft-black'
                    } focus:outline-none focus:ring-2 focus:ring-ft-yellow`}
                    placeholder="Example: 2-4 PM after lunch and heavy meeting load"
                  />
                  {errors['crash_times'] && (
                    <p className="mt-1 text-sm text-red-500 font-riforma">{errors['crash_times']}</p>
                  )}
                  <p className="mt-1 text-xs font-monument text-ft-grey">
                    {formData.crash_times.length}/{MIN_CHARS.TIMES} characters minimum
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
                    Continue
                  </button>
                </div>
              </div>
            </NumberedSection>
          </div>

          {/* WHY/WHAT/HOW Sidebar */}
          <div className="lg:w-80">
            <WHYWHATHOWBox
              why="Vague awareness doesn't drive change. Identifying the specific biggest drain forces honesty and creates a focal point for action. Understanding peak and crash times reveals patterns that inform protocol design."
              what="You'll identify your single biggest energy drain, quantify its impact, and map your energy patterns throughout the day."
              how="1. Describe your biggest drain specifically (100+ characters, avoid vague words like 'better' or 'more') 2. Quantify the impact on your performance 3. Identify when you're most productive (peak times) 4. Identify when you're least productive (crash times)"
            />
          </div>
        </div>
      </div>

      <AutoSaveIndicator status={saveStatus} lastSaved={lastSaved} />
    </div>
  );
}

