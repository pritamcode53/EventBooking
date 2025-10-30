using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using backend.DAL;
using backend.DTOs;
using backend.DTOs.CustomBooking;
using backend.Models;

namespace backend.Helpers
{
    public class CustomBookingHelper
    {
        private readonly CustomBookingDAL _dal;

        public CustomBookingHelper(CustomBookingDAL dal)
        {
            _dal = dal;
        }

        public async Task<int> CreateCustomBookingAsync(CustomBookingCreateDto dto, int userId)
        {
            return await _dal.CreateCustomBookingAsync(userId, dto.Type, dto.Requirements);
        }

        public async Task<IEnumerable<CustomBookingRequest>> GetCustomBookingsByUserAsync(int userId)
        {
            return await _dal.GetCustomBookingsByUserAsync(userId);
        }
        public async Task<IEnumerable<CustomBookingRequest>> GetAllCustomBookingsAsync()
    {
        return await _dal.GetAllCustomBookingsAsync();
    }

        
        public async Task<CustomBookingRequest?> GetCustomBookingByIdAsync(int requestId)
        {
            return await _dal.GetCustomBookingByIdAsync(requestId);
        }

        public async Task<bool> DeleteCustomBookingAsync(int requestId, int userId)
        {
            var rowsAffected = await _dal.DeleteCustomBookingAsync(requestId, userId);
            return rowsAffected > 0;
        }
    }
}
