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

export async function startQuiz(userId: number) {
    await prismaClient.$connect()

    await prismaClient.quiz.create({
        data: {
            userId: `${userId}`,
        }
    })

    await prismaClient.$disconnect()
}

export async function closeQuiz(userId: number) {
    await prismaClient.$connect()

    const quiz = await userCurrentQuiz(userId)

    if (!quiz) {
        await prismaClient.$disconnect()
        return
    }

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

export async function answerQuizStage(userId: number, stage: number, answer: string, isFinished?: boolean) {
    await prismaClient.$connect()

    const quiz = await userCurrentQuiz(userId)

    if (!quiz) {
        await prismaClient.$disconnect()
        return
    }

    await prismaClient.quizAnswer.create({
        data: {
            stage: stage,
            quizId: quiz.id,
            answer,
        }
    })

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

// export async function startQuiz(userId: number) {
//     await prismaClient.$connect()

//     await prismaClient.quiz.create({
//         data: {
//             userId: `${userId}`,
//         }
//     })

//     await prismaClient.$disconnect()
// }

// export async function getQuizStage(userId: number) {
//     await prismaClient.$connect()

//     const quiz = await prismaClient.quiz.findFirst({
//         where: {
//             userId: {
//                 equals: `${userId}`,
//             }
//         }
//     })

//     await prismaClient.$disconnect()

//     return quiz?.stage
// }

// export async function answerStage(userId: number, stage: number, answer: string) {
//     await prismaClient.$connect()

//     const quiz = await prismaClient.quiz.findFirst({
//         where: {
//             userId: {
//                 equals: `${userId}`,
//             }
//         }
//     })

//     if (!quiz) {
//         return
//     }

//     await prismaClient.quizAnswer.create({
//         data: {
//             stage: stage,
//             quizId: quiz.id,
//         }
//     })

//     await prismaClient.$disconnect()
// }

// export async function getQuizs(userId: number) {
//     await prismaClient.$connect()

//     const quizs = await prismaClient.quiz.findMany({
//         where: {
//             userId: {
//                 equals: `${userId}`,
//             }
//         }
//     })

//     await prismaClient.$disconnect()

//     return quizs
// }
