import { useLoaderData } from '@tanstack/react-router';

import { getCountryName } from '@/lib/countrieName';

export default function MedalPage() {
  const countrie = useLoaderData({ from: '/_mainapp/countrie/$id' });
  const resp = countrie.medals.medals;
  const noc = Object.keys(resp)[0];
  const countryName = getCountryName(noc);
  return (
    <div>
      <h1>Medal Page</h1>
      <p>{countryName}</p>
    </div>
  );
}
