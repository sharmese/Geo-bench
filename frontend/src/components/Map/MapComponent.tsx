import dynamic from 'next/dynamic';
import { Marker as MarkerType } from '../../types/marker';

interface MapComponentProps {
  markers: MarkerType[];
  setMarkers: (markers: MarkerType[]) => void;
}

const Map = dynamic(() => import('./MapContent'), {
  ssr: false,
  loading: () => (
    <div className='h-[70vh] w-full bg-gray-100 flex items-center justify-center'>
      Loading map...
    </div>
  ),
});

const MapComponent: React.FC<MapComponentProps> = ({ markers, setMarkers }) => {
  return <Map markers={markers} setMarkers={setMarkers} />;
};

export default MapComponent;
