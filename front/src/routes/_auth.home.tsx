import { createFileRoute } from '@tanstack/react-router';

import { useAuth } from '@/hook/useAuth';

export const Route = createFileRoute('/_auth/home')({
  component: DashboardPage,
});

function DashboardPage() {
  const auth = useAuth();

  return (
    <section className="grid gap-2 p-2">
      <p>Hi {auth.user?.username}!</p>
      <p>You are currently on the dashboard route.</p>
    </section>
  );
}
