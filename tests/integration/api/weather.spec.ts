import request from 'supertest'
import app from '../../../app'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

import { gpsFactoryWorker } from '../../factory/coordinates'

describe('GET / a simple weather end point', () => {
    beforeAll(() => {
        const mock = new MockAdapter(axios)
        const url = new RegExp(`${process.env.WEATHERAPI}/*`)
        const mockedGpsCoordinate = gpsFactoryWorker({})
        mock.onGet(url).reply(200, { weather: [mockedGpsCoordinate] })
    })

    it('Get weather details on a specific location on a past date from weather api', async () => {
        const result = await request(app)
            .get('/weather')
            .query({ date: '2020-12-12T04:56', lat: '51.58', lon: '7.38' })
        expect(result.statusCode).toEqual(200)
        expect(result.body).toEqual({})
    })
    it('Get weather details on a specific location from database', async () => {
        const result = await request(app)
            .get('/weather')
            .query({ date: '2020-12-12T04:56', lat: '51.58', lon: '7.38' })
        expect(result.statusCode).toEqual(200)
        expect(result.body).toEqual({})
    })
    it('Should throw 500 due to wrong date', async () => {
        const result = await request(app)
            .get('/weather')
            .query({ date: 'wrong date', lat: '51.58', lon: '7.38' })
        expect(result.statusCode).toEqual(400)
    })
    it('Should throw 500 due to invalid parameters', async () => {
        const result = await request(app).get('/weather').query({
            date: '2020-12-12T04:56',
            lat: 'InvalidLon',
            lon: 'InvalidLag',
        })
        expect(result.statusCode).toEqual(400)
    })
})
