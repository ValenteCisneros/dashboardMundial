const NETWORK_DELAY_MS = 600;

const withLatency = (data, delay = NETWORK_DELAY_MS) =>
  new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });

export const DEFAULT_DATE_RANGE = {
  preset: 'last_7_days',
  label: 'Last 7 days',
};

const buildMockDashboardPayload = (filters) => {
  const { dateRange, compareToPrevious } = filters;

  const detectedUsersTotal = 1200;
  const players = 540;
  const infoViewers = 420;
  const bothPlayAndView = 260;

  const qrEntrants = 380;
  const qrInfoSubmitters = 310;

  const qrEntryRatePct = (qrEntrants / detectedUsersTotal) * 100;
  const qrConversionRatePct = (qrInfoSubmitters / qrEntrants) * 100;

  const gameStarters = 600;
  const gameAbandoned = 90;
  const churnRatePct = (gameAbandoned / gameStarters) * 100;

  const detectedVsPlayersPct = (players / detectedUsersTotal) * 100;
  const detectedVsInfoViewersPct = (infoViewers / detectedUsersTotal) * 100;
  const detectedVsBothPlayAndViewPct = (bothPlayAndView / detectedUsersTotal) * 100;

  const nationalities = [
    { countryCode: 'PT', countryName: 'Portugal', users: 240 },
    { countryCode: 'ES', countryName: 'Spain', users: 180 },
    { countryCode: 'FR', countryName: 'France', users: 140 },
    { countryCode: 'DE', countryName: 'Germany', users: 120 },
    { countryCode: 'BR', countryName: 'Brazil', users: 95 },
    { countryCode: 'US', countryName: 'United States', users: 80 },
    { countryCode: 'GB', countryName: 'United Kingdom', users: 70 },
    { countryCode: 'JP', countryName: 'Japan', users: 55 },
  ];

  const nationalitiesTotal = nationalities.reduce((sum, n) => sum + n.users, 0);
  const nationalitiesWithPct = nationalities.map((n) => ({
    ...n,
    pct: (n.users / nationalitiesTotal) * 100,
  }));

  const hourlyLabels = [
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
    '19:00',
  ];

  const engagementPerHour = hourlyLabels.map((label, index) => ({
    hour: label,
    players: 30 + index * 4,
    infoViewers: 20 + index * 3,
    qrEntrants: 15 + index * 2,
  }));

  const leadVolumeOverTime = Array.from({ length: 7 }).map((_, index) => ({
    label: `Day ${index + 1}`,
    leads: 30 + index * 8,
  }));

  const averageSessionTimeSeries = Array.from({ length: 7 }).map((_, index) => ({
    label: `Day ${index + 1}`,
    minutes: 4 + index * 0.2,
  }));

  const churnRateSeries = Array.from({ length: 7 }).map((_, index) => ({
    label: `Day ${index + 1}`,
    churnPct: 10 + index * 0.5,
  }));

  const payload = {
    meta: {
      dateRange,
      compareToPrevious,
      generatedAt: new Date().toISOString(),
    },
    executiveOverview: {
      kpis: {
        averageSessionTime: {
          unit: 'minutes',
          current: 5.8,
          previous: 4.9,
          changePct: 18.4,
          trend: 'up',
          series: averageSessionTimeSeries,
        },
        qrEntryRate: {
          unit: 'percent',
          current: Number(qrEntryRatePct.toFixed(1)),
          previous: Number((qrEntryRatePct - 4.2).toFixed(1)),
          trend: 'up',
          series: leadVolumeOverTime.map((point) => ({
            label: point.label,
            value: point.leads / 10,
          })),
        },
        qrConversionRate: {
          unit: 'percent',
          current: Number(qrConversionRatePct.toFixed(1)),
          previous: Number((qrConversionRatePct - 3.1).toFixed(1)),
          trend: 'up',
          funnel: {
            detectedUsers: detectedUsersTotal,
            qrEntrants,
            infoSubmitters: qrInfoSubmitters,
          },
        },
        churnRateDuringGame: {
          unit: 'percent',
          current: Number(churnRatePct.toFixed(1)),
          previous: Number((churnRatePct + 1.5).toFixed(1)),
          trend: 'down',
          series: churnRateSeries,
          totals: {
            gameStarters,
            gameAbandoned,
          },
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
      trends: {
        engagementPerHour,
        leadVolumeOverTime,
      },
      conversionFunnel: {
        stages: [
          {
            id: 'detected',
            label: 'Detected users',
            value: detectedUsersTotal,
          },
          {
            id: 'qr_entrants',
            label: 'Entered via QR',
            value: qrEntrants,
          },
          {
            id: 'qr_info_submitters',
            label: 'Submitted info via QR',
            value: qrInfoSubmitters,
          },
        ],
      },
    },
    userBehavior: {
      sessionTimeDistribution: [
        { bucket: '< 1 min', users: 80 },
        { bucket: '1–3 min', users: 260 },
        { bucket: '3–5 min', users: 310 },
        { bucket: '5–8 min', users: 220 },
        { bucket: '8+ min', users: 120 },
      ],
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
      qrDataCompletionRate: {
        unit: 'percent',
        current: 82,
        previous: 78,
        trend: 'up',
        series: Array.from({ length: 7 }).map((_, index) => ({
          label: `Day ${index + 1}`,
          value: 76 + index,
        })),
      },
      leadVolumeOverTime,
      gameStartsOverTime: Array.from({ length: 7 }).map((_, index) => ({
        label: `Day ${index + 1}`,
        starts: gameStarters / 7 + index * 5,
      })),
      tournamentParticipation: {
        totalParticipants: 260,
        averageScore: 7800,
        completionRatePct: 84,
      },
      topScores: [
        { rank: 1, playerId: 'A-1023', score: 12450 },
        { rank: 2, playerId: 'B-0844', score: 11820 },
        { rank: 3, playerId: 'C-2371', score: 11240 },
      ],
      engagementPerHour,
    },
    tourismContent: {
      contentViewsByCategory: [
        { category: 'Cultural sites', views: 420 },
        { category: 'Gastronomy', views: 365 },
        { category: 'Nature & outdoors', views: 310 },
        { category: 'Accommodation', views: 280 },
        { category: 'Events', views: 190 },
      ],
      avgTimeOnContent: [
        { category: 'Cultural sites', minutes: 3.4 },
        { category: 'Gastronomy', minutes: 2.8 },
        { category: 'Nature & outdoors', minutes: 3.1 },
        { category: 'Accommodation', minutes: 2.2 },
        { category: 'Events', minutes: 1.9 },
      ],
      interactionsByCategory: [
        { category: 'Cultural sites', saves: 120, shares: 45 },
        { category: 'Gastronomy', saves: 95, shares: 38 },
        { category: 'Nature & outdoors', saves: 88, shares: 32 },
        { category: 'Accommodation', saves: 66, shares: 22 },
        { category: 'Events', saves: 41, shares: 18 },
      ],
    },
    audienceInsights: {
      nationalities: nationalitiesWithPct,
      repeatUsers: {
        sharePct: 27,
        breakdownByVisits: [
          { label: '1 visit', pct: 73 },
          { label: '2–3 visits', pct: 18 },
          { label: '4+ visits', pct: 9 },
        ],
      },
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
      leadsAcquired: {
        current: qrInfoSubmitters,
        previous: 270,
        changePct: Number((((qrInfoSubmitters - 270) / 270) * 100).toFixed(1)),
        series: leadVolumeOverTime,
      },
      exports: {
        pdfExportsCount: 12,
        csvExportsCount: 34,
      },
      campaignAttribution: [
        { channel: 'On-site kiosk', leads: 210 },
        { channel: 'Partner QR placements', leads: 65 },
        { channel: 'Social amplification', leads: 35 },
      ],
    },
  };

  return payload;
};

export const fetchDashboardData = async (filters = {}) => {
  const mergedFilters = {
    dateRange: filters.dateRange || DEFAULT_DATE_RANGE,
    compareToPrevious: filters.compareToPrevious ?? true,
  };

  return withLatency(buildMockDashboardPayload(mergedFilters));
};

