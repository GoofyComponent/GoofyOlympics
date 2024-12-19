import { createFileRoute } from '@tanstack/react-router';

import AthletesPage from '@/pages/Atheletes';

export const Route = createFileRoute('/_mainapp/athletes')({
  component: () => <AthletesPage />,
});
