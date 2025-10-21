using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace backend.Services
{
    public class MailService
    {
        private readonly string _smtpHost;
        private readonly int _smtpPort;
        private readonly string _smtpUser;
        private readonly string _smtpPass;
        private readonly string _fromEmail;

        public MailService(IConfiguration configuration)
        {
            _smtpHost = configuration["Smtp:Host"]!;
            _smtpPort = int.Parse(configuration["Smtp:Port"]!);
            _smtpUser = configuration["Smtp:Username"]!;
            _smtpPass = configuration["Smtp:Password"]!;
            _fromEmail = configuration["Smtp:FromEmail"]!;
        }

        public async Task SendEmailAsync(string toEmail, string subject, string body)
        {
            using var client = new SmtpClient(_smtpHost, _smtpPort)
            {
                Credentials = new NetworkCredential(_smtpUser, _smtpPass),
                EnableSsl = true
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress(_fromEmail),
                Subject = subject,
                Body = body,
                IsBodyHtml = true
            };
            mailMessage.To.Add(toEmail);

            await client.SendMailAsync(mailMessage);
        }
    }
}
