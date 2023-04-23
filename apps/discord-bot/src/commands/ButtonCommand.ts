import { ActionRowBuilder, ButtonBuilder, SlashCommandBuilder } from '@discordjs/builders'
import Command from '../structures/Command'
import { CommandHandlerArgs } from '../types'
import { ButtonStyle } from '@discordjs/core'

// ID нашей кнопки. По этому ID можно будет реагировать на кнопку
export const EMBED_BUTTON_ID = 'btn-embed'

class ButtonCommand extends Command {
    public data = new SlashCommandBuilder()
        .setName('button-command')
        .setDescription('shows embed message')

    public async handler({ api, data: interaction }: CommandHandlerArgs): Promise<void> {
        // Создание компонента кнопки
        const embedButton = new ButtonBuilder()
            .setCustomId(EMBED_BUTTON_ID)
            .setLabel('Send embed message')
            .setStyle(ButtonStyle.Primary)

        // Создание строчки компонентов
        const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(embedButton)

        // Отправление сообщения с кнопкой
        await api.interactions.reply(interaction.id, interaction.token, {
            content: 'Click at button for send embed message',
            components: [row.toJSON()],
        })
    }
}

const buttonCommand = new ButtonCommand()

export default buttonCommand
