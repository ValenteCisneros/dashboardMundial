import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { get, post } from '../api/client';
import 'leaflet/dist/leaflet.css';
import './TurismoMonterreyPage.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const submitLeadDummy = () =>
  new Promise((resolve) => setTimeout(resolve, 800));

const STEPS = { hero: 'hero', form: 'form', success: 'success' };

const DUMMY_DATA = {
  firstName: 'Juan',
  lastName: 'García López',
  email: 'juan.garcia@ejemplo.com',
  phone: '+52 81 1234 5678',
};

const PLACEHOLDER_IMG = (seed, w = 800, h = 500) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

const DUMMY_PLACES = [
  { id: '1', name: 'Macroplaza', category: 'Cultural', description: 'Plaza central y símbolo de Monterrey.', distanceKm: 0.5, latitude: 25.67, longitude: -100.31, advertiser: { name: 'Tourism Board' }, imageUrl: PLACEHOLDER_IMG('macroplaza') },
  { id: '2', name: 'Parque Fundidora', category: 'Nature', description: 'Parque urbano con museos y espacios verdes.', distanceKm: 2.1, latitude: 25.6789, longitude: -100.285, advertiser: null, imageUrl: PLACEHOLDER_IMG('fundidora') },
  { id: '3', name: 'Museo del Acero Horno 3', category: 'Cultural', description: 'Museo interactivo en el Parque Fundidora.', distanceKm: 2.3, latitude: 25.681, longitude: -100.287, advertiser: null, imageUrl: PLACEHOLDER_IMG('museo') },
  { id: '4', name: 'Obispado', category: 'Cultural', description: 'Museo y mirador histórico.', distanceKm: 1.8, latitude: 25.672, longitude: -100.338, advertiser: { name: 'Regional Airlines' }, imageUrl: PLACEHOLDER_IMG('obispado') },
  { id: '5', name: 'Barrio Antiguo', category: 'Gastronomy', description: 'Zona de bares, restaurantes y vida nocturna.', distanceKm: 0.8, latitude: 25.668, longitude: -100.318, advertiser: null, imageUrl: PLACEHOLDER_IMG('barrio') },
];

const DUMMY_MATCHES = [
  { id: '1', homeTeam: 'México', awayTeam: 'TBD', venue: 'Estadio BBVA (Monterrey)', matchDate: '2026-06-12T19:00:00', phase: 'group' },
  { id: '2', homeTeam: 'USA', awayTeam: 'TBD', venue: 'Los Angeles', matchDate: '2026-06-11T14:00:00', phase: 'group' },
  { id: '3', homeTeam: 'México', awayTeam: 'TBD', venue: 'Estadio BBVA (Monterrey)', matchDate: '2026-06-20T19:00:00', phase: 'group' },
  { id: '4', homeTeam: 'TBD', awayTeam: 'TBD', venue: 'Estadio BBVA (Monterrey)', matchDate: '2026-07-04T18:00:00', phase: 'round_16' },
];

const initialForm = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  consentNewsletter: true,
};

const ACCEPT_FILE = '.pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg';

const MONTERREY_DEFAULT = { lat: 25.6866, lng: -100.3161 };

