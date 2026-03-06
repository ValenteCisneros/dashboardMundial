const { prisma } = require('../config/database');

async function findAll() {
  return prisma.visitor.findMany({ orderBy: { createdAt: 'desc' } });
}

async function findById(id) {
  return prisma.visitor.findUnique({ where: { id } });
}

async function create(data) {
  return prisma.visitor.create({ data });
}

async function update(id, data) {
  return prisma.visitor.update({ where: { id }, data });
}

async function remove(id) {
  return prisma.visitor.delete({ where: { id } });
}

module.exports = { findAll, findById, create, update, remove };
