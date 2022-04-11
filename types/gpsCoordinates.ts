export interface GpsCoordinate {
    location_id: string
    location: {
        type: string
        coordinate: number[]
    }
    precipitation?: string
    weather?: {
        timestamp: string
        precipitation: string
        minimumTemprature: number
        maximumTemprature: number
        humidity: number
    }[]
    humidity?: string
    updatedAt?: Date
}
