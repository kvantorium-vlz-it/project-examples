import { PrismaClient } from '@prisma/client'

// Клиент призмы, через который реализуется работа с бд
const prismaClient = new PrismaClient()

// Ниже представлен один из варианта работы с бд
// Перед работой с бд необходимо подключиться к ней
// После работы с бд необходимо отключиться от неё

// Функция добавления пользователя с систему
export async function addUser(userId: number) {
    // Подключение к бд
    await prismaClient.$connect()

    // Создание нового пользователя
    await prismaClient.user.create({
        data: {
            id: userId,
        }
    })

    // Отключение от бд
    await prismaClient.$disconnect()
}

// Функция проверки, зарегистрирован ли пользователь
export async function isRegistred(userId: number) {
    await prismaClient.$connect()

    // Поиск пользователя в бд
    const user = await prismaClient.user.findFirst({
        // Использоваение фильтра по id
        where: {
            id: {
                equals: userId,
            }
        }
    })

    await prismaClient.$disconnect()

    // Проверка, существует ли пользователь
    return user !== null
}

// Функция получения очков пользователя
export async function getPointsCount(userId: number) {
    await prismaClient.$connect()

    // Поиск пользователя
    const user = await prismaClient.user.findFirst({
        where: {
            id: {
                equals: userId
            }
        }
    })

    await prismaClient.$disconnect()

    // Возврат очков пользователя
    return user?.points
}

export async function addPoint(userId: number) {
    // Проверка на то, зарегистрирован ли пользователь
    if (!isRegistred(userId)) {
        return
    }

    // Получение предыдущего значения очков
    const prevPoints = (await getPointsCount(userId))!

    await prismaClient.$connect()

    // Обновление количества очков пользователя
    await prismaClient.user.update({
        // Новые данные
        data: {
            points: prevPoints + 1,
        },
        // Фильтр
        where: {
            id: userId
        }
    })

    await prismaClient.$disconnect()
}
