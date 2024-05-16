import {
  createFileRoute,
  redirect,
  useRouter,
  useRouterState,
} from '@tanstack/react-router';
import { z } from 'zod';

import { useAuth } from '@/hook/useAuth';

const fallback = '/dashboard' as const;

export const Route = createFileRoute('/login')({
  validateSearch: z.object({
    redirect: z.string().optional().catch(''),
  }),
  beforeLoad: ({ context, search }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({ to: search.redirect || fallback });
    }
  },
  component: LoginComponent,
});

function LoginComponent() {
  const auth = useAuth();
  const router = useRouter();
  const isLoading = useRouterState({ select: (s) => s.isLoading });
  const navigate = Route.useNavigate();

  const search = Route.useSearch();

  const onFormSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    const data = new FormData(evt.currentTarget);
    const usernameValue = data.get('username');
    const passwordValue = data.get('password');

    if (!usernameValue || !passwordValue) return;

    const username = usernameValue.toString();
    const password = passwordValue.toString();

    auth.login(username, password);

    router.invalidate().finally(() => {
      navigate({ to: search.redirect || fallback });
    });
  };

  return (
    <div className="grid gap-2 p-2 place-items-center">
      <h3 className="text-xl">Login page</h3>
      {search.redirect ? (
        <p className="text-red-500">You need to login to access this page.</p>
      ) : (
        <p>Login to see all the cool content in here.</p>
      )}
      <form className="max-w-lg mt-4" onSubmit={onFormSubmit}>
        <fieldset disabled={isLoading} className="grid w-full gap-2">
          <div className="grid gap-2 items-center min-w-[300px]">
            <label htmlFor="username-input" className="text-sm font-medium">
              Username
            </label>
            <input
              id="username-input"
              name="username"
              placeholder="Enter your name"
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
            <input
              id="password-input"
              name="password"
              placeholder="Enter your password"
              type="password"
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-500 rounded-md"
          >
            {isLoading ? 'Loading...' : 'Login'}
          </button>
        </fieldset>
      </form>
    </div>
  );
}
