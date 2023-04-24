import { Telegraf } from 'telegraf'
import { TOKEN } from '../constants'

// Создание бота
const client = new Telegraf(TOKEN)

// Обработчик для команды "start"
client.command('start', (ctx) => {
    // Ответ на вызов команды
    ctx.reply('You have started chat with bot!')
})

// Запуск бота
client.launch()

// Более плавное включение бота
process.once('SIGINT', () => client.stop('SIGINT'))
process.once('SIGTERM', () => client.stop('SIGTERM'))
