import React from 'react';

import { CountryMedalRowProps } from '@/model/Medal';

const CountryMedalRow: React.FC<CountryMedalRowProps> = ({ countryMedals }) => {
  return (
    <tr>
      <td>{countryMedals.country}</td>
      <td>{countryMedals.gold}</td>
      <td>{countryMedals.silver}</td>
      <td>{countryMedals.bronze}</td>
    </tr>
  );
};

export default CountryMedalRow;
