/**
 * Типизация переменных среды
 */
declare global {
    namespace NodeJS {
        interface ProcessEnv {
            TOKEN: string
        }
    }
}
