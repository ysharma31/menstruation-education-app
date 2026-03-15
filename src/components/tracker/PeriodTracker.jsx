import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, ChevronLeft, ChevronRight, TrendingUp, Activity, Clock, Info, X, LogIn, Pill, ChartBar as BarChart2, History, BookOpen, Trash2, TriangleAlert as AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import MedicationTracker from './MedicationTracker';
import CycleAnalysis from './CycleAnalysis';
import JournalEntryModal from './JournalEntryModal';
import JournalTab from './JournalTab';

const addDays = (date, days) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

const toDateStr = (date) => date.toISOString().split('T')[0];

const stdDev = (values) => {
  if (values.length < 2) return 0;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
  return Math.sqrt(variance);
};

const median = (values) => {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
};

const hasIrregularHistory = (cycles) => {
  const sorted = [...cycles]
    .filter(c => c.end_date && c.start_date)
    .sort((a, b) => new Date(b.start_date) - new Date(a.start_date));

  let hasShortCycle = false;
  for (let i = 0; i < sorted.length - 1; i++) {
    const curr = new Date(sorted[i].start_date);
    const prev = new Date(sorted[i + 1].start_date);
    const diff = Math.floor((curr - prev) / (1000 * 60 * 60 * 24));
    if (diff > 0 && diff < 21) { hasShortCycle = true; break; }
  }
  if (!hasShortCycle) {
    hasShortCycle = sorted.some(c => c.cycle_length && c.cycle_length < 21);
  }

  const monthGroups = {};
  cycles.forEach(c => {
    const key = c.start_date.slice(0, 7);
    monthGroups[key] = (monthGroups[key] || 0) + 1;
  });
  const hasMultiInMonth = Object.values(monthGroups).some(v => v >= 2);
  return hasShortCycle || hasMultiInMonth;
};

const calculatePredictions = (cycles) => {
  const completed = cycles
    .filter(c => c.end_date && c.period_length && c.start_date)
    .sort((a, b) => new Date(b.start_date) - new Date(a.start_date));

  if (completed.length === 0) return null;

  const recent = completed.slice(0, 6);
  const avgPeriodLength = Math.round(
    recent.reduce((sum, c) => sum + c.period_length, 0) / recent.length
  );

  const derivedCycleLengths = [];
  for (let i = 0; i < recent.length - 1; i++) {
    const curr = new Date(recent[i].start_date);
    const prev = new Date(recent[i + 1].start_date);
    const diff = Math.floor((curr - prev) / (1000 * 60 * 60 * 24));
    if (diff > 0) derivedCycleLengths.push(diff);
  }

  const withCycleLen = recent.filter(c => c.cycle_length && c.cycle_length > 0);
  const cycleLengths = derivedCycleLengths.length > 0 ? derivedCycleLengths : withCycleLen.map(c => c.cycle_length);
  if (cycleLengths.length === 0) return null;
  const sd = stdDev(cycleLengths);
  const isVariable = sd > 5;
  const centralCycleLength = isVariable ? Math.round(median(cycleLengths)) : Math.round(cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length);
  const irregular = hasIrregularHistory(cycles);
  const uncertaintyDays = irregular ? 7 : 3;

  const lastStart = new Date(completed[0].start_date);
  const nextPeriodStart = addDays(lastStart, centralCycleLength);
  const nextPeriodEnd = addDays(nextPeriodStart, avgPeriodLength - 1);
  const ovulationDay = addDays(nextPeriodStart, -14);
  const fertileStart = addDays(ovulationDay, -5);
  const fertileEnd = addDays(ovulationDay, 1);

  return {
    nextPeriodStart,
    nextPeriodEnd,
    ovulationDay,
    fertileStart,
    fertileEnd,
    avgCycleLength: centralCycleLength,
    avgPeriodLength,
    basedOnCycles: withCycleLen.length,
    isVariable,
    irregular,
    uncertaintyDays,
    showOvulation: !irregular,
  };
};

