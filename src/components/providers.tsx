import React, { ReactNode } from 'react';
import { Provider } from './ui/provider';

interface Props {
  children: ReactNode;
}

export const Providers: React.FC<Props> = ({ children }) => {
  return <Provider>{children}</Provider>;
};
