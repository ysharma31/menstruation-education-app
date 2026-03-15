import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Shield, Eye, Users } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import CreateClassForm from './components/CreateClassForm';
import SharePanel from './components/SharePanel';
import StatsPanel from './components/StatsPanel';
import ClassList from './components/ClassList';

const PRIVACY_NOTICES = [
  { icon: Shield, text: 'All statistics are anonymous and aggregated' },
  { icon: Eye, text: 'You cannot see individual student activity' },
  { icon: Users, text: 'Students can use the app without joining a class' }
];

const TeacherDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [enrollmentCount, setEnrollmentCount] = useState(0);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/teacher');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    const fetchClasses = async () => {
      setLoadingClasses(true);
      const { data } = await supabase
        .from('teacher_classes')
        .select('*')
        .eq('teacher_id', user.id)
        .order('created_at', { ascending: false });
      setClasses(data ?? []);
      if (data && data.length > 0) setSelectedClass(data[0]);
      setLoadingClasses(false);
    };
    fetchClasses();
  }, [user]);

  useEffect(() => {
    if (!selectedClass) { setEnrollmentCount(0); return; }
    const fetchCount = async () => {
      const { count } = await supabase
        .from('class_enrollments')
        .select('*', { count: 'exact', head: true })
        .eq('class_id', selectedClass.id);
      setEnrollmentCount(count ?? 0);
    };
    fetchCount();
  }, [selectedClass]);

  const handleClassCreated = (newClass) => {
    setClasses((prev) => [newClass, ...prev]);
    setSelectedClass(newClass);
  };

  const handleClassDeleted = (id) => {
    setClasses((prev) => {
      const updated = prev.filter((c) => c.id !== id);
      if (selectedClass?.id === id) setSelectedClass(updated[0] ?? null);
      return updated;
    });
  };

  if (authLoading || loadingClasses) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-green-600 flex items-center justify-center shadow-lg">
            <GraduationCap className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ''}!
            </h1>
            <p className="text-gray-500 text-sm">Manage your classes and view anonymous engagement stats.</p>
          </div>
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
        <p className="text-xs font-bold uppercase tracking-wider text-green-700 mb-3">Privacy Notice</p>
        <div className="grid sm:grid-cols-3 gap-3">
          {PRIVACY_NOTICES.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                <Icon size={14} className="text-green-700" />
              </div>
              <span className="text-sm text-green-900">{text}</span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-green-700 border-t border-green-200 pt-3">
          This dashboard complies with basic educational data protection principles. No personally identifiable student information is collected or displayed. Students joining a class only creates an anonymous enrollment record.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-5">
          <CreateClassForm onCreated={handleClassCreated} />
          <ClassList
            classes={classes}
            selectedId={selectedClass?.id}
            onSelect={setSelectedClass}
            onDeleted={handleClassDeleted}
          />
        </div>

        <div className="space-y-5">
          {selectedClass ? (
            <>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-bold text-gray-900">{selectedClass.class_name}</h2>
                  {selectedClass.school_name && (
                    <span className="text-sm text-gray-500">{selectedClass.school_name}</span>
                  )}
                </div>
                <SharePanel classCode={selectedClass.class_code} />
              </div>
              <StatsPanel enrollmentCount={enrollmentCount} />
            </>
          ) : (
            <div className="bg-white rounded-2xl border border-dashed border-green-200 p-10 text-center">
              <GraduationCap className="w-10 h-10 text-green-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">Create a class to see the share panel and stats.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
