import { SlashCommandBuilder } from '@discordjs/builders'
import Command from '../structures/Command'
import { CommandHandlerArgs } from '../types'

class ExampleCommand extends Command {
    // Информация о команде, которая должна отправляться на сервер дискорда
    // Для упрощенного создания использует билдер
    public data: SlashCommandBuilder = new SlashCommandBuilder()
        .setName('example')
        .setDescription('example command')

    // Обработчик команды
    public handler({ api, data: interaction }: CommandHandlerArgs): void {
        api.interactions.reply(interaction.id, interaction.token, {
            content: 'example'
        })
    }
}

const exampleCommand = new ExampleCommand()

export default exampleCommand
