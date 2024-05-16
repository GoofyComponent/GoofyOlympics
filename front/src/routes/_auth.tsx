import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

// src/routes/_authenticated.tsx
export const Route = createFileRoute('/_auth')({
  beforeLoad: async ({ context, location }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: AuthLayout,
});

function AuthLayout() {
  return (
    <div className="h-full p-2">
      <Outlet />
    </div>
  );
}
