import * as React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  Rectangle,
  XAxis,
} from 'recharts';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

const initialPollData = [
  { ambiance: 'excellente', votes: 4, fill: '#2761d9' }, // Blue
  { ambiance: 'bonne', votes: 3, fill: '#2eb88a' }, // Green
  { ambiance: 'moyenne', votes: 2, fill: '#e88d30' }, // Yellow
  { ambiance: 'décevante', votes: 1, fill: '#e23670' }, // Red
];

const initialBarChartData = [
  { response: 'oui', votes: 5, fill: '#2eb88a' }, // Green
  { response: 'non', votes: 3, fill: '#e23670' }, // Red
  { response: 'mitigé', votes: 2, fill: '#e88d30' }, // Yellow
];

const sportsChartData = [
  { sport: 'Athletics', desktop: 1 },
  { sport: 'Swimming', desktop: 3 },
  { sport: 'Gymnastics', desktop: 2 },
  { sport: 'Cycling', desktop: 2 },
  { sport: 'Basketball', desktop: 5 },
  { sport: 'Football', desktop: 4 },
];

const chartConfig = {
  votes: {
    label: 'Votes',
  },
  excellente: {
    label: 'Excellente',
    color: '#2761d9',
  },
  bonne: {
    label: 'Bonne',
    color: '#2eb88a',
  },
  moyenne: {
    label: 'Moyenne',
    color: '#e88d30',
  },
  décevante: {
    label: 'Décevante',
    color: '#e23670',
  },
} satisfies ChartConfig;

