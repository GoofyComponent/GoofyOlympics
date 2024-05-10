import {
  createRootRouteWithContext,
  Link,
  Outlet,
  useRouter,
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

import { AuthContext } from '@/context/AuthContext';
import { useAuth } from '@/hook/useAuth';

export interface MyRouterContext {
  auth: AuthContext;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: function Component() {
    const auth = useAuth();
    const router = useRouter();
    const navigate = Route.useNavigate();

    const handleLogout = () => {
      if (window.confirm('Are you sure you want to logout?')) {
        auth.logout();
        router.invalidate().finally(() => {
          navigate({ to: '/' });
        });
      }
    };
    return (
      <>
        <div className="flex gap-2 p-2">
          <Link to="/" className="[&.active]:font-bold">
            Home
          </Link>
          <Link to="/app" className="[&.active]:font-bold">
            About
          </Link>
          <Link to="/athletes" className="[&.active]:font-bold">
            Athlestes
          </Link>
          <Link to="/analyze" className="[&.active]:font-bold">
            Analyze
          </Link>
          {auth.isAuthenticated && (
            <li style={{ float: 'right' }}>
              <button onClick={handleLogout}>Logout</button>
            </li>
          )}
        </div>
        <hr />
        <hr />
        <Outlet />
        <TanStackRouterDevtools position="bottom-right" initialIsOpen={false} />
      </>
    );
  },
});
