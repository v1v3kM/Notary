'use client'

// Razorpay integration for payment processing
declare global {
  interface Window {
    Razorpay: {
      new (options: RazorpayOptions): {
        open(): void
      }
    }
  }
}

export interface RazorpayOptions {
  key: string
  amount: number
  currency: string
  name: string
  description: string
  order_id: string
  prefill: {
    name: string
    email: string
    contact: string
  }
  theme: {
    color: string
  }
  handler: (response: RazorpayResponse) => void
  modal: {
    ondismiss: () => void
  }
}

export interface RazorpayResponse {
  razorpay_payment_id: string
  razorpay_order_id: string
  razorpay_signature: string
}

export interface CreateOrderRequest {
  amount: number
  currency?: string
  receipt?: string
  notes?: Record<string, string>
}

export interface CreateOrderResponse {
  id: string
  amount: number
  currency: string
  receipt: string
  status: string
  created_at: number
}

class RazorpayService {
  private static instance: RazorpayService
  private isScriptLoaded = false

  private constructor() {}

  static getInstance(): RazorpayService {
    if (!RazorpayService.instance) {
      RazorpayService.instance = new RazorpayService()
    }
    return RazorpayService.instance
  }

  async loadScript(): Promise<boolean> {
    if (this.isScriptLoaded) {
      return true
    }

    return new Promise((resolve) => {
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => {
        this.isScriptLoaded = true
        resolve(true)
      }
      script.onerror = () => {
        resolve(false)
      }
      document.body.appendChild(script)
    })
  }

  async createOrder(orderData: CreateOrderRequest): Promise<CreateOrderResponse> {
    try {
      const response = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      })

      if (!response.ok) {
        throw new Error('Failed to create order')
      }

      const order = await response.json()
      return order
    } catch (error) {
      console.error('Error creating order:', error)
      throw error
    }
  }

  async verifyPayment(paymentData: RazorpayResponse): Promise<boolean> {
    try {
      const response = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      })

      if (!response.ok) {
        throw new Error('Failed to verify payment')
      }

      const result = await response.json()
      return result.verified
    } catch (error) {
      console.error('Error verifying payment:', error)
      throw error
    }
  }

  async processPayment(options: Omit<RazorpayOptions, 'key' | 'handler' | 'modal'>): Promise<RazorpayResponse> {
    const scriptLoaded = await this.loadScript()
    if (!scriptLoaded) {
      throw new Error('Failed to load Razorpay script')
    }

    const key = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
    if (!key) {
      throw new Error('Razorpay key not configured')
    }

    return new Promise((resolve, reject) => {
      const razorpayOptions: RazorpayOptions = {
        ...options,
        key,
        handler: (response: RazorpayResponse) => {
          resolve(response)
        },
        modal: {
          ondismiss: () => {
            reject(new Error('Payment cancelled by user'))
          }
        }
      }

      const razorpay = new window.Razorpay(razorpayOptions)
      razorpay.open()
    })
  }
}

export const razorpayService = RazorpayService.getInstance()

// Payment utility functions
export const formatCurrency = (amount: number, currency = 'INR'): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount / 100) // Convert paise to rupees
}

export const calculateGST = (amount: number, rate = 18): number => {
  return Math.round((amount * rate) / 100)
}

export const generateReceipt = (prefix = 'ORDER'): string => {
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 1000)
  return `${prefix}_${timestamp}_${random}`
}
