export interface Location {
  type: 'Point';
  coordinates: [number, number];
}

export interface Marker {
  id: number;
  user_id: number;
  title: string;
  description: string;
  location: Location;
  image_url?: string;
  username: string;
}

export interface MarkerData {
  title: string;
  description: string;
  latitude: number;
  longitude: number;
}
