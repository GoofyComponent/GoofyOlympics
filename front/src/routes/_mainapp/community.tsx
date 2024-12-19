import { createFileRoute } from '@tanstack/react-router';

import { Pollspage } from '@/pages/Polls';

export const Route = createFileRoute('/_mainapp/community')({
  component: () => <Pollspage />,
});
