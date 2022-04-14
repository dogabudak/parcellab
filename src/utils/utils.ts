export const convertWeatherForecastToModel = (data) => {
    const record = data.weather[0]
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
