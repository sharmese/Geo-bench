import { dbQuery } from '../db/query';
import { NewMarker, Marker } from '../models/Marker';

interface LocationSearch {
  latitude: number;
  longitude: number;
  radiusMeters: number;
}

interface CreateMarkerData {
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  imageUrl: string | null;
}

export const createMarker = async (
  userId: number,
  markerData: CreateMarkerData
): Promise<Marker> => {
  const { title, description, latitude, longitude, imageUrl } = markerData;

  const query = `
    INSERT INTO marker (user_id, title, description, location, image_url)
    VALUES ($1, $2, $3, ST_SetSRID(ST_MakePoint($4, $5), 4326), $6)
    RETURNING id, user_id, title, description, ST_X(location::geometry) as longitude, ST_Y(location::geometry) as latitude, image_url;
  `;

  const values = [userId, title, description, longitude, latitude, imageUrl];

  try {
    const result = await dbQuery(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('Error creating marker in service:', error);
    throw new Error('Database error while creating marker.');
  }
};

export async function findMarkersNearby(
  search: LocationSearch
): Promise<Marker[]> {
  const { latitude, longitude, radiusMeters } = search;

  const sql = `
    SELECT 
        m.id, 
        m.user_id, 
        u.username, -- Select the username
        m.title, 
        m.description, 
        m.created_at,
        m.image_url,
        ST_AsGeoJSON(m.location) as location,
        ST_Distance(
            m.location::geography,  
            ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography 
        ) AS distance_m
    FROM "marker" m -- Use alias 'm'
    JOIN "users" u ON m.user_id = u.id -- Join with users table
    WHERE ST_DWithin(
        m.location::geography,  
        ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography, 
        $3 
    )
    ORDER BY distance_m;
  `;

  const values = [longitude, latitude, radiusMeters];

  const result = await dbQuery(sql, values);

  return result.rows.map((row) => {
    const marker = row;
    marker.location = JSON.parse(marker.location);
    return marker as Marker & { distance_m: number };
  });
}
export async function findMarkersByUser(userId: number): Promise<Marker[]> {
  const sql = `
    SELECT 
        id, 
        user_id, 
        title, 
        description, 
        created_at, 
        ST_AsGeoJSON(location) as location_json 
    FROM "marker"
    WHERE user_id = $1
    ORDER BY created_at DESC;
  `;

  const result = await dbQuery(sql, [userId]);

  return result.rows.map((row) => {
    const locationJson = row.location_json;
    row.location = JSON.parse(locationJson);
    delete row.location_json;

    return row as Marker;
  });
}
export async function getMarkerById(markerId: number): Promise<Marker | null> {
  const sql = `
    SELECT 
        m.id, 
        m.user_id, 
        u.username, -- Select the username from the users table
        m.title, 
        m.description, 
        m.created_at,
        m.image_url,
        ST_AsGeoJSON(m.location) as location_json
    FROM "marker" m -- Use alias 'm'
    JOIN "users" u ON m.user_id = u.id -- Join with users table (aliased as 'u')
    WHERE m.id = $1;
  `;

  const result = await dbQuery(sql, [markerId]);

  if (!result.rows.length) {
    return null;
  }

  const marker = result.rows[0];

  marker.location = JSON.parse(marker.location_json);
  delete marker.location_json;

  return marker as Marker;
}
/**
 *
 * @param markerId
 * @returns {boolean}
 */
export async function deleteMarker(markerId: number): Promise<boolean> {
  const sql = 'DELETE FROM "marker" WHERE id = $1;';

  const result = await dbQuery(sql, [markerId]);

  return (result.rowCount ?? 0) > 0;
}
interface UpdateMarkerData {
  title?: string;
  description?: string;
  latitude?: number;
  longitude?: number;
}

export async function updateMarker(
  markerId: number,
  data: UpdateMarkerData
): Promise<Marker | null> {
  const updates: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  if (data.title !== undefined) {
    updates.push(`title = $${paramIndex++}`);
    values.push(data.title);
  }
  if (data.description !== undefined) {
    updates.push(`description = $${paramIndex++}`);
    values.push(data.description);
  }

  if (data.latitude !== undefined && data.longitude !== undefined) {
    updates.push(
      `location = ST_SetSRID(ST_MakePoint($${paramIndex++}, $${paramIndex++}), 4326)`
    );
    values.push(data.longitude, data.latitude);
  } else if (data.latitude !== undefined || data.longitude !== undefined) {
    console.warn('Marker update ignored partial coordinate update.');
  }

  if (updates.length === 0) {
    return null;
  }

  values.push(markerId);

  const sql = `
    UPDATE "marker"
    SET ${updates.join(', ')}
    WHERE id = $${paramIndex}
    RETURNING id, user_id, title, description, created_at, 
              ST_AsGeoJSON(location) as location_json;
  `;

  const result = await dbQuery(sql, values);

  if (!result.rows.length) {
    return null;
  }

  const updatedMarker = result.rows[0];
  updatedMarker.location = JSON.parse(updatedMarker.location_json);
  delete updatedMarker.location_json;

  return updatedMarker as Marker;
}
