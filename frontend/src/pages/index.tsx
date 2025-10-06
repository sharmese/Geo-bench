import React, { useCallback, useState } from 'react';
import type { NextPage } from 'next';
import MapComponent from '../components/Map/MapComponent';
import FeedCard from '../components/ui/FeedCard';
import { Marker as MarkerType } from '../types/marker';
import { useAuth } from '../context/authContext';
import Link from 'next/link';

const Home: NextPage = () => {
  const { loading } = useAuth();
  const [markers, setMarkers] = useState<MarkerType[]>([]);
  const [showCards, setShowCards] = useState(false);

  const toggleShowCards = useCallback(() => {
    setShowCards((prev) => !prev);
  }, []);
  if (loading) {
    return (
      <>
        <div className='flex items-center justify-center h-[70vh]'>
          <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500'></div>
        </div>
      </>
    );
  }

  return (
    <div className='space-y-8'>
      <div className='container mx-auto px-6'>
        <h2 className='text-2xl font-bold text-gray-800 dark:text-white mb-4'>
          Benches Nearby
        </h2>
        {markers.length > 0 ? (
          <div>
            <button
              className='bg-blue-500 text-white px-4 py-2 rounded'
              onClick={toggleShowCards}
            >
              Show nearby benches
            </button>
            {showCards &&
              markers.map((marker) => (
                <Link key={marker.id} href={`/marker/${marker.id}`}>
                  <FeedCard
                    username={marker.username}
                    markerId={marker.id}
                    title={marker.title}
                    description={marker.description}
                    location={marker.location}
                    imageUrl={marker.image_url}
                  />
                </Link>
              ))}
          </div>
        ) : (
          <p className='text-gray-500 dark:text-gray-400'>
            Move the map to find nearby benches.
          </p>
        )}
      </div>
      <div className={showCards ? 'hidden' : ''}>
        <MapComponent markers={markers} setMarkers={setMarkers} />
      </div>
    </div>
  );
};

export default Home;
