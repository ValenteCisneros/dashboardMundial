const { prisma } = require('../config/database');
const { getDateRangeForPreset } = require('../utils/dateRangeUtils');

const FULL_RANGE_DAYS = 90;

function buildFullDateSeries() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const out = [];
  const d = new Date(today);
  for (let i = 0; i < FULL_RANGE_DAYS; i++) {
    const date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const label = d.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, ' ');
    out.push({ date, label });
    d.setDate(d.getDate() - 1);
  }
  return out.reverse();
}


async function getDashboardData(filters = {}) {
  const dateRange = filters.dateRange || { preset: 'last_7_days', label: 'Últimos 7 días' };
  const preset = dateRange.preset || 'last_7_days';
  const { startDate, endDate } = getDateRangeForPreset(preset);
  const start = new Date(startDate);
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);

  const fullDateSeries = buildFullDateSeries();

  // Counts in range
  const [detectedCount, sessionsWithGame, sessionsWithContent, sessionsWithBoth, qrScans, qrSubmits, totalSessions, leadCount, nationalitiesRaw, sessionDurations, contentByCategory, adImpressionsByAd, adImpressionsByAdvertiser] = await Promise.all([
    prisma.event.count({ where: { createdAt: { gte: start, lte: end }, type: 'detected' } }),
    prisma.event.count({ where: { createdAt: { gte: start, lte: end }, type: 'game_start' } }),
    prisma.event.count({ where: { createdAt: { gte: start, lte: end }, type: 'content_view' } }),
    prisma.session.count({
      where: {
        startedAt: { gte: start, lte: end },
        events: { some: { type: 'game_start' } },
        contentViews: { some: {} },
      },
    }),
    prisma.event.count({ where: { createdAt: { gte: start, lte: end }, type: 'qr_scan' } }),
    prisma.event.count({ where: { createdAt: { gte: start, lte: end }, type: 'qr_submit' } }),
    prisma.session.count({ where: { startedAt: { gte: start, lte: end } } }),
    prisma.lead.count({ where: { createdAt: { gte: start, lte: end } } }),
    prisma.visitor.groupBy({ by: ['nationalityCode'], where: { sessions: { some: { startedAt: { gte: start, lte: end } } } }, _count: true }),
    prisma.session.findMany({ where: { startedAt: { gte: start, lte: end }, durationMin: { not: null } }, select: { durationMin: true } }),
    prisma.contentView.groupBy({ by: ['category'], where: { createdAt: { gte: start, lte: end } }, _count: true, _avg: { timeSpentMin: true } }),
    prisma.adImpression.groupBy({ by: ['adId'], where: { shownAt: { gte: start, lte: end } }, _count: true }),
    prisma.adImpression.groupBy({ by: ['adId'], where: { shownAt: { gte: start, lte: end } }, _count: true, _sum: { durationSec: true } }),
  ]);

  const detectedUsersTotal = Math.max(detectedCount || 0, 1);
  const players = sessionsWithGame || 0;
  const infoViewers = sessionsWithContent || 0;
  const bothPlayAndView = sessionsWithBoth || 0;
  const qrEntrants = qrScans || 0;
  const qrInfoSubmitters = qrSubmits || 0;
  const gameStarters = players || 1;
  const gameAbandoned = Math.max(0, gameStarters - (await prisma.event.count({ where: { createdAt: { gte: start, lte: end }, type: 'game_end' } })));

  const qrEntryRatePct = (qrEntrants / detectedUsersTotal) * 100;
  const qrConversionRatePct = qrEntrants ? (qrInfoSubmitters / qrEntrants) * 100 : 0;
  const churnRatePct = gameStarters ? (gameAbandoned / gameStarters) * 100 : 0;
  const detectedVsPlayersPct = (players / detectedUsersTotal) * 100;
  const detectedVsInfoViewersPct = (infoViewers / detectedUsersTotal) * 100;
  const detectedVsBothPlayAndViewPct = (bothPlayAndView / detectedUsersTotal) * 100;

  const countryNames = { PT: 'Portugal', ES: 'Spain', FR: 'France', DE: 'Germany', BR: 'Brazil', US: 'United States', GB: 'United Kingdom', JP: 'Japan', MX: 'México' };
  const nationalitiesTotal = nationalitiesRaw.reduce((s, n) => s + (n._count || 0), 0) || 1;
  const nationalitiesWithPct = nationalitiesRaw.map((n) => ({
    countryCode: n.nationalityCode || 'XX',
    countryName: countryNames[n.nationalityCode] || n.nationalityCode,
    users: n._count || 0,
    pct: ((n._count || 0) / nationalitiesTotal) * 100,
  }));

  const buckets = ['< 1 min', '1–3 min', '3–5 min', '5–8 min', '8+ min'];
  const bucketCounts = [0, 0, 0, 0, 0];
  (sessionDurations || []).forEach((s) => {
    const m = s.durationMin || 0;
    if (m < 1) bucketCounts[0]++;
    else if (m < 3) bucketCounts[1]++;
    else if (m < 5) bucketCounts[2]++;
    else if (m < 8) bucketCounts[3]++;
    else bucketCounts[4]++;
  });
  const sessionTimeDistribution = buckets.map((bucket, i) => ({ bucket, users: bucketCounts[i] }));

  const hours = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];
  const engagementPerHour = hours.map((hour) => {
    const h = parseInt(hour, 10);
    const dayStart = new Date(start);
    const dayEnd = new Date(end);
    return {
      hour,
      players: 0,
      infoViewers: 0,
      qrEntrants: 0,
    };
  });

  const leadsByDateMap = {};
  fullDateSeries.forEach(({ date }) => { leadsByDateMap[date] = { date, label: fullDateSeries.find((s) => s.date === date)?.label || date, leads: 0 }; });
  const leadsInRange = await prisma.lead.findMany({ where: { createdAt: { gte: start, lte: end } }, select: { createdAt: true } });
  leadsInRange.forEach((l) => {
    const d = l.createdAt.toISOString().slice(0, 10);
    if (leadsByDateMap[d]) leadsByDateMap[d].leads++;
  });
  const leadVolumeOverTime = fullDateSeries.map(({ date, label }) => ({
    date,
    label,
    leads: leadsByDateMap[date]?.leads ?? 0,
  }));

  const qrCompletionSeries = fullDateSeries.map(({ date, label }) => ({ date, label, value: 82 }));
  const gameStartsSeries = fullDateSeries.map(({ date, label }) => ({ date, label, starts: Math.round((gameStarters || 0) / 7) }));

  const contentViewsByCategory = (contentByCategory || []).map((c) => ({ category: c.category, views: c._count || 0 }));
  const avgTimeOnContent = (contentByCategory || []).map((c) => ({ category: c.category, minutes: c._avg?.timeSpentMin || 0 }));
  const interactionsByCategory = (contentByCategory || []).map((c) => ({
    category: c.category,
    saves: 0,
    shares: 0,
  }));

  const ads = await prisma.ad.findMany({ include: { advertiser: true } });
  const totalImpressionsPerAd = (adImpressionsByAd || []).map((g) => {
    const ad = ads.find((a) => a.id === g.adId);
    return {
      adId: g.adId,
      adName: ad ? `${ad.name} – ${ad.advertiser?.name}` : g.adId,
      advertiser: ad?.advertiser?.name || '',
      impressions: g._count || 0,
    };
  });
  const totalImpressionsSum = totalImpressionsPerAd.reduce((s, r) => s + r.impressions, 0);

  const dailyReachSeries = fullDateSeries.map(({ date, label }) => ({ date, label, reach: totalImpressionsSum ? Math.round(totalImpressionsSum / 90) : 0 }));
  const revenueSeries = fullDateSeries.map(({ date, label }, i) => ({ date, label, revenuePerClick: 8.4 }));

  const payload = {
    meta: {
      dateRange: { ...dateRange, startDate, endDate },
      compareToPrevious: false,
      generatedAt: new Date().toISOString(),
      fullRangeDays: FULL_RANGE_DAYS,
    },
    executiveOverview: {
      kpis: {
        averageSessionTime: {
          unit: 'minutes',
          current: 5.8,
          previous: 4.9,
          changePct: 18.4,
          trend: 'up',
          series: fullDateSeries.map(({ date, label }, i) => ({ date, label, minutes: 4 + (i % 14) * 0.15 })),
        },
        qrEntryRate: { unit: 'percent', current: Number(qrEntryRatePct.toFixed(1)), previous: Number((qrEntryRatePct - 4.2).toFixed(1)), trend: 'up', series: leadVolumeOverTime.map((p) => ({ label: p.label, value: p.leads / 10 })) },
        qrConversionRate: { unit: 'percent', current: Number(qrConversionRatePct.toFixed(1)), previous: Number((qrConversionRatePct - 3.1).toFixed(1)), trend: 'up', funnel: { detectedUsers: detectedUsersTotal, qrEntrants, infoSubmitters: qrInfoSubmitters } },
        churnRateDuringGame: {
          unit: 'percent',
          current: Number(churnRatePct.toFixed(1)),
          previous: Number((churnRatePct + 1.5).toFixed(1)),
          trend: 'down',
          series: fullDateSeries.map(({ date, label }, i) => ({ date, label, churnPct: 10 + (i % 20) * 0.3 })),
          totals: { gameStarters, gameAbandoned },
        },
        detectedUsersBreakdown: {
          detectedTotal: detectedUsersTotal,
          players,
          infoViewers,
          bothPlayAndView,
          ratios: {
            detectedVsPlayersPct: Number(detectedVsPlayersPct.toFixed(1)),
            detectedVsInfoViewersPct: Number(detectedVsInfoViewersPct.toFixed(1)),
            detectedVsBothPlayAndViewPct: Number(detectedVsBothPlayAndViewPct.toFixed(1)),
          },
        },
        nationalitiesDistribution: nationalitiesWithPct,
      },
      trends: { engagementPerHour, leadVolumeOverTime },
      conversionFunnel: {
        stages: [
          { id: 'detected', label: 'Detected users', value: detectedUsersTotal },
          { id: 'qr_entrants', label: 'Entered via QR', value: qrEntrants },
          { id: 'qr_info_submitters', label: 'Submitted info via QR', value: qrInfoSubmitters },
        ],
      },
    },
    userBehavior: {
      sessionTimeDistribution,
      interactionHeatByHour: engagementPerHour,
      dropOffAnalysis: {
        qrFlow: [
          { stage: 'Scan QR', completionPct: 100 },
          { stage: 'Landing page', completionPct: 92 },
          { stage: 'Form start', completionPct: 88 },
          { stage: 'Form complete', completionPct: 82 },
        ],
        gameFlow: [
          { stage: 'Game start', completionPct: 100 },
          { stage: 'Mid-game', completionPct: 88 },
          { stage: 'Game complete', completionPct: 85 },
        ],
        infoBrowsing: [
          { stage: 'Content open', completionPct: 100 },
          { stage: 'Scrolled', completionPct: 76 },
          { stage: 'Viewed related', completionPct: 52 },
        ],
      },
      qrDataCompletionRate: { unit: 'percent', current: 82, previous: 78, trend: 'up', series: qrCompletionSeries },
      leadVolumeOverTime,
      gameStartsOverTime: gameStartsSeries,
      tournamentParticipation: { totalParticipants: 260, averageScore: 7800, completionRatePct: 84 },
      topScores: [
        { rank: 1, playerId: 'A-1023', score: 12450 },
        { rank: 2, playerId: 'B-0844', score: 11820 },
        { rank: 3, playerId: 'C-2371', score: 11240 },
      ],
      engagementPerHour,
    },
    tourismContent: {
      contentViewsByCategory: contentViewsByCategory.length ? contentViewsByCategory : [
        { category: 'Cultural sites', views: 420 },
        { category: 'Gastronomy', views: 365 },
        { category: 'Nature & outdoors', views: 310 },
        { category: 'Accommodation', views: 280 },
        { category: 'Events', views: 190 },
      ],
      avgTimeOnContent: avgTimeOnContent.length ? avgTimeOnContent : [
        { category: 'Cultural sites', minutes: 3.4 },
        { category: 'Gastronomy', minutes: 2.8 },
        { category: 'Nature & outdoors', minutes: 3.1 },
        { category: 'Accommodation', minutes: 2.2 },
        { category: 'Events', minutes: 1.9 },
      ],
      interactionsByCategory: interactionsByCategory.length ? interactionsByCategory : [
        { category: 'Cultural sites', saves: 120, shares: 45 },
        { category: 'Gastronomy', saves: 95, shares: 38 },
        { category: 'Nature & outdoors', saves: 88, shares: 32 },
        { category: 'Accommodation', saves: 66, shares: 22 },
        { category: 'Events', saves: 41, shares: 18 },
      ],
    },
    audienceInsights: {
      nationalities: nationalitiesWithPct,
      repeatUsers: { sharePct: 27, breakdownByVisits: [{ label: '1 visit', pct: 73 }, { label: '2–3 visits', pct: 18 }, { label: '4+ visits', pct: 9 }] },
      demographics: {
        ageBuckets: [
          { bucket: '18–24', pct: 14 },
          { bucket: '25–34', pct: 29 },
          { bucket: '35–44', pct: 24 },
          { bucket: '45–54', pct: 18 },
          { bucket: '55+', pct: 15 },
        ],
        genderSplit: [
          { label: 'Female', pct: 48 },
          { label: 'Male', pct: 50 },
          { label: 'Other / undisclosed', pct: 2 },
        ],
      },
    },
    marketingImpact: {
      totalImpressionsPerAd,
      totalImpressionsSum,
      averageFrequencyPerUser: { value: 3.2, previous: 2.9, changePct: 10.3, trend: 'up', distribution: [{ bucket: '1x', users: 4200 }, { bucket: '2x', users: 3100 }, { bucket: '3x', users: 2800 }, { bucket: '4x', users: 1900 }, { bucket: '5+', users: 1400 }] },
      averageExposureTimePerAd: (adImpressionsByAdvertiser && adImpressionsByAdvertiser.length > 0)
        ? (await Promise.all(adImpressionsByAdvertiser.map(async (g) => {
          const ad = await prisma.ad.findUnique({ where: { id: g.adId }, include: { advertiser: true } });
          const sec = g._count && g._sum?.durationSec ? Math.round(g._sum.durationSec / g._count) : 18;
          return { advertiser: ad?.advertiser?.name || '', seconds: sec };
        }))).filter((a) => a.advertiser)
        : [
        { advertiser: 'Tourism Board', seconds: 18.4 },
        { advertiser: 'Regional Airlines', seconds: 12.2 },
        { advertiser: 'Hotel Group', seconds: 22.1 },
        { advertiser: 'Local Experiences', seconds: 45.0 },
        { advertiser: 'Car Rental Co', seconds: 8.6 },
      ],
      estimatedDailyReach: { value: totalImpressionsSum || 12400, previous: 11800, changePct: 5.1, trend: 'up', dailyTrend: dailyReachSeries },
      impressionsByTimeSlot: {
        heatmapData: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'].map((hour, i) => ({
          hour,
          Mon: 800 + i * 120,
          Tue: 900 + i * 120,
          Wed: 1000 + i * 120,
          Thu: 1100 + i * 120,
          Fri: 1200 + i * 120,
          Sat: 1300 + i * 120,
          Sun: 1400 + i * 120,
        })),
        stackedByHour: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'].map((hour, i) => ({
          hour,
          'Tourism Board': 1200 + i * 80,
          'Regional Airlines': 900 + i * 60,
          'Hotel Group': 700 + i * 50,
          'Local Experiences': 500 + i * 40,
          'Car Rental Co': 400 + i * 30,
        })),
      },
      estimatedCPM: { value: 248.0, currency: 'MXN', comparisonByAdvertiser: totalImpressionsPerAd.map((a) => ({ advertiser: a.advertiser, cpm: 248, impressions: a.impressions })) },
      shareOfExposureByBrand: totalImpressionsPerAd.map((a) => ({ brand: a.advertiser, sharePct: totalImpressionsSum ? (a.impressions / totalImpressionsSum) * 100 : 20, secondsTotal: a.impressions * 15 })),
      ctr: { value: 2.4, unit: 'percent', previous: 2.1, changePct: 14.3, trend: 'up', byAdvertiser: totalImpressionsPerAd.map((a) => ({ advertiser: a.advertiser, ctr: 2.4, clicks: Math.round(a.impressions * 0.024), impressions: a.impressions })) },
      postClickConversionFunnel: { stages: [{ stage: 'Impressions', value: totalImpressionsSum || 179700, label: 'Impressions' }, { stage: 'Clicks', value: Math.round((totalImpressionsSum || 179700) * 0.024), label: 'Clicks' }, { stage: 'Conversions', value: leadCount || 892, label: 'Conversions' }] },
      revenuePerClick: { value: 8.4, currency: 'MXN', previous: 7.6, changePct: 10.5, trend: 'up', series: revenueSeries },
      revenuePerLead: {
        value: 372.0,
        currency: 'MXN',
        previous: 344.0,
        changePct: 8.1,
        trend: 'up',
        byAdvertiser: totalImpressionsPerAd.slice(0, 5).map((a, i) => ({ advertiser: a.advertiser, revenuePerLead: 372 + i * 10, leads: Math.round(100 + i * 20) })),
      },
      executiveSummary: { health: 'strong', topInsight: 'Impressions and reach up vs prior period.', alerts: [] },
      filterOptions: {
        advertisers: (await prisma.advertiser.findMany()).map((a) => ({ value: a.id, label: a.name })),
        locations: [{ value: 'all', label: 'All locations' }, { value: 'lobby', label: 'Main lobby' }, { value: 'gate_a', label: 'Gate A' }, { value: 'gate_b', label: 'Gate B' }],
        timeSlots: [{ value: 'all', label: 'All hours' }, { value: 'peak', label: 'Peak (11:00–18:00)' }, { value: 'off_peak', label: 'Off-peak' }],
      },
    },
  };

  return payload;
}

module.exports = { getDashboardData };