const radarChartConfig = {
  desktop: {
    label: 'Desktop',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

export function Pollspage() {
  const [pollData, setPollData] = React.useState(initialPollData);
  const [barChartData, setBarChartData] = React.useState(initialBarChartData);
  const [selectedVote, setSelectedVote] = React.useState<string>('');
  const [selectedBarVote, setSelectedBarVote] = React.useState<string>('');
  const [hasVoted, setHasVoted] = React.useState<boolean>(false);
  const [hasBarVoted, setHasBarVoted] = React.useState<boolean>(false);
  const [selectedSport, setSelectedSport] = React.useState<string>('');
  const [hasSportVoted, setHasSportVoted] = React.useState<boolean>(false);
  const [sportVotes, setSportVotes] = React.useState(sportsChartData);

  const totalVotes = React.useMemo(() => {
    return pollData.reduce((acc, curr) => acc + curr.votes, 0);
  }, [pollData]);

  const totalBarVotes = React.useMemo(() => {
    return barChartData.reduce((acc, curr) => acc + curr.votes, 0);
  }, [barChartData]);

  const totalSportVotes = React.useMemo(() => {
    return sportVotes.reduce((acc, curr) => acc + curr.desktop, 0);
  }, [sportVotes]);

  const handleVoteChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedVote(event.target.value);
  };

  const handleBarVoteChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBarVote(event.target.value);
  };

  const handleSportVoteChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSport(event.target.value);
  };

  const handleVoteSubmit = () => {
    if (selectedVote && !hasVoted) {
      setPollData((prevData) =>
        prevData.map((item) =>
          item.ambiance === selectedVote ? { ...item, votes: item.votes + 1 } : item,
        ),
      );
      setHasVoted(true);
    }
  };

  const handleBarVoteSubmit = () => {
    if (selectedBarVote && !hasBarVoted) {
      setBarChartData((prevData) =>
        prevData.map((item) =>
          item.response === selectedBarVote ? { ...item, votes: item.votes + 1 } : item,
        ),
      );
      setHasBarVoted(true);
    }
  };

  const handleSportVoteSubmit = () => {
    if (selectedSport && !hasSportVoted) {
      setSportVotes((prevData) =>
        prevData.map((item) =>
          item.sport === selectedSport ? { ...item, desktop: item.desktop + 1 } : item,
        ),
      );
      setHasSportVoted(true);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 p-4">
      {/* Existing cards for ambiance and organization */}
      <Card className="border-2 border-gray-200 rounded-lg p-4 col-span-1 sm:col-span-1 md:col-span-2 aspect-square flex flex-col">
        <CardHeader className="items-center p-0">
          <CardTitle className="p-0">
            Comment jugez-vous l’ambiance générale de ces JO ?
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px]"
          >
            <PieChart>
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Pie
                data={pollData}
                dataKey="votes"
                nameKey="ambiance"
                innerRadius={60}
                outerRadius={80}
                strokeWidth={5}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {totalVotes.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            Votes
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
          <div className="mt-4 flex flex-col items-center gap-2">
            <label
              htmlFor="vote-select"
              className="block text-sm font-medium text-gray-700"
            >
              Votez pour l'ambiance :
            </label>
            <div className="flex items-center gap-2">
              <select
                id="vote-select"
                value={selectedVote}
                onChange={handleVoteChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                disabled={hasVoted}
              >
                <option value="">Sélectionnez une option</option>
                <option value="excellente">Excellente</option>
                <option value="bonne">Bonne</option>
                <option value="moyenne">Moyenne</option>
                <option value="décevante">Décevante</option>
              </select>
              <button
                onClick={handleVoteSubmit}
                className="ml-2 px-4 py-2 bg-indigo-600 text-white rounded-md"
                disabled={!selectedVote || hasVoted}
              >
                Voter
              </button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-2 text-sm pb-0 pt-2">
          <div className="flex items-center gap-2 font-medium leading-none">
            Total votes: {totalVotes.toLocaleString()}
          </div>
        </CardFooter>
      </Card>
      <Card className="border-2 border-gray-200 rounded-lg p-4 col-span-1 sm:col-span-1 md:col-span-2 aspect-square">
        <CardHeader className="pt-0">
          <CardTitle className="p-0">
            Le pays hôte a-t-il réussi à offrir une organisation au niveau des attentes ?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <BarChart data={barChartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="response"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) =>
                  chartConfig[value as keyof typeof chartConfig]?.label || value
                }
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Bar
                dataKey="votes"
                strokeWidth={2}
                radius={8}
                activeIndex={2}
                activeBar={({ ...props }) => {
                  return (
                    <Rectangle
                      {...props}
                      fillOpacity={0.8}
                      stroke={props.payload.fill}
                      strokeDasharray={4}
                      strokeDashoffset={4}
                    />
                  );
                }}
              />
            </BarChart>
          </ChartContainer>
          <div className="mt-4 flex flex-col items-center gap-2">
            <label
              htmlFor="bar-vote-select"
              className="block text-sm font-medium text-gray-700"
            >
              Votez pour l'organisation :
            </label>
            <div className="flex items-center gap-2">
              <select
                id="bar-vote-select"
                value={selectedBarVote}
                onChange={handleBarVoteChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                disabled={hasBarVoted}
              >
                <option value="">Sélectionnez une option</option>
                <option value="oui">Oui</option>
                <option value="non">Non</option>
                <option value="mitigé">Mitigé</option>
              </select>
              <button
                onClick={handleBarVoteSubmit}
                className="ml-2 px-4 py-2 bg-indigo-600 text-white rounded-md"
                disabled={!selectedBarVote || hasBarVoted}
              >
                Voter
              </button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-2 text-sm pb-0 pt-2">
          <div className="flex items-center gap-2 font-medium leading-none">
            Total votes: {totalBarVotes.toLocaleString()}
          </div>
        </CardFooter>
      </Card>
      {/* New card for sports radar chart with voting */}
      <Card className="border-2 border-gray-200 rounded-lg p-4 col-span-1 sm:col-span-4 md:col-span-4 lg:col-span-3 aspect-video lg:aspect-auto">
        <CardHeader className="items-center pb-4 pt-0">
          <CardTitle className="pt-0">
            {' '}
            Parmi la liste suivante, quel sport préférez-vous suivre ?
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-0">
          <ChartContainer config={radarChartConfig} className="mx-auto max-h-[250px]">
            <RadarChart data={sportVotes}>
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <PolarAngleAxis dataKey="sport" />
              <PolarGrid />
              <Radar dataKey="desktop" fill="var(--color-desktop)" fillOpacity={0.6} />
            </RadarChart>
          </ChartContainer>
          <div className="mt-4 flex flex-col items-center gap-2">
            <label
              htmlFor="sport-vote-select"
              className="block text-sm font-medium text-gray-700"
            >
              Voter pour un sport :
            </label>
            <div className="flex items-center gap-2">
              <select
                id="sport-vote-select"
                value={selectedSport}
                onChange={handleSportVoteChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                disabled={hasSportVoted}
              >
                <option value="">Sélectionnez un sport</option>
                {sportsChartData.map((sport) => (
                  <option key={sport.sport} value={sport.sport}>
                    {sport.sport}
                  </option>
                ))}
              </select>
              <button
                onClick={handleSportVoteSubmit}
                className="ml-2 px-4 py-2 bg-indigo-600 text-white rounded-md"
                disabled={!selectedSport || hasSportVoted}
              >
                Voter
              </button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-2 text-sm">
          <div className="flex items-center gap-2 font-medium leading-none">
            Total votes: {totalSportVotes.toLocaleString()}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