const getPredictionDateStatus = (date, predictions) => {
  if (!predictions) return null;
  const { nextPeriodStart, nextPeriodEnd, ovulationDay, fertileStart, fertileEnd, showOvulation } = predictions;
  const d = toDateStr(date);
  if (d === toDateStr(nextPeriodStart)) return 'pred-start';
  if (d === toDateStr(nextPeriodEnd)) return 'pred-end';
  if (date >= nextPeriodStart && date <= nextPeriodEnd) return 'pred-period';
  if (showOvulation && d === toDateStr(ovulationDay)) return 'ovulation';
  if (showOvulation && date >= fertileStart && date <= fertileEnd) return 'fertile';
  return null;
};

const getDateStatus = (date, cycles) => {
  const dateStr = toDateStr(date);
  let result = null;

  for (const cycle of cycles) {
    if (cycle.start_date === dateStr) return 'start';
    if (cycle.end_date === dateStr) { result = 'end'; continue; }
    if (cycle.start_date && cycle.end_date) {
      const start = new Date(cycle.start_date);
      const end = new Date(cycle.end_date);
      if (date > start && date < end && result !== 'end') result = 'period';
    }
  }
  return result;
};

const PeriodTracker = () => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === 'hi' ? 'hi-IN' : 'en-US';
  const { user, isAppUser } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [cycles, setCycles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('calendar');

  const [awaitingEndFor, setAwaitingEndFor] = useState(null);

  const [conflictDialog, setConflictDialog] = useState(null);

  const [journalEntries, setJournalEntries] = useState([]);
  const [journalModal, setJournalModal] = useState(null);
  const [journalSaving, setJournalSaving] = useState(false);

  const TABS = [
    { id: 'calendar', label: t('tracker.tabCalendar'), icon: Calendar },
    { id: 'history', label: t('tracker.tabHistory'), icon: History },
    { id: 'medications', label: t('tracker.tabMedications'), icon: Pill },
    { id: 'analysis', label: t('tracker.tabAnalysis'), icon: BarChart2 },
    { id: 'journal', label: t('tracker.tabJournal'), icon: BookOpen },
  ];

  useEffect(() => {
    if (isAppUser) {
      loadCyclesFromDatabase();
      loadJournalEntries();
    } else {
      setLoading(false);
    }
  }, [isAppUser]);

  const loadCyclesFromDatabase = async () => {
    try {
      const { data, error } = await supabase
        .from('period_cycles')
        .select('*')
        .order('start_date', { ascending: false });

      if (error) throw error;
      setCycles(data || []);

      const ongoing = (data || []).find(c => !c.end_date);
      if (ongoing) setAwaitingEndFor(ongoing);
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

  const findCycleContainingDate = (dateStr) => {
    return cycles.find(c => {
      if (!c.end_date) return false;
      return dateStr > c.start_date && dateStr < c.end_date;
    });
  };

  const handleCalendarDateClick = async (date) => {
    const dateStr = toDateStr(date);

    if (awaitingEndFor) {
      if (dateStr === awaitingEndFor.start_date) {
        await handleSetEndDate(dateStr, awaitingEndFor);
        return;
      }
      if (dateStr < awaitingEndFor.start_date) {
        setConflictDialog({
          type: 'new_start_before_ongoing',
          message: t('tracker.conflictBeforeOngoing', { date: new Date(awaitingEndFor.start_date).toLocaleDateString(locale, { month: 'long', day: 'numeric' }) }),
          dismiss: () => setConflictDialog(null),
        });
        return;
      }
      if (dateStr > awaitingEndFor.start_date) {
        await handleSetEndDate(dateStr, awaitingEndFor);
        return;
      }
      return;
    }

    const exactMatch = cycles.find(c => c.start_date === dateStr);
    if (exactMatch) {
      if (isAppUser) {
        const existing = journalEntries.find(e => e.entry_date === dateStr);
        setJournalModal({ date: dateStr, existing: existing || null });
      }
      return;
    }

    const containingCycle = findCycleContainingDate(dateStr);
    if (containingCycle) {
      setConflictDialog({
        type: 'inside_existing',
        message: t('tracker.conflictInsideExisting', { date: new Date(containingCycle.start_date).toLocaleDateString(locale, { month: 'long', day: 'numeric' }) }),
        onYes: async () => {
          setConflictDialog(null);
          await handleSetEndDate(dateStr, containingCycle);
        },
        onNo: () => setConflictDialog(null),
      });
      return;
    }

    const ongoingCycle = cycles.find(c => !c.end_date);
    if (ongoingCycle) {
      setConflictDialog({
        type: 'ongoing_exists',
        message: t('tracker.conflictOngoingExists', { date: new Date(ongoingCycle.start_date).toLocaleDateString(locale, { month: 'long', day: 'numeric' }) }),
        onEndExisting: async () => {
          setConflictDialog(null);
          await handleSetEndDate(dateStr, ongoingCycle);
        },
        onStartNew: async () => {
          setConflictDialog(null);
          await handleStartNewCycle(dateStr);
        },
        onCancel: () => setConflictDialog(null),
      });
      return;
    }

    await handleStartNewCycle(dateStr);

    if (isAppUser) {
      const existing = journalEntries.find(e => e.entry_date === dateStr);
      if (!awaitingEndFor) {
        setJournalModal({ date: dateStr, existing: existing || null });
      }
    }
  };

  const handleSaveJournalEntry = async (entryData) => {
    if (!isAppUser) return;
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
    const sortedCompleted = cycles
      .filter(c => c.end_date && c.start_date < startDate)
      .sort((a, b) => new Date(b.start_date) - new Date(a.start_date));

    const previousCycle = sortedCompleted.length > 0 ? sortedCompleted[0] : null;
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

    if (isAppUser) {
      try {
        const { data, error } = await supabase
          .from('period_cycles')
          .insert([{ ...newCycle, user_id: user.id }])
          .select()
          .single();

        if (error) throw error;
        setCycles(prev => [data, ...prev].sort((a, b) => new Date(b.start_date) - new Date(a.start_date)));
        setAwaitingEndFor(data);
      } catch (error) {
        console.error('Error creating cycle:', error);
        return;
      }
    } else {
      const localCycle = { ...newCycle, id: Date.now().toString() };
      setCycles(prev => [localCycle, ...prev].sort((a, b) => new Date(b.start_date) - new Date(a.start_date)));
      setAwaitingEndFor(localCycle);
    }
  };

  const handleSetEndDate = async (endDate, targetCycle) => {
    if (!targetCycle) return;

    const startDate = new Date(targetCycle.start_date);
    const end = new Date(endDate);

    if (end < startDate) return;

    const maxEnd = new Date(startDate);
    maxEnd.setDate(maxEnd.getDate() + 13);
    const clampedEnd = end > maxEnd ? maxEnd : end;
    const clampedEndStr = toDateStr(clampedEnd);

    const periodLength = Math.max(1, Math.floor((clampedEnd - startDate) / (1000 * 60 * 60 * 24)) + 1);

    if (isAppUser) {
      try {
        const { data, error } = await supabase
          .from('period_cycles')
          .update({ end_date: clampedEndStr, period_length: periodLength })
          .eq('id', targetCycle.id)
          .select()
          .single();

        if (error) throw error;
        setCycles(prev => prev.map(c => c.id === data.id ? data : c));
        if (awaitingEndFor?.id === targetCycle.id) setAwaitingEndFor(null);
      } catch (error) {
        console.error('Error updating cycle:', error);
      }
    } else {
      const updatedCycle = { ...targetCycle, end_date: clampedEndStr, period_length: periodLength };
      setCycles(prev => prev.map(c => c.id === updatedCycle.id ? updatedCycle : c));
      if (awaitingEndFor?.id === targetCycle.id) setAwaitingEndFor(null);
    }
  };

  const cancelOngoingCycle = async () => {
    if (!awaitingEndFor) return;

    if (isAppUser) {
      try {
        await supabase.from('period_cycles').delete().eq('id', awaitingEndFor.id);
        setCycles(prev => prev.filter(c => c.id !== awaitingEndFor.id));
      } catch (error) {
        console.error('Error deleting cycle:', error);
      }
    } else {
      setCycles(prev => prev.filter(c => c.id !== awaitingEndFor.id));
    }

    setAwaitingEndFor(null);
  };

  const clearCycle = async (cycle) => {
    if (awaitingEndFor?.id === cycle.id) {
      await cancelOngoingCycle();
      return;
    }

    if (isAppUser) {
      try {
        await supabase.from('period_cycles').delete().eq('id', cycle.id);
        setCycles(prev => prev.filter(c => c.id !== cycle.id));
      } catch (error) {
        console.error('Error clearing cycle:', error);
      }
    } else {
      setCycles(prev => prev.filter(c => c.id !== cycle.id));
    }
  };

  const getMonthCycles = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return cycles.filter(c => {
      const start = new Date(c.start_date);
      return start.getFullYear() === year && start.getMonth() === month;
    });
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

  const hasJournalEntry = (date) => {
    if (!isAppUser) return false;
    const dateStr = toDateStr(date);
    return journalEntries.some(e => e.entry_date === dateStr);
  };

  const formatPredictedDate = (date) => {
    return date.toLocaleDateString(locale, { month: 'long', day: 'numeric' });
  };

  const metrics = calculateMetrics();
  const predictions = calculatePredictions(cycles);
  const monthCycles = getMonthCycles(currentMonth);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {conflictDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl p-5 max-w-sm w-full">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                <AlertTriangle size={18} className="text-amber-600" />
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{conflictDialog.message}</p>
            </div>
            <div className="flex flex-col gap-2">
              {conflictDialog.type === 'inside_existing' && (
                <>
                  <button onClick={conflictDialog.onYes} className="w-full px-4 py-2.5 bg-pink-500 hover:bg-pink-600 text-white text-sm font-medium rounded-xl transition-colors">
                    {t('tracker.endPeriodHere')}
                  </button>
                  <button onClick={conflictDialog.onNo} className="w-full px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-xl transition-colors">
                    {t('tracker.cancelAction')}
                  </button>
                </>
              )}
              {conflictDialog.type === 'ongoing_exists' && (
                <>
                  <button onClick={conflictDialog.onEndExisting} className="w-full px-4 py-2.5 bg-pink-500 hover:bg-pink-600 text-white text-sm font-medium rounded-xl transition-colors">
                    {t('tracker.endExistingPeriod')}
                  </button>
                  <button onClick={conflictDialog.onStartNew} className="w-full px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-xl transition-colors">
                    {t('tracker.startNewSeparate')}
                  </button>
                  <button onClick={conflictDialog.onCancel} className="w-full px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-xl transition-colors">
                    {t('tracker.cancelAction')}
                  </button>
                </>
              )}
              {conflictDialog.type === 'new_start_before_ongoing' && (
                <button onClick={conflictDialog.dismiss} className="w-full px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-xl transition-colors">
                  {t('common.cancel')}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

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
          {awaitingEndFor && (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-xl">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <Info size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-blue-900">{t('tracker.awaitingEnd')}</p>
                    <p className="text-xs text-blue-700 mt-0.5">
                      {new Date(awaitingEndFor.start_date).toLocaleDateString(locale, { month: 'long', day: 'numeric' })}. {t('tracker.awaitingEndDesc')}
                    </p>
                  </div>
                </div>
                <button onClick={cancelOngoingCycle} className="p-1.5 hover:bg-blue-100 rounded-lg transition-colors">
                  <X size={16} className="text-blue-600" />
                </button>
              </div>
            </div>
          )}

          {!awaitingEndFor && (
            <div className="bg-pink-50 border border-pink-200 rounded-xl p-4">
              <p className="text-sm text-pink-700">
                <span className="font-semibold">{t('tracker.howToRecord')}</span> {t('tracker.howToRecordDesc')}
                {isAppUser && <span> {t('tracker.howToRecordJournal')}</span>}
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
                  {currentMonth.toLocaleDateString(locale, { month: 'long', year: 'numeric' })}
                </span>
                {monthCycles.length >= 2 && (
                  <span className="text-xs font-medium text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                    {monthCycles.length} periods this month
                  </span>
                )}
                {monthCycles.length > 0 && !awaitingEndFor && (
                  <button
                    onClick={() => {
                      const mostRecent = monthCycles.sort((a, b) => new Date(b.start_date) - new Date(a.start_date))[0];
                      clearCycle(mostRecent);
                    }}
                    title="Clear most recent period this month"
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
                {[
                  t('tracker.daySun'),
                  t('tracker.dayMon'),
                  t('tracker.dayTue'),
                  t('tracker.dayWed'),
                  t('tracker.dayThu'),
                  t('tracker.dayFri'),
                  t('tracker.daySat'),
                ].map((day, i) => (
                  <div key={i} className="text-center text-xs font-semibold text-gray-400 py-2">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {getDaysInMonth(currentMonth).map((date, index) => {
                  if (!date) return <div key={`empty-${index}`} className="aspect-square" />;

                  const isToday = date.toDateString() === new Date().toDateString();
                  const status = getDateStatus(date, cycles);
                  const predStatus = status ? null : getPredictionDateStatus(date, predictions);
                  const hasEntry = hasJournalEntry(date);

                  const isOvulation = predStatus === 'ovulation';
                  const isFertile = predStatus === 'fertile';
                  const isPredStart = predStatus === 'pred-start';
                  const isPredEnd = predStatus === 'pred-end';
                  const isPredPeriod = predStatus === 'pred-period';

                  return (
                    <button
                      key={`day-${index}`}
                      onClick={() => handleCalendarDateClick(date)}
                      className={`aspect-square rounded-xl text-sm font-medium transition-all duration-200 relative
                        ${status === 'start' ? 'bg-pink-600 text-white shadow-md ring-2 ring-pink-300' : ''}
                        ${status === 'end' ? 'bg-rose-500 text-white shadow-md' : ''}
                        ${status === 'period' ? 'bg-pink-200 text-pink-900' : ''}
                        ${!status && isToday ? 'bg-pink-100 text-pink-700 border-2 border-pink-400' : ''}
                        ${!status && !isToday && !predStatus ? 'bg-gray-50 text-gray-700 hover:bg-pink-50 hover:text-pink-700' : ''}
                        ${(isPredStart || isPredEnd || isPredPeriod) ? 'border-2 border-dashed border-pink-400 text-pink-700' : ''}
                        ${isFertile && !isToday ? 'bg-amber-50 text-amber-800' : ''}
                        ${isOvulation && !isToday ? 'bg-amber-50 text-amber-800' : ''}
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
                      {isOvulation && (
                        <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-amber-500 rounded-full" />
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

            <div className="px-4 pb-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded bg-pink-600" />
                <span className="text-gray-500">{t('tracker.legendStartEnd')}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded bg-pink-200" />
                <span className="text-gray-500">{t('tracker.legendPeriodDays')}</span>
              </div>
              {predictions && (
                <>
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded border-2 border-dashed border-pink-400" />
                    <span className="text-gray-500">{t('tracker.legendPredicted')}</span>
                  </div>
                  {predictions.showOvulation && (
                    <>
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded bg-amber-50 border border-amber-200" />
                        <span className="text-gray-500">{t('tracker.legendCycleWindow')}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-amber-500" />
                        <span className="text-gray-500">{t('tracker.legendOvulation')}</span>
                      </div>
                    </>
                  )}
                </>
              )}
              {isAppUser && (
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-pink-400" />
                  <span className="text-gray-500">{t('tracker.legendJournal')}</span>
                </div>
              )}
            </div>
          </div>

          {predictions && (
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="px-4 pt-4 pb-2 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-800">{t('tracker.cyclePatternsTitle')}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {predictions.isVariable
                    ? t('tracker.estimatedVaries')
                    : t('tracker.basedOnCycles_other', { count: predictions.basedOnCycles })
                  }
                </p>
              </div>
              <div className="p-4 grid grid-cols-2 gap-3">
                <div className="bg-pink-50 rounded-xl p-3">
                  <p className="text-xs text-pink-500 font-medium mb-1">{t('tracker.nextEstimatedPeriod')}</p>
                  <p className="text-sm font-semibold text-pink-900">
                    {t('tracker.around')} {formatPredictedDate(predictions.nextPeriodStart)}
                  </p>
                  <p className="text-xs text-pink-400 mt-0.5">{t('tracker.uncertaintyDays', { days: predictions.uncertaintyDays })}</p>
                </div>
                {predictions.showOvulation ? (
                  <div className="bg-amber-50 rounded-xl p-3">
                    <p className="text-xs text-amber-600 font-medium mb-1">{t('tracker.estimatedOvulation')}</p>
                    <p className="text-sm font-semibold text-amber-900">
                      {t('tracker.around')} {formatPredictedDate(predictions.ovulationDay)}
                    </p>
                    <p className="text-xs text-amber-400 mt-0.5">±2 {i18n.language === 'hi' ? 'दिन' : 'days'}</p>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-500 font-medium mb-1">{t('tracker.ovulationTiming')}</p>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      {t('tracker.ovulationIrregular')}
                    </p>
                  </div>
                )}
              </div>
              <div className="px-4 pb-4">
                <div className="flex items-start gap-2 bg-gray-50 rounded-lg p-3">
                  <Info size={13} className="text-gray-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {t('tracker.irregularFooter')}
                  </p>
                </div>
              </div>
            </div>
          )}

          {metrics && (
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <Activity size={16} className="text-pink-500" />
                  <span className="text-xl font-bold text-gray-900">{metrics.lastPeriodLength ?? '-'}</span>
                </div>
                <p className="text-xs font-medium text-gray-600">{t('tracker.lastPeriod')}</p>
                <p className="text-xs text-gray-400">{t('tracker.avg')}: {metrics.avgPeriodLength ?? '-'} {i18n.language === 'hi' ? 'दिन' : 'days'}</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <Clock size={16} className="text-blue-500" />
                  <span className="text-xl font-bold text-gray-900">{metrics.lastCycleLength ?? '-'}</span>
                </div>
                <p className="text-xs font-medium text-gray-600">{t('tracker.lastCycle')}</p>
                <p className="text-xs text-gray-400">{t('tracker.avg')}: {metrics.avgCycleLength ?? '-'} {i18n.language === 'hi' ? 'दिन' : 'days'}</p>
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
                <p className="text-xs font-medium text-gray-600">{t('tracker.cycleShift')}</p>
                <p className="text-xs text-gray-400">
                  {metrics.secondLastCycleLength ? `${t('tracker.prev')}: ${metrics.secondLastCycleLength}d` : t('tracker.prevCycleNeeded')}
                </p>
              </div>
            </div>
          )}

          {!isAppUser && cycles.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <Info size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-700">
                  {t('tracker.localDataWarning')}
                </p>
              </div>
              <Link
                to="/auth"
                className="flex items-center gap-1.5 px-3 py-2 bg-pink-500 hover:bg-pink-600 text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap"
              >
                <LogIn size={13} />
                {t('tracker.signIn')}
              </Link>
            </div>
          )}

          {!isAppUser && cycles.length === 0 && (
            <div className="bg-gray-50 border border-dashed border-gray-200 rounded-xl p-5 text-center">
              <p className="text-sm text-gray-500 mb-3">{t('tracker.signInToSave')}</p>
              <Link
                to="/auth"
                className="inline-flex items-center gap-2 px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <LogIn size={15} />
                {t('tracker.signInOrCreate')}
              </Link>
            </div>
          )}
        </div>
      )}

      {activeTab === 'history' && (
        <HistoryTab cycles={cycles} />
      )}

      {activeTab === 'medications' && <MedicationTracker />}

      {activeTab === 'analysis' && <CycleAnalysis cycles={cycles} journalEntries={journalEntries} />}

      {activeTab === 'journal' && isAppUser && (
        <JournalTab
          entries={journalEntries}
          onEditEntry={(entry) => setJournalModal({ date: entry.entry_date, existing: entry })}
        />
      )}

      {activeTab === 'journal' && !isAppUser && (
        <div className="bg-gray-50 border border-dashed border-gray-200 rounded-xl p-8 text-center">
          <BookOpen size={28} className="text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-600 font-medium mb-1">{t('tracker.signInJournal')}</p>
          <p className="text-xs text-gray-400 mb-4">{t('tracker.signInJournalDesc')}</p>
          <Link
            to="/auth"
            className="inline-flex items-center gap-2 px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <LogIn size={15} />
            {t('tracker.signInOrCreate')}
          </Link>
        </div>
      )}

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
        <div className="flex items-start gap-2.5">
          <Info size={14} className="text-gray-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-gray-500 leading-relaxed">
            <span className="font-semibold text-gray-600">{t('tracker.personalToolDisclaimer')}</span> {t('tracker.personalToolDisclaimerDesc')}
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

const HistoryTab = ({ cycles }) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === 'hi' ? 'hi-IN' : 'en-US';

  const monthGroups = {};
  cycles.forEach(c => {
    const key = c.start_date.slice(0, 7);
    monthGroups[key] = (monthGroups[key] || 0) + 1;
  });

  if (cycles.length === 0) {
    return (
      <div className="bg-gray-50 border border-dashed border-gray-200 rounded-xl p-8 text-center">
        <Calendar size={28} className="text-gray-300 mx-auto mb-3" />
        <p className="text-sm text-gray-500">{t('tracker.noCyclesYet')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {cycles.map((cycle, index) => {
        const isShortCycle = cycle.cycle_length && cycle.cycle_length < 21;
        const isLongCycle = cycle.cycle_length && cycle.cycle_length > 35;
        const monthKey = cycle.start_date.slice(0, 7);
        const isSameMonth = monthGroups[monthKey] >= 2;

        return (
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
                  {new Date(cycle.start_date).toLocaleDateString(locale, { month: 'short', day: 'numeric', year: 'numeric' })}
                  {cycle.end_date && (
                    <span className="text-gray-400"> – {new Date(cycle.end_date).toLocaleDateString(locale, { month: 'short', day: 'numeric' })}</span>
                  )}
                </p>
                <p className="text-xs text-gray-500">
                  {cycle.end_date ? `${cycle.period_length} ${t('tracker.dayPeriod')}` : t('tracker.inProgress')}
                  {cycle.cycle_length ? ` · ${cycle.cycle_length}${t('tracker.daysSinceLastCycle')}` : ''}
                </p>
                {(isShortCycle || isLongCycle || isSameMonth) && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {isShortCycle && (
                      <span className="text-xs px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-medium">
                        {t('tracker.shortCycleBadge')}
                      </span>
                    )}
                    {isLongCycle && (
                      <span className="text-xs px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-medium">
                        {t('tracker.longCycleBadge')}
                      </span>
                    )}
                    {isSameMonth && (
                      <span className="text-xs px-1.5 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200 font-medium">
                        {t('tracker.sameMonthBadge')}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className={`w-2 h-2 rounded-full ${cycle.end_date ? 'bg-green-400' : 'bg-blue-400 animate-pulse'}`} />
          </div>
        );
      })}
    </div>
  );
};

export default PeriodTracker;
