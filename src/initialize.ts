import { connectWithRetry } from '../db/connect'
import { job } from './cron/job'

export const initialize = async () => {
    await connectWithRetry()
    job.start()
}
