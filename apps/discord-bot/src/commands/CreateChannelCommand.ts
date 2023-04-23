import { SlashCommandBuilder, SlashCommandStringOption } from '@discordjs/builders'
import Command from '../structures/Command'
import { CommandHandlerArgs } from '../types'
import { ApplicationCommandOptionType, ApplicationCommandType, ChannelType, MessageFlags, OverwriteType, PermissionFlagsBits } from '@discordjs/core'
import { EVERYONE_ROLE_NAME } from '../constants'

// Пример команды для создания канала по параметру
class CreateChannelCommand extends Command {
    public data = new SlashCommandBuilder()
        .setName('create-channel')
        .setDescription('create channel with passed name. Prevent everyone send messages but allow to create public threads')

    // Внутри конструктора создаются опции для команды
    constructor() {
        // Вызов конструктора базового класса
        super()

        // Добавление опции
        this.data.addStringOption(
            new SlashCommandStringOption()
                .setDescription('channel name')
                .setName('name')
                .setRequired(true)
        )
    }

    public async handler({ api, data: interaction }: CommandHandlerArgs): Promise<void> {
        if (interaction.data.type !== ApplicationCommandType.ChatInput) {
            return
        }

        // Название канала
        let channelName = 'new channel'

        // Получение параметра и его сохранение
        interaction.data.options?.map((option) => {
            if (option.type !== ApplicationCommandOptionType.String) {
                return
            }

            if (option.name === 'name') {
                channelName = option.value
            }
        })

        // Получение роли everyone
        const guild = await api.guilds.get(interaction.guild_id!)
        const everyoneRole = guild.roles.find((role) => role.name === EVERYONE_ROLE_NAME)!

        // Создание канала
        const channel = await api.guilds.createChannel(interaction.guild_id!, {
            name: channelName,
            permission_overwrites: [
                {
                    id: everyoneRole.id,
                    type: OverwriteType.Role,
                    // Запрет на отправку сообщений
                    deny: PermissionFlagsBits.SendMessages.toString(),
                    // Разрешение на возвожность добавления реакций и создания тредов
                    allow: (
                        PermissionFlagsBits.AddReactions
                        | PermissionFlagsBits.CreatePublicThreads
                    ).toString(),
                }
            ],
            type: ChannelType.GuildText,
        })

        // Отправка сообщения в созданны канал
        await api.channels.createMessage(channel.id, {
            content: 'new channel created',
        })

        // Ответ на интеракцию
        await api.interactions.reply(interaction.id, interaction.token, {
            content: `new channel "${channelName}" created!`,
            flags: MessageFlags.Ephemeral,
        })
    }
}

const createChannelCommand = new CreateChannelCommand()

export default createChannelCommand
