import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus, CircleAlert as AlertCircle, Info, Pill, Activity, ChartBar as BarChart2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

const PURPOSE_LABELS = {
  cramps: 'Period Cramps',
  pcos: 'PCOS',
  hormonal: 'Hormonal / Birth Control',
  pain_relief: 'General Pain Relief',
  other: 'Other'
};

const isMedActiveOnDate = (med, dateStr) => {
  const d = new Date(dateStr);
  const start = new Date(med.start_date);
  const end = med.end_date ? new Date(med.end_date) : null;
  if (d < start) return false;
  if (end && d > end) return false;
  return true;
};

const CycleAnalysis = ({ cycles }) => {
  const { user } = useAuth();
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadMedications();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadMedications = async () => {
    try {
      const { data, error } = await supabase
        .from('medications')
        .select('*')
        .order('start_date', { ascending: true });

      if (error) throw error;
      setMedications(data || []);
    } catch {
      console.error('Error loading medications');
    } finally {
      setLoading(false);
    }
  };

  const completedCycles = cycles.filter(c => c.end_date && c.period_length);

  const buildAnalysis = () => {
    if (completedCycles.length < 2) return null;

    const cyclesWithMeds = completedCycles.map((cycle) => {
      const activeMeds = medications.filter(med =>
        isMedActiveOnDate(med, cycle.start_date)
      );
      return { ...cycle, activeMeds };
    });

    const cyclesWithMedChanges = [];

    for (let i = 0; i < cyclesWithMeds.length - 1; i++) {
      const current = cyclesWithMeds[i];
      const previous = cyclesWithMeds[i + 1];

      if (!current.cycle_length || !previous.cycle_length) continue;

      const cycleDiff = current.cycle_length - previous.cycle_length;
      const periodDiff = current.period_length - previous.period_length;

      const newMeds = current.activeMeds.filter(
        m => !previous.activeMeds.find(pm => pm.id === m.id)
      );
      const stoppedMeds = previous.activeMeds.filter(
        m => !current.activeMeds.find(cm => cm.id === m.id)
      );

      const hasChange = Math.abs(cycleDiff) >= 3 || Math.abs(periodDiff) >= 2;
      const hasMedChange = newMeds.length > 0 || stoppedMeds.length > 0;

      if (hasChange || hasMedChange) {
        cyclesWithMedChanges.push({
          cycle: current,
          previous,
          cycleDiff,
          periodDiff,
          newMeds,
          stoppedMeds,
          correlation: hasChange && hasMedChange ? 'possible' : hasChange ? 'no_med_change' : 'med_change_no_cycle_shift'
        });
      }
    }

    const avgCycleLength = completedCycles
      .filter(c => c.cycle_length)
      .reduce((sum, c, _, arr) => sum + c.cycle_length / arr.length, 0);

    const avgPeriodLength = completedCycles
      .reduce((sum, c, _, arr) => sum + c.period_length / arr.length, 0);

    return {
      cyclesWithMedChanges,
      avgCycleLength: Math.round(avgCycleLength * 10) / 10,
      avgPeriodLength: Math.round(avgPeriodLength * 10) / 10,
      totalCycles: completedCycles.length,
      recentCycles: cyclesWithMeds.slice(0, 6)
    };
  };

  const analysis = buildAnalysis();

  if (!user) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
        <BarChart2 size={32} className="text-gray-300 mx-auto mb-3" />
        <p className="text-sm text-gray-500">Sign in to view your cycle analysis and medication correlations.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="bg-gray-50 border border-dashed border-gray-200 rounded-xl p-6 text-center">
        <BarChart2 size={28} className="text-gray-300 mx-auto mb-2" />
        <p className="text-sm text-gray-500">Record at least 2 complete cycles to see pattern analysis.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{analysis.totalCycles}</p>
          <p className="text-xs text-gray-500 mt-1">Cycles Recorded</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{analysis.avgCycleLength || '-'}</p>
          <p className="text-xs text-gray-500 mt-1">Avg Cycle (days)</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{analysis.avgPeriodLength}</p>
          <p className="text-xs text-gray-500 mt-1">Avg Period (days)</p>
        </div>
      </div>

      {analysis.recentCycles.length >= 2 && (
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h4 className="font-semibold text-gray-800 text-sm mb-4 flex items-center gap-2">
            <Activity size={16} className="text-pink-500" />
            Last {analysis.recentCycles.length} Cycles at a Glance
          </h4>
          <div className="space-y-2">
            {analysis.recentCycles.map((cycle, index) => {
              const prevCycle = analysis.recentCycles[index + 1];
              const cycleDiff = prevCycle && cycle.cycle_length && prevCycle.cycle_length
                ? cycle.cycle_length - prevCycle.cycle_length
                : null;
              const periodDiff = prevCycle
                ? cycle.period_length - prevCycle.period_length
                : null;

              return (
                <div key={cycle.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                  <div className="w-7 h-7 rounded-lg bg-pink-100 flex items-center justify-center text-xs font-bold text-pink-600 flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-700">
                      {new Date(cycle.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-xs text-gray-500">
                        Period: <strong className="text-gray-700">{cycle.period_length}d</strong>
                        {periodDiff !== null && (
                          <span className={`ml-1 ${periodDiff > 0 ? 'text-orange-500' : periodDiff < 0 ? 'text-green-600' : 'text-gray-400'}`}>
                            ({periodDiff > 0 ? '+' : ''}{periodDiff}d)
                          </span>
                        )}
                      </span>
                      {cycle.cycle_length && (
                        <span className="text-xs text-gray-500">
                          Cycle: <strong className="text-gray-700">{cycle.cycle_length}d</strong>
                          {cycleDiff !== null && (
                            <span className={`ml-1 ${cycleDiff > 0 ? 'text-orange-500' : cycleDiff < 0 ? 'text-green-600' : 'text-gray-400'}`}>
                              ({cycleDiff > 0 ? '+' : ''}{cycleDiff}d)
                            </span>
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                  {cycle.activeMeds.length > 0 && (
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Pill size={12} className="text-blue-400" />
                      <span className="text-xs text-blue-500">{cycle.activeMeds.length}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {analysis.cyclesWithMedChanges.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-800 text-sm flex items-center gap-2">
            <TrendingUp size={16} className="text-pink-500" />
            Notable Observations
          </h4>

          {analysis.cyclesWithMedChanges.map((obs, index) => (
            <div
              key={index}
              className={`rounded-xl p-4 border ${
                obs.correlation === 'possible'
                  ? 'bg-amber-50 border-amber-200'
                  : obs.correlation === 'no_med_change'
                  ? 'bg-blue-50 border-blue-200'
                  : 'bg-green-50 border-green-200'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  obs.correlation === 'possible' ? 'bg-amber-100' : obs.correlation === 'no_med_change' ? 'bg-blue-100' : 'bg-green-100'
                }`}>
                  {obs.correlation === 'possible'
                    ? <AlertCircle size={16} className="text-amber-600" />
                    : obs.correlation === 'no_med_change'
                    ? <TrendingUp size={16} className="text-blue-600" />
                    : <Pill size={16} className="text-green-600" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 mb-1">
                    Cycle starting {new Date(obs.cycle.start_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>

                  <div className="flex flex-wrap gap-3 text-xs text-gray-600 mb-2">
                    {obs.cycleDiff !== 0 && obs.cycle.cycle_length && (
                      <span className="flex items-center gap-1">
                        {obs.cycleDiff > 0
                          ? <TrendingUp size={11} className="text-orange-500" />
                          : <TrendingDown size={11} className="text-green-600" />
                        }
                        Cycle {obs.cycleDiff > 0 ? 'longer' : 'shorter'} by {Math.abs(obs.cycleDiff)} days
                        ({obs.previous.cycle_length}d → {obs.cycle.cycle_length}d)
                      </span>
                    )}
                    {obs.periodDiff !== 0 && (
                      <span className="flex items-center gap-1">
                        {obs.periodDiff > 0
                          ? <TrendingUp size={11} className="text-orange-500" />
                          : <TrendingDown size={11} className="text-green-600" />
                        }
                        Period {obs.periodDiff > 0 ? 'longer' : 'shorter'} by {Math.abs(obs.periodDiff)} days
                        ({obs.previous.period_length}d → {obs.cycle.period_length}d)
                      </span>
                    )}
                  </div>

                  {obs.newMeds.length > 0 && (
                    <p className="text-xs text-gray-600 mb-1">
                      <span className="font-medium text-green-700">Started:</span>{' '}
                      {obs.newMeds.map(m => m.name).join(', ')}
                      {' '}({obs.newMeds.map(m => PURPOSE_LABELS[m.purpose]).join(', ')})
                    </p>
                  )}
                  {obs.stoppedMeds.length > 0 && (
                    <p className="text-xs text-gray-600 mb-1">
                      <span className="font-medium text-red-600">Stopped:</span>{' '}
                      {obs.stoppedMeds.map(m => m.name).join(', ')}
                    </p>
                  )}

                  {obs.correlation === 'possible' && (
                    <p className="text-xs text-amber-700 mt-2 bg-amber-100/60 rounded-lg px-3 py-2 leading-relaxed">
                      A cycle change was observed around the time of a medication change. This is a personal observation pattern only.
                    </p>
                  )}
                  {obs.correlation === 'no_med_change' && (
                    <p className="text-xs text-blue-700 mt-2 bg-blue-100/60 rounded-lg px-3 py-2 leading-relaxed">
                      A cycle change was observed. No medication change was recorded during this period.
                    </p>
                  )}
                  {obs.correlation === 'med_change_no_cycle_shift' && (
                    <p className="text-xs text-green-700 mt-2 bg-green-100/60 rounded-lg px-3 py-2 leading-relaxed">
                      A medication change was recorded but no significant cycle shift was observed this cycle.
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {analysis.cyclesWithMedChanges.length === 0 && analysis.totalCycles >= 2 && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
          <Minus size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-green-700">
            No significant cycle changes observed yet. Keep recording to build a clearer picture over time.
          </p>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Info size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-blue-800 mb-1">For Personal Learning Only</p>
            <p className="text-xs text-blue-700 leading-relaxed">
              These observations are based on your own recorded data and are meant to help you notice personal patterns. They are not a medical diagnosis. Any changes in your cycle, or concerns about medications and their effects, should be discussed with your doctor or gynaecologist who can provide a proper assessment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CycleAnalysis;
