import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NumberedSection } from '../../components/energy/NumberedSection';
import { ProgressIndicator } from '../../components/energy/ProgressIndicator';
import { WHYWHATHOWBox } from '../../components/energy/WHYWHATHOWBox';
import { CommitmentInput } from '../../components/energy/CommitmentInput';
import { FastTrackRules } from '../../components/energy/FastTrackRules';
import { CommitmentExamples } from '../../components/energy/CommitmentExamples';
import { AutoSaveIndicator } from '../../components/energy/AutoSaveIndicator';
import { CelebrationScreen } from '../../components/energy/CelebrationScreen';
import { useAutoSave } from '../../hooks/useAutoSave';
import { useFormValidation } from '../../hooks/useFormValidation';
import { MIN_CHARS, PILLAR_NAMES } from '@/lib/constants';
import type { PillarName } from '@/lib/constants';
import { localStorageService } from '@/infrastructure/storage/local-storage-service';

interface ProtocolFormData {
  sleep_commitment: string;
  food_commitment: string;
  movement_commitment: string;
  brain_commitment: string;
}

const STORAGE_KEY = 'fasttrack_energy_protocol';

const pillarLabels: Record<PillarName, string> = {
  sleep: 'Sleep Commitment',
  food: 'Food Commitment',
  movement: 'Movement Commitment',
  brain: 'Brain Use Commitment',
};

export function ProtocolDesign() {
  const navigate = useNavigate();
  const [showCelebration, setShowCelebration] = useState(false);
  const [formData, setFormData] = useState<ProtocolFormData>({
    sleep_commitment: '',
    food_commitment: '',
    movement_commitment: '',
    brain_commitment: '',
  });

  // Load saved data on mount
  useEffect(() => {
    const loadSavedData = async () => {
      const saved = await localStorageService.load<ProtocolFormData>(STORAGE_KEY);
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
    'sleep_commitment': { required: true, minLength: MIN_CHARS.COMMITMENT },
    'food_commitment': { required: true, minLength: MIN_CHARS.COMMITMENT },
    'movement_commitment': { required: true, minLength: MIN_CHARS.COMMITMENT },
    'brain_commitment': { required: true, minLength: MIN_CHARS.COMMITMENT },
  });

  const handleCommitmentChange = (pillar: PillarName, value: string) => {
    const fieldName = `${pillar}_commitment` as keyof ProtocolFormData;
    setFormData(prev => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const handleContinue = () => {
    const values = {
      'sleep_commitment': formData.sleep_commitment,
      'food_commitment': formData.food_commitment,
      'movement_commitment': formData.movement_commitment,
      'brain_commitment': formData.brain_commitment,
    };

    if (validateAll(values)) {
      setShowCelebration(true);
    }
  };

  const handleCelebrationContinue = () => {
    setShowCelebration(false);
    navigate('/first-win');
  };

  const isFormValid = () => {
    return (
      formData.sleep_commitment.length >= MIN_CHARS.COMMITMENT &&
      formData.food_commitment.length >= MIN_CHARS.COMMITMENT &&
      formData.movement_commitment.length >= MIN_CHARS.COMMITMENT &&
      formData.brain_commitment.length >= MIN_CHARS.COMMITMENT
    );
  };

  return (
    <div className="min-h-screen bg-ft-white">
      <ProgressIndicator current={3} total={4} percentage={75} />

      {showCelebration && (
        <CelebrationScreen
          percentage={75}
          message="Almost There! You've designed your energy protocol."
          onContinue={handleCelebrationContinue}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            <NumberedSection number="03" title="PROTOCOL DESIGN">
              <div className="space-y-12">
                {PILLAR_NAMES.map((pillar) => {
                  const fieldName = `${pillar}_commitment` as keyof ProtocolFormData;
                  const value = formData[fieldName];

                  return (
                    <div key={pillar} className="space-y-6">
                      {/* Pillar Header */}
                      <div className="border-b border-ft-border pb-4">
                        <h2 className="font-plaak font-bold text-2xl uppercase">
                          {pillarLabels[pillar]}
                        </h2>
                      </div>

                      {/* Fast Track Rules */}
                      <FastTrackRules pillar={pillar} />

                      {/* Examples */}
                      <CommitmentExamples pillar={pillar} />

                      {/* Commitment Input */}
                      <CommitmentInput
                        value={value}
                        onChange={(newValue) => handleCommitmentChange(pillar, newValue)}
                        minLength={MIN_CHARS.COMMITMENT}
                        label={`Your ${pillarLabels[pillar]}`}
                        id={`${pillar}-commitment`}
                        placeholder={`Example: ${pillar === 'sleep' ? 'Lights out by 10:30 PM every night, no screens after 10 PM...' : pillar === 'food' ? 'Eat breakfast at 7 AM (2 eggs, oatmeal, berries)...' : pillar === 'movement' ? '30-minute walk at 6:30 AM daily before work...' : 'Email and Slack turned off from 9-11 AM and 2-4 PM...'}`}
                      />
                      {errors[fieldName] && (
                        <p className="text-sm text-red-500 font-riforma -mt-2">{errors[fieldName]}</p>
                      )}
                    </div>
                  );
                })}

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
              why="Vague intentions don't create change; specific protocols do. This is the core output of the tool—the actual protocol that will guide behavior. Without this, we have awareness but no action plan."
              what="You'll create specific, measurable commitments for each of the 4 pillars with exact times, amounts, and rituals. Each commitment must be detailed enough to act on immediately."
              how="1. Review Fast Track research-backed rules for each pillar 2. Study the examples (good vs bad) 3. Write your commitment with exact times, amounts, and rituals (100+ characters) 4. Avoid vague words like 'better', 'more', 'less' 5. Include specific details: when, where, how much, how often"
            />
          </div>
        </div>
      </div>

      <AutoSaveIndicator status={saveStatus} lastSaved={lastSaved} />
    </div>
  );
}

