const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  async sendWelcomeEmail(userEmail, userName) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: userEmail,
        subject: 'Welcome to Book Library Manager!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #4f46e5; color: white; padding: 20px; text-align: center;">
              <h1>📚 Book Library Manager</h1>
            </div>
            <div style="padding: 30px; background-color: #f8fafc;">
              <h2 style="color: #1f2937;">Welcome, ${userName}!</h2>
              <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
                Thank you for joining Book Library Manager! You can now start organizing your personal book collection.
              </p>
              <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
                Here's what you can do:
              </p>
              <ul style="color: #4b5563; font-size: 16px; line-height: 1.8;">
                <li>📖 Add books to your library</li>
                <li>📊 Track your reading progress</li>
                <li>🔍 Search and filter your books</li>
                <li>📈 View reading statistics</li>
              </ul>
              <div style="text-align: center; margin: 30px 0;">
                <a href="#" style="background-color: #4f46e5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
                  Start Managing Your Books
                </a>
              </div>
            </div>
            <div style="background-color: #e5e7eb; padding: 20px; text-align: center; color: #6b7280;">
              <p>Happy reading! 📚</p>
              <p><small>This email was sent from Book Library Manager</small></p>
            </div>
          </div>
        `
      };

      await this.transporter.sendMail(mailOptions);
      console.log('Welcome email sent successfully to:', userEmail);
    } catch (error) {
      console.error('Error sending welcome email:', error);
      throw error;
    }
  }

  async sendBookAddedEmail(userEmail, userName, bookTitle) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: userEmail,
        subject: `New Book Added: ${bookTitle}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #059669; color: white; padding: 20px; text-align: center;">
              <h1>📚 Book Library Manager</h1>
            </div>
            <div style="padding: 30px; background-color: #f8fafc;">
              <h2 style="color: #1f2937;">New Book Added!</h2>
              <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
                Hello ${userName}, you've successfully added a new book to your library:
              </p>
              <div style="background-color: white; border: 2px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <h3 style="color: #1f2937; margin-top: 0;">📖 ${bookTitle}</h3>
                <p style="color: #6b7280; margin: 0;">Keep up the great work building your personal library!</p>
              </div>
              <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
                Don't forget to update your reading status as you progress through your books!
              </p>
            </div>
            <div style="background-color: #e5e7eb; padding: 20px; text-align: center; color: #6b7280;">
              <p>Happy reading! 📚</p>
              <p><small>This email was sent from Book Library Manager</small></p>
            </div>
          </div>
        `
      };

      await this.transporter.sendMail(mailOptions);
      console.log('Book added email sent successfully to:', userEmail);
    } catch (error) {
      console.error('Error sending book added email:', error);
      throw error;
    }
  }
}

module.exports = new EmailService();
