'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/hooks/useTheme';

export default function AuthErrorPage() {
  const router = useRouter();
  useTheme();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/auth');
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className='bg-base-200/50 text-base-content hero h-screen items-center justify-center'>
      <div className='hero-content text-neutral-content text-center'>
        <div className='max-w-md'>
          <h1 className='mb-5 text-5xl font-bold'>Authentication Error</h1>
          <p className='mb-5'>
            Something went wrong during the authentication process. Please try again.
          </p>
          <p className='mb-5'>You will be redirected to the login page shortly...</p>
          <button className='btn btn-primary rounded-xl' onClick={() => router.push('/auth')}>
            Go to Login
          </button>
        </div>
      </div>
    </div>
  );
}