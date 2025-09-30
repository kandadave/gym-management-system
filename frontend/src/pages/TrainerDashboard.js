import { useState, useEffect, useCallback } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function TrainerDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newClass, setNewClass] = useState({ name: '', date_time: '', max_capacity: 10 });
  const navigate = useNavigate();

  const fetchDashboard = useCallback(async () => {
    try {
      const response = await fetch('https://gym-management-system-xvbr.onrender.com/api/trainer-dashboard', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await response.json();
      if (response.ok) {
        setDashboardData(data);
      } else {
        toast.error(data.error || 'Failed to load dashboard');
        if (response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('role');
          navigate('/login');
        }
      }
    } catch (error) {
      toast.error('Network error!');
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const handleClassSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/classes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(newClass),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success('Class created!');
        setNewClass({ name: '', date_time: '', max_capacity: 10 });
        fetchDashboard();
      } else {
        toast.error(data.error || 'Failed to create class');
      }
    } catch (error) {
      toast.error('Network error!');
      console.error('Fetch error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-lg font-semibold">Loading...</p>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-lg text-red-500">Failed to load dashboard data</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gymBlue mb-6">
        Welcome, {dashboardData.user.username} (Trainer)
      </h1>
      <div className="bg-white p-6 rounded-lg shadow-xl mb-6">
        <h2 className="text-xl font-semibold mb-4">Create Class</h2>
        <form onSubmit={handleClassSubmit} className="space-y-4">
          <input
            type="text"
            value={newClass.name}
            onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
            placeholder="Class Name"
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="datetime-local"
            value={newClass.date_time}
            onChange={(e) => setNewClass({ ...newClass, date_time: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="number"
            value={newClass.max_capacity}
            onChange={(e) => setNewClass({ ...newClass, max_capacity: e.target.value })}
            placeholder="Max Capacity"
            className="w-full p-2 border rounded"
            min="1"
          />
          <button type="submit" className="w-full bg-gymGreen text-white p-2 rounded hover:bg-green-700">
            Create Class
          </button>
        </form>
        <h2 className="text-xl font-semibold mt-6 mb-4">Trained Users</h2>
        <div className="space-y-2">
          {dashboardData.trained_users.length > 0 ? (
            dashboardData.trained_users.map((user) => (
              <div key={user.id} className="p-2 border rounded">
                {user.username}
              </div>
            ))
          ) : (
            <p>No trainees assigned.</p>
          )}
        </div>
        <h2 className="text-xl font-semibold mt-6 mb-4">Class Stats</h2>
        <div className="space-y-2">
          {dashboardData.class_stats.length > 0 ? (
            dashboardData.class_stats.map((stat) => (
              <div key={stat.name} className="p-2 border rounded">
                {stat.name}: {stat.attendance_count} attendees
              </div>
            ))
          ) : (
            <p>No classes created.</p>
          )}
        </div>
      </div>
      <Toaster position="top-right" />
    </div>
  );
}

export default TrainerDashboard;