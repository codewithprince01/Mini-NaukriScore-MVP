import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

function ScorePage() {
  const navigate = useNavigate();
  const { user_id: routeUserId } = useParams();

  const [userId, setUserId] = useState(
    routeUserId || localStorage.getItem('naukri_user_id') || ''
  );
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState('');

  const fetchScore = async (id) => {
    if (!id) return;
    setLoading(true);
    setMessage('');
    setResult(null);

    try {
      const res = await fetch(`${API_BASE}/score/${id}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to fetch score');
      }

      setResult(data);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (routeUserId) {
      setUserId(routeUserId);
      fetchScore(routeUserId);
    }
  }, [routeUserId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) return;

    navigate(`/score/${userId}`);
    fetchScore(userId);
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
      <h2 className="text-xl font-semibold text-slate-800 mb-4">View Score</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">User ID</label>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex justify-center items-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
        >
          {loading ? 'Fetching...' : 'Get Score'}
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

export default ScorePage;
