import express from 'express'
import cors from 'cors'
import { StatusCodes, getReasonPhrase } from 'http-status-codes'

import 'dotenv/config'

import swaggerUi from 'swagger-ui-express'

import { initialize } from './src/initialize'
import { getCoordinateWeatherDetails, getLocationIdWeatherDetails } from './src'
import moment from 'moment'

const swaggerDocument = require('./swagger.json')

const app = express()

app.use(cors())
app.options('*', cors())

initialize()

app.set('port', process.env.SERVER_PORT || 7001)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.get('/track/:trackingNumber', async (req, res) => {
    try {
        const { trackingNumber } = req.params
        const weatherDetails = await getLocationIdWeatherDetails({
            trackingNumber,
        })
        if (!weatherDetails) {
            return res
                .status(StatusCodes.NOT_FOUND)
                .send('Requested Id does not exist')
        }
        return res.status(StatusCodes.OK).send(weatherDetails)
    } catch (e) {
        console.error(`Unable to process the request: ${e}`)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        })
    }
})

app.get('/weather', async (req, res) => {
    try {
        const { lat, lon, date } = req.query
        const longitude = Number(lon).toFixed(2)
        const latitude = Number(lat).toFixed(2)
        if (
            !longitude ||
            !longitude ||
            latitude === 'NaN' ||
            longitude === 'NaN'
        ) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .send(
                    'Unable to process the request, You must provide a valid latitude and longitude'
                )
        }
        const queriedDate = moment(date, 'YYYY-MM-DD HH:mm')

        if (!date || !queriedDate.isValid()) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .send('Unable to process the request, This is not a valid date')
        }

        const forecast = await getCoordinateWeatherDetails({
            date: queriedDate,
            longitude,
            latitude,
        })
        return res.status(StatusCodes.OK).send(forecast)
    } catch (e) {
        console.error(`Unable to process the request: ${e}`)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        })
    }
})

app.get('/health', (req, res) => {
    res.status(200).send('Ok')
})
export default app
