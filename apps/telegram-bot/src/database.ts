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
            id: `${userId}`,
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
                equals: `${userId}`,
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
                equals: `${userId}`
            }
        }
    })

    await prismaClient.$disconnect()

    // Возврат очков пользователя
    return user?.points
}

// Функция добавления одного очка пользователю
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
            id: `${userId}`
        }
    })

    await prismaClient.$disconnect()
}

// Функцция начала опроса
export async function startQuiz(userId: number) {
    await prismaClient.$connect()

    await prismaClient.quiz.create({
        data: {
            userId: `${userId}`,
        }
    })

    await prismaClient.$disconnect()
}

// Функцция закрытия опроса
export async function closeQuiz(userId: number) {
    await prismaClient.$connect()

    // Получения актуального опроса, который не закрыт у пользователя
    const quiz = await userCurrentQuiz(userId)

    // Проверка, если ли такой опрос
    if (!quiz) {
        await prismaClient.$disconnect()
        return
    }

    // Закрытие опроса
    await prismaClient.quiz.update({
        data: {
            isClosed: true,
        },
        where: {
            id: quiz.id,
        }
    })

    await prismaClient.$disconnect()
}

// Функция получения актуального опроса
export async function userCurrentQuiz(userId: number) {
    await prismaClient.$connect()

    const quiz = await prismaClient.quiz.findFirst({
        where: {
            isFinished: {
                equals: false,
            },
            isClosed: {
                equals: false,
            },
            userId: {
                equals: `${userId}`
            }
        },
        include: {
            quizAnswer: true,
        }
    })

    await prismaClient.$disconnect()

    return quiz
}

// Функция ответа на вопрос для актуального опроса
export async function answerQuizStage(userId: number, stage: number, answer: string, isFinished?: boolean) {
    await prismaClient.$connect()

    const quiz = await userCurrentQuiz(userId)

    if (!quiz) {
        await prismaClient.$disconnect()
        return
    }

    // Создание ответа
    await prismaClient.quizAnswer.create({
        data: {
            stage: stage,
            quizId: quiz.id,
            answer,
        }
    })

    // Обновление опроса
    await prismaClient.quiz.update({
        data: {
            stage: stage,
            isFinished: isFinished,
        },
        where: {
            id: quiz.id,
        },
    })

    await prismaClient.$disconnect()
}
