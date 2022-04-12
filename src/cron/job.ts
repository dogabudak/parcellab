import { CronJob } from 'cron'
import moment from 'moment'

import { GpsCoordinatesModel } from '../../db/models/gpsCoordinatesModel'
import { updatePredictionToForecast } from '../../db/queries/coordinates'

const everyFiveMinutesCron = '*/5 * * * *'

/**
 * Instead of loading entire collection to memory, fetching it via cursor would be less memory consuming
 * But sake of the challenge batch size of 10 is sufficient
 */
const refetchOldEntries = async () => {
    const updatedAtDate = moment().subtract(5, 'minutes').toDate()
    const oldEntries = await GpsCoordinatesModel.find({
        $or: [{ updatedAt: { $lte: updatedAtDate } }, { updatedAt: null }],
    })
        .batchSize(10)
        .cursor()
    await oldEntries.eachAsync(async (entry) => {
        const {
            location_id,
            location: { longitude, latitude },
        } = entry

        await updatePredictionToForecast({
            locationId: location_id,
            weather: [],
        })
    })
}

export const job = new CronJob(
    everyFiveMinutesCron,
    refetchOldEntries(),
    null,
    true
)
