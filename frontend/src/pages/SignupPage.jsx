import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ Name: '', Email: '', Password: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [userId, setUserId] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCopy = () => {
    if (!userId) return;

    navigator.clipboard.writeText(userId).then(() => {
      setCopied(true);

      // Save session
      localStorage.setItem('naukri_user_id', userId);
      window.dispatchEvent(new Event('authChanged'));

      // SweetAlert Toast
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'User ID copied successfully!',
        showConfirmButton: false,
        timer: 1500,
        toast: true,
      });

      // Redirect after 1.5 sec
      setTimeout(() => {
        setShowPopup(false);
        navigate('/add-score');
      }, 1500);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      setUserId(data.user_id || '');
      setCopied(false);
      setShowPopup(true);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      {/* Signup Form */}
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Signup</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
            <input
              type="text"
              name="Name"
              value={form.Name}
              onChange={handleChange}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              type="email"
              name="Email"
              value={form.Email}
              onChange={handleChange}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input
              type="password"
              name="Password"
              value={form.Password}
              onChange={handleChange}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex justify-center items-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            {loading ? 'Registering...' : 'Signup'}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-sm text-red-600">
            <span className="font-medium">Error:</span> {message}
          </p>
        )}
      </div>

      {/* Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
          <div className="bg-white max-w-sm w-full rounded-xl shadow-xl p-6 relative animate-fadeIn">

            {/* Close Button */}
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-3 right-3 text-slate-500 hover:text-slate-700 text-lg"
            >
              ✕
            </button>

            <h3 className="text-lg font-semibold text-slate-800 mb-3">
              🎉 Signup Successful!
            </h3>

            <p className="text-sm text-slate-600 mb-3">
              Your <span className="font-semibold">User ID</span> is generated.
              Please save it for scoring.
            </p>

            {/* User ID Card */}
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 p-3 rounded-md">
              <span className="text-xs text-slate-700 break-all">{userId}</span>

              <button
                onClick={handleCopy}
                className="ml-auto px-3 py-1 text-xs bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
              >
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default SignupPage;
