import axios from 'axios'
import { convertWeatherForecastToModel } from '../utils/utils'

export const getForecast = async ({ latitude, longitude }) => {
    const response = await axios.get(`${process.env.WEATHERAPI}/forecast`, {
        params: {
            lat: latitude,
            lon: longitude,
            appid: process.env.APIKEY,
        },
    })
    const { data } = response
    return convertWeatherForecastToModel(data)
}
/**
 * This end point is only available in paid plan therefore it is not used currently
 * @param latitude
 * @param longitude
 */
export const getStatisticalData = async ({ latitude, longitude }) => {
    const response = await axios.get(
        `${process.env.WEATHERAPI}/aggregated/year`,
        {
            params: {
                lat: latitude,
                lon: longitude,
                appid: process.env.APIKEY,
            },
        }
    )
    const { data } = response
    return data
}
