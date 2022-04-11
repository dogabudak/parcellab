import { model, Schema } from 'mongoose'
import { GpsCoordinate } from '../../types/gpsCoordinates'

/**
 * To use more accurate gep spatial information, I used mongodb's geo spatial point schema
 */
const pointSchema = new Schema(
    {
        type: {
            type: String,
            enum: ['Point'],
            required: true,
        },
        coordinates: {
            type: [Number],
            required: true,
        },
    },
    { _id: false }
)

/**
 * To increase the performance of the query I used 2dsphere indexes for the geospatial data
 */

export const gpsCoordinatesSchema = new Schema<GpsCoordinate>({
    location_id: { type: String, unique: true },
    location: {
        type: pointSchema,
        index: '2dsphere',
    },
    precipitation: String,
    weather: [
        {
            timestamp: String,
            precipitation: String,
            minimumTemprature: Number,
            maximumTemprature: Number,
            humidity: Number,
        },
    ],
    updatedAt: Date,
},{timestamps: true})

export const GpsCoordinatesModel = model<GpsCoordinate>(
    'GpsCoordinates',
    gpsCoordinatesSchema
)
