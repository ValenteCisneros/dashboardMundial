const { prisma } = require('../config/database');

async function findAll() {
  return prisma.ad.findMany({ include: { advertiser: true } });
}

async function findById(id) {
  return prisma.ad.findUnique({ where: { id }, include: { advertiser: true } });
}

async function create(data) {
  return prisma.ad.create({ data });
}

async function update(id, data) {
  return prisma.ad.update({ where: { id }, data });
}

async function remove(id) {
  return prisma.ad.delete({ where: { id } });
}

module.exports = { findAll, findById, create, update, remove };
