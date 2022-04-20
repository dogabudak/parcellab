import { GpsCoordinatesModel } from '../models/gpsCoordinatesModel'
import { GpsCoordinate } from '../../types/gpsCoordinates'
import moment from 'moment'

/**
 * Returns the first instance of latitude and longitude, they should be unique
 * @param latitude
 * @param longitude
 */
export const getCoordinateForecastFromDatabase = async ({
    latitude,
    longitude,
}) => {
    return GpsCoordinatesModel.findOne(
        {
            'location.latitude': latitude,
            'location.longitude': longitude,
        },
        { _id: 0 }
    )
}

/**
 * Inserts the element in the weather array
 * @param weather
 * @param locationId
 */
export const insertPredictionToForecast = async ({
    weather,
    longitude,
    latitude,
}) => {
    if (!weather) return
    weather.timestamp = moment(
        weather.timestamp,
        'YYYY-MM-DDTHH:mm:ss[Z]'
    ).toISOString()
    return GpsCoordinatesModel.updateOne(
        {
            'location.latitude': latitude,
            'location.longitude': longitude,
        },
        {
            $addToSet: {
                weather,
            },
        }
    )
}

/**
 * Returns the weather on the given time and date
 * @param date
 * @param latitude
 * @param longitude
 */

export const getPredictionFromDatabase = async ({
    date,
    latitude,
    longitude,
}) => {
    const prediction = await GpsCoordinatesModel.findOne({
        'location.latitude': latitude,
        'location.longitude': longitude,
        weather: {
            $elemMatch: { timestamp: date },
        },
    })
    return prediction?.weather?.find(
        (eachWeather) => eachWeather.timestamp === date
    )
}
export const updateCoordinateForecast = async ({
    date,
    latitude,
    longitude,
    forecast,
}) => {
    await GpsCoordinatesModel.updateOne(
        {
            'location.latitude': latitude,
            'location.longitude': longitude,
            'weather.timestamp': date,
        },
        {
            $set: {
                'weather.$.precipitation': forecast?.precipitation,
                'weather.$.temperature': forecast?.temperature,
                'weather.$.humidity': forecast?.humidity,
            },
        }
    )
}

export const createNewCoordinates = async (gpsCoordinates: GpsCoordinate[]) =>
    GpsCoordinatesModel.insertMany(gpsCoordinates)

export const dropCoordinatesDatabase = async () =>
    GpsCoordinatesModel.deleteMany()
