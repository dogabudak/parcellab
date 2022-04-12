import csvtojson from 'csvtojson'
import moment from 'moment'

import 'dotenv/config'

import { GpsCoordinatesModel } from './models/gpsCoordinatesModel'
import { TrackingsModel } from './models/trackingModel'
import { connectWithRetry } from './connect'

const gpsCsvLocation = `${process.cwd()}/db/csv/gps.csv`
const trackingsCsvLocation = `${process.cwd()}/db/csv/trackings.csv`

;(async () => {
    try {
        await connectWithRetry()

        await GpsCoordinatesModel.deleteMany()
        await TrackingsModel.deleteMany()

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
        await GpsCoordinatesModel.insertMany(gpsCoordinates)
        await TrackingsModel.insertMany(trackings)
        process.exit(0)
    } catch (e) {
        console.error(e)
        process.exit(1)
    }
})()
