/**
 * Single source of truth for the deployed site and its media.
 *
 * These were previously hardcoded as `primordialvideo.netlify.app` in ~30 places.
 * That host returns 404, so every exported portfolio, resume and zip bundle
 * resolved its images against a dead origin. Media is served from /media on the
 * live build, so the base includes that segment.
 */
export const LIVE_SITE_URL = 'https://primordial-portfolio.netlify.app';
export const LIVE_ASSET_BASE = `${LIVE_SITE_URL}/media`;
