import * as faker from 'faker'

import {
    getCoordinateWeatherDetails,
    getLocationIdWeatherDetails,
} from '../../../src'
import * as sources from '../../../src'
import * as trackingQueries from '../../../db/queries/tracking'
import * as coordinateQueries from '../../../db/queries/coordinates'
import { createNewCoordinates } from '../../../db/queries/coordinates'
import { gpsFactoryWorker } from '../../factory/coordinates'
import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'
import { forecastFactoryWorker } from '../../factory/forecast'

describe('Index ', () => {
    describe('getLocationIdWeatherDetails ', () => {
        it('get weather details from location id successfully', async () => {
            const mockTrackingDetails = jest
                .spyOn(trackingQueries, 'getWeatherFromTrackingNumber')
                .mockResolvedValueOnce({
                    weatherDetails: {
                        location: { latitude: '0.1', longitude: '0.2' },
                    },
                    pickup_date: 'random_date',
                })
            const mockWeatherDetails = jest
                .spyOn(sources, 'getCoordinateWeatherDetails')
                .mockResolvedValueOnce({
                    timestamp: '',
                    precipitation: '',
                    temperature: 0,
                    humidity: 0,
                })
            await getLocationIdWeatherDetails({
                trackingNumber: 'random_tracking_number',
            })
            expect(mockWeatherDetails).toBeCalledTimes(1)
            expect(mockWeatherDetails).toBeCalledWith({
                latitude: '0.1',
                longitude: '0.2',
                date: 'random_date',
            })
        })
        it('Should return null since tracking number does not exist in database', async () => {
            jest.spyOn(
                trackingQueries,
                'getWeatherFromTrackingNumber'
            ).mockResolvedValueOnce(null)

            const locationDetails = await getLocationIdWeatherDetails({
                trackingNumber: 'random_tracking_number',
            })
            expect(locationDetails).toBe(null)
        })
    })
    describe('getCoordinateWeatherDetails ', () => {
        it('If coordinate does not exist in database stores it correctly', async () => {
            jest.spyOn(
                coordinateQueries,
                'getCoordinateForecastFromDatabase'
            ).mockResolvedValueOnce(undefined)

            const mockCoordinateCreation = jest
                .spyOn(coordinateQueries, 'createNewCoordinates')
                .mockResolvedValueOnce(null)
            const temperature = faker.datatype.number()
            const humidity = faker.datatype.number()
            const timestamp = faker.random.word()
            const precipitation = faker.random.word()
            jest.spyOn(
                coordinateQueries,
                'getPredictionFromDatabase'
            ).mockResolvedValueOnce({
                timestamp,
                precipitation,
                temperature,
                humidity,
            })

            const weatherDetails = await getCoordinateWeatherDetails({
                date: 'random_date',
                latitude: '0.1',
                longitude: '0.2',
            })
            expect(mockCoordinateCreation).toBeCalledWith([
                {
                    location_id: expect.any(String),
                    location: {
                        latitude: '0.1',
                        longitude: '0.2',
                    },
                },
            ])
            expect(mockCoordinateCreation).toBeCalled()
            expect(weatherDetails).toStrictEqual({
                timestamp,
                precipitation,
                temperature,
                humidity,
            })
        })
        it('Return the correct result from weather api', async () => {
            const mock = new MockAdapter(axios)
            const url = new RegExp(`${process.env.WEATHERAPI}/*`)
            const fakedForecast = forecastFactoryWorker({})
            mock.onGet(url).reply(200, { weather: [fakedForecast] })
            jest.spyOn(
                coordinateQueries,
                'getCoordinateForecastFromDatabase'
            ).mockResolvedValueOnce(gpsFactoryWorker({}) as any)
            jest.spyOn(
                coordinateQueries,
                'createNewCoordinates'
            ).mockResolvedValueOnce(null)
            const mockInsertForecast = jest
                .spyOn(coordinateQueries, 'insertPredictionToForecast')
                .mockResolvedValueOnce(null)
            jest.spyOn(
                coordinateQueries,
                'getPredictionFromDatabase'
            ).mockResolvedValueOnce(null)
            const weatherDetails = await getCoordinateWeatherDetails({
                date: 'random_date',
                latitude: '0.1',
                longitude: '0.2',
            })
            const expectedForecastObject = {
                humidity: fakedForecast.relative_humidity,
                temperature: fakedForecast.temperature,
                precipitation: fakedForecast.precipitation,
                timestamp: 'random_date',
            }
            expect(mockInsertForecast).toBeCalledWith({
                latitude: '0.1',
                longitude: '0.2',
                weather: expectedForecastObject,
            })
            expect(weatherDetails).toStrictEqual(expectedForecastObject)
        })
    })
})
