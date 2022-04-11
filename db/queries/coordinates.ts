import { GpsCoordinatesModel } from '../models/gpsCoordinatesModel'
import { v4 as uuidv4 } from 'uuid'
import { getForecast } from '../../src/api/weather'

/**
 * Gets spherical distance of 1 kilometer
 */
export const getCoordinateForecastFromDatabase = async ({
    latitude,
    longitude,
}) => {
    return GpsCoordinatesModel.findOne({
        location: { latitude, longitude },
    })
}

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
    latitude,
    longitude,
}) => {
    const forecast = await getForecast({ latitude, longitude })

    return GpsCoordinatesModel.create({
        location_id,
        weather: forecast,
        location: { longitude, latitude },
    })
}
