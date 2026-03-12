import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import PageHelmet from '@/common/PageHelmet';
import Logo from '@/assets/images/logo.png';
import { setAccessToken, setDomain } from '@/lib/auth';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Temporary: bypass auth and go straight to dashboard
    setAccessToken('dev-token');
    setDomain('dev-tenant');
    navigate('/home');
  };

  return (
    <div>
      <PageHelmet
        title="Login - RetailStack Metrics Dashboard"
        description="Log in to the RetailStack Metrics Dashboard"
      />
      <div className="flex flex-col items-center justify-center">
        <img loading="lazy" src={Logo} alt="Logo" className="mb-6 size-24" />
        <h1 className="mb-4 text-3xl font-semibold">Log in to your account</h1>
        <h2 className="mb-6 text-center text-base font-normal text-text-secondary">
          Welcome back! Please enter your details.
        </h2>
        <Card className="w-full max-w-md rounded-2xl p-8 shadow-md">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-1 block text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full">
              Sign in
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
