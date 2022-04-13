import { GpsCoordinatesModel } from '../models/gpsCoordinatesModel'
import { v4 as uuidv4 } from 'uuid'

export const getCoordinateForecastFromDatabase = async ({
    latitude,
    longitude,
}) => {
    return GpsCoordinatesModel.findOne({
        'location.latitude': latitude,
        'location.longitude': longitude,
    })
}

/**
 * This function replaces the current array with the new forecast array, since i don't need the old values for this challenge, I picked this approach.
 * In another challenge mongodb's $addToSet method to the weather array would be more effective
 * @param forecast
 * @param locationId
 */
export const updatePredictionToForecast = async ({
    weather,
    locationId,
    date,
}) => {
    return GpsCoordinatesModel.updateOne(
        { location_id: locationId, 'weather.timestamp': date },
        {
            $set: {
                'participants.$': weather,
            },
        }
    )
}

/**
 * Inserts a new entry to the db, if a different coordinate has been given
 * location id is created with an uuid rather than a simple number, to keep it simpler
 * following method can be also simplified with a better query but i did not want to spend much time on it therefore it is much simpler
 * but less efficient method
 */

export const insertNewCoordinate = async ({
    location_id = uuidv4(),
    forecast,
    latitude,
    longitude,
    date,
}) => {
    const selector = {
        location_id,
        location: {
            longitude: Number(longitude).toFixed(2),
            latitude: Number(latitude).toFixed(2),
        },
    }
    forecast.timestamp = date
    console.log(selector)
    await GpsCoordinatesModel.findOneAndUpdate(
        selector,
        { $push: { weather: forecast } },
        {
            upsert: true,
            rawResult: true,
        }
    )
}
