import { useState } from 'react';
import { X, Star } from 'lucide-react';

const FLOW_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'light', label: 'Light' },
  { value: 'medium', label: 'Medium' },
  { value: 'heavy', label: 'Heavy' },
  { value: 'very_heavy', label: 'Very Heavy' },
];

const MOOD_OPTIONS = [
  { value: 'great', label: 'Great' },
  { value: 'good', label: 'Good' },
  { value: 'okay', label: 'Okay' },
  { value: 'low', label: 'Low' },
  { value: 'rough', label: 'Rough' },
];

const SYMPTOM_OPTIONS = [
  'cramps', 'bloating', 'headache', 'backache',
  'breast tenderness', 'fatigue', 'nausea',
  'mood swings', 'food cravings', 'acne',
];

const FLOW_COLORS = {
  none: 'bg-gray-100 text-gray-600 border-gray-200',
  light: 'bg-pink-50 text-pink-600 border-pink-200',
  medium: 'bg-pink-100 text-pink-700 border-pink-300',
  heavy: 'bg-pink-200 text-pink-800 border-pink-400',
  very_heavy: 'bg-pink-300 text-pink-900 border-pink-500',
};

const MOOD_COLORS = {
  great: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  good: 'bg-teal-50 text-teal-700 border-teal-200',
  okay: 'bg-amber-50 text-amber-700 border-amber-200',
  low: 'bg-orange-50 text-orange-700 border-orange-200',
  rough: 'bg-red-50 text-red-700 border-red-200',
};

const JournalEntryModal = ({ date, existingEntry, onSave, onClose, saving }) => {
  const [flow, setFlow] = useState(existingEntry?.flow_intensity || '');
  const [mood, setMood] = useState(existingEntry?.mood || '');
  const [symptoms, setSymptoms] = useState(existingEntry?.symptoms || []);
  const [sleep, setSleep] = useState(existingEntry?.sleep_quality || 0);
  const [energy, setEnergy] = useState(existingEntry?.energy_level || 0);
  const [notes, setNotes] = useState(existingEntry?.notes || '');
  const [hoveredStar, setHoveredStar] = useState(0);
  const [hoveredDot, setHoveredDot] = useState(0);

  const displayDate = new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric'
  });

  const toggleSymptom = (s) => {
    setSymptoms(prev =>
      prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
    );
  };

  const handleSave = () => {
    onSave({
      entry_date: date,
      flow_intensity: flow || null,
      mood: mood || null,
      symptoms,
      sleep_quality: sleep || null,
      energy_level: energy || null,
      notes: notes.trim() || null,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[92vh]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">Journal Entry</h3>
            <p className="text-xs text-gray-400 mt-0.5">{displayDate}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-5">
          <div>
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Flow</p>
            <div className="flex flex-wrap gap-2">
              {FLOW_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setFlow(flow === opt.value ? '' : opt.value)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    flow === opt.value
                      ? FLOW_COLORS[opt.value] + ' ring-2 ring-offset-1 ring-pink-300'
                      : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Mood</p>
            <div className="flex flex-wrap gap-2">
              {MOOD_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setMood(mood === opt.value ? '' : opt.value)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    mood === opt.value
                      ? MOOD_COLORS[opt.value] + ' ring-2 ring-offset-1 ring-pink-300'
                      : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Symptoms</p>
            <div className="flex flex-wrap gap-2">
              {SYMPTOM_OPTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => toggleSymptom(s)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all capitalize ${
                    symptoms.includes(s)
                      ? 'bg-pink-100 text-pink-700 border-pink-300 ring-2 ring-offset-1 ring-pink-200'
                      : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Sleep Quality</p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(n => (
                  <button
                    key={n}
                    onClick={() => setSleep(sleep === n ? 0 : n)}
                    onMouseEnter={() => setHoveredStar(n)}
                    onMouseLeave={() => setHoveredStar(0)}
                    className="p-0.5 transition-transform hover:scale-110"
                  >
                    <Star
                      size={22}
                      className={`transition-colors ${
                        n <= (hoveredStar || sleep)
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-gray-200 fill-gray-200'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Energy Level</p>
              <div className="flex gap-1.5 items-center">
                {[1, 2, 3, 4, 5].map(n => (
                  <button
                    key={n}
                    onClick={() => setEnergy(energy === n ? 0 : n)}
                    onMouseEnter={() => setHoveredDot(n)}
                    onMouseLeave={() => setHoveredDot(0)}
                    className="transition-transform hover:scale-110"
                  >
                    <div className={`rounded-full transition-colors ${
                      n <= (hoveredDot || energy)
                        ? 'bg-teal-500'
                        : 'bg-gray-200'
                    }`} style={{ width: `${14 + n * 2}px`, height: `${14 + n * 2}px` }} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Notes</p>
              <span className="text-xs text-gray-400">{notes.length}/300</span>
            </div>
            <textarea
              value={notes}
              onChange={e => e.target.value.length <= 300 && setNotes(e.target.value)}
              placeholder="How are you feeling today? (optional)"
              rows={3}
              className="w-full text-sm text-gray-700 placeholder-gray-300 border border-gray-200 rounded-xl px-3 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-300 transition-colors"
            />
          </div>
        </div>

        <div className="px-5 py-4 border-t border-gray-100 flex gap-3 flex-shrink-0">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-2.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white text-sm font-semibold transition-colors disabled:opacity-60"
          >
            {saving ? 'Saving...' : existingEntry ? 'Update' : 'Save Entry'}
          </button>
        </div>
      </div>
    </div>
  );
};

export { FLOW_COLORS, MOOD_COLORS, FLOW_OPTIONS, MOOD_OPTIONS };
export default JournalEntryModal;
