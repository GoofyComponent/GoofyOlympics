import { Link } from '@tanstack/react-router';
import { MoveLeft } from 'lucide-react';

import olympics_2024 from '@/assets/2024Print.jpg';
import olympics_logo from '@/assets/goofyolympics_logo.svg';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export function Login() {
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
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-balance text-muted-foreground">
              Enter your email below to login to your account
            </p>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="m@example.com" required />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                {/* <Link
                  href="/forgot-password"
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </Link> */}
              </div>
              <Input id="password" type="password" required />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </div>
          <TooltipProvider delayDuration={5}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="mt-4 text-center text-sm opacity-50 cursor-not-allowed">
                  Don&apos;t have an account?{' '}
                  <Link href="#" className="underline" disabled>
                    Sign up
                  </Link>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Registration is currently disabled</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
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
