import apiClient from './axiosConfig';
import { Marker } from '../types/marker';

export const fetchNearbyMarkers = async (
  lat: number,
  lng: number,
  r: number
): Promise<Marker[]> => {
  try {
    const response = await apiClient.get('/markers/nearby', {
      params: {
        lat: lat,
        lng: lng,
        r: Math.min(r, r),
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching markers:', error);
    return [];
  }
};

export const createMarker = async (formData: FormData): Promise<Marker> => {
  const response = await apiClient.post('/markers', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
export const getMarker = async (markerId: number): Promise<Marker> => {
  const response = await apiClient.get(`/markers/${markerId}`);
  return response.data;
};
export const deleteMarker = async (markerId: number): Promise<void> => {
  await apiClient.delete(`/markers/${markerId}`);
};
