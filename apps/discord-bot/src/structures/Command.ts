import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandHandlerArgs } from '../types'

/**
 * Structure for easilly creating command
 */
abstract class Command {
    /**
     * Command data for pushing to discord server
     */
    public abstract data: SlashCommandBuilder

    /**
     * Command handler
     * @param args command interaction args
     */
    public abstract handler(args: CommandHandlerArgs): void
}

export default Command
