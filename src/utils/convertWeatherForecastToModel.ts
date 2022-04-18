export const convertWeatherForecastToModel = (forecast, date) => {
    if (!forecast) return
    const record = forecast.weather[0]
    const { temperature, relative_humidity, precipitation } = record
    return {
        timestamp: date,
        precipitation,
        temperature,
        humidity: relative_humidity,
    }
}
