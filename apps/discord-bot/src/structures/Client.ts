import {
    Client as DiscordClient,
    Collection,
    ClientOptions
} from 'discord.js'
import Command from './Command'
import path from 'path'
import fs from 'fs'
import CommandsManager from './CommandsManager'

interface PushCommandsOptions {
    isGuilds: boolean
}

class Client extends DiscordClient {
    public commandsManager = new CommandsManager()

    public constructor(options: ClientOptions) {
        super(options)

        this.commandsManager.loadCommands()

        this.on('interactionCreate', (interaction) => {
            if (!interaction.isCommand()) {
                return
            }

            const command = this.commandsManager.commands.get(interaction.commandName) 

            command?.handler(interaction)
        })
    }

    public async pushCommands({
        isGuilds
    }: PushCommandsOptions = {
        isGuilds: false
    }) {
        if (isGuilds) {
            await this.guilds.fetch()

            const handler = this.commandsManager.pushCommands.bind(this.commandsManager)

            this.guilds.cache.forEach(handler)
        } else {
            this.commandsManager.pushCommands(this)
        }
    }
}

export default Client
