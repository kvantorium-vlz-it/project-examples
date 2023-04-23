import { Client, ComponentType, GatewayDispatchEvents, GatewayIntentBits, InteractionType } from '@discordjs/core'
import { REST } from '@discordjs/rest'
import { WebSocketManager } from '@discordjs/ws'
import { TOKEN } from '../constants'
import buttonCommand, { EMBED_BUTTON_ID } from '../commands/ButtonCommand'
import { EmbedBuilder } from '@discordjs/builders'

// Создание объектов для работы
const rest = new REST().setToken(TOKEN)
const ws = new WebSocketManager({
    intents: GatewayIntentBits.GuildMessages
        | GatewayIntentBits.Guilds
        | GatewayIntentBits.MessageContent,
    rest,
    token: TOKEN,
})
const client = new Client({ rest, ws })

client.once(GatewayDispatchEvents.Ready, ({ data: client }) => {
    console.log(`${client.user.username} ready`)
})

// Обработка команды и кнопки
client.on(GatewayDispatchEvents.InteractionCreate, ({ api, data: interaction, shardId }) => {
    // Команда
    if (
        interaction.type === InteractionType.ApplicationCommand
        && interaction.data.name === buttonCommand.data.name
    ) {
        buttonCommand.handler({ api, data: interaction, shardId })
    }

    // Кнопка
    if (interaction.type === InteractionType.MessageComponent) {
        if (interaction.data.component_type !== ComponentType.Button) {
            return
        }

        // Выбор кнопки. Можно выбирать обработчик также, как и в командах,
        // но тогда необходимо реалиовать подобный функционал
        // Также обработчики кнопок можно хранить в отдельных файлах для простоты работы
        if (interaction.data.custom_id !== EMBED_BUTTON_ID) {
            return
        }

        // Создание и отправка сообщения
        api.interactions.reply(interaction.id, interaction.token, {
            embeds: [
                new EmbedBuilder()
                    .setColor([35, 186, 186])
                    .setAuthor({ name: 'toombez' })
                    .setDescription('This is embed message description')
                    .setURL('https://google.com')
                    .setTitle('Embed message title')
                    .addFields([
                        { name: 'field1', value: 'none', inline: true },
                        { name: 'field2', value: 'lorem', inline: true },
                        { name: 'field3', value: 'null' },
                    ])
                    .setThumbnail('https://i.imgur.com/AfFp7pu.png')
                    .setImage('https://i.imgur.com/AfFp7pu.png')
                    .setFooter({ text: 'embed message footer' })
                    .setTimestamp(new Date())
                    .toJSON()
            ]
        })
    }
})

ws.connect()
