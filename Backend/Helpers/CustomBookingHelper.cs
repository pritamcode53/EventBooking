using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using backend.Common.Enums;
using backend.DAL;
using backend.DTOs.CustomBooking;
using backend.Models;

namespace backend.Helpers
{
    public class CustomBookingHelper
    {
        private readonly CustomBookingDAL _customBookingDal;
        private readonly BookingDAL _bookingDal; // ✅ New: to verify existing bookings

        public CustomBookingHelper(CustomBookingDAL customBookingDal, BookingDAL bookingDal)
        {
            _customBookingDal = customBookingDal;
            _bookingDal = bookingDal;
        }

        // ✅ Create a new custom booking against an approved booking
        public async Task<int?> CreateCustomBookingAsync(CustomBookingCreateDto dto, int userId)
        {
            // Step 1: Check if the booking exists
            var booking = await _bookingDal.GetBookingByIdAsync(dto.BookingId);
            if (booking == null)
                return null; // No booking found

            // Step 2: Check if the booking is approved
            if (booking.Status != BookingStatus.Approved)
                return null; // Booking not approved, reject

            // Step 3: Create the custom booking request
            return await _customBookingDal.CreateCustomBookingAsync(userId, dto.BookingId, dto.Requirements);
        }

        // ✅ Get all custom bookings for the logged-in user
        public async Task<IEnumerable<CustomBookingRequest>> GetCustomBookingsByUserAsync(int userId)
        {
            return await _customBookingDal.GetCustomBookingsByUserAsync(userId);
        }

        // ✅ Get all custom bookings (for admin/venue owners)
        public async Task<IEnumerable<CustomBookingRequest>> GetAllCustomBookingsAsync()
        {
            return await _customBookingDal.GetAllCustomBookingsAsync();
        }

        // ✅ Get custom booking by ID
        public async Task<CustomBookingRequest?> GetCustomBookingByIdAsync(int requestId)
        {
            return await _customBookingDal.GetCustomBookingByIdAsync(requestId);
        }

        // ✅ Delete custom booking
        public async Task<bool> DeleteCustomBookingAsync(int requestId, int userId)
        {
            var rowsAffected = await _customBookingDal.DeleteCustomBookingAsync(requestId, userId);
            return rowsAffected > 0;
        }

        // ✅ Venue Owner/Admin updates new price & review for the custom booking
        public async Task<bool> UpdateBookingPriceAsync(int bookingId, decimal newPrice, string ownerReview)
        {
            return await _customBookingDal.UpdateBookingPriceAsync(bookingId, newPrice, ownerReview);
        }

        public async Task<bool> UpdateUserApprovalAsync(int requestId, bool isApproved)
        {
            return await _customBookingDal.UpdateUserApprovalAsync(requestId, isApproved);
        }

    }
}
