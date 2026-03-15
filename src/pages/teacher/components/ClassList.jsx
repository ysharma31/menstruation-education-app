import { useState } from 'react';
import { Trash2, ChevronRight } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

const ClassList = ({ classes, onSelect, selectedId, onDeleted }) => {
  const [deleting, setDeleting] = useState(null);

  const handleDelete = async (cls) => {
    if (!window.confirm(`Delete class "${cls.class_name}"? This cannot be undone.`)) return;
    setDeleting(cls.id);
    try {
      await supabase.from('teacher_classes').delete().eq('id', cls.id);
      onDeleted(cls.id);
    } catch {
      /* silently fail */
    } finally {
      setDeleting(null);
    }
  };

  if (classes.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-green-100 shadow-sm p-6 text-center">
        <p className="text-gray-500 text-sm">No classes yet. Create one to get started.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-green-100 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="font-bold text-gray-900">Your Classes</h2>
      </div>
      <ul>
        {classes.map((cls, i) => (
          <li
            key={cls.id}
            className={`flex items-center gap-4 px-6 py-4 cursor-pointer hover:bg-green-50 transition-colors ${
              selectedId === cls.id ? 'bg-green-50 border-l-4 border-green-500' : ''
            } ${i < classes.length - 1 ? 'border-b border-gray-100' : ''}`}
            onClick={() => onSelect(cls)}
          >
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 truncate">{cls.class_name}</p>
              {cls.school_name && (
                <p className="text-xs text-gray-500 truncate">{cls.school_name}</p>
              )}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={(e) => { e.stopPropagation(); handleDelete(cls); }}
                disabled={deleting === cls.id}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40"
                title="Delete class"
              >
                <Trash2 size={15} />
              </button>
              <ChevronRight size={16} className="text-gray-400" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ClassList;
