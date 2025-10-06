import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getMarker } from '../../api/markerService';
import { Marker as MarkerType } from '../../types/marker';
import ProductCard from '../../components/ui/ProductCard';

const MarkerDetailPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  const [marker, setMarker] = useState<MarkerType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (router.isReady && id) {
      const markerId = Number(id);
      if (isNaN(markerId)) {
        setError('Invalid marker ID.');
        setLoading(false);
        return;
      }

      const fetchMarker = async (markerId: number) => {
        try {
          setLoading(true);
          const data = await getMarker(markerId);
          setMarker(data);
        } catch (err) {
          setError('Failed to load marker data.');
        } finally {
          setLoading(false);
        }
      };

      fetchMarker(markerId);
    }
  }, [router.isReady, id]);

  if (loading) {
    return <div className='container mx-auto p-6'>Loading...</div>;
  }

  if (error) {
    return <div className='container mx-auto p-6 text-red-500'>{error}</div>;
  }

  if (!marker) {
    return <div className='container mx-auto p-6'>Marker not found.</div>;
  }

  return (
    <div className='container mx-auto p-6'>
      <h1 className='text-3xl font-bold mb-6'>Marker Details</h1>
      <ProductCard
        username={marker.username}
        title={marker.title}
        description={marker.description}
        location={marker.location}
        imageUrl={marker.image_url}
      />
    </div>
  );
};

export default MarkerDetailPage;
