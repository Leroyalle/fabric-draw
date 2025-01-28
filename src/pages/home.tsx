import React from 'react';
import { CanvasField } from '../components';

interface Props {
  className?: string;
}

export const Home: React.FC<Props> = ({ className }) => {
  return (
    <main className={className}>
      <CanvasField />
    </main>
  );
};
