import { useState } from 'react';
import { AuthLink } from '../AuthLink';
import { ArrowRight, Building2 } from 'lucide-react';
import { HowItWorksPreviewOpdrachtgevers } from './HowItWorksPreviewOpdrachtgevers';
import { HowItWorksStepsOpdrachtgevers } from './HowItWorksStepsOpdrachtgevers';

export function HowItWorksSectionOpdrachtgevers() {
  const [activeStep, setActiveStep] = useState(1);

  return (
    <section
      className="py-16 sm:py-24 bg-white relative overflow-hidden"
      aria-labelledby="how-it-works-organisaties-title"
    >
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <header className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 bg-slate-100 rounded-full px-4 py-1.5 mb-4">
            <Building2 className="w-4 h-4 text-slate-600" />
            <span className="text-sm text-slate-600 font-medium">Voor organisaties</span>
          </div>
          <h2
            id="how-it-works-organisaties-title"
            className="text-3xl sm:text-4xl font-bold text-[#0F172A] mb-3 tracking-tight"
          >
            Eenvoudig de juiste professional{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-green-400">vinden</span>
          </h2>
          <p className="text-slate-500 text-lg max-w-lg mx-auto">
            In 5 stappen van vacature naar de ideale kandidaat
          </p>
        </header>

        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-3 order-2 lg:order-1">
            <HowItWorksPreviewOpdrachtgevers activeStep={activeStep} />
          </div>

          <div className="lg:col-span-2 order-1 lg:order-2">
            <HowItWorksStepsOpdrachtgevers activeStep={activeStep} onStepChange={setActiveStep} />
          </div>
        </div>

        <div className="mt-14 sm:mt-16">
          <div className="bg-gradient-to-r from-[#0F172A] to-[#1E293B] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <p className="text-white font-semibold text-lg">Kandidaat of opdracht vinden?</p>
              <p className="text-slate-400 text-sm mt-1">Maak gratis een account en plaats uw eerste opdracht</p>
            </div>
            <AuthLink
              to="/register"
              className="inline-flex items-center justify-center gap-2 bg-white text-[#0F172A] px-6 py-3.5 rounded-xl font-semibold hover:bg-slate-100 transition-all duration-200 shadow-lg whitespace-nowrap"
            >
              Registreer gratis
              <ArrowRight className="w-4 h-4" aria-hidden />
            </AuthLink>
          </div>
        </div>
      </div>
    </section>
  );
}
