import nodemailer from 'nodemailer'

interface EmailConfig {
  host: string
  port: number
  secure: boolean
  auth: {
    user: string
    pass: string
  }
}

interface EmailOptions {
  to: string | string[]
  subject: string
  text?: string
  html?: string
  attachments?: Array<{
    filename: string
    path?: string
    content?: Buffer
  }>
}

class EmailService {
  private static instance: EmailService
  private transporter: nodemailer.Transporter | null = null

  private constructor() {
    this.initializeTransporter()
  }

  static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService()
    }
    return EmailService.instance
  }

  private initializeTransporter() {
    // Check if we have email configuration
    const emailConfig = this.getEmailConfig()
    
    if (!emailConfig) {
      console.warn('Email configuration not found. Email service will be disabled.')
      return
    }

    try {
      this.transporter = nodemailer.createTransport(emailConfig)
    } catch (error) {
      console.error('Failed to initialize email transporter:', error)
    }
  }

  private getEmailConfig(): EmailConfig | null {
    const host = process.env.EMAIL_HOST
    const port = process.env.EMAIL_PORT
    const user = process.env.EMAIL_USER
    const pass = process.env.EMAIL_PASS

    if (!host || !port || !user || !pass) {
      return null
    }

    return {
      host,
      port: parseInt(port),
      secure: port === '465', // true for 465, false for other ports
      auth: {
        user,
        pass
      }
    }
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    if (!this.transporter) {
      console.error('Email transporter not initialized')
      return false
    }

    try {
      const info = await this.transporter.sendMail({
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        ...options
      })

      console.log('Email sent successfully:', info.messageId)
      return true
    } catch (error) {
      console.error('Failed to send email:', error)
      return false
    }
  }

  // Email templates
  async sendWelcomeEmail(email: string, name: string): Promise<boolean> {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Welcome to NotaryPro</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to NotaryPro!</h1>
              <p>Your digital notarization platform</p>
            </div>
            <div class="content">
              <h2>Hello ${name}!</h2>
              <p>Thank you for joining NotaryPro. We're excited to help you with all your document notarization needs.</p>
              <p>With NotaryPro, you can:</p>
              <ul>
                <li>Get documents notarized digitally</li>
                <li>Schedule appointments with certified notaries</li>
                <li>Track your document status in real-time</li>
                <li>Access your documents anytime, anywhere</li>
              </ul>
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" class="button">Get Started</a>
              <p>If you have any questions, please don't hesitate to contact our support team.</p>
              <p>Best regards,<br>The NotaryPro Team</p>
            </div>
          </div>
        </body>
      </html>
    `

    return this.sendEmail({
      to: email,
      subject: 'Welcome to NotaryPro!',
      html
    })
  }

  async sendAppointmentConfirmation(
    email: string,
    name: string,
    appointmentDetails: {
      id: string
      lawyerName: string
      date: string
      time: string
      service: string
      amount: number
    }
  ): Promise<boolean> {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Appointment Confirmed</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #10b981; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .details { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
            .detail-row { display: flex; justify-content: space-between; margin: 10px 0; border-bottom: 1px solid #eee; padding-bottom: 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Appointment Confirmed!</h1>
              <p>Your consultation has been scheduled</p>
            </div>
            <div class="content">
              <h2>Hello ${name}!</h2>
              <p>Your appointment has been successfully confirmed. Here are the details:</p>
              
              <div class="details">
                <div class="detail-row">
                  <strong>Appointment ID:</strong>
                  <span>${appointmentDetails.id}</span>
                </div>
                <div class="detail-row">
                  <strong>Lawyer:</strong>
                  <span>${appointmentDetails.lawyerName}</span>
                </div>
                <div class="detail-row">
                  <strong>Date:</strong>
                  <span>${appointmentDetails.date}</span>
                </div>
                <div class="detail-row">
                  <strong>Time:</strong>
                  <span>${appointmentDetails.time}</span>
                </div>
                <div class="detail-row">
                  <strong>Service:</strong>
                  <span>${appointmentDetails.service}</span>
                </div>
                <div class="detail-row">
                  <strong>Amount Paid:</strong>
                  <span>₹${appointmentDetails.amount}</span>
                </div>
              </div>

              <p><strong>Important:</strong> Please join the meeting 5 minutes before the scheduled time.</p>
              <p>You will receive a meeting link via email 30 minutes before your appointment.</p>
              
              <p>Best regards,<br>The NotaryPro Team</p>
            </div>
          </div>
        </body>
      </html>
    `

    return this.sendEmail({
      to: email,
      subject: `Appointment Confirmed - ${appointmentDetails.date} at ${appointmentDetails.time}`,
      html
    })
  }

  async sendPaymentReceipt(
    email: string,
    name: string,
    paymentDetails: {
      id: string
      service: string
      amount: number
      paymentMethod: string
      date: string
    }
  ): Promise<boolean> {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Payment Receipt</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #3b82f6; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .receipt { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; border: 2px dashed #ddd; }
            .detail-row { display: flex; justify-content: space-between; margin: 10px 0; }
            .total { border-top: 2px solid #3b82f6; padding-top: 10px; font-weight: bold; font-size: 18px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Payment Receipt</h1>
              <p>Thank you for your payment</p>
            </div>
            <div class="content">
              <h2>Hello ${name}!</h2>
              <p>Your payment has been successfully processed. Here's your receipt:</p>
              
              <div class="receipt">
                <h3>Payment Receipt</h3>
                <div class="detail-row">
                  <span>Transaction ID:</span>
                  <span>${paymentDetails.id}</span>
                </div>
                <div class="detail-row">
                  <span>Service:</span>
                  <span>${paymentDetails.service}</span>
                </div>
                <div class="detail-row">
                  <span>Payment Method:</span>
                  <span>${paymentDetails.paymentMethod}</span>
                </div>
                <div class="detail-row">
                  <span>Date:</span>
                  <span>${paymentDetails.date}</span>
                </div>
                <div class="detail-row total">
                  <span>Total Amount:</span>
                  <span>₹${paymentDetails.amount}</span>
                </div>
              </div>

              <p>Keep this receipt for your records. If you have any questions about this payment, please contact our support team.</p>
              
              <p>Best regards,<br>The NotaryPro Team</p>
            </div>
          </div>
        </body>
      </html>
    `

    return this.sendEmail({
      to: email,
      subject: `Payment Receipt - ₹${paymentDetails.amount}`,
      html
    })
  }

  async sendVerificationEmail(email: string, verificationToken: string): Promise<boolean> {
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify-email?token=${verificationToken}`
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Verify Your Email</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 15px 30px; background: #10b981; color: white; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: bold; }
            .verification-code { background: #f8f9fa; border: 2px dashed #667eea; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
            .code { font-size: 24px; font-weight: bold; color: #667eea; letter-spacing: 3px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Verify Your Email</h1>
              <p>Complete your NotaryPro registration</p>
            </div>
            <div class="content">
              <h2>Welcome to NotaryPro!</h2>
              <p>Thank you for signing up! To complete your registration and secure your account, please verify your email address.</p>
              
              <p>Click the button below to verify your email:</p>
              <a href="${verificationUrl}" class="button">✓ Verify Email Address</a>
              
              <div class="verification-code">
                <p><strong>Verification Code:</strong></p>
                <div class="code">${verificationToken.slice(-6).toUpperCase()}</div>
                <p><small>Use this code if the button doesn't work</small></p>
              </div>
              
              <p><strong>Why verify your email?</strong></p>
              <ul>
                <li>🔒 Secure your account and prevent unauthorized access</li>
                <li>📧 Receive important notifications about your documents</li>
                <li>🔄 Enable password recovery if needed</li>
                <li>✅ Access all NotaryPro features</li>
              </ul>
              
              <p><small><strong>Security Note:</strong> This verification link will expire in 24 hours. If you didn't create an account with NotaryPro, please ignore this email.</small></p>
              
              <p>If the button doesn't work, copy and paste this link into your browser:</p>
              <p><a href="${verificationUrl}">${verificationUrl}</a></p>
              
              <p>Need help? Contact our support team at support@notarypro.com</p>
              
              <p>Best regards,<br>The NotaryPro Team</p>
            </div>
          </div>
        </body>
      </html>
    `

    return this.sendEmail({
      to: email,
      subject: '🔐 Verify Your NotaryPro Email Address',
      html
    })
  }

  async sendPasswordResetEmail(email: string, resetToken: string): Promise<boolean> {
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${resetToken}`
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Reset Your Password</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #ef4444; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: #ef4444; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .warning { background: #fef3cd; border: 1px solid #fecaca; padding: 15px; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Reset Your Password</h1>
              <p>Secure password reset request</p>
            </div>
            <div class="content">
              <h2>Password Reset Request</h2>
              <p>You have requested to reset your password for your NotaryPro account.</p>
              
              <p>Click the button below to reset your password:</p>
              <a href="${resetUrl}" class="button">Reset Password</a>
              
              <div class="warning">
                <strong>Important:</strong> This link will expire in 1 hour for security reasons.
                If you didn't request this password reset, please ignore this email.
              </div>
              
              <p>If the button doesn't work, copy and paste this link into your browser:</p>
              <p><a href="${resetUrl}">${resetUrl}</a></p>
              
              <p>Best regards,<br>The NotaryPro Team</p>
            </div>
          </div>
        </body>
      </html>
    `

    return this.sendEmail({
      to: email,
      subject: 'Reset Your NotaryPro Password',
      html
    })
  }
}

export const emailService = EmailService.getInstance()
