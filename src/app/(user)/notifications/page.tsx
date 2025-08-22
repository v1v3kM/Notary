import { Metadata } from 'next';
import NotificationSystem from '@/components/ui/NotificationSystem';

export const metadata: Metadata = {
  title: 'Notifications - Digital Notary Platform',
  description: 'Stay updated with your document status, appointments, and important platform notifications.',
};

export default function Notifications() {
  return <NotificationSystem />;
}
