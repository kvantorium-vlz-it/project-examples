import { Telegraf, Markup } from 'telegraf'
import { message } from 'telegraf/filters'
import { GET_POINTS_BUTTON_ID, INFO_BUTTON_ID, TOKEN } from '../constants'
import { addPoint, addUser, answerQuizStage, closeQuiz, getPointsCount, startQuiz, userCurrentQuiz } from '../database'

// Создание бота
const client = new Telegraf(TOKEN)

// Обработчик для команды "start"
// Каждый обработчик может быть асинхронным для того, чтобы последовательно
// обрабатывать команду
// Каждый обработчик может содержать параметр контекста (Обычно называют ctx), в котором
// хранимтся информация о том, где, от кого была вызвана команда, нажата кнопки и т.п.
client.command('start', async (ctx) => {
    await addUser(ctx.from.id)

    // Ответ на вызов команды
    await ctx.reply('You have started chat with bot!')
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

client.action(GET_POINTS_BUTTON_ID, async (ctx) => {
    const userId = ctx.from?.id

    if (!userId) {
        return
    }


    await addPoint(userId)
    const pointsCount = await getPointsCount(userId)
    await ctx.reply(`1 point added! You now have ${pointsCount} points!`)
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

client.command('quiz', async (ctx) => {
    await startQuiz(ctx.from.id)

    await ctx.reply('Question 1?')
})

client.command('closeQuiz', async (ctx) => {
    await closeQuiz(ctx.from.id)

    ctx.reply('You close quiz!')
})

const DYNAMIC_BUTTON_ANSWERS = ['a1', 'a2', 'a3'] as const

client.on(message('text'), async (ctx) => {
    const userQuizStage = (await userCurrentQuiz(ctx.from.id))?.stage

    if (userQuizStage === undefined) {
        return
    }

    const answer = ctx.message.text

    switch(userQuizStage) {
        case 0: {
            await answerQuizStage(ctx.from.id, 1, answer)
            await ctx.reply('Question 2?')
            break
        }
        case 1: {
            await answerQuizStage(ctx.from.id, 2, answer)
            await ctx.reply('Question 3?', {
                reply_markup: {
                    inline_keyboard: [
                        DYNAMIC_BUTTON_ANSWERS.map((a, i) => Markup.button.callback(`answer ${i}`, a))
                    ]
                }
            })
            break
        }
        case 3: {
            await answerQuizStage(ctx.from.id, 4, answer, true)
            await ctx.reply('Thanks for completing quiz')
            break
        }
    }
})

DYNAMIC_BUTTON_ANSWERS.map((answer) => {
    client.action(answer, async (ctx) => {
        const userId = ctx.from?.id

        if (!userId) {
            return
        }

        const userQuizStage = (await userCurrentQuiz(ctx.from.id))?.stage

        if (userQuizStage === undefined) {
            return
        }

        if (userQuizStage !== 2) {
            return
        }

        await answerQuizStage(userId, 3, answer)
        await ctx.reply('Question 4?')
    })
})

// Запуск бота
client.launch()

// Более плавное включение бота
process.once('SIGINT', () => client.stop('SIGINT'))
process.once('SIGTERM', () => client.stop('SIGTERM'))
