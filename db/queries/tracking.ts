import { TrackingsModel } from '../models/trackingModel'
import { Trackings } from '../../types/trackings'

export const getWeatherFromTrackingNumber = async ({ trackingNumber }) => {
    const foundLocations = await TrackingsModel.aggregate([
        { $match: { tracking_number: trackingNumber } },
        {
            $lookup: {
                from: 'gpscoordinates',
                localField: 'location_id',
                foreignField: 'location_id',
                as: 'weatherDetails',
            },
        },
        {
            $unwind: {
                path: '$weatherDetails',
                preserveNullAndEmptyArrays: false,
            },
        },
    ])
    if (foundLocations.length === 1) {
        return foundLocations[0]
    }
}
export const dropTrackingsDatabase = async () => TrackingsModel.deleteMany()

export const createNewTrackings = async (trackings: Trackings[]) => TrackingsModel.insertMany(trackings)
