import { convertWeatherForecastToModel } from '../../../src/utils/convertWeatherForecastToModel'

describe('Utilities ', () => {
    describe('convertWeatherForecastToModel ', () => {
        it('converts Weather Forecast To model succsessfuly', () => {
            const dataModel = convertWeatherForecastToModel(
                {
                    weather: [
                        {
                            temperature: 10,
                            timestamp: 'timestamp',
                            relative_humidity: 1,
                            precipitation: 0,
                        },
                    ],
                },
                'timestamp'
            )
            expect(dataModel.precipitation).toBe(0)
            expect(dataModel.humidity).toBe(1)
            expect(dataModel.timestamp).toBe('timestamp')
            expect(dataModel.temperature).toBe(10)
        })
        it('Should return undefined silently', () => {
            const dataModel = convertWeatherForecastToModel(
                undefined,
                'timestamp'
            )
            expect(dataModel).toBe(undefined)
        })
    })
})
