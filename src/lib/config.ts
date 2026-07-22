/**
 * Application configuration
 */

export const LISTING_CONFIG = {
  /** Number of listings per page (initial browse + filtered search) */
  PAGE_SIZE: 2,

  /**
   * When the user shares location on initial browse, only show listings
   * within this radius (km). If none match, fall back to all listings
   * sorted by proximity.
   */
  NEARBY_RADIUS_KM: 40,
};
