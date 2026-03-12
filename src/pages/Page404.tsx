import { FileQuestion } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import PageHelmet from '@/common/PageHelmet';

const Page404 = () => {
  const navigate = useNavigate();

  return (
    <>
      <PageHelmet
        title="Page Not Found - Retailstack"
        description="The page you are looking for does not exist."
      />
      <div className="flex min-h-svh flex-col items-center justify-center bg-bg-primary px-6">
        <div className="flex flex-col items-center space-y-1">
          <div className="flex size-14 items-center justify-center rounded-xl border border-border-primary bg-bg-primary shadow-sm">
            <FileQuestion className="size-6 text-text-tertiary" />
          </div>
          <p className="!mt-4 text-4xl font-bold text-text-tertiary">404</p>
          <h1 className="!mt-2 text-lg font-bold text-text-primary">Page not found</h1>
          <p className="!mt-2 max-w-sm text-center text-sm text-text-tertiary">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="!mt-8 flex items-center gap-3">
            <Button variant="secondaryGray" onClick={() => navigate(-1)}>
              Go back
            </Button>
            <Button onClick={() => navigate('/')}>Go to dashboard</Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page404;
