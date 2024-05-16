import { Athlete } from '@/model/athlete';

const AthleteProfile: React.FC<{ athlete: Athlete }> = ({ athlete }) => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center space-x-4">
        <img src={athlete.photo} alt={athlete.name} className="w-24 h-24 rounded-full" />
        <div>
          <h2 className="text-xl font-bold">{athlete.name}</h2>
          <p className="text-sm text-gray-600">{athlete.sport}</p>
        </div>
      </div>
      <div className="mt-6">
        <h3 className="text-lg font-semibold">Performance</h3>
        <ul className="list-disc list-inside">
          <li>Current Rank: {athlete.currentRank}</li>
          <li>Best Time: {athlete.bestTime}</li>
          <li>Gold Medals: {athlete.goldMedals}</li>
        </ul>
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-semibold">Recent Competitions</h3>
        {athlete.competitions.map((comp, index) => (
          <p key={index} className="mt-2 text-sm">
            {comp.name} - {comp.result}
          </p>
        ))}
      </div>
    </div>
  );
};

export default AthleteProfile;
