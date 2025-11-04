export const BASE_URL = "http://localhost:5232/api";
export const IMAGE_BASE_URL = "http://localhost:5232";
// User endpoints
export const USER_CREATE = `${BASE_URL}/user/create`;
export const USER_LOGIN = `${BASE_URL}/user/login`;
export const USER_LOGOUT = `${BASE_URL}/user/logout`;
export const USER_PROFILE = `${BASE_URL}/user/profile`;

//Home Page URL
export const GET_ALL_VENUES = `${BASE_URL}/home/all`;
export const GET_ALL_TOP_RATED_VENUES = `${BASE_URL}/review/top-rated`;
export const GET_LOCATIONS_BASED_VENUES = `${BASE_URL}/home/locations`;
// http://localhost:5232/api/home/locations
//cancel booking
export const CANCEL_BOOKING = (bookingId) =>
  `${BASE_URL}/booking/${bookingId}/cancel`;
// Booking endpoints
export const MY_BOOKINGS = `${BASE_URL}/booking/mybookings`;
export const GIVE_REVIEW = `${BASE_URL}/review/add`;
export const GET_INVOICE = (bookingId) => `${BASE_URL}/booking/${bookingId}/invoice`;
// Venue Owner 
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
export const ADD_VENUE_PRICING = (venueId) =>
  `${BASE_URL}/booking/admin/venue/${venueId}/pricing/add`;

export const UPDATE_VENUE_PRICING = (venueId) =>
  `${BASE_URL}/venue/${venueId}/pricing/update`;

export const APPROVED_VENUE = `${BASE_URL}/booking/owner/bookings/approved`;

export const PAYMENT = `${BASE_URL}/payment/create`;

//Refund section - venue owner 
export const POST_REFUND_PAYMENT = `${BASE_URL}/refund/process`;
export const GET_REFUND_CANCELLED_BOOKINGS = `${BASE_URL}/refund/refundable-users`;

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
export const ADMIN_TOTAL_DUE = `${ADMIN_BASE}/analytics/total-due`;
export const ADMIN_GET_CANCEL = `${ADMIN_BASE}/analytics/cancel`;
export const ADMIN_GET_CANCEL_DETAILS = `${ADMIN_BASE}/details-cancel`;


// Notification endpoints live and dbs
export const LIVE_HUB_API = (userId) => `http://localhost:5232/hubs/notifications?userId=${userId}`;
export const GET_UNREAD_NOTIFICATIONS = (userId) => `${BASE_URL}/notification/${userId}/unread`;
export const GET_ALL_NOTFICIATIONS = (userId) => `${BASE_URL}/notification/${userId}/all`;


//  ===========================

//  CUSTOM NOTIFICATION 

//  ===========================

export const POST_CREATE_CN = `${BASE_URL}/custombooking/create`;
export const GET_MY_RQ_CN = `${BASE_URL}/custombooking/my-requests`;
export const GET_SPECIFIC_REQUEST = (requestId) => `${BASE_URL}/custombooking/${requestId}`;
export const PUT_UPDATED_RQ_CN = (requestId)=> `${BASE_URL}/custombooking/${requestId}/approve`;
export const GET_CUSTOM_REQUEST_BY_ID = (requestId) =>
  `${BASE_URL}/custombooking/${requestId}`;



// =========== admin side ===========
export const GET_ALL_RQ_CN = `${BASE_URL}/custombooking/all-requests`;
export const PUT_UPDATE_RQ_CN = (bookingId)=> `${BASE_URL}/custombooking/update-price/${bookingId}`;

