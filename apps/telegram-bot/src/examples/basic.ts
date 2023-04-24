import { Telegraf, Markup } from 'telegraf'
import { GET_POINTS_BUTTON_ID, INFO_BUTTON_ID, TOKEN } from '../constants'

// Создание бота
const client = new Telegraf(TOKEN)

// Обработчик для команды "start"
// Каждый обработчик может быть асинхронным для того, чтобы последовательно
// обрабатывать команду
// Каждый обработчик может содержать параметр контекста (Обычно называют ctx), в котором
// хранимтся информация о том, где, от кого была вызвана команда, нажата кнопки и т.п.
client.command('start', (ctx) => {
    // Ответ на вызов команды
    ctx.reply('You have started chat with bot!')
})

// Обработчик команды "buttons"
client.command('buttons', async (ctx) => {
    // Отправка сообщения с кнопками
    await client.telegram.sendMessage(ctx.chat.id, 'Button', {
        reply_markup: {
            // Создание клавиатуры в чате
            inline_keyboard: [
                [
                    // Кнопка-ссылка. Получает текст, который будет отображать
                    // и ссылку страницы, на которую ведет кнопка
                    Markup.button.url('google', 'https://google.com'),
                ],
                [
                    // Кнопка с привязкой обработчика. Получает текст, который
                    // будет отображаться и ID, по которому будем находить обрабатывать
                    // нажатие на кнопку.
                    Markup.button.callback('click me', GET_POINTS_BUTTON_ID),
                    Markup.button.callback('info', INFO_BUTTON_ID),
                ]
            ],
            resize_keyboard: true,
        }
    })
})

// Обработка кнопки "info"
client.action(INFO_BUTTON_ID, (ctx) => {
    // Получение ID чата, в котором нажали кнопку
    const chatId = ctx.chat?.id

    if (!chatId) {
        return
    }

    // Отправка сообщение в чат, используя API телеграма
    client.telegram.sendMessage(chatId, 'Bot\'s info')
})

// Запуск бота
client.launch()

// Более плавное включение бота
process.once('SIGINT', () => client.stop('SIGINT'))
process.once('SIGTERM', () => client.stop('SIGTERM'))
