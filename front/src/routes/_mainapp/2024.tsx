import { createFileRoute } from '@tanstack/react-router';

import { Paris2024Page } from '@/pages/paris2024';
import { Location } from '@/types/MapTypes';

export const Route = createFileRoute('/_mainapp/2024')({
  loader: async () => {
    const resLocation = await fetch(
      'https://data.paris2024.org/api/explore/v2.1/catalog/datasets/paris-2024-sites-de-competition/records?limit=61&lang=en',
    );

    const dataLocation: {
      results: Location[];
      total_count: number;
    } = await resLocation.json();

    const resShops = await fetch(
      'https://data.paris2024.org/api/explore/v2.1/catalog/datasets/paris-2024-boutiques-officielles/records?limit=80&lang=en',
    );

    const dataShops = await resShops.json();

    return {
      events_location: dataLocation.results,
      events_location_count: dataLocation.total_count,
      shops: dataShops.results,
      shops_count: dataShops.total_count,
    };
  },
  component: () => <Paris2024Page />,
});
