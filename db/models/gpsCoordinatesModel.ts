import { model, Schema } from 'mongoose'
import { GpsCoordinate, Weather } from '../../types/gpsCoordinates'

const weatherSubSchema = new Schema<Weather>(
    {
        timestamp: String,
        precipitation: Number,
        temperature: Number,
        humidity: Number,
    },
    { _id: false }
)

/**
 * To increase the usability of the query I would normally use geospatial data and 2dsphere indexes but to keep the challenge short,
 * I will just put indexes to coordinates
 */
export const gpsCoordinatesSchema = new Schema<GpsCoordinate>(
    {
        location_id: { type: String, unique: true, index: true },
        location: {
            longitude: { type: String, index: true },
            latitude: { type: String, index: true },
        },
        weather: [weatherSubSchema],
        updatedAt: Date,
    },
    { timestamps: true }
)

export const GpsCoordinatesModel = model<GpsCoordinate>(
    'GpsCoordinates',
    gpsCoordinatesSchema
)
