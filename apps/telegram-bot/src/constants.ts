import dotenv from 'dotenv'

// Получение переменных среды из .env файла
dotenv.config()

// Токен для бота из переменных среды
export const TOKEN = process.env.TELEGRAM_TOKEN!
