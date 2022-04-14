import * as faker from 'faker'

export function forecastFactoryWorker(overrides) {
    return {
        temperature: faker.datatype.number(),
        relative_humidity: faker.datatype.number(),
        timestamp: faker.date.recent(),
        precipitation: faker.datatype.number(),
        ...overrides,
    }
}
