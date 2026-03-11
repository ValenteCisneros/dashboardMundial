const { prisma } = require('../config/database');

function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

async function findAll() {
  return prisma.place.findMany({
    include: { advertiser: true },
    orderBy: { name: 'asc' },
  });
}

async function findById(id) {
  return prisma.place.findUnique({
    where: { id },
    include: { advertiser: true },
  });
}

async function findNearby({ lat, lng, limit = 20, sponsorsFirst = true }) {
  const places = await prisma.place.findMany({
    include: { advertiser: true },
  });
  const withDistance = places.map((p) => ({
    ...p,
    distanceKm: haversineKm(lat, lng, p.latitude, p.longitude),
  }));
  withDistance.sort((a, b) => {
    if (sponsorsFirst) {
      const aSponsor = a.advertiserId ? 1 : 0;
      const bSponsor = b.advertiserId ? 1 : 0;
      if (bSponsor !== aSponsor) return bSponsor - aSponsor;
    }
    return a.distanceKm - b.distanceKm;
  });
  return withDistance.slice(0, limit).map(({ distanceKm, ...p }) => ({ ...p, distanceKm }));
}

async function create(data) {
  return prisma.place.create({ data, include: { advertiser: true } });
}

async function update(id, data) {
  return prisma.place.update({ where: { id }, data, include: { advertiser: true } });
}

async function remove(id) {
  return prisma.place.delete({ where: { id } });
}

module.exports = { findAll, findById, findNearby, create, update, remove };
