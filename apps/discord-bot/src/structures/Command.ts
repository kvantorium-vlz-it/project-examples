import { CommandInteraction, SlashCommandBuilder } from 'discord.js'

type CommandHandler = (interaction: CommandInteraction) => void

class Command {
    constructor(
        public data: SlashCommandBuilder,
        public handler: CommandHandler,
    ) {}
}

export default Command
