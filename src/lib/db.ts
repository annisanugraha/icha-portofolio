// Prisma database client - updated to sync schema
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const prismaClientSingleton = () => {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    console.error('DATABASE_URL is missing from environment variables!')
  }
  // Gunakan Connection Pool untuk stabilitas koneksi cloud
  const pool = new pg.Pool({ connectionString })
  const adapter = new PrismaPg(pool as any)
  
  return new PrismaClient({ adapter })
}

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export async function testDb() {
  try {
    await prisma.$connect();
    return true;
  } catch (e) {
    console.error('DB Connection Failed', e);
    return false;
  }
}

export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
