import { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, TrendingUp, Activity, Clock, Info, X, LogIn, Pill, ChartBar as BarChart2, History, BookOpen, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import MedicationTracker from './MedicationTracker';
import CycleAnalysis from './CycleAnalysis';
import JournalEntryModal from './JournalEntryModal';
import JournalTab from './JournalTab';

const PeriodTracker = () => {
  const { user } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [cycles, setCycles] = useState([]);
  const [currentCycle, setCurrentCycle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectingEndDate, setSelectingEndDate] = useState(false);
  const [activeTab, setActiveTab] = useState('calendar');

  const [journalEntries, setJournalEntries] = useState([]);
  const [journalModal, setJournalModal] = useState(null);
  const [journalSaving, setJournalSaving] = useState(false);

  const TABS = [
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'history', label: 'History', icon: History },
    { id: 'medications', label: 'Medications', icon: Pill },
    { id: 'analysis', label: 'Analysis', icon: BarChart2 },
    ...(user ? [{ id: 'journal', label: 'Journal', icon: BookOpen }] : []),
  ];

  useEffect(() => {
    if (user) {
      loadCyclesFromDatabase();
      loadJournalEntries();
    } else {
      loadCyclesFromLocalStorage();
      setLoading(false);
    }
  }, [user]);

  const loadCyclesFromDatabase = async () => {
    try {
      const { data, error } = await supabase
        .from('period_cycles')
        .select('*')
        .order('start_date', { ascending: false });

      if (error) throw error;

      setCycles(data || []);

      const ongoing = (data || []).find(c => !c.end_date);
      if (ongoing) {
        setCurrentCycle(ongoing);
        setSelectingEndDate(true);
      }
    } catch (error) {
      console.error('Error loading cycles:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadJournalEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('cycle_journal')
        .select('*')
        .order('entry_date', { ascending: false });

      if (error) throw error;
      setJournalEntries(data || []);
    } catch (error) {
      console.error('Error loading journal entries:', error);
    }
  };

  const loadCyclesFromLocalStorage = () => {
    const stored = localStorage.getItem('periodCycles');
    if (stored) {
      const parsed = JSON.parse(stored);
      setCycles(parsed);
      const ongoing = parsed.find(c => !c.end_date);
      if (ongoing) {
        setCurrentCycle(ongoing);
        setSelectingEndDate(true);
      }
    }
  };

  const saveCyclesToLocalStorage = (updatedCycles) => {
    localStorage.setItem('periodCycles', JSON.stringify(updatedCycles));
  };

  const handleDateClick = async (date) => {
    const dateStr = date.toISOString().split('T')[0];

    if (user) {
      const existing = journalEntries.find(e => e.entry_date === dateStr);
      setJournalModal({ date: dateStr, existing: existing || null });
      return;
    }

    if (currentCycle && !currentCycle.end_date) {
      if (selectingEndDate) {
        await handleSetEndDate(dateStr);
      }
    } else if (!currentCycle) {
      await handleStartNewCycle(dateStr);
    }
  };

  const getMonthCycle = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return cycles.find(c => {
      const start = new Date(c.start_date);
      return start.getFullYear() === year && start.getMonth() === month;
    });
  };

  const handleCalendarDateClick = async (date) => {
    const dateStr = date.toISOString().split('T')[0];

    if (currentCycle && !currentCycle.end_date) {
      if (selectingEndDate) {
        await handleSetEndDate(dateStr);
        return;
      }
    } else if (!currentCycle) {
      const existingMonthCycle = getMonthCycle(date);
      if (!existingMonthCycle) {
        await handleStartNewCycle(dateStr);
        return;
      }
    }

    if (user) {
      const existing = journalEntries.find(e => e.entry_date === dateStr);
      setJournalModal({ date: dateStr, existing: existing || null });
    }
  };

  const handleSaveJournalEntry = async (entryData) => {
    if (!user) return;
    setJournalSaving(true);

    try {
      const existing = journalEntries.find(e => e.entry_date === entryData.entry_date);

      if (existing) {
        const { data, error } = await supabase
          .from('cycle_journal')
          .update(entryData)
          .eq('id', existing.id)
          .select()
          .single();

        if (error) throw error;
        setJournalEntries(prev => prev.map(e => e.id === data.id ? data : e));
      } else {
        const { data, error } = await supabase
          .from('cycle_journal')
          .insert([{ ...entryData, user_id: user.id }])
          .select()
          .single();

        if (error) throw error;
        setJournalEntries(prev => [data, ...prev].sort((a, b) => b.entry_date.localeCompare(a.entry_date)));
      }

      setJournalModal(null);
    } catch (error) {
      console.error('Error saving journal entry:', error);
    } finally {
      setJournalSaving(false);
    }
  };

  const handleStartNewCycle = async (startDate) => {
    const completedCycles = cycles.filter(c => c.end_date);
    const previousCycle = completedCycles.length > 0 ? completedCycles[0] : null;
    let cycleLength = null;

    if (previousCycle?.start_date) {
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

    if (user) {
      try {
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
        return;
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

  const handleSetEndDate = async (endDate) => {
    if (!currentCycle) return;

    const startDate = new Date(currentCycle.start_date);
    const end = new Date(endDate);

    if (end < startDate) return;

    const maxEnd = new Date(startDate);
    maxEnd.setDate(maxEnd.getDate() + 6);
    const clampedEnd = end > maxEnd ? maxEnd : end;
    const clampedEndStr = clampedEnd.toISOString().split('T')[0];

    const periodLength = Math.floor((clampedEnd - startDate) / (1000 * 60 * 60 * 24)) + 1;

    if (user) {
      try {
        const { data, error } = await supabase
          .from('period_cycles')
          .update({ end_date: clampedEndStr, period_length: periodLength })
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
      const updatedCycle = { ...currentCycle, end_date: clampedEndStr, period_length: periodLength };
      const updatedCycles = cycles.map(c => c.id === updatedCycle.id ? updatedCycle : c);
      setCycles(updatedCycles);
      saveCyclesToLocalStorage(updatedCycles);
      setCurrentCycle(null);
    }

    setSelectingEndDate(false);
  };

  const cancelCurrentCycle = async () => {
    if (!currentCycle) return;

    if (user) {
      try {
        await supabase.from('period_cycles').delete().eq('id', currentCycle.id);
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

  const clearMonthCycle = async () => {
    const cycle = getMonthCycle(currentMonth);
    if (!cycle) return;

    if (currentCycle?.id === cycle.id) {
      await cancelCurrentCycle();
      return;
    }

    if (user) {
      try {
        await supabase.from('period_cycles').delete().eq('id', cycle.id);
        setCycles(prev => prev.filter(c => c.id !== cycle.id));
      } catch (error) {
        console.error('Error clearing cycle:', error);
      }
    } else {
      const updatedCycles = cycles.filter(c => c.id !== cycle.id);
      setCycles(updatedCycles);
      saveCyclesToLocalStorage(updatedCycles);
    }
  };

  const calculateMetrics = () => {
    const completedCycles = cycles.filter(c => c.end_date && c.period_length);
    if (completedCycles.length === 0) return null;

    const avgPeriodLength = Math.round(
      completedCycles.reduce((sum, c) => sum + c.period_length, 0) / completedCycles.length
    );

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
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) days.push(null);
    for (let i = 1; i <= lastDay.getDate(); i++) days.push(new Date(year, month, i));
    return days;
  };

  const getDateStatus = (date) => {
    const dateStr = date.toISOString().split('T')[0];

    for (const cycle of cycles) {
      if (cycle.start_date === dateStr) return 'start';
      if (cycle.end_date === dateStr) return 'end';
      if (cycle.start_date && cycle.end_date) {
        const start = new Date(cycle.start_date);
        const end = new Date(cycle.end_date);
        if (date > start && date < end) return 'period';
      }
    }
    return null;
  };

  const hasJournalEntry = (date) => {
    if (!user) return false;
    const dateStr = date.toISOString().split('T')[0];
    return journalEntries.some(e => e.entry_date === dateStr);
  };

  const metrics = calculateMetrics();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl overflow-x-auto">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all flex-1 justify-center ${
                activeTab === tab.id
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === 'calendar' && (
        <div className="space-y-5">
          {currentCycle && (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-xl">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <Info size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-blue-900">
                      {selectingEndDate ? 'Now select the last day of your period' : 'Period started'}
                    </p>
                    <p className="text-xs text-blue-700 mt-0.5">
                      Started {new Date(currentCycle.start_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}.
                      {selectingEndDate ? ' Click the date your period ended.' : ''}
                    </p>
                  </div>
                </div>
                <button
                  onClick={cancelCurrentCycle}
                  className="p-1.5 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  <X size={16} className="text-blue-600" />
                </button>
              </div>
            </div>
          )}

          {!currentCycle && (
            <div className="bg-pink-50 border border-pink-200 rounded-xl p-4">
              <p className="text-sm text-pink-700">
                <span className="font-semibold">How to record:</span> Click the first day of your period to mark the start, then click the last day to mark the end.
                {user && <span> You can also click any day to add a journal entry.</span>}
              </p>
            </div>
          )}

          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <button
                onClick={() => {
                  const d = new Date(currentMonth);
                  d.setMonth(d.getMonth() - 1);
                  setCurrentMonth(d);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft size={18} className="text-gray-600" />
              </button>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-800 text-sm">
                  {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>
                {getMonthCycle(currentMonth) && !currentCycle && (
                  <button
                    onClick={clearMonthCycle}
                    title="Clear this month's period"
                    className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={14} className="text-red-400 hover:text-red-600" />
                  </button>
                )}
              </div>
              <button
                onClick={() => {
                  const d = new Date(currentMonth);
                  d.setMonth(d.getMonth() + 1);
                  setCurrentMonth(d);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight size={18} className="text-gray-600" />
              </button>
            </div>

            <div className="p-3">
              <div className="grid grid-cols-7 mb-1">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                  <div key={i} className="text-center text-xs font-semibold text-gray-400 py-2">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {getDaysInMonth(currentMonth).map((date, index) => {
                  if (!date) return <div key={`empty-${index}`} className="aspect-square" />;

                  const isToday = date.toDateString() === new Date().toDateString();
                  const status = getDateStatus(date);
                  const hasEntry = hasJournalEntry(date);
                  const isClickable = !currentCycle || selectingEndDate;

                  return (
                    <button
                      key={date.toDateString()}
                      onClick={() => handleCalendarDateClick(date)}
                      className={`aspect-square rounded-xl text-sm font-medium transition-all duration-200 relative
                        ${status === 'start' ? 'bg-pink-600 text-white shadow-md ring-2 ring-pink-300' : ''}
                        ${status === 'end' ? 'bg-rose-500 text-white shadow-md' : ''}
                        ${status === 'period' ? 'bg-pink-200 text-pink-900' : ''}
                        ${!status && isToday ? 'bg-pink-100 text-pink-700 border-2 border-pink-400' : ''}
                        ${!status && !isToday ? 'bg-gray-50 text-gray-700 hover:bg-pink-50 hover:text-pink-700' : ''}
                      `}
                    >
                      {date.getDate()}
                      {status === 'start' && (
                        <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-[6px] text-white font-bold leading-none">S</span>
                        </div>
                      )}
                      {status === 'end' && (
                        <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full flex items-center justify-center">
                          <span className="text-[6px] text-white font-bold leading-none">E</span>
                        </div>
                      )}
                      {hasEntry && !status && (
                        <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-pink-400 rounded-full" />
                      )}
                      {hasEntry && status && (
                        <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white/80 rounded-full" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="px-4 pb-4 flex flex-wrap items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded bg-pink-600" />
                <span className="text-gray-500">Start</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded bg-pink-200" />
                <span className="text-gray-500">Period days</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded bg-rose-500" />
                <span className="text-gray-500">End</span>
              </div>
              {user && (
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-pink-400" />
                  <span className="text-gray-500">Journal entry</span>
                </div>
              )}
            </div>
          </div>

          {metrics && (
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <Activity size={16} className="text-pink-500" />
                  <span className="text-xl font-bold text-gray-900">{metrics.lastPeriodLength ?? '-'}</span>
                </div>
                <p className="text-xs font-medium text-gray-600">Last Period</p>
                <p className="text-xs text-gray-400">Avg: {metrics.avgPeriodLength ?? '-'} days</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <Clock size={16} className="text-blue-500" />
                  <span className="text-xl font-bold text-gray-900">{metrics.lastCycleLength ?? '-'}</span>
                </div>
                <p className="text-xs font-medium text-gray-600">Last Cycle</p>
                <p className="text-xs text-gray-400">Avg: {metrics.avgCycleLength ?? '-'} days</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <TrendingUp size={16} className="text-teal-500" />
                  <span className={`text-xl font-bold ${
                    metrics.cycleLengthDifference === null ? 'text-gray-300'
                    : metrics.cycleLengthDifference > 0 ? 'text-orange-600'
                    : metrics.cycleLengthDifference < 0 ? 'text-green-600'
                    : 'text-gray-800'
                  }`}>
                    {metrics.cycleLengthDifference !== null
                      ? `${metrics.cycleLengthDifference > 0 ? '+' : ''}${metrics.cycleLengthDifference}`
                      : '-'
                    }
                  </span>
                </div>
                <p className="text-xs font-medium text-gray-600">Cycle Shift</p>
                <p className="text-xs text-gray-400">
                  {metrics.secondLastCycleLength ? `Prev: ${metrics.secondLastCycleLength}d` : '2+ cycles needed'}
                </p>
              </div>
            </div>
          )}

          {!user && cycles.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <Info size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-700">
                  Your data is saved locally. Sign in to keep your history safe across devices.
                </p>
              </div>
              <Link
                to="/auth"
                className="flex items-center gap-1.5 px-3 py-2 bg-pink-500 hover:bg-pink-600 text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap"
              >
                <LogIn size={13} />
                Sign In
              </Link>
            </div>
          )}

          {!user && cycles.length === 0 && (
            <div className="bg-gray-50 border border-dashed border-gray-200 rounded-xl p-5 text-center">
              <p className="text-sm text-gray-500 mb-3">Sign in to save your data and unlock medication tracking and cycle analysis.</p>
              <Link
                to="/auth"
                className="inline-flex items-center gap-2 px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <LogIn size={15} />
                Sign In or Create Account
              </Link>
            </div>
          )}
        </div>
      )}

      {activeTab === 'history' && (
        <div className="space-y-4">
          {cycles.length === 0 ? (
            <div className="bg-gray-50 border border-dashed border-gray-200 rounded-xl p-8 text-center">
              <Calendar size={28} className="text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">No cycles recorded yet. Use the Calendar tab to start tracking.</p>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                {cycles.map((cycle, index) => (
                  <div
                    key={cycle.id}
                    className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                        cycle.end_date ? 'bg-pink-100 text-pink-600' : 'bg-blue-100 text-blue-600'
                      }`}>
                        #{cycles.length - index}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {new Date(cycle.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          {cycle.end_date && (
                            <span className="text-gray-400"> – {new Date(cycle.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                          )}
                        </p>
                        <p className="text-xs text-gray-500">
                          {cycle.end_date ? `${cycle.period_length} day period` : 'In progress'}
                          {cycle.cycle_length ? ` · ${cycle.cycle_length}d since last cycle` : ''}
                        </p>
                      </div>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${cycle.end_date ? 'bg-green-400' : 'bg-blue-400 animate-pulse'}`} />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {activeTab === 'medications' && <MedicationTracker />}

      {activeTab === 'analysis' && <CycleAnalysis cycles={cycles} journalEntries={journalEntries} />}

      {activeTab === 'journal' && user && (
        <JournalTab
          entries={journalEntries}
          onEditEntry={(entry) => setJournalModal({ date: entry.entry_date, existing: entry })}
        />
      )}

      {activeTab === 'journal' && !user && (
        <div className="bg-gray-50 border border-dashed border-gray-200 rounded-xl p-6 text-center">
          <BookOpen size={28} className="text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-600 font-medium mb-1">Sign in to start your personal journal</p>
          <p className="text-xs text-gray-400 mb-4">Track your mood, symptoms, and notes every day.</p>
          <Link
            to="/auth"
            className="inline-flex items-center gap-2 px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <LogIn size={15} />
            Sign In or Create Account
          </Link>
        </div>
      )}

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
        <div className="flex items-start gap-2.5">
          <Info size={14} className="text-gray-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-gray-500 leading-relaxed">
            <span className="font-semibold text-gray-600">Personal Learning Tool Only.</span> This tracker is for personal observation and pattern awareness. It is not a medical tool and does not provide medical advice or diagnoses. Always consult a qualified doctor or gynaecologist for any health concerns, irregular cycles, or questions about medications.
          </p>
        </div>
      </div>

      {journalModal && (
        <JournalEntryModal
          date={journalModal.date}
          existingEntry={journalModal.existing}
          onSave={handleSaveJournalEntry}
          onClose={() => setJournalModal(null)}
          saving={journalSaving}
        />
      )}
    </div>
  );
};

export default PeriodTracker;
