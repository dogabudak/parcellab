import {
    getCoordinateForecastFromDatabase,
    insertNewCoordinate, updatePredictionToForecast,
} from '../db/queries/coordinates'
import { getForecast } from './api/weather'
import { getWeatherFromTrackingNumber } from '../db/queries/tracking'
import { extractWeatherRecordFromDateTime } from './utils/utils'

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
    let weather
    const queriredDate = date.toISOString()

    let storedLocation = await getCoordinateForecastFromDatabase({
        latitude,
        longitude,
    })
    weather = storedLocation.weather.find(
        (eachWeather) => eachWeather.timestamp === queriredDate
    )
    if(!weather){
        weather = await getForecast({
            latitude,
            longitude,
            date: queriredDate,
        })
    }
    if (!storedLocation) {
        await insertNewCoordinate({
            date: queriredDate,
            forecast: weather,
            latitude,
            longitude,
        })
    } else {
        await updatePredictionToForecast({
            locationId: storedLocation.location_id,
            weather,
            date: queriredDate,
        })
    }
    return weather
}

/**
 * This function returns a joint table from given tracking number. From this function I extract the weather at that certain time
 * with a basic filter function instead of moving this to the aggregation pipeline, the only reason I do that is, I did not want to spend more time on the query development.
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
        location_id,
        weatherDetails: {
            location: { latitude, longitude },
        },
        pickup_date: date,
    } = locationWithWeatherDetails
    const weatherDetailsFromDb = extractWeatherRecordFromDateTime(
        locationWithWeatherDetails
    )
    if (weatherDetailsFromDb) {
        return weatherDetailsFromDb
    } else {
        const forecast = await getForecast({ latitude, longitude, date })
        await insertNewCoordinate({
            location_id,
            date,
            forecast,
            latitude,
            longitude,
        })
        return forecast
    }
}
