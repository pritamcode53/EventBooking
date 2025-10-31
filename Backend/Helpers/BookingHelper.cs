using backend.DAL;
using backend.Models;
using backend.DTOs;
using backend.Common.Enums;
using backend.Services;
using Microsoft.AspNetCore.SignalR;
using backend.Hubs;

namespace backend.Helpers
{
    public class BookingHelper
    {
        private readonly BookingDAL _dal;
        private readonly VenueDAL _venueDAL;
        private readonly MailService _mailService;
        private readonly UserDAL _userDAL;
        private readonly PaymentDAL _paymentDAL;
        private readonly NotificationDAL _notificationDAL; // ✅ Added
        private readonly IHubContext<NotificationHub> _hubContext;

        public BookingHelper(
            BookingDAL dal,
            VenueDAL venueDAL,
            MailService mailService,
            UserDAL userDAL,
            PaymentDAL paymentDAL,
            NotificationDAL notificationDAL, // ✅ Injected
            IHubContext<NotificationHub> hubContext)
        {
            _dal = dal;
            _venueDAL = venueDAL;
            _mailService = mailService;
            _userDAL = userDAL;
            _paymentDAL = paymentDAL;
            _notificationDAL = notificationDAL;
            _hubContext = hubContext;
        }

        // ----------------- Create Booking -----------------
        public async Task<int> CreateBookingAsync(BookingCreateDto dto, int customerId)
        {
            var venue = await _venueDAL.GetVenueByIdAsync(dto.VenueId);
            if (venue == null)
                throw new Exception("Venue not found");

            int multiplier = dto.TimeDuration switch
            {
                PricingType.PerHour => dto.DurationHours,
                PricingType.PerDay => dto.DurationDays,
                PricingType.PerEvent => 1,
                _ => dto.DurationHours
            };

            var available = await _dal.IsVenueAvailableAsync(dto.VenueId, dto.BookingDate, multiplier);
            if (!available)
                throw new Exception("Venue not available at this time");

            var pricing = await _venueDAL.GetVenuePricingAsync(dto.VenueId, dto.TimeDuration);
            if (pricing == null)
                throw new Exception($"No pricing found for {dto.TimeDuration}");

            decimal totalPrice = dto.TimeDuration switch
            {
                PricingType.PerHour => pricing.Price * dto.DurationHours,
                PricingType.PerDay => pricing.Price * dto.DurationDays,
                PricingType.PerEvent => pricing.Price,
                _ => pricing.Price
            };

            var booking = new Booking
            {
                VenueId = dto.VenueId,
                CustomerId = customerId,
                BookingDate = dto.BookingDate,
                TimeDuration = dto.TimeDuration,
                DurationHours = dto.DurationHours,
                DurationDays = dto.DurationDays,
                TotalPrice = totalPrice,
                Status = BookingStatus.Pending,
                CreatedAt = DateTime.UtcNow
            };

            int bookingId = await _dal.AddBookingAsync(booking);

            string bookingCode = $"BKN-{dto.VenueId}{customerId}{bookingId}";
            await _dal.UpdateBookingCodeAsync(bookingId, bookingCode);

            var owner = await _userDAL.GetUserByIdAsync(venue.OwnerId);
            if (owner != null && !string.IsNullOrEmpty(owner.Email))
            {
                string subject = $"New Booking Request for {venue.Name}";
                string body = $"Hello {owner.Name},\n\n" +
                              $"A new booking (Code: {bookingCode}) has been made for your venue \"{venue.Name}\" " +
                              $"on {booking.BookingDate:yyyy-MM-dd HH:mm}. Please review and approve/reject it.";

                await _mailService.SendEmailAsync(owner.Email, subject, body);

                // ✅ Store notification in DB
                string message = $"New booking request for {venue.Name} on {booking.BookingDate:yyyy-MM-dd HH:mm}.";
                await _notificationDAL.AddNotificationAsync(owner.UserId, message);

                // ✅ Send real-time notification (if online)
                await _hubContext.Clients.User(owner.UserId.ToString())
                    .SendAsync("ReceiveNotification", message);
            }

            return bookingId;
        }

