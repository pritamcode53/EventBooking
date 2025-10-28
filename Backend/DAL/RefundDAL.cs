using Dapper;
using System.Data;
using System.Threading.Tasks;

public class RefundDAL
{
    private readonly IDbConnection _db;

    public RefundDAL(IDbConnection db)
    {
        _db = db;
    }

    public async Task<bool> ProcessRefundAsync(RefundDTO refund, int processedBy)
    {
        //  Queries
        string getCancelledBookingSql = @"
            SELECT bookingid, paidamount 
            FROM cancelled_bookings 
            WHERE cancelled_id = @CancelledId;
        ";

        string checkExistingRefundSql = @"
            SELECT COUNT(*) 
            FROM refunds 
            WHERE cancelledid = @CancelledId;
        ";

        string insertSql = @"
            INSERT INTO refunds (
                bookingid, 
                cancelledid, 
                refundamount, 
                refundedby, 
                refundstatus, 
                remarks
            )
            VALUES (
                @BookingId, 
                @CancelledId, 
                @RefundAmount, 
                @RefundedBy, 
                'Completed', 
                @Remarks
            );
        ";

        if (_db.State != ConnectionState.Open)
            _db.Open();

        using (var transaction = _db.BeginTransaction())
        {
            try
            {
                // Check if refund already processed for this cancelled booking
                int existingRefundCount = await _db.ExecuteScalarAsync<int>(
                    checkExistingRefundSql,
                    new { refund.CancelledId },
                    transaction
                );

                if (existingRefundCount > 0)
                    throw new InvalidOperationException("Refund already processed for this cancelled booking.");

                //  Fetch bookingid and paidamount from cancelled_bookings
                var cancelledData = await _db.QueryFirstOrDefaultAsync<dynamic>(
                    getCancelledBookingSql,
                    new { refund.CancelledId },
                    transaction
                );

                if (cancelledData == null)
                    throw new InvalidOperationException("Refund not allowed: Cancelled booking not found.");

                int bookingId = cancelledData.bookingid;
                decimal paidAmount = cancelledData.paidamount;

                if (paidAmount <= 0)
                    throw new InvalidOperationException("Refund not allowed: No payment was made for this booking.");

                //  Use provided refund amount or default to paid amount
                decimal refundAmount = refund.RefundAmount > 0 ? refund.RefundAmount : paidAmount;

                //  Insert refund record
                await _db.ExecuteAsync(insertSql, new
                {
                    BookingId = bookingId,
                    refund.CancelledId,
                    RefundAmount = refundAmount,
                    RefundedBy = processedBy,
                    refund.Remarks
                }, transaction);

                transaction.Commit();
                return true;
            }
            catch
            {
                transaction.Rollback();
                throw;
            }
        }
    }

    public async Task<IEnumerable<dynamic>> GetPaidCancelledUsersAsync(bool excludeRefunded = true)
    {
        string sql = @"
        SELECT 
            cb.cancelled_id,
            cb.bookingid,
            cb.customerid,
            cb.venueid,
            cb.paidamount,
            cb.totalprice,
            cb.cancel_reason,
            cb.cancelled_at,
            u.name,
            u.email,
            v.name
        FROM cancelled_bookings cb
        INNER JOIN users u ON cb.customerid = u.userid
        INNER JOIN venues v ON cb.venueid = v.venueid
        WHERE cb.paidamount > 0 
    ";

        if (excludeRefunded)
        {
            sql += " AND cb.cancelled_id NOT IN (SELECT cancelledid FROM refunds)";
        }

        sql += " ORDER BY cb.cancelled_at DESC;";

        if (_db.State != ConnectionState.Open)
            _db.Open();

        var result = await _db.QueryAsync<dynamic>(sql);
        return result;
    }

}
