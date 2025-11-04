using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using backend.Common.Enums;
using backend.DAL;
using backend.DTOs.CustomBooking;
using backend.Hubs;
using backend.Models;
using Microsoft.AspNetCore.SignalR;

namespace backend.Helpers
{
    public class CustomBookingHelper
    {
        private readonly CustomBookingDAL _customBookingDal;
        private readonly BookingDAL _bookingDal;
        private readonly VenueDAL _venueDal;
        private readonly NotificationDAL _notificationDAL;
        private readonly IHubContext<NotificationHub> _hubContext;

        public CustomBookingHelper(
            CustomBookingDAL customBookingDal,
            BookingDAL bookingDal,
            VenueDAL venueDal,
            NotificationDAL notificationDAL,
            IHubContext<NotificationHub> hubContext)
        {
            _customBookingDal = customBookingDal;
            _bookingDal = bookingDal;
            _venueDal = venueDal;
            _notificationDAL = notificationDAL;
            _hubContext = hubContext;
        }

        // ✅ User creates a new custom booking request
        public async Task<int?> CreateCustomBookingAsync(CustomBookingCreateDto dto, int userId)
        {
            var booking = await _bookingDal.GetBookingByIdAsync(dto.BookingId);
            if (booking == null)
                return null;

            if (booking.Status != BookingStatus.Approved)
                return null;

            var requestId = await _customBookingDal.CreateCustomBookingAsync(userId, dto.BookingId, dto.Requirements);

            if (requestId > 0)
            {
                // ✅ Fetch venue to get the owner ID
                var venue = await _venueDal.GetVenueByIdAsync(booking.VenueId);
                if (venue != null)
                {
                    var ownerId = venue.OwnerId;
                    string message = $"📨 New custom booking request from user {userId} for your venue (ID {booking.VenueId}).";

                    // Save notification in DB
                    await _notificationDAL.AddNotificationAsync(ownerId, message);

                    // Send real-time notification via SignalR
                    var connId = NotificationHub.GetConnectionId(ownerId.ToString());
                    if (!string.IsNullOrEmpty(connId))
                    {
                        await _hubContext.Clients.Client(connId)
                            .SendAsync("ReceiveNotification", message);
                        Console.WriteLine($"📢 Notification sent to venue owner {ownerId}");
                    }
                    else
                    {
                        Console.WriteLine($"⚠️ Owner {ownerId} is offline — notification stored in DB.");
                    }
                }
                else
                {
                    Console.WriteLine($"⚠️ Venue not found for booking ID {dto.BookingId}");
                }
            }

            return requestId;
        }

      // ✅ Owner/Admin updates the price & review for a custom booking
public async Task<bool> UpdateBookingPriceAsync(int bookingId, decimal newPrice, string ownerReview)
{
    var updated = await _customBookingDal.UpdateBookingPriceAsync(bookingId, newPrice, ownerReview);

    if (updated)
    {
        // ✅ Get the booking to include venue details
        var booking = await _bookingDal.GetBookingByIdAsync(bookingId);

        // ✅ Get the related custom request to find the correct requester (who created it)
        var customRequest = await _customBookingDal.GetCustomBookingByIdAsync(bookingId);

        if (booking != null && customRequest != null)
        {
            var requesterId = customRequest.UserId; // ✅ Correct user

            string message = $"💬 Your custom booking for venue ID {booking.VenueId} has been reviewed. " +
                             $"New price: ₹{newPrice}. Note: {ownerReview}";

            await _notificationDAL.AddNotificationAsync(requesterId, message);

            var connId = NotificationHub.GetConnectionId(requesterId.ToString());
            if (!string.IsNullOrEmpty(connId))
            {
                await _hubContext.Clients.Client(connId)
                    .SendAsync("ReceiveNotification", message);
                Console.WriteLine($"📢 Notification sent to requester {requesterId}");
            }
            else
            {
                Console.WriteLine($"⚠️ Requester {requesterId} is offline — notification stored in DB.");
            }
        }
        else
        {
            Console.WriteLine($"⚠️ Could not find related booking or custom request for booking ID {bookingId}");
        }
    }

    return updated;
}

        // ✅ Get all custom bookings for a specific user
        public async Task<IEnumerable<CustomBookingRequest>> GetCustomBookingsByUserAsync(int userId)
        {
            return await _customBookingDal.GetCustomBookingsByUserAsync(userId);
        }

        // ✅ Get all custom bookings (for admin/venue owner)
        public async Task<IEnumerable<CustomBookingRequest>> GetAllCustomBookingsAsync()
        {
            return await _customBookingDal.GetAllCustomBookingsAsync();
        }

        // ✅ Get a specific custom booking by request ID
        public async Task<CustomBookingRequest?> GetCustomBookingByIdAsync(int requestId)
        {
            return await _customBookingDal.GetCustomBookingByIdAsync(requestId);
        }

        // ✅ Delete a custom booking
        public async Task<bool> DeleteCustomBookingAsync(int requestId, int userId)
        {
            var rowsAffected = await _customBookingDal.DeleteCustomBookingAsync(requestId, userId);
            return rowsAffected > 0;
        }

        // ✅ Approve/reject a user's custom booking
        public async Task<bool> UpdateUserApprovalAsync(int requestId, bool isApproved)
        {
            return await _customBookingDal.UpdateUserApprovalAsync(requestId, isApproved);
        }
    }
}
