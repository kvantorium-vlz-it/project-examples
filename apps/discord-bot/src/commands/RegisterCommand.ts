import { ActionRowBuilder, ButtonBuilder, SlashCommandBuilder } from '@discordjs/builders'
import Command from '../structures/Command'
import { CommandHandlerArgs } from '../types'
import { addUser, getClicks } from '../database'
import { ButtonStyle, MessageFlags } from '@discordjs/core'

export const CLICKS_BUTTON_ID = 'clicks-button'

class RegisterCommand extends Command {
    public data = new SlashCommandBuilder()
        .setName('register')
        .setDescription('add user to db')

    public async handler({ api, data: interation }: CommandHandlerArgs): Promise<void> {
        if (!interation.member?.user) {
            return
        }

        const isRegistred = (await getClicks(interation.member.user.id)) !== undefined

        if (isRegistred) {
            await api.interactions.reply(interation.id, interation.token, {
                content: 'You already registred'
            })

            return
        }

        await addUser(interation.member.user.id)

        await api.interactions.reply(interation.id, interation.token, {
            content: 'Below you can click the button to get points',
            flags: MessageFlags.Ephemeral,
        })

        const button = new ButtonBuilder()
            .setCustomId(CLICKS_BUTTON_ID)
            .setLabel(`Click to get points. (${interation.member.user.id})`)
            .setStyle(ButtonStyle.Success)

        const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(button)

        await api.channels.createMessage(interation.channel.id, {
            content: 'Button: ',
            components: [row.toJSON()]
        })
    }
}

const registerCommand = new RegisterCommand()

export default registerCommand
