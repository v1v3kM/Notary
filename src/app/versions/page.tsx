import type { Metadata } from 'next';
import DocumentVersioning from '@/components/DocumentVersioning';

export const metadata: Metadata = {
  title: 'Document Versioning - Digital Notary',
  description: 'Track and manage document versions with comprehensive history and comparison tools.',
};

export default function DocumentVersioningPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Document Versioning</h1>
          <p className="text-gray-600">
            Track changes, compare versions, and manage document history with ease.
          </p>
        </div>

        <DocumentVersioning
          documentTitle="Property Sale Agreement - 2BHK Apartment"
        />
      </div>
    </div>
  );
}
