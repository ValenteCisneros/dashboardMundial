const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

/**
 * Connect to PostgreSQL. Connection pooling is handled by Prisma.
 * @see https://www.prisma.io/docs/guides/performance-and-optimization/connection-management
 */
async function connect() {
  try {
    await prisma.$connect();
    return prisma;
  } catch (err) {
    throw err;
  }
}

async function disconnect() {
  await prisma.$disconnect();
}

module.exports = { prisma, connect, disconnect };
