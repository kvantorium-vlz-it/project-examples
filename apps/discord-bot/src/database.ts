import { PrismaClient } from '@prisma/client'

const prismaClient = new PrismaClient()

export async function isRegistred(discordUserId: string) {
    await prismaClient.$connect()

    const user = await prismaClient.user.findFirst({
        where: {
            id: discordUserId,
        }
    })

    await prismaClient.$disconnect()

    return user !== undefined
}

export async function addUser(discordUserId: string) {
    await prismaClient.$connect()

    await prismaClient.user.create({
        data: {
            id: discordUserId,
        }
    })

    await prismaClient.$disconnect()
}

export async function getClicks(discordUserId: string) {
    await prismaClient.$connect()

    const user = await prismaClient.user.findFirst({
        where: {
            id: {
                equals: discordUserId,
            }
        }
    })

    await prismaClient.$disconnect()

    return user?.clicks
}

export async function updateClicks(discordUserId: string, clicks: number) {
    await prismaClient.$connect()

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