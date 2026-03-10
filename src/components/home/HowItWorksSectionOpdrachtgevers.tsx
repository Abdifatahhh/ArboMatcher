import { useState } from 'react';
import { AuthLink } from '../AuthLink';
import { ArrowRight } from 'lucide-react';
import { HowItWorksPreviewOpdrachtgevers } from './HowItWorksPreviewOpdrachtgevers';
import { HowItWorksStepsOpdrachtgevers } from './HowItWorksStepsOpdrachtgevers';

export function HowItWorksSectionOpdrachtgevers() {
  const [activeStep, setActiveStep] = useState(1);

  return (
    <section
      className="py-16 sm:py-20 bg-gradient-to-b from-[#E8F5E9] to-[#F1F8E9]"
      aria-labelledby="how-it-works-opdrachtgevers-title"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-12 sm:mb-14">
          <p className="text-gray-500 font-medium text-sm uppercase tracking-wider mb-1">
            Top talent om te groeien
          </p>
          <h2
            id="how-it-works-opdrachtgevers-title"
            className="text-2xl sm:text-3xl font-bold text-[#0F172A] mb-2"
          >
            Eenvoudig de juiste arts vinden
          </h2>
          <p className="text-[#4FA151] font-semibold text-sm uppercase tracking-wider">
            Voor Opdrachtgevers
          </p>
        </header>

        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-start">
          {/* Preview: 60% on desktop (3/5) - left */}
          <div className="lg:col-span-3 order-2 lg:order-1">
            <HowItWorksPreviewOpdrachtgevers activeStep={activeStep} />
          </div>

          {/* Steps: 40% on desktop (2/5) - right */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <HowItWorksStepsOpdrachtgevers activeStep={activeStep} onStepChange={setActiveStep} />
          </div>
        </div>

        <div className="mt-12 sm:mt-14 flex flex-col sm:flex-row sm:items-center sm:justify-center gap-4 text-center sm:text-left">
          <p className="text-lg font-medium text-[#0F172A]">
            Kandidaat of opdracht vinden?
          </p>
          <AuthLink
            to="/register"
            className="inline-flex items-center justify-center gap-2 bg-[#4FA151] text-white px-6 py-3.5 rounded-xl font-semibold hover:bg-[#3E8E45] transition-all duration-200 shadow-lg shadow-[#4FA151]/20 hover:shadow-[#4FA151]/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4FA151] focus-visible:ring-offset-2"
          >
            Registreer je gratis
            <ArrowRight className="w-4 h-4" aria-hidden />
          </AuthLink>
        </div>
      </div>
    </section>
  );
}
