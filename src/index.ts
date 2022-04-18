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
 * After checking the api, i couldn't see one end point which provided both information which are needed (max, min, median, average temperatures), therefore 2 separate calls were needed
 * but since the statistical data (median/average temperatures) is only available for paid customers, I skipped that part
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
        // @ts-ignore
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
 * This function returns a joint table from given tracking number. From this function I extract the weather at that certain time
 * with a basic filter function instead of moving this to the aggregation pipeline, the only reason I do that is, I did not want to spend more
 * time on the query development and it is enough for this challenge.
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
