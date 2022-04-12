import axios from 'axios'
import {
    convertHistoricalWeatherToModel,
    convertWeatherForecastToModel,
} from '../utils/utils'
import moment from 'moment'

export const getForecast = async ({latitude, longitude}) => {
    const response = await axios.get(`${process.env.WEATHERAPI}/forecast`, {
        params: {
            lat: latitude,
            lon: longitude,
        },
    })
    const {data} = response
    return convertWeatherForecastToModel(data)
}

export const getHistoricalData = async ({latitude, longitude, date}) => {
    const response = await axios.get(`${process.env.WEATHERAPI}/weather`, {
        params: {
            date: date.toISOString(),
            lat: latitude,
            lon: longitude,
        },
    })
    const {data} = response
    return convertHistoricalWeatherToModel(data)
}

export const getWeather = async ({latitude, longitude, date}) => {
    const momentDate = moment(date)
    const isBefore = momentDate.isBefore(moment())
    return isBefore
        ? getHistoricalData({latitude, longitude, date: momentDate})
        : getForecast({latitude, longitude})
}
