import { Outlet, Link, useNavigate } from 'react-router-dom';
import { BookOpen, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

const StudentLayout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/student');
  };

  return (
    <div>
      <nav className="bg-white border-b border-indigo-100 shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/student" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm leading-tight">Student Portal</p>
              <p className="text-xs text-indigo-500 leading-tight">Period Education App</p>
            </div>
          </Link>

          {user && (
            <button
              onClick={handleSignOut}
              className="text-sm text-gray-500 hover:text-red-600 flex items-center gap-2 transition-colors"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          )}
        </div>
      </nav>

      <div className="bg-indigo-50 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default StudentLayout;
