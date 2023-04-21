import {
    Client as DiscordClient,
    Collection,
    ClientOptions
} from 'discord.js'
import Command from './Command'
import path from 'path'
import fs from 'fs'

import { COMMANDS_PATH } from '../constants'

class Client extends DiscordClient {
    public commands: Collection<string, Command> = new Collection()

    public constructor(options: ClientOptions) {
        super(options)

        this.getLocalCommands()

        this.on('interactionCreate', (interaction) => {
            if (!interaction.isCommand()) {
                return
            }

            const command = this.commands.get(interaction.commandName) 

            command?.handler(interaction)
        })
    }

    public getLocalCommands() {
        const folders = fs.readdirSync(COMMANDS_PATH)

        folders
            .filter(this.filterCommandFile.bind(this))
            .forEach(this.fetchLocalCommand.bind(this))
    }

    private filterCommandFile(fileName: string) {
        return fileName.endsWith('js')
            || fileName.endsWith('ts')
            && !fileName.startsWith('_')
    }

    private async fetchLocalCommand(commandFileName: string) {
        const commandFilePath = path.join(COMMANDS_PATH, commandFileName)
        const command = (await import(commandFilePath)).default as Command

        this.commands.set(command.data.name, command)
    }

    public async pushCommands(isGuilds: boolean = true) {
        if (isGuilds) {
            await this.pushGuildCommands()
        } else {
            await this.pushClientCommands()
        }
    }

    private async pushGuildCommands() {
        await this.guilds.fetch()

        this.guilds.cache.forEach(guild => {
            this.commands.forEach((command) => {
                guild.commands.create(command.data)
            })
        })
    }

    private async pushClientCommands() {
        this.commands.forEach((command) => {
            this.application?.commands.create(command.data)
        })
    }
}

export default Client
