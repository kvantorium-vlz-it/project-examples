import { Client, GatewayDispatchEvents, GatewayIntentBits, InteractionType } from '@discordjs/core'
import { REST } from '@discordjs/rest'
import { WebSocketManager } from '@discordjs/ws'
import { TOKEN } from '../constants'

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

client.on(GatewayDispatchEvents.IntegrationCreate, ({ api, data: interaction, shardId }) => {
    
})