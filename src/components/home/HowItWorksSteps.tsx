import { useId } from 'react';

export interface StepItem {
  id: number;
  title: string;
  description: string;
}

const STEPS: StepItem[] = [
  {
    id: 1,
    title: 'Alle opdrachten verzameld',
    description: 'Bekijk alle openstaande opdrachten van opdrachtgevers op één centrale plek.',
  },
  {
    id: 2,
    title: 'Selecteer snel relevante opdrachten',
    description: 'Gebruik de zoekfilters en vind direct de opdrachten die aantrekkelijk en relevant zijn voor jou.',
  },
  {
    id: 3,
    title: 'Ontvang opdrachten direct in je mailbox',
    description: 'Krijg een melding wanneer nieuwe opdrachten passen bij je profiel en regio.',
  },
  {
    id: 4,
    title: 'Val op en verrijk je profiel',
    description: 'Maak je profiel compleet met specialismen, regio\'s en BIG-verificatie om op te vallen.',
  },
  {
    id: 5,
    title: 'Reageer snel en efficiënt',
    description: 'Stuur met één klik een reactie naar de opdrachtgever en maak direct afspraken.',
  },
];

export interface HowItWorksStepsProps {
  activeStep: number;
  onStepChange: (step: number) => void;
}

export function HowItWorksSteps({ activeStep, onStepChange }: HowItWorksStepsProps) {
  const listId = useId();

  return (
    <ol
      className="space-y-2"
      role="list"
      aria-label="Stappen om een opdracht te vinden"
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
                  ? 'bg-[#F4FAF4]/80 border-2 border-[#4FA151] shadow-sm'
                  : 'border border-transparent hover:bg-white hover:border-gray-100'
              }`}
              aria-pressed={isActive}
              aria-current={isActive ? 'step' : undefined}
              aria-describedby={isActive ? `${listId}-desc-${step.id}` : undefined}
            >
              <span className="flex items-center gap-3">
                <span
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
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
