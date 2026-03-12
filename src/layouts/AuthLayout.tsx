import { Outlet } from 'react-router-dom';
import BGpattern from '@/assets/images/bg-pattern.png';

export const AuthLayout = () => {
  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-bg-primary max-lg:p-10">
      <div className="w-full max-w-lg">
        <div className="absolute -top-4 left-1/2 w-[70rem] -translate-x-1/2">
          <img loading="lazy" src={BGpattern} alt="Background Pattern" className="w-full" />
        </div>
        <div className="relative z-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
