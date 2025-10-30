public class RefundHelper
{
    private readonly RefundDAL _refundDal;

    public RefundHelper(RefundDAL refundDal)
    {
        _refundDal = refundDal;
    }

    public async Task<bool> ProcessRefundAsync(RefundDTO refundDto, int processedBy)
    {
        return await _refundDal.ProcessRefundAsync(refundDto, processedBy);
    }

   public async Task<IEnumerable<dynamic>> GetRefundableBookingsAsync(bool excludeRefunded = true)
        {
            var refundableBookings = await _refundDal.GetRefundableBookingsAsync(excludeRefunded);
            return refundableBookings;
        }



}
