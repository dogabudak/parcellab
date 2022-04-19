import { connectWithRetry } from '../db/connect'
import { job } from './cron/job'
import { seed } from '../db/seed/seed'

export const initialize = async () => {
    await connectWithRetry()
    await seed()
    job.start()
}
