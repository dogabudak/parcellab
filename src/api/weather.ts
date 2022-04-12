import axios from 'axios'
import { convertWeatherForecastToModel } from '../utils/utils'

export const getForecast = async ({ latitude, longitude, date }) => {
    const response = await axios.get(`${process.env.WEATHERAPI}/weather`, {
        params: {
            date,
            lat: latitude,
            lon: longitude,
        },
    })
    const { data } = response
    return convertWeatherForecastToModel(data)
}
