import { createFileRoute } from '@tanstack/react-router';

import MedalPage from '@/pages/Medal';

export const Route = createFileRoute('/_mainapp/countrie/$id')({
  loader: async ({ params }) => {
    const [medalsResponse, athletesResponse] = await Promise.all([
      fetch(`https://api-olympics.stroyco.eu/api/medals?noc=${params.id}`),
      fetch(
        `https://api-olympics.stroyco.eu/api/athletes?page=10&limit=50&noc=${params.id}&optionSort=equal`,
      ),
    ]);

    return {
      medals: await medalsResponse.json(),
      athletes: await athletesResponse.json(),
    };
  },
  component: () => <MedalPage />,
});
