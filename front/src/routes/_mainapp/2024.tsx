import { createFileRoute } from '@tanstack/react-router';

import { Paris2024Page } from '@/pages/paris2024';

export const Route = createFileRoute('/_mainapp/2024')({
  loader: async () => {
    const res = await fetch(
      'https://data.paris2024.org/api/explore/v2.1/catalog/datasets/paris-2024-sites-de-competition/records?limit=61',
    );

    const data = await res.json();

    return {
      events_location: data.results,
      events_location_count: data.total_count,
    };
  },
  component: () => <Paris2024Page />,
});
