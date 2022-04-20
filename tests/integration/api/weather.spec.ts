import request from 'supertest'
import app from '../../../app'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

import { gpsFactoryWorker } from '../../factory/coordinates'
import { forecastFactoryWorker } from '../../factory/forecast'
import { GpsCoordinatesModel } from '../../../db/models/gpsCoordinatesModel'
import { TrackingsModel } from '../../../db/models/trackingModel'
import * as sources from '../../../src'

describe('GET / a simple weather end point', () => {
    beforeAll(async () => {
        const mock = new MockAdapter(axios)
        const url = new RegExp(`${process.env.WEATHERAPI}/*`)
        const mockedWeatherDetails = forecastFactoryWorker({
            relative_humidity: 10,
            precipitation: 11,
            temperature: 12,
        })

        mock.onGet(url).reply(200, { weather: [mockedWeatherDetails] })
        await GpsCoordinatesModel.insertMany([
            gpsFactoryWorker({
                location_id: 'some-location-id',
                location: {
                    longitude: '7.38',
                    latitude: '51.58',
                },
                weather: {
                    timestamp: '2020-12-12T03:56:00.000Z',
                    precipitation: 0,
                },
            }),
        ])
    })
    afterAll(async () => {
        await GpsCoordinatesModel.deleteMany()
        await TrackingsModel.deleteMany()
    })
    it('Get weather details on a specific location on a date from database', async () => {
        const result = await request(app)
            .get('/weather')
            .query({ date: '2020-12-12T04:56', lat: '51.58', lon: '7.38' })
        expect(result.statusCode).toEqual(200)
        expect(result.body).toEqual({
            precipitation: 0,
            timestamp: '2020-12-12T03:56:00.000Z',
        })
    })
    it('Get weather details on a specific location from weather api', async () => {
        const result = await request(app)
            .get('/weather')
            .query({ date: '2020-12-13T00:00', lat: '51.58', lon: '7.38' })
        expect(result.statusCode).toEqual(200)
        expect(result.body.humidity).toEqual(10)
        expect(result.body.precipitation).toEqual(11)
        expect(result.body.temperature).toEqual(12)
    })
    it('Get weather details on a specific location which does not exist on database', async () => {
        const result = await request(app)
            .get('/weather')
            .query({ date: '2020-12-13T00:00', lat: '53.58', lon: '6.38' })
        expect(result.statusCode).toEqual(200)
        expect(result.body.humidity).toEqual(10)
        expect(result.body.precipitation).toEqual(11)
        expect(result.body.temperature).toEqual(12)
    })
    it('Should return 400 due to wrong date', async () => {
        const result = await request(app)
            .get('/weather')
            .query({ date: 'wrong date', lat: '51.58', lon: '7.38' })
        expect(result.statusCode).toEqual(400)
    })
    it('Should return 400 due to invalid parameters', async () => {
        const result = await request(app).get('/weather').query({
            date: '2020-12-12T04:56',
            lat: 'InvalidLon',
            lon: 'InvalidLag',
        })
        expect(result.statusCode).toEqual(400)
    })
    describe('Should throw 500 due a http error', () => {
        it('Cant get details due to wrong  tracking id', async () => {
            const mock = jest.spyOn(sources, 'getCoordinateWeatherDetails')
            mock.mockRejectedValue('Error')
            const result = await request(app).get('/weather').query({
                date: '2020-12-12T04:56',
                lat: '51.58',
                lon: '7.38',
            })
            expect(result.statusCode).toEqual(500)
        })
    })
})
