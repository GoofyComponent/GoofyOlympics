import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_mainapp/athletes')({
  component: () => <div>Hello /_mainapp/athletes!</div>,
});
