import Head from 'next/head';
import Link from 'next/link';
import React from 'react';
import { useAuth } from '../../context/authContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, logout } = useAuth();

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200'>
      <Head>
        <title>Geo bench</title>
        <link
          rel='icon'
          href='https://sharmese.dev/logo192.png'
          type='image/png'
        />
        <link
          rel='apple-touch-icon'
          href='https://sharmese.dev/logo192.png'
          sizes='192x192'
        />
        <meta
          name='description'
          content='Find and share your favorite benches around the world.'
        />
        {/* Open Graph / Facebook */}
        <meta property='og:type' content='website' />
        <meta property='og:url' content='https://sharmese.dev/' />
        <meta property='og:title' content='Geo bench' />
        <meta
          property='og:description'
          content='Find and share your favorite benches around the world.'
        />
        <meta property='og:image' content='https://sharmese.dev/logo192.png' />
        {/* Twitter */}
        <meta property='twitter:card' content='summary_large_image' />
        <meta property='twitter:url' content='https://sharmese.dev/' />
        <meta property='twitter:title' content='Geo bench' />
        <meta
          property='twitter:description'
          content='Find and share your favorite benches around the world.'
        />
        <meta
          property='twitter:image'
          content='https://sharmese.dev/logo192.png'
        />
      </Head>

      <header className='bg-white dark:bg-gray-800 shadow-sm'>
        <nav className='container mx-auto px-6 py-4 flex justify-between items-center'>
          <Link
            href='/'
            className='flex items-center gap-3 text-2xl font-bold text-gray-800 dark:text-white hover:text-gray-700 dark:hover:text-gray-300 transition-colors'
          >
            <img
              src='/logo192.png'
              alt='Geo Bench Logo'
              className='h-8 w-8 rounded-full'
            />
            <span>Geo Bench</span>
          </Link>
          <div className='flex items-center gap-4'>
            {!isAuthenticated ? (
              <>
                <Link
                  href='/login'
                  className='px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700'
                >
                  Login
                </Link>
                <Link
                  href='/register'
                  className='px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md shadow-sm hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600'
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <Link
                  href='/profile'
                  className='px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md shadow-sm hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600'
                >
                  Profile
                </Link>
                <button
                  onClick={logout}
                  className='px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md shadow-sm hover:bg-red-700'
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </nav>
      </header>

      <main className='container mx-auto p-6'>{children}</main>
    </div>
  );
}
