export const BASE_URL = "http://localhost:5232/api";
export const IMAGE_BASE_URL = "http://localhost:5232";
// User endpoints
export const USER_CREATE = `${BASE_URL}/user/create`;
export const USER_LOGIN = `${BASE_URL}/user/login`;
export const USER_LOGOUT = `${BASE_URL}/user/logout`;
export const USER_PROFILE = `${BASE_URL}/user/profile`;

//Home Page URL
export const GET_ALL_VENUES = `${BASE_URL}/home/all`;

//cancel booking
export const CANCEL_BOOKING = (bookingId) =>
  `${BASE_URL}/booking/${bookingId}/cancel`;
// Booking endpoints
export const MY_BOOKINGS = `${BASE_URL}/booking/mybookings`;

// Venue Owner / Admin endpoints
export const VENUE_BOOKINGS = `${BASE_URL}/booking/owner/bookings/pending`; // Get all pending bookings
export const UPDATE_BOOKING_STATUS = (bookingId) =>
  `${BASE_URL}/booking/owner/booking/${bookingId}/status`;
export const ALL_VENUE = `${BASE_URL}/venue/owner`;
export const ADD_VENUE = `${BASE_URL}/venue/create`;
export const DELETE_VENUE = (deleteId) =>
  `${BASE_URL}/venue/delete/${deleteId}`;
export const UPDATE_VENUE = (venueId) => `${BASE_URL}/venue/update/${venueId}`;
export const UPLOAD_VENUE_IMAGES = (venueId) =>
  `${BASE_URL}/venue/${venueId}/images`;

export const APPROVED_VENUE = `${BASE_URL}/booking/owner/bookings/approved`;

// =============================
// 👑 ADMIN API ENDPOINTS
// =============================
export const ADMIN_BASE = `${BASE_URL}/admin`;

export const ADMIN_GET_OWNERS = `${ADMIN_BASE}/owners`;
export const ADMIN_GET_VENUES = `${ADMIN_BASE}/venues`;
export const ADMIN_GET_BOOKINGS = `${ADMIN_BASE}/bookings`;
// export const ADMIN_GET_CANCEL = `${ADMIN_BASE}/cancel`;
export const ADMIN_GET_BOOKING_BY_ID = (id) => `${ADMIN_BASE}/bookings/${id}`;
// Admin Analytics Endpoints
export const ADMIN_TOTAL_BOOKINGS = `${ADMIN_BASE}/analytics/total-bookings`;
export const ADMIN_TOTAL_COST = `${ADMIN_BASE}/analytics/total-cost`;
export const ADMIN_GET_CANCEL = `${ADMIN_BASE}/analytics/cancel`;
export const ADMIN_GET_CANCEL_DETAILS = `${ADMIN_BASE}/details-cancel`;
