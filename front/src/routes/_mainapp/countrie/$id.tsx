import { createFileRoute } from '@tanstack/react-router';

import MedalPage from '@/pages/Medal';

export const Route = createFileRoute('/_mainapp/countrie/$id')({
  loader: async ({ params }) => {
    const reponse = await fetch(
      `https://api-olympics.stroyco.eu/api/medals?noc=${params.id}`,
    );
    return { medals: await reponse.json() };
  },
  component: () => <MedalPage />,
});
