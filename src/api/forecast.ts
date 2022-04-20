import axios from 'axios'
import { StatusCodes } from 'http-status-codes'

import { convertWeatherForecastToModel } from '../utils/convertWeatherForecastToModel'

/**
 * Gets the weather forecast
 * @param latitude
 * @param longitude
 * @param date
 */
export const getForecast = async ({ latitude, longitude, date }) => {
    try {
        const response = await axios.get(`${process.env.WEATHERAPI}/weather`, {
            params: {
                date,
                lat: latitude,
                lon: longitude,
            },
        })
        const { data } = response
        return convertWeatherForecastToModel(data, date)
    } catch (e) {
        /* istanbul ignore next */
        if (e.response.status === StatusCodes.NOT_FOUND) return
    }
}
