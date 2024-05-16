import { createFileRoute } from '@tanstack/react-router';

import AthleteProfile from '@/components/AthleteProfile';
import { fetchAthletesById } from '@/lib/athletes';

export const Route = createFileRoute('/_auth/athletes/$id')({
  loader: async ({ params: { id } }) => {
    return {
      athlete: await fetchAthletesById(parseInt(id)),
    };
  },
  component: AthletePage,
});

function AthletePage() {
  const { athlete } = Route.useLoaderData();

  return (
    <section className="grid gap-2">
      <AthleteProfile athlete={athlete} />
    </section>
  );
}
