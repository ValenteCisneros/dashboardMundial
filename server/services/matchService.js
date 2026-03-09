const { prisma } = require('../config/database');

async function findAll() {
  return prisma.match.findMany({ orderBy: { matchDate: 'asc' } });
}

async function findById(id) {
  return prisma.match.findUnique({ where: { id } });
}

async function findUpcoming(limit = 10) {
  const now = new Date();
  return prisma.match.findMany({
    where: { matchDate: { gte: now } },
    orderBy: { matchDate: 'asc' },
    take: limit,
  });
}

async function create(data) {
  return prisma.match.create({ data });
}

async function update(id, data) {
  return prisma.match.update({ where: { id }, data });
}

async function remove(id) {
  return prisma.match.delete({ where: { id } });
}

module.exports = { findAll, findById, findUpcoming, create, update, remove };
