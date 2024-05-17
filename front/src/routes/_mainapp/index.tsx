import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_mainapp/')({
  component: () => <div>Hello /_index/test!</div>,
});
