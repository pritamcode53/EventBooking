using backend.DAL;
using backend.DTOs;

namespace backend.Helpers
{
    public class HomeHelper
    {
        private readonly HomeDAL _homeDAL;

        public HomeHelper(HomeDAL homeDAL)
        {
            _homeDAL = homeDAL;
        }

        public async Task<IEnumerable<VenueDetailsDto>> GetAllVenuesAsync(VenueFilterDto? filters)
        {
            return await _homeDAL.GetAllVenuesAsync(filters);
        }
    }
}
