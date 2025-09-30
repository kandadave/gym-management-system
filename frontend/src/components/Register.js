import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Toaster, toast } from 'react-hot-toast';

function Register() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-gymBlue mb-6">Register</h2>
        <Formik
          initialValues={{ username: '', email: '', password: '', role: 'user' }}
          validationSchema={Yup.object({
            username: Yup.string().required('Required'),
            email: Yup.string().email('Invalid email address').required('Required'),
            password: Yup.string().min(6, 'Password must be at least 6 characters').required('Required'),
            role: Yup.string().oneOf(['user', 'trainer', 'admin'], 'Invalid role').required('Required'),
          })}
          onSubmit={(values, { setSubmitting }) => {
            console.log('Submitting register with values:', values);
            fetch('https://gym-management-system-xvbr.onrender.com/api/register', {
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
                  toast.success('Registration successful!');
                  navigate(data.role === 'admin' ? '/admin-dashboard' : data.role === 'trainer' ? '/trainer-dashboard' : '/dashboard');
                } else {
                  toast.error(data.error || 'Registration failed!');
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
                  name="email"
                  type="email"
                  autoComplete="email"
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-gymBlue"
                  placeholder="Email"
                />
                <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              <div>
                <Field
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-gymBlue"
                  placeholder="Password"
                />
                <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              <div>
                <Field
                  as="select"
                  name="role"
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-gymBlue"
                >
                  <option value="user">User</option>
                  <option value="trainer">Trainer</option>
                  <option value="admin">Admin</option>
                </Field>
                <ErrorMessage name="role" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gymGreen text-white p-2 rounded hover:bg-green-700 transition disabled:opacity-50"
              >
                {isSubmitting ? 'Registering...' : 'Register'}
              </button>
            </Form>
          )}
        </Formik>
        <Toaster position="top-right" />
      </div>
    </div>
  );
}

export default Register;