const { prisma } = require('../config/database');

async function findAll() {
  return prisma.lead.findMany({ include: { session: true }, orderBy: { createdAt: 'desc' } });
}

async function findById(id) {
  return prisma.lead.findUnique({ where: { id }, include: { session: true } });
}

async function create(data) {
  return prisma.lead.create({ data });
}

async function update(id, data) {
  return prisma.lead.update({ where: { id }, data });
}

async function remove(id) {
  return prisma.lead.delete({ where: { id } });
}

module.exports = { findAll, findById, create, update, remove };
