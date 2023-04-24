import dotenv from 'dotenv'

// Получение переменных среды из .env файла
dotenv.config()

// Токен для бота из переменных среды
export const TOKEN = process.env.TELEGRAM_TOKEN!

// Константа для кнопки кликов
export const GET_POINTS_BUTTON_ID = 'get-points-button-id'

// Константа для кнопки информации
export const INFO_BUTTON_ID = 'info-button-id'
