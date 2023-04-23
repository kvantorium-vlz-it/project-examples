import { REST } from '@discordjs/rest'
import { COMMANDS_PATH, TOKEN } from '../constants'
import { WebSocketManager } from '@discordjs/ws'
import { Client, GatewayDispatchEvents, GatewayIntentBits, InteractionType } from '@discordjs/core'
import fs from 'fs'
import path from 'path'
import { Collection } from '@discordjs/collection'
import Command from '../structures/Command'

// Создание объектов, необходимых для регистрации команд
const rest = new REST({ version: '10' }).setToken(TOKEN)
const ws = new WebSocketManager({
    // Разрешить получать гильдии
    intents: GatewayIntentBits.Guilds,
    rest,
    token: TOKEN,
})
const client = new Client({ rest, ws })
// Коллекция команд по именам
const commands = new Collection<string, Command>()

// Функция загрузки команд из файловой системы
// Можно передать путь к папке с командами
async function loadCommands(commandsPath: string = COMMANDS_PATH) {
    // Получение файлов в папке
    const files = fs.readdirSync(commandsPath)

    // Создание массива промисов для того, чтобы все операции начали
    // выполняться одновременно
    const filesPromise = files
        // Фильтрация файлов
        .filter((file) => {
            const isCommand = file.endsWith('js') || file.endsWith('ts')
            const isEnabled = !file.startsWith('_')

            return isCommand && isEnabled
        })
        // Установка объектов команд в соответствующую коллекцию
        // Операция ассинхронная, поэтому позже будем выполнять Promise.all
        .map(async (commandFile) => {
            const command: Command = (await import(path.join(COMMANDS_PATH, commandFile))).default
            commands.set(command.data.name, command)
        })

    // Выполнение массива промисов
    await Promise.all(filesPromise)
}

// Работа с командами при включении бота
client.once(GatewayDispatchEvents.Ready, async ({ api, data: client }) => {
    // Подгрузка команд
    await loadCommands()

    // Функция удаления глобальных команд
    async function deleteGlobalCommands() {
        const commands = await api.applicationCommands.getGlobalCommands(
            client.application.id
        )

        await Promise.all(commands.map(async (command) => {
            console.warn(`Deleting "${command.name}" command`)

            return await api.applicationCommands.deleteGlobalCommand(
                command.application_id,
                command.id
            )
        }))
    }

    // Функция удаления команд из всех гильдий, где есть бот
    async function deleteGuildsCommands() {
        const commandsPromise = client.guilds.map(async (guild) => {
            return await api.applicationCommands.getGuildCommands(
                client.application.id,
                guild.id,
            )
        })

        const commands = (await Promise.all(commandsPromise)).flat()

        await Promise.all(commands.map(async (command) => {
            console.warn(`Deleting "${command.name}" command`);

            return await api.applicationCommands.deleteGuildCommand(
                command.application_id,
                command.guild_id!,
                command.id,
            )
        }))
    }

    // Функция регистрации команд глобально
    async function registerGlobalCommands() {
        await Promise.all(commands.map(async (command) => {
            console.log(`Registering "${command.data.name}" command`)

            await api.applicationCommands.createGlobalCommand(
                client.application.id,
                command.data.toJSON(),
            )
        }))
    }

    // Функция регистрации команд во все гильдии, где есть бот
    async function registerGuildsCommands() {
        await Promise.all(client.guilds.map(async (guild) => {
            return await Promise.all(commands.map(async (command) => {
                console.log(`Registering "${command.data.name}" command`)

                return await api.applicationCommands.createGuildCommand(
                    client.application.id,
                    guild.id,
                    command.data.toJSON(),
                )
            }))
        }))
    }

    // Для выполнения каждой операции можно убрать раскомментировать
    // соответсвтующую строчку
    // Все операции будут ждать выполнение предыдущей из-за await

    // await deleteGlobalCommands()
    // await deleteGuildsCommands()
    // await registerGlobalCommands()
    // await registerGuildsCommands()

    console.log(`${client.user.username} ready!`)
})

// Обработка команд из коллекции
client.on(GatewayDispatchEvents.InteractionCreate, ({ api, data, shardId }) => {
    if (data.type !== InteractionType.ApplicationCommand) {
        return
    }

    const command = commands.get(data.data.name)

    if (!command) {
        console.warn(`Cannot find handler for "${data.data.name}" command`);
        return
    }

    command.handler({ api, data, shardId })
})

ws.connect()
