import { GpsCoordinatesModel } from '../models/gpsCoordinatesModel'
import { v4 as uuidv4 } from 'uuid'


export const getCoordinateForecastFromDatabase = async ({
    latitude,
    longitude,
}) => {
    return GpsCoordinatesModel.findOne({
        location: { latitude, longitude },
    })
}

/**
 * This function replaces the current array with the new forecast array, since i don't need the old values for this challenge, I picked this approach.
 * In another challenge mongodb's $addToSet method to the weather array would be more effective
 * @param forecast
 * @param locationId
 */
export const updatePredictionToForecast = async ({ forecast, locationId }) => {
    return GpsCoordinatesModel.updateOne(
        { location_id: locationId },
        {
            weather: forecast,
        }
    )
}

/**
 * Inserts a new entry to the db, if a different coordinate has been given
 * location id is created with an uuid rather than a simple number, to keep it simpler
 */

export const insertNewCoordinate = async ({
    location_id = uuidv4(),
    forecast,
    latitude,
    longitude,
}) => {

    return GpsCoordinatesModel.create({
        location_id,
        weather: forecast,
        location: { longitude: Number(longitude).toFixed(2), latitude: Number(latitude).toFixed(2) },
    })
}
