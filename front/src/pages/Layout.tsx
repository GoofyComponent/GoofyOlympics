import { Link, Outlet } from '@tanstack/react-router';
import { User } from 'lucide-react';

import olympics_logo from '@/assets/goofyolympics_logo.svg';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAuthStore } from '@/store';

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
  const isLogged = useAuthStore((state) => state.isLogged);

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
          <Link
            to="/community"
            className="[&.active]:text-black text-black/60 my-auto hover:text-black/75 transition-all"
          >
            Community polls
          </Link>
        </div>
      </div>
      {!isLogged && (
        <div className="my-auto mr-4 hidden sm:block">
          <Button variant={'outline'} asChild>
            <Link to="/login">
              <User size={18} className="mr-2" />
              <p>LOGIN</p>
            </Link>
          </Button>
        </div>
      )}

      {/* TODO A remplacer par un moyen de se déco & ajouter la persist a zustand */}
      {/*       {isLogged && (
        <div className="my-auto mr-4 hidden sm:block">
          <Button variant={'outline'} asChild>
            <Link to="/register">
              <User size={18} className="mr-2" />
              <p>REGISTER</p>
            </Link>
          </Button>
        </div>
      )} */}
    </header>
  );
};
