export const convertWeatherForecastToModel = (forecast) => {
    const record = forecast.weather[0]
    const { temperature, timestamp, relative_humidity, precipitation } = record
    return {
        timestamp,
        precipitation,
        temperature,
        humidity: relative_humidity,
    }
}

export const extractWeatherRecordFromDateTime = (weatherDetails) => {
    const {
        weatherDetails: { weather },
        pickup_date,
    } = weatherDetails

    return weather.find(
        (eachWeatherSlot) => eachWeatherSlot.timestamp === pickup_date
    )
}
