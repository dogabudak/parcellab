import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import swaggerUi from 'swagger-ui-express'
import { initialize } from './src/initialize'
import { getCoordinateWeatherDetails } from './src'

const swaggerDocument = require('./swagger.json')

const app = express()
const apiPort = process.env.PORT

app.use(cors())
app.options('*', cors())

initialize()
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.get('/track/:trackingNumber', async (req, res) => {
    try {
    } catch (e) {
        console.error(`Unable to process the request: ${e}`)
        res.sendStatus(500)
    }
})

app.get('/weather', async (req, res) => {
    try {
        const { lat, lon } = req.query
        if (!lat || !lon) {
            return res
                .status(400)
                .send(
                    'Unable to process the request, You must provide both latitude and longtitude'
                )
        }
        const forecast = await getCoordinateWeatherDetails({
            longitude: lon,
            latitude: lat,
        })
        return res.status(200).send(forecast)
    } catch (e) {
        console.error(`Unable to process the request: ${e}`)
        res.sendStatus(500)
    }
})

app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`))
