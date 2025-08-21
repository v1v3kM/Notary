import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = await request.json()

    // Validate required fields
    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'Missing required payment details' },
        { status: 400 }
      )
    }

    // Verify payment signature
    const secret = process.env.RAZORPAY_KEY_SECRET!
    const body = razorpay_order_id + '|' + razorpay_payment_id
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body.toString())
      .digest('hex')

    const isVerified = expectedSignature === razorpay_signature

    if (isVerified) {
      // Payment is verified, you can save to database here
      console.log('Payment verified successfully:', {
        payment_id: razorpay_payment_id,
        order_id: razorpay_order_id,
      })
    }

    return NextResponse.json({
      verified: isVerified,
      payment_id: razorpay_payment_id,
      order_id: razorpay_order_id,
    })
  } catch (error) {
    console.error('Error verifying payment:', error)
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    )
  }
}
