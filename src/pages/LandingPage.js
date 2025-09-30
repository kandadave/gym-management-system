import { useNavigate } from 'react-router-dom';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80)' }}>
      <div className="bg-black bg-opacity-50 p-8 rounded-lg text-center max-w-lg">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Welcome to FitZone</h1>
        <p className="text-lg md:text-xl text-gray-200 mb-6">Transform your body, unleash your potential. Join our gym community today!</p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <button
            onClick={() => navigate('/login')}
            className="bg-gymGreen text-white font-semibold py-3 px-6 rounded-lg hover:bg-green-700 transition duration-300"
          >
            Log In
          </button>
          <button
            onClick={() => navigate('/register')}
            className="bg-gymBlue text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;