export interface GpsCoordinate {
    location_id: string
    location: {
        longitude: string
        latitude: string
    }
    precipitation?: string
    weather?: {
        timestamp: string
        precipitation: string
        temperature: number
        humidity: number
    }[]
    humidity?: string
    updatedAt?: Date
}
