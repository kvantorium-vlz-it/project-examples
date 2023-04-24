import { Telegraf } from 'telegraf'
import { TOKEN } from '../constants'

const client = new Telegraf(TOKEN)

client.command('start', (ctx) => {
    ctx.reply('You have started chat with bot!')
})

client.launch()

process.once('SIGINT', () => client.stop('SIGINT'))
process.once('SIGTERM', () => client.stop('SIGTERM'))
