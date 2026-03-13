import { useState } from 'react';
import { AuthLink } from '../AuthLink';
import { ArrowRight } from 'lucide-react';
import { HowItWorksPreview } from './HowItWorksPreview';
import { HowItWorksSteps } from './HowItWorksSteps';

export function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(1);

  return (
    <section
      className="py-16 sm:py-20 bg-slate-50"
      aria-labelledby="how-it-works-title"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-12 sm:mb-14">
          <h2
            id="how-it-works-title"
            className="text-2xl sm:text-3xl font-bold text-[#0F172A] mb-2"
          >
            Eenvoudig een nieuwe opdracht vinden
          </h2>
          <p className="text-slate-500 font-semibold text-sm uppercase tracking-wider">
            Voor Arbo Professionals
          </p>
        </header>

        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-3 order-2 lg:order-1">
            <HowItWorksPreview activeStep={activeStep} />
          </div>

          <div className="lg:col-span-2 order-1 lg:order-2">
            <HowItWorksSteps activeStep={activeStep} onStepChange={setActiveStep} />
          </div>
        </div>

        <div className="mt-12 sm:mt-14 flex flex-col sm:flex-row sm:items-center sm:justify-center gap-4 text-center sm:text-left">
          <p className="text-lg font-medium text-[#0F172A]">
            Waar wacht je nog op?
          </p>
          <AuthLink
            to="/register"
            className="inline-flex items-center justify-center gap-2 bg-[#0F172A] text-white px-6 py-3.5 rounded-xl font-semibold hover:bg-[#1E293B] transition-all duration-200 shadow-lg shadow-slate-900/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
          >
            Maak je gratis account aan
            <ArrowRight className="w-4 h-4" aria-hidden />
          </AuthLink>
        </div>
      </div>
    </section>
  );
}
