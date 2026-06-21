import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  console.log("USERS IN DB:");
  console.log(users.map(u => u.email));
}

main().catch(console.error).finally(() => prisma.$disconnect());
