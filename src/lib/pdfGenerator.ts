import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export interface DocumentData {
  title: string
  type: 'rent' | 'affidavit' | 'partnership' | 'other'
  content: RentAgreementData | AffidavitData | PartnershipData | Record<string, unknown>
  parties?: Array<{
    name: string
    address: string
    role: string
  }>
  metadata?: {
    generatedBy: string
    generatedOn: Date
    documentId: string
  }
}

export interface RentAgreementData {
  propertyAddress: string
  monthlyRent: number
  securityDeposit: number
  leaseDuration: number
  landlord: string
  tenant: string
  startDate: string
}

export interface AffidavitData {
  deponentName: string
  fatherName: string
  address: string
  statement: string
}

export interface PartnershipData {
  partnershipName: string
  businessType: string
  startDate: string
  partners: Array<{
    name: string
    contribution: number
  }>
}

export interface PDFOptions {
  format?: 'a4' | 'letter'
  orientation?: 'portrait' | 'landscape'
  margin?: number
  fontSize?: number
  includeHeader?: boolean
  includeFooter?: boolean
  watermark?: string
}

class PDFGeneratorService {
  private static instance: PDFGeneratorService

  private constructor() {}

  static getInstance(): PDFGeneratorService {
    if (!PDFGeneratorService.instance) {
      PDFGeneratorService.instance = new PDFGeneratorService()
    }
    return PDFGeneratorService.instance
  }

  /**
   * Generate PDF from document data
   */
  async generateDocument(
    documentData: DocumentData,
    options: PDFOptions = {}
  ): Promise<{ blob: Blob | null; error: string | null }> {
    try {
      const doc = new jsPDF({
        orientation: options.orientation || 'portrait',
        unit: 'mm',
        format: options.format || 'a4'
      })

      // Set default styling
      const fontSize = options.fontSize || 12
      const margin = options.margin || 20
      let yPosition = margin

      // Add header if requested
      if (options.includeHeader !== false) {
        yPosition = this.addHeader(doc, documentData, yPosition, margin)
      }

      // Add title
      doc.setFontSize(16)
      doc.setFont('helvetica', 'bold')
      doc.text(documentData.title, margin, yPosition)
      yPosition += 10

      // Add content based on document type
      yPosition = await this.addContent(doc, documentData, yPosition, margin, fontSize)

      // Add footer if requested
      if (options.includeFooter !== false) {
        this.addFooter(doc, documentData, margin)
      }

      // Add watermark if provided
      if (options.watermark) {
        this.addWatermark(doc, options.watermark)
      }

      // Convert to blob
      const pdfBlob = doc.output('blob')
      return { blob: pdfBlob, error: null }
    } catch (error) {
      console.error('PDF generation error:', error)
      return { blob: null, error: 'Failed to generate PDF' }
    }
  }

  /**
   * Generate PDF from HTML element
   */
  async generateFromHTML(
    elementId: string,
    options: PDFOptions = {}
  ): Promise<{ blob: Blob | null; error: string | null }> {
    try {
      const element = document.getElementById(elementId)
      if (!element) {
        return { blob: null, error: 'Element not found' }
      }

      // Convert HTML to canvas
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true
      })

      // Create PDF
      const doc = new jsPDF({
        orientation: options.orientation || 'portrait',
        unit: 'mm',
        format: options.format || 'a4'
      })

      const imgData = canvas.toDataURL('image/png')
      const imgWidth = 210 // A4 width in mm
      const pageHeight = 295 // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight

      let position = 0

