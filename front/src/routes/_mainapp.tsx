import { createFileRoute } from '@tanstack/react-router';

import { Layout } from '@/pages/Layout';

export const Route = createFileRoute('/_mainapp')({
  component: () => <Layout />,
});
