const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const now = new Date();
  const daysAgo = (d) => {
    const x = new Date(now);
    x.setDate(x.getDate() - d);
    return x;
  };

  const v1 = await prisma.visitor.upsert({
    where: { id: 'seed-visitor-1' },
    update: {},
    create: { id: 'seed-visitor-1', nationalityCode: 'PT', createdAt: daysAgo(5) },
  });
  const v2 = await prisma.visitor.upsert({
    where: { id: 'seed-visitor-2' },
    update: {},
    create: { id: 'seed-visitor-2', nationalityCode: 'ES', createdAt: daysAgo(3) },
  });
  const v3 = await prisma.visitor.upsert({
    where: { id: 'seed-visitor-3' },
    update: {},
    create: { id: 'seed-visitor-3', nationalityCode: 'MX', createdAt: daysAgo(1) },
  });

  const s1 = await prisma.session.upsert({
    where: { id: 'seed-session-1' },
    update: {},
    create: {
      id: 'seed-session-1',
      visitorId: v1.id,
      startedAt: daysAgo(2),
      endedAt: daysAgo(2),
      durationMin: 5,
    },
  });
  const s2 = await prisma.session.upsert({
    where: { id: 'seed-session-2' },
    update: {},
    create: {
      id: 'seed-session-2',
      visitorId: v2.id,
      startedAt: daysAgo(1),
      endedAt: daysAgo(1),
      durationMin: 3,
    },
  });

  await prisma.event.createMany({
    data: [
      { sessionId: s1.id, type: 'detected', createdAt: daysAgo(2) },
      { sessionId: s1.id, type: 'qr_scan', createdAt: daysAgo(2) },
      { sessionId: s1.id, type: 'game_start', createdAt: daysAgo(2) },
      { sessionId: s2.id, type: 'detected', createdAt: daysAgo(1) },
      { sessionId: s2.id, type: 'content_view', createdAt: daysAgo(1) },
    ],
    skipDuplicates: true,
  });

  await prisma.contentView.createMany({
    data: [
      { sessionId: s1.id, category: 'Cultural sites', timeSpentMin: 3.4 },
      { sessionId: s2.id, category: 'Gastronomy', timeSpentMin: 2.8 },
    ],
    skipDuplicates: true,
  });

  const adv1 = await prisma.advertiser.upsert({
    where: { id: 'seed-adv-1' },
    update: {},
    create: { id: 'seed-adv-1', name: 'Tourism Board' },
  });
  const adv2 = await prisma.advertiser.upsert({
    where: { id: 'seed-adv-2' },
    update: {},
    create: { id: 'seed-adv-2', name: 'Regional Airlines' },
  });
  const ad1 = await prisma.ad.upsert({
    where: { id: 'seed-ad-1' },
    update: {},
    create: { id: 'seed-ad-1', advertiserId: adv1.id, name: 'Hero – Tourism Board' },
  });
  const ad2 = await prisma.ad.upsert({
    where: { id: 'seed-ad-2' },
    update: {},
    create: { id: 'seed-ad-2', advertiserId: adv2.id, name: 'Banner – Regional Airlines' },
  });

  await prisma.adImpression.createMany({
    data: [
      { adId: ad1.id, sessionId: s1.id, durationSec: 18, shownAt: daysAgo(2) },
      { adId: ad2.id, sessionId: s1.id, durationSec: 12, shownAt: daysAgo(2) },
      { adId: ad1.id, sessionId: s2.id, durationSec: 20, shownAt: daysAgo(1) },
    ],
    skipDuplicates: true,
  });

  await prisma.lead.createMany({
    data: [
      { sessionId: s1.id, source: 'qr', createdAt: daysAgo(2) },
      { sessionId: s2.id, source: 'game', createdAt: daysAgo(1) },
    ],
    skipDuplicates: true,
  });

  // Monterrey places (lat/lng approximate); sponsors: adv1, adv2
  const monterreyCenter = { lat: 25.6866, lng: -100.3161 };
  const placesData = [
    { name: 'Macroplaza', latitude: 25.6700, longitude: -100.3100, category: 'Cultural', description: 'Plaza central y símbolo de Monterrey.', advertiserId: adv1.id },
    { name: 'Parque Fundidora', latitude: 25.6789, longitude: -100.2850, category: 'Nature', description: 'Parque urbano con museos y espacios verdes.', advertiserId: null },
    { name: 'Museo del Acero Horno 3', latitude: 25.6810, longitude: -100.2870, category: 'Cultural', description: 'Museo interactivo en el Parque Fundidora.', advertiserId: null },
    { name: 'Obispado', latitude: 25.6720, longitude: -100.3380, category: 'Cultural', description: 'Museo y mirador histórico.', advertiserId: adv2.id },
    { name: 'Gruta de García', latitude: 25.8750, longitude: -100.5200, category: 'Nature', description: 'Cavernas naturales cerca de Monterrey.', advertiserId: null },
    { name: 'Barrio Antiguo', latitude: 25.6680, longitude: -100.3180, category: 'Gastronomy', description: 'Zona de bares, restaurantes y vida nocturna.', advertiserId: null },
    { name: 'Cascada Cola de Caballo', latitude: 25.3667, longitude: -100.2333, category: 'Nature', description: 'Cascada y parque ecoturístico.', advertiserId: adv1.id },
  ];
  for (const p of placesData) {
    await prisma.place.upsert({
      where: { id: `seed-place-${p.name.replace(/\s+/g, '-').toLowerCase()}` },
      update: {},
      create: { id: `seed-place-${p.name.replace(/\s+/g, '-').toLowerCase()}`, ...p },
    });
  }

  // FIFA World Cup 2026 – partidos de ejemplo (México/Canadá/USA, jun–jul 2026)
  const june = (d) => new Date(2026, 5, d, 14, 0, 0);
  const july = (d) => new Date(2026, 6, d, 18, 0, 0);
  const matchesData = [
    { homeTeam: 'México', awayTeam: 'TBD', venue: 'Estadio BBVA (Monterrey)', matchDate: june(12), phase: 'group' },
    { homeTeam: 'USA', awayTeam: 'TBD', venue: 'Los Angeles', matchDate: june(11), phase: 'group' },
    { homeTeam: 'Canada', awayTeam: 'TBD', venue: 'Toronto', matchDate: june(13), phase: 'group' },
    { homeTeam: 'México', awayTeam: 'TBD', venue: 'Estadio BBVA (Monterrey)', matchDate: june(20), phase: 'group' },
    { homeTeam: 'TBD', awayTeam: 'TBD', venue: 'Estadio BBVA (Monterrey)', matchDate: july(4), phase: 'round_16' },
    { homeTeam: 'TBD', awayTeam: 'TBD', venue: 'Estadio Azteca (CDMX)', matchDate: july(5), phase: 'round_16' },
  ];
  for (let i = 0; i < matchesData.length; i++) {
    const m = matchesData[i];
    await prisma.match.upsert({
      where: { id: `seed-match-${i + 1}` },
      update: {},
      create: { id: `seed-match-${i + 1}`, ...m },
    });
  }

  console.log('Seed completed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
