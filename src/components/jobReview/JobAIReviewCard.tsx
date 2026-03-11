import type { JobAIFeedback } from '../../lib/jobReviewTypes';
import { Sparkles, CheckCircle, AlertTriangle, AlertCircle } from 'lucide-react';

interface JobAIReviewCardProps {
  feedback: JobAIFeedback | null;
  compact?: boolean;
}

export function JobAIReviewCard({ feedback, compact }: JobAIReviewCardProps) {
  if (!feedback || feedback.ai_status === 'idle' || feedback.ai_status === 'pending') {
    return (
      <div className="bg-gray-50 rounded-xl p-4 text-center text-gray-500 text-sm">
        Geen AI-beoordeling beschikbaar. Dien de opdracht in om te beoordelen.
      </div>
    );
  }

  if (feedback.ai_status === 'error') {
    return (
      <div className="bg-amber-50 rounded-xl p-4 flex items-start gap-2 text-amber-800 text-sm">
        <AlertCircle className="w-5 h-5 flex-shrink-0" />
        <span>AI-beoordeling kon niet worden uitgevoerd. Structurele score is wel beschikbaar.</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-4 py-2.5 border-b border-gray-100 flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-[#4FA151]" />
        <span className="font-medium text-[#0F172A]">AI-beoordeling</span>
      </div>
      <div className={`space-y-3 ${compact ? 'p-3' : 'p-4'}`}>
        {feedback.ai_feedback_summary && (
          <p className="text-sm text-gray-700">{feedback.ai_feedback_summary}</p>
        )}
        {feedback.ai_strengths && feedback.ai_strengths.length > 0 && (
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase mb-1">Sterke punten</p>
            <ul className="space-y-1">
              {feedback.ai_strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-emerald-800">
                  <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {feedback.ai_improvements && feedback.ai_improvements.length > 0 && (
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase mb-1">Verbeterpunten</p>
            <ul className="space-y-1">
              {feedback.ai_improvements.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-amber-800">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {feedback.ai_last_reviewed_at && (
          <p className="text-xs text-gray-400">
            Laatst beoordeeld: {new Date(feedback.ai_last_reviewed_at).toLocaleString('nl-NL')}
          </p>
        )}
      </div>
    </div>
  );
}
