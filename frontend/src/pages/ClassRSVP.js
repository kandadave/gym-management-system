import { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function ClassRSVP() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch('https://gym-management-system-xvbr.onrender.com/api/classes', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const data = await response.json();
        if (response.ok) {
          // Initialize RSVP status for each class based on backend data
          setClasses(data.map(cls => ({ ...cls, rsvped: false })));
        } else {
          toast.error(data.error || 'Failed to fetch classes');
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

    fetchClasses();
  }, [navigate]);

  const handleRSVP = async (classId) => {
    try {
      const response = await fetch('http://localhost:5000/api/rsvp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ class_id: classId }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success('RSVP successful!');
        setClasses(classes.map(cls =>
          cls.id === classId ? { ...cls, rsvped: true, current_capacity: cls.current_capacity + 1 } : cls
        ));
      } else {
        toast.error(data.error || 'Failed to RSVP');
      }
    } catch (error) {
      toast.error('Network error!');
      console.error('Fetch error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-lg font-semibold text-gymBlue">Loading classes...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gymBlue mb-6">Class RSVP</h1>
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl mx-auto">
        <h2 className="text-xl font-semibold text-gymBlue mb-4">Available Classes</h2>
        {classes.length === 0 ? (
          <p className="text-gray-600">No classes available at the moment.</p>
        ) : (
          <ul className="space-y-4">
            {classes.map((cls) => (
              <li
                key={cls.id}
                className="border-b pb-4 flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold text-lg">{cls.name}</p>
                  <p className="text-gray-600">Date/Time: {new Date(cls.date_time).toLocaleString()}</p>
                  <p className="text-gray-600">Description: {cls.description || 'No description provided'}</p>
                  <p className="text-gray-600">
                    Capacity: {cls.current_capacity}/{cls.max_capacity}
                  </p>
                </div>
                <button
                  onClick={() => handleRSVP(cls.id)}
                  disabled={cls.rsvped || cls.current_capacity >= cls.max_capacity}
                  className={`px-4 py-2 rounded transition font-semibold
                    ${cls.rsvped || cls.current_capacity >= cls.max_capacity
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-gymGreen text-white hover:bg-green-700'
                    }`}
                >
                  {cls.rsvped ? 'RSVPed' : cls.current_capacity >= cls.max_capacity ? 'Full' : 'RSVP'}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <Toaster position="top-right" />
    </div>
  );
}

export default ClassRSVP;