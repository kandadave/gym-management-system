import { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';

function AttendanceCalendar() {
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    fetch('https://gym-management-system-xvbr.onrender.com/attendance', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          toast.error(data.error);
        } else {
          setAttendance(data);
        }
      })
      .catch(() => toast.error('Failed to fetch attendance!'));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gymBlue mb-4">Attendance Calendar</h2>
      <div className="grid grid-cols-7 gap-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center font-bold text-gray-600">{day}</div>
        ))}
        {Array(30).fill().map((_, i) => {
          const date = new Date(2025, 8, i + 1).toISOString().split('T')[0];
          const attended = attendance.find((a) => a.date === date);
          return (
            <div
              key={i}
              className={`p-2 text-center rounded ${
                attended ? 'bg-gymGreen text-white' : 'bg-gray-200'
              }`}
            >
              {i + 1}
            </div>
          );
        })}
      </div>
      <Toaster position="top-right" />
    </div>
  );
}

export default AttendanceCalendar;