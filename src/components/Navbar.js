import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';

function Navbar() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [role, setRole] = useState(localStorage.getItem('role'));

  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem('token'));
    setRole(localStorage.getItem('role'));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsAuthenticated(false);
    setRole(null);
    toast.success('Logged out successfully!');
    navigate('/');
  };

  return (
    <nav className="bg-gymBlue text-white p-4 sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">GymApp</Link>
        <div className="space-x-4">
          <Link to="/" className="hover:text-gray-200 transition">Home</Link>
          {isAuthenticated ? (
            <>
              {role === 'user' && (
                <>
                  <Link to="/dashboard" className="hover:text-gray-200 transition">Dashboard</Link>
                  <Link to="/health-profile" className="hover:text-gray-200 transition">Health Profile</Link>
                  <Link to="/class-rsvp" className="hover:text-gray-200 transition">Classes</Link>
                </>
              )}
              {role === 'admin' && (
                <Link to="/admin-dashboard" className="hover:text-gray-200 transition">Admin Dashboard</Link>
              )}
              {role === 'trainer' && (
                <Link to="/trainer-dashboard" className="hover:text-gray-200 transition">Trainer Dashboard</Link>
              )}
              <button
                onClick={handleLogout}
                className="bg-gymGreen px-4 py-2 rounded hover:bg-green-700 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-gray-200 transition">Login</Link>
              <Link to="/register" className="hover:text-gray-200 transition">Register</Link>
            </>
          )}
        </div>
      </div>
      <Toaster position="top-right" />
    </nav>
  );
}

export default Navbar;