        // ----------------- Update Booking Status -----------------
        public async Task<int> UpdateBookingStatusAsync(int bookingId, BookingStatus status, int customerId)
        {
            return await _dal.UpdateBookingStatusAsync(bookingId, status, customerId);
        }

        // ----------------- Cancel Booking -----------------
        public async Task<int> CancelBookingAsync(int bookingId, int customerId, string cancelReason)
        {
            return await _dal.CancelBookingAsync(bookingId, customerId, cancelReason);
        }

        // ----------------- Get Customer Bookings -----------------
        public async Task<IEnumerable<Booking>> GetCustomerBookingsAsync(int customerId)
        {
            var bookings = await _dal.GetBookingsByCustomerAsync(customerId);

            foreach (var booking in bookings)
            {
                if (booking.Status == BookingStatus.Pending && booking.BookingDate > DateTime.UtcNow)
                {
                    var pricing = await _venueDAL.GetVenuePricingAsync(booking.VenueId, booking.TimeDuration);
                    if (pricing != null)
                    {
                        booking.TotalPrice = booking.TimeDuration switch
                        {
                            PricingType.PerHour => pricing.Price * booking.DurationHours,
                            PricingType.PerDay => pricing.Price * booking.DurationDays,
                            PricingType.PerEvent => pricing.Price,
                            _ => pricing.Price
                        };
                    }
                }
                var payment = await _paymentDAL.GetPaymentsByBookingIdAsync(booking.BookingId);
                booking.IsPaid = payment != null && payment.Any(p => p.Status == "Success");
            }

            return bookings;
        }

        public async Task<IEnumerable<Booking>> GetApprovedBookingsByOwnerAsync(int ownerId)
        {
            return await _dal.GetApprovedBookingsByOwnerAsync(ownerId);
        }

        public async Task<IEnumerable<Booking>> GetPendingBookingsForOwnerAsync(int ownerId)
        {
            return await _dal.GetPendingBookingsByOwnerAsync(ownerId);
        }

        // ----------------- Check Availability -----------------
        public async Task<bool> IsVenueAvailableAsync(int venueId, DateTime date, int hours)
        {
            return await _dal.IsVenueAvailableAsync(venueId, date, hours);
        }

        // ----------------- Approve/Reject Booking -----------------
        public async Task<int> UpdateBookingStatusByOwnerAsync(int bookingId, int ownerId, BookingStatus status)
        {
            if (status != BookingStatus.Approved && status != BookingStatus.Rejected)
                throw new Exception("Invalid status for owner approval");

            int result = await _dal.UpdateBookingStatusByOwnerAsync(bookingId, ownerId, status);

            var booking = await _dal.GetBookingByIdAsync(bookingId);
            if (booking != null)
            {
                var customer = await _userDAL.GetUserByIdAsync(booking.CustomerId);
                if (customer != null && !string.IsNullOrEmpty(customer.Email))
                {
                    string subject = $"Your booking has been {status}";
                    string body = $"Hello {customer.Name},\n\n" +
                                  $"Your booking for venue ID {booking.VenueId} on {booking.BookingDate:yyyy-MM-dd HH:mm} " +
                                  $"has been {status}.";
                    await _mailService.SendEmailAsync(customer.Email, subject, body);

                    // ✅ Store notification in DB
                    string message = $"Your booking for venue ID {booking.VenueId} on {booking.BookingDate:yyyy-MM-dd HH:mm} has been {status}.";
                    await _notificationDAL.AddNotificationAsync(customer.UserId, message);

                    // ✅ Real-Time Notification
                    var connectionId = NotificationHub.GetConnectionId(customer.UserId.ToString());
                    if (!string.IsNullOrEmpty(connectionId))
                    {
                        await _hubContext.Clients.Client(connectionId)
                            .SendAsync("ReceiveNotification", message);
                        Console.WriteLine($"📢 Notification sent to user {customer.UserId}");
                    }
                    else
                    {
                        Console.WriteLine($"⚠️ User {customer.UserId} offline, notification stored in DB.");
                    }
                }
            }

            return result;
        }
    }
}
