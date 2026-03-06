const { prisma } = require('../config/database');

async function findAll() {
  return prisma.contentView.findMany({ include: { session: true }, orderBy: { createdAt: 'desc' } });
}

async function findById(id) {
  return prisma.contentView.findUnique({ where: { id }, include: { session: true } });
}

async function create(data) {
  return prisma.contentView.create({ data });
}

async function update(id, data) {
  return prisma.contentView.update({ where: { id }, data });
}

async function remove(id) {
  return prisma.contentView.delete({ where: { id } });
}

module.exports = { findAll, findById, create, update, remove };
