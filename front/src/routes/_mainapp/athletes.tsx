import { createFileRoute } from '@tanstack/react-router';

import AthletesPage from '@/pages/Atheletes';

export const Route = createFileRoute('/_mainapp/athletes')({
  loader: async () => {
    const response = await fetch('https://api-olympics.stroyco.eu/api/athletes');
    const data = await response.json();
    return { athletes: data.athletes }; // Ajoutez 'limit' ici
  },
  component: () => <AthletesPage />,
});
