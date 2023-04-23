import { SlashCommandBuilder } from '@discordjs/builders'
import { WithIntrinsicProps, APIInteraction } from '@discordjs/core'

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
    public abstract handler(args: WithIntrinsicProps<APIInteraction>): void
}

export default Command
