import { createFileRoute } from '@tanstack/react-router';

import { Register } from '@/pages/Register';

export const Route = createFileRoute('/register')({
  loader: async () => {
    const countries = await fetch('https://restcountries.com/v3.1/all?fields=name,flags');
    const data = await countries.json();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- We don't have the correct shape of this API
    const transformData = data.map((country: any) => ({
      label: `${country.name.common}@&${country.flags.svg}`,
      value: country.name.common,
    }));

    return {
      countries: transformData,
    };
  },
  component: () => <Register />,
});
