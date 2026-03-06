const { prisma } = require('../config/database');

async function findAll() {
  return prisma.event.findMany({ include: { session: true }, orderBy: { createdAt: 'desc' } });
}

async function findById(id) {
  return prisma.event.findUnique({ where: { id }, include: { session: true } });
}

async function create(data) {
  return prisma.event.create({ data });
}

async function update(id, data) {
  return prisma.event.update({ where: { id }, data });
}

async function remove(id) {
  return prisma.event.delete({ where: { id } });
}

module.exports = { findAll, findById, create, update, remove };
