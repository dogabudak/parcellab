import { CronJob } from 'cron'
import moment from 'moment'

import { GpsCoordinatesModel } from '../../db/models/gpsCoordinatesModel'
import { updateCoordinateForecast } from '../../db/queries/coordinates'
import { getForecast } from '../api/forecast'

const everyFiveMinutesCron = '*/5 * * * *'

export const refetchOldEntries = async () => {
    const entries = await GpsCoordinatesModel.find({}).batchSize(10).cursor()
    await entries.eachAsync(async (entry) => {
        const {
            location: { longitude, latitude },
            weather,
        } = entry
        for (const eachSavedWeather of weather) {
            const momentTimestamp = moment(eachSavedWeather.timestamp)
            if (momentTimestamp.isBefore(moment())) {
                const forecast = await getForecast({
                    longitude,
                    latitude,
                    date: momentTimestamp.toISOString(),
                })
                await updateCoordinateForecast({
                    longitude,
                    latitude,
                    forecast,
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
