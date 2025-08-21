# 🎯 Digital Notary Platform

> **Modern, fully functional digital agreement automation platform with enhanced UI/UX**

![Next.js](https://img.shields.io/badge/Next.js-15.4.6-black)
![React](https://img.shields.io/badge/React-19.1.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)
![Supabase](https://img.shields.io/badge/Supabase-Auth-green)

## 🚀 Live Demo

**🔗 [View Live Demo](https://digital-notary-platform.vercel.app)**

## ✨ Features

### 🏠 **Modern Homepage**
- Animated hero section with dynamic statistics
- Comprehensive services showcase
- Interactive testimonials carousel
- Mobile-responsive design

### 📊 **Smart Dashboard**
- Tabbed interface with intuitive navigation
- Real-time document tracking
- Advanced search and filtering
- Progress indicators and analytics

### 📋 **Document Management**
- Category-based organization
- Multi-step form workflows
- Real-time validation
- PDF generation and signatures

### � **Secure Authentication**
- Modern gradient UI design
- Demo mode for exploration
- Secure user management
- Role-based access control

## 🛠 Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4, Framer Motion
- **Backend**: Supabase (Auth, Database)
- **Deployment**: Vercel
- **PDF Processing**: jsPDF, html2canvas
- **Icons**: Lucide React

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/digital-notary-platform.git
   cd digital-notary-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔐 Demo Access

The platform includes a demo mode for easy exploration:

### **Client Demo User**
- **Email**: `demo.client@notary.com`
- **Password**: `demo123`

### **Lawyer Demo User**
- **Email**: `demo.lawyer@notary.com`
- **Password**: `demo123`

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Homepage
│   ├── dashboard/         # User dashboard
│   ├── agreements/        # Document workflows
│   ├── auth/             # Authentication
│   └── api/              # API routes
├── components/            # Reusable components
├── contexts/             # React contexts
├── lib/                  # Utilities
└── utils/               # Helper functions
```

## 🚀 Deployment

### Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy on Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables
   - Deploy!

### Environment Variables for Production

```env
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 🎨 Screenshots

### Homepage
Modern, responsive design with animated elements

### Dashboard
Comprehensive user interface with tabbed navigation

### Document Workflow
Multi-step forms with real-time validation

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Powered by [Supabase](https://supabase.com/)
- Deployed on [Vercel](https://vercel.com/)

---

**⭐ Star this repository if you find it helpful!**
