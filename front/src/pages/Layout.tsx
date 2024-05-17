import { Link, Outlet } from '@tanstack/react-router';
import { User } from 'lucide-react';

import olympics_logo from '@/assets/goofyolympics_logo.svg';
import paris_logo from '@/assets/logoparis2024.svg';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export const Layout = () => {
  return (
    <>
      <Header />
      <Separator className="mb-4" />
      <main className="p-4">
        <Outlet />
      </main>
    </>
  );
};

const Header = () => {
  return (
    <header className="flex justify-between h-20 w-full">
      <div className="flex justify-start">
        <div className="flex w-max md:w-auto">
          <img src={olympics_logo} title="GoofyOlympics Logo" />
          <h1 className="hidden md:block font-extrabold my-auto text-2xl">
            GoofyOlympics
          </h1>
        </div>
        <div className="my-auto flex justify-start space-x-4 ml-6">
          <Link
            to="/"
            className="[&.active]:text-black text-black/60 my-auto hover:text-black/75 transition-all"
          >
            Summary
          </Link>
          <Link
            to="/athletes"
            className="[&.active]:text-black text-black/60 my-auto hover:text-black/75 transition-all"
          >
            Athletes
          </Link>
          <Link
            to="/countries"
            className="[&.active]:text-black text-black/60 my-auto hover:text-black/75 transition-all"
          >
            Countries
          </Link>
          <TooltipProvider delayDuration={1}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to="/2024"
                  className="[&.active]:text-black text-black/60 my-auto hover:opacity-75 transition-all"
                >
                  <img src={paris_logo} title="PARIS 2024" className="w-10 mx-auto" />
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>PARIS 2024 Page</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      {/* TODO: Solution temporaire - changer par un burger */}
      <div className="my-auto mr-4 hidden sm:block">
        <Button variant={'outline'} asChild>
          <Link to="/login">
            <User size={18} className="mr-2" />
            <p>LOGIN</p>
          </Link>
        </Button>
      </div>
    </header>
  );
};
