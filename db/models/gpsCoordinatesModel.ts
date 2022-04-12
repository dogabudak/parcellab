import { model, Schema } from 'mongoose'
import { GpsCoordinate } from '../../types/gpsCoordinates'

/**
 * To increase the performance of the query I would normally use geospatial data and 2dsphere indexes but to keep the challenge short, i will just put indexes to coordinates
 */

export const gpsCoordinatesSchema = new Schema<GpsCoordinate>(
    {
        location_id: { type: String, unique: true },
        location: {
            longitude: { type: String, index: true },
            latitude: { type: String, index: true },
        },
        precipitation: String,
        weather: [
            {
                timestamp: String,
                precipitation: String,
                temperature: Number,
                humidity: Number,
            },
        ],
        updatedAt: Date,
    },
    { timestamps: true }
)

export const GpsCoordinatesModel = model<GpsCoordinate>(
    'GpsCoordinates',
    gpsCoordinatesSchema
)
