import { CronJob } from 'cron'
import moment from 'moment'

import { GpsCoordinatesModel } from '../../db/models/gpsCoordinatesModel'
import { updatePredictionToForecast } from '../../db/queries/coordinates'
import { getForecast } from '../api/forecast'

const everyFiveMinutesCron = '*/5 * * * *'

/**
 * Instead of loading entire collection to memory, fetching it via cursor would be less memory consuming
 * But sake of the challenge batch size of 10 is sufficient
 */
const refetchOldEntries = async () => {
    const updatedAtDate = moment().subtract(5, 'minutes').toDate()
    const oldEntries = await GpsCoordinatesModel.find({
        // $or: [{ updatedAt: { $lte: updatedAtDate } }, { updatedAt: null }],
    })
        .batchSize(10)
        .cursor()
    await oldEntries.eachAsync(async (entry) => {
        const {
            location_id,
            location: { longitude, latitude },
            weather,
        } = entry
        for (const eachSavedWeather of weather) {
            const momentTimestamp = moment(eachSavedWeather.timestamp)
            if (momentTimestamp.isAfter(moment())) {
                const forecast = await getForecast({
                    longitude,
                    latitude,
                    date: momentTimestamp.toISOString(),
                })
                await updatePredictionToForecast({
                    locationId: location_id,
                    weather: forecast,
                    date: momentTimestamp.toISOString(),
                })
            }
        }
    })
}

export const job = new CronJob(
    everyFiveMinutesCron,
    refetchOldEntries(),
    null,
    true
)
