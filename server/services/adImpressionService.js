const { prisma } = require('../config/database');

async function findAll() {
  return prisma.adImpression.findMany({ include: { ad: true, session: true }, orderBy: { shownAt: 'desc' } });
}

async function findById(id) {
  return prisma.adImpression.findUnique({ where: { id }, include: { ad: true, session: true } });
}

async function create(data) {
  return prisma.adImpression.create({ data });
}

async function update(id, data) {
  return prisma.adImpression.update({ where: { id }, data });
}

async function remove(id) {
  return prisma.adImpression.delete({ where: { id } });
}

module.exports = { findAll, findById, create, update, remove };
