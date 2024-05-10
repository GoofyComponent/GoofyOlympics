import React from 'react';

import { ComparisonSelectorProps } from '@/model/Perfomance';

const ComparisonSelector: React.FC<ComparisonSelectorProps> = ({
  entities,
  onSelectionChange,
}) => {
  return (
    <div>
      <h3 className="text-lg font-bold">Select Entities and Years</h3>
      {entities.map((entity) => (
        <div key={entity} className="mb-4">
          <label className="block mb-1 font-medium">{entity}</label>
          <input
            type="number"
            placeholder="Enter year"
            onChange={(e) =>
              onSelectionChange({ entity, year: parseInt(e.target.value, 10) })
            }
            className="p-2 border rounded"
          />
        </div>
      ))}
    </div>
  );
};

export default ComparisonSelector;
