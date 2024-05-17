import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_mainapp/countries')({
  component: () => <div>Hello /_mainapp/countries!</div>,
});
