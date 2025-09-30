import { useState, useEffect, useCallback } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function UserDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [attendanceMarked, setAttendanceMarked] = useState(false);
  const navigate = useNavigate();

  const fetchDashboard = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please log in to access the dashboard');
      navigate('/login');
      return;
    }
    try {
      const response = await fetch('https://gym-management-system-xvbr.onrender.com/api/dashboard', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setDashboardData(data);
        const today = new Date().toISOString().split('T')[0];
        const isAttendanceMarked = data.attendance.some(att => att.date === today && att.attended);
        setAttendanceMarked(isAttendanceMarked);
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

  const handleRSVP = async (classId) => {
    try {
      const response = await fetch('https://gym-management-system-xvbr.onrender.com/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ class_id: classId }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(data.message);
        fetchDashboard();
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error('Network error!');
      console.error('Fetch error:', error);
    }
  };

  const handleMarkAttendance = async () => {
    try {
      const response = await fetch('https://gym-management-system-xvbr.onrender.com/api/attendance', {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(data.message);
        setAttendanceMarked(true);
        fetchDashboard();
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error('Network error!');
      console.error('Fetch error:', error);
    }
  };

  const handleRegisterSubscription = async (subId) => {
    try {
      const response = await fetch('https://gym-management-system-xvbr.onrender.com/api/user-subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ plan_id: subId }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success('Subscribed successfully!');
        fetchDashboard();
      } else {
        toast.error(data.error || 'Failed to subscribe');
      }
    } catch (error) {
      toast.error('Network error!');
      console.error('Fetch error:', error);
    }
  };

  const calculateDaysLeft = (endDate) => {
    if (!endDate) return 'N/A';
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 'Expired';
  };

  const hasActiveSubscription = () => {
    return dashboardData?.user_subscriptions.some(sub => new Date(sub.end_date) > new Date());
  };

  const getAvailableSubscriptions = () => {
    if (!dashboardData) return [];
    const subscribedPlanIds = dashboardData.user_subscriptions.map(sub => sub.plan_id);
    return dashboardData.subscriptions.filter(sub => !subscribedPlanIds.includes(sub.id));
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
        Welcome, {dashboardData.user.username} (User)
      </h1>
      <div className="bg-white p-6 rounded-lg shadow-xl">
        <h2 className="text-xl font-semibold mb-4">My Subscription</h2>
        {dashboardData.user_subscriptions.length > 0 ? (
          dashboardData.user_subscriptions.map((sub) => (
            <div key={sub.id} className="p-4 border rounded mb-2 bg-gray-50">
              <p className="font-semibold text-lg">{sub.name}</p>
              <p>Price: ${sub.price}</p>
              <p>Start Date: {new Date(sub.start_date).toLocaleDateString()}</p>
              <p>End Date: {sub.end_date ? new Date(sub.end_date).toLocaleDateString() : 'N/A'}</p>
              <p className="font-medium">Days Left: {calculateDaysLeft(sub.end_date)}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No active subscriptions.</p>
        )}
        <h2 className="text-xl font-semibold mt-6 mb-4">My Trainer</h2>
        {dashboardData.trainer_details ? (
          <div className="p-4 border rounded mb-6 bg-gray-50">
            <p className="font-semibold text-lg">Trainer: {dashboardData.trainer_details.username}</p>
            <p>Email: {dashboardData.trainer_details.email}</p>
            <p>Role: {dashboardData.trainer_details.role}</p>
          </div>
        ) : (
          <p className="text-gray-600">No trainer assigned.</p>
        )}
        {!hasActiveSubscription() && (
          <>
            <h2 className="text-xl font-semibold mt-6 mb-4">Available Subscriptions</h2>
            {getAvailableSubscriptions().length > 0 ? (
              <div className="space-y-2">
                {getAvailableSubscriptions().map((sub) => (
                  <div key={sub.id} className="p-2 border rounded flex justify-between items-center">
                    <span>{sub.name} (${sub.price}) - {Math.round(sub.duration_days / 30)} months</span>
                    <button
                      onClick={() => handleRegisterSubscription(sub.id)}
                      className="bg-gymGreen text-white p-1 rounded hover:bg-green-700 transition"
                    >
                      Register
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No available subscriptions.</p>
            )}
          </>
        )}
        <h2 className="text-xl font-semibold mt-6 mb-4">Available Classes</h2>
        <div className="space-y-2">
          {dashboardData.classes.map((cls) => (
            <div key={cls.id} className="p-2 border rounded flex justify-between items-center">
              {cls.name} ({new Date(cls.date_time).toLocaleString()})
              <button
                onClick={() => handleRSVP(cls.id)}
                disabled={dashboardData.rsvps.some((rsvp) => rsvp.class_id === cls.id)}
                className={`bg-gymGreen text-white p-1 rounded hover:bg-green-700 transition ${dashboardData.rsvps.some((rsvp) => rsvp.class_id === cls.id) ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {dashboardData.rsvps.some((rsvp) => rsvp.class_id === cls.id) ? 'RSVPed' : 'RSVP'}
              </button>
            </div>
          ))}
        </div>
        <h2 className="text-xl font-semibold mt-6 mb-4">Mark Attendance</h2>
        <button
          onClick={handleMarkAttendance}
          disabled={attendanceMarked}
          className="w-full bg-gymGreen text-white p-2 rounded hover:bg-green-700 transition disabled:opacity-50"
        >
          {attendanceMarked ? 'Attendance Marked' : 'Mark Attendance Today'}
        </button>
        <h2 className="text-xl font-semibold mt-6 mb-4">Attendance History</h2>
        <div className="space-y-2">
          {dashboardData.attendance.length > 0 ? (
            dashboardData.attendance.map((att) => (
              <div key={att.id} className="p-2 border rounded">
                {new Date(att.date).toLocaleString()} {att.attended ? '(Attended)' : '(Not Attended)'}
              </div>
            ))
          ) : (
            <p className="text-gray-600">No attendance records.</p>
          )}
        </div>
      </div>
      <Toaster position="top-right" />
    </div>
  );
}

export default UserDashboard;