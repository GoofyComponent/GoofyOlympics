import { createFileRoute } from '@tanstack/react-router';

import App from '@/pages/App';

export const Route = createFileRoute('/app')({
  component: () => <App />,
});
