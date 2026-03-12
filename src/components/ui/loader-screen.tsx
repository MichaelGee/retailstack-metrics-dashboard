import React from 'react';

interface LoaderScreenProps {
  logo?: string;
  alt?: string;
}

const LoaderScreen: React.FC<LoaderScreenProps> = ({ logo, alt = 'Loading' }) => {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-bg-primary">
      {logo ? (
        <img src={logo} alt={alt} className="size-20 animate-pulse" />
      ) : (
        <div className="size-20 animate-pulse rounded-full bg-bg-brand-secondary" />
      )}
    </div>
  );
};

export default LoaderScreen;
