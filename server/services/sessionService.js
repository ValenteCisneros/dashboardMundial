const { prisma } = require('../config/database');

async function findAll() {
  return prisma.session.findMany({ include: { visitor: true }, orderBy: { startedAt: 'desc' } });
}

async function findById(id) {
  return prisma.session.findUnique({ where: { id }, include: { visitor: true, events: true } });
}

async function create(data) {
  return prisma.session.create({ data });
}

async function update(id, data) {
  return prisma.session.update({ where: { id }, data });
}

async function remove(id) {
  return prisma.session.delete({ where: { id } });
}

module.exports = { findAll, findById, create, update, remove };
