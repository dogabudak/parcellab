import * as faker from 'faker'
import { GpsCoordinate } from '../../types/gpsCoordinates'

export function gpsFactoryWorker(overrides): GpsCoordinate {
    return {
        location_id: faker.random.word(),
        location: {
            longitude: faker.random.word(),
            latitude: faker.random.word(),
        },
        humidity: faker.random.word(),
        weather: [
            {
                timestamp: faker.date.recent(),
                precipitation: faker.lorem.word(),
                temperature: faker.datatype.number(),
                humidity: faker.datatype.number(),
            },
        ],
        createdAt: faker.date.recent(),
        updatedAt: faker.date.recent(),
        ...overrides,
    }
}
