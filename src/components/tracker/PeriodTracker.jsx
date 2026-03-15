import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, ChevronLeft, ChevronRight, TrendingUp, Activity, Clock, Info, Plus, Check, X, CircleAlert as AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const PeriodTracker = () => {
  const { t } = useTranslation();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [cycles, setCycles] = useState([]);
  const [currentCycle, setCurrentCycle] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectingEndDate, setSelectingEndDate] = useState(false);

  useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  const checkAuthAndLoadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);

      if (user) {
        await loadCyclesFromDatabase();
      } else {
        loadCyclesFromLocalStorage();
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      loadCyclesFromLocalStorage();
    } finally {
      setLoading(false);
    }
  };

  const loadCyclesFromDatabase = async () => {
    try {
      const { data, error } = await supabase
        .from('period_cycles')
        .select('*')
        .order('start_date', { ascending: false });

      if (error) throw error;
      setCycles(data || []);
    } catch (error) {
      console.error('Error loading cycles:', error);
    }
  };

  const loadCyclesFromLocalStorage = () => {
    const stored = localStorage.getItem('periodCycles');
    if (stored) {
      setCycles(JSON.parse(stored));
    }
  };

  const saveCyclesToLocalStorage = (updatedCycles) => {
    localStorage.setItem('periodCycles', JSON.stringify(updatedCycles));
  };

  const handleDateClick = async (date) => {
    const dateStr = date.toISOString().split('T')[0];

    if (currentCycle && !currentCycle.end_date) {
      if (selectingEndDate) {
        await setEndDate(dateStr);
      } else {
        setSelectingEndDate(true);
      }
    } else {
      await startNewCycle(dateStr);
    }
  };

  const startNewCycle = async (startDate) => {
    const previousCycle = cycles.length > 0 ? cycles[0] : null;
    let cycleLength = null;

    if (previousCycle && previousCycle.start_date) {
      const prevStart = new Date(previousCycle.start_date);
      const currStart = new Date(startDate);
      cycleLength = Math.floor((currStart - prevStart) / (1000 * 60 * 60 * 24));
    }

    const newCycle = {
      start_date: startDate,
      end_date: null,
      cycle_length: cycleLength,
      period_length: null,
      notes: '',
      created_at: new Date().toISOString()
    };

    if (isAuthenticated) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        const { data, error } = await supabase
          .from('period_cycles')
          .insert([{ ...newCycle, user_id: user.id }])
          .select()
          .single();

        if (error) throw error;

        setCurrentCycle(data);
        setCycles([data, ...cycles]);
      } catch (error) {
        console.error('Error creating cycle:', error);
      }
    } else {
      const localCycle = { ...newCycle, id: Date.now().toString() };
      setCurrentCycle(localCycle);
      const updatedCycles = [localCycle, ...cycles];
      setCycles(updatedCycles);
      saveCyclesToLocalStorage(updatedCycles);
    }

    setSelectingEndDate(true);
  };

  const setEndDate = async (endDate) => {
    if (!currentCycle) return;

    const startDate = new Date(currentCycle.start_date);
    const end = new Date(endDate);

    if (end < startDate) {
      alert('End date cannot be before start date');
      return;
    }

    const periodLength = Math.floor((end - startDate) / (1000 * 60 * 60 * 24)) + 1;

    if (isAuthenticated) {
      try {
        const { data, error } = await supabase
          .from('period_cycles')
          .update({ end_date: endDate, period_length: periodLength })
          .eq('id', currentCycle.id)
          .select()
          .single();

        if (error) throw error;

        setCycles(cycles.map(c => c.id === data.id ? data : c));
        setCurrentCycle(null);
      } catch (error) {
        console.error('Error updating cycle:', error);
      }
    } else {
      const updatedCycle = { ...currentCycle, end_date: endDate, period_length: periodLength };
      const updatedCycles = cycles.map(c => c.id === updatedCycle.id ? updatedCycle : c);
      setCycles(updatedCycles);
      saveCyclesToLocalStorage(updatedCycles);
      setCurrentCycle(null);
    }

    setSelectingEndDate(false);
  };

  const cancelCurrentCycle = async () => {
    if (!currentCycle) return;

    if (isAuthenticated) {
      try {
        await supabase
          .from('period_cycles')
          .delete()
          .eq('id', currentCycle.id);

        setCycles(cycles.filter(c => c.id !== currentCycle.id));
      } catch (error) {
        console.error('Error deleting cycle:', error);
      }
    } else {
      const updatedCycles = cycles.filter(c => c.id !== currentCycle.id);
      setCycles(updatedCycles);
      saveCyclesToLocalStorage(updatedCycles);
    }

    setCurrentCycle(null);
    setSelectingEndDate(false);
  };

  const calculateMetrics = () => {
    if (cycles.length === 0) return null;

    const completedCycles = cycles.filter(c => c.end_date && c.period_length);

    if (completedCycles.length === 0) return null;

    const avgPeriodLength = completedCycles.length > 0
      ? Math.round(completedCycles.reduce((sum, c) => sum + c.period_length, 0) / completedCycles.length)
      : null;

    const cyclesWithLength = completedCycles.filter(c => c.cycle_length);
    const avgCycleLength = cyclesWithLength.length > 0
      ? Math.round(cyclesWithLength.reduce((sum, c) => sum + c.cycle_length, 0) / cyclesWithLength.length)
      : null;

    const lastCycle = completedCycles[0];
    const secondLastCycle = completedCycles[1];

    return {
      totalCycles: completedCycles.length,
      avgPeriodLength,
      avgCycleLength,
      lastPeriodLength: lastCycle?.period_length,
      lastCycleLength: lastCycle?.cycle_length,
      secondLastCycleLength: secondLastCycle?.cycle_length,
      cycleLengthDifference: lastCycle?.cycle_length && secondLastCycle?.cycle_length
        ? lastCycle.cycle_length - secondLastCycle.cycle_length
        : null
    };
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const getDateStatus = (date) => {
    const dateStr = date.toISOString().split('T')[0];

    for (const cycle of cycles) {
      if (cycle.start_date === dateStr) {
        return 'start';
      }
      if (cycle.end_date === dateStr) {
        return 'end';
      }
      if (cycle.start_date && cycle.end_date) {
        const start = new Date(cycle.start_date);
        const end = new Date(cycle.end_date);
        if (date >= start && date <= end) {
          return 'period';
        }
      }
    }

    return null;
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentMonth(newDate);
  };

  const metrics = calculateMetrics();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {currentCycle && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-5 rounded-r-xl">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <Info size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">
                  {selectingEndDate ? 'Select End Date' : 'Period Started'}
                </h4>
                <p className="text-sm text-blue-700">
                  {selectingEndDate
                    ? `Click on the last day of your period (started ${new Date(currentCycle.start_date).toLocaleDateString()})`
                    : `Started on ${new Date(currentCycle.start_date).toLocaleDateString()}. Click a date to mark the end.`
                  }
                </p>
              </div>
            </div>
            <button
              onClick={cancelCurrentCycle}
              className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
              title="Cancel"
            >
              <X size={18} className="text-blue-600" />
            </button>
          </div>
        </div>
      )}

      <div className="p-6 bg-pink-50 rounded-2xl border border-pink-200">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-pink-700 flex items-center gap-2">
            <Calendar size={20} />
            Period Calendar
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigateMonth(-1)}
              className="p-2.5 hover:bg-pink-100 rounded-xl transition-colors"
            >
              <ChevronLeft size={20} className="text-pink-600" />
            </button>
            <span className="text-sm font-medium text-pink-700 min-w-[120px] text-center">
              {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
            <button
              onClick={() => navigateMonth(1)}
              className="p-2.5 hover:bg-pink-100 rounded-xl transition-colors"
            >
              <ChevronRight size={20} className="text-pink-600" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center text-xs font-semibold text-pink-600 p-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1.5">
          {getDaysInMonth(currentMonth).map((date, index) => {
            if (!date) {
              return <div key={`empty-${index}`} className="aspect-square" />;
            }

            const isToday = date.toDateString() === new Date().toDateString();
            const status = getDateStatus(date);

            return (
              <button
                key={date.toDateString()}
                onClick={() => handleDateClick(date)}
                className={`aspect-square rounded-xl text-sm font-medium transition-all duration-300 relative ${
                  status === 'start'
                    ? 'bg-pink-600 text-white shadow-lg ring-2 ring-pink-300'
                    : status === 'end'
                    ? 'bg-pink-500 text-white shadow-lg'
                    : status === 'period'
                    ? 'bg-pink-300 text-pink-900'
                    : isToday
                    ? 'bg-pink-100 text-pink-700 border-2 border-pink-400'
                    : 'bg-white text-gray-600 hover:bg-pink-50'
                }`}
              >
                {date.getDate()}
                {status === 'start' && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-[8px] text-white font-bold">S</span>
                  </div>
                )}
                {status === 'end' && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-[8px] text-white font-bold">E</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-5 flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-pink-600 flex items-center justify-center">
              <span className="text-[8px] text-white font-bold">S</span>
            </div>
            <span className="text-pink-700">Start Day</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-pink-300"></div>
            <span className="text-pink-700">Period Days</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-pink-500 flex items-center justify-center">
              <span className="text-[8px] text-white font-bold">E</span>
            </div>
            <span className="text-pink-700">End Day</span>
          </div>
        </div>
      </div>

      {metrics && (
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center">
                <Activity size={20} className="text-pink-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">
                {metrics.lastPeriodLength || '-'}
              </span>
            </div>
            <h4 className="font-semibold text-gray-700 text-sm mb-1">Last Period Length</h4>
            <p className="text-xs text-gray-500">
              {metrics.avgPeriodLength ? `Avg: ${metrics.avgPeriodLength} days` : 'No data yet'}
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                <Clock size={20} className="text-purple-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">
                {metrics.lastCycleLength || '-'}
              </span>
            </div>
            <h4 className="font-semibold text-gray-700 text-sm mb-1">Last Cycle Length</h4>
            <p className="text-xs text-gray-500">
              {metrics.avgCycleLength ? `Avg: ${metrics.avgCycleLength} days` : 'No data yet'}
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <TrendingUp size={20} className="text-blue-600" />
              </div>
              <span className={`text-2xl font-bold ${
                metrics.cycleLengthDifference === null
                  ? 'text-gray-400'
                  : metrics.cycleLengthDifference > 0
                  ? 'text-orange-600'
                  : metrics.cycleLengthDifference < 0
                  ? 'text-green-600'
                  : 'text-gray-900'
              }`}>
                {metrics.cycleLengthDifference !== null
                  ? `${metrics.cycleLengthDifference > 0 ? '+' : ''}${metrics.cycleLengthDifference}`
                  : '-'
                }
              </span>
            </div>
            <h4 className="font-semibold text-gray-700 text-sm mb-1">Cycle Difference</h4>
            <p className="text-xs text-gray-500">
              {metrics.secondLastCycleLength
                ? `Previous: ${metrics.secondLastCycleLength} days`
                : 'Need 2+ cycles'
              }
            </p>
          </div>
        </div>
      )}

      {cycles.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar size={20} className="text-pink-500" />
            Cycle History
          </h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {cycles.slice(0, 10).map((cycle, index) => (
              <div
                key={cycle.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                    cycle.end_date
                      ? 'bg-pink-100 text-pink-600'
                      : 'bg-blue-100 text-blue-600'
                  }`}>
                    #{cycles.length - index}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(cycle.start_date).toLocaleDateString()}
                      {cycle.end_date && ` - ${new Date(cycle.end_date).toLocaleDateString()}`}
                    </p>
                    <p className="text-xs text-gray-500">
                      {cycle.end_date
                        ? `${cycle.period_length} days`
                        : 'Ongoing'
                      }
                    </p>
                  </div>
                </div>
                {cycle.cycle_length && (
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Cycle length</p>
                    <p className="text-sm font-semibold text-gray-700">{cycle.cycle_length} days</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {!isAuthenticated && cycles.length > 0 && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-5 rounded-r-xl">
          <div className="flex items-start gap-3">
            <AlertCircle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-amber-900 mb-1">Limited Storage</h4>
              <p className="text-sm text-amber-700">
                Your data is stored locally. Sign in to save your period history across devices and never lose your data.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PeriodTracker;
