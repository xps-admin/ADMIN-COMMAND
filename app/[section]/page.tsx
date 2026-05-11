import { notFound } from 'next/navigation';
import AdminShell from '@/components/AdminShell';

const sections = [
  'dashboard',
  'vault',
  'systems',
  'workflow',
  'sandbox',
  'quarantine',
  'logs',
  'rollback',
  'content',
  'lead-gen',
  'benchmark',
  'reverse-engineering',
  'capabilities',
  'github',
  'drive',
  'vercel',
  'supabase',
  'shopify',
  'chat',
  'tools',
  'templates',
  'settings',
];

export function generateStaticParams() {
  return sections.map((section) => ({ section }));
}

export default function SectionPage({ params }: { params: { section: string } }) {
  if (!sections.includes(params.section)) notFound();
  return <AdminShell page={params.section} />;
}
