import { v4 as uuidv4 } from 'uuid'

import {
    createNewCoordinates,
    getCoordinateForecastFromDatabase,
    getPredictionFromDatabase,
    insertPredictionToForecast,
} from '../db/queries/coordinates'
import { getForecast } from './api/forecast'
import { getWeatherFromTrackingNumber } from '../db/queries/tracking'

/**
 * Checks if coordinate exists in db, if it doesnt exist it stores it in db
 * Gets the weather details from db, if they dont exist it fethces from the weather API.
 * I can already say that it is not %100 efficient and there are some unnessesary calls to db
 * but to keep the challenge fast I used the quck and dirty path
 * @param date
 * @param latitude
 * @param longitude
 */
export const getCoordinateWeatherDetails = async ({
    date,
    latitude,
    longitude,
}) => {
    // Check if requested coordinate exists in DB
    let storedLocation = await getCoordinateForecastFromDatabase({
        latitude,
        longitude,
    })
    // If requested location does not exist in db, create its instance at db
    if (!storedLocation) {
        await createNewCoordinates([
            {
                location_id: uuidv4(),
                location: {
                    latitude,
                    longitude,
                },
            },
        ])
    }
    // Check if requested weather on requested date exists in DB
    let weatherPrediction = await getPredictionFromDatabase({
        date,
        latitude,
        longitude,
    })

    // If weather details does not exist get details from API and update the database entity
    if (!weatherPrediction) {
        weatherPrediction = await getForecast({
            latitude,
            longitude,
            date,
        })
        await insertPredictionToForecast({
            weather: weatherPrediction,
            latitude,
            longitude,
        })
    }
    return weatherPrediction
}

/**
 * Gets the weather details from tracking number
 * First checks the database if given tracking number exists, if it doesnt it returns null
 * if it exists it goes to the regular path from getCoordinateWeatherDetails
 * @param trackingNumber
 */
export const getLocationIdWeatherDetails = async ({ trackingNumber }) => {
    const locationWithWeatherDetails = await getWeatherFromTrackingNumber({
        trackingNumber,
    })
    if (!locationWithWeatherDetails) {
        return null
    }
    const {
        weatherDetails: {
            location: { latitude, longitude },
        },
        pickup_date: date,
    } = locationWithWeatherDetails
    // get weather details
    return getCoordinateWeatherDetails({ latitude, longitude, date })
}
