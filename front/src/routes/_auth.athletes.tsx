import { createFileRoute, Link, Outlet } from '@tanstack/react-router';

import { fetchAthletes } from '@/lib/athletes';

export const Route = createFileRoute('/_auth/athletes')({
  loader: async () => ({
    athletes: await fetchAthletes(),
  }),
  component: AthletesRoute,
});

function AthletesRoute() {
  const { athletes } = Route.useLoaderData();

  console.log(athletes);
  return (
    <div className="grid grid-cols-4 min-h-[500px]">
      <div className="col-span-1 py-2 pl-2 pr-4 md:border-r">
        <p className="mb-2">Choose an invoice from the list below.</p>
        <ol className="grid gap-2">
          {athletes?.map((athlete) => (
            <li key={athlete.id}>
              <Link
                to="/athletes/$id"
                params={{ id: athlete.id.toString() }}
                className="data-[status='active']:text-blue-700 hover:underline"
              >
                <span className="tabular-nums">
                  #{athlete.id.toString().padStart(2, '0')}
                </span>{' '}
                - {athlete.name.slice(0, 16)}...
              </Link>
            </li>
          ))}
        </ol>
      </div>
      <div className="col-span-3 px-4 py-2">
        <Outlet />
      </div>
    </div>
  );
}
