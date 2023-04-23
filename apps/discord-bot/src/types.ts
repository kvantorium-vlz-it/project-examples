import { WithIntrinsicProps, APIApplicationCommandInteraction } from '@discordjs/core'

// Типизация переменных среды
declare global {
    namespace NodeJS {
        interface ProcessEnv {
            TOKEN: string
        }
    }
}

// Тип для параметра функции обработчика команды
export type CommandHandlerArgs = WithIntrinsicProps<APIApplicationCommandInteraction>
