import { createFileRoute } from '@tanstack/react-router';

import Comparison from '@/components/Comparison';
import { fetchAthletes } from '@/lib/athletes';

export const Route = createFileRoute('/_auth/analyze')({
  loader: async () => ({
    entities: await fetchAthletes(),
  }),
  component: AthletesRoute,
});

function AthletesRoute() {
  const { entities } = Route.useLoaderData();
  console.log('entities', entities);
  return <Comparison />;
}
