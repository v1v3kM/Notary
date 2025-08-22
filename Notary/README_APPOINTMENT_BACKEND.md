# Appointment Scheduler Backend Integration

This document explains how the AppointmentScheduler component has been integrated with Supabase backend to replace mock data with real database operations.

## What Was Implemented

### 1. Database Schema (`database-schema.sql`)
- **lawyer_profiles**: Extended lawyer information with pricing, availability, specializations
- **availability_slots**: Time slots for each lawyer with pricing and consultation modes
- **appointments**: Booking records with client and lawyer information
- **appointment_payments**: Payment tracking for bookings
- **appointment_reviews**: Review system for completed appointments

### 2. Service Layer (`lib/appointmentService.ts`)
- **LawyerProfile Interface**: Typed interface for lawyer data from database
- **AvailabilitySlot Interface**: Typed interface for time slot data
- **Appointment Interface**: Typed interface for booking data
- **AppointmentService Class**: 
  - `getLawyers()`: Fetch all available lawyers with joined user data
  - `getAvailableSlots()`: Get available time slots for a specific lawyer and date
  - **`bookAppointment()`**: Create new appointment booking with payment record
  - Demo data fallbacks for development without backend

### 3. React Hook (`hooks/useAppointmentScheduler.ts`)
- **State Management**: Lawyers list, availability slots, loading states, errors
- **Search & Filter**: Real-time lawyer search and specialization filtering
- **Availability Loading**: Automatic slot loading when lawyer/date changes
- **Booking Flow**: Complete appointment booking with backend integration
- **Demo Mode Support**: Seamless fallback to demo data when backend unavailable

### 4. Component Integration (`components/AppointmentScheduler.tsx`)
- **Replaced mock data** with real backend calls via the hook
- **Loading states** for lawyer list and availability slots
- **Error handling** for network failures and API errors
- **Real-time updates** when bookings are made
- **Proper TypeScript types** aligned with database schema

## Key Features

### Backend Integration
- ✅ **Real Data**: Lawyers and availability fetched from Supabase
- ✅ **Real Bookings**: Appointments stored in database with payment records
- ✅ **Authentication**: User authentication required for booking
- ✅ **Row Level Security**: Database policies ensure data security

### User Experience  
- ✅ **Loading States**: Smooth loading indicators during data fetching
- ✅ **Error Handling**: Graceful error messages for failures
- ✅ **Real-time Availability**: Slots update immediately after booking
- ✅ **Demo Mode Fallback**: Works without backend for development

### Data Flow
1. **Lawyer Selection**: `useAppointmentScheduler` loads lawyers from Supabase
2. **Date Selection**: Hook loads available slots for selected lawyer/date
3. **Booking**: Real appointment created in database with payment record
4. **Confirmation**: User receives confirmation with booking details

## Setup Instructions

### 1. Database Setup
```
```sql
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Authentication Setup
- Ensure user authentication is working (AuthContext)
- Users must be logged in to book appointments
- Demo mode works without authentication for testing

### 4. Component Usage
```tsx
// The AppointmentScheduler component now automatically uses backend
import AppointmentScheduler from '@/components/AppointmentScheduler';

function BookingPage() {
  return <AppointmentScheduler />;
}
```

## API Operations

### Lawyer Loading
```typescript
// Hook automatically loads lawyers on mount
const { lawyers, loading, error } = useAppointmentScheduler();
```

### Availability Loading  
```typescript
// Hook loads slots when lawyer and date change
const { availableSlots, slotsLoading } = useAppointmentScheduler();
// Triggered automatically via useEffect
```

### Booking Creation
```typescript
// Called when user confirms booking
const result = await bookAppointment({
  slot_id: 'slot-123',
  scheduled_date: '2024-01-15',
  scheduled_time: '14:00',
  consultation_mode: 'video',
  document_type: 'Property Sale Agreement',
  urgency: 'medium',
  amount: 300000 // in paise
});
```

## Error Handling

### Network Errors
- Graceful fallback to demo mode if Supabase unavailable
- User-friendly error messages for API failures
- Retry mechanisms for transient errors

### Validation
- Client-side validation for required fields
- Server-side validation via database constraints
- Type safety via TypeScript interfaces

### Authentication
- Automatic redirect to login if user not authenticated
- Session validation before booking attempts
- Secure API calls with user context

## Demo Mode vs Production

### Demo Mode (for development)
- Uses generated mock data
- No real database operations
- Works without Supabase setup
- Simulates booking delays and responses

### Production Mode
- Real Supabase database operations
- Persistent appointment storage
- Actual payment record creation
- Row Level Security policies enforced

## Troubleshooting

### Common Issues
1. **No lawyers loading**: Check Supabase connection and run sample data script
2. **Authentication errors**: Ensure user is logged in and AuthContext working
3. **Booking failures**: Verify database permissions and RLS policies
4. **TypeScript errors**: Ensure all interfaces match database schema

### Debug Steps
1. Check browser console for API errors
2. Verify Supabase dashboard for data presence
3. Test with demo mode to isolate backend issues
4. Check network tab for failed requests

## Next Steps

### Planned Enhancements
- [ ] Payment gateway integration (Razorpay/Stripe)
- [ ] Email notifications for bookings
- [ ] Calendar integration for lawyers
- [ ] Video consultation links
- [ ] Appointment rescheduling
- [ ] Review and rating system
- [ ] Advanced search filters
- [ ] Lawyer availability settings

### Performance Optimizations
- [ ] Caching for frequently accessed data
- [ ] Pagination for large lawyer lists
- [ ] Background slot refresh
- [ ] Optimistic UI updates
