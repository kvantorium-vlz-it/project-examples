import { PrismaClient } from '@prisma/client'

// Клинет призмы
// Перед любым выполнением опереции с бд необходимо выполнить
// подключение, после — отключение
const prismaClient = new PrismaClient()

// Нижде представлен один из вариантов, как можно оборачивать функции бд 
// в удобный для логики нашего приложения код

// Функция, проверяющая регистрацию
export async function isRegistred(discordUserId: string) {
    await prismaClient.$connect()

    // Поиск по фильтру
    const user = await prismaClient.user.findFirst({
        where: {
            id: discordUserId,
        }
    })

    await prismaClient.$disconnect()

    // Значение, зарегистрирован ли пользователь
    return user !== undefined
}

// Функции добавления пользователя
export async function addUser(discordUserId: string) {
    await prismaClient.$connect()

    // Создание пользователя
    await prismaClient.user.create({
        data: {
            id: discordUserId,
        }
    })

    await prismaClient.$disconnect()
}

export async function getClicks(discordUserId: string) {
    await prismaClient.$connect()

    // Поиск пользователя
    const user = await prismaClient.user.findFirst({
        where: {
            id: {
                equals: discordUserId,
            }
        }
    })

    await prismaClient.$disconnect()

    // Возврат количества очков
    return user?.clicks
}

export async function updateClicks(discordUserId: string, clicks: number) {
    await prismaClient.$connect()

    // Обновление пользователя
    await prismaClient.user.update({
        data: {
            clicks: clicks,
        },
        where: {
            id: discordUserId,
        }
    })

    await prismaClient.$disconnect()
}
