import { useEffect, useState } from 'react';
import { NavLink, Route, Routes, Navigate } from 'react-router-dom';
import SignupPage from './pages/SignupPage.jsx';
import AddScorePage from './pages/AddScorePage.jsx';
import ScorePage from './pages/ScorePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import LogoutPage from './pages/LogoutPage.jsx';

const navLinkClass = ({ isActive }) =>
  `px-3 py-1 rounded text-sm font-medium ${
    isActive ? 'bg-emerald-600 text-white' : 'text-emerald-700 hover:bg-emerald-50'
  }`;

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(Boolean(localStorage.getItem('naukri_user_id')));

  useEffect(() => {
    const handler = () => {
      setIsLoggedIn(Boolean(localStorage.getItem('naukri_user_id')));
    };

    window.addEventListener('authChanged', handler);
    return () => window.removeEventListener('authChanged', handler);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
          <h1 className="text-lg font-semibold text-emerald-700">Mini NaukriScore</h1>
          <nav className="flex gap-2">
            {!isLoggedIn && (
              <>
                <NavLink to="/login" className={navLinkClass}>
                  Login
                </NavLink>
                <NavLink to="/signup" className={navLinkClass}>
                  Signup
                </NavLink>
              </>
            )}
            {isLoggedIn && (
              <>
                <NavLink to="/add-score" className={navLinkClass}>
                  Add Score
                </NavLink>
                <NavLink to="/score" className={navLinkClass}>
                  View Score
                </NavLink>
                <NavLink to="/logout" className={navLinkClass}>
                  Logout
                </NavLink>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={isLoggedIn ? <Navigate to="/add-score" /> : <LoginPage />} />
            <Route
              path="/signup"
              element={isLoggedIn ? <Navigate to="/add-score" /> : <SignupPage />}
            />
            <Route
              path="/login"
              element={isLoggedIn ? <Navigate to="/add-score" /> : <LoginPage />}
            />
            <Route
              path="/add-score"
              element={isLoggedIn ? <AddScorePage /> : <Navigate to="/login" />}
            />
            <Route
              path="/score"
              element={isLoggedIn ? <ScorePage /> : <Navigate to="/login" />}
            />
            <Route
              path="/score/:user_id"
              element={isLoggedIn ? <ScorePage /> : <Navigate to="/login" />}
            />
            <Route path="/logout" element={isLoggedIn ? <LogoutPage /> : <Navigate to="/login" />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;
