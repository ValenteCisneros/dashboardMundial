const NETWORK_DELAY_MS = 600;

const withLatency = (data, delay = NETWORK_DELAY_MS) =>
  new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });

export const DEFAULT_DATE_RANGE = {
  preset: 'last_7_days',
  label: 'Last 7 days',
};

/** Returns an array of formatted date strings for charts (e.g. "01 Mar 2026"). */
function getDateLabels(preset, count) {
  const today = new Date();
  let start = new Date(today);
  if (preset === 'this_month') {
    start = new Date(today.getFullYear(), today.getMonth(), 1);
  } else {
    start.setDate(start.getDate() - (count - 1));
  }
  const labels = [];
  const d = new Date(start);
  for (let i = 0; i < count; i++) {
    labels.push(
      d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, ' ')
    );
    d.setDate(d.getDate() + 1);
  }
  return labels;
}

const buildMockDashboardPayload = (filters) => {
  const { dateRange, compareToPrevious } = filters;
  const preset = dateRange?.preset || 'last_7_days';
  const dateLabels7 = getDateLabels(preset, 7);
  const dateLabels14 = getDateLabels(preset, 14);

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

  const leadVolumeOverTime = dateLabels7.map((label, index) => ({
    label,
    leads: 30 + index * 8,
  }));

  const averageSessionTimeSeries = dateLabels7.map((label, index) => ({
    label,
    minutes: 4 + index * 0.2,
  }));

  const churnRateSeries = dateLabels7.map((label, index) => ({
    label,
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
        series: dateLabels7.map((label, index) => ({
          label,
          value: 76 + index,
        })),
      },
      leadVolumeOverTime,
      gameStartsOverTime: dateLabels7.map((label, index) => ({
        label,
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
    marketingImpact: (() => {
      const advertisers = [
        { id: 'adv_1', name: 'Tourism Board', brandId: 'brand_1' },
        { id: 'adv_2', name: 'Regional Airlines', brandId: 'brand_2' },
        { id: 'adv_3', name: 'Hotel Group', brandId: 'brand_3' },
        { id: 'adv_4', name: 'Local Experiences', brandId: 'brand_4' },
        { id: 'adv_5', name: 'Car Rental Co', brandId: 'brand_5' },
      ];
      const totalImpressionsPerAd = [
        { adId: 'ad_tb_hero', adName: 'Hero – Tourism Board', advertiser: 'Tourism Board', impressions: 42800 },
        { adId: 'ad_ra_banner', adName: 'Banner – Regional Airlines', advertiser: 'Regional Airlines', impressions: 35200 },
        { adId: 'ad_hg_sidebar', adName: 'Sidebar – Hotel Group', advertiser: 'Hotel Group', impressions: 28900 },
        { adId: 'ad_le_video', adName: 'Video – Local Experiences', advertiser: 'Local Experiences', impressions: 24100 },
        { adId: 'ad_cr_footer', adName: 'Footer – Car Rental Co', advertiser: 'Car Rental Co', impressions: 19500 },
        { adId: 'ad_tb_promo', adName: 'Promo – Tourism Board', advertiser: 'Tourism Board', impressions: 16800 },
        { adId: 'ad_ra_sky', adName: 'Skyscraper – Regional Airlines', advertiser: 'Regional Airlines', impressions: 12400 },
      ];
      const totalImpressionsSum = totalImpressionsPerAd.reduce((s, r) => s + r.impressions, 0);
      const averageFrequencyPerUser = {
        value: 3.2,
        previous: 2.9,
        changePct: 10.3,
        trend: 'up',
        distribution: [
          { bucket: '1x', users: 4200 },
          { bucket: '2x', users: 3100 },
          { bucket: '3x', users: 2800 },
          { bucket: '4x', users: 1900 },
          { bucket: '5+', users: 1400 },
        ],
      };
      const averageExposureTimePerAd = [
        { advertiser: 'Tourism Board', seconds: 18.4, trend: [16, 17, 18, 17.5, 18.2, 18.4, 18.4] },
        { advertiser: 'Regional Airlines', seconds: 12.2, trend: [11, 11.5, 12, 12.2, 12.1, 12.2, 12.2] },
        { advertiser: 'Hotel Group', seconds: 22.1, trend: [20, 21, 21.5, 22, 21.8, 22, 22.1] },
        { advertiser: 'Local Experiences', seconds: 45.0, trend: [42, 43, 44, 44.5, 44.8, 45, 45] },
        { advertiser: 'Car Rental Co', seconds: 8.6, trend: [8, 8.2, 8.4, 8.5, 8.6, 8.6, 8.6] },
      ];
      const estimatedDailyReach = {
        value: 12400,
        previous: 11800,
        changePct: 5.1,
        trend: 'up',
        dailyTrend: dateLabels14.map((dateLabel, i) => ({
          date: dateLabel,
          reach: 10000 + Math.round(800 * Math.sin(i * 0.5) + 1200 * (i / 14)),
        })),
      };
      const hours = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];
      const impressionsByTimeSlot = {
        heatmapData: hours.map((hour, hi) => ({
          hour,
          ...Object.fromEntries(
            ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, di) => [
              day,
              800 + (hi * 120) + (di * 200) + Math.round(400 * Math.sin(hi * 0.8)),
            ])
          ),
        })),
        stackedByHour: hours.map((hour, i) => ({
          hour,
          'Tourism Board': 1200 + i * 80,
          'Regional Airlines': 900 + i * 60,
          'Hotel Group': 700 + i * 50,
          'Local Experiences': 500 + i * 40,
          'Car Rental Co': 400 + i * 30,
        })),
      };
      const estimatedCPM = {
        value: 248.0,
        currency: 'MXN',
        comparisonByAdvertiser: [
          { advertiser: 'Tourism Board', cpm: 284.0, impressions: 59600 },
          { advertiser: 'Regional Airlines', cpm: 236.0, impressions: 47600 },
          { advertiser: 'Hotel Group', cpm: 260.0, impressions: 28900 },
          { advertiser: 'Local Experiences', cpm: 210.0, impressions: 24100 },
          { advertiser: 'Car Rental Co', cpm: 256.0, impressions: 19500 },
        ],
      };
      const shareOfExposureByBrand = [
        { brand: 'Tourism Board', sharePct: 28.2, secondsTotal: 124000 },
        { brand: 'Regional Airlines', sharePct: 22.1, secondsTotal: 97200 },
        { brand: 'Hotel Group', sharePct: 18.4, secondsTotal: 81000 },
        { brand: 'Local Experiences', sharePct: 16.8, secondsTotal: 73800 },
        { brand: 'Car Rental Co', sharePct: 14.5, secondsTotal: 63800 },
      ];
      const ctr = {
        value: 2.4,
        unit: 'percent',
        previous: 2.1,
        changePct: 14.3,
        trend: 'up',
        byAdvertiser: [
          { advertiser: 'Tourism Board', ctr: 2.8, clicks: 1670, impressions: 59600 },
          { advertiser: 'Regional Airlines', ctr: 2.5, clicks: 1190, impressions: 47600 },
          { advertiser: 'Hotel Group', ctr: 2.2, clicks: 636, impressions: 28900 },
          { advertiser: 'Local Experiences', ctr: 2.6, clicks: 627, impressions: 24100 },
          { advertiser: 'Car Rental Co', ctr: 1.9, clicks: 371, impressions: 19500 },
        ],
      };
      const postClickConversionFunnel = {
        stages: [
          { stage: 'Impressions', value: 179700, label: 'Impressions' },
          { stage: 'Clicks', value: 4094, label: 'Clicks' },
          { stage: 'Conversions', value: 892, label: 'Conversions' },
        ],
      };
      const revenuePerClick = {
        value: 8.4,
        currency: 'MXN',
        previous: 7.6,
        changePct: 10.5,
        trend: 'up',
        series: dateLabels14.map((dateLabel, i) => ({
          date: dateLabel,
          revenuePerClick: Number((7.0 + (i / 14) * 2.0 + Math.sin(i * 0.4) * 0.6).toFixed(2)),
        })),
      };
      const revenuePerLead = {
        value: 372.0,
        currency: 'MXN',
        previous: 344.0,
        changePct: 8.1,
        trend: 'up',
        byAdvertiser: [
          { advertiser: 'Tourism Board', revenuePerLead: 404.0, leads: 312 },
          { advertiser: 'Regional Airlines', revenuePerLead: 356.0, leads: 245 },
          { advertiser: 'Hotel Group', revenuePerLead: 388.0, leads: 158 },
          { advertiser: 'Local Experiences', revenuePerLead: 324.0, leads: 112 },
          { advertiser: 'Car Rental Co', revenuePerLead: 300.0, leads: 65 },
        ],
      };
      const executiveSummary = {
        health: 'strong',
        topInsight: 'Impressions and reach up vs prior period; CTR and conversion funnel improving.',
        alerts: [],
      };
      const filterOptions = {
        advertisers: advertisers.map((a) => ({ value: a.id, label: a.name })),
        locations: [
          { value: 'all', label: 'All locations' },
          { value: 'lobby', label: 'Main lobby' },
          { value: 'gate_a', label: 'Gate A' },
          { value: 'gate_b', label: 'Gate B' },
        ],
        timeSlots: [
          { value: 'all', label: 'All hours' },
          { value: 'peak', label: 'Peak (11:00–18:00)' },
          { value: 'off_peak', label: 'Off-peak' },
        ],
      };
      return {
        totalImpressionsPerAd,
        totalImpressionsSum,
        averageFrequencyPerUser,
        averageExposureTimePerAd,
        estimatedDailyReach,
        impressionsByTimeSlot,
        estimatedCPM,
        shareOfExposureByBrand,
        ctr,
        postClickConversionFunnel,
        revenuePerClick,
        revenuePerLead,
        executiveSummary,
        filterOptions,
      };
    })(),
  };

  return payload;
};

export const fetchDashboardData = async (filters = {}) => {
  const mergedFilters = {
    dateRange: filters.dateRange || DEFAULT_DATE_RANGE,
    compareToPrevious: filters.compareToPrevious ?? false,
  };

  return withLatency(buildMockDashboardPayload(mergedFilters));
};

