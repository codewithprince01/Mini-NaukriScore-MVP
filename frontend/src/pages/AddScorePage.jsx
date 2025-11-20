import { useState } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

function AddScorePage() {
  const [form, setForm] = useState({
    user_id: '',
    Basic_verification: 0,
    Background_check: 0,
    Experience: 0,
    Positive_behavior: 0
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numericFields = [
      'Basic_verification',
      'Background_check',
      'Experience',
      'Positive_behavior'
    ];

    setForm((prev) => ({
      ...prev,
      [name]: numericFields.includes(name) ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setResult(null);

    try {
      const res = await fetch(`${API_BASE}/add-score`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to add score');
      }

      setResult(data);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderBreakdown = () => {
    if (!result?.breakdown) return null;
    const items = Object.entries(result.breakdown);

    return (
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {items.map(([key, value]) => (
          <div
            key={key}
            className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 flex flex-col gap-1"
          >
            <div className="text-xs uppercase tracking-wide text-slate-500">{key}</div>
            <div className="text-lg font-semibold text-slate-800">{value}</div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold text-slate-800 mb-4">Add Score</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">User ID</label>
          <input
            type="text"
            name="user_id"
            value={form.user_id}
            onChange={handleChange}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {['Basic_verification', 'Background_check', 'Experience', 'Positive_behavior'].map(
            (field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {field} (0 or 1)
                </label>
                <select
                  name={field}
                  value={form[field]}
                  onChange={handleChange}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value={0}>0</option>
                  <option value={1}>1</option>
                </select>
              </div>
            )
          )}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex justify-center items-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
        >
          {loading ? 'Submitting...' : 'Add Score'}
        </button>
      </form>
      {message && (
        <p className="mt-4 text-sm text-red-600">{message}</p>
      )}
      {result && (
        <div className="mt-6">
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wide text-emerald-700">Final Score</div>
              <div className="text-2xl font-bold text-emerald-800">{result.finalScore}</div>
            </div>
            <div className="text-xs text-emerald-800 break-all">
              <span className="font-semibold">user_id:</span> {result.user_id}
            </div>
          </div>
          {renderBreakdown()}
        </div>
      )}
    </div>
  );
}

export default AddScorePage;
