import {GpsCoordinatesModel} from '../models/gpsCoordinatesModel'
import {v4 as uuidv4} from 'uuid';
import {getForecast} from "../../src/api/weather";

/**
 * Gets spherical distance of 1 kilometer
 */
export const getCoordinateForecastFromDatabase = async ({latitude, longitude}) => {
    return GpsCoordinatesModel.aggregate([
        {
            $geoNear: {
                near: {
                    type: 'Point',
                    coordinates: [Number(longitude), Number(latitude)],
                },
                distanceField: 'distance',
                spherical: true,
                maxDistance: 100,
            },
        },
    ])
}

export const updatePredictionToForecast = async ({forecast, latitude, longitude}) => {
    return GpsCoordinatesModel.insertMany([{
        location_id: uuidv4(),
        weather: {$pushAll: {values: forecast}},
        location: {
            coordinates: [longitude, latitude],
            type: 'Point',
        },
    }])
}

/**
 * Inserts a new entry to the db, if a different coordinate has been given
 * location id is created with an uuid rather than a simple number, to keep it simpler
 */

export const insertNewCoordinate = async ({location_id = uuidv4(), latitude, longitude}) => {
    const forecast = await getForecast({latitude,longitude})

    return GpsCoordinatesModel.create({
        location_id,
        weather: forecast,
        location: {
            coordinates: [longitude, latitude],
            type: 'Point',
        },
    })
}
