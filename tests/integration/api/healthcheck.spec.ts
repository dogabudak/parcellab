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

describe('GET / - Health check end point', () => {
    it('Cant get health correctly', async () => {
        const result = await request(app).get('/health')
        expect(result.statusCode).toEqual(200)
    })
})
