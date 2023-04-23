import path from 'path'
import dotenv from 'dotenv'

// Получение переменных среды из .env файла
dotenv.config()

// Стандартный путь до папки с командами
export const COMMANDS_PATH = path.join(__dirname, 'commands')

// Токен дискорд бота
export const TOKEN = process.env.TOKEN!

// Название роли everyone
export const EVERYONE_ROLE_NAME = '@everyone'
