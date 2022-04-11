import {
    getCoordinateForecastFromDatabase,
    insertNewCoordinate,
} from '../db/queries/coordinates'
import {getForecast} from "./api/weather";

/**
 * After checking the api, i couldn't see one end point which provided both information which are needed (max, min, median, average temperatures), therefore 2 separate calls were needed
 * but since the statistical data (median/average temperatures) is only available for paid customers, I skipped that part
 * @param latitude
 * @param longitude
 */

export const getCoordinateWeatherDetails = async ({ latitude, longitude }) => {
    let locationEntry = (
        await getCoordinateForecastFromDatabase({ latitude, longitude })
    )
    if (!locationEntry) {
        const forecast = await getForecast({latitude, longitude})
        locationEntry = await insertNewCoordinate({ forecast, latitude, longitude })
    }

    return locationEntry
}
