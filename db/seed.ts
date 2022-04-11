import csvtojson from 'csvtojson'
import 'dotenv/config'

import { GpsCoordinatesModel } from './models/gpsCoordinatesModel'
import { TrackingsModel } from './models/trackingModel'
import { connectWithRetry } from './connect'
import moment from 'moment'
import { insertNewCoordinate } from './queries/coordinates'

const gpsCsvLocation = `${process.cwd()}/db/csv/gps.csv`
const trackingsCsvLocation = `${process.cwd()}/db/csv/trackings.csv`

;(async () => {
    try {
        await connectWithRetry()

        await GpsCoordinatesModel.deleteMany()
        await TrackingsModel.deleteMany()

        const gpsCoordinates = await csvtojson({
            noheader: true,
            headers: ['location_id', 'latitude', 'longitude'],
        }).fromFile(gpsCsvLocation)

        const trackings = (
            await csvtojson({
                noheader: true,
                headers: ['tracking_number', 'location_id', 'pickup_date'],
            }).fromFile(trackingsCsvLocation)
        ).map((eachTrackingObject) => {
            const { tracking_number, location_id, pickup_date } =
                eachTrackingObject
            return {
                tracking_number,
                location_id,
                pickup_date: moment(pickup_date, 'YYYYMMDDHHmm.ss').format(),
            }
        })

        for (const eachCoordinate of gpsCoordinates) {
            const { latitude, longitude, location_id } = eachCoordinate
            await insertNewCoordinate({ latitude, longitude, location_id })
        }

        await TrackingsModel.insertMany(trackings)
        process.exit(0)
    } catch (e) {
        console.error(e)
        process.exit(1)
    }
})()
