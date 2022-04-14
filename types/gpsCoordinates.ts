export interface GpsCoordinate {
    location_id: string
    location: {
        longitude: string
        latitude: string
    }
    weather?: Weather[]
    humidity?: string
    updatedAt?: Date
}
export interface Weather {
    timestamp: string
    precipitation: string
    temperature: number
    humidity: number
}
