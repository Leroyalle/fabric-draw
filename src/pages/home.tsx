import React from 'react';
import { CanvasField } from '../components';

interface Props {
  className?: string;
}

export const Home: React.FC<Props> = ({ className }) => {
  return (
    <main className={className}>
      <h1>Создай свою карту</h1>
      <CanvasField />
    </main>
  );
};
