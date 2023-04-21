import { SlashCommandBuilder } from 'discord.js'
import Command from '../structures/Command'

const exampleCommand = new Command(
    new SlashCommandBuilder()
        .setName('example')
        .setDescription('example command'),
    (interaction) => {
        interaction.reply('example command')
    }
)

export default exampleCommand
