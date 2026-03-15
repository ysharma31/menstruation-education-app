import { useState, useEffect } from 'react';
import { BookOpen, Clock } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/AuthContext';

const GENDER_CONFIG = {
  female: { label: 'Female', color: 'bg-pink-500', dot: 'bg-pink-400' },
  male: { label: 'Male', color: 'bg-blue-500', dot: 'bg-blue-400' },
  other: { label: 'Other', color: 'bg-purple-500', dot: 'bg-purple-400' },
  prefer_not_to_say: { label: 'Not stated', color: 'bg-gray-400', dot: 'bg-gray-400' }
};

const AVATAR_BG = {
  female: 'bg-pink-200 text-pink-700',
  male: 'bg-blue-200 text-blue-700',
  other: 'bg-purple-200 text-purple-700',
  prefer_not_to_say: 'bg-gray-200 text-gray-600'
};

const formatDate = (ts) =>
  new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

const GenderBar = ({ genderCounts, total }) => (
  <div className="space-y-2">
    {Object.entries(GENDER_CONFIG).map(([key, { label, color }]) => {
      const count = genderCounts[key] ?? 0;
      const pct = total > 0 ? Math.round((count / total) * 100) : 0;
      return (
        <div key={key} className="flex items-center gap-2">
          <span className="text-xs text-gray-500 w-20 flex-shrink-0">{label}</span>
          <div className="flex-1 bg-gray-100 rounded-full h-2">
            <div className={`${color} h-2 rounded-full transition-all`} style={{ width: `${pct}%` }} />
          </div>
          <span className="text-xs text-gray-500 w-12 text-right">{count} ({pct}%)</span>
        </div>
      );
    })}
  </div>
);

