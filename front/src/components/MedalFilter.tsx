import React from 'react';

import { MedalType } from '@/model/Medal';

interface MedalFilterProps {
  onFilterChange: (filter: MedalType) => void;
}

const MedalFilter: React.FC<MedalFilterProps> = ({ onFilterChange }) => {
  return (
    <select
      onChange={(e) => onFilterChange(e.target.value as MedalType)}
      className="p-2 border rounded"
    >
      <option value="All">All Medals</option>
      <option value="Gold">Gold</option>
      <option value="Silver">Silver</option>
      <option value="Bronze">Bronze</option>
    </select>
  );
};

export default MedalFilter;
