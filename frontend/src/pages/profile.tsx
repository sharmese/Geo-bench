import { useAuth } from '../context/authContext';
import { noAuthRedirect } from '../components/hoc/withAuth';

const Profile: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className='max-w-lg mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-8'>
      <h1 className='text-2xl font-bold text-gray-800 dark:text-gray-50 mb-6'>
        Profile
      </h1>
      {user ? (
        <div className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-500 dark:text-gray-400'>
              Username
            </label>
            <p className='mt-1 text-lg text-gray-900 dark:text-gray-200'>
              {user.username}
            </p>
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-500 dark:text-gray-400'>
              Email
            </label>
            <p className='mt-1 text-lg text-gray-900 dark:text-gray-200'>
              {user.email}
            </p>
          </div>
        </div>
      ) : (
        <p>Loading user information...</p>
      )}
    </div>
  );
};

export default noAuthRedirect(Profile);
