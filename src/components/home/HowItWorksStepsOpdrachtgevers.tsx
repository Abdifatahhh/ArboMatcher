import { useId } from 'react';

export interface StepItem {
  id: number;
  title: string;
  description: string;
}

const STEPS: StepItem[] = [
  {
    id: 1,
    title: 'Kies uit een groot aanbod van professionals',
    description: 'Zoek in ons netwerk van BIG-geregistreerde bedrijfsartsen en arbo-professionals op specialisme en regio.',
  },
  {
    id: 2,
    title: 'Uw opdracht snel onder de aandacht',
    description: 'Plaats eenvoudig uw opdracht. Dat kan zelfstandig in het platform, of met ondersteuning van ons team.',
  },
  {
    id: 3,
    title: 'Binnen 48 uur kandidaten',
    description: 'Ontvang reacties van gekwalificeerde professionals die passen bij uw vacature. Meestal al binnen een werkdag.',
  },
  {
    id: 4,
    title: 'Eenvoudig een selectie maken',
    description: 'Bekijk profielen, vergelijk kandidaten en nodig de juiste arts uit voor een gesprek of directe inzet.',
  },
  {
    id: 5,
    title: 'Samen aan het werk',
    description: 'Maak afspraken over start, uren en contractvorm. De professional kan direct aan de slag bij uw organisatie.',
  },
];

export interface HowItWorksStepsOpdrachtgeversProps {
  activeStep: number;
  onStepChange: (step: number) => void;
  progress?: number;
}

export function HowItWorksStepsOpdrachtgevers({ activeStep, onStepChange, progress = 0 }: HowItWorksStepsOpdrachtgeversProps) {
  const listId = useId();

  return (
    <ol
      className="space-y-2"
      role="list"
      aria-label="Stappen voor organisaties"
      id={listId}
    >
      {STEPS.map((step) => {
        const isActive = activeStep === step.id;
        return (
          <li key={step.id}>
            <button
              type="button"
              onClick={() => onStepChange(step.id)}
              className={`w-full text-left rounded-xl px-4 py-4 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 ${
                isActive
                  ? 'bg-white border border-slate-200 shadow-md shadow-slate-100 border-l-[3px] border-l-emerald-500'
                  : 'border border-transparent hover:bg-white/60 hover:border-slate-100'
              }`}
              aria-pressed={isActive}
              aria-current={isActive ? 'step' : undefined}
              aria-describedby={isActive ? `${listId}-desc-${step.id}` : undefined}
            >
              <span className="flex items-center gap-3">
                <span
                  className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-colors ${
                    isActive ? 'bg-gradient-to-br from-emerald-500 to-green-400 text-white shadow-sm' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {step.id}
                </span>
                <span className={`font-semibold ${isActive ? 'text-[#0F172A]' : 'text-slate-700'}`}>
                  {step.title}
                </span>
              </span>
              {isActive && (
                <>
                  <p
                    id={`${listId}-desc-${step.id}`}
                    className="mt-2 ml-11 text-sm text-slate-600 leading-relaxed"
                  >
                    {step.description}
                  </p>
                  <div className="mt-3 ml-11 h-1 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-full"
                      style={{ width: `${progress * 100}%` }}
                    />
                  </div>
                </>
              )}
            </button>
          </li>
        );
      })}
    </ol>
  );
}
