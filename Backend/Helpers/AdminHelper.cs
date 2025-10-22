using backend.DAL;
using backend.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace backend.Helpers
{
    public class AdminHelper
    {
        private readonly AdminDAL _dal;

        public AdminHelper(AdminDAL dal)
        {
            _dal = dal;
        }

        // Fetch all venue owners
        public async Task<IEnumerable<VenueOwnerDto>> GetAllOwnersAsync()
        {
            return await _dal.GetAllOwnersAsync();
        }

        // Fetch all venues
        public async Task<IEnumerable<VenueDto>> GetAllVenuesAsync()
        {
            return await _dal.GetAllVenuesAsync();
        }

        // Fetch all bookings
        public async Task<IEnumerable<BookingDto>> GetAllBookingsAsync()
        {
            return await _dal.GetAllBookingsAsync();
        }

        // Fetch bookings filtered by status (optional)
        public async Task<IEnumerable<BookingDto>> GetBookingsByStatusAsync(string status)
        {
            return await _dal.GetBookingsByStatusAsync(status);
        }

        // Fetch approved bookings by owner
        public async Task<IEnumerable<BookingDto>> GetApprovedBookingsByOwnerAsync(int ownerId)
        {
            return await _dal.GetApprovedBookingsByOwnerAsync(ownerId);
        }

        // Fetch pending bookings by owner
        public async Task<IEnumerable<BookingDto>> GetPendingBookingsByOwnerAsync(int ownerId)
        {
            return await _dal.GetPendingBookingsByOwnerAsync(ownerId);
        }

        // Fetch total booking cost
        public async Task<decimal> GetTotalBookingCostAsync()
        {
            return await _dal.GetTotalBookingCostAsync();
        }

        // Fetch total bookings count
        public async Task<int> GetTotalBookingsCountAsync()
        {
            return await _dal.GetTotalBookingsCountAsync();
        }

        // Fetch single booking by ID
        public async Task<BookingDto?> GetBookingByIdAsync(int bookingId)
        {
            return await _dal.GetBookingByIdAsync(bookingId);
        }
    }
}
