import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl text-center">
        <h1 className="text-4xl font-bold text-gymBlue mb-4">Gym Management System</h1>
        <p className="text-gray-600 mb-6">Join our gym, track your progress, and book classes!</p>
        <div className="space-x-4">
          <Link
            to="/login"
            className="bg-gymGreen text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-gymBlue text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;