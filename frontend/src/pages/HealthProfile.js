import { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Toaster, toast } from 'react-hot-toast';

function HealthProfile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetch('https://gym-management-system-xvbr.onrender.com/api/health-profile', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          toast.error(data.error);
        } else {
          setProfile(data);
        }
      })
      .catch(() => toast.error('Failed to fetch profile!'));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gymBlue mb-6">Health Profile</h1>
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md mx-auto">
        <Formik
          initialValues={{
            height_cm: profile?.height_cm || '',
            weight_kg: profile?.weight_kg || '',
            goal: profile?.goal || '',
          }}
          enableReinitialize
          validationSchema={Yup.object({
            height_cm: Yup.number().min(100, 'Height must be at least 100 cm').required('Required'),
            weight_kg: Yup.number().min(30, 'Weight must be at least 30 kg').required('Required'),
            goal: Yup.string().required('Required'),
          })}
          onSubmit={(values, { setSubmitting }) => {
            fetch('http://localhost:5000/api/health-profile', {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
              body: JSON.stringify(values),
            })
              .then((res) => res.json())
              .then((data) => {
                if (data.error) {
                  toast.error(data.error);
                } else {
                  toast.success(`Profile updated! BMI: ${data.bmi.toFixed(2)}`);
                  setProfile(data);
                }
                setSubmitting(false);
              })
              .catch(() => {
                toast.error('Failed to update profile!');
                setSubmitting(false);
              });
          }}
        >
          {({ isSubmitting, values }) => (
            <Form className="space-y-4">
              <div>
                <Field
                  name="height_cm"
                  type="number"
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-gymBlue"
                  placeholder="Height (cm)"
                />
                <ErrorMessage name="height_cm" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              <div>
                <Field
                  name="weight_kg"
                  type="number"
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-gymBlue"
                  placeholder="Weight (kg)"
                />
                <ErrorMessage name="weight_kg" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              <div>
                <Field
                  name="goal"
                  type="text"
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-gymBlue"
                  placeholder="Fitness Goal"
                />
                <ErrorMessage name="goal" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              <div>
                <p className="text-gray-600">
                  BMI: {values.height_cm && values.weight_kg
                    ? (values.weight_kg / ((values.height_cm / 100) ** 2)).toFixed(2)
                    : 'N/A'}
                </p>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gymGreen text-white p-2 rounded hover:bg-green-700 transition disabled:opacity-50"
              >
                {isSubmitting ? 'Updating...' : 'Update Profile'}
              </button>
            </Form>
          )}
        </Formik>
        {profile && (
          <div className="mt-4">
            <p className="text-gray-600">Current BMI: {profile.bmi ? profile.bmi.toFixed(2) : 'N/A'}</p>
            <p className="text-gray-600">Goal: {profile.goal || 'None'}</p>
          </div>
        )}
        <Toaster position="top-right" />
      </div>
    </div>
  );
}

export default HealthProfile;