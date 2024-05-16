import React, { useState } from 'react';

import { MedalTableProps, MedalType } from '@/model/Medal';

import MedalFilter from './MedalFilter';
import CountryMedalRow from './MedalRow';

const MedalTable: React.FC<MedalTableProps> = ({ medals }) => {
  const [filter, setFilter] = useState<MedalType>('All');

  const filteredMedals = medals.filter((medal) => {
    if (filter === 'Gold') return medal.gold > 0;
    if (filter === 'Silver') return medal.silver > 0;
    if (filter === 'Bronze') return medal.bronze > 0;
    return true;
  });

  return (
    <div>
      <MedalFilter onFilterChange={setFilter} />
      <table className="min-w-full mt-4 divide-y divide-gray-200">
        <thead>
          <tr>
            <th>Country</th>
            <th>Gold</th>
            <th>Silver</th>
            <th>Bronze</th>
          </tr>
        </thead>
        <tbody>
          {filteredMedals.map((medal) => (
            <CountryMedalRow key={medal.country} countryMedals={medal} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MedalTable;
