// import { PrismaClient } from '@prisma/client'

// let prisma: PrismaClient

// declare module 'h3' {
//     interface H3EventContext {
//         prisma: PrismaClient
//     }
// }

// pnpm i prisma @prisma/client

export default eventHandler((event) => {
    // if (!prisma) {
    //     prisma = new PrismaClient()
    // }
    // event.context.prisma = prisma
    event.context.prisma = undefined
})
