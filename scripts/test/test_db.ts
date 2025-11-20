// test-db.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Connection string:', process.env.DATABASE_URL);
  try {
    const result = await prisma.$queryRaw`SELECT current_database()`;
    console.log('Connected to database:', result);
  } catch (error) {
    console.error('Connection error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();