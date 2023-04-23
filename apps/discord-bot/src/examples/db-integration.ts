import { Client, ComponentType, GatewayDispatchEvents, GatewayIntentBits, InteractionType, MessageFlags } from '@discordjs/core'
import { REST } from '@discordjs/rest'
import { WebSocketManager } from '@discordjs/ws'
import { TOKEN } from '../constants'
import { getClicks, isRegistred, updateClicks } from '../database'
import registerCommand, { CLICKS_BUTTON_ID } from '../commands/RegisterCommand'

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

client.once(GatewayDispatchEvents.Ready, async ({ data: client }) => {
    console.log(`${client.user.username} ready`)
})

client.on(GatewayDispatchEvents.InteractionCreate, async ({ api, data: interaction, shardId }) => {
    if (
        interaction.type === InteractionType.ApplicationCommand
        && interaction.data.name === registerCommand.data.name
    ) {
        registerCommand.handler({ api, data: interaction, shardId })
    }

    if (
        interaction.type === InteractionType.MessageComponent
        && interaction.data.component_type === ComponentType.Button
        && interaction.data.custom_id === CLICKS_BUTTON_ID
    ) {
        if (!await isRegistred(interaction.member!.user.id)) {
            api.interactions.reply(interaction.id, interaction.token, {
                content: 'You not registred yet'
            })

            return
        }

        const clicksCount = await getClicks(interaction.member!.user.id) as number

        await updateClicks(interaction.member!.user.id, clicksCount + 1)

        await api.interactions.reply(interaction.id, interaction.token, {
            content: `Your clicks now = ${clicksCount + 1}`,
            flags: MessageFlags.Ephemeral,
        })
    }
})

ws.connect()
