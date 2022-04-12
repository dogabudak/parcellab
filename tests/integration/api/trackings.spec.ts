import request from 'supertest'
import app from '../../../app'

describe('GET / - a simple tracking', () => {
    it('Simple get details on tracking with weather details ', async () => {
        const result = await request(app).get('/track/some-id')
        expect(result.statusCode).toEqual(200)
    })
    it('Cant get details due to wrong  tracking id', async () => {
        const result = await request(app).get('/track/some-wrong-id')
        expect(result.statusCode).toEqual(204)
    })
})
