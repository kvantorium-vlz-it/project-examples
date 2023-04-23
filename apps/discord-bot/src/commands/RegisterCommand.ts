import { ActionRowBuilder, ButtonBuilder, SlashCommandBuilder } from '@discordjs/builders'
import Command from '../structures/Command'
import { CommandHandlerArgs } from '../types'
import { addUser, getClicks } from '../database'
import { ButtonStyle, MessageFlags } from '@discordjs/core'

// ID для кнопки
export const CLICKS_BUTTON_ID = 'clicks-button'

class RegisterCommand extends Command {
    public data = new SlashCommandBuilder()
        .setName('register')
        .setDescription('add user to db')

    public async handler({ api, data: interation }: CommandHandlerArgs): Promise<void> {
        if (!interation.member?.user) {
            return
        }

        // Проверка, зарегистрирован ли пользователь
        const isRegistred = (await getClicks(interation.member.user.id)) !== undefined

        // Если пользователь зарегистрирован
        if (isRegistred) {
            await api.interactions.reply(interation.id, interation.token, {
                content: 'You already registred'
            })

            return
        }

        // Добавление пользователя в бд
        await addUser(interation.member.user.id)

        // Оповещение пользователя о регистрации
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
