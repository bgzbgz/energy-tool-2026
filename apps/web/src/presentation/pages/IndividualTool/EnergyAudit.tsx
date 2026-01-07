import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NumberedSection } from '../../components/energy/NumberedSection';
import { ProgressIndicator } from '../../components/energy/ProgressIndicator';
import { WHYWHATHOWBox } from '../../components/energy/WHYWHATHOWBox';
import { PillarRatingSlider } from '../../components/energy/PillarRatingSlider';
import { AutoSaveIndicator } from '../../components/energy/AutoSaveIndicator';
import { CelebrationScreen } from '../../components/energy/CelebrationScreen';
import { LiveProtocolSidebar } from '../../components/energy/LiveProtocolSidebar';
import { HelpButton, HELP_CONTENT } from '../../components/energy/HelpButton';
import { useAutoSave } from '../../hooks/useAutoSave';
import { useFormValidation } from '../../hooks/useFormValidation';
import { MIN_CHARS } from '@/lib/constants';
import { localStorageService } from '@/infrastructure/storage/local-storage-service';

interface AuditFormData {
  sleep: {
    rating: number;
    habits: string;
  };
  food: {
    rating: number;
    habits: string;
  };
  movement: {
    rating: number;
    habits: string;
  };
  brain: {
    rating: number;
    routines: string;
  };
}

const STORAGE_KEY = 'fasttrack_energy_audit';

