import request from 'supertest'
import app from '../../../app'
import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'
import * as faker from 'faker'

import { GpsCoordinatesModel } from '../../../db/models/gpsCoordinatesModel'
import { TrackingsModel } from '../../../db/models/trackingModel'
import { gpsFactoryWorker } from '../../factory/coordinates'
import { trackingFactoryWorker } from '../../factory/trackings'
import { forecastFactoryWorker } from '../../factory/forecast'
import * as sources from '../../../src'

describe('GET / - get location details from tracking number', () => {
    /**
     * Always clean the database after tests
     */
    afterAll(async () => {
        await GpsCoordinatesModel.deleteMany()
        await TrackingsModel.deleteMany()
    })
    afterEach(() => {
        jest.clearAllMocks()
    })
    beforeAll(async () => {
        const mock = new MockAdapter(axios)
        const url = new RegExp(`${process.env.WEATHERAPI}/*`)
        mock.onGet(url).reply(200, { weather: [forecastFactoryWorker({})] })
        const fakedTimestamp = faker.date.recent()
        await TrackingsModel.insertMany([
            trackingFactoryWorker({
                tracking_number: 'some-id',
                location_id: 'some-location-id',
                pickup_date: fakedTimestamp,
            }),
            trackingFactoryWorker({
                tracking_number: 'some-other-id',
                location_id: 'some-other-location-id',
                pickup_date: fakedTimestamp,
            }),
        ])

        await GpsCoordinatesModel.insertMany([
            gpsFactoryWorker({
                location_id: 'some-location-id',
                weather: {
                    timestamp: fakedTimestamp,
                    precipitation: 0,
                },
            }),
            gpsFactoryWorker({
                location_id: 'some-other-location-id',
            }),
        ])
    })
    describe('GET / - Api call is successful', () => {
        it('Get simple details about tracking number from forecast', async () => {
            await TrackingsModel.insertMany([
                trackingFactoryWorker({
                    tracking_number: 'some-id',
                    location_id: 'some-location-id',
                    pickup_date: 'asd',
                }),
            ])
            const result = await request(app).get('/track/some-id')
            expect(result.statusCode).toEqual(200)
        })
        it('Get simple details about tracking number from database', async () => {
            await TrackingsModel.insertMany([
                trackingFactoryWorker({
                    tracking_number: 'some-other-id',
                    location_id: 'some-other-location-id',
                    pickup_date: 'asd',
                }),
            ])

            const result = await request(app).get('/track/some-other-id')
            expect(result.statusCode).toEqual(200)
        })
    })
    describe('GET / - Api call is not successful', () => {
        it('Cant get details due to wrong  tracking id', async () => {
            const result = await request(app).get('/track/some-wrong-id')
            expect(result.statusCode).toEqual(404)
        })
    })
    describe('GET / - Error has thrown in server and handled correctly', () => {
        it('Cant get details due to wrong  tracking id', async () => {
            const mock = jest.spyOn(sources, 'getLocationIdWeatherDetails')
            mock.mockRejectedValue('Error')
            const result = await request(app).get('/track/some-wrong-id')
            expect(result.statusCode).toEqual(500)
        })
    })
})
