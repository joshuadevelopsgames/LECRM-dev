import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import toast, { Toaster } from 'react-hot-toast';
import { createPageUrl } from '../utils';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // For now, just simulate login - replace with actual auth logic
      // In a real app, you'd call: await base44.auth.login(email, password);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Store auth state (in a real app, this would be handled by base44)
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userEmail', email);
      
      toast.success('Successfully logged in!');
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      toast.error('Login failed. Please check your credentials.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-center" />
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <Link 
            to={createPageUrl('Dashboard')}
            className="inline-block hover:opacity-80 transition-opacity"
          >
            <div className="inline-flex items-center justify-center mb-4">
              <img 
                src="/logo.png" 
                alt="LECM Logo" 
                className="h-16 w-auto"
                onError={(e) => {
                  console.error('Logo failed to load');
                  e.target.style.display = 'none';
                }}
              />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2 cursor-pointer">LECRM</h1>
          </Link>
          <p className="text-slate-600">Sign in to your account</p>
        </div>

        {/* Login Card */}
        <Card>
          <CardHeader>
            <CardTitle>Welcome back</CardTitle>
            <CardDescription>
              Enter your email and password to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>

            {/* Demo credentials hint */}
            <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <p className="text-xs text-slate-600 text-center">
                <strong>Demo Mode:</strong> Any email and password will work for testing
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
    </>
  );
}

