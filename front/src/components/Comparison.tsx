import React, { useState } from 'react';

import { PerformanceData } from '@/model/Perfomance';

import ComparisonResult from './ComparisonResult';
import ComparisonSelector from './ComparisonSelector';

const Comparison: React.FC = () => {
  const [comparisonData, setComparisonData] = useState<PerformanceData[]>([]);

  const handleSelectionChange = (selection: { entity: string; year: number }) => {
    console.log('Selected:', selection);
    setComparisonData([
      ...comparisonData,
      { ...selection, gold: 0, silver: 0, bronze: 0, totalMedals: 0 },
    ]);
  };

  return (
    <div>
      <ComparisonSelector
        entities={['USA', 'China', 'Russia', 'France', 'Germany', 'Italy', 'Canada']}
        onSelectionChange={handleSelectionChange}
      />
      <ComparisonResult data={comparisonData} />
    </div>
  );
};

export default Comparison;
