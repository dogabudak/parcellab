import * as faker from 'faker'
import { Trackings } from '../../types/trackings'

export function trackingFactoryWorker(overrides): Trackings {
    return {
        tracking_number: faker.random.word(),
        location_id: faker.random.word(),
        pickup_date: faker.date.recent(),
        ...overrides,
    }
}
