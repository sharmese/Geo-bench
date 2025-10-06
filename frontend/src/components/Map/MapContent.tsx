import { useEffect, useState, useCallback } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  CircleMarker,
} from 'react-leaflet';
import { Icon, LatLngBounds, LatLngTuple } from 'leaflet';
import { useAuth } from '../../context/authContext';
import {
  fetchNearbyMarkers,
  createMarker,
  deleteMarker,
} from '../../api/markerService';
import type { Marker as MarkerType } from '../../types/marker';
import 'leaflet/dist/leaflet.css';
import Link from 'next/link';

const defaultIcon = new Icon({
  iconUrl: '/marker-icon-red.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: '/marker-shadow.png',
  shadowSize: [41, 41],
});

interface MapEventsProps {
  isAddingMarker: boolean;
  setNewMarkerPosition: (position: LatLngTuple | null) => void;
  isAuthenticated: boolean;
  setPopupOpen: (open: boolean) => void;
}

const MapEvents: React.FC<MapEventsProps> = ({
  isAddingMarker,
  setNewMarkerPosition,
  isAuthenticated,
  setPopupOpen,
}) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    const handleClick = (e: L.LeafletMouseEvent) => {
      if (!isAuthenticated || !isAddingMarker) return;
      const { lat, lng } = e.latlng;
      setNewMarkerPosition([lat, lng]);
      setPopupOpen(true);
    };
    map.on('click', handleClick);
    return () => {
      map.off('click', handleClick);
    };
  }, [
    map,
    isAuthenticated,
    isAddingMarker,
    setNewMarkerPosition,
    setPopupOpen,
  ]);

  return null;
};

interface MapBoundsProps {
  onBoundsChange: (center: LatLngTuple, radius: number) => void;
}

const MapBoundsListener: React.FC<MapBoundsProps> = ({ onBoundsChange }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    const handleMoveEnd = () => {
      const bounds: LatLngBounds = map.getBounds();
      const centerLatLng = bounds.getCenter();
      const center: LatLngTuple = [centerLatLng.lat, centerLatLng.lng];
      const radius = centerLatLng.distanceTo(bounds.getNorthEast());
      onBoundsChange(center, radius);
    };
    map.on('moveend', handleMoveEnd);
    handleMoveEnd();
    return () => {
      map.off('moveend', handleMoveEnd);
    };
  }, [map, onBoundsChange]);

  return null;
};

interface MapContentProps {
  markers: MarkerType[];
  setMarkers: (markers: MarkerType[]) => void;
}

