import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Toaster, toast } from 'react-hot-toast';

function Login() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-gymBlue mb-6">Login</h2>
        <Formik
          initialValues={{ username: '', password: '' }}
          validationSchema={Yup.object({
            username: Yup.string().required('Required'),
            password: Yup.string().min(6, 'Password must be at least 6 characters').required('Required'),
          })}
          onSubmit={(values, { setSubmitting }) => {
            console.log('Submitting login with values:', values);
            fetch('https://gym-management-system-xvbr.onrender.com/api/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(values),
            })
              .then((res) => {
                console.log('Response status:', res.status);
                return res.json();
              })
              .then((data) => {
                console.log('Response data:', data);
                if (data.access_token) {
                  localStorage.setItem('token', data.access_token);
                  localStorage.setItem('role', data.role);
                  toast.success('Login successful!');
                  navigate(data.role === 'admin' ? '/admin-dashboard' : data.role === 'trainer' ? '/trainer-dashboard' : '/dashboard');
                } else {
                  toast.error(data.error || 'Login failed!');
                }
                setSubmitting(false);
              })
              .catch((error) => {
                console.error('Fetch error:', error);
                toast.error('Network error!');
                setSubmitting(false);
              });
          }}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <div>
                <Field
                  name="username"
                  type="text"
                  autoComplete="username"
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-gymBlue"
                  placeholder="Username"
                />
                <ErrorMessage name="username" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              <div>
                <Field
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-gymBlue"
                  placeholder="Password"
                />
                <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gymGreen text-white p-2 rounded hover:bg-green-700 transition disabled:opacity-50"
              >
                {isSubmitting ? 'Logging in...' : 'Login'}
              </button>
            </Form>
          )}
        </Formik>
        <Toaster position="top-right" />
      </div>
    </div>
  );
}

export default Login;