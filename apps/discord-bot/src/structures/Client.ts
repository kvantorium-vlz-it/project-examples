import { Client as DiscordClient, Collection, CommandInteraction, ClientOptions } from 'discord.js'

type CommandCallback = (interaction: CommandInteraction) => void

class Client extends DiscordClient {
    public commands: Collection<string, CommandCallback> = new Collection()

    public constructor(options: ClientOptions) {
        super(options)
        this.on('interactionCreate', (interaction) => {
            if (!interaction.isCommand()) {
                return
            }

            const command = this.commands.get(interaction.commandName) 

            command?.(interaction)
        })
    }
}

export default Client