      // Add image to PDF (handle multiple pages if needed)
      doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        doc.addPage()
        doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      const pdfBlob = doc.output('blob')
      return { blob: pdfBlob, error: null }
    } catch (error) {
      console.error('HTML to PDF error:', error)
      return { blob: null, error: 'Failed to generate PDF from HTML' }
    }
  }

  /**
   * Download PDF blob as file
   */
  downloadPDF(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  /**
   * Add header to PDF
   */
  private addHeader(
    doc: jsPDF,
    documentData: DocumentData,
    yPosition: number,
    margin: number
  ): number {
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text('NotaryPro - Digital Document Platform', margin, yPosition)
    
    if (documentData.metadata?.documentId) {
      doc.text(`Document ID: ${documentData.metadata.documentId}`, margin, yPosition + 5)
    }

    const currentDate = new Date().toLocaleDateString('en-IN')
    doc.text(`Generated on: ${currentDate}`, margin, yPosition + 10)

    // Add a line separator
    doc.line(margin, yPosition + 15, 210 - margin, yPosition + 15)
    
    return yPosition + 25
  }

  /**
   * Add content based on document type
   */
  private async addContent(
    doc: jsPDF,
    documentData: DocumentData,
    yPosition: number,
    margin: number,
    fontSize: number
  ): Promise<number> {
    doc.setFontSize(fontSize)
    doc.setFont('helvetica', 'normal')

    switch (documentData.type) {
      case 'rent':
        return this.addRentAgreementContent(doc, documentData, yPosition, margin)
      case 'affidavit':
        return this.addAffidavitContent(doc, documentData, yPosition, margin)
      case 'partnership':
        return this.addPartnershipContent(doc, documentData, yPosition, margin)
      default:
        return this.addGenericContent(doc, documentData, yPosition, margin)
    }
  }

  /**
   * Add rent agreement specific content
   */
  private addRentAgreementContent(
    doc: jsPDF,
    documentData: DocumentData,
    yPosition: number,
    margin: number
  ): number {
    const content = documentData.content as RentAgreementData

    // Agreement details
    doc.text('RENTAL AGREEMENT', margin, yPosition)
    yPosition += 10

    doc.text(`Property Address: ${content.propertyAddress || 'N/A'}`, margin, yPosition)
    yPosition += 7

    doc.text(`Monthly Rent: ₹${content.monthlyRent || 'N/A'}`, margin, yPosition)
    yPosition += 7

    doc.text(`Security Deposit: ₹${content.securityDeposit || 'N/A'}`, margin, yPosition)
    yPosition += 7

    doc.text(`Lease Duration: ${content.leaseDuration || 'N/A'} months`, margin, yPosition)
    yPosition += 10

    // Parties information
    if (documentData.parties) {
      doc.text('PARTIES:', margin, yPosition)
      yPosition += 7

      documentData.parties.forEach((party) => {
        doc.text(`${party.role}: ${party.name}`, margin + 5, yPosition)
        yPosition += 5
        doc.text(`Address: ${party.address}`, margin + 5, yPosition)
        yPosition += 10
      })
    }

    return yPosition
  }

  /**
   * Add affidavit specific content
   */
  private addAffidavitContent(
    doc: jsPDF,
    documentData: DocumentData,
    yPosition: number,
    margin: number
  ): number {
    const content = documentData.content as AffidavitData

    doc.text('AFFIDAVIT', margin, yPosition)
    yPosition += 10

    doc.text(`Deponent Name: ${content.deponentName || 'N/A'}`, margin, yPosition)
    yPosition += 7

    doc.text(`Father's/Husband's Name: ${content.fatherName || 'N/A'}`, margin, yPosition)
    yPosition += 7

    doc.text(`Address: ${content.address || 'N/A'}`, margin, yPosition)
    yPosition += 10

    if (content.statement) {
      doc.text('STATEMENT:', margin, yPosition)
      yPosition += 7

      // Split long text into multiple lines
      const lines = doc.splitTextToSize(content.statement, 170)
      doc.text(lines, margin, yPosition)
      yPosition += lines.length * 5
    }

    return yPosition
  }

  /**
   * Add partnership specific content
   */
  private addPartnershipContent(
    doc: jsPDF,
    documentData: DocumentData,
    yPosition: number,
    margin: number
  ): number {
    const content = documentData.content as PartnershipData

    doc.text('PARTNERSHIP DEED', margin, yPosition)
    yPosition += 10

    doc.text(`Partnership Name: ${content.partnershipName || 'N/A'}`, margin, yPosition)
    yPosition += 7

    doc.text(`Business Type: ${content.businessType || 'N/A'}`, margin, yPosition)
    yPosition += 7

    doc.text(`Start Date: ${content.startDate || 'N/A'}`, margin, yPosition)
    yPosition += 10

    if (content.partners && Array.isArray(content.partners)) {
      doc.text('PARTNERS:', margin, yPosition)
      yPosition += 7

      content.partners.forEach((partner, index) => {
        doc.text(`${index + 1}. ${partner.name} - ${partner.contribution}%`, margin + 5, yPosition)
        yPosition += 5
      })
    }

    return yPosition
  }

  /**
   * Add generic content
   */
  private addGenericContent(
    doc: jsPDF,
    documentData: DocumentData,
    yPosition: number,
    margin: number
  ): number {
    // Simply add all content as key-value pairs
    Object.entries(documentData.content).forEach(([key, value]) => {
      if (typeof value === 'string' || typeof value === 'number') {
        doc.text(`${key}: ${value}`, margin, yPosition)
        yPosition += 7
      }
    })

    return yPosition
  }

  /**
   * Add footer to PDF
   */
  private addFooter(
    doc: jsPDF,
    documentData: DocumentData,
    margin: number
  ): void {
    const pageHeight = doc.internal.pageSize.height
    const footerY = pageHeight - margin

    doc.setFontSize(8)
    doc.setFont('helvetica', 'italic')
    
    // Add line separator
    doc.line(margin, footerY - 5, 210 - margin, footerY - 5)
    
    doc.text('Generated by NotaryPro - Digital Document Platform', margin, footerY)
    doc.text(`Document generated on ${new Date().toLocaleString('en-IN')}`, margin, footerY + 5)
    
    if (documentData.metadata?.generatedBy) {
      doc.text(`Generated by: ${documentData.metadata.generatedBy}`, margin, footerY + 10)
    }
  }

  /**
   * Add watermark to PDF
   */
  private addWatermark(doc: jsPDF, watermarkText: string): void {
    const pageWidth = doc.internal.pageSize.width
    const pageHeight = doc.internal.pageSize.height

    // Set watermark properties
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(50)
    doc.setTextColor(200, 200, 200) // Light gray
    
    // Add watermark text
    doc.text(
      watermarkText,
      pageWidth / 2,
      pageHeight / 2,
      {
        angle: 45,
        align: 'center'
      }
    )

    // Reset text color
    doc.setTextColor(0, 0, 0)
  }
}

export const pdfGeneratorService = PDFGeneratorService.getInstance()

// Utility functions for common document types
export const generateRentAgreement = async (data: RentAgreementData): Promise<Blob | null> => {
  const documentData: DocumentData = {
    title: 'Rental Agreement',
    type: 'rent',
    content: data,
    metadata: {
      generatedBy: 'NotaryPro System',
      generatedOn: new Date(),
      documentId: `RENT_${Date.now()}`
    }
  }

  const { blob } = await pdfGeneratorService.generateDocument(documentData)
  return blob
}

export const generateAffidavit = async (data: AffidavitData): Promise<Blob | null> => {
  const documentData: DocumentData = {
    title: 'Affidavit',
    type: 'affidavit',
    content: data,
    metadata: {
      generatedBy: 'NotaryPro System',
      generatedOn: new Date(),
      documentId: `AFF_${Date.now()}`
    }
  }

  const { blob } = await pdfGeneratorService.generateDocument(documentData)
  return blob
}
