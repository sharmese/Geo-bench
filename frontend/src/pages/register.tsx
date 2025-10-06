import React, { useState } from 'react';
import { registerUser } from '../api/authService';
import { useErrorHandler } from '../hooks/useErrorHandler';
import AuthForm from '../components/ui/AuthForm';
import Link from 'next/link';
import { withAuthRedirect } from '../components/hoc/withAuth';

const emailRegex =
  /^[A-Za-z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com|mail\.ru|icloud\.com|hotmail\.com)$/;
const passwordRegex = /^(?=.*[A-Z])(?=.*\d).+$/;
const usernameRegex = /^[A-Za-z0-9_]{3,}$/;

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
  });
  const validate = () => {
    let valid = true;
    let newErrors = { username: '', email: '', password: '' };

    if (!usernameRegex.test(formData.username)) {
      newErrors.username =
        'Username must be at least 3 characters and contain only letters, numbers, or underscores.';
      valid = false;
    }
    if (!emailRegex.test(formData.email)) {
      newErrors.email =
        'Email must be valid and use a supported service (gmail, yahoo, outlook, mail.ru, icloud, hotmail).';
      valid = false;
    }
    if (!passwordRegex.test(formData.password)) {
      newErrors.password =
        'Password must contain at least one uppercase letter and one number.';
      valid = false;
    }
    setErrors(newErrors);
    return valid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrors({ ...errors, [e.target.name]: '' });
  };
  const { errorMessage, handleBackendError, resetError } = useErrorHandler();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    resetError();
    setErrors({ username: '', email: '', password: '' });

    if (validate()) {
      try {
        await registerUser(formData);
      } catch (error: any) {
        handleBackendError(error);
      }
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-xl w-full space-y-5 p-10 bg-white dark:bg-gray-800 rounded-xl shadow-lg'>
        <div>
          <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100'>
            Create a new account
          </h2>
        </div>
        <AuthForm
          formData={formData}
          errors={errors}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          errorMessage={errorMessage}
        >
          <div className='text-sm text-center mt-4'>
            <Link
              href='/login'
              className='font-medium text-blue-600 hover:text-blue-500'
            >
              Already have an account? Login
            </Link>
          </div>
        </AuthForm>
      </div>
    </div>
  );
};

export default withAuthRedirect(Register);
