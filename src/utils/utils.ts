import moment from "moment";
export const convertWeatherForecastToModel = (data) => {
    return data?.list.map((eachTimeFrame) => {
        return {
            timestamp: moment(eachTimeFrame.dt).format(),
            precipitation: eachTimeFrame.pop,
            minimumTemprature: eachTimeFrame.main.temp_min,
            maximumTemprature: eachTimeFrame.main.temp_max,
            humidity: eachTimeFrame.main.humidity,
        }
    })
}
