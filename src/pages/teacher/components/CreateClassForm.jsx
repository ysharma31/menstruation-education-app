import { useState } from 'react';
import { CirclePlus as PlusCircle, School } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/AuthContext';

const CreateClassForm = ({ onCreated }) => {
  const { user } = useAuth();
  const [className, setClassName] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!className.trim()) return;
    setLoading(true);
    setError('');
    try {
      const { data, error: insertError } = await supabase
        .from('teacher_classes')
        .insert({
          teacher_id: user.id,
          class_name: className.trim(),
          school_name: schoolName.trim() || null
        })
        .select()
        .single();

      if (insertError) throw insertError;
      setClassName('');
      setSchoolName('');
      onCreated(data);
    } catch (err) {
      setError(err.message || 'Failed to create class.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-green-100 shadow-sm p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-xl bg-green-100 flex items-center justify-center">
          <PlusCircle className="w-5 h-5 text-green-600" />
        </div>
        <h2 className="text-lg font-bold text-gray-900">Create a New Class</h2>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Class Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            required
            placeholder="e.g. Grade 7B Health"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            School Name <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <div className="relative">
            <School size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              placeholder="e.g. Delhi Public School"
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400 text-sm"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !className.trim()}
          className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white font-semibold rounded-xl transition-colors text-sm"
        >
          {loading ? 'Creating...' : 'Create Class'}
        </button>
      </form>
    </div>
  );
};

export default CreateClassForm;
