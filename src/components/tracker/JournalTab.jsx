import { BookOpen } from 'lucide-react';
import { FLOW_COLORS, MOOD_COLORS } from './JournalEntryModal';

const SYMPTOM_LIMIT = 4;

const JournalTab = ({ entries, onEditEntry }) => {
  if (entries.length === 0) {
    return (
      <div className="bg-gray-50 border border-dashed border-gray-200 rounded-xl p-8 text-center">
        <BookOpen size={28} className="text-gray-300 mx-auto mb-3" />
        <p className="text-sm text-gray-500 mb-1">No journal entries yet.</p>
        <p className="text-xs text-gray-400">Go to the Calendar tab and click any day to add your first entry.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {entries.map(entry => {
        const displayDate = new Date(entry.entry_date + 'T00:00:00').toLocaleDateString('en-US', {
          weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
        });
        const visibleSymptoms = entry.symptoms?.slice(0, SYMPTOM_LIMIT) || [];
        const extraCount = (entry.symptoms?.length || 0) - SYMPTOM_LIMIT;

        return (
          <button
            key={entry.id}
            onClick={() => onEditEntry(entry)}
            className="w-full text-left bg-white border border-gray-200 rounded-xl p-4 hover:border-pink-200 hover:shadow-sm transition-all"
          >
            <div className="flex items-start justify-between gap-2 mb-2.5">
              <p className="text-xs font-semibold text-gray-500">{displayDate}</p>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {entry.mood && (
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium border capitalize ${MOOD_COLORS[entry.mood] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                    {entry.mood}
                  </span>
                )}
                {entry.flow_intensity && entry.flow_intensity !== 'none' && (
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium border capitalize ${FLOW_COLORS[entry.flow_intensity] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                    {entry.flow_intensity.replace('_', ' ')}
                  </span>
                )}
              </div>
            </div>

            {visibleSymptoms.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {visibleSymptoms.map(s => (
                  <span
                    key={s}
                    className="px-2 py-0.5 bg-pink-50 text-pink-600 border border-pink-100 rounded-full text-xs capitalize"
                  >
                    {s}
                  </span>
                ))}
                {extraCount > 0 && (
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full text-xs">
                    +{extraCount} more
                  </span>
                )}
              </div>
            )}

            <div className="flex items-center gap-4 mt-2.5">
              {entry.sleep_quality > 0 && (
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-400">Sleep</span>
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(n => (
                      <div
                        key={n}
                        className={`w-2.5 h-2.5 rounded-sm ${n <= entry.sleep_quality ? 'bg-amber-400' : 'bg-gray-100'}`}
                      />
                    ))}
                  </div>
                </div>
              )}
              {entry.energy_level > 0 && (
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-400">Energy</span>
                  <div className="flex gap-0.5 items-center">
                    {[1,2,3,4,5].map(n => (
                      <div
                        key={n}
                        className={`rounded-full ${n <= entry.energy_level ? 'bg-teal-400' : 'bg-gray-100'}`}
                        style={{ width: `${6 + n}px`, height: `${6 + n}px` }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {entry.notes && (
              <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">{entry.notes}</p>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default JournalTab;
