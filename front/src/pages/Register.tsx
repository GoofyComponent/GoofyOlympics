import { Link, useLoaderData, useNavigate } from '@tanstack/react-router';
import { MoveLeft } from 'lucide-react';
import { useEffect, useState } from 'react';

import olympics_2024 from '@/assets/2024Print.jpg';
import olympics_logo from '@/assets/goofyolympics_logo.svg';
import { Combobox } from '@/components/combobox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/store';

export function Register() {
  const navigate = useNavigate();
  const { countries } = useLoaderData({
    from: '/register',
  });

  const isLogged = useAuthStore((state) => state.isLogged);

  const [countrySelected, setCountrySelected] = useState('');

  console.log('Countries:', countries);

  const submitRegister = (email: string, password: string, region: string) => {
    fetch('https://api-olympics.stroyco.eu/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        region,
      }),
    }).then((response) => {
      if (response.ok) {
        console.log('Registration successful');
        return navigate({
          to: '/login',
        });
      } else {
        console.error('Registration failed');
      }
    });
  };

  useEffect(() => {
    document.title = 'Register | GoofyOlympics';
    console.log('isLogged:', isLogged);

    if (isLogged) {
      navigate({
        to: '/',
      });
    }
  }, [navigate, isLogged]);

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <img
              src={olympics_logo}
              className="h-32 w-auto flex justify-center mx-auto"
              title="GoofyOlympics Logo"
            />
            <h1 className="text-3xl font-bold">Register</h1>
            <p className="text-balance text-muted-foreground">
              Please fill out the form below to create an account
            </p>
          </div>
          <form
            className="grid gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              const target = e.target as typeof e.target & {
                email: { value: string };
                password: { value: string };
                'password-confirm': { value: string };
              };
              console.log('Registering...');
              console.log('Country:', countrySelected);
              console.log('Email:', target.email.value);

              if (!target.email.value.includes('@')) {
                console.error('Password too short');
                return;
              }

              if (target.password.value !== target['password-confirm'].value) {
                console.error('Passwords do not match');
                return;
              }

              submitRegister(target.email.value, target.password.value, countrySelected);
            }}
          >
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="m@example.com" required />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input id="password" type="password" required />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password-confirm">Please confirm your password</Label>
              </div>
              <Input id="password-confirm" type="password" required />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="country">Country</Label>
              </div>
              <Combobox
                list={countries}
                contextPhrase="No countries found"
                selectFunction={setCountrySelected}
              />
            </div>

            <Button type="submit" className="w-full">
              Register
            </Button>
          </form>

          <div className="flex hover:cursor-pointer hover:opacity-55 transition-all">
            <MoveLeft />
            <Link className="ml-2" to="/">
              Go back
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block overflow-hidden h-screen">
        <img src={olympics_2024} className=" max-w-fit" title="JO 2024" />
      </div>
    </div>
  );
}
