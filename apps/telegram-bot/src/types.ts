// Типизация переменных среды
declare global {
    namespace NodeJS {
        interface ProcessEnv {
            TELEGRAM_TOKEN: string
        }
    }
}