export function EnergyAudit() {
  const navigate = useNavigate();
  const [showCelebration, setShowCelebration] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [formData, setFormData] = useState<AuditFormData>({
    sleep: { rating: 5, habits: '' },
    food: { rating: 5, habits: '' },
    movement: { rating: 5, habits: '' },
    brain: { rating: 5, routines: '' },
  });

  // Load saved data on mount
  useEffect(() => {
    const loadSavedData = async () => {
      const saved = await localStorageService.load<AuditFormData>(STORAGE_KEY);
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
    'sleep.habits': { required: true, minLength: MIN_CHARS.HABITS },
    'food.habits': { required: true, minLength: MIN_CHARS.HABITS },
    'movement.habits': { required: true, minLength: MIN_CHARS.HABITS },
    'brain.routines': { required: true, minLength: MIN_CHARS.HABITS },
  });

  const handleRatingChange = (pillar: keyof AuditFormData, rating: number) => {
    setFormData(prev => ({
      ...prev,
      [pillar]: { ...prev[pillar], rating },
    }));
  };

  const handleHabitsChange = (pillar: keyof AuditFormData, value: string) => {
    setFormData(prev => {
      if (pillar === 'brain') {
        return {
          ...prev,
          brain: { ...prev.brain, routines: value },
        };
      } else {
        return {
          ...prev,
          [pillar]: { ...prev[pillar], habits: value },
        };
      }
    });
  };

  const handleContinue = () => {
    const values = {
      'sleep.habits': formData.sleep.habits,
      'food.habits': formData.food.habits,
      'movement.habits': formData.movement.habits,
      'brain.routines': formData.brain.routines,
    };

    if (validateAll(values)) {
      setShowCelebration(true);
    }
  };

  const handleCelebrationContinue = () => {
    setShowCelebration(false);
    navigate('/drains');
  };

  const isFormValid = () => {
    return (
      formData.sleep.habits.length >= MIN_CHARS.HABITS &&
      formData.food.habits.length >= MIN_CHARS.HABITS &&
      formData.movement.habits.length >= MIN_CHARS.HABITS &&
      formData.brain.routines.length >= MIN_CHARS.HABITS
    );
  };

  return (
    <div className="min-h-screen bg-ft-white">
      <ProgressIndicator current={1} total={4} percentage={25} />
      <HelpButton content={HELP_CONTENT.audit} />
      <LiveProtocolSidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        progress={25}
        audit={{
          sleep: formData.sleep.rating,
          food: formData.food.rating,
          movement: formData.movement.rating,
          brain: formData.brain.rating,
        }}
        drainsCompleted={false}
        protocolsCompleted={false}
        firstWinCompleted={false}
        currentSection="audit"
      />

      {showCelebration && (
        <CelebrationScreen
          percentage={25}
          message="Great Progress! You've completed your energy audit."
          onContinue={handleCelebrationContinue}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            <NumberedSection number="01" title="ENERGY AUDIT">
              <div className="space-y-8">
                {/* Sleep Pillar */}
                <div className="space-y-4">
                  <PillarRatingSlider
                    pillar="sleep"
                    value={formData.sleep.rating}
                    onChange={(value) => handleRatingChange('sleep', value)}
                    label="Sleep"
                  />
                  <div>
                    <label htmlFor="sleep-habits" className="block font-monument text-sm font-medium mb-2">
                      Describe your current sleep habits
                    </label>
                    <textarea
                      id="sleep-habits"
                      value={formData.sleep.habits}
                      onChange={(e) => handleHabitsChange('sleep', e.target.value)}
                      className={`w-full min-h-[100px] p-4 border rounded-sm font-riforma ${
                        errors['sleep.habits']
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-ft-border focus:border-ft-black'
                      } focus:outline-none focus:ring-2 focus:ring-ft-yellow`}
                      placeholder="Example: I typically get 7 hours of sleep per night, but I wake up frequently..."
                    />
                    {errors['sleep.habits'] && (
                      <p className="mt-1 text-sm text-red-500 font-riforma">{errors['sleep.habits']}</p>
                    )}
                    <p className="mt-1 text-xs font-monument text-ft-grey">
                      {formData.sleep.habits.length}/{MIN_CHARS.HABITS} characters
                    </p>
                  </div>
                </div>

                {/* Food Pillar */}
                <div className="space-y-4">
                  <PillarRatingSlider
                    pillar="food"
                    value={formData.food.rating}
                    onChange={(value) => handleRatingChange('food', value)}
                    label="Food"
                  />
                  <div>
                    <label htmlFor="food-habits" className="block font-monument text-sm font-medium mb-2">
                      Describe your current food habits
                    </label>
                    <textarea
                      id="food-habits"
                      value={formData.food.habits}
                      onChange={(e) => handleHabitsChange('food', e.target.value)}
                      className={`w-full min-h-[100px] p-4 border rounded-sm font-riforma ${
                        errors['food.habits']
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-ft-border focus:border-ft-black'
                      } focus:outline-none focus:ring-2 focus:ring-ft-yellow`}
                      placeholder="Example: I eat 3 meals per day but often skip breakfast..."
                    />
                    {errors['food.habits'] && (
                      <p className="mt-1 text-sm text-red-500 font-riforma">{errors['food.habits']}</p>
                    )}
                    <p className="mt-1 text-xs font-monument text-ft-grey">
                      {formData.food.habits.length}/{MIN_CHARS.HABITS} characters
                    </p>
                  </div>
                </div>

                {/* Movement Pillar */}
                <div className="space-y-4">
                  <PillarRatingSlider
                    pillar="movement"
                    value={formData.movement.rating}
                    onChange={(value) => handleRatingChange('movement', value)}
                    label="Movement"
                  />
                  <div>
                    <label htmlFor="movement-habits" className="block font-monument text-sm font-medium mb-2">
                      Describe your current movement patterns
                    </label>
                    <textarea
                      id="movement-habits"
                      value={formData.movement.habits}
                      onChange={(e) => handleHabitsChange('movement', e.target.value)}
                      className={`w-full min-h-[100px] p-4 border rounded-sm font-riforma ${
                        errors['movement.habits']
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-ft-border focus:border-ft-black'
                      } focus:outline-none focus:ring-2 focus:ring-ft-yellow`}
                      placeholder="Example: I sit at my desk for 8+ hours per day..."
                    />
                    {errors['movement.habits'] && (
                      <p className="mt-1 text-sm text-red-500 font-riforma">{errors['movement.habits']}</p>
                    )}
                    <p className="mt-1 text-xs font-monument text-ft-grey">
                      {formData.movement.habits.length}/{MIN_CHARS.HABITS} characters
                    </p>
                  </div>
                </div>

                {/* Brain Pillar */}
                <div className="space-y-4">
                  <PillarRatingSlider
                    pillar="brain"
                    value={formData.brain.rating}
                    onChange={(value) => handleRatingChange('brain', value)}
                    label="Brain Use"
                  />
                  <div>
                    <label htmlFor="brain-routines" className="block font-monument text-sm font-medium mb-2">
                      Describe your current brain routines
                    </label>
                    <textarea
                      id="brain-routines"
                      value={formData.brain.routines}
                      onChange={(e) => handleHabitsChange('brain', e.target.value)}
                      className={`w-full min-h-[100px] p-4 border rounded-sm font-riforma ${
                        errors['brain.routines']
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-ft-border focus:border-ft-black'
                      } focus:outline-none focus:ring-2 focus:ring-ft-yellow`}
                      placeholder="Example: I do deep work in the morning from 8-11 AM..."
                    />
                    {errors['brain.routines'] && (
                      <p className="mt-1 text-sm text-red-500 font-riforma">{errors['brain.routines']}</p>
                    )}
                    <p className="mt-1 text-xs font-monument text-ft-grey">
                      {formData.brain.routines.length}/{MIN_CHARS.HABITS} characters
                    </p>
                  </div>
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
              why="Without an honest baseline assessment, we cannot identify where to focus improvement efforts. This is the foundation of the entire protocol design process."
              what="You'll rate each of the 4 energy pillars (Sleep, Food, Movement, Brain) on a scale of 1-10 and describe your current habits in detail."
              how="1. Rate each pillar honestly (1 = terrible, 10 = excellent) 2. Describe your current habits for each pillar (minimum 50 characters) 3. Be specific about times, amounts, and patterns"
            />
          </div>
        </div>
      </div>

      <AutoSaveIndicator status={saveStatus} lastSaved={lastSaved} />
    </div>
  );
}

