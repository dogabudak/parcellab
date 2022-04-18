import csvtojson from 'csvtojson'
import moment from 'moment'
import 'dotenv/config'

import { connectWithRetry } from '../connect'
import {
    createNewCoordinates,
    dropCoordinatesDatabase,
} from '../queries/coordinates'
import { createNewTrackings, dropTrackingsDatabase } from '../queries/tracking'

const gpsCsvLocation = `${process.cwd()}/db/csv/gps.csv`
const trackingsCsvLocation = `${process.cwd()}/db/csv/trackings.csv`

;(async () => {
    try {
        await connectWithRetry()
        await dropCoordinatesDatabase()
        await dropTrackingsDatabase()

        const gpsCoordinates = (
            await csvtojson({
                noheader: true,
                headers: ['location_id', 'latitude', 'longitude'],
            }).fromFile(gpsCsvLocation)
        ).map((eachCoordinate) => {
            const { location_id, latitude, longitude } = eachCoordinate
            return {
                location_id,
                location: {
                    latitude: Number(latitude).toFixed(2),
                    longitude: Number(longitude).toFixed(2),
                },
            }
        })

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
        await createNewCoordinates(gpsCoordinates)
        await createNewTrackings(trackings)
        process.exit(0)
    } catch (e) {
        console.error(e)
        process.exit(1)
    }
})()