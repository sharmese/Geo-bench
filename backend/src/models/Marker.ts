export interface PointGeometry {
  type: 'Point';
  coordinates: [number, number];
}

export interface Marker {
  id: number;
  user_id: number;
  title: string;
  description: string;
  location: PointGeometry;
  created_at: Date;
  username: string;
}

export interface NewMarker {
  title: string;
  description?: string;
  latitude: number;
  longitude: number;
  imageUrl?: string;
}