const TRANSLATIONS = {
  es: {
    heroBadge: 'Kiosko · Monterrey',
    heroTitle1: 'Reclama tu',
    heroTitle2: 'recompensa',
    heroDesc: 'Completaste el juego. Descubre sitios cercanos, el Mundial 2026 e introduce tus datos para recibir tu premio.',
    ctaClaim: 'Reclamar recompensa',
    sponsored: 'Patrocinado',
    adPlaceholder: 'Espacio publicitario',
    sectionNearby: 'Sitios cercanos para visitar',
    sectionNearbyDesc: 'Lugares recomendados en Monterrey (sponsors primero)',
    phaseGroup: 'Fase de grupos',
    phaseRound16: 'Octavos',
    sectionWorldCup: 'FIFA World Cup 2026',
    sectionWorldCupDesc: 'Próximos partidos – sedes en México, USA y Canadá',
    back: '← Volver',
    formTitle: 'Datos para tu recompensa',
    formSubtitle: 'Sube tu documento o rellena manualmente',
    formDocLabel: 'Rellenar con documento (pasaporte o identificación)',
    formDocHint: 'Sube un archivo PDF, PNG o JPG para rellenar los datos automáticamente.',
    chooseFile: 'Elegir archivo (PDF, PNG o JPG)',
    firstName: 'Nombre',
    lastName: 'Apellidos',
    email: 'Correo electrónico *',
    phone: 'Teléfono (opcional)',
    placeholderName: 'Tu nombre',
    placeholderLast: 'Tus apellidos',
    placeholderEmail: 'correo@ejemplo.com',
    consent: 'Acepto recibir noticias, ofertas y novedades de turismo en Monterrey a mi correo.',
    submit: 'Enviar y reclamar',
    submitting: 'Enviando…',
    promo: '¿Eres empresa? Promociona tu negocio en nuestros kioskos.',
    contact: 'Contactar',
    successTitle: '¡Listo!',
    successText: 'Te enviaremos noticias, ofertas y novedades de turismo en Monterrey a',
    successSub: 'Revisa tu bandeja de entrada y no olvides tu carpeta de spam.',
    sponsor: 'Sponsor',
  },
  en: {
    heroBadge: 'Kiosk · Monterrey',
    heroTitle1: 'Claim your',
    heroTitle2: 'reward',
    heroDesc: 'You completed the game. Discover nearby places, the 2026 World Cup and enter your details to receive your prize.',
    ctaClaim: 'Claim reward',
    sponsored: 'Sponsored',
    adPlaceholder: 'Advertising space',
    sectionNearby: 'Nearby places to visit',
    sectionNearbyDesc: 'Recommended places in Monterrey (sponsors first)',
    phaseGroup: 'Group stage',
    phaseRound16: 'Round of 16',
    sectionWorldCup: 'FIFA World Cup 2026',
    sectionWorldCupDesc: 'Upcoming matches – venues in Mexico, USA and Canada',
    back: '← Back',
    formTitle: 'Details for your reward',
    formSubtitle: 'Upload your document or fill in manually',
    formDocLabel: 'Fill with document (passport or ID)',
    formDocHint: 'Upload a PDF, PNG or JPG file to fill in your details automatically.',
    chooseFile: 'Choose file (PDF, PNG or JPG)',
    firstName: 'First name',
    lastName: 'Last name',
    email: 'Email *',
    phone: 'Phone (optional)',
    placeholderName: 'Your first name',
    placeholderLast: 'Your last name',
    placeholderEmail: 'email@example.com',
    consent: 'I agree to receive news, offers and tourism updates for Monterrey by email.',
    submit: 'Submit and claim',
    submitting: 'Submitting…',
    promo: 'Are you a business? Promote your brand on our kiosks.',
    contact: 'Contact',
    successTitle: 'Done!',
    successText: 'We will send you news, offers and tourism updates for Monterrey at',
    successSub: 'Check your inbox and don’t forget your spam folder.',
    sponsor: 'Sponsor',
  },
};

