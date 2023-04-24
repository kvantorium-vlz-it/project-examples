import dotenv from 'dotenv'

dotenv.config()

// Токен для бота из переменных среды
export const TOKEN = process.env.TELEGRAM_TOKEN!
