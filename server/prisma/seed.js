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
