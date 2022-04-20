import { CronJob } from 'cron'
import moment from 'moment'

import { GpsCoordinatesModel } from '../../db/models/gpsCoordinatesModel'
import { updateCoordinateForecast } from '../../db/queries/coordinates'
import { getForecast } from '../api/forecast'

const everyFiveMinutesCron = '*/5 * * * *'

/**
 * fethces the coordinates from db checks each weather which are stored in weather array
 * if its a future date it refetches the weather to keep the weather conditions updated, if its a past date skips it
 * This is as well an ineffcient method and it has been explained in Readme
 * To write the challenge fast I made it in this way
 */
export const refetchOldEntries = async () => {
    const entries = await GpsCoordinatesModel.find({}).batchSize(10).cursor()
    await entries.eachAsync(async (entry) => {
        const {
            location: { longitude, latitude },
            weather,
        } = entry
        for (const eachSavedWeather of weather) {
            try {
                const momentTimestamp = moment(eachSavedWeather.timestamp)
                if (momentTimestamp.isAfter(moment())) {
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
            } catch (e) {
                console.error(`Can not re fetch the given data ${e}`)
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
