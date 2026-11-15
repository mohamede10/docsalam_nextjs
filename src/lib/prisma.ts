// Prisma is not used in this project - we use Supabase directly
// This file is kept for reference but disabled
// import { PrismaClient } from '@prisma/client'

// const globalForPrisma = globalThis as unknown as {
//   prisma: PrismaClient | undefined
// }

// export const prisma = globalForPrisma.prisma ?? new PrismaClient()

// if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export const prisma = null as any
