import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_mainapp/community')({
  component: () => <div>Hello /_mainapp/community!</div>,
});
