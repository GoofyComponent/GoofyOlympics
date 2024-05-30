import { useLoaderData } from '@tanstack/react-router';
import { LoaderCircle, Undo2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { columns } from '@/components/columns';
import { DataTable } from '@/components/data-table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getCountryData } from '@/lib/countrieName';

export default function MedalPage() {
  const COLORS = ['#F4CB72', '#BEBEBE', '#D6B48C'];
  const data = [
    {
      name: '2000',
      or: 50,
      argent: 150,
      bronze: 140,
    },
    {
      name: '2004',
      or: 400,
      argent: 200,
      bronze: 220,
    },
    {
      name: '2008',
      or: 450,
      argent: 250,
      bronze: 230,
    },
    {
      name: '2012',
      or: 500,
      argent: 300,
      bronze: 240,
    },
    {
      name: '2016',
      or: 550,
      argent: 350,
      bronze: 250,
    },
  ];

  const [filteredData, setFilteredData] = useState(data);
  const [selectedYear, setSelectedYear] = useState('2016');

  const [isLoading, setIsLoading] = useState(true);
  const [Athletes, setAthletes] = useState([]);
  const countrie = useLoaderData({ from: '/_mainapp/countrie/$id' });
  const resp = countrie.medals.medals;
  const noc = Object.keys(resp)[0];
  const countryName = getCountryData(noc);

  useEffect(() => {
    fetch(
      `https://api-olympics.stroyco.eu/api/athletes?page=1&limit=15&noc=${noc}&year=${selectedYear}&optionSort=equal`,
    )
      .then((response) => response.json())
      .then((data) => {
        setAthletes(data.athletes);
        console.log('athlete', data);
      });
  }, [noc, selectedYear]);

  let goldCount = 0;
  let silverCount = 0;
  let bronzeCount = 0;

  resp[noc].forEach((medal: { medal: unknown; count: number }) => {
    switch (medal.medal) {
      case 'Gold':
        goldCount += Number(medal.count);
        break;
      case 'Silver':
        silverCount += Number(medal.count);
        break;
      case 'Bronze':
        bronzeCount += Number(medal.count);
        break;
      default:
        break;
    }
  });

  const totalMedals = goldCount + silverCount + bronzeCount;

  // Maintenant, vous pouvez utiliser les variables goldCount, silverCount et bronzeCount dans votre code.

  useEffect(() => {
    if (resp) {
      setIsLoading(false);
    }
  }, [resp]);

  useEffect(() => {
    const newData = data.filter((item) => item.name === selectedYear);
    setFilteredData(newData);
  }, [selectedYear]);

  const medalData = [
    { name: 'Gold', value: filteredData[0]?.or },
    { name: 'Silver', value: filteredData[0]?.argent },
    { name: 'Bronze', value: filteredData[0]?.bronze },
  ];

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center h-screen ">
          <LoaderCircle strokeWidth={1.25} size={64} className="animate-spin" />
        </div>
      ) : (
        <div className="container py-8  ">
          <div className="my-2">
            <Undo2
              className="cursor-pointer w-8 h-8 text-zinc-700 hover:text-zinc-900"
              onClick={() => {
                window.history.back();
              }}
            />
          </div>
          <div className="flex w-full my-4 mx-8">
            <div className="w-7/12 p-8 relative ">
              <div className="text-6xl font-bold text-zinc-200 absolute text-nowrap top-0 left-0">
                {countryName?.name}
              </div>
              <h1 className="text-4xl font-bold relative">{countryName?.name}</h1>
            </div>
            <div className="w-5/12 px-8 border-l">
              <img
                src={countryName?.flagUrl}
                alt={countryName?.name}
                className="w-[15rem] ml-4 drop-shadow-lg"
              />
            </div>
          </div>
          <div className="flex w-full  flex-col justify-center p-8">
            <div className="flex flex-col p-4">
              <div className="w-full flex">
                <div className="w-1/4 px-2">
                  <p className="text-xl text-zinc-400">
                    Nombre <br /> de participation
                  </p>
                </div>
                <div className="w-1/4 px-2">
                  <p className="text-xl text-zinc-400">
                    Meilleure <br /> année
                  </p>
                </div>
                <div className="w-1/4 px-2">
                  <p className="text-xl text-zinc-400">
                    Nombre <br /> de participations
                  </p>
                </div>
              </div>
              <div className="w-full flex">
                <div className="w-1/4 px-2">
                  <p className="text-lg">{resp[noc].length}</p>
                </div>
                <div className="w-1/4 px-2">
                  <p className="text-lg">2012</p>
                </div>
                <div className="w-1/4 px-2">
                  <p className="text-lg">16</p>
                </div>
              </div>
            </div>
            <div className="w-full border-b my-8"></div>
            <div className="flex flex-col  p-4">
              <div className="w-full flex">
                <div className="w-1/4 text-center flex flex-col">
                  <p className="text-2xl text-zinc-400 ">Gold 🥇</p>
                </div>
                <div className="w-1/4 text-center flex flex-col">
                  <p className="text-2xl text-zinc-400">Silver 🥈</p>
                </div>
                <div className="w-1/4 text-center flex flex-col">
                  <p className="text-2xl text-zinc-400">Bronze 🥉</p>
                </div>
                <div className="w-1/4 text-center flex flex-col">
                  <p className="text-2xl text-zinc-400">Total</p>
                </div>
              </div>
              <div className="w-full flex">
                <div className="w-1/4 text-center flex flex-col">
                  <p className="text-4xl font-bold">{goldCount}</p>
                </div>
                <div className="w-1/4 text-center flex flex-col">
                  <p className="text-4xl font-bold">{silverCount}</p>
                </div>
                <div className="w-1/4 text-center flex flex-col">
                  <p className="text-4xl font-bold">{bronzeCount}</p>
                </div>
                <div className="w-1/4 text-center flex flex-col">
                  <p className="text-4xl font-bold">{totalMedals}</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col lg:flex-row">
              <div className="w-full lg:w-1/2 my-20">
                <div className=" p-8 relative ">
                  <h2 className="text-4xl font-bold relative">
                    Medals per participation
                  </h2>
                </div>
                <div className="flex h-full items-center">
                  <BarChart width={600} height={300} data={data}>
                    <Tooltip />
                    <Legend />
                    <Bar
                      type="monotone"
                      barSize="30"
                      stackId="a"
                      dataKey="or"
                      fill="#F4CB72"
                    />
                    <Bar
                      type="monotone"
                      barSize="30"
                      stackId="a"
                      dataKey="argent"
                      fill="#BEBEBE"
                    />
                    <Bar
                      type="monotone"
                      barSize="30"
                      stackId="a"
                      dataKey="bronze"
                      fill="#D6B48C"
                    />
                    <XAxis dataKey="name" />
                    <YAxis />
                  </BarChart>
                </div>
              </div>
              <div className="w-full lg:w-1/2 my-20">
                <div className=" p-8 pb-0 relative flex ">
                  <h2 className="text-4xl mr-6 font-bold relative">Medals per year</h2>
                  <Select onValueChange={(value) => setSelectedYear(value)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder={selectedYear} />
                    </SelectTrigger>
                    <SelectContent>
                      {data.map((item) => (
                        <SelectItem key={item.name} value={item.name}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex h-full items-center justify-center">
                  <PieChart width={400} height={400}>
                    <Pie
                      dataKey="value"
                      isAnimationActive={false}
                      data={medalData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      label
                    >
                      {medalData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </div>
              </div>
            </div>
            <div className="w-full my-20">
              <DataTable columns={columns} data={Athletes} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
