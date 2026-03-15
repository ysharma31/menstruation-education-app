import { TrendingUp, BookOpen, MessageCircle, Circle as HelpCircle, User, Users } from 'lucide-react';

const SECTIONS = [
  { key: 'girls', label: 'Girls Section', icon: User, color: 'bg-pink-100 text-pink-600' },
  { key: 'boys', label: 'Boys Section', icon: Users, color: 'bg-blue-100 text-blue-600' },
  { key: 'faq', label: 'FAQ', icon: HelpCircle, color: 'bg-amber-100 text-amber-600' },
  { key: 'chat', label: 'AI Chat', icon: MessageCircle, color: 'bg-green-100 text-green-600' },
  { key: 'parents', label: 'Parents Guide', icon: BookOpen, color: 'bg-orange-100 text-orange-600' }
];

const FAQ_CATEGORIES = ['General', 'Health', 'Products', 'Emotions', 'Other'];

const BarChart = ({ data, max }) => (
  <div className="flex items-end gap-1 h-20">
    {data.map((item, i) => {
      const pct = max > 0 ? Math.round((item.value / max) * 100) : 0;
      return (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div className="w-full bg-green-100 rounded-t-sm relative" style={{ height: '64px' }}>
            <div
              className="absolute bottom-0 left-0 right-0 bg-green-500 rounded-t-sm transition-all duration-700"
              style={{ height: `${pct}%` }}
            />
          </div>
          <span className="text-xs text-gray-500 truncate max-w-full">{item.label}</span>
        </div>
      );
    })}
  </div>
);

const MOCK_WEEKLY = [
  { label: 'Mon', value: 12 },
  { label: 'Tue', value: 19 },
  { label: 'Wed', value: 15 },
  { label: 'Thu', value: 22 },
  { label: 'Fri', value: 18 },
  { label: 'Sat', value: 8 },
  { label: 'Sun', value: 5 }
];

const StatsPanel = () => {
  const weeklyMax = Math.max(...MOCK_WEEKLY.map((d) => d.value));

  const faqData = FAQ_CATEGORIES.map((c, i) => ({
    label: c,
    value: [22, 18, 14, 10, 6][i]
  }));
  const faqMax = Math.max(...faqData.map((d) => d.value));

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl border border-green-100 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-green-100 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Class Overview</h3>
            <p className="text-xs text-gray-500">All data is anonymous and aggregated</p>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-gray-700 mb-3">Weekly Engagement</p>
          <BarChart data={MOCK_WEEKLY} max={weeklyMax} />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-green-100 shadow-sm p-6">
        <h3 className="font-bold text-gray-900 mb-1">Most Visited Sections</h3>
        <p className="text-xs text-gray-500 mb-4">Aggregate visits this week</p>
        <div className="space-y-3">
          {SECTIONS.map((s, i) => {
            const visits = [45, 38, 29, 22, 15][i];
            const pct = Math.round((visits / 45) * 100);
            const Icon = s.icon;
            return (
              <div key={s.key} className="flex items-center gap-3">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${s.color}`}>
                  <Icon size={13} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-700 font-medium">{s.label}</span>
                    <span className="text-gray-500">{visits} visits</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-green-100 shadow-sm p-6">
        <h3 className="font-bold text-gray-900 mb-1">FAQ Categories Browsed</h3>
        <p className="text-xs text-gray-500 mb-5">Aggregate question category interest</p>
        <BarChart data={faqData} max={faqMax} />
      </div>
    </div>
  );
};

export default StatsPanel;
