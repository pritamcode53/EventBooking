// using backend.DAL;
// using backend.DTOs;
// using System.Collections.Generic;
// using System.Threading.Tasks;

// namespace backend.Helpers
// {
//     public class HomeHelper
//     {
//         private readonly HomeDAL _dal;

//         public HomeHelper(HomeDAL dal)
//         {
//             _dal = dal;
//         }

//         // Simply fetch all venues without filters
//         public async Task<IEnumerable<VenueDetailsDto>> GetAllVenuesAsync()
//         {
//             return await _dal.GetAllVenuesAsync();
//         }
//     }
// }


using backend.DAL;
using backend.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace backend.Helpers
{
    public class HomeHelper
    {
        private readonly HomeDAL _dal;

        public HomeHelper(HomeDAL dal)
        {
            _dal = dal;
        }

        public async Task<IEnumerable<VenueDetailsDto>> GetAllVenuesAsync(VenueFilterDto? filters = null)
        {
            return await _dal.GetAllVenuesAsync(filters);
        }

        public async Task<IEnumerable<string>> GetAllLocationsAsync()
        {
            return await _dal.GetAllLocationsAsync();
        }

    }
}

