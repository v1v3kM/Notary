import { Metadata } from 'next';
import PricingPage from '@/components/PricingPage';

export const metadata: Metadata = {
  title: 'Pricing - Digital Notary Platform',
  description: 'Transparent pricing for all your legal documentation needs. Choose from Basic, Professional, or Enterprise plans.',
};

export default function Pricing() {
  return <PricingPage />;
}
