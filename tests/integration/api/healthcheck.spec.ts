import request from 'supertest'
import app from '../../../app'

describe('GET / - Health check end point', () => {
    it('Cant get health correctly', async () => {
        const result = await request(app).get('/health')
        expect(result.statusCode).toEqual(200)
    })
})
