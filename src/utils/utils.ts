import moment from 'moment'
export const convertWeatherForecastToModel = (data) => {
    return data?.list.map((eachTimeFrame) => {
        return {
            date: moment.unix(eachTimeFrame.dt).format(),
            precipitation: eachTimeFrame.pop,
            minimumTemprature: eachTimeFrame.main.temp_min,
            maximumTemprature: eachTimeFrame.main.temp_max,
            humidity: eachTimeFrame.main.humidity,
        }
    })
}
export const convertHistoricalWeatherToModel = (data) => {
    const record = data.weather.shift()
    const { temperature, timestamp, relative_humidity, precipitation } = record
    return {
        timestamp,
        precipitation,
        temperature,
        humidity: relative_humidity,
    }
}
export const extractWeatherRecordFromDateTime = (data) => {
    const {
        weatherDetails: { weather },
        pickup_date,
    } = data
    return weather.find(
        (eachWeatherSlot) => eachWeatherSlot.timestamp === pickup_date
    )
}
