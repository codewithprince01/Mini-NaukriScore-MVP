import { useEffect, useState } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

function LogoutPage() {
  const [status, setStatus] = useState('Logging out...');

  useEffect(() => {
    const doLogout = async () => {
      try {
        await fetch(`${API_BASE}/logout`, { method: 'POST' });
      } catch (e) {
 
      }

      localStorage.removeItem('naukri_user_id');
      window.dispatchEvent(new Event('authChanged'));
      setStatus('You have been logged out and local user_id is cleared.');
    };

    doLogout();
  }, []);

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold text-slate-800 mb-4">Logout</h2>
      <p className="text-sm text-slate-700">{status}</p>
    </div>
  );
}

export default LogoutPage;
