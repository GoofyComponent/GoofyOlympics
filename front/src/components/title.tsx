import { ReactNode } from 'react';

import { cn } from '@/lib/utils';

export const MainTitle = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return <h2 className={cn('font-bold text-2xl', className)}>{children}</h2>;
};

export const SubTitle = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return <h3 className={cn('font-bold text-lg', className)}>{children}</h3>;
};
