import { useState, useEffect, useRef, useCallback } from 'react';
import { AuthLink } from '../AuthLink';
import { ArrowRight, UserCheck } from 'lucide-react';
import { HowItWorksPreview } from './HowItWorksPreview';
import { HowItWorksSteps } from './HowItWorksSteps';

const TOTAL_STEPS = 5;
const STEP_DURATION = 5000;

export function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(1);
  const [progress, setProgress] = useState(0);
  const startTimeRef = useRef(Date.now());

  const advanceStep = useCallback(() => {
    setActiveStep(prev => prev >= TOTAL_STEPS ? 1 : prev + 1);
    setProgress(0);
    startTimeRef.current = Date.now();
  }, []);

  useEffect(() => {
    startTimeRef.current = Date.now();
    const timer = setTimeout(advanceStep, STEP_DURATION);
    const raf = { id: 0 };
    const tick = () => {
      const elapsed = Date.now() - startTimeRef.current;
      setProgress(Math.min(elapsed / STEP_DURATION, 1));
      raf.id = requestAnimationFrame(tick);
    };
    raf.id = requestAnimationFrame(tick);
    return () => { clearTimeout(timer); cancelAnimationFrame(raf.id); };
  }, [activeStep, advanceStep]);

  const handleStepChange = (step: number) => {
    setActiveStep(step);
    setProgress(0);
    startTimeRef.current = Date.now();
    elapsedBeforePauseRef.current = 0;
  };

  return (
    <section
      className="py-16 sm:py-24 bg-slate-50 relative overflow-hidden"
      aria-labelledby="how-it-works-title"
    >
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-50/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <header className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-1.5 mb-4 border border-slate-200">
            <UserCheck className="w-4 h-4 text-slate-600" />
            <span className="text-sm text-slate-600 font-medium">Voor arbo-professionals</span>
          </div>
          <h2
            id="how-it-works-title"
            className="text-3xl sm:text-4xl font-bold text-[#0F172A] mb-3 tracking-tight"
          >
            Eenvoudig een nieuwe opdracht{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-green-400">vinden</span>
          </h2>
          <p className="text-slate-500 text-lg max-w-lg mx-auto">
            In 5 stappen van profiel naar uw volgende opdracht
          </p>
        </header>

        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-3 order-2 lg:order-1">
            <HowItWorksPreview activeStep={activeStep} />
          </div>

          <div className="lg:col-span-2 order-1 lg:order-2">
            <HowItWorksSteps activeStep={activeStep} onStepChange={handleStepChange} progress={progress} />
          </div>
        </div>

        <div className="mt-14 sm:mt-16">
          <div className="bg-gradient-to-r from-[#0F172A] to-[#1E293B] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <p className="text-white font-semibold text-lg">Waar wacht u nog op?</p>
              <p className="text-slate-400 text-sm mt-1">Maak gratis een account en reageer op opdrachten</p>
            </div>
            <AuthLink
              to="/register"
              className="inline-flex items-center justify-center gap-2 bg-white text-[#0F172A] px-6 py-3.5 rounded-xl font-semibold hover:bg-slate-100 transition-all duration-200 shadow-lg whitespace-nowrap"
            >
              Gratis account aanmaken
              <ArrowRight className="w-4 h-4" aria-hidden />
            </AuthLink>
          </div>
        </div>
      </div>
    </section>
  );
}
