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
        string getCancelledBookingSql = @"
            SELECT bookingid, paidamount 
            FROM cancelled_bookings 
            WHERE cancelled_id = @CancelledId;
        ";

        string getRejectedBookingSql = @"
            SELECT bookingid, paidamount 
            FROM bookings 
            WHERE bookingid = @BookingId AND status = 'Rejected';
        ";

        string checkExistingRefundSql = @"
            SELECT COUNT(*) 
            FROM refunds 
            WHERE (@CancelledId IS NOT NULL AND cancelledid = @CancelledId)
               OR (@CancelledId IS NULL AND bookingid = @BookingId);
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
                // ✅ Step 1: Check if refund already processed
                int existingRefundCount = await _db.ExecuteScalarAsync<int>(
                    checkExistingRefundSql,
                    new
                    {
                        CancelledId = refund.CancelledId,
                        BookingId = refund.BookingId
                    },
                    transaction
                );

                if (existingRefundCount > 0)
                    throw new InvalidOperationException("Refund already processed for this booking.");

                // ✅ Step 2: Fetch data depending on type (Cancelled vs Rejected)
                dynamic? bookingData = null;

                if (refund.CancelledId.HasValue)
                {
                    bookingData = await _db.QueryFirstOrDefaultAsync<dynamic>(
                        getCancelledBookingSql,
                        new { CancelledId = refund.CancelledId.Value },
                        transaction
                    );
                }
                else
                {
                    bookingData = await _db.QueryFirstOrDefaultAsync<dynamic>(
                        getRejectedBookingSql,
                        new { BookingId = refund.BookingId },
                        transaction
                    );
                }

                if (bookingData == null)
                    throw new InvalidOperationException("Refund not allowed: Booking not found.");

                int bookingId = (int)bookingData.bookingid;
                decimal paidAmount = (decimal)bookingData.paidamount;

                if (paidAmount <= 0)
                    throw new InvalidOperationException("Refund not allowed: No payment was made for this booking.");

                decimal refundAmount = refund.RefundAmount > 0 ? refund.RefundAmount : paidAmount;

                await _db.ExecuteAsync(
                    insertSql,
                    new
                    {
                        BookingId = bookingId,
                        CancelledId = refund.CancelledId,
                        RefundAmount = refundAmount,
                        RefundedBy = processedBy,
                        Remarks = refund.Remarks
                    },
                    transaction
                );

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

    // ✅ Combined API for Cancelled + Rejected Refunds
    public async Task<IEnumerable<dynamic>> GetRefundableBookingsAsync(bool excludeRefunded = true)
    {
        string sql = @"
            SELECT 
                cb.cancelled_id AS cancelled_id,
                cb.bookingid AS bookingid,
                cb.customerid AS customerid,
                cb.venueid AS venueid,
                cb.paidamount AS paidamount,
                cb.totalprice AS totalprice,
                cb.cancel_reason AS reason,
                cb.cancelled_at AS created_at,
                u.name AS customer_name,
                u.email AS customer_email,
                v.name AS venue_name,
                'Cancelled' AS type
            FROM cancelled_bookings cb
            INNER JOIN users u ON cb.customerid = u.userid
            INNER JOIN venues v ON cb.venueid = v.venueid
            WHERE cb.paidamount > 0
            {0}

            UNION ALL

            SELECT 
                NULL AS cancelled_id,
                b.bookingid AS bookingid,
                b.customerid AS customerid,
                b.venueid AS venueid,
                b.paidamount AS paidamount,
                b.totalprice AS totalprice,
                b.status AS reason,
                b.createdat AS created_at,
                u.name AS customer_name,
                u.email AS customer_email,
                v.name AS venue_name,
                'Rejected' AS type
            FROM bookings b
            INNER JOIN users u ON b.customerid = u.userid
            INNER JOIN venues v ON b.venueid = v.venueid
            WHERE b.status = 'Rejected'
              AND b.paidamount > 0
              {1}

            ORDER BY created_at DESC;
        ";

        string cancelledFilter = excludeRefunded
    ? "AND cb.cancelled_id NOT IN (SELECT cancelledid FROM refunds WHERE cancelledid IS NOT NULL)"
    : "";


        string rejectedFilter = excludeRefunded
            ? "AND b.bookingid NOT IN (SELECT bookingid FROM refunds)"
            : "";

        string finalSql = string.Format(sql, cancelledFilter, rejectedFilter);

        if (_db.State != ConnectionState.Open)
            _db.Open();

        return await _db.QueryAsync<dynamic>(finalSql);
    }
}
