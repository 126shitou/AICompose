'use client';

import { useState, useEffect } from 'react';
import { signIn, getSession, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Icons } from '@/components/ui/icons';
import { cn } from '@/lib/utils';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  AlertCircle,
  CheckCircle,
  Sparkles,
  Zap
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const callbackUrl = searchParams?.get('callbackUrl') || '/';
  const errorParam = searchParams?.get('error');

  useEffect(() => {
    if (status === 'authenticated') {
      router.push(callbackUrl);
    }
  }, [status, router, callbackUrl]);

  useEffect(() => {
    if (errorParam) {
      switch (errorParam) {
        case 'CredentialsSignin':
          setError('Invalid email or password');
          break;
        case 'OAuthAccountNotLinked':
          setError('Account already exists with different provider');
          break;
        default:
          setError('An error occurred during sign in');
      }
    }
  }, [errorParam]);

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else if (result?.ok) {
        setSuccess('Login successful! Redirecting...');
        setTimeout(() => {
          router.push(callbackUrl);
        }, 1000);
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await signIn('google', {
        callbackUrl,
      });
    } catch (error) {
      setError('Google login failed');
      setIsLoading(false);
    }
  };

  const handleGitHubLogin = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await signIn('github', {
        callbackUrl,
      });
    } catch (error) {
      setError('GitHub login failed');
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setError(null);
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Sign in to your AI Compose account
          </p>
        </div>

        <Card className="p-6 shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          {/* Error/Success Messages */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
              <span className="text-sm text-red-600 dark:text-red-400">{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
              <span className="text-sm text-green-600 dark:text-green-400">{success}</span>
            </div>
          )}




          {/* Credentials Form */}
          <form onSubmit={handleCredentialsLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="pl-10 h-11 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                  placeholder="Enter your email"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="pl-10 pr-10 h-11 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading || !formData.email || !formData.password}
              className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Signing In...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <Zap className="h-4 w-4 mr-2" />
                  Sign In
                </div>
              )}
            </Button>
          </form>



          {/* Divider */}
          <div className="relative mt-4 mb-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200 dark:border-gray-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-gray-800 px-2 text-gray-500 dark:text-gray-400">
                Or continue with
              </span>
            </div>
          </div>


          {/* Google Login */}
          <Button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            variant="outline"
            className="w-full mb-4 h-11 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <Icons.google className="h-5 w-5 mr-2" />
            Continue with Google
          </Button>

          {/* GitHub Login */}
          <Button
            onClick={handleGitHubLogin}
            disabled={isLoading}
            variant="outline"
            className="w-full mb-4 h-11 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <Icons.github className="h-5 w-5 mr-2" />
            Continue with GitHub
          </Button>



          {/* Additional Links */}
          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <span className="text-blue-600 dark:text-blue-400 font-medium cursor-not-allowed">
                Contact admin for access
              </span>
            </p>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                By signing in, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
        </Card>

        {/* Footer Features */}
        <div className="mt-8 text-center">
          <div className="grid grid-cols-3 gap-4 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mb-1">
                <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <span>AI Generation</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mb-1">
                <Zap className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <span>Fast & Secure</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mb-1">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <span>Trusted</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 