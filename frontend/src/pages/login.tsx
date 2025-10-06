import { useState } from 'react';
import { loginUser } from '../api/authService';
import { useErrorHandler } from '../hooks/useErrorHandler';
import AuthForm from '../components/ui/AuthForm';
import Link from 'next/link';
import { withAuthRedirect } from '../components/hoc/withAuth';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const { errorMessage, handleBackendError, resetError } = useErrorHandler();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetError();
    try {
      await loginUser(formData);
    } catch (error: any) {
      handleBackendError(error);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-xl w-full space-y-5 p-10 bg-white dark:bg-gray-800 rounded-xl shadow-lg'>
        <div>
          <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100'>
            Sign in to your account
          </h2>
        </div>
        <AuthForm
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          errorMessage={errorMessage}
        >
          <div className='text-sm text-center mt-4'>
            <Link
              href='/register'
              className='font-medium text-blue-600 hover:text-blue-500'
            >
              Don't have an account? Sign up
            </Link>
          </div>
        </AuthForm>
      </div>
    </div>
  );
};

export default withAuthRedirect(Login);
