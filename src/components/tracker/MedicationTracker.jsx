import { useState, useEffect } from 'react';
import { Pill, Plus, X, Calendar, ChevronDown, CreditCard as Edit2, Check, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

const PURPOSE_LABELS = {
  cramps: { label: 'Period Cramps', color: 'bg-red-100 text-red-700' },
  pcos: { label: 'PCOS', color: 'bg-orange-100 text-orange-700' },
  hormonal: { label: 'Hormonal / Birth Control', color: 'bg-blue-100 text-blue-700' },
  pain_relief: { label: 'General Pain Relief', color: 'bg-yellow-100 text-yellow-700' },
  other: { label: 'Other', color: 'bg-gray-100 text-gray-600' }
};

const MedicationTracker = () => {
  const { user } = useAuth();
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const emptyForm = {
    name: '',
    purpose: 'cramps',
    dosage: '',
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
    is_ongoing: true,
    notes: ''
  };

  const [form, setForm] = useState(emptyForm);

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
        .order('start_date', { ascending: false });

      if (error) throw error;
      setMedications(data || []);
    } catch (error) {
      console.error('Error loading medications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);

    const payload = {
      ...form,
      end_date: form.is_ongoing ? null : (form.end_date || null),
      user_id: user.id
    };

    try {
      if (editingId) {
        const { data, error } = await supabase
          .from('medications')
          .update(payload)
          .eq('id', editingId)
          .select()
          .single();

        if (error) throw error;
        setMedications(medications.map(m => m.id === editingId ? data : m));
      } else {
        const { data, error } = await supabase
          .from('medications')
          .insert([payload])
          .select()
          .single();

        if (error) throw error;
        setMedications([data, ...medications]);
      }

      setForm(emptyForm);
      setShowForm(false);
      setEditingId(null);
    } catch (error) {
      console.error('Error saving medication:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (med) => {
    setForm({
      name: med.name,
      purpose: med.purpose,
      dosage: med.dosage || '',
      start_date: med.start_date,
      end_date: med.end_date || '',
      is_ongoing: med.is_ongoing,
      notes: med.notes || ''
    });
    setEditingId(med.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await supabase.from('medications').delete().eq('id', id);
      setMedications(medications.filter(m => m.id !== id));
    } catch (error) {
      console.error('Error deleting medication:', error);
    }
  };

  const handleCancel = () => {
    setForm(emptyForm);
    setShowForm(false);
    setEditingId(null);
  };

  if (!user) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
        <Pill size={32} className="text-gray-300 mx-auto mb-3" />
        <p className="text-sm text-gray-500">Sign in to track your medications and see how they affect your cycle.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <Pill size={20} className="text-pink-500" />
          Medications
        </h3>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-pink-50 hover:bg-pink-100 text-pink-600 text-sm font-medium rounded-lg transition-colors"
          >
            <Plus size={16} />
            Add Medication
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSave} className="bg-pink-50 border border-pink-200 rounded-xl p-5 space-y-4">
          <h4 className="font-medium text-gray-800 text-sm">
            {editingId ? 'Edit Medication' : 'Add New Medication'}
          </h4>

          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Medication Name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g., Ibuprofen, Primolut-N"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Purpose</label>
              <select
                value={form.purpose}
                onChange={(e) => setForm({ ...form, purpose: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white"
              >
                {Object.entries(PURPOSE_LABELS).map(([key, val]) => (
                  <option key={key} value={key}>{val.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Dosage (optional)</label>
              <input
                type="text"
                value={form.dosage}
                onChange={(e) => setForm({ ...form, dosage: e.target.value })}
                placeholder="e.g., 400mg once daily"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Start Date</label>
              <input
                type="date"
                required
                value={form.start_date}
                onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
              <div className="flex items-center gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, is_ongoing: !form.is_ongoing })}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                    form.is_ongoing
                      ? 'bg-green-50 border-green-300 text-green-700'
                      : 'bg-gray-50 border-gray-200 text-gray-600'
                  }`}
                >
                  {form.is_ongoing ? <Check size={12} /> : null}
                  {form.is_ongoing ? 'Currently Taking' : 'Stopped'}
                </button>
              </div>
            </div>

            {!form.is_ongoing && (
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">End Date</label>
                <input
                  type="date"
                  value={form.end_date}
                  onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                  min={form.start_date}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                />
              </div>
            )}

            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Notes (optional)</label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Any additional notes about side effects, doctor's advice, etc."
                rows={2}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 resize-none"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-1.5 px-4 py-2 bg-pink-500 hover:bg-pink-600 disabled:bg-pink-300 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <Check size={14} />
              {saving ? 'Saving...' : (editingId ? 'Save Changes' : 'Add Medication')}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 text-sm font-medium rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-pink-500"></div>
        </div>
      ) : medications.length === 0 ? (
        <div className="bg-gray-50 border border-dashed border-gray-200 rounded-xl p-6 text-center">
          <Pill size={28} className="text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500">No medications recorded yet.</p>
          <p className="text-xs text-gray-400 mt-1">Add any medication you take that may affect your cycle.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {medications.map((med) => {
            const purposeInfo = PURPOSE_LABELS[med.purpose] || PURPOSE_LABELS.other;
            return (
              <div
                key={med.id}
                className="flex items-start justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-pink-200 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-semibold text-gray-900 text-sm">{med.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${purposeInfo.color}`}>
                      {purposeInfo.label}
                    </span>
                    {med.is_ongoing && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-700 font-medium">
                        Ongoing
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    {new Date(med.start_date).toLocaleDateString()}
                    {med.end_date ? ` - ${new Date(med.end_date).toLocaleDateString()}` : ' - Present'}
                  </p>
                  {med.dosage && (
                    <p className="text-xs text-gray-400 mt-0.5">{med.dosage}</p>
                  )}
                  {med.notes && (
                    <p className="text-xs text-gray-400 mt-0.5 italic">{med.notes}</p>
                  )}
                </div>
                <div className="flex items-center gap-1 ml-3">
                  <button
                    onClick={() => handleEdit(med)}
                    className="p-1.5 text-gray-400 hover:text-pink-500 hover:bg-pink-50 rounded-lg transition-colors"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(med.id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MedicationTracker;
