import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuth } from '../../context/authContext';

export const withAuthRedirect = (WrappedComponent: React.ComponentType) => {
  const WithAuthRedirect: React.FC = (props) => {
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && isAuthenticated) {
        router.replace('/');
      }
    }, [isAuthenticated, loading, router]);

    if (loading || isAuthenticated) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };

  return WithAuthRedirect;
};
export const noAuthRedirect = (WrappedComponent: React.ComponentType) => {
  const NoAuthRedirect: React.FC = (props) => {
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !isAuthenticated) {
        router.replace('/');
      }
    }, [isAuthenticated, loading, router]);

    if (loading || !isAuthenticated) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };

  return NoAuthRedirect;
};
