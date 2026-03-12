import { useId } from 'react';

export interface StepItem {
  id: number;
  title: string;
  description: string;
}

const STEPS: StepItem[] = [
  {
    id: 1,
    title: 'Kies uit een groot aanbod van artsen',
    description: 'Zoek in ons netwerk van BIG-geregistreerde bedrijfsartsen en arbo-professionals op specialisme en regio.',
  },
  {
    id: 2,
    title: 'Jouw opdracht snel onder de aandacht',
    description: 'Plaats eenvoudig jouw opdracht. Dat kan zelfstandig in het platform, of met ondersteuning van ons team.',
  },
  {
    id: 3,
    title: 'Binnen 48 uur kandidaten',
    description: 'Ontvang reacties van gekwalificeerde artsen die passen bij je vacature. Meestal al binnen een werkdag.',
  },
  {
    id: 4,
    title: 'Eenvoudig een selectie maken',
    description: 'Bekijk profielen, vergelijk kandidaten en nodig de juiste arts uit voor een gesprek of directe inzet.',
  },
  {
    id: 5,
    title: 'Samen aan het werk',
    description: 'Maak afspraken over start, uren en contractvorm. De arts kan direct aan de slag bij je organisatie.',
  },
];

export interface HowItWorksStepsOpdrachtgeversProps {
  activeStep: number;
  onStepChange: (step: number) => void;
}

export function HowItWorksStepsOpdrachtgevers({ activeStep, onStepChange }: HowItWorksStepsOpdrachtgeversProps) {
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
              className={`w-full text-left rounded-xl px-4 py-4 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4FA151] focus-visible:ring-offset-2 ${
                isActive
                  ? 'bg-white border border-gray-200 shadow-sm'
                  : 'border border-transparent hover:bg-white hover:border-gray-100'
              }`}
              aria-pressed={isActive}
              aria-current={isActive ? 'step' : undefined}
              aria-describedby={isActive ? `${listId}-desc-${step.id}` : undefined}
            >
              <span className="flex items-center gap-3">
                <span
                  className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-colors ${
                    isActive ? 'bg-[#4FA151] text-white' : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {step.id}
                </span>
                <span className={`font-semibold ${isActive ? 'text-[#0F172A]' : 'text-gray-700'}`}>
                  {step.title}
                </span>
              </span>
              {isActive && (
                <p
                  id={`${listId}-desc-${step.id}`}
                  className="mt-2 ml-11 text-sm text-gray-600 leading-relaxed"
                >
                  {step.description}
                </p>
              )}
            </button>
          </li>
        );
      })}
    </ol>
  );
}
