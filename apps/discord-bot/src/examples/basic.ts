import {
    GatewayIntentBits,
    GatewayDispatchEvents,
    Client,
    InteractionType,
    MessageFlags,
} from '@discordjs/core'
import { REST } from '@discordjs/rest'
import { TOKEN } from '../constants'
import { WebSocketManager } from '@discordjs/ws'

// Создание rest и ws объектов, в которых лежат настройки и api для связи дискорда
const rest = new REST({ version: '10' }).setToken(TOKEN)
const ws = new WebSocketManager({
    // Intents для бота
    intents: GatewayIntentBits.MessageContent
        | GatewayIntentBits.GuildMessages,
    token: TOKEN,
    rest,
})

// Создание клиента (Обертку для взаимодействия с api)
const client = new Client({ rest, ws })

// Обработчик, который вызовется один раз при
client.once(GatewayDispatchEvents.Ready, ({ data: client }) => {
    console.log(`${client.user.username} ready.`)
})

// Обработчик для интеракций
client.on(GatewayDispatchEvents.InteractionCreate, ({ api, data: interaction }) => {
    // Выбор только команд из всех интеракций
    if (interaction.type !== InteractionType.ApplicationCommand) {
        return
    }

    // Команды. Всю информацию, о командах, которые используются в боте необходимо
    // грузить на сервер дискорда через отдельный скрипт или при включении бота
    switch(interaction.data.name) {
        // Команда ping
        case 'ping': {
            // Отправка боту сообщения 'Pong!'
            api.interactions.reply(interaction.id, interaction.token, {
                content: 'Pong!',
                flags: MessageFlags.Ephemeral,
            })
            break
        }
        // Если для команды нет обработчика
        default: {
            console.warn(`Handler for command ${interaction.data.name} not found`)
        }
    }
})

// Включение бота, используя webSockets
ws.connect()
