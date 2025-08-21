import type { Metadata } from 'next';
import LawyerManagement from '@/components/LawyerManagement';

export const metadata: Metadata = {
  title: 'Lawyer Directory - Digital Notary',
  description: 'Find verified legal professionals for your document needs. Browse experienced lawyers by specialization, location, and availability.',
};

export default function LawyerDirectoryPage() {
  return <LawyerManagement />;
}
