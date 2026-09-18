import React from 'react';
import { GeneratePage } from './GeneratePage';

interface ResultPageProps {
  packageId?: string;
}

export const ResultPage: React.FC<ResultPageProps> = ({ packageId }) => {
  return <GeneratePage packageId={packageId} />;
};