const MapContent: React.FC<MapContentProps> = ({ markers, setMarkers }) => {
  const [liveUserPosition, setLiveUserPosition] = useState<LatLngTuple | null>(
    null
  );
  const [locationError, setLocationError] = useState<string | null>(null);

  const [mapView, setMapView] = useState({
    center: [55.75, 37.61] as LatLngTuple,
    radius: 10000,
  });
  const [currentPosition, setCurrentPosition] = useState<LatLngTuple>([
    55.75, 37.61,
  ]);
  const [isAddingMarker, setIsAddingMarker] = useState(false);
  const [newMarkerForm, setNewMarkerForm] = useState({
    title: '',
    description: '',
  });
  const [newMarkerPosition, setNewMarkerPosition] =
    useState<LatLngTuple | null>(null);
  const { isAuthenticated, user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [newMarkerImage, setNewMarkerImage] = useState<File | null>(null);

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
    [setMarkers] 
  );

  useEffect(() => {
    const initializeMap = async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const newPos: LatLngTuple = [
              position.coords.latitude,
              position.coords.longitude,
            ];
            setCurrentPosition(newPos);
            setIsLoading(false);
          },
          () => {
            setIsLoading(false);
          }
        );
      } else {
        setIsLoading(false);
      }
    };
    initializeMap();
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }

    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    };

    const success = (pos: GeolocationPosition) => {
      const { latitude, longitude } = pos.coords;
      setLiveUserPosition([latitude, longitude]);
      setLocationError(null);
    };

    const error = (err: GeolocationPositionError) => {
      setLocationError(err.message);
    };

    const watchId = navigator.geolocation.watchPosition(
      success,
      error,
      options
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []); 

  const handleAddMarker = async () => {
    if (!newMarkerPosition || !newMarkerForm.title.trim()) {
      alert('Please provide a title and select an image.');
      return;
    }

    const formData = new FormData();
    formData.append('title', newMarkerForm.title.trim());
    formData.append('description', newMarkerForm.description.trim());
    formData.append('lat', newMarkerPosition[0].toString());
    formData.append('lng', newMarkerPosition[1].toString());
    if (newMarkerImage) {
      formData.append('image', newMarkerImage);
    }

    try {
      await createMarker(formData);
      const nearby = await fetchNearbyMarkers(
        currentPosition[0],
        currentPosition[1],
        5000
      );
      setMarkers(nearby); 

      setNewMarkerPosition(null);
      setNewMarkerForm({ title: '', description: '' });
      setNewMarkerImage(null);
      setIsAddingMarker(false);
    } catch (error) {
      console.error('Error creating marker:', error);
    }
  };

  const handleDeleteMarker = async (markerId: number) => {
    if (!window.confirm('Are you sure you want to delete this marker?')) return;

    try {
      await deleteMarker(markerId);
      const nearby = await fetchNearbyMarkers(
        currentPosition[0],
        currentPosition[1],
        5000
      );
      setMarkers(nearby); 
    } catch (error) {
      console.error('Error deleting marker:', error);
    }
  };

  if (isLoading) {
    return (
      <div className='h-[70vh] w-full flex flex-col items-center justify-center bg-gray-100 rounded-lg'>
        <div className='animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mb-4'></div>
        <p className='text-gray-600'>
          Finding your location and loading map...
        </p>
      </div>
    );
  }

  return (
    <div className='relative h-[70vh] w-full rounded-lg overflow-hidden shadow-lg'>
      <MapContainer
        center={liveUserPosition || mapView.center}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapBoundsListener onBoundsChange={handleBoundsChange} />

        {liveUserPosition && (
          <CircleMarker
            center={liveUserPosition}
            pathOptions={{ color: 'blue', fillColor: 'blue', fillOpacity: 0.5 }}
            radius={8}
          >
            <Popup>You are here</Popup>
          </CircleMarker>
        )}

        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={[
              marker.location.coordinates[1],
              marker.location.coordinates[0],
            ]}
            icon={defaultIcon}
          >
            <Popup>
              <div className='p-1 max-w-xs'>
                <Link href={`/marker/${marker.id}`}>
                  {marker.image_url && (
                    <img
                      src={marker.image_url}
                      alt={marker.title}
                      className='w-full h-auto rounded-md mb-2'
                    />
                  )}
                  <h3 className='font-bold text-lg mb-1'>{marker.title}</h3>
                  <p className='text-gray-700'>{marker.description}</p>
                </Link>
                {isAuthenticated && user?.id === marker.user_id && (
                  <button
                    onClick={() => handleDeleteMarker(marker.id)}
                    className='mt-2 text-red-600 text-xs font-semibold hover:text-red-800 transition-colors'
                  >
                    Delete Marker
                  </button>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
        {newMarkerPosition && (
          <Marker position={newMarkerPosition} icon={defaultIcon}>
            <Popup
              closeOnClick={false}
              closeOnEscapeKey={false}
              closeButton={false}
              {...(isPopupOpen ? { autoPan: true } : {})}
              eventHandlers={{
                remove: () => {
                  setNewMarkerPosition(null);
                  setNewMarkerForm({ title: '', description: '' });
                  setIsAddingMarker(false);
                  setIsPopupOpen(false);
                },
              }}
            >
              <div className='p-1 w-48'>
                <h3 className='font-bold mb-2 text-center'>Add a new bench</h3>
                <input
                  autoFocus
                  type='text'
                  value={newMarkerForm.title}
                  onChange={(e) =>
                    setNewMarkerForm((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  placeholder='Title'
                  className='w-full mb-2 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500'
                />
                <textarea
                  value={newMarkerForm.description}
                  onChange={(e) =>
                    setNewMarkerForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder='Description'
                  className='w-full mb-2 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500'
                  rows={2}
                />

                <input
                  type='file'
                  accept='image/*'
                  capture='environment'
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setNewMarkerImage(e.target.files[0]);
                    }
                  }}
                  className='w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 dark:file:bg-blue-900 dark:file:text-blue-300 file:text-blue-700 hover:file:bg-blue-100 mt-2'
                />

                <div className='flex gap-2 mt-4'>
                  <button
                    onClick={handleAddMarker}
                    className='flex-1 bg-blue-600 text-white py-2 px-2 rounded-md hover:bg-blue-700 text-sm font-semibold'
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setNewMarkerPosition(null);
                      setNewMarkerForm({ title: '', description: '' });
                      setNewMarkerImage(null); 
                      setIsAddingMarker(false);
                      setIsPopupOpen(false);
                    }}
                    className='flex-1 bg-gray-200 text-gray-800 py-2 px-2 rounded-md hover:bg-gray-300 text-sm font-semibold'
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        )}
        <MapEvents
          isAddingMarker={isAddingMarker}
          setNewMarkerPosition={setNewMarkerPosition}
          isAuthenticated={isAuthenticated}
          setPopupOpen={setIsPopupOpen}
        />
      </MapContainer>

      {isAuthenticated && (
        <button
          onClick={() => {
            setIsAddingMarker(!isAddingMarker);
            if (!isAddingMarker) {
              setNewMarkerPosition(null);
              setNewMarkerForm({ title: '', description: '' });
              setNewMarkerImage(null); 
              setIsPopupOpen(false);
            }
          }}
          className='absolute top-4 right-4 z-[1000] bg-white px-4 py-2 rounded-lg shadow-md text-gray-800 font-semibold hover:bg-gray-50 transition-colors border'
        >
          {isAddingMarker ? 'Cancel' : 'Add Bench'}
        </button>
      )}
    </div>
  );
};

export default MapContent;
