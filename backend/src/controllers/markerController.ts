import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import * as markerService from '../services/markerService';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import crypto from 'crypto';

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});
export const addMarker = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.userId;
  const { title, description, lat, lng } = req.body;

  if (!userId || !title || !lat || !lng) {
    return res.status(400).send({
      message: 'Missing required fields: title, lat, lng.',
    });
  }

  let imageUrl: string | null = null;

  try {
    if (req.file) {
      const imageName =
        crypto.randomBytes(16).toString('hex') + req.file.originalname;

      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.R2_BUCKET_NAME,
          Key: imageName,
          Body: req.file.buffer,
          ContentType: req.file.mimetype,
        })
      );

      imageUrl = `${process.env.R2_PUBLIC_URL}/${imageName}`;
    }

    const newMarker = await markerService.createMarker(userId, {
      title,
      description: description || '',
      latitude: parseFloat(lat),
      longitude: parseFloat(lng),
      imageUrl: imageUrl,
    });

    res.status(201).json(newMarker);
  } catch (error) {
    console.error('Error creating marker:', error);
    res.status(500).send({ message: 'Could not create marker.' });
  }
};

export const getMarkersNearby = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const latitude = parseFloat(req.query.lat as string);
  const longitude = parseFloat(req.query.lng as string);
  const radiusMeters = parseInt(req.query.r as string) || 5000;

  if (isNaN(latitude) || isNaN(longitude) || radiusMeters < 1) {
    res.status(400).send({
      message:
        'Invalid search parameters. Requires valid lat, lng, and r (radius in meters).',
    });
    return;
  }

  try {
    const markers = await markerService.findMarkersNearby({
      latitude,
      longitude,
      radiusMeters,
    });

    res.json(markers);
  } catch (error) {
    console.error('Error fetching nearby markers:', error);
    res.status(500).send({ message: 'Could not fetch nearby markers.' });
    return;
  }
};
export const getUserMarkers = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const userId = req.userId;
  if (!userId) {
    res.status(401).send({ message: 'Unauthorized' });
    return;
  }
  try {
    const markers = await markerService.findMarkersByUser(userId);
    res.json(markers);
  } catch (error) {
    console.error('Error fetching user markers:', error);
    res.status(500).send({ message: 'Could not fetch user markers.' });
    return;
  }
};
export const getMarker = async (req: AuthenticatedRequest, res: Response) => {
  const markerId = parseInt(req.params.id);

  if (isNaN(markerId)) {
    return res.status(400).send({ message: 'Invalid marker ID format.' });
  }
  try {
    const marker = await markerService.getMarkerById(markerId);

    if (!marker) {
      return res.status(404).send({ message: 'Marker not found.' });
    }
    res.json(marker);
  } catch (error) {
    console.error('Error fetching marker:', error);
    res.status(500).send({ message: 'Could not fetch marker.' });
  }
};
export const deleteMarker = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const userId = req.userId;
  const markerId = parseInt(req.params.id);
  if (isNaN(markerId)) {
    return res.status(400).send({ message: 'Invalid marker ID format.' });
  }
  try {
    const marker = await markerService.getMarkerById(markerId);

    if (!marker) {
      return res.status(404).send({ message: 'Marker not found.' });
    }

    if (marker.user_id !== userId) {
      return res
        .status(403)
        .send({ message: 'Forbidden. You do not own this marker.' });
    }
    const success = await markerService.deleteMarker(markerId);
    if (success) {
      res.status(204).send();
    } else {
      res.status(500).send({ message: 'Could not delete marker.' });
    }
  } catch (error) {
    console.error('Error deleting marker:', error);
    res.status(500).send({ message: 'Could not delete marker.' });
  }
};
export const updateMarker = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const userId = req.userId;
  const markerId = parseInt(req.params.id);
  const { title, description, latitude, longitude } = req.body;
  if (isNaN(markerId)) {
    return res.status(400).send({ message: 'Invalid marker ID format.' });
  }
  try {
    const marker = await markerService.getMarkerById(markerId);
    if (!marker) {
      return res.status(404).send({ message: 'Marker not found.' });
    }
    if (marker.user_id !== userId) {
      return res
        .status(403)
        .send({ message: 'Forbidden. You do not own this marker.' });
    }

    const updatedMarker = await markerService.updateMarker(markerId, {
      title,
      description,
      latitude,
      longitude,
    });

    if (updatedMarker) {
      res.json(updatedMarker);
    } else {
      res.status(400).send({ message: 'No valid fields provided for update.' });
    }
  } catch (error) {
    console.error('Error updating marker:', error);
    res.status(500).send({ message: 'Could not update marker.' });
  }
};
