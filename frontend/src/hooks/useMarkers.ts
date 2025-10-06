import { useState, useCallback } from 'react';
import {
  fetchNearbyMarkers,
  createMarker,
  deleteMarker,
} from '../api/markerService';
import type { Marker as MarkerType } from '../types/marker';
import type { LatLngTuple } from 'leaflet';

export const useMarkers = (initialPosition: LatLngTuple) => {
  const [markers, setMarkers] = useState<MarkerType[]>([]);

  const handleBoundsChange = useCallback(
    async (center: LatLngTuple, radius: number) => {
      try {
        const nearby = await fetchNearbyMarkers(
          center[0],
          center[1],
          Math.round(radius)
        );
        setMarkers(nearby);
      } catch (error) {
        console.error('Error loading markers:', error);
      }
    },
    []
  );

  const addMarker = async (formData: FormData) => {
    try {
      await createMarker(formData);
      await handleBoundsChange(initialPosition, 5000);
    } catch (error) {
      console.error('Error creating marker:', error);
      throw error;
    }
  };

  const removeMarker = async (markerId: number) => {
    try {
      await deleteMarker(markerId);
      await handleBoundsChange(initialPosition, 5000);
    } catch (error) {
      console.error('Error deleting marker:', error);
      throw error;
    }
  };

  return {
    markers,
    handleBoundsChange,
    addMarker,
    removeMarker,
  };
};
