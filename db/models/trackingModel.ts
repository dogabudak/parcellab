import { model, Schema } from 'mongoose'
import { Trackings } from '../../types/trackings'

export const trackingsSchema = new Schema<Trackings>({
    tracking_number: { type: String, unique: true, index: true },
    location_id: String,
    pickup_date: String,
})

export const TrackingsModel = model<Trackings>('Trackings', trackingsSchema)
