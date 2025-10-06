import apiClient from './axiosConfig';
import { AxiosResponse } from 'axios';
import { handleApiError } from '../components/utils/handleApiErrors';
interface UserCredentials {
  email: string;
  password: string;
}

interface UserData extends UserCredentials {
  username: string;
}

interface AuthUser {
  id: number;
  username: string;
  email: string;
}

interface LoginResponse {
  token: string;
  user: AuthUser;
  message: string;
}

export const loginUser = async (credentials: UserCredentials) => {
  try {
    const response = await apiClient.post('/auth/login', credentials);

    const accessToken = response.data.accessToken;

    if (accessToken) {
      localStorage.setItem('jwtToken', accessToken);
      window.location.href = '/profile';
    }
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const registerUser = async (
  userData: UserData
): Promise<LoginResponse> => {
  try {
    const response: AxiosResponse<LoginResponse> = await apiClient.post(
      '/auth/register',
      userData
    );

    window.location.href = '/login';

    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};
export const fetchProfile = async (): Promise<AuthUser> => {
  try {
    const response = await apiClient.get('/auth/profile');
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    await apiClient.post('/auth/logout');
    localStorage.removeItem('jwtToken');
  } catch (error) {
    console.error('Logout error:', error);
    localStorage.removeItem('jwtToken');
  }
};
