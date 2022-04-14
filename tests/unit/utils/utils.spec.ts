import {
    convertWeatherForecastToModel,
    extractWeatherRecordFromDateTime,
} from '../../../src/utils/utils'

describe('Utilities ', () => {
    describe('extractWeatherRecordFromDateTime ', () => {
        it('Extracts weather record from date and time succsessfuly ', () => {
            const weatherRecord = extractWeatherRecordFromDateTime({
                weatherDetails: { weather: [{ timestamp: 'pickup_date' }] },
                pickup_date: 'pickup_date',
            })
            expect(weatherRecord.timestamp).toBe('pickup_date')
        })
    }),
        describe('convertWeatherForecastToModel ', () => {
            it('converts Weather Forecast To model succsessfuly', () => {
                const dataModel = convertWeatherForecastToModel({
                    weather: [
                        {
                            temperature: 10,
                            timestamp: 'timestamp',
                            relative_humidity: 1,
                            precipitation: 0,
                        },
                    ],
                })
                expect(dataModel.precipitation).toBe(0)
                expect(dataModel.humidity).toBe(1)
                expect(dataModel.timestamp).toBe('timestamp')
                expect(dataModel.temperature).toBe(10)
            })
        })
})
