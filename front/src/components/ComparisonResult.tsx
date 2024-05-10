import React from 'react';

import { ComparisonResultProps } from '@/model/Perfomance';

const ComparisonResult: React.FC<ComparisonResultProps> = ({ data }) => {
  return (
    <table className="min-w-full mt-4 divide-y divide-gray-200">
      <thead>
        <tr>
          <th>Entity</th>
          <th>Year</th>
          <th>Gold</th>
          <th>Silver</th>
          <th>Bronze</th>
          <th>Total Medals</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={`${item.entity}-${item.year}`}>
            <td>{item.entity}</td>
            <td>{item.year}</td>
            <td>{item.gold}</td>
            <td>{item.silver}</td>
            <td>{item.bronze}</td>
            <td>{item.totalMedals}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ComparisonResult;
