import { createFileRoute } from '@tanstack/react-router';

import MedalsPage from '@/pages/Medals';

export const Route = createFileRoute('/_mainapp/countries')({
  loader: async () => {
    const reponse = await fetch('https://api-olympics.stroyco.eu/api/medals');
    return { medals: await reponse.json() };
  },
  component: () => <MedalsPage />,
});
