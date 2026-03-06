const { prisma } = require('../config/database');

async function findAll() {
  return prisma.advertiser.findMany({ include: { ads: true } });
}

async function findById(id) {
  return prisma.advertiser.findUnique({ where: { id }, include: { ads: true } });
}

async function create(data) {
  return prisma.advertiser.create({ data });
}

async function update(id, data) {
  return prisma.advertiser.update({ where: { id }, data });
}

async function remove(id) {
  return prisma.advertiser.delete({ where: { id } });
}

module.exports = { findAll, findById, create, update, remove };
