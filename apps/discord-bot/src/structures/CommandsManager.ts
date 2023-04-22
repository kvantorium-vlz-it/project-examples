import path from 'path'
import fs from 'fs'
import Command from './Command'
import { Collection, Guild } from 'discord.js'

import { COMMANDS_PATH } from '../constants'
import Client from './Client'

class CommandsManager {
    public commands: Collection<string, Command> = new Collection()

    public async loadCommands() {
        const files = fs.readdirSync(COMMANDS_PATH)

        const filesPromises = files
            .filter(this.isCommandFile.bind(this))
            .map(this.fetchLocalCommand.bind(this))

        await Promise.all(filesPromises)

        return this.commands
    }

    private isCommandFile(fileName: string) {
        const isScriptFile = fileName.endsWith('js') || fileName.endsWith('ts')
        const isDisabledFile = !fileName.startsWith('_')

        return isScriptFile && isDisabledFile
    }

    private async fetchLocalCommand(commandFileName: string) {
        const commandFilePath = path.join(COMMANDS_PATH, commandFileName)
        const command = (await import(commandFilePath)).default as Command

        this.commands.set(command.data.name, command)
    }

    private getManager(target: Guild | Client) {
        return target instanceof Guild
            ? target.commands
            : target.application?.commands
    }

    public async pushCommands(target: Guild | Client) {
        const manager = this.getManager(target)
        
        this.commands.forEach((command) => {
            const data = command.data

            manager?.create(data)
        })
    }
}

export default CommandsManager
