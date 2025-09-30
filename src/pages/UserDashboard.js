import { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function UserDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [attendanceMarked, setAttendanceMarked] = useState(false);
  const navigate = useNavigate();

  const fetchDashboard = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/dashboard', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
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
  };

  useEffect(() => {
    fetchDashboard();
  }, [navigate]);

  // RSVP for a class
  const handleRSVP = async (classId) => {
    try {
      const response = await fetch('http://localhost:5000/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ class_id: classId }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(data.message);
        fetchDashboard();
      } else {
        toast.error(data.error || 'Failed to RSVP');
      }
    } catch (error) {
      toast.error('Network error!');
      console.error('Fetch error:', error);
    }
  };

  // Mark attendance
  const handleMarkAttendance = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/attendance', {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(data.message);
        setAttendanceMarked(true);
        fetchDashboard();
      } else {
        toast.error(data.error || 'Failed to mark attendance');
      }
    } catch (error) {
      toast.error('Network error!');
      console.error('Fetch error:', error);
    }
  };

  // Subscribe to a plan
  const handleRegisterSubscription = async (subId) => {
    try {
      const response = await fetch('http://localhost:5000/api/user-subscriptions', {
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

  // Helper functions
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

      {/* My Subscriptions */}
      <div className="bg-white p-6 rounded-lg shadow-xl mb-6">
        <h2 className="text-xl font-semibold mb-4">My Subscriptions</h2>
        {dashboardData.user_subscriptions.length > 0 ? (
          dashboardData.user_subscriptions.map(sub => (
            <div key={sub.id} className="p-4 border rounded mb-2 bg-gray-50">
              <p className="font-semibold">{sub.name}</p>
              <p>Price: ${sub.price}</p>
              <p>Start: {new Date(sub.start_date).toLocaleDateString()}</p>
              <p>End: {sub.end_date ? new Date(sub.end_date).toLocaleDateString() : 'N/A'}</p>
              <p>Days Left: {calculateDaysLeft(sub.end_date)}</p>
            </div>
          ))
        ) : (
          <p>No active subscriptions.</p>
        )}

        {/* Available Subscriptions */}
        {!hasActiveSubscription() && getAvailableSubscriptions().length > 0 && (
          <>
            <h3 className="text-lg font-semibold mt-6">Available Subscriptions</h3>
            {getAvailableSubscriptions().map(sub => (
              <div key={sub.id} className="p-2 border rounded flex justify-between items-center mb-2">
                <span>{sub.name} (${sub.price})</span>
                <button
                  onClick={() => handleRegisterSubscription(sub.id)}
                  className="bg-gymGreen text-white p-1 rounded hover:bg-green-700"
                >
                  Register
                </button>
              </div>
            ))}
          </>
        )}

        {/* My Trainer */}
        <h2 className="text-xl font-semibold mt-6 mb-4">My Trainer</h2>
        {dashboardData.trainer_details ? (
          <div className="p-4 border rounded mb-6 bg-gray-50">
            <p className="font-semibold">{dashboardData.trainer_details.username}</p>
            <p>Email: {dashboardData.trainer_details.email}</p>
            <p>Role: {dashboardData.trainer_details.role}</p>
          </div>
        ) : (
          <p>No trainer assigned.</p>
        )}

        {/* Available Classes */}
        <h2 className="text-xl font-semibold mt-6 mb-4">Available Classes</h2>
        {dashboardData.classes.length > 0 ? (
          dashboardData.classes.map(cls => (
            <div key={cls.id} className="p-2 border rounded flex justify-between items-center mb-2">
              <span>{cls.name} ({new Date(cls.date_time).toLocaleString()})</span>
              <button
                onClick={() => handleRSVP(cls.id)}
                disabled={dashboardData.rsvps.some(r => r.class_id === cls.id)}
                className={`bg-gymGreen text-white p-1 rounded hover:bg-green-700 transition ${dashboardData.rsvps.some(r => r.class_id === cls.id) ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {dashboardData.rsvps.some(r => r.class_id === cls.id) ? 'RSVPed' : 'RSVP'}
              </button>
            </div>
          ))
        ) : <p>No classes available.</p>}

        {/* Attendance */}
        <h2 className="text-xl font-semibold mt-6 mb-4">Mark Attendance</h2>
        <button
          onClick={handleMarkAttendance}
          disabled={attendanceMarked}
          className="w-full bg-gymGreen text-white p-2 rounded hover:bg-green-700 disabled:opacity-50"
        >
          {attendanceMarked ? 'Attendance Marked' : 'Mark Attendance Today'}
        </button>

        {/* Attendance History */}
        <h2 className="text-xl font-semibold mt-6 mb-4">Attendance History</h2>
        {dashboardData.attendance.length > 0 ? (
          dashboardData.attendance.map(att => (
            <div key={att.id} className="p-2 border rounded mb-2">
              {new Date(att.date).toLocaleString()} {att.attended ? '(Attended)' : '(Not Attended)'}
            </div>
          ))
        ) : <p>No attendance records.</p>}
      </div>

      <Toaster position="top-right" />
    </div>
  );
}

export default UserDashboard;
