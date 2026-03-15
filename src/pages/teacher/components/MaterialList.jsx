import { useState, useEffect } from 'react';
import { FileText, Image, Video, ExternalLink, Trash2 } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/AuthContext';

const TYPE_ICON = {
  pdf: { icon: FileText, bg: 'bg-red-100', color: 'text-red-600' },
  image: { icon: Image, bg: 'bg-blue-100', color: 'text-blue-600' },
  video: { icon: Video, bg: 'bg-teal-100', color: 'text-teal-600' }
};

const formatDate = (ts) =>
  new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

const MaterialList = ({ refreshTrigger, onSelectMaterial, selectedMaterialId, classes = [] }) => {
  const { user } = useAuth();
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [classFilter, setClassFilter] = useState('');
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    if (!user) return;
    const fetchMaterials = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('course_materials')
        .select('*, teacher_classes(class_name)')
        .eq('teacher_id', user.id)
        .order('created_at', { ascending: false });
      setMaterials(data ?? []);
      setLoading(false);
    };
    fetchMaterials();
  }, [user, refreshTrigger]);

  const handleDelete = async (material) => {
    if (!window.confirm(`Delete "${material.title}"? This cannot be undone.`)) return;
    setDeleting(material.id);
    try {
      if (material.file_name) {
        await supabase.storage.from('course-materials').remove([material.file_name]);
      }
      await supabase.from('course_materials').delete().eq('id', material.id);
      setMaterials((prev) => prev.filter((m) => m.id !== material.id));
    } catch {
      /* silently fail */
    } finally {
      setDeleting(null);
    }
  };

  const filtered = classFilter
    ? materials.filter((m) => m.class_id === classFilter)
    : materials;

  const byClass = filtered.reduce((acc, m) => {
    const key = m.class_id ?? '__none__';
    if (!acc[key]) acc[key] = [];
    acc[key].push(m);
    return acc;
  }, {});

  const getClassName = (classId) => {
    if (!classId) return 'No class assigned';
    const found = classes.find((c) => c.id === classId);
    if (found) return found.class_name;
    const fromMaterial = materials.find((m) => m.class_id === classId);
    return fromMaterial?.teacher_classes?.class_name ?? 'Unknown class';
  };

  const sortedClassKeys = Object.keys(byClass).sort((a, b) => {
    if (a === '__none__') return 1;
    if (b === '__none__') return -1;
    return getClassName(a).localeCompare(getClassName(b));
  });

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-green-100 shadow-sm p-6 space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-green-100 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h2 className="font-bold text-gray-900">Your Materials</h2>
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{materials.length}</span>
        </div>
        <select
          value={classFilter}
          onChange={(e) => setClassFilter(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-green-300 bg-white"
        >
          <option value="">All Classes</option>
          {classes.map((c) => (
            <option key={c.id} value={c.id}>{c.class_name}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="p-10 text-center">
          <Video className="w-10 h-10 text-gray-200 mx-auto mb-2" />
          <p className="text-sm text-gray-400">No materials uploaded yet.</p>
        </div>
      ) : (
        <div className="max-h-[520px] overflow-y-auto">
          {sortedClassKeys.map((classKey) => (
            <div key={classKey}>
              <div className="px-6 py-2 bg-gray-50 border-b border-gray-100">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {getClassName(classKey === '__none__' ? null : classKey)} ({byClass[classKey].length})
                </span>
              </div>
              {byClass[classKey].map((material, i) => {
                const { icon: Icon, bg, color } = TYPE_ICON[material.type] ?? TYPE_ICON.pdf;
                const isSelected = selectedMaterialId === material.id;
                return (
                  <div
                    key={material.id}
                    onClick={() => onSelectMaterial(material)}
                    className={`flex items-center gap-3 px-6 py-3 cursor-pointer hover:bg-green-50 transition-colors ${
                      isSelected ? 'bg-green-50 border-l-4 border-green-500' : ''
                    } ${i < byClass[classKey].length - 1 ? 'border-b border-gray-50' : ''}`}
                  >
                    <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center flex-shrink-0`}>
                      <Icon size={14} className={color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{material.title}</p>
                      <p className="text-xs text-gray-400">{material.type.toUpperCase()} · {formatDate(material.created_at)}</p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <a
                        href={material.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <ExternalLink size={14} />
                      </a>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(material); }}
                        disabled={deleting === material.id}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MaterialList;