const StudentAccessPanel = ({ selectedMaterial }) => {
  const { user } = useAuth();

  const [overallStats, setOverallStats] = useState(null);
  const [overallGender, setOverallGender] = useState({});
  const [loadingOverall, setLoadingOverall] = useState(true);

  const [studentList, setStudentList] = useState([]);
  const [materialGender, setMaterialGender] = useState({});
  const [loadingStudents, setLoadingStudents] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetchOverall = async () => {
      setLoadingOverall(true);
      const { data: mats } = await supabase
        .from('course_materials')
        .select('id')
        .eq('teacher_id', user.id);

      if (!mats || mats.length === 0) {
        setOverallStats({ uniqueStudents: 0, totalViews: 0 });
        setOverallGender({});
        setLoadingOverall(false);
        return;
      }

      const matIds = mats.map((m) => m.id);
      const { data: access } = await supabase
        .from('material_access')
        .select('student_id')
        .in('material_id', matIds);

      const rows = access ?? [];
      const uniqueIds = [...new Set(rows.map((r) => r.student_id))];

      setOverallStats({ uniqueStudents: uniqueIds.length, totalViews: rows.length });

      if (uniqueIds.length > 0) {
        const { data: profiles } = await supabase
          .from('student_profiles')
          .select('gender')
          .in('id', uniqueIds);

        const counts = {};
        (profiles ?? []).forEach((p) => {
          const g = p.gender ?? 'prefer_not_to_say';
          counts[g] = (counts[g] ?? 0) + 1;
        });
        setOverallGender(counts);
      }
      setLoadingOverall(false);
    };
    fetchOverall();
  }, [user]);

  useEffect(() => {
    if (!selectedMaterial) { setStudentList([]); return; }
    const fetchStudents = async () => {
      setLoadingStudents(true);
      const { data: access } = await supabase
        .from('material_access')
        .select('student_id, accessed_at')
        .eq('material_id', selectedMaterial.id);

      const rows = access ?? [];
      if (rows.length === 0) {
        setStudentList([]);
        setMaterialGender({});
        setLoadingStudents(false);
        return;
      }

      const ids = rows.map((r) => r.student_id);
      const { data: profiles } = await supabase
        .from('student_profiles')
        .select('*')
        .in('id', ids);

      const profileMap = {};
      (profiles ?? []).forEach((p) => { profileMap[p.id] = p; });

      const joined = rows.map((r) => ({
        ...profileMap[r.student_id],
        student_id: r.student_id,
        accessed_at: r.accessed_at
      }));

      const counts = {};
      joined.forEach((s) => {
        const g = s.gender ?? 'prefer_not_to_say';
        counts[g] = (counts[g] ?? 0) + 1;
      });
      setMaterialGender(counts);
      setStudentList(joined);
      setLoadingStudents(false);
    };
    fetchStudents();
  }, [selectedMaterial]);

  const overallTotal = Object.values(overallGender).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-green-100 shadow-sm p-6 space-y-5">
        <h2 className="font-bold text-gray-900">Overall Engagement</h2>

        {loadingOverall ? (
          <div className="space-y-3">
            <div className="h-20 bg-gray-100 rounded-xl animate-pulse" />
            <div className="h-24 bg-gray-100 rounded-xl animate-pulse" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-green-50 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-green-700">{overallStats?.uniqueStudents ?? 0}</p>
                <p className="text-xs text-green-600 mt-0.5">Unique Students Reached</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-blue-700">{overallStats?.totalViews ?? 0}</p>
                <p className="text-xs text-blue-600 mt-0.5">Total Material Views</p>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-3">Overall Gender Breakdown</p>
              {overallTotal === 0 ? (
                <p className="text-sm text-gray-400">No student data yet.</p>
              ) : (
                <GenderBar genderCounts={overallGender} total={overallTotal} />
              )}
            </div>
          </>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-green-100 shadow-sm p-6">
        {!selectedMaterial ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
              <BookOpen size={22} className="text-gray-400" />
            </div>
            <p className="text-sm text-gray-500">Click on any material from the list to see which students accessed it.</p>
          </div>
        ) : (
          <>
            <h3 className="font-bold text-gray-900 mb-1 text-sm">
              Who accessed:
            </h3>
            <p className="text-sm text-gray-600 mb-4 font-medium truncate">{selectedMaterial.title}</p>

            {Object.keys(materialGender).length > 0 && (
              <div className="flex flex-wrap items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                {Object.entries(GENDER_CONFIG).map(([key, { label, dot }]) => {
                  const count = materialGender[key];
                  if (!count) return null;
                  return (
                    <div key={key} className="flex items-center gap-1.5">
                      <div className={`w-2 h-2 rounded-full ${dot}`} />
                      <span className="text-xs text-gray-600">{label}: {count}</span>
                    </div>
                  );
                })}
                <span className="ml-auto text-xs text-gray-400">Total: {studentList.length}</span>
              </div>
            )}

            {loadingStudents ? (
              <div className="flex justify-center py-8">
                <div className="w-8 h-8 border-4 border-green-200 border-t-green-500 rounded-full animate-spin" />
              </div>
            ) : studentList.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">No students have accessed this material yet.</p>
            ) : (
              <div className="max-h-80 overflow-y-auto space-y-2">
                {studentList.map((s) => {
                  const gender = s.gender ?? 'prefer_not_to_say';
                  const avatarCls = AVATAR_BG[gender] ?? AVATAR_BG.prefer_not_to_say;
                  const initial = s.full_name ? s.full_name[0].toUpperCase() : '?';
                  const gLabel = GENDER_CONFIG[gender]?.label ?? 'Unknown';
                  return (
                    <div key={s.student_id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 ${avatarCls}`}>
                        {initial}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{s.full_name ?? 'Unknown'}</p>
                        <p className="text-xs text-gray-400 truncate">
                          {s.grade ? `Grade ${s.grade}` : ''}{s.grade && gLabel ? ' · ' : ''}{gLabel}{s.school_name ? ` · ${s.school_name}` : ''}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-400 flex-shrink-0">
                        <Clock size={12} />
                        <span>{formatDate(s.accessed_at)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default StudentAccessPanel;
