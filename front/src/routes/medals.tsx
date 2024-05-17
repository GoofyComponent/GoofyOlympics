import { createFileRoute, useLoaderData } from '@tanstack/react-router';
import { LoaderCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

import Medals from '@/pages/Medals';

export const Route = createFileRoute('/medals')({
  loader: async () => {
    const reponse = await fetch('https://api-olympics.stroyco.eu/api/medals');
    return { medals: await reponse.json() };
  },
  component: MedalsPage,
});

function MedalsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const medals = useLoaderData({ from: '/medals' });
  const medalsResp = medals.medals.medals;

  useEffect(() => {
    if (medalsResp) {
      setIsLoading(false);
    }
  }, [medalsResp]);

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center h-screen ">
          <LoaderCircle strokeWidth={1.25} size={64} className="animate-spin" />
        </div>
      ) : (
        <Medals medalsResp={medalsResp} />
      )}
    </>
  );
}
