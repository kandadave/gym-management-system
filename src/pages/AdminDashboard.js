import { useState, useEffect, useCallback } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newSubscription, setNewSubscription] = useState({ plan_name: '', price: '', duration_months: '', description: '' });
  const [newUser, setNewUser] = useState({ username: '', email: '', password: '', role: 'user' });
  const [newTrainer, setNewTrainer] = useState({ username: '', email: '', password: '' });
  const [editingUser, setEditingUser] = useState(null);
  const [editingTrainer, setEditingTrainer] = useState(null);
  const [assignTrainer, setAssignTrainer] = useState({ user_id: '', trainer_id: '' });
  const navigate = useNavigate();

  const fetchDashboard = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin-dashboard', {
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

  
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* ...all existing JSX */}
      <Toaster position="top-right" />
    </div>
  );
}

export default AdminDashboard;
