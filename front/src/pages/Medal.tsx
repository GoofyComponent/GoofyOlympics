import { useLoaderData } from '@tanstack/react-router';
import { LoaderCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { getCountryData } from '@/lib/countrieName';

export default function MedalPage() {
  const [isLoading, setIsLoading] = useState(true);
  const countrie = useLoaderData({ from: '/_mainapp/countrie/$id' });
  console.log(countrie);
  const resp = countrie.medals.medals;
  const noc = Object.keys(resp)[0];
  const countryName = getCountryData(noc);

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
  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center h-screen ">
          <LoaderCircle strokeWidth={1.25} size={64} className="animate-spin" />
        </div>
      ) : (
        <div className="container py-8  ">
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
                  <p className="text-xl text-zinc-400">Nombre de participation</p>
                </div>
                <div className="w-1/4 px-2">
                  <p className="text-xl text-zinc-400">
                    Meilleure <br /> année
                  </p>
                </div>
                <div className="w-1/4 px-2">
                  <p className="text-xl text-zinc-400">
                    Meilleur <br /> Athlete
                  </p>
                </div>
                <div className="w-1/4 px-2">
                  <p className="text-xl text-zinc-400">
                    Meilleur <br /> Discipline
                  </p>
                </div>
              </div>
              <div className="w-full flex">
                <div className="w-1/4 px-2">
                  <p className="text-lg p-2">{resp[noc].length}</p>
                </div>
                <div className="w-1/4 px-2">
                  <p className="text-lg p-2">2012</p>
                </div>
                <div className="w-1/4 px-2">
                  <p className="text-lg p-2">Antoine Azevedo da silva</p>
                </div>
                <div className="w-1/4 px-2">
                  <p className="text-lg p-2">Judo</p>
                </div>
              </div>
            </div>
            <div className="w-full border-b my-8"></div>
            <div className="flex flex-col  p-4">
              <div className="w-full flex">
                <div className="w-1/4 text-center flex flex-col">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="text-2xl text-zinc-400 ">
                        Gold 🥇
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Golden medals</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="w-1/4 text-center flex flex-col">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="text-2xl text-zinc-400">
                        Silver 🥈
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Silver medals</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="w-1/4 text-center flex flex-col">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="text-2xl text-zinc-400">
                        Bronze 🥉
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Bronze medals</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="w-1/4 text-center flex flex-col">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="text-2xl text-zinc-400">
                        Total
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Total of medals</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
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
          </div>
        </div>
      )}
    </>
  );
}
