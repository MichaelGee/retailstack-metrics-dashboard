import { Wifi, WifiOff } from 'lucide-react';
import { useEffect, useState } from 'react';

export const NetworkDetector = () => {
  const [isConnected, setIsConnected] = useState(navigator.onLine);
  const [showStatus, setShowStatus] = useState(null);

  const animationClass = showStatus ? 'animate-slideIn' : 'animate-slideOut';
  const statusClass = isConnected ? 'bg-success-600 text-white' : 'bg-error-600 text-white';

  const handleConnectionChange = () => {
    const condition = navigator.onLine;
    setIsConnected(condition);
    setShowStatus(true);

    if (condition) {
      setTimeout(() => {
        setShowStatus(null);
      }, 3000);
    }
  };

  useEffect(() => {
    window.addEventListener('online', handleConnectionChange);
    window.addEventListener('offline', handleConnectionChange);

    return () => {
      window.removeEventListener('online', handleConnectionChange);
      window.removeEventListener('offline', handleConnectionChange);
    };
  }, []);

  return (
    showStatus !== null && (
      <div
        className={`${statusClass} ${animationClass} fixed left-0 top-0 z-50 flex h-16 w-full items-center justify-center`}
      >
        <p className=" flex gap-2 text-base font-medium uppercase">
          {isConnected ? <Wifi /> : <WifiOff />}
          {isConnected ? 'Network connection restored!' : 'You are offline'}
        </p>
      </div>
    )
  );
};
