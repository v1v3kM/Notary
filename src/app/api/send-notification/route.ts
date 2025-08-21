import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

// Nodemailer configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

export async function POST(request: NextRequest) {
  try {
    const { type, clientEmail, clientName, documentType } = await request.json()

    let subject = ''
    let htmlContent = ''

    switch (type) {
      case 'document_ready':
        subject = `Your ${documentType} document is ready - ${process.env.NEXT_PUBLIC_APP_NAME || 'Notary Service'}`
        htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center;">
              <h1 style="margin: 0;">${process.env.NEXT_PUBLIC_APP_NAME || 'Notary Service'}</h1>
            </div>
            
            <div style="padding: 30px; background-color: #f9f9f9;">
              <h2 style="color: #333; margin-bottom: 20px;">Hello ${clientName}!</h2>
              
              <p style="color: #666; line-height: 1.6;">
                Great news! Your <strong>${documentType}</strong> document has been successfully created and is now ready for download.
              </p>
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
                <h3 style="color: #333; margin-top: 0;">Document Details:</h3>
                <p style="margin: 5px 0;"><strong>Type:</strong> ${documentType}</p>
                <p style="margin: 5px 0;"><strong>Status:</strong> Ready for Download</p>
                <p style="margin: 5px 0;"><strong>Generated:</strong> ${new Date().toLocaleDateString()}</p>
              </div>
              
              <p style="color: #666; line-height: 1.6;">
                You can access your document by logging into your dashboard. If you have any questions or need assistance, please don't hesitate to contact our support team.
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/dashboard" 
                   style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                  Access Dashboard
                </a>
              </div>
            </div>
            
            <div style="background: #333; color: #999; padding: 20px; text-align: center; font-size: 12px;">
              <p style="margin: 0;">
                © ${new Date().getFullYear()} ${process.env.NEXT_PUBLIC_APP_NAME || 'Notary Service'}. All rights reserved.
              </p>
              <p style="margin: 5px 0 0 0;">
                This is an automated message. Please do not reply to this email.
              </p>
            </div>
          </div>
        `
        break

      case 'welcome':
        subject = `Welcome to ${process.env.NEXT_PUBLIC_APP_NAME || 'Notary Service'}!`
        htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center;">
              <h1 style="margin: 0;">Welcome to ${process.env.NEXT_PUBLIC_APP_NAME || 'Notary Service'}!</h1>
            </div>
            
            <div style="padding: 30px; background-color: #f9f9f9;">
              <h2 style="color: #333; margin-bottom: 20px;">Hello ${clientName}!</h2>
              
              <p style="color: #666; line-height: 1.6;">
                Welcome to our notary service platform! We're excited to help you with all your document notarization needs.
              </p>
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #333; margin-top: 0;">What you can do:</h3>
                <ul style="color: #666; line-height: 1.8;">
                  <li>Create and notarize documents online</li>
                  <li>Download your completed documents</li>
                  <li>Track your document status</li>
                  <li>Access your document history</li>
                </ul>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/dashboard" 
                   style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                  Get Started
                </a>
              </div>
            </div>
            
            <div style="background: #333; color: #999; padding: 20px; text-align: center; font-size: 12px;">
              <p style="margin: 0;">
                © ${new Date().getFullYear()} ${process.env.NEXT_PUBLIC_APP_NAME || 'Notary Service'}. All rights reserved.
              </p>
            </div>
          </div>
        `
        break

      default:
        return NextResponse.json({ error: 'Invalid email type' }, { status: 400 })
    }

    // Send email
    await transporter.sendMail({
      from: `"${process.env.NEXT_PUBLIC_APP_NAME || 'Notary Service'}" <${process.env.EMAIL_USER}>`,
      to: clientEmail,
      subject,
      html: htmlContent
    })

    return NextResponse.json({ success: true, message: 'Email sent successfully' })
  } catch (error) {
    console.error('Email sending error:', error)
    return NextResponse.json(
      { error: 'Failed to send email', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
