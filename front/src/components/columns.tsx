import { ColumnDef } from '@tanstack/react-table';

export type Athletes = {
  id: number;
  name: string;
  noc: string;
  sport: string;
};

export const columns: ColumnDef<Athletes>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'sport',
    header: 'Sport',
  },

  {
    accessorKey: 'event',
    header: 'Event',
  },
  {
    accessorKey: 'medal',
    header: 'Medal',
  },
  {
    accessorKey: 'team',
    header: 'Team',
  },
];
