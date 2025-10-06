import React, { useState } from 'react';

const AuthForm: React.FC<{
  formData: { [key: string]: string };
  errors?: { [key: string]: string };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  errorMessage?: string;
  children?: React.ReactNode;
}> = ({
  formData,
  errors = {},
  handleChange,
  handleSubmit,
  errorMessage,
  children,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form
      onSubmit={handleSubmit}
      className='max-w-md mx-auto bg-white dark:bg-gray-800 p-8 rounded space-y-6'
    >
      {Object.keys(formData).map((key) => (
        <div key={key} className='flex flex-col space-y-1'>
          <label
            htmlFor={key}
            className='font-medium text-gray-700 dark:text-gray-300'
          >
            {key.charAt(0).toUpperCase() + key.slice(1)}:
          </label>
          <div className='relative'>
            <input
              type={key === 'password' && !showPassword ? 'password' : 'text'}
              id={key}
              name={key}
              value={formData[key]}
              onChange={handleChange}
              required
              className='w-full border dark:text-gray-900 border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10'
            />
            {key === 'password' && (
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700'
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='w-5 h-5'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.243 4.243L6.228 6.228'
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='w-5 h-5'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.432 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z'
                    />
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                    />
                  </svg>
                )}
              </button>
            )}
          </div>
          {errors[key] && (
            <div className='text-red-500 text-sm'>{errors[key]}</div>
          )}
        </div>
      ))}
      {errorMessage && (
        <div className='text-red-600 text-center'>{errorMessage}</div>
      )}
      <button
        type='submit'
        className='w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition'
      >
        Submit
      </button>
      <div className='text-center'>{children}</div>
    </form>
  );
};

export default AuthForm;
