import { useState, useEffect } from 'react';
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

  const fetchDashboard = async () => {
    try {
      const response = await fetch('https://gym-management-system-xvbr.onrender.com/api/admin-dashboard', {
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
  };

  useEffect(() => {
    fetchDashboard();
  }, [navigate]);

  const handleSubscriptionSubmit = async (e) => {
    e.preventDefault();
    const durationMonths = parseInt(newSubscription.duration_months, 10);
    if (isNaN(durationMonths) || durationMonths < 1 || durationMonths > 60) {
      toast.error('Duration must be between 1 and 60 months');
      return;
    }
    const price = parseFloat(newSubscription.price);
    if (isNaN(price) || price <= 0) {
      toast.error('Price must be a positive number');
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/api/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ ...newSubscription, duration_months: durationMonths, price }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success('Subscription created!');
        setNewSubscription({ plan_name: '', price: '', duration_months: '', description: '' });
        fetchDashboard();
      } else {
        toast.error(data.error || 'Failed to create subscription');
      }
    } catch (error) {
      toast.error('Network error!');
      console.error('Fetch error:', error);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(newUser),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success('User created!');
        setNewUser({ username: '', email: '', password: '', role: 'user' });
        fetchDashboard();
      } else {
        toast.error(data.error || 'Failed to create user');
      }
    } catch (error) {
      toast.error('Network error!');
      console.error('Fetch error:', error);
    }
  };

  const handleCreateTrainer = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/trainers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ ...newTrainer, role: 'trainer' }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success('Trainer created!');
        setNewTrainer({ username: '', email: '', password: '' });
        fetchDashboard();
      } else {
        toast.error(data.error || 'Failed to create trainer');
      }
    } catch (error) {
      toast.error('Network error!');
      console.error('Fetch error:', error);
    }
  };

  const handleEditUser = (user) => {
    console.log('Editing user:', user); // Debug log
    setEditingUser({ id: user.id, username: user.username, email: user.email, role: user.role, password: '' });
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    console.log('Updating user with payload:', editingUser); // Debug log
    try {
      const payload = {
        id: editingUser.id,
        username: editingUser.username,
        email: editingUser.email,
        role: editingUser.role,
      };
      if (editingUser.password) {
        payload.password = editingUser.password;
      }
      const response = await fetch('http://localhost:5000/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success('User updated!');
        setEditingUser(null);
        fetchDashboard();
      } else {
        toast.error(data.error || 'Failed to update user');
        console.error('Update user error:', data);
      }
    } catch (error) {
      toast.error('Network error!');
      console.error('Fetch error:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await fetch('http://localhost:5000/api/users', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
          body: JSON.stringify({ id: userId }),
        });
        const data = await response.json();
        if (response.ok) {
          toast.success('User deleted!');
          fetchDashboard();
        } else {
          toast.error(data.error || 'Failed to delete user');
        }
      } catch (error) {
        toast.error('Network error!');
        console.error('Fetch error:', error);
      }
    }
  };

  const handleEditTrainer = (trainer) => {
    console.log('Editing trainer:', trainer); // Debug log
    setEditingTrainer({ id: trainer.id, username: trainer.username, email: trainer.email, password: '' });
  };

  const handleUpdateTrainer = async (e) => {
    e.preventDefault();
    console.log('Updating trainer with payload:', editingTrainer); // Debug log
    try {
      const payload = {
        id: editingTrainer.id,
        username: editingTrainer.username,
        email: editingTrainer.email,
      };
      if (editingTrainer.password) {
        payload.password = editingTrainer.password;
      }
      const response = await fetch('http://localhost:5000/api/trainers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success('Trainer updated!');
        setEditingTrainer(null);
        fetchDashboard();
      } else {
        toast.error(data.error || 'Failed to update trainer');
        console.error('Update trainer error:', data);
      }
    } catch (error) {
      toast.error('Network error!');
      console.error('Fetch error:', error);
    }
  };

  const handleDeleteTrainer = async (trainerId) => {
    if (window.confirm('Are you sure you want to delete this trainer?')) {
      try {
        const response = await fetch('http://localhost:5000/api/trainers', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
          body: JSON.stringify({ id: trainerId }),
        });
        const data = await response.json();
        if (response.ok) {
          toast.success('Trainer deleted!');
          fetchDashboard();
        } else {
          toast.error(data.error || 'Failed to delete trainer');
        }
      } catch (error) {
        toast.error('Network error!');
        console.error('Fetch error:', error);
      }
    }
  };

  const handleAssignTrainer = async (e) => {
    e.preventDefault();
    if (!assignTrainer.user_id || !assignTrainer.trainer_id) {
      toast.error('Please select both a user and a trainer');
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/api/assign-trainer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(assignTrainer),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success('Trainer assigned successfully!');
        setAssignTrainer({ user_id: '', trainer_id: '' });
        fetchDashboard();
      } else {
        toast.error(data.error || 'Failed to assign trainer');
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
        Welcome, {dashboardData.user.username} (Admin)
      </h1>
      <div className="bg-white p-6 rounded-lg shadow-xl mb-6">
        <h2 className="text-xl font-semibold mb-4">Create Subscription</h2>
        <form onSubmit={handleSubscriptionSubmit} className="space-y-4">
          <input
            type="text"
            value={newSubscription.plan_name}
            onChange={(e) => setNewSubscription({ ...newSubscription, plan_name: e.target.value })}
            placeholder="Plan Name"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-gymBlue"
            required
          />
          <input
            type="number"
            step="0.01"
            value={newSubscription.price}
            onChange={(e) => setNewSubscription({ ...newSubscription, price: e.target.value })}
            placeholder="Price"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-gymBlue"
            required
            min="0.01"
          />
          <input
            type="number"
            value={newSubscription.duration_months}
            onChange={(e) => setNewSubscription({ ...newSubscription, duration_months: e.target.value })}
            placeholder="Duration (months)"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-gymBlue"
            required
            min="1"
            max="60"
          />
          <input
            type="text"
            value={newSubscription.description}
            onChange={(e) => setNewSubscription({ ...newSubscription, description: e.target.value })}
            placeholder="Description (optional)"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-gymBlue"
          />
          <button type="submit" className="w-full bg-gymGreen text-white p-2 rounded hover:bg-green-700 transition">
            Create Subscription
          </button>
        </form>
        <h2 className="text-xl font-semibold mt-6 mb-4">Create User</h2>
        <form onSubmit={handleCreateUser} className="space-y-4">
          <input
            type="text"
            value={newUser.username}
            onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
            placeholder="Username"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-gymBlue"
            required
          />
          <input
            type="email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            placeholder="Email"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-gymBlue"
            required
          />
          <input
            type="password"
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            placeholder="Password"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-gymBlue"
            required
          />
          <select
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-gymBlue"
          >
            <option value="user">User</option>
            <option value="trainer">Trainer</option>
            <option value="admin">Admin</option>
          </select>
          <button type="submit" className="w-full bg-gymGreen text-white p-2 rounded hover:bg-green-700 transition">
            Create User
          </button>
        </form>
        <h2 className="text-xl font-semibold mt-6 mb-4">Create Trainer</h2>
        <form onSubmit={handleCreateTrainer} className="space-y-4">
          <input
            type="text"
            value={newTrainer.username}
            onChange={(e) => setNewTrainer({ ...newTrainer, username: e.target.value })}
            placeholder="Username"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-gymBlue"
            required
          />
          <input
            type="email"
            value={newTrainer.email}
            onChange={(e) => setNewTrainer({ ...newTrainer, email: e.target.value })}
            placeholder="Email"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-gymBlue"
            required
          />
          <input
            type="password"
            value={newTrainer.password}
            onChange={(e) => setNewTrainer({ ...newTrainer, password: e.target.value })}
            placeholder="Password"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-gymBlue"
            required
          />
          <button type="submit" className="w-full bg-gymGreen text-white p-2 rounded hover:bg-green-700 transition">
            Create Trainer
          </button>
        </form>
        <h2 className="text-xl font-semibold mt-6 mb-4">Assign Trainer to User</h2>
        <form onSubmit={handleAssignTrainer} className="space-y-4">
          <select
            value={assignTrainer.user_id}
            onChange={(e) => setAssignTrainer({ ...assignTrainer, user_id: e.target.value })}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-gymBlue"
          >
            <option value="">Select User</option>
            {dashboardData.users.filter(u => u.role === 'user').map(user => (
              <option key={user.id} value={user.id}>{user.username}</option>
            ))}
          </select>
          <select
            value={assignTrainer.trainer_id}
            onChange={(e) => setAssignTrainer({ ...assignTrainer, trainer_id: e.target.value })}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-gymBlue"
          >
            <option value="">Select Trainer</option>
            {dashboardData.trainers.map(trainer => (
              <option key={trainer.id} value={trainer.id}>{trainer.username}</option>
            ))}
          </select>
          <button type="submit" className="w-full bg-gymGreen text-white p-2 rounded hover:bg-green-700 transition">
            Assign Trainer
          </button>
        </form>
        <h2 className="text-xl font-semibold mt-6 mb-4">Users</h2>
        <div className="space-y-2">
          {dashboardData.users.map((user) => (
            <div key={user.id} className="p-2 border rounded flex justify-between items-center">
              {user.username} ({user.role})
              <div className="space-x-2">
                <button onClick={() => handleEditUser(user)} className="text-blue-500 hover:underline">Edit</button>
                <button onClick={() => handleDeleteUser(user.id)} className="text-red-500 hover:underline">Delete</button>
              </div>
            </div>
          ))}
        </div>
        {editingUser && (
          <div className="mt-4 p-4 border rounded">
            <h3 className="text-lg font-semibold mb-2">Edit User</h3>
            <form onSubmit={handleUpdateUser} className="space-y-4">
              <input
                type="text"
                value={editingUser.username}
                onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                placeholder="Username"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-gymBlue"
                required
              />
              <input
                type="email"
                value={editingUser.email}
                onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                placeholder="Email"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-gymBlue"
                required
              />
              <select
                value={editingUser.role}
                onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-gymBlue"
              >
                <option value="user">User</option>
                <option value="trainer">Trainer</option>
                <option value="admin">Admin</option>
              </select>
              <input
                type="password"
                value={editingUser.password}
                onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
                placeholder="New Password (optional)"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-gymBlue"
              />
              <div className="flex space-x-2">
                <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700 transition">
                  Update User
                </button>
                <button type="button" onClick={() => setEditingUser(null)} className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600 transition">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
        <h2 className="text-xl font-semibold mt-6 mb-4">Trainers</h2>
        <div className="space-y-2">
          {dashboardData.trainers.map((trainer) => (
            <div key={trainer.id} className="p-2 border rounded flex justify-between items-center">
              {trainer.username}
              <div className="space-x-2">
                <button onClick={() => handleEditTrainer(trainer)} className="text-blue-500 hover:underline">Edit</button>
                <button onClick={() => handleDeleteTrainer(trainer.id)} className="text-red-500 hover:underline">Delete</button>
              </div>
            </div>
          ))}
        </div>
        {editingTrainer && (
          <div className="mt-4 p-4 border rounded">
            <h3 className="text-lg font-semibold mb-2">Edit Trainer</h3>
            <form onSubmit={handleUpdateTrainer} className="space-y-4">
              <input
                type="text"
                value={editingTrainer.username}
                onChange={(e) => setEditingTrainer({ ...editingTrainer, username: e.target.value })}
                placeholder="Username"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-gymBlue"
                required
              />
              <input
                type="email"
                value={editingTrainer.email}
                onChange={(e) => setEditingTrainer({ ...editingTrainer, email: e.target.value })}
                placeholder="Email"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-gymBlue"
                required
              />
              <input
                type="password"
                value={editingTrainer.password}
                onChange={(e) => setEditingTrainer({ ...editingTrainer, password: e.target.value })}
                placeholder="New Password (optional)"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-gymBlue"
              />
              <div className="flex space-x-2">
                <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700 transition">
                  Update Trainer
                </button>
                <button type="button" onClick={() => setEditingTrainer(null)} className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600 transition">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
        <h2 className="text-xl font-semibold mt-6 mb-4">Stats</h2>
        <p>User Count: {dashboardData.stats.user_count}</p>
        <p>Trainer Count: {dashboardData.stats.trainer_count}</p>
        <p>Subscription Count: {dashboardData.stats.subscription_count}</p>
      </div>
      <Toaster position="top-right" />
    </div>
  );
}

export default AdminDashboard;