function formatMatchDate(iso, locale = 'es-MX') {
  const d = new Date(iso);
  return d.toLocaleDateString(locale, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function recordImpression(placement, adId, clicked = false) {
  post('ad-impressions', { placement, adId, clicked, durationSec: clicked ? 5 : 3 }).catch(() => {});
}

export function TurismoMonterreyPage() {
  const [lang, setLang] = useState('es');
  const [step, setStep] = useState(STEPS.hero);
  const [form, setForm] = useState(initialForm);
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [places, setPlaces] = useState(DUMMY_PLACES);
  const [matches, setMatches] = useState(DUMMY_MATCHES);
  const recordedPlacements = useRef(new Set());

  const t = TRANSLATIONS[lang];
  const locale = lang === 'es' ? 'es-MX' : 'en-US';

  const observeAdSlot = useCallback((el, placement, adId) => {
    if (!el || recordedPlacements.current.has(placement)) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          recordedPlacements.current.add(placement);
          recordImpression(placement, adId);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const heroAdRef = useRef(null);
  const midAdRef = useRef(null);
  const footerAdRef = useRef(null);

  useEffect(() => {
    get('places/nearby?lat=' + MONTERREY_DEFAULT.lat + '&lng=' + MONTERREY_DEFAULT.lng + '&limit=10')
      .then(setPlaces)
      .catch(() => setPlaces(DUMMY_PLACES));
    get('matches/upcoming?limit=5')
      .then(setMatches)
      .catch(() => setMatches(DUMMY_MATCHES));
  }, []);

  useEffect(() => {
    if (step !== STEPS.hero) return;
    const a = heroAdRef.current;
    const b = midAdRef.current;
    const c = footerAdRef.current;
    const un1 = a ? observeAdSlot(a, 'turismo_hero', 'seed-ad-1') : undefined;
    const un2 = b ? observeAdSlot(b, 'turismo_mid', 'seed-ad-2') : undefined;
    const un3 = c ? observeAdSlot(c, 'turismo_footer', 'seed-ad-1') : undefined;
    return () => { un1?.(); un2?.(); un3?.(); };
  }, [step, observeAdSlot]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm((prev) => ({ ...prev, ...DUMMY_DATA }));
    e.target.value = '';
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setSubmitError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitting(true);
    try {
      await submitLeadDummy();
      setStep(STEPS.success);
    } catch (err) {
      setSubmitError(err?.message || 'Error al enviar. Intenta de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  const canSubmit = form.email.trim().length > 0;

  return (
    <div className="turismo-page">
      <div className="turismo-lang-switcher" role="group" aria-label="Idioma / Language">
        <button
          type="button"
          className={'turismo-lang-btn' + (lang === 'es' ? ' turismo-lang-btn--active' : '')}
          onClick={() => setLang('es')}
        >
          ES
        </button>
        <button
          type="button"
          className={'turismo-lang-btn' + (lang === 'en' ? ' turismo-lang-btn--active' : '')}
          onClick={() => setLang('en')}
        >
          EN
        </button>
      </div>
      <div className="turismo-bg" aria-hidden="true" />
      <div className="turismo-content">
        {step === STEPS.hero && (
          <div className="turismo-hero-wrap">
            <div className="turismo-hero-float-wrap">
              <div className="turismo-fifa-float turismo-fifa-float--tl">
                {matches[0] && (
                  <div className="turismo-match-card turismo-match-card--float">
                    <div className="turismo-match-teams">{matches[0].homeTeam} vs {matches[0].awayTeam}</div>
                    <div className="turismo-match-meta">{matches[0].venue}</div>
                    <div className="turismo-match-date">{formatMatchDate(matches[0].matchDate, locale)}</div>
                    <span className="turismo-match-phase">{matches[0].phase === 'group' ? t.phaseGroup : t.phaseRound16}</span>
                  </div>
                )}
              </div>
              <div className="turismo-fifa-float turismo-fifa-float--tr">
                {matches[1] && (
                  <div className="turismo-match-card turismo-match-card--float">
                    <div className="turismo-match-teams">{matches[1].homeTeam} vs {matches[1].awayTeam}</div>
                    <div className="turismo-match-meta">{matches[1].venue}</div>
                    <div className="turismo-match-date">{formatMatchDate(matches[1].matchDate, locale)}</div>
                    <span className="turismo-match-phase">{matches[1].phase === 'group' ? t.phaseGroup : t.phaseRound16}</span>
                  </div>
                )}
              </div>
              <section className="turismo-hero" data-step="hero">
                <div
                  className="turismo-hero-bg-img"
                  style={{ backgroundImage: `url(${PLACEHOLDER_IMG('monterrey-hero', 1200, 600)})` }}
                  aria-hidden="true"
                />
                <div className="turismo-hero-badge">{t.heroBadge}</div>
                <h1 className="turismo-hero-title">
                  <span className="turismo-hero-title-line">{t.heroTitle1}</span>
                  <span className="turismo-hero-title-line turismo-hero-title-accent">{t.heroTitle2}</span>
                </h1>
                <p className="turismo-hero-desc">{t.heroDesc}</p>
                <button
                  type="button"
                  className="turismo-cta turismo-cta-primary"
                  onClick={() => setStep(STEPS.form)}
                >
                  {t.ctaClaim}
                </button>
              </section>
              <div className="turismo-fifa-float turismo-fifa-float--bl">
                {matches[2] && (
                  <div className="turismo-match-card turismo-match-card--float">
                    <div className="turismo-match-teams">{matches[2].homeTeam} vs {matches[2].awayTeam}</div>
                    <div className="turismo-match-meta">{matches[2].venue}</div>
                    <div className="turismo-match-date">{formatMatchDate(matches[2].matchDate, locale)}</div>
                    <span className="turismo-match-phase">{matches[2].phase === 'group' ? t.phaseGroup : t.phaseRound16}</span>
                  </div>
                )}
              </div>
              <div className="turismo-fifa-float turismo-fifa-float--br">
                {matches[3] && (
                  <div className="turismo-match-card turismo-match-card--float">
                    <div className="turismo-match-teams">{matches[3].homeTeam} vs {matches[3].awayTeam}</div>
                    <div className="turismo-match-meta">{matches[3].venue}</div>
                    <div className="turismo-match-date">{formatMatchDate(matches[3].matchDate, locale)}</div>
                    <span className="turismo-match-phase">{matches[3].phase === 'group' ? t.phaseGroup : t.phaseRound16}</span>
                  </div>
                )}
              </div>
            </div>

            <div ref={heroAdRef} className="turismo-ad-slot turismo-ad-slot--hero">
              <span className="turismo-ad-label">{t.sponsored}</span>
              <div className="turismo-ad-image" style={{ backgroundImage: `url(${PLACEHOLDER_IMG('ad-hero', 800, 250)})` }} />
              <div className="turismo-ad-placeholder">{t.adPlaceholder}</div>
            </div>

            <section className="turismo-section">
              <h2 className="turismo-section-title">{t.sectionNearby}</h2>
              <p className="turismo-section-desc">{t.sectionNearbyDesc}</p>
              <div className="turismo-map-wrap">
                <MapContainer
                  center={[MONTERREY_DEFAULT.lat, MONTERREY_DEFAULT.lng]}
                  zoom={13}
                  className="turismo-map"
                  scrollWheelZoom={true}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {places
                    .filter((p) => p.latitude != null && p.longitude != null)
                    .map((place) => (
                      <Marker key={place.id} position={[place.latitude, place.longitude]}>
                        <Popup>
                          <strong>{place.name}</strong>
                          {place.category && <span> · {place.category}</span>}
                          {place.distanceKm != null && <div>{place.distanceKm.toFixed(1)} km</div>}
                        </Popup>
                      </Marker>
                    ))}
                </MapContainer>
              </div>
              <ul className="turismo-places-list">
                {places.slice(0, 5).map((place) => (
                  <li key={place.id} className="turismo-place-card">
                    {place.advertiser && <span className="turismo-place-sponsor">{t.sponsor}</span>}
                    <div className="turismo-place-image-wrap">
                      <img
                        src={place.imageUrl || PLACEHOLDER_IMG(place.id)}
                        alt=""
                        className="turismo-place-image"
                      />
                    </div>
                    <div className="turismo-place-info">
                      <strong className="turismo-place-name">{place.name}</strong>
                      <span className="turismo-place-meta">{place.category} · {place.distanceKm != null ? `${place.distanceKm.toFixed(1)} km` : ''}</span>
                      {place.description && <p className="turismo-place-desc">{place.description}</p>}
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <div ref={midAdRef} className="turismo-ad-slot">
              <span className="turismo-ad-label">{t.sponsored}</span>
              <div className="turismo-ad-image turismo-ad-image--mid" style={{ backgroundImage: `url(${PLACEHOLDER_IMG('ad-mid', 800, 200)})` }} />
              <div className="turismo-ad-placeholder">{t.adPlaceholder}</div>
            </div>

            <section className="turismo-section turismo-worldcup">
              <div className="turismo-section-banner" style={{ backgroundImage: `url(${PLACEHOLDER_IMG('worldcup', 800, 320)})` }} aria-hidden="true" />
              <h2 className="turismo-section-title">{t.sectionWorldCup}</h2>
              <p className="turismo-section-desc">{t.sectionWorldCupDesc}</p>
            </section>

            <div ref={footerAdRef} className="turismo-ad-slot">
              <span className="turismo-ad-label">{t.sponsored}</span>
              <div className="turismo-ad-image turismo-ad-image--footer" style={{ backgroundImage: `url(${PLACEHOLDER_IMG('ad-footer', 800, 180)})` }} />
              <div className="turismo-ad-placeholder">{t.adPlaceholder}</div>
            </div>
          </div>
        )}

        {step === STEPS.form && (
          <section className="turismo-form-section" data-step="form">
            <button
              type="button"
              className="turismo-form-back"
              onClick={() => setStep(STEPS.hero)}
              aria-label={t.back}
            >
              {t.back}
            </button>
            <div className="turismo-form-card">
              <h2 className="turismo-form-title">{t.formTitle}</h2>
              <p className="turismo-form-subtitle">{t.formSubtitle}</p>

              <div className="turismo-upload-block">
                <label className="turismo-label">{t.formDocLabel}</label>
                <p className="turismo-upload-hint">{t.formDocHint}</p>
                <label className="turismo-file-label">
                  <input
                    type="file"
                    accept={ACCEPT_FILE}
                    onChange={handleFileChange}
                    className="turismo-file-input"
                  />
                  <span className="turismo-file-cta">{t.chooseFile}</span>
                </label>
              </div>

              <form onSubmit={handleSubmit} className="turismo-form">
                <div className="turismo-form-grid">
                  <div className="turismo-field">
                    <label className="turismo-label" htmlFor="firstName">{t.firstName}</label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      className="turismo-input"
                      value={form.firstName}
                      onChange={handleChange}
                      placeholder={t.placeholderName}
                      autoComplete="given-name"
                    />
                  </div>
                  <div className="turismo-field">
                    <label className="turismo-label" htmlFor="lastName">{t.lastName}</label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      className="turismo-input"
                      value={form.lastName}
                      onChange={handleChange}
                      placeholder={t.placeholderLast}
                      autoComplete="family-name"
                    />
                  </div>
                </div>
                <div className="turismo-field">
                  <label className="turismo-label" htmlFor="email">{t.email}</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="turismo-input"
                    value={form.email}
                    onChange={handleChange}
                    placeholder={t.placeholderEmail}
                    autoComplete="email"
                    required
                  />
                </div>
                <div className="turismo-field">
                  <label className="turismo-label" htmlFor="phone">{t.phone}</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    className="turismo-input"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+52 81 1234 5678"
                    autoComplete="tel"
                  />
                </div>
                <label className="turismo-checkbox-wrap">
                  <input
                    type="checkbox"
                    name="consentNewsletter"
                    checked={form.consentNewsletter}
                    onChange={handleChange}
                    className="turismo-checkbox"
                  />
                  <span className="turismo-checkbox-label">{t.consent}</span>
                </label>
                {submitError && <p className="turismo-error">{submitError}</p>}
                <button
                  type="submit"
                  className="turismo-cta turismo-cta-primary turismo-cta-submit"
                  disabled={!canSubmit || submitting}
                >
                  {submitting ? t.submitting : t.submit}
                </button>
              </form>
              <div className="turismo-promo-strip">
                <p>
                  {t.promo}{' '}
                  <a href="mailto:publicidad@turismomonterrey.example">{t.contact}</a>
                </p>
              </div>
            </div>
          </section>
        )}

        {step === STEPS.success && (
          <section className="turismo-success turismo-success-wrap" data-step="success">
            <div className="turismo-confetti" aria-hidden="true">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="turismo-confetti-piece" />
              ))}
            </div>
            <div className="turismo-success-icon" aria-hidden="true">
              <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="32" cy="32" r="30" stroke="currentColor" strokeWidth="3" />
                <path d="M20 32l8 8 16-16" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 className="turismo-success-title">{t.successTitle}</h2>
            <p className="turismo-success-text">
              {t.successText} <strong>{form.email}</strong>.
            </p>
            <p className="turismo-success-sub">{t.successSub}</p>
          </section>
        )}
      </div>
    </div>
  );
}
