import {
    getCoordinateForecastFromDatabase,
    insertNewCoordinate,
} from '../db/queries/coordinates'

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
        locationEntry = await insertNewCoordinate({ latitude, longitude })
    }

    return locationEntry
